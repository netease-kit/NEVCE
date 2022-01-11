package com.netease.yunxin.app.finance.utils;

import android.app.Activity;
import android.content.Context;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

public class KeyboardUtil {

    /**
     * 隐藏显示键盘
     */
    public static void showKeyboard(Context context, EditText editText) {
        if(editText != null) {
            editText.requestFocus();
        }
        InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS);
    }

    /**
     * 隐藏键盘
     */
    public static void dismissKeyboard(Context context, EditText editText) {
        if(editText != null) {
            editText.clearFocus();
        }
        InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        if(context instanceof Activity) {
            if (imm.isActive()) {
                if(editText != null) {
                    imm.hideSoftInputFromWindow(editText.getWindowToken(), 0);
                }
            }
        }
    }

}
