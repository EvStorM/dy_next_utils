import { useEffect, useRef } from 'react';
import useEvoke from '@/utils/useEvoke';

// iframe打开支付页面
const openIframe = (url: string) => {
  const iframe = document.createElement('iframe');

  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 2000);
};
// 直接页面跳转
const openHrefUrl = (url: string) => {
  window.location.href = url;
};

export const useOpenUrl = () => {
  const timer = useRef<any>(null);
  const checkOpen = useEvoke();
  const openUrl = async (url: string) => {
    return new Promise((resolve, reject) => {
      openIframe(url);
      checkOpen(() => {
        openHrefUrl(url);
      }, 3000);
    });
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('pagehide', () => {});
      window.removeEventListener('visibilitychange', () => {});
      clearTimeout(timer.current);
    };
  }, []);

  return {
    openUrl,
  };
};
