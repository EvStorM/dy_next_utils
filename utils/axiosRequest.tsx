'use client';

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import axios from 'axios';
import toast from 'react-hot-toast/headless';

// 定义一个常见后端请求返回
type BaseApiResponse<T> = {
  resultCode: number;
  msg: string;
  dataCollection: T;
};
// 拓展 axios 请求配置，加入我们自己的配置
interface RequestOptions {
  // 是否全局展示请求 错误信息
  globalErrorMessage?: boolean;
  // 是否全局展示请求 成功信息
  globalSuccessMessage?: boolean;
}

// 拓展自定义请求配置
interface ExpandAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  interceptorHooks?: InterceptorHooks;
  requestOptions?: RequestOptions;
}

// 拓展 axios 请求配置
interface ExpandInternalAxiosRequestConfig<D = any>
  extends InternalAxiosRequestConfig<D> {
  interceptorHooks?: InterceptorHooks;
  requestOptions?: RequestOptions;
}

// 拓展 axios 返回配置
interface ExpandAxiosResponse<T = any, D = any> extends AxiosResponse<T, D> {
  config: ExpandInternalAxiosRequestConfig<D>;
}

export interface InterceptorHooks {
  requestInterceptor?: (
    config: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: (
    response: AxiosResponse,
  ) => AxiosResponse | Promise<AxiosResponse>;
  responseInterceptorCatch?: (error: any) => any;
}

// 导出Request类，可以用来自定义传递配置来创建实例
class Request {
  // axios 实例
  private _instance: AxiosInstance;
  // 默认配置
  private _defaultConfig: ExpandAxiosRequestConfig = {
    baseURL: '/api',
    timeout: 5000,
    requestOptions: {
      globalErrorMessage: false,
      globalSuccessMessage: false,
    },
  };
  private _interceptorHooks?: InterceptorHooks;

  constructor(config: ExpandAxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this._instance = axios.create(Object.assign(this._defaultConfig, config));
    this._interceptorHooks = config.interceptorHooks;
    this.setupInterceptors();
  }

  // 通用拦截，在初始化时就进行注册和运行，对基础属性进行处理
  private setupInterceptors() {
    this._instance.interceptors.request.use(
      this._interceptorHooks?.requestInterceptor,
      this._interceptorHooks?.requestInterceptorCatch,
    );
    this._instance.interceptors.response.use(
      this._interceptorHooks?.responseInterceptor,
      this._interceptorHooks?.responseInterceptorCatch,
    );
  }

  // 定义核心请求
  public request(config: ExpandAxiosRequestConfig): Promise<AxiosResponse> {
    // ！！！⚠️ 注意：axios 已经将请求使用 promise 封装过了
    // 这里直接返回，不需要我们再使用 promise 封装一层
    return this._instance.request(config);
  }

  public get<T = any>(
    url: string,
    config?: ExpandAxiosRequestConfig,
  ): Promise<T> {
    return this._instance.get(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: ExpandAxiosRequestConfig,
  ): Promise<T> {
    return this._instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: ExpandAxiosRequestConfig,
  ): Promise<T> {
    return this._instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: ExpandAxiosRequestConfig,
  ): Promise<T> {
    return this._instance.delete(url, config);
  }
}

export const BASEURL =
  process.env.NEXT_PUBLIC_BASEURL || 'http://119.3.226.90/landing';
// 请求拦截器
const transform: InterceptorHooks = {
  requestInterceptor(config) {
    // 请求头部处理，如添加 token
    const token = 'token-value';
    if (token) {
      config!.headers!.Authorization = token;
    }
    return config;
  },
  requestInterceptorCatch(err) {
    // 请求错误，这里可以用全局提示框进行提示
    return Promise.reject(err);
  },
  responseInterceptor(result) {
    // 因为 axios 返回不支持扩展自定义配置，需要自己断言一下
    const res = result as ExpandAxiosResponse;
    const data = res.data as BaseApiResponse<any>;
    // 与后端约定的请求成功码
    const SUCCESS_CODE = 200;
    if (res.status !== 200) return Promise.reject(res);
    if (data.resultCode !== SUCCESS_CODE) {
      if (res.config.requestOptions?.globalErrorMessage) {
        // 这里全局提示错误
        toast.error(data.msg ?? '系统错误,请联系客服...');
        console.error(data.msg);
      }
      return Promise.reject(data);
    }
    if (res.config.requestOptions?.globalSuccessMessage) {
      // 这里全局提示请求成功
      console.log(data.msg);
    }
    // 请求返回值，建议将 返回值 进行解构
    return data.dataCollection;
  },
  responseInterceptorCatch(err) {
    console.error(err.response);
    // 这里用来处理 http 常见错误，进行全局提示
    const mapErrorStatus = new Map([
      [400, '请求方式错误'],
      [401, '请重新登录'],
      [403, '拒绝访问'],
      [404, '请求地址有误'],
      [500, '服务器出错'],
    ]);
    const message =
      mapErrorStatus.get(err.response?.status) || '请求出错，请稍后再试';
    // 此处全局报错
    console.error('message', message);
    return Promise.reject(err.response);
  },
};

const AxiosRequest = new Request({
  baseURL: BASEURL,
  timeout: 15000,
  interceptorHooks: transform,
});
export default AxiosRequest;