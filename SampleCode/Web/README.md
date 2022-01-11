## 《跑通示例项目》网易智慧云营业厅 Web
### 《跑通示例项目》文档针对接入阶段的用户，提供示例源码的运行指引，提供快速跑通示例项目Demo的方案，帮助用户快速接入。

### 您可以参考本文档快速跑通示例项目，快速在本地运行示例 Demo。

**前提条件:**
在开始运行示例项目之前，请确保您已完成以下操作：
- 创建应用并获取App Key。
- 开通音视频通话 2.0 服务。
- 集成 SDK。
- 联系商务经理开通非安全模式。

**开发环境:**
在开始运行示例项目之前，请确保开发环境满足以下要求：
- 开发环境：react16.8及以上版本 + TypeScript + hooks
- node版本 > 12

**运行示例源码:**
1. 在SDK和示例代码下载页面或 Demo 体验页面下载需要体验的示例项目或 Demo 源码工程。
2. 在 `src/config.ts` 文件中配置私有化相关参数
  ```js
    export default {
      appKey: '',
      wbTargetUrl: '', // 白板部署链接
      wbOrigin: '', // 白板通信地址
      meetingServerDomain: '', // 房间服务domain
      neRtcServerAddresses: {}, // G2私有化配置
      imPrivateConf: {}, // im私有化配置
    };
  ```
3. 安装依赖
  ```bash
    $ npm install
  ```
4. 运行项目
  ```bash
    $ npm start
  ```
5. web端在浏览器打开 https://localhost:8000/#/ 访问项目
