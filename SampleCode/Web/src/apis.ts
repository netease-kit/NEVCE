import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { uuid } from './utils/utils';
import config from './config';
import logger from '@/utils/logger';

export interface ICommonRes {
  code: number;
  msg: string;
  requestId: string;
}

export interface AppSettings {
  enableCamera?: boolean;
  enableBeauty?: boolean;
  enableVirtualBackground?: boolean;
  virtualBackground?: string;
}
export interface ILoginRes extends ICommonRes {
  ret: {
    accountId: string;
    accountToken: string;
    appKey: string;
    imAppKey: string;
    nrtcAppKey: string;
    imAccid: string;
    imToken: string;
    privateMeetingId: string;
    shortId: string;
    nickname: string;
    roomUid: string;
  };
}

export interface IGetCategoryListRes extends ICommonRes {
  ret: {
    id: number;
    code: string;
    desc: string;
  }[];
}

export interface IWorkerQueryRes extends ICommonRes {
  ret: {
    inQueue: boolean;
  };
}

export interface ICreateMeetingRes extends ICommonRes {
  ret: {
    meetingUniqueId: number;
    meetingId: string;
    subject: string;
    startTime: number;
    endTime: number;
    password: string;
    settings: any;
    attendeeAudioOff: boolean;
    status: number;
    sipCid: string;
  };
}

export const urlMap = {
  // login: '/v1/sdk/account/loginByUsernamePassword',
  // getCategoryList: '/v1/sdk/queue/category/list',
  // workerOnline: '/v1/sdk/queue/worker/online',
  // workerOffline: '/v1/sdk/queue/worker/offline',
  // workerQuery: '/v1/sdk/queue/worker/query',
  // workerForward: '/v1/sdk/queue/worker/forward',
  // createMeeting: '/v1/sdk/meeting/create',
  changeNickName: '/ne-meeting-account/changeNickname',
  // visitorOnline: '/v1/sdk/queue/visitor/online',
  // visitorOffline: '/v1/sdk/queue/visitor/offline',
};

export const request = async <T>({
  method,
  url,
  data,
  headers,
  domain,
}: {
  method: 'get' | 'post';
  url: string;
  data?: any;
  headers?: any;
  domain?: string;
}): Promise<T> => {
  try {
    logger.log(`request ${url}`, data);
    const baseDomain = domain
      ? domain
      : process.env.ENV === 'mock'
      ? '/api'
      : config.vceDomain;

    const res: AxiosResponse<T & { code: number; msg: string }> = await axios({
      method,
      url: `${baseDomain}${url}`,
      data,
      headers,
    });
    if (res.data.code !== 200) {
      logger.error(`request fail ${url}`, data, res);
      return Promise.reject(res.data);
    }
    logger.log(`request success ${url}`, data, res);
    return res.data;
  } catch (err) {
    logger.error(`request fail ${url}`, data, err);
    return Promise.reject(err);
  }
};

// // 登录
// export const login = ({
//   username,
//   password,
// }: {
//   username: string;
//   password: string;
// }) =>
//   request<ILoginRes>({
//     method: 'post',
//     url: urlMap['login'],
//     data: {
//       username,
//       password: encode(password),
//     },
//     headers: {
//       clientType: 6,
//       meetingSdkVersion: '1.5.2',
//       deviceId: uuid(),
//       appKey: config.appKey,
//     },
//   });

// // 获取业务列表
// export const getCategoryList = ({
//   accountId,
//   accountToken,
// }: {
//   accountId: string;
//   accountToken: string;
// }) =>
//   request<IGetCategoryListRes>({
//     method: 'post',
//     url: urlMap['getCategoryList'],
//     headers: {
//       clientType: 6,
//       meetingSdkVersion: '1.5.2',
//       deviceId: uuid(),
//       appKey: config.appKey,
//       accountId,
//       accountToken,
//     },
//   });

// // 客服上线
// export const workerOnline = ({
//   categoryList,
//   accountId,
//   accountToken,
// }: {
//   categoryList: string[];
//   accountId: string;
//   accountToken: string;
// }) =>
//   request<ICommonRes>({
//     method: 'post',
//     url: urlMap['workerOnline'],
//     data: {
//       categoryList,
//     },
//     headers: {
//       clientType: 6,
//       meetingSdkVersion: '1.5.2',
//       deviceId: uuid(),
//       appKey: config.appKey,
//       accountId,
//       accountToken,
//     },
//   })
//     .then((res) => {
//       return Promise.resolve(res);
//     })
//     .catch((err) => {
//       return Promise.reject(err);
//     });

