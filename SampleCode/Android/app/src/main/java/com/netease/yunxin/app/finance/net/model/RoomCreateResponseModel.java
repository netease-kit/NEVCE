package com.netease.yunxin.app.finance.net.model;

/**
 * @author wulei
 */
public class RoomCreateResponseModel {
    public String avRoomCName;
    public long avRoomUid;
    public String avRoomCheckSum;

    @Override
    public String toString() {
        return "RoomCreateResponseModel{" + "avRoomCName='" + avRoomCName + '\'' + ", avRoomUid='" + avRoomUid + '\'' +
               ", avRoomCheckSum='" + avRoomCheckSum + '\'' + '}';
    }
}
