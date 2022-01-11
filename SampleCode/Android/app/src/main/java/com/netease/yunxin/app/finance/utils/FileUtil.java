package com.netease.yunxin.app.finance.utils;

import android.content.Context;

public class FileUtil {

    public static String getCacheDir(Context context){
        return context.getExternalCacheDir().getAbsolutePath();
    }

}
