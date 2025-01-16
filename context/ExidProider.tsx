'use client';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useRequest, useSessionStorageState } from 'ahooks';

import RightsProvider from '@/context/RightsProider';
import useCheck from '../hooks/useCheck';
import Notifications from '../components/Toast';

interface ExIdConfig {
  payMode: number;
  companyName: string;
  companyTel: string;
  payAmount: number;
  retainAmount: number;
  channelCode: string;
  channelName: string;
}

interface ExIdConfigContextValue extends ExIdConfig {
  exId: string;
  aoId: string;
}

export const ExIdConfigContext = createContext<ExIdConfigContextValue>({
  companyName: '',
  companyTel: '',
  payMode: 0,
  payAmount: 0,
  retainAmount: 0,
  aoId: '',
  exId: '',
  channelCode: '',
  channelName: '',
});

const ExIdConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { exId, aoId } = useCheck();

  const [ExIdConfig, setExIdConfig] = useSessionStorageState<ExIdConfig>(
    'use-Session-storage-ExIdConfig',
    {
      defaultValue: {
        payMode: 0,
        companyName: '',
        companyTel: '',
        payAmount: 0,
        retainAmount: 0,
        channelCode: '',
        channelName: '',
      },
    },
  );
  const getExIdConfig = useCallback(async () => {
    if (exId) {
      return new Promise((resolve, reject) => {
        fetch(`https://link.quanyi.fun/config/exids/${exId}.json`, {
          cache: 'no-cache',
        })
          .then((res) => res.json())
          .then((data) => {
            setExIdConfig(data);
            resolve(data);
          });
      });
    }
  }, [exId]);

  const { data, loading } = useRequest(getExIdConfig, {
    ready: !!exId,
  });

  const value = useMemo(() => {
    return {
      exId: exId ?? '',
      aoId: aoId ?? '',
      channelCode: ExIdConfig?.channelCode ?? '',
      channelName: ExIdConfig?.channelName ?? '权益优享',
      companyName: ExIdConfig?.companyName ?? '',
      companyTel: ExIdConfig?.companyTel ?? '',
      payMode: ExIdConfig?.payMode ?? 0,
      payAmount: ExIdConfig?.payAmount ?? 0,
      retainAmount: ExIdConfig?.retainAmount ?? 0,
    };
  }, [ExIdConfig, exId, aoId]);

  return (
    <ExIdConfigContext.Provider value={value}>
      <Notifications />
      <RightsProvider>{children}</RightsProvider>
    </ExIdConfigContext.Provider>
  );
};

export default ExIdConfigProvider;

export const useGetExIdConfig = () => {
  return useContext(ExIdConfigContext);
};
