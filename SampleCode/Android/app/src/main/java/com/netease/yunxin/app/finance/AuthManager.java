package com.netease.yunxin.app.finance;

public class AuthManager {

    private String accountId;
    private String accountToken;

    private static volatile AuthManager mInstance;

    private AuthManager(){}

    public static AuthManager getInstance() {
        if(null == mInstance) {
            synchronized (AuthManager.class) {
                if (mInstance == null) {
                    mInstance = new AuthManager();
                }
            }
        }
        return mInstance;
    }

    public String getAccountId() {
        return accountId;
    }
    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }
    public String getAccountToken() {
        return accountToken;
    }
    public void setAccountToken(String accountToken) {
        this.accountToken = accountToken;
    }
}
