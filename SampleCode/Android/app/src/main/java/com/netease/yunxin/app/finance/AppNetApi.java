package com.netease.yunxin.app.finance;

import com.netease.yunxin.app.finance.net.model.AccountResponseModel;
import com.netease.yunxin.app.finance.net.model.RoomCreateResponseModel;
import com.netease.yunxin.app.finance.net.model.SpeakResponseModel;
import com.netease.yunxin.vce.sdk.net.HttpHelper;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class AppNetApi {
    private static final String GET_ACCOUNT_API = "/v1/sdk/account/anonymous";
    private static final String MEETING_CREATE_API = "/v1/sdk/meeting/create";
    public static void getAccountInfo(HttpHelper.HttpResultCallback<AccountResponseModel> callback) {
        String url = AppConfig.SERVER_URL + GET_ACCOUNT_API;
        Map<String, String> extraHeaders = new HashMap<>(1);
        extraHeaders.put("appKey", AppConfig.APP_KEY);
        HttpHelper.requestByGet(url, extraHeaders, callback);
    }

    public static void createRoom(String accountId, String accountToken, HttpHelper.HttpResultCallback<RoomCreateResponseModel> callback) {
        String url = AppConfig.SERVER_URL + MEETING_CREATE_API;
        Map<String, String> extraHeaders = new HashMap<>(1);
        extraHeaders.put("accountId", accountId);
        extraHeaders.put("accountToken", accountToken);
        extraHeaders.put("appKey", AppConfig.APP_KEY);
        extraHeaders.put("meetingSdkVersion", "1.0.0");
        extraHeaders.put("clientType", "3");
        JSONObject body = new JSONObject();
        try {
            body.put("nickName", "ceshi01");
            body.put("video", "1");
            body.put("audio", "1");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        HttpHelper.requestByPost(url, extraHeaders, body, callback);
    }

    public static void speak(String content, HttpHelper.HttpResultCallback<SpeakResponseModel> callback){
        String url = "https://yeying-gateway.apps-fp.danlu.netease.com/avatar-interactive/api/v1/xiaohang_yinhang/text2motion";
        Map<String, String> extraHeaders = new HashMap<>(1);
        extraHeaders.put("apikey", "WJ5TnqWMX71LsxqVotvKtKaeCRBEpTGO");
        JSONObject body = new JSONObject();
        try {
            body.put("data", content);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        HttpHelper.requestOriginByPost(url, extraHeaders, body, callback);
    }

}
