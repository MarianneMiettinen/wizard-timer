/**
 * Makes the active theme available two ways:
 *   - as a React context, for values components read directly (copy, geometry)
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
const ThemeStyleContext = createContext<CSSProperties>({});

/**
 * The theme's CSS custom properties as a style object.
 *
 * Needed because a popped-out Picture-in-Picture window is a separate document:
 * the variables set on `.wt-root` here do not reach it, so the portalled tree
 * has to carry its own copy.
 */
export function useThemeStyle(): CSSProperties {
  return useContext(ThemeStyleContext);
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (theme === null) {
    throw new Error('useTheme() must be called inside a <ThemeProvider>.');
  }
  return theme;
}

function toCssVariables(theme: Theme): CSSProperties {
  const { colors, fonts, scene } = theme;

  // Cast: React's CSSProperties doesn't model custom properties, but the DOM
  // accepts them and this is the standard way to set them from a style object.
  return {
    '--wt-color-background': colors.background,
    '--wt-color-surface': colors.surface,
    '--wt-color-surface-border': colors.surfaceBorder,
    '--wt-color-text': colors.text,
    '--wt-color-text-muted': colors.textMuted,
    '--wt-color-accent': colors.accent,
    '--wt-color-on-accent': colors.onAccent,
    '--wt-color-focus-ring': colors.focusRing,
    '--wt-color-scene-mask': colors.sceneMask,
    '--wt-color-parchment': colors.parchment,
    '--wt-color-parchment-edge': colors.parchmentEdge,
    '--wt-color-parchment-ink': colors.parchmentInk,

    '--wt-font-display': fonts.display,
    '--wt-font-body': fonts.body,

    // Drives both the aspect-ratio box and the width formula that keeps the
    // whole picture on screen on short windows.
    '--wt-scene-ratio': String(scene.aspectWidth / scene.aspectHeight),
    '--wt-scene-aspect': `${scene.aspectWidth} / ${scene.aspectHeight}`,
    // Frame geometry is per-render, so <Scene> sets those variables instead.
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
      <ThemeStyleContext.Provider value={style}>
        <div className="wt-root" style={style} data-theme={theme.id}>
          {children}
        </div>
      </ThemeStyleContext.Provider>
    </ThemeContext.Provider>
  );
}
