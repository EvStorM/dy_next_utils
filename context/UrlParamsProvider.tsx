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

function UrlParamsProviders({ children }: UrlParamsProviderProps) {
  const params = useSearchParams().toString();
  const value = useMemo(() => {
    return {
      fullUrl: params,
    };
  }, []);

  return (
    <UrlParamsContext.Provider value={value}>
      {children}
    </UrlParamsContext.Provider>
  );
}

function UrlParamsProvider({ children }: UrlParamsProviderProps) {
  return <UrlParamsProviders>{children}</UrlParamsProviders>;
}

export const useGetUrlParams = () => {
  return useContext(UrlParamsContext);
};

export default UrlParamsProvider;
