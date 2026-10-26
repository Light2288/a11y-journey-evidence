/** Private evidence records; only Journey/JourneyOptions are public API. */
export interface Issue { code: string; message: string }
export interface FocusDescriptor { ref: string; tag: string; attributes: Record<string, string> }
export interface Observation { seq: number; kind: 'key' | 'focus' | 'removed'; key?: string; target: FocusDescriptor | null }
export interface ObservationCapture { observations: Observation[]; complete: boolean; truncated: boolean; issues: Issue[] }
export interface ObservationSession { finish(): Promise<ObservationCapture> }
