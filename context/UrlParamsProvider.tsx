"use client";

import { createContext, ReactNode, Suspense, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";

interface UrlParamsContextValue {
  fullUrl: string;
}

interface UrlParamsProviderProps {
  children: ReactNode;
}

export const UrlParamsContext = createContext<UrlParamsContextValue>({
  fullUrl: "",
});

function UrlParamsProvider({ children }: UrlParamsProviderProps) {
  const params = useSearchParams().toString();
  const value = useMemo(() => {
    return {
      fullUrl: params,
    };
  }, []);

  return (
    <Suspense fallback={<></>}>
      <UrlParamsContext.Provider value={value}>
        {children}
      </UrlParamsContext.Provider>
    </Suspense>
  );
}

export const useGetUrlParams = () => {
  return useContext(UrlParamsContext);
};

export default UrlParamsProvider;
