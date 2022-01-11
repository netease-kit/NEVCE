/*
 * Copyright (c) 2014-2020 NetEase, Inc.
 * All right reserved.
 */

package com.netease.yunxin.app.finance;

import android.app.Application;
import com.netease.yunxin.app.finance.utils.AppFrontBackManager;
import com.netease.yunxin.vce.sdk.NECallback;
import com.netease.yunxin.vce.sdk.NEVCESDKConfig;
import com.netease.yunxin.vce.sdk.SceneType;
import com.netease.yunxin.vce.utils.LogUtils;
import com.netease.yunxin.vce.sdk.guest.NEGuest;

public class FinanceApplication extends Application {
    private static FinanceApplication instance;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        AppFrontBackManager.getInstance().initialize(this);
        NEVCESDKConfig sdkConfig = new NEVCESDKConfig();
        sdkConfig.appKey = AppConfig.APP_KEY;
        sdkConfig.appName = getString(R.string.app_name);
        sdkConfig.scene = SceneType.FINANCE;
        sdkConfig.serverUrl = AppConfig.SERVER_URL;
        NEGuest.getInstance().initialize(this, sdkConfig, new NECallback<Void>() {

            @Override
            public void onResult(int resultCode, String resultMsg, Void resultData) {
                LogUtils.i("FinanceApplication", "initialize NEGuest resultCode = " + resultCode + ", resultMsg = " + resultMsg);
            }
        });
    }

    public static FinanceApplication getInstance() {
        return instance;
    }
}
