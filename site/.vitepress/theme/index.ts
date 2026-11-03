import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { onMounted, onUnmounted } from 'vue';

export default {
  extends: DefaultTheme,
  setup() {
    let observer: MutationObserver | undefined;
    let restoreTimer: ReturnType<typeof setTimeout> | undefined;
    let searchOpen = false;
    let openingURL = '';
    onMounted(() => {
      // VitePress 1.6.4 has an icon-only search label and loses focus on dismissal.
      // Keep its standard UI; repair only those two observed behaviors.
      observer = new MutationObserver(() => {
        const input = document.getElementById('localsearch-input');
        if (input) {
          if (!searchOpen) openingURL = location.href;
          searchOpen = true;
          const label = document.getElementById('localsearch-label');
          if (label && !label.querySelector('[data-search-label]')) {
            const text = document.createElement('span');
            text.className = 'visually-hidden';
            text.dataset.searchLabel = '';
            text.textContent = 'Search documentation';
            label.append(text);
          }
        } else if (searchOpen) {
          searchOpen = false;
          restoreTimer = setTimeout(() => {
            // Leave intentional navigation and focus on other controls alone.
            if (location.href === openingURL && document.activeElement === document.body && !document.getElementById('localsearch-input')) {
              document.querySelector<HTMLButtonElement>('.DocSearch-Button')?.focus();
            }
          }, 0);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
    onUnmounted(() => { observer?.disconnect(); clearTimeout(restoreTimer); });
  },
} satisfies Theme;
