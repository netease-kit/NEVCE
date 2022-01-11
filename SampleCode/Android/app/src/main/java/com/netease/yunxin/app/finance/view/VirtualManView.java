package com.netease.yunxin.app.finance.view;

import android.annotation.SuppressLint;
import android.content.Context;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.view.ViewGroup;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

import com.netease.yunxin.vce.utils.HandlerUtil;
import com.netease.yunxin.vce.utils.LogUtils;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import androidx.annotation.Nullable;

public class VirtualManView extends LinearLayout {
    private final static String TAG = "VirtualManView";
    private final static String TARGET_URL = "https://kefu-h5.apps-qa.danlu.netease.com/?fov=20&target={%22x%22:0,%22y%22:1.5,%22z%22:0}&camera={%22x%22:0,%22y%22:1.5,%22z%22:2.61}";
    private final static String FIRST_SENTENCE = "你好";
    private final static String URL_CONTAIN_REPORT = "report";
    private final static String URL_CONTAIN_TEXT2MOTION = "text2motion";
    private WebView webView;
    private String voice2Text;
    private VirtualManListener virtualManListener;

    public VirtualManView(Context context) {
        this(context, null);
    }
    public VirtualManView(Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }
    public VirtualManView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        webView = new WebView(getContext());
        ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        addView(webView, layoutParams);
        initView();
    }
    private void initView() {
        initWebView();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initWebView(){
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webView.loadUrl(TARGET_URL);
        webView.setWebViewClient(new WebViewClient(){
            @Nullable
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {

                if((request.getUrl().toString().contains(URL_CONTAIN_REPORT) ||
                    request.getUrl().toString().contains(URL_CONTAIN_TEXT2MOTION))
                   && request.getMethod().equals("POST")) {

                    if(TextUtils.isEmpty(voice2Text)){
                        LogUtils.d(TAG, "shouldInterceptRequest but voice2Text is empty");
                        return super.shouldInterceptRequest(view, request);
                    }else {
                        StringBuilder stringBuilder = new StringBuilder();
                        BufferedReader bufferedReader = null;
                        try {
                            URL url = new URL(request.getUrl().toString());
                            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                            httpURLConnection.setRequestMethod("POST");
                            httpURLConnection.setConnectTimeout(10 * 1000);
                            httpURLConnection.setReadTimeout(40 * 1000);
                            httpURLConnection.setDoInput(true);// 允许输入
                            httpURLConnection.setDoOutput(true);// 允许输出
                            httpURLConnection.setUseCaches(false); // 不允许使用缓存
                            httpURLConnection.setRequestProperty("Content-Type", "application/json");
                            httpURLConnection.setRequestProperty("apikey", "GVJwZQAOOin8ng0x7VXlX3nTm78AWtxZ");
                            JSONObject param = new JSONObject();
                            LogUtils.d(TAG, "origin text = " + voice2Text);
                            param.put("data", voice2Text);
                            OutputStreamWriter writer = new OutputStreamWriter(httpURLConnection.getOutputStream(),
                                                                               "UTF-8");
                            writer.write(param.toString());
                            writer.flush();
                            int res = httpURLConnection.getResponseCode();
                            LogUtils.d(TAG, "res = " + res);
                            if (res == 200) {
                                bufferedReader = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
                                String line = "";
                                while ((line = bufferedReader.readLine()) != null)
                                    stringBuilder.append(line);
                                JSONObject jsonObject = new JSONObject(stringBuilder.toString());
                                String text = jsonObject.optString("text");
                                onVirtualManSpeak(text);
                                LogUtils.d(TAG, "text = " + text);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        } finally {
                            if (bufferedReader != null)
                                try {
                                    bufferedReader.close();
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                        }
                        WebResourceResponse webResourceResponse = null;
                        webResourceResponse = new WebResourceResponse("application/json", "UTF-8", new ByteArrayInputStream(
                                stringBuilder.toString().getBytes()));
                        Map<String, String> headers = new HashMap<>();
                        headers.put("Access-Control-Allow-Origin", "*");
                        headers.put("Access-Control-Allow-Headers", "*");
                        webResourceResponse.setResponseHeaders(headers);
                        return webResourceResponse;
                    }
                }else{
                    return super.shouldInterceptRequest(view, request);
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                HandlerUtil.post2MainThreadDelay(new Runnable() {

                    @Override
                    public void run() {
                        sendText2Virtual(FIRST_SENTENCE);
                    }
                }, 2000);
            }
        });
    }

    public void onVirtualManSpeak(String text) {
        if(virtualManListener != null) {
            virtualManListener.onVirtualManSpeak(text);
        }
    }

    public void sendText2Virtual(String text){
        LogUtils.d(TAG, "sendText2Virtual text = " + text);
        if(TextUtils.isEmpty(text)){
            text = FIRST_SENTENCE;
        }
        voice2Text = text;
        if(webView != null) {
            webView.evaluateJavascript("javascript:text2Motion('" + text + "')", new ValueCallback<String>() {

                @Override
                public void onReceiveValue(String s) {
                    Log.d(TAG, "evaluateJavascript result = " + s);
                }
            });
        }
    }

    public void setVirtualManListener(VirtualManListener virtualManListener) {
        this.virtualManListener = virtualManListener;
    }
    public interface VirtualManListener{
        void onVirtualManSpeak(String text);
    }

    public void destroy(){
        webView.destroy();
        webView = null;
    }

}
