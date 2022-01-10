const sceneOpt = {
  finance: {
    title: '网易云信视频互动银行',
    inviteAgent: '邀请坐席',
    showLogo: true,
  },
  operator: {
    title: '5G视频客服系统',
    inviteAgent: '三方会议',
    showLogo: false,
  },
};

const sceneName = 'finance';

export default {
  appKey:
    process.env.ENV === 'prod'
      ? ''
      : '',
  // 白板部署链接
  wbTargetUrl:
    process.env.ENV === 'prod'
      ? 'https://meeting.163.com/whiteboard/stable/3.1.0/webview.html'
      : 'https://meeting.163.com/whiteboard/stable/3.1.0/webview_vconsole.html',
  // 白板通信地址
  wbOrigin: 'https://meeting.163.com',
  // 房间服务domain
  meetingServerDomain:
    process.env.ENV === 'prod'
      ? 'https://meeting-api.netease.im'
      : 'https://meeting-api-test.netease.im',
  vceDomain:
    process.env.ENV === 'prod'
      ? 'https://meeting-api.netease.im'
      : 'https://meeting-api-test.netease.im',
  roomkitDomain:
    process.env.ENV === 'prod'
      ? 'https://meeting-api.netease.im'
      : 'https://meeting-api-test.netease.im',
  // G2私有化配置
  neRtcServerAddresses: {},
  // im私有化配置
  imPrivateConf: {},
  scene: sceneOpt[sceneName],
  sceneName,
};
