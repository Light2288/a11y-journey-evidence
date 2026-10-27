export function installObserver(options: { binding: string; state: string; maxObservations: number }): void {
  const global = window as unknown as Record<string, any>;
  const documentRoot = document.documentElement;
  const refs = new WeakMap<Element, string>();
  const pending = new Set<Promise<void>>();
  const reported = new Set<string>();
  const attributes = ['id', 'name', 'type', 'role', 'tabindex', 'disabled', 'aria-label', 'aria-labelledby', 'aria-expanded', 'aria-hidden', 'aria-modal', 'aria-selected', 'aria-checked', 'aria-disabled', 'aria-pressed', 'aria-invalid', 'aria-describedby'];
  let nextRef = 0, sequence = 0, count = 0;
  let stopped = false, transportFailed = false;
  let lastFocus: Element | null = document.activeElement;
  const send = (value: unknown) => {
    const promise = Promise.resolve(global[options.binding](value)).then(() => {}).catch(() => { transportFailed = true; });
    pending.add(promise);
    void promise.then(() => pending.delete(promise));
  };
  const issue = (code: string, message: string) => {
    if (!reported.has(code)) { reported.add(code); send({ issue: { code, message } }); }
  };
  const describe = (element: Element | null) => {
    if (!element) return null;
    if (!refs.has(element)) refs.set(element, `e${++nextRef}`);
    const values: Record<string, string> = {};
    for (const name of attributes) {
      const value = element.getAttribute(name);
      if (value !== null) {
        values[name] = value.slice(0, 256);
        if (value.length > 256) issue('descriptor-truncated', 'Identifying attribute clipped at 256 characters.');
      }
    }
    return { ref: refs.get(element)!, tag: element.tagName.toLowerCase(), attributes: values };
  };
  const emit = (kind: 'key' | 'focus' | 'removed', target: Element | null, key?: string) => {
    if (stopped) return;
    if (count >= options.maxObservations) { issue('observation-truncated', 'Observation buffer reached its configured limit.'); return; }
    count++;
    send({ observation: { seq: ++sequence, kind, target: describe(target), ...(key ? { key } : {}) } });
  };
  const shadow = (event: Event) => {
    if (event.composedPath().some(item => item instanceof ShadowRoot)) issue('unsupported-shadow', 'A shadow-root event was observed; shadow traversal is unsupported.');
  };
  const keydown = (event: KeyboardEvent) => {
    shadow(event);
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    const target = event.target instanceof Element ? event.target : null;
    const editable = target?.closest('textarea, [contenteditable]:not([contenteditable="false"])') ||
      (target instanceof HTMLInputElement && !['button','submit','reset','checkbox','radio','range','color','file'].includes(target.type)) || document.designMode === 'on';
    let key: string | undefined;
    if (event.key === 'Tab') key = event.shiftKey ? 'Shift+Tab' : 'Tab';
    else if (['Enter', 'Escape'].includes(event.key)) key = event.key;
    else if (event.key === ' ' && !editable) key = 'Space';
    if (key) emit('key', target, key);
  };
  const sample = () => {
    if (document.documentElement !== documentRoot) issue('unsupported-document-replacement', 'Document root was replaced; listeners may no longer cover this document.');
    if (lastFocus && !lastFocus.isConnected) { emit('removed', lastFocus); lastFocus = null; }
    if (document.activeElement !== lastFocus) { lastFocus = document.activeElement; emit('focus', lastFocus); }
  };
  const focusin = (event: FocusEvent) => { shadow(event); sample(); };
  const focusout = () => queueMicrotask(sample);
  const mutations = new MutationObserver(sample);
  document.addEventListener('keydown', keydown, true);
  document.addEventListener('focusin', focusin, true);
  document.addEventListener('focusout', focusout, true);
  mutations.observe(document, { childList: true, subtree: true });
  emit('focus', lastFocus);
  global[options.state] = async () => {
    sample(); stopped = true;
    document.removeEventListener('keydown', keydown, true);
    document.removeEventListener('focusin', focusin, true);
    document.removeEventListener('focusout', focusout, true);
    mutations.disconnect();
    await Promise.all([...pending]);
    delete global[options.state];
    return { transportFailed };
  };
}
