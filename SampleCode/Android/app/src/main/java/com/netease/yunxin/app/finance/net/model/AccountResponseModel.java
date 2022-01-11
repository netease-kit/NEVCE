package com.netease.yunxin.app.finance.net.model;

import com.netease.yunxin.vce.Constant;

import org.json.JSONObject;

/**
 * @author wulei
 */
public class AccountResponseModel {
    public String imAccid;
    public String imToken;
    public String accountId;
    public String accountToken;
    public String appKey;

    public AccountResponseModel(String imAccid, String imToken, String accountId, String accountToken, String appKey) {
        this.imAccid = imAccid;
        this.imToken = imToken;
        this.accountId = accountId;
        this.accountToken = accountToken;
        this.appKey = appKey;
    }

    public static AccountResponseModel jsonToAccountResponseModel(JSONObject jsonInfo) {

        if (jsonInfo == null) {
            return null;
        }
        return new AccountResponseModel(
                jsonInfo.optString(Constant.IM_ACCID),
                jsonInfo.optString(Constant.IM_TOKEN),
                jsonInfo.optString(Constant.ACCOUNT_ID),
                jsonInfo.optString(Constant.ACCOUNT_TOKEN),
                jsonInfo.optString(Constant.APP_KEY));
    }

    @Override
    public String toString() {
        return "AccountResponseModel{" + "imAccid='" + imAccid + '\'' + ", imToken='" + imToken + '\'' +
               ", accountId='" + accountId + '\'' + ", accountToken='" + accountToken + '\'' + ", appKey='" + appKey +
               '\'' + '}';
    }
}
