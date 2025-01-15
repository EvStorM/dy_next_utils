'use client';

import { useMount, useSessionStorageState } from 'ahooks';
import { useRouter, useSearchParams } from 'next/navigation';

const useCheck = () => {
  const [phone, setPhone] = useSessionStorageState<string | undefined>(
    'use-local-storage-state-phone',
    {
      defaultValue: '',
    },
  );
  const [exId, setExId] = useSessionStorageState<string | undefined>(
    'use-local-storage-state-exId',
    {
      defaultValue: '',
    },
  );
  const [aoId, setAoId] = useSessionStorageState<string | undefined>(
    'use-local-storage-state-aoId',
    {
      defaultValue: '',
    },
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  useMount(() => {
    getExId();
    getAoId();
    getPhone();
  });

  const getExId = () => {
    const val = searchParams.get('ex_id') ?? '';
    setExId(val);
  };

  const getPhone = () => {
    const phone = searchParams.get('phone') ?? searchParams.get('mobile') ?? '';
    setPhone(phone);
  };
  const getAoId = () => {
    const val =
      searchParams.get('a_oId') ??
      searchParams.get('bxm_id') ??
      searchParams.get('qcjParamStr') ??
      aoId;
    setAoId(val);
  };

  return {
    exId,
    aoId,
    phone,
  };
};

export default useCheck;
