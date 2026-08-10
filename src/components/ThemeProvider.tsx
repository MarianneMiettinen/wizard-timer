/**
 * Makes the active theme available two ways:
 *   - as a React context, for values components read directly (copy, numbers)
 *   - as CSS custom properties, for values the stylesheet needs (colours, fonts)
 *
 * The CSS custom properties are the important half. They are why app.css can be
 * written without a single literal colour in it: every rule refers to a
 * `--wt-*` variable, and the values arrive from theme.config.ts at runtime.
 *
 * This file maps keys to variable names. It contains no theme values itself,
 * and adding a theme should never require editing it.
 */

import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from 'react';
import type { Theme } from '../themes/theme.types';

const ThemeContext = createContext<Theme | null>(null);

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (theme === null) {
    throw new Error('useTheme() must be called inside a <ThemeProvider>.');
  }
  return theme;
}

function toCssVariables(theme: Theme): CSSProperties {
  const { colors, fonts, assets, candle, stage } = theme;

  // Cast: React's CSSProperties doesn't model custom properties, but the DOM
  // accepts them and this is the standard way to set them from a style object.
  return {
    '--wt-color-background': colors.background,
    '--wt-color-background-scrim': colors.backgroundScrim,
    '--wt-color-surface': colors.surface,
    '--wt-color-surface-border': colors.surfaceBorder,
    '--wt-color-text': colors.text,
    '--wt-color-text-muted': colors.textMuted,
    '--wt-color-accent': colors.accent,
    '--wt-color-on-accent': colors.onAccent,
    '--wt-color-focus-ring': colors.focusRing,
    '--wt-color-candle-glow': colors.candleGlow,

    '--wt-font-display': fonts.display,
    '--wt-font-body': fonts.body,

    '--wt-image-background': `url("${assets.background}")`,
    '--wt-image-candle-wax': `url("${assets.candleWax}")`,

    '--wt-candle-height': `${candle.heightPx}px`,
    '--wt-candle-width': `${candle.widthPx}px`,
    '--wt-candle-flame-height': `${candle.flameHeightPx}px`,

    '--wt-character-height': `${stage.characterHeightPx}px`,
  } as CSSProperties;
}

interface ThemeProviderProps {
  theme: Theme;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const style = useMemo(() => toCssVariables(theme), [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <div className="wt-root" style={style} data-theme={theme.id}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
