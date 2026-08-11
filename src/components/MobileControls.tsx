/**
 * The controls, as a real bar, for phones.
 *
 * The painted buttons are sized for a 1402px-wide picture. On a 375px screen
 * that same artwork puts their labels at roughly six pixels tall and their
 * targets under the 44px minimum — unusable, however carefully positioned.
 *
 * So on narrow screens the in-artwork buttons are hidden by CSS and this bar
 * takes over: laid across the bottom of the picture, sized in rem rather than
 * in fractions of the image, and covering the painted controls it replaces.
 * The desktop layout is untouched — this element simply isn't displayed there.
 */

import type { ReactNode } from 'react';

interface MobileAction {
  key: string;
  label: string;
  accessibleLabel?: string;
  icon: ReactNode;
  onClick(): void;
  primary?: boolean;
  dimmed?: boolean;
  expanded?: boolean;
}

interface MobileControlsProps {
  actions: MobileAction[];
}

export function MobileControls({ actions }: MobileControlsProps) {
  return (
    <div className="wt-mobilebar">
      {actions.map((action) => (
        <button
          key={action.key}
          type="button"
          className={
            action.primary
              ? 'wt-mobilebar__button wt-mobilebar__button--primary'
              : action.dimmed
                ? 'wt-mobilebar__button wt-mobilebar__button--dimmed'
                : 'wt-mobilebar__button'
          }
          onClick={action.onClick}
          aria-label={action.accessibleLabel}
          aria-expanded={action.expanded}
        >
          <span className="wt-mobilebar__icon">{action.icon}</span>
          <span className="wt-mobilebar__label">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
