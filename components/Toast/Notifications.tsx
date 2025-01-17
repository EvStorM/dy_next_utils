'use client';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useToaster } from 'react-hot-toast/headless';

import { NetWork, SuccessSvg, LoadingSvg, NoticeSvg } from './utils';
import { Spinner } from '@heroui/spinner';
import useLockedBody from './useLockedBody';

const TypeIconInit: any = {
  error: {
    type: true,
    value: <NetWork />,
  },
  success: {
    type: true,
    value: <SuccessSvg />,
  },
  loading: {
    type: true,
    value: <LoadingSvg />,
  },
  custom: {
    type: true,
    value: <NoticeSvg />,
  },
};

const ToastPage = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;
  const [locked, setLocked] = useLockedBody(false, 'root');
  const handleTouchMove = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (toasts) {
      toasts.forEach((toast: any) => {
        if (toast.type === 'loading') {
          setLocked(true);
        }
      });
      document
        .getElementById('TOASTLOADMASK')
        ?.addEventListener('touchmove', handleTouchMove, { passive: false });
      document
        .getElementById('TOASTLOADMASK')
        ?.addEventListener('click', handleTouchMove, { passive: false });
    } else {
      setLocked(false);
    }
    return () => {
      setLocked(false);
      document
        .getElementById('TOASTLOADMASK')
        ?.removeEventListener('touchmove', handleTouchMove);
      document
        .getElementById('TOASTLOADMASK')
        ?.removeEventListener('click', handleTouchMove);
    };
  }, [toasts]);
  return (
    <div
      className={'relative z-[100000]'}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((toast: any) => {
        const offset = calculateOffset(toast, {
          reverseOrder: false,
        });
        const ref = (el: any) => {
          if (el && typeof toast.height !== 'number') {
            const height = el.getBoundingClientRect().height;

            updateHeight(toast.id, height);
          }
        };
        const icons = toast.icon ? false : true;

        return (
          <div
            key={toast.id}
            className={
              'fixed z-[9999] flex justify-center items-center inset-0 pointer-events-none'
            }
          >
            <div
              ref={ref}
              className={'WrapperContentToast'}
              style={{
                opacity: toast.visible ? 1 : 0,
                transform: `translateY(${offset}px)`,
              }}
            >
              {TypeIconInit[toast.type] && icons && (
                <div className={'toast-icon'}>
                  {toast.type === 'loading' ? (
                    <Spinner />
                  ) : (
                    TypeIconInit[toast.type].value
                  )}
                </div>
              )}
              {toast.message && toast.message.length > 0 && (
                <span>{toast.message}</span>
              )}
            </div>
          </div>
        );
      })}
      {locked && (
        <div
          className={'fixed z-[9998] inset-0 w-screen h-screen bg-[#00000033]'}
          id="TOASTLOADMASK"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchMove={handleTouchMove}
        />
      )}
    </div>
  );
};

export default function Toast() {
  return ReactDOM.createPortal(<ToastPage />, document.body) as JSX.Element;
}
