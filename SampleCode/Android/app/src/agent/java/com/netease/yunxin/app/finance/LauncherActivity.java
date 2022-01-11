package com.netease.yunxin.app.finance;

import android.os.Bundle;
import com.netease.yunxin.app.finance.utils.NavUtils;
import com.netease.yunxin.vce.sdk.agent.NEAgent;
import com.netease.yunxin.vce.sdk.guest.NEGuest;

import androidx.annotation.Nullable;

public class LauncherActivity extends BaseActivity{

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        NavUtils.startAgentLoginActivity(this);
        NEAgent.getInstance().returnToVCERoom(LauncherActivity.this);
        finish();
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        NEAgent.getInstance().returnToVCERoom(LauncherActivity.this);
    }
}