// // 客服下线
// export const workerOffline = ({
//   accountId,
//   accountToken,
// }: {
//   accountId: string;
//   accountToken: string;
// }) =>
//   request<ICommonRes>({
//     method: 'post',
//     url: urlMap['workerOffline'],
//     data: {},
//     headers: {
//       clientType: 6,
//       meetingSdkVersion: '1.5.2',
//       deviceId: uuid(),
//       appKey: config.appKey,
//       accountId,
//       accountToken,
//     },
//   })
//     .then((res) => {
//       return Promise.resolve(res);
//     })
//     .catch((err) => {
//       if (err && err.code === 1106) {
//         return Promise.resolve();
//       } else {
//         return Promise.reject(err?.msg || '');
//       }
//     });

// // 查询客服服务状态
// export const queryWorkerStatus = ({
//   accountId,
//   accountToken,
// }: {
//   accountId: string;
//   accountToken: string;
// }) =>
//   request<IWorkerQueryRes>({
//     method: 'post',
//     url: urlMap['workerQuery'],
//     data: {},
//     headers: {
//       clientType: 6,
//       meetingSdkVersion: '1.5.2',
//       deviceId: uuid(),
//       appKey: config.appKey,
//       accountId,
//       accountToken,
//     },
//   });

// // 客服转接
// export const workerForward = ({
//   visitorId,
//   categoryList,
//   visitorInfo,
//   accountId,
//   accountToken,
// }: {
//   visitorId: string;
//   categoryList: string[];
//   visitorInfo: {
//     phone?: string;
//     name: string;
//     vip?: number;
//   };
//   accountId: string;
//   accountToken: string;
// }) =>
//   request<ICommonRes>({
//     method: 'post',
//     url: urlMap['workerForward'],
//     data: {
//       visitorId,
//       categoryList,
//       visitorInfo,
//     },
//     headers: {
//       clientType: 6,
//       meetingSdkVersion: '1.5.2',
//       deviceId: uuid(),
//       appKey: config.appKey,
//       accountId,
//       accountToken,
//     },
//   });

// // 创建会议
// export const createMeeting = ({
//   accountId,
//   accountToken,
//   nickName,
//   video = 1,
//   audio = 1,
//   type = 1,
//   chatRoom = 1,
// }: {
//   accountId: string;
//   accountToken: string;
//   nickName: string;
//   video?: number;
//   audio?: number;
//   type?: number;
//   chatRoom?: number;
// }) =>
//   request<ICreateMeetingRes>({
//     method: 'post',
//     url: urlMap['createMeeting'],
//     data: {
//       accountId,
//       accountToken,
//       nickName,
//       video,
//       audio,
//       type,
//       chatRoom,
//     },
//     headers: {
//       clientType: 6,
//       meetingSdkVersion: '1.5.2',
//       deviceId: uuid(),
//       appKey: config.appKey,
//       accountId,
//       accountToken,
//     },
//   });

export const changeNickName = ({
  nickname,
  accountId,
  accountToken,
}: {
  nickname: string;
  accountId: string;
  accountToken: string;
}) =>
  request<ICommonRes>({
    method: 'post',
    url: urlMap['changeNickName'],
    data: {
      nickname,
    },
    headers: {
      clientType: 6,
      meetingSdkVersion: '1.5.2',
      deviceId: uuid(),
      appKey: config.appKey,
      accountId,
      accountToken,
    },
  });

// export const visitorOnline = ({
//   categoryList,
//   name,
//   accountId,
//   accountToken,
// }: {
//   categoryList: string[];
//   name: string;
//   accountId: string;
//   accountToken: string;
// }) =>
//   request<ICommonRes>({
//     method: 'post',
//     url: urlMap['visitorOnline'],
//     data: {
//       categoryList,
//       visitorInfo: {
//         name,
//       },
//       specialCode: 'rearrange',
//     },
//     headers: {
//       clientType: 6,
//       meetingSdkVersion: '1.5.2',
//       deviceId: uuid(),
//       appKey: config.appKey,
//       accountId,
//       accountToken,
//     },
//   });

// export const visitorOffline = ({
//   accountId,
//   accountToken,
// }: {
//   accountId: string;
//   accountToken: string;
// }) =>
//   request<ICommonRes>({
//     method: 'post',
//     url: urlMap['visitorOffline'],
//     data: {},
//     headers: {
//       clientType: 6,
//       meetingSdkVersion: '1.5.2',
//       deviceId: uuid(),
//       appKey: config.appKey,
//       accountId,
//       accountToken,
//     },
//   });

export const appSettings = (data: AppSettings) =>
  request<ICommonRes>({
    domain: 'https://127.0.0.1:8805',
    url: '/settings',
    method: 'post',
    data,
  }).catch((err) => {
    message.error(
      '请求失败，可能的原因及解决方案：1.没有开启虚拟美颜应用程序，请开启应用程序后重试；2.端口号被占用，请关闭8805端口或更换设备',
    );
    return Promise.reject(err);
  });
