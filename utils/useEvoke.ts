import { useEffect, useMemo, useRef } from 'react';

const useEvoke = () => {
  const hidden = useRef<string | undefined>(undefined);
  const visibilityChange = useRef<string | undefined>(undefined);
  const getSupportedProperty = (): void => {
    if (typeof document === 'undefined') return;
    if (typeof document.hidden !== 'undefined') {
      hidden.current = 'hidden';
      visibilityChange.current = 'visibilitychange';
    } else if (typeof (document as any)?.msHidden !== 'undefined') {
      hidden.current = 'msHidden';
      visibilityChange.current = 'msvisibilitychange';
    } else if (typeof (document as any)?.webkitHidden !== 'undefined') {
      hidden.current = 'webkitHidden';
      visibilityChange.current = 'webkitvisibilitychange';
    }
  };

  /**
   * 判断页面是否隐藏（进入后台）
   */
  function isPageHidden(): boolean {
    if (hidden.current === null) return false;
    if (typeof hidden.current === 'undefined') return false;

    return (document as any)[hidden.current] as boolean;
  }
  useEffect(() => {
    getSupportedProperty();

    return () => {
      window.removeEventListener('pagehide', () => { });
      if (typeof visibilityChange.current !== 'undefined') {
        window.removeEventListener(visibilityChange.current, () => { });
      }
    };
  }, []);
  const checkOpen = (failure: () => void, timeout: number): void => {
    const timer = setTimeout(() => {
      const pageHidden = isPageHidden();

      if (!pageHidden) {
        failure();
      }
    }, timeout);

    if (typeof visibilityChange.current !== 'undefined') {
      document.addEventListener(visibilityChange.current, () => {
        clearTimeout(timer);
      });
    } else {
      window.addEventListener('pagehide', () => {
        clearTimeout(timer);
      });
    }
  };
  return checkOpen;
};

export default useEvoke;
