
### NEVCE SDK Tutorial

云视频客服Android SDK提供了一套简单易用的接口，允许开发者通过调用NEVCE SDK(以下简称SDK)提供的API，快速地集成云视频客服功能至现有Android应用中。

示例项目包含的功能如下：

- 登录鉴权
- 查询业务列表
- 呼叫排队
- 房间内提供的其他功能(如视频通话、屏幕共享、白板等) 

### 运行示例程序

开发者根据个人需求，补充完成示例项目后，即可运行并体验云视频客服功能。

跑通示例项目，需要完成以下两个步骤：

#### 声明AppKey

Appkey是应用接入VCESDK的凭证，开发者首先需要在网易云信开发者平台完成申请，并将其填写至`"app/src/main/res/values/appkey.xml"`资源文件中的对应资源项上。

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>

    <!--TODO-->
    <!--Replace With Your AppKey Here-->
    <string name="appkey">Your AppKey</string>

</resources>
```

#### 修改包名
在app/build.gradle中修改添加开发者应用的包名

完成AppKey的声明和包名修改后，就可以运行示例项目体验云视频客服相关的功能。

### 运行环境

- Android Studio 3.0 +
- 真实 Android 设备(部分模拟器会存在功能缺失或者性能问题，推荐使用真机)




