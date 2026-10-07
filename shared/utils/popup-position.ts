interface AnchorRect {
  top: number;
  bottom: number;
  centerX: number;
}

interface PopupSize {
  width: number;
  height: number;
}

const VIEWPORT_MARGIN = 8;
const SELECTION_GAP = 12;

/**
 * Centers a fixed-position popup over an anchor rect, flipping it below the anchor
 * when there isn't enough room above, and clamping it inside the viewport.
 */
export const getClampedPopupPosition = (anchor: AnchorRect, size: PopupSize) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const maxLeft = Math.max(viewportWidth - size.width - VIEWPORT_MARGIN, VIEWPORT_MARGIN);
  const left = Math.min(Math.max(anchor.centerX - size.width / 2, VIEWPORT_MARGIN), maxLeft);

  const spaceAbove = anchor.top - SELECTION_GAP - size.height;
  const top = spaceAbove >= VIEWPORT_MARGIN ? spaceAbove : anchor.bottom + SELECTION_GAP;

  const maxTop = Math.max(viewportHeight - size.height - VIEWPORT_MARGIN, VIEWPORT_MARGIN);

  return {
    left,
    top: Math.min(Math.max(top, VIEWPORT_MARGIN), maxTop),
  };
};

interface AnchoredStyle {
  left?: string;
  top?: string;
  visibility: 'visible' | 'hidden';
}

/**
 * Turns a measured position (or null, before it's been measured) into inline style props.
 * `visibility: hidden` avoids a one-frame flash at the default (0,0) position on first render.
 */
export const toAnchoredStyle = (position: { left: number; top: number } | null): AnchoredStyle => {
  if (!position) {
    return { visibility: 'hidden' };
  }

  return {
    left: `${position.left}px`,
    top: `${position.top}px`,
    visibility: 'visible',
  };
};
