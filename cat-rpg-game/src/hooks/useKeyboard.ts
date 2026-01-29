import { useEffect, useCallback } from 'react';

type KeyHandler = (key: string) => void;

export function useKeyboard(onKeyPress: KeyHandler, enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    const key = event.key.toLowerCase();
    
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 
         'enter', ' ', 'escape', 'e', 'i', 'm', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
      event.preventDefault();
      onKeyPress(key);
    }
  }, [onKeyPress, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

export function mapKeyToDirection(key: string): 'up' | 'down' | 'left' | 'right' | null {
  switch (key) {
    case 'arrowup':
    case 'w':
      return 'up';
    case 'arrowdown':
    case 's':
      return 'down';
    case 'arrowleft':
    case 'a':
      return 'left';
    case 'arrowright':
    case 'd':
      return 'right';
    default:
      return null;
  }
}

export function isConfirmKey(key: string): boolean {
  return key === 'enter' || key === ' ' || key === 'e';
}

export function isCancelKey(key: string): boolean {
  return key === 'escape';
}

export function isMenuKey(key: string): boolean {
  return key === 'm' || key === 'escape';
}

export function isInventoryKey(key: string): boolean {
  return key === 'i';
}
