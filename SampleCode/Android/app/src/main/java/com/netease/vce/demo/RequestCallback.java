/*
 * Copyright (c) 2014-2020 NetEase, Inc.
 * All right reserved.
 */
package com.netease.vce.demo;

public interface RequestCallback<T> {
    void onSuccess(T var1);

    void onFailed(int var1);

    void onException(Throwable var1);
}
