// 自定义hooks，支付相关工具函数
import { useCallback } from 'react';
import { useGetExIdConfig } from '@/dy_next_utils/context/ExidProider';

import AxiosRequest from '@/utils/axiosRequest';
import { trimAll } from '@/utils/formats/trimAll';

import toast from 'react-hot-toast/headless';
import { useGetUrlParams } from '@/context/UrlParamsProvider';
import { useOpenUrl } from '@/utils/openUrl';

interface PayDataType {
  channelCode: string | number;
  mobile: string;
  appId?: string;
  page?: string;
  json?: string;
}

interface PayDataResponseType {
  externalAgreementNo?: string;
  pageRedirectionData?: string;
  sign: string;
  userId: string | number;
}

const usePayUtils = () => {
  const { payMode } = useGetExIdConfig();
  const { fullUrl } = useGetUrlParams();
  const { openUrl } = useOpenUrl();
  // 支付宝支付
  const aliPay = useCallback(
    async (res: PayDataResponseType) => {
      return new Promise((resolve, reject) => {
        const AliPayReg = /^<form/g;
        const formData = res.sign;
        if (AliPayReg.test(formData)) {
          sessionStorage.setItem('retainStatus', 'true');
          const div: any = document.createElement('div');
          div.innerHTML = formData;
          document.body.appendChild(div);
          if (div.children.length > 0) {
            div.children[0]?.submit && div.children[0].submit();
          } else {
            toast.error('系统错误,请联系客服');
          }
        } else if (res.pageRedirectionData) {
          openUrl(res.pageRedirectionData).then(() => {
            resolve(1);
          });
        }
      });
    },
    [payMode],
  );
  // 微信支付
  const wxPay = useCallback(() => {}, [payMode]);
  // 订阅套餐
  const subPackage = useCallback(
    ({ channelCode, mobile }: PayDataType): Promise<PayDataResponseType> => {
      return new Promise((resolve, reject) => {
        const appId = '2021005107660504';
        const page = 'pages/index/index';
        const json = {};
        AxiosRequest.post<PayDataResponseType>(
          '/api/landing/createSubscription',
          {
            channelCode: channelCode,
            mobile: trimAll(mobile),
            appId: appId,
            page: page,
            json: json,
            fullUrl,
          },
        )
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    [payMode],
  );
  // 检查是否支付
  const checkPay = useCallback(() => {}, [payMode]);
  // 支付函数
  const pay = useCallback(
    (mobile: string, channelCode: string) => {
      const load = toast.loading('支付中...');
      subPackage({
        channelCode,
        mobile,
      })
        .then((res) => {
          toast.dismiss(load);
          aliPay(res).then(() => {
            toast.dismiss();
          });
        })
        .catch((e) => {
          console.log(e, 'eeeeeeeeeee');
          toast.dismiss(load);
          toast.error(e?.msg ?? '请求失败，请重试');
        })
        .finally(() => {
          // setTimeout(() => {
          //   toast.dismiss();
          // }, 3000);
        });
    },
    [payMode],
  );

  return { pay, checkPay };
};

export default usePayUtils;
