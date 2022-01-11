package com.netease.yunxin.app.finance;

import com.netease.yunxin.app.finance.FinanceApplication;
import com.netease.yunxin.app.finance.R;

public class AppConfig {

    public final static String APP_KEY = FinanceApplication.getInstance().getString(R.string.appkey);

    public final static String SERVER_URL = "https://meeting-api.netease.im";

}
