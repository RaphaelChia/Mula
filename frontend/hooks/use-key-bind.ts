import { useEffect, useRef } from 'react';

interface UseKeyBindOptions {
  key: string;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
  ignoreInputFocus?: boolean;
  onPress: (event: KeyboardEvent) => void;
}

/**
 * Custom hook for handling keyboard shortcuts
 * @param options - Configuration for the keybind
 * @param options.key - The key to bind to (e.g., 'Enter', 'Backspace', 'a', 'Escape')
 * @param options.modifiers - Optional modifier keys that must be pressed
 * @param options.ignoreInputFocus - If true, the handler won't fire when an input/textarea/select is focused
 * @param options.onPress - Callback function to execute when the keybind is triggered
 */
export function useKeyBind({
  key,
  modifiers,
  ignoreInputFocus = false,
  onPress,
}: UseKeyBindOptions) {
  const callbackRef = useRef(onPress);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = onPress;
  }, [onPress]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if we should ignore input focus
      if (ignoreInputFocus) {
        const target = event.target as HTMLElement;
        const isInputElement =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable;

        if (isInputElement) {
          return;
        }
      }

      // Check if the key matches
      if (event.key !== key && event.code !== key) {
        return;
      }

      // Check modifiers if provided
      if (modifiers) {
        if (modifiers.ctrl && !event.ctrlKey) return;
        if (modifiers.alt && !event.altKey) return;
        if (modifiers.shift && !event.shiftKey) return;
        if (modifiers.meta && !event.metaKey) return;

        // Ensure no extra modifiers are pressed (optional - you might want to allow extra modifiers)
        // For now, we'll allow extra modifiers to be more flexible
      }

      // Prevent default if needed (you can add this as an option later)
      // event.preventDefault();

      callbackRef.current(event);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, modifiers, ignoreInputFocus]);
}

