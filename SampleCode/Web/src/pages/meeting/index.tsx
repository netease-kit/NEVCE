import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  MouseEvent,
  Dispatch,
  FC,
} from 'react';
import { history } from 'umi';
import config from '@/config';
import { Button, message, Popover, Upload, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import IconFont from '@/components/Icon';
import { Chatroom } from 'kit-chatroom-web';
import { shareMode } from './enum';
import MeetingMain from './MeetingMain';
import ServiceModal from '@/components/ServiceModal';
import ProfileModal from '@/components/ProfileModal';
import { IDispatch, InitialState } from '@/layouts/reducer';
import logger from '@/utils/logger';
import { Agent } from 'vce-sdk-web';
import {
  NERoomInfo,
  NERoomMemberInfo,
} from 'kit-room-web/dist/types/src/core/apis';
import { appSettings } from '@/apis';
import defaultVirtualBg from '@/assets/images/base64.js';
import { sleep } from '@/utils/utils';

import styles from './index.less';

const AI_CAMERA_NAME = 'ConnectEase AI camera';
const VIRTUAL_CAMERA_NAME = 'UnityCam';

interface IProps {
  state: InitialState;
  dispatch: Dispatch<IDispatch>;
  agent: Agent;
  guestCode: string;
  guestName: string;
  categoryList: { label: string; value: string }[];
}

const Meeting: FC<IProps> = ({
  agent,
  guestCode,
  guestName,
  categoryList,
  dispatch,
  state,
}) => {
  const { nickName, roomId, enableAI } = state;

  const [showForwardModal, setshowForwardModal] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [queueupLoading, setQueueupLoading] = useState<boolean>(false);
  const [micList, setMicList] = useState<
    Array<{ deviceId: string; label: string }>
  >([]);
  const [cameraList, setCameraList] = useState<
    Array<{ deviceId: string; label: string }>
  >([]);
  const [speakerList, setSpeakerList] = useState<
    Array<{ deviceId: string; label: string }>
  >([]);
  const [micId, setMicId] = useState<string>('');
  const [cameraId, setCameraId] = useState<string>('');
  const [speakerId, setSpeakerId] = useState<string>('');
  const [micVisible, setMicVisible] = useState<boolean>(false);
  const [videoVisible, setVideoVisible] = useState<boolean>(false);
  const [videoSettingVisible, setVideoSettingVisible] = useState<boolean>(
    false,
  );
  const wbRef = useRef<HTMLIFrameElement>(null); // ??????ref
  const [meetingInfo, setMeetingInfo] = useState<Partial<NERoomInfo>>({}); // ????????????
  const [users, setUsers] = useState<NERoomMemberInfo[]>([]);
  const [screenShareLoading, setScreenShareLoading] = useState<boolean>(false);
  const [wbShareLoading, setWbShareLoading] = useState<boolean>(false);
  const [hangUpLoading, setHangUpLoading] = useState<boolean>(false);
  const [endMeetingLoading, setEndMeetingLoading] = useState<boolean>(false);
  const [chatroomVisible, setChatroomVisible] = useState(false);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');
  const [localReady, setLocalReady] = useState(false);
  const [beautyEnabled, setBeautyEnabled] = useState(false);
  const [virtualEnabled, setVirtualEnabled] = useState(false);
  const [virtualCameraEnabled, setVirtualCameraEnabled] = useState(false);
  const [curVirtualBg, setCurVirtualBg] = useState<number | undefined>(
    undefined,
  );
  const [virtualBgList, setVirtualBgList] = useState<string[]>(
    defaultVirtualBg,
  );

  const roomkit = useMemo(() => {
    return agent.getRoomKit();
  }, [agent]);

  const localInfo = roomkit?.getInRoomService().getMyUserInfo();

  const goBack = () => {
    dispatch({
      type: 'update',
      payload: {
        step: 'server',
        roomId: '',
      },
    });
    setChatroomVisible(false);
    history.push({
      pathname: '/',
    });
  };

  useEffect(() => {
    (async () => {
      if (!roomId) {
        history.push({
          pathname: '/',
        });
        return;
      }
      if (agent && roomkit) {
        const inRoomService = roomkit.getInRoomService();
        logger.log('????????? inRoomService');
        inRoomService.off('onRoomUserJoin');
        inRoomService.off('onRoomUserLeave');
        inRoomService.off('onRoomUserStreamAdded');
        inRoomService.off('onRoomUserStreamRemove');
        inRoomService.off('onRoomUserStreamSubscribed');
        inRoomService.off('onRoomUserHangup');
        inRoomService.off('onRoomUserVideoStatusChanged');
        inRoomService.off('onRoomUserAudioStatusChanged');
        inRoomService.off('onRoomUserScreenShareStatusChanged');
        inRoomService.off('onWhiteboardStatusChanged');
        inRoomService.off('onTransportStats');
        inRoomService.off('onSessionStats');
        inRoomService.off('onNetworkQuality');
        inRoomService.off('onLocalVideoStats');
        inRoomService.off('onLocalAudioStats');
        inRoomService.off('onRemoteVideoStats');
        inRoomService.off('onRemoteAudioStats');
        inRoomService.off('onRtcChannelClosed');
        inRoomService.off('onRtcClientBanned');

        inRoomService.on('onRoomUserJoin', ({ userList }) => {
          logger.log('????????????', userList);
          setUsers([...inRoomService.getAllUsers()]);
        });
        inRoomService.on('onRoomUserLeave', ({ userList }) => {
          logger.log('????????????', userList);
          setUsers([...inRoomService.getAllUsers()]);
        });
        inRoomService.on('onRoomUserStreamAdded', async (event) => {
          logger.log('onRoomUserStreamAdded ??????????????????', event);
          await inRoomService
            .getInRoomVideoController()
            .subscribeRemoteVideo(
              event.userId || '',
              true,
              event.stream.getId(),
            );
          setUsers([...inRoomService.getAllUsers()]);
        });
        inRoomService.on('onRoomUserStreamRemove', (event) => {
          logger.log('onRoomUserStreamRemove ??????????????????');
          setUsers([...inRoomService.getAllUsers()]);
        });
        inRoomService.on('onRoomUserStreamSubscribed', async (event) => {
          logger.log('onRoomUserStreamSubscribed ????????????', event);
          const uid = event.stream.getId();
          const remoteView = document.getElementById(`video-${uid}`);
          if (remoteView) {
            await inRoomService
              .getInRoomVideoController()
              .attachRendererToUserVideoStream(remoteView, event.userId, uid);
          }
        });
        inRoomService.on('onRoomUserHangup', ({ userId, hangUp }) => {
          setUsers([...inRoomService.getAllUsers()]);
          if (inRoomService.isMySelf(userId)) {
            inRoomService
              .getInRoomVideoController()
              .muteMyVideo(hangUp ? true : false);
            inRoomService
              .getInRoomAudioController()
              .muteMyAudio(hangUp ? true : false);
          }
        });
        inRoomService.on('onRoomCallTypeChanged', async ({ callType }) => {
          const videoController = inRoomService.getInRoomVideoController();
          const audioController = inRoomService.getInRoomAudioController();
          try {
            if (callType === 'video') {
              await videoController.muteMyVideo(false);
              // await audioController.muteMyAudio(true);
            } else if (callType === 'audio') {
              await videoController.muteMyVideo(true);
              await audioController.muteMyAudio(false);
            }
            setCallType(callType);
          } catch (error) {
            logger.error('onRoomCallTypeChanged fail: ', error);
          }
        });
        inRoomService.on('onRoomUserVideoStatusChanged', () => {
          setUsers([...inRoomService.getAllUsers()]);
        });
        inRoomService.on('onRoomUserAudioStatusChanged', () => {
          setUsers([...inRoomService.getAllUsers()]);
        });
        inRoomService.on('onRoomUserScreenShareStatusChanged', () => {
          updateInfoFromOrigin();
        });
        inRoomService.on('onWhiteboardStatusChanged', () => {
          updateInfoFromOrigin();
        });
        inRoomService.on('onTransportStats', (stats) => {
          dispatch({
            type: 'update',
            payload: {
              transportStats: stats,
            },
          });
        });
        inRoomService.on('onSessionStats', (stats) => {
          dispatch({
            type: 'update',
            payload: {
              sessionStats: stats,
            },
          });
        });
        inRoomService.on('onNetworkQuality', (stats) => {
          dispatch({
            type: 'update',
            payload: {
              networkQuality: stats,
            },
          });
        });
        inRoomService.on('onLocalVideoStats', (stats) => {
          dispatch({
            type: 'update',
            payload: {
              localVideoStats: stats,
            },
          });
        });
        inRoomService.on('onLocalAudioStats', (stats) => {
          dispatch({
            type: 'update',
            payload: {
              localAudioStats: stats,
            },
          });
        });
        inRoomService.on('onRemoteVideoStats', (stats) => {
          dispatch({
            type: 'update',
            payload: {
              remoteVideoStats: stats,
            },
          });
        });
        inRoomService.on('onRemoteAudioStats', (stats) => {
          dispatch({
            type: 'update',
            payload: {
              remoteAudioStats: stats,
            },
          });
        });
        inRoomService.on('onRtcChannelClosed', () => {
          goBack();
        });
        inRoomService.on('onRtcChannelDisconnected', () => {
          goBack();
        });
        inRoomService.on('onRtcClientBanned', () => {
          goBack();
        });

        try {
          await agent.accept();
          if (wbRef.current) {
            inRoomService.getInRoomWhiteboardController().init({
              debug: true,
              otherWindow: wbRef.current.contentWindow as Window,
              origin: config.wbTargetUrl,
            });
          }
          setChatroomVisible(true);
          getDevice();
          await updateInfoFromOrigin();
          const localView = document.getElementById(
            `video-${inRoomService.getMyUserInfo()?.avRoomUid}`,
          );
          if (localView && inRoomService.getMyUserId()) {
            await inRoomService
              .getInRoomVideoController()
              .attachRendererToUserVideoStream(
                localView,
                inRoomService.getMyUserId() as string,
                // roomkit.getRtcImpl().localStream.getId(),
              );
            setLocalReady(true);
          }
        } catch (error) {
          message.error('??????????????????');
          console.error('??????????????????: ', error);
        }
      }
    })();
  }, [agent, roomkit, roomId]);

  const switchCamera = useCallback(
    (value: string) => {
      setCameraId(value);
      return roomkit
        ?.getInRoomService()
        .getInRoomVideoController()
        .switchCamera(value);
    },
    [roomkit],
  );

  useEffect(() => {
    (async () => {
      if (roomkit && enableAI) {
        try {
          const videoController = roomkit
            .getInRoomService()
            .getInRoomVideoController();
          const cameras = await videoController.enumCameraDevices();
          if (localReady) {
            const aiCamera = cameras.find((item) =>
              item.label.includes(AI_CAMERA_NAME),
            );
            aiCamera && (await switchCamera(aiCamera.deviceId));
            await roomkit.getRtcImpl().open('video');
          }
        } catch (error) {
          logger.error('?????????????????????????????????', error);
        }
      }
    })();
  }, [roomkit, enableAI, localReady, switchCamera]);

  // useEffect(() => {
  //   const listenPopState = (event: PopStateEvent) => {
  //     logger.log(
  //       'location: ' +
  //         document.location +
  //         ', state: ' +
  //         JSON.stringify(event.state),
  //       event,
  //     );
  //     window.history.pushState(null, '', document.URL);
  //   };
  //   setVideoProfile({
  //     resolution: webRTC2.VIDEO_QUALITY_720p,
  //     frameRate: webRTC2.CHAT_VIDEO_FRAME_RATE_25,
  //   });
  //   window.history.pushState(null, '', document.URL);
  //   window.addEventListener('popstate', listenPopState);
  //   return () => {
  //     window.removeEventListener('popstate', listenPopState);
  //     dispatch({
  //       type: 'update',
  //       payload: {
  //         step: 'server',
  //       },
  //     });
  //   };
  // }, []);

  const openVirtualCamera = useCallback(
    async (enable: boolean) => {
      try {
        if (roomkit) {
          const videoController = roomkit
            .getInRoomService()
            .getInRoomVideoController();
          const cameras = await videoController.enumCameraDevices();
          if (enable) {
            const vrCamera = cameras.find((item) =>
              item.label.includes(VIRTUAL_CAMERA_NAME),
            );
            vrCamera && (await switchCamera(vrCamera.deviceId));
          } else {
            const someCamera = cameras.find(
              (item) =>
                !item.label.includes(VIRTUAL_CAMERA_NAME) &&
                !item.label.includes(AI_CAMERA_NAME),
            );
            someCamera && (await switchCamera(someCamera.deviceId));
          }
        }
      } catch (error) {
        logger.error('????????????????????????????????????', error);
      }
    },
    [roomkit, switchCamera],
  );

  // ????????????ok
  const handleForwardOK = async (value: string) => {
    await agent
      .transfer(value)
      .then(() => {
        message.success('????????????');
      })
      .catch((err) => {
        if (err?.code === 2000) {
          message.error('????????????????????????');
        } else {
          message.error('????????????');
        }
        logger.error('????????????: ', err);
      });
  };
  // ??????????????????
  const handleForwardCancel = () => {
    setshowForwardModal(false);
  };
  // ????????????
  const inviteHandler = (value: string) => {
    setQueueupLoading(true);
    agent
      .invite(value)
      .then(() => {
        message.success('?????????????????????????????????');
        setShowInviteModal(false);
      })
      .catch((err) => {
        if (err?.code === 2000) {
          message.error('????????????????????????');
        } else {
          message.error('????????????');
        }
        logger.log('????????????: ', err);
      })
      .finally(() => {
        setQueueupLoading(false);
      });
  };

  // ??????????????????
  const handleSettingCancel = () => {
    setVideoSettingVisible(false);
  };

  const updateInfoFromOrigin = useCallback(async () => {
    try {
      const res = await roomkit
        ?.getInRoomService()
        .getCurrentRoomInfoWithMembers();
      if (res) {
        setMeetingInfo(res.meeting || {});
        setUsers(res.members || []);
      }
    } catch (error) {
      logger.error('getCurrentRoomInfoWithMembers fail: ', error);
      throw error;
    }
  }, [roomkit]);

  const renderPopover = useCallback(() => {
    return (
      <div className={styles.virtualImageContainer}>
        {virtualBgList.map((item, index) => (
          <div
            key={item.substr(-100)}
            className={`${styles.virtualImageButton} ${
              curVirtualBg === index ? styles.cur : ''
            }`}
            onClick={async () => {
              if (curVirtualBg === index) {
                await appSettings({
                  enableCamera: beautyEnabled,
                  enableVirtualBackground: false,
                });
                setCurVirtualBg(undefined);
                setVirtualEnabled(false);
                if (virtualCameraEnabled !== beautyEnabled) {
                  await openVirtualCamera(beautyEnabled);
                  setVirtualCameraEnabled(beautyEnabled);
                }
                message.success('????????????????????????');
              } else {
                if (virtualCameraEnabled !== true) {
                  await openVirtualCamera(true);
                  await sleep(1000);
                }
                await appSettings({
                  enableCamera: true,
                  enableVirtualBackground: true,
                  virtualBackground: item,
                });
                setCurVirtualBg(index);
                setVirtualEnabled(true);
                if (virtualCameraEnabled !== true) {
                  setVirtualCameraEnabled(true);
                }
                message.success('????????????????????????');
              }
            }}
          >
            <Image src={item} preview={false} />
          </div>
        ))}
        <Upload
          beforeUpload={(file) => {
            const isLt = file.size / 1024 / 1024 < 5;
            if (!isLt) {
              message.error('????????????????????????5M');
            }
            return isLt;
          }}
          showUploadList={false}
          accept=".jpg,.png,.jpeg"
          action={(file): any => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const vl = virtualBgList.concat(reader.result as string);
              setVirtualBgList(vl);
              message.success('??????????????????');
            };
            reader.onerror = (error) => {
              message.error('??????????????????');
              throw error;
            };
          }}
        >
          <div className={styles.virtualImageButton}>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>?????????</div>
          </div>
        </Upload>
      </div>
    );
  }, [
    beautyEnabled,
    curVirtualBg,
    virtualBgList,
    virtualCameraEnabled,
    openVirtualCamera,
  ]);

  const staffBtns = useMemo(
    () => [
      {
        msg: '????????????',
        loading: screenShareLoading,
        icon: 'iconyx-tv-sharescreen1x',
        handleClick: () => {
          if (localInfo?.hangUp) {
            message.warn('????????????????????????');
            return;
          }
          if (
            meetingInfo.shareMode &&
            [
              shareMode.screen,
              shareMode.whiteboard,
              shareMode.mixedModel,
            ].includes(meetingInfo.shareMode)
          ) {
            message.warn('???????????????????????????????????????');
            return;
          }
          // if (meetingInfo.shareMode === shareMode.whiteboard) {
          //   message.warn('????????????????????????????????????');
          //   return;
          // }
          setScreenShareLoading(true);
          // if (localInfo.video === 1 || localInfo.video === 4) {
          //   neMeeting.muteLocalVideo(false);
          // }
          roomkit
            ?.getInRoomService()
            ?.getInRoomScreenShareController()
            ?.startScreenShare()
            .then(() => {
              logger.log('??????????????????');
              updateInfoFromOrigin();
            })
            .catch((e: any) => {
              logger.error('??????????????????: ', e);
              if ([1, 4].includes(localInfo?.video || 0)) {
                roomkit
                  ?.getInRoomService()
                  ?.getInRoomVideoController()
                  ?.muteMyVideo(false);
              }
              switch (true) {
                case e?.message?.includes(
                  'possibly because the user denied permission',
                ):
                  message.error(
                    '??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
                  );
                  break;
                case e?.message?.includes('Permission denied by system') ||
                  e?.message?.includes('NotAllowedError'):
                  message.error(
                    // '???????????????????????????????????????????????????-???????????????-??????-???????????????????????????????????????????????????',
                    '??????????????????????????????????????????',
                  );
                  break;
                case e?.message?.includes('Permission denied'):
                  message.error('????????????????????????');
                  break;
                default:
                  message.error(e.msg || '??????????????????');
                  break;
              }
            })
            .finally(() => {
              setScreenShareLoading(false);
            });
        },
        isShow: () =>
          !meetingInfo?.screenSharersAvRoomUid?.includes(
            localInfo?.avRoomUid?.toString() || '',
          ),
      },
      {
        msg: '????????????',
        icon: 'iconyx-tv-sharescreen1x',
        loading: screenShareLoading,
        handleClick: () => {
          setScreenShareLoading(true);
          roomkit
            ?.getInRoomService()
            .getInRoomScreenShareController()
            .stopScreenShare()
            .then(() => {
              if ([1, 4].includes(localInfo?.video || 0)) {
                roomkit
                  ?.getInRoomService()
                  .getInRoomVideoController()
                  .muteMyVideo(false);
              }
              updateInfoFromOrigin();
            })
            .catch((e: any) => {
              logger.error('????????????????????????: ', e);
            })
            .finally(() => {
              setScreenShareLoading(false);
            });
        },
        isShow: () =>
          meetingInfo?.screenSharersAvRoomUid?.includes(
            localInfo?.avRoomUid?.toString() || '',
          ),
      },
      {
        msg: '????????????',
        loading: wbShareLoading,
        icon: 'icongongxiangwenjian',
        handleClick: () => {
          if (localInfo?.hangUp) {
            message.warn('????????????????????????');
            return;
          }
          if (
            meetingInfo.shareMode &&
            [
              shareMode.screen,
              shareMode.whiteboard,
              shareMode.mixedModel,
            ].includes(meetingInfo.shareMode)
          ) {
            message.warn('???????????????????????????????????????');
            return;
          }
          setWbShareLoading(true);
          roomkit
            ?.getInRoomService()
            .getInRoomWhiteboardController()
            .enableWhiteboard(true)
            .catch((e: any) => {
              message.error(e.msg || '??????????????????');
            })
            .finally(() => {
              setTimeout(() => {
                setWbShareLoading(false);
              }, 1500);
            });
        },
        isShow: () =>
          !meetingInfo?.whiteboardAvRoomUid?.includes(
            localInfo?.avRoomUid?.toString() || '',
          ),
      },
      {
        msg: '??????????????????',
        icon: 'icongongxiangwenjian',
        loading: wbShareLoading,
        handleClick: () => {
          setWbShareLoading(true);
          roomkit
            ?.getInRoomService()
            .getInRoomWhiteboardController()
            .enableWhiteboard(false)
            .catch((e: any) => {
              message.error(e.msg || '????????????????????????');
            })
            .finally(() => {
              setTimeout(() => {
                setWbShareLoading(false);
              }, 1500);
            });
        },
        isShow: () =>
          meetingInfo?.whiteboardAvRoomUid?.includes(
            localInfo?.avRoomUid?.toString() || '',
          ),
      },
      {
        msg: '??????',
        icon: 'iconzhuanjie',
        handleClick: () => {
          if (
            localInfo?.accountId &&
            !roomkit?.getInRoomService().isHostUser(localInfo.accountId)
          ) {
            message.warn('???????????????');
            return;
          }
          if (users.every((item) => item.memberTag !== 'guest')) {
            message.error('????????????????????????');
            return;
          }
          setshowForwardModal(true);
        },
        isShow: () => true,
      },
      {
        msg: config.scene.inviteAgent,
        icon: 'iconyaoqingzuoxi',
        handleClick: () => {
          setShowInviteModal(true);
        },
        isShow: () => true,
      },
      {
        msg: '????????????',
        icon: 'icontonghuaguaqi',
        loading: hangUpLoading,
        handleClick: () => {
          if (
            meetingInfo?.screenSharersAvRoomUid?.includes(
              localInfo?.avRoomUid?.toString() || '',
            )
          ) {
            message.warn('????????????????????????');
            return;
          }
          if (
            meetingInfo?.whiteboardAvRoomUid?.includes(
              localInfo?.avRoomUid?.toString() || '',
            )
          ) {
            message.warn('????????????????????????');
            return;
          }
          setHangUpLoading(true);
          roomkit
            ?.getInRoomService()
            .hangUp(true)
            .then(() => {
              if ([1, 4].includes(localInfo?.audio || 0)) {
                roomkit
                  ?.getInRoomService()
                  .getInRoomAudioController()
                  .muteMyAudio(true);
              }
              if ([1, 4].includes(localInfo?.video || 0)) {
                roomkit
                  ?.getInRoomService()
                  .getInRoomVideoController()
                  .muteMyVideo(true);
              }
            })
            .finally(() => {
              setHangUpLoading(false);
            });
        },
        isShow: () => !localInfo?.hangUp,
      },
      {
        msg: '??????????????????',
        icon: 'icontonghuaguaqi',
        loading: hangUpLoading,
        handleClick: () => {
          setHangUpLoading(true);
          roomkit
            ?.getInRoomService()
            .hangUp(false)
            .then(() => {
              if ([1, 4].includes(localInfo?.audio || 0)) {
                roomkit
                  ?.getInRoomService()
                  .getInRoomAudioController()
                  .muteMyAudio(false);
              }
              if ([1, 4].includes(localInfo?.video || 0)) {
                roomkit
                  ?.getInRoomService()
                  .getInRoomVideoController()
                  .muteMyVideo(false);
              }
            })
            .finally(() => {
              setHangUpLoading(false);
            });
        },
        isShow: () => !!localInfo?.hangUp,
      },
      {
        msg: '????????????',
        icon: 'iconbendiluzhi',
        handleClick: () => {
          message.info('????????????');
        },
        isShow: () => true,
      },
      {
        msg: '????????????',
        icon: 'iconshishipaizhao',
        handleClick: () => {
          const userInfo = users.find((item) => item.memberTag === 'guest');
          if (!userInfo) {
            message.error('??????????????????????????????');
            return;
          }
          const { accountId, avRoomUid } = userInfo;
          roomkit
            ?.getInRoomService()
            .getInRoomVideoController()
            .takeSnapshot(accountId, {
              name: accountId,
              uid: avRoomUid,
              mediaType: 'video',
            });
        },
        isShow: () => true,
      },
      {
        msg: '????????????',
        icon: 'iconfengxiantishi',
        handleClick: () => {
          message.info('????????????');
        },
        isShow: () => true,
      },
      {
        msg: '????????????',
        icon: 'iconbeijing',
        popover: () => {
          return renderPopover();
        },
        disabled: state.enableAI || [2, 3].includes(localInfo?.video || 0),
        isShow: () => true,
      },
      {
        msg: beautyEnabled ? '????????????' : '????????????',
        icon: 'iconkaiqimeiyan',
        handleClick: async () => {
          if (beautyEnabled) {
            await appSettings({
              enableBeauty: false,
              enableCamera: virtualEnabled,
            });
            setBeautyEnabled(false);
            if (virtualCameraEnabled !== virtualEnabled) {
              await openVirtualCamera(virtualEnabled);
              setVirtualCameraEnabled(virtualEnabled);
            }
            message.success('??????????????????');
          } else {
            if (virtualCameraEnabled !== true) {
              await openVirtualCamera(true);
              await sleep(1000);
            }
            await appSettings({
              enableBeauty: true,
              enableCamera: true,
            });
            setBeautyEnabled(true);
            if (virtualCameraEnabled !== true) {
              setVirtualCameraEnabled(true);
            }
            message.success('??????????????????');
          }
        },
        disabled: state.enableAI || [2, 3].includes(localInfo?.video || 0),
        isShow: () => true,
      },
    ],
    [
      meetingInfo,
      users,
      roomkit,
      localInfo,
      screenShareLoading,
      wbShareLoading,
      hangUpLoading,
      state.enableAI,
      beautyEnabled,
      virtualEnabled,
      virtualCameraEnabled,
      renderPopover,
      openVirtualCamera,
      updateInfoFromOrigin,
    ],
  );

  const leaveMeeting = async () => {
    setEndMeetingLoading(true);
    try {
      await agent.leaveRoom(false);
      message.success('??????????????????');
    } catch (error) {
      logger.error('leaveMeeting fail: ', error);
      message.error('??????????????????');
    } finally {
      setEndMeetingLoading(false);
      goBack();
    }
  };

  const endMeeting = async () => {
    logger.log('endMeeting start??????');
    setEndMeetingLoading(true);
    try {
      await agent.leaveRoom(true);
      message.success('??????????????????');
      logger.log('endMeeting success');
    } catch (error) {
      logger.error('endMeeting failed: ', error);
    } finally {
      setEndMeetingLoading(false);
      goBack();
    }
  };

  const customerInfo = useMemo(
    () => (
      <>
        <div className={styles.customerInfo}>
          <h3>????????????</h3>
          <p>???????????????{guestName || '--'}</p>
          <p>
            ???????????????
            {categoryList.find((item) => item.value === guestCode)?.label ||
              '--'}
          </p>
        </div>
      </>
    ),
    [categoryList, guestName, guestCode],
  );

  const ShowStaffBtns = useCallback(
    () => (
      <>
        <div className={styles.showStaffBtns}>
          {staffBtns.map((item: any, index: number) => {
            if (item.isShow()) {
              const content = (
                <div key={item.msg} className={styles.staffBtnContent}>
                  <Button
                    className={styles.button}
                    shape="circle"
                    onClick={item.popover ? undefined : item.handleClick}
                    loading={item?.loading}
                    icon={<IconFont type={item.icon} />}
                    disabled={item.disabled}
                  />
                  <p className={styles.buttonMsg}>{item.msg}</p>
                </div>
              );
              if (item.popover && !item.disabled) {
                return (
                  <Popover key={item.msg} content={item.popover}>
                    {content}
                  </Popover>
                );
              }
              return content;
            }
          })}
        </div>
      </>
    ),
    [staffBtns],
  );

  const whiteBoard = useMemo(() => {
    const hasWB = meetingInfo.shareMode === shareMode.whiteboard;
    return (
      <>
        <div className={`${hasWB ? styles.hideWb : ''} ${styles.wbOver}`}>
          <span>????????????????????????????????????</span>
        </div>
        <iframe
          className={`${hasWB ? '' : styles.hideWb}`}
          ref={wbRef}
          src={config.wbTargetUrl}
        ></iframe>
      </>
    );
  }, [meetingInfo]);

  const getDevice = async () => {
    const videoController = roomkit
      ?.getInRoomService()
      .getInRoomVideoController();
    const audioController = roomkit
      ?.getInRoomService()
      .getInRoomAudioController();
    setMicList((await audioController?.enumRecordDevices()) || []);
    setCameraList((await videoController?.enumCameraDevices()) || []);
    setSpeakerList((await audioController?.enumPlayoutDevices()) || []);
    setMicId(audioController?.getRecordDevice() || '');
    setCameraId(videoController?.getSelectedCameraId() || '');
    setSpeakerId(audioController?.getPlayoutDevice() || '');
  };

  const hideAllDeviceChoice = (e: MouseEvent) => {
    e.preventDefault();
    setVideoVisible(false);
    setMicVisible(false);
  };

  const renderChatRoom = useMemo(() => {
    const imImpl = roomkit?.getImImpl();
    const accoutInfo = roomkit?.getAuthService().getAccountInfo();
    const chatRoomId = roomkit?.getInRoomService().getCurrentRoomInfo()
      ?.chatRoomId;
    if (imImpl && imImpl.nim && chatRoomId && chatroomVisible) {
      return (
        <Chatroom
          nim={imImpl.nim}
          appKey={accoutInfo?.imAppKey || ''}
          account={accoutInfo?.imAccid || ''}
          nickName={nickName}
          token={accoutInfo?.imToken || ''}
          chatroomId={chatRoomId}
          imPrivateConf={config?.imPrivateConf}
        />
      );
    }
    return null;
  }, [roomkit, chatroomVisible, nickName]);

  return (
    <>
      <div className={styles.mainPage}>
        {(micVisible || videoVisible) && (
          <div
            className={styles.mainMaskForDevice}
            onMouseUp={hideAllDeviceChoice}
          ></div>
        )}
        <div className={styles.mainPageContent}>
          <aside className={styles.left}>
            {customerInfo}
            <div className={styles.chatRoom}>{renderChatRoom}</div>
          </aside>
          <div className={styles.center}>
            {roomkit && (
              <MeetingMain
                meetingInfo={meetingInfo}
                users={users}
                speakerId={speakerId}
                speakerList={speakerList}
                micList={micList}
                micId={micId}
                micVisible={micVisible}
                cameraId={cameraId}
                cameraList={cameraList}
                videoVisible={videoVisible}
                callType={callType}
                // streams={streams}
                roomkit={roomkit}
                endMeeting={endMeeting}
                endMeetingLoading={endMeetingLoading}
                setSpeakerId={setSpeakerId}
                setMicId={setMicId}
                setMicVisible={setMicVisible}
                switchCamera={switchCamera}
                setVideoSettingVisible={setVideoSettingVisible}
                setVideoVisible={setVideoVisible}
                leaveMeeting={leaveMeeting}
                state={state}
                virtualCameraEnabled={virtualCameraEnabled}
                dispatch={dispatch}
              />
            )}
            <ShowStaffBtns />
          </div>
          <div className={styles.right}>{whiteBoard}</div>
        </div>
      </div>
      <ServiceModal
        title="??????"
        serviceList={categoryList}
        okText="????????????"
        onOk={handleForwardOK}
        onCancel={handleForwardCancel}
        okLoading={endMeetingLoading}
        visible={showForwardModal}
      />
      <ServiceModal
        title="????????????"
        serviceList={categoryList}
        okText={queueupLoading ? '???????????????????????????' : '????????????'}
        onOk={inviteHandler}
        onCancel={() => {
          setShowInviteModal(false);
        }}
        okLoading={queueupLoading}
        visible={showInviteModal}
      />
      {roomkit ? (
        <ProfileModal
          roomkit={roomkit}
          cameraId={cameraId}
          cameraList={cameraList}
          onCameraChange={switchCamera}
          visible={videoSettingVisible}
          onClose={handleSettingCancel}
        />
      ) : null}
    </>
  );
};

export default Meeting;
