package com.netease.yunxin.app.finance.utils;

import android.content.Context;
import android.util.DisplayMetrics;

public class ScreenUtils {

    public static int dp2px(Context context, float dipValue) {
        DisplayMetrics dm = context.getApplicationContext().getResources().getDisplayMetrics();
        float density = dm.density;
        return (int) (dipValue * density + 0.5f);
    }

    public static int sp2px(Context context, float spValue) {
        DisplayMetrics dm = context.getApplicationContext().getResources().getDisplayMetrics();
        float scaleDensity = dm.scaledDensity;
        return (int) (spValue * scaleDensity + 0.5f);
    }

}
