/** Fanned center stack before cards explode to arc positions. */
export const STACK_IMG_ROTATIONS = [7.5, -2.5, -10, 12.5, -5, 5, -8, 4] as const;

export const STACK_OFFSETS = [
  { x: 0, y: 0 },
  { x: -16, y: -12 },
  { x: 20, y: 10 },
  { x: -12, y: 18 },
  { x: 14, y: -8 },
  { x: -10, y: 14 },
  { x: 8, y: -6 },
  { x: -6, y: 8 },
] as const;

export const STACK_CLIP_CLOSED = 'polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)';
export const STACK_CLIP_OPEN = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

export function heroStackLayout(index: number) {
  const offset = STACK_OFFSETS[index % STACK_OFFSETS.length] ?? { x: 0, y: 0 };
  const rotation = STACK_IMG_ROTATIONS[index % STACK_IMG_ROTATIONS.length] ?? 0;
  const stackScale = 1 - index * 0.03;
  const stackOffsetY = -(index * 15) + offset.y;

  return {
    rotation,
    offsetX: offset.x,
    stackOffsetY,
    stackScale,
  };
}

/** Intro timeline (seconds from mount). */
export const STACK_REVEAL_DELAY = 0.35;
export const CARD_REVEAL_STAGGER = 0.12;
export const CARD_REVEAL_DURATION = 0.65;

export const NAME_REVEAL_DELAY = 0.2;
export const NAME_REVEAL_STAGGER = 0.05;
export const NAME_REVEAL_DURATION = 0.7;
export const NAME_REVEAL_EASE = 'power2.out';
export const NAME_EXIT_EASE = 'power2.inOut';

export const COUNTER_DELAY = 0.35;
export const COUNTER_DURATION = 1.2;

export const HOLD_AFTER_INTRO = 0.45;

export const BODY_DELAY_AFTER_EXPLODE = 0.85;

export const EXPLODE_STAGGER = 0.03;

export function heroExplodeAtMs(cardCount: number): number {
  if (cardCount <= 0) return 2800;

  const cardsDone =
    STACK_REVEAL_DELAY + (cardCount - 1) * CARD_REVEAL_STAGGER + CARD_REVEAL_DURATION;
  const counterDone = NAME_REVEAL_DELAY + COUNTER_DELAY + COUNTER_DURATION;
  const nameDone = NAME_REVEAL_DELAY + NAME_REVEAL_DURATION;

  return (Math.max(cardsDone, counterDone, nameDone) + HOLD_AFTER_INTRO) * 1000;
}

export function heroEntranceCompleteMs(cardCount: number): number {
  return heroExplodeAtMs(cardCount) + 2200;
}
