/*
 * @Author: your name
 * @Date: 2021-02-25 17:48:46
 * @LastEditTime: 2021-03-15 15:18:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /App-Finance-Web/src/pages/meeting/MeetingMain.tsx
 */

import React, { useMemo, Dispatch } from 'react';
import { Button, Popover } from 'antd';

import DeviceList from '@/components/DeviceList';
import styles from './index.less';
import IconFont from '@/components/Icon';
import VideoCard from './VideoCard';
import NetworkHover from './NetworkHover';
import {
  NERoomInfo,
  NERoomMemberInfo,
} from 'kit-room-web/dist/types/src/core/apis';
import RoomKitImpl from 'kit-room-web';
import { IDispatch, InitialState } from '@/layouts/reducer';
import config from '@/config';

export default React.memo(
  (props: {
    speakerId: string;
    speakerList: Array<any>;
    micList: Array<any>;
    micId: string;
    micVisible: boolean;
    meetingInfo: Partial<NERoomInfo>;
    users: NERoomMemberInfo[];
    cameraId: string;
    cameraList: Array<any>;
    videoVisible: boolean;
    callType: 'video' | 'audio';
    // streams: any;
    roomkit: RoomKitImpl;
    endMeeting(): Promise<any>;
    leaveMeeting(): Promise<any>;
    setSpeakerId(speakerId: string): void;
    setMicId(micId: string): void;
    setMicVisible(disable: boolean | Function): void;
    switchCamera(cameraid: string): Promise<void> | undefined;
    setVideoSettingVisible(disable: boolean | Function): void;
    setVideoVisible(disable: boolean | Function): void;
    endMeetingLoading: boolean;
    state: InitialState;
    virtualCameraEnabled: boolean;
    dispatch: Dispatch<IDispatch>;
    // [propName: string]: any;
  }) => {
    const {
      speakerId,
      speakerList,
      micList,
      micId,
      micVisible,
      meetingInfo,
      users,
      cameraId,
      cameraList,
      videoVisible,
      callType,
      // streams,
      roomkit,
      endMeeting,
      setSpeakerId,
      setMicId,
      setMicVisible,
      switchCamera,
      setVideoSettingVisible,
      setVideoVisible,
      endMeetingLoading,
      leaveMeeting,
      virtualCameraEnabled,
      state,
    } = props;

    const guests = useMemo(() => {
      return users.filter((item) => item.memberTag === 'guest');
    }, [users]);

    const supports = useMemo(() => {
      return users.filter((item) => item.memberTag !== 'guest');
    }, [users]);

    const localInfo = useMemo(
      () =>
        users.find(
          (item) => item.accountId === roomkit.getInRoomService().getMyUserId(),
        ),
      [users, roomkit],
    );

    const renderSupports = useMemo(
      () =>
        supports.map((item) => {
          return (
            <VideoCard
              roomkit={roomkit}
              className={
                styles[`sort${supports?.length < 3 ? supports?.length : 3}`]
              }
              key={item.avRoomUid}
              userInfo={{ ...item }}
              meetingInfo={meetingInfo}
            />
          );
        }),
      [roomkit, supports, meetingInfo],
    );

    return (
      <>
        <div className={styles.meetingMain}>
          <div className={styles.meetingMainContent}>
            <div className={styles.guestVideo}>
              {guests.length ? (
                guests.map((item) => (
                  <VideoCard
                    roomkit={roomkit}
                    className={
                      styles[
                        `sort${users.length - 1 < 3 ? users.length - 1 : 3}`
                      ]
                    }
                    key={item.avRoomUid}
                    userInfo={item}
                    meetingInfo={meetingInfo}
                  />
                ))
              ) : (
                <div className={styles.guestLeave}>
                  <span>该用户当前不在房间内</span>
                </div>
              )}
            </div>
            <div className={styles.supportVideo}>{renderSupports}</div>
          </div>
          <div className={styles.meetingMainFooter}>
            <div className={styles.onlineStatus}>
              <Popover
                content={
                  <NetworkHover
                    state={state}
                    userId={roomkit.getInRoomService().getMyUserId() || ''}
                    users={users}
                  />
                }
              >
                <IconFont
                  className={styles.onlineIcon}
                  type="iconsignal1x"
                ></IconFont>
              </Popover>
            </div>
            <div className={styles.localControl}>
              {config.sceneName === 'operator' ? (
                <div className={styles.localControlBtns}>
                  <Button
                    onClick={() => {
                      roomkit
                        .getInRoomService()
                        .changeCallType(
                          callType === 'audio' ? 'video' : 'audio',
                        );
                    }}
                    type="text"
                    icon={
                      <IconFont
                        className={styles.controlIcon}
                        type={
                          callType === 'video'
                            ? 'iconzhuanyuyin'
                            : 'iconzhuanshipin'
                        }
                      />
                    }
                  />
                  <span>
                    {callType === 'video' ? '视频转音频' : '音频转视频'}
                  </span>
                </div>
              ) : null}
              {localInfo?.audio === 1 || localInfo?.audio === 4 ? (
                <div className={styles.localControlBtns}>
                  <Button
                    disabled={!!localInfo?.hangUp}
                    onClick={() =>
                      roomkit
                        .getInRoomService()
                        .getInRoomAudioController()
                        .muteMyAudio(true)
                    }
                    type="text"
                    icon={
                      <IconFont
                        className={styles.controlIcon}
                        type="iconyx-tv-voice-onx"
                      />
                    }
                  />
                  <span>静音</span>
                </div>
              ) : (
                <div className={styles.localControlBtns}>
                  <Button
                    disabled={!!localInfo?.hangUp}
                    onClick={() =>
                      roomkit
                        .getInRoomService()
                        .getInRoomAudioController()
                        .muteMyAudio(false)
                    }
                    type="text"
                    icon={
                      <IconFont
                        className={styles.controlIcon}
                        type="iconyx-tv-voice-offx"
                      />
                    }
                  />
                  <span>解除静音</span>
                </div>
              )}
              {
                <DeviceList
                  data={[
                    {
                      title: '请选择扬声器',
                      type: 'speaker',
                      value: speakerId,
                      list: speakerList,
                      onChange: ({ deviceId }) => {
                        setSpeakerId(deviceId);
                        roomkit
                          .getInRoomService()
                          .getInRoomAudioController()
                          .selectPlayoutDevice(deviceId);
                      },
                    },
                    {
                      title: '请选择麦克风',
                      type: 'microphone',
                      list: micList,
                      value: micId,
                      onChange: ({ deviceId }) => {
                        setMicId(deviceId);
                        roomkit
                          .getInRoomService()
                          .getInRoomAudioController()
                          .selectRecordDevice(deviceId);
                      },
                    },
                  ]}
                  postion={{
                    bottom: '270px',
                    left: '38%',
                  }}
                  visible={micVisible}
                />
              }
              <Button
                disabled={
                  !!localInfo?.hangUp ||
                  // [2, 3].includes(localInfo?.audio || 0) ||
                  virtualCameraEnabled ||
                  state.enableAI
                }
                className={styles.deviceBtn}
                type="text"
                onClick={() => setMicVisible((preState: any) => !preState)}
              >
                <IconFont
                  className={styles.deviceIcon}
                  type="icontriangle-up1x"
                />
              </Button>
              {localInfo?.video === 1 || localInfo?.video === 4 ? (
                <div className={styles.localControlBtns}>
                  <Button
                    disabled={!!localInfo?.hangUp}
                    onClick={() => {
                      // if (
                      //   meetingInfo?.screenSharersAvRoomUid?.includes(
                      //     neMeeting?.avRoomUid?.toString() || '',
                      //   )
                      // ) {
                      //   message.warn('共享屏幕时不能开启/停止视频');
                      //   return;
                      // }
                      roomkit
                        .getInRoomService()
                        .getInRoomVideoController()
                        .muteMyVideo(true);
                    }}
                    type="text"
                    icon={
                      <IconFont
                        className={styles.controlIcon}
                        type="iconyx-tv-video-onx"
                      />
                    }
                  />
                  <span>关闭视频</span>
                </div>
              ) : (
                <div className={styles.localControlBtns}>
                  <Button
                    disabled={!!localInfo?.hangUp}
                    onClick={() => {
                      // if (
                      //   meetingInfo?.screenSharersAvRoomUid?.includes(
                      //     neMeeting?.avRoomUid?.toString() || '',
                      //   )
                      // ) {
                      //   message.warn('共享屏幕时不能开启/停止视频');
                      //   return;
                      // }
                      roomkit
                        .getInRoomService()
                        .getInRoomVideoController()
                        .muteMyVideo(false);
                    }}
                    type="text"
                    icon={
                      <IconFont
                        className={styles.controlIcon}
                        type="iconyx-tv-video-offx"
                      />
                    }
                  />
                  <span>开启视频</span>
                </div>
              )}
              {
                <DeviceList
                  data={[
                    {
                      title: '请选择摄像头',
                      type: 'camera',
                      value: cameraId,
                      list: cameraList,
                      onChange: ({ deviceId }) => {
                        switchCamera(deviceId);
                      },
                    },
                    {
                      title: '视频选项',
                      type: 'camera',
                      list: [],
                      onChange: () => {},
                      onClick: () => setVideoSettingVisible(true),
                    },
                  ]}
                  postion={{
                    bottom: '270px',
                    left: '50%',
                  }}
                  visible={videoVisible}
                />
              }
              <Button
                disabled={
                  !!localInfo?.hangUp ||
                  // [2, 3].includes(localInfo?.video || 0) ||
                  virtualCameraEnabled ||
                  state.enableAI
                }
                className={styles.deviceBtn}
                type="text"
                onClick={() => setVideoVisible((preState: any) => !preState)}
              >
                <IconFont
                  className={styles.deviceIcon}
                  type="icontriangle-up1x"
                />
              </Button>
              <div
                className={`${styles.localControlBtns} ${styles.localControlBtnsEnd}`}
              >
                {localInfo?.roleType === 2 ? (
                  <Button
                    disabled={endMeetingLoading}
                    className={styles.localControlBtnsEndContent}
                    onClick={() => endMeeting()}
                    size="small"
                    type="primary"
                    danger
                  >
                    结束通话
                  </Button>
                ) : (
                  <Button
                    disabled={endMeetingLoading}
                    className={styles.localControlBtnsEndContent}
                    onClick={() => leaveMeeting()}
                    size="small"
                    type="primary"
                    danger
                  >
                    离开通话
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
