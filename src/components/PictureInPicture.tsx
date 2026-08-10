/**
 * Pops the scene out into a small always-on-top window, so the candle stays
 * visible while you work in another tab or another app.
 *
 * Uses the Document Picture-in-Picture API, which is the only way a web page
 * can put real, interactive HTML above other windows. Chromium-only for now —
 * `isPictureInPictureSupported()` lets the caller hide the control entirely
 * rather than offer a button that does nothing.
 *
 * When closed it renders its children exactly where they sit. When open it
 * moves the *same* React tree into the other window through a portal, so the
 * timer keeps its state — nothing restarts, nothing is duplicated, and the
 * running session is unaffected either way.
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DocumentPictureInPictureApi {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
}

declare global {
  // eslint-disable-next-line no-var
  var documentPictureInPicture: DocumentPictureInPictureApi | undefined;
}

export function isPictureInPictureSupported(): boolean {
  return typeof globalThis.documentPictureInPicture !== 'undefined';
}

/**
 * Stylesheets do not follow content into the new window, so they are copied in.
 * Same-origin sheets are cloned rule by rule; anything that throws on access is
 * cross-origin and gets re-linked by URL instead.
 */
function copyStyles(target: Window): void {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const cssText = Array.from(sheet.cssRules)
        .map((rule) => rule.cssText)
        .join('\n');
      const style = target.document.createElement('style');
      style.textContent = cssText;
      target.document.head.appendChild(style);
    } catch {
      if (sheet.href) {
        const link = target.document.createElement('link');
        link.rel = 'stylesheet';
        link.href = sheet.href;
        target.document.head.appendChild(link);
      }
    }
  }
}

interface PictureInPictureProps {
  open: boolean;
  width: number;
  height: number;
  /** Fires when the window closes — including when the user closes it directly. */
  onClose(): void;
  /** Applied to the wrapper inside the popped-out window. */
  rootStyle: CSSProperties;
  children: ReactNode;
}

export function PictureInPicture({
  open,
  width,
  height,
  onClose,
  rootStyle,
  children,
}: PictureInPictureProps) {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  // Held in a ref so the open/close effect doesn't restart when the caller
  // passes a fresh callback — restarting it would close the window.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const api = globalThis.documentPictureInPicture;
    if (!api) {
      onCloseRef.current();
      return;
    }

    let cancelled = false;
    let opened: Window | null = null;

    void (async () => {
      try {
        const target = await api.requestWindow({ width, height });
        if (cancelled) {
          target.close();
          return;
        }
        copyStyles(target);
        // Fires for the window's own close button as well as ours, so the
        // caller's state can never drift out of sync with reality.
        target.addEventListener('pagehide', () => onCloseRef.current());
        opened = target;
        setPipWindow(target);
      } catch (error) {
        // Refused — usually no user gesture, or already open. Fall back to
        // staying in the tab rather than leaving the caller stuck. Logged
        // because a silently-ignored pop-out is impossible to diagnose from
        // the outside.
        console.warn('[wizard-timer] could not open the floating window:', error);
        if (!cancelled) onCloseRef.current();
      }
    })();

    return () => {
      cancelled = true;
      setPipWindow(null);
      opened?.close();
    };
  }, [open, width, height]);

  if (open && pipWindow) {
    return createPortal(
      <div className="wt-root wt-root--pip" style={rootStyle}>
        {children}
      </div>,
      pipWindow.document.body,
    );
  }

  // Not popped out (or still opening): render in place, unchanged.
  return <>{children}</>;
}
