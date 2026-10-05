export type TransitionMeta = {
  type: 'iris' | 'varredura' | 'grade' | 'none';
  duration?: number;
};

export const TRANSITION_META: Record<string, TransitionMeta> = {
  default: { type: 'iris', duration: 0.7 },
  fast: { type: 'grade', duration: 0.4 },
};
