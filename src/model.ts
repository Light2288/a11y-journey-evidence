/** Private evidence records; only Journey/JourneyOptions are public API. */
export interface Issue { code: string; message: string }
export interface FocusDescriptor { ref: string; tag: string; attributes: Record<string, string> }
export interface Observation { seq: number; kind: 'key' | 'focus' | 'removed'; key?: string; target: FocusDescriptor | null }
export interface ObservationCapture { observations: Observation[]; complete: boolean; truncated: boolean; issues: Issue[] }
export interface ObservationSession { finish(): Promise<ObservationCapture> }
import type { Locator, TestInfo } from '@playwright/test';
export interface JourneyOptions { root: Locator; screenshots?: boolean; ariaSnapshots?: boolean; maxObservations?: number }
export interface Journey { start(options: JourneyOptions): Promise<void> }
export interface ArtifactOutcome { status: 'captured' | 'empty' | 'disabled' | 'not-needed' | 'unavailable'; path?: string; reason?: string; startedAt?: string; finishedAt?: string }
export interface Artifacts { screenshot: ArtifactOutcome; ariaSnapshot: ArtifactOutcome }
export interface FixtureEvidence {
  version: 1; started: boolean; captureStatus: TestInfo['status']; capturePhase: 'fixture-teardown';
  observation: ObservationCapture; artifacts: Artifacts; issues: Issue[];
  runtime: { node: string; playwright: string; chromium: string; platform: string; arch: string };
}
