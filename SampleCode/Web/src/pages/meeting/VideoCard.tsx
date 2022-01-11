/*
 * @Author: your name
 * @Date: 2021-02-25 17:48:33
 * @LastEditTime: 2021-03-19 22:30:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /App-Finance-Web/src/pages/meeting/VideoCard.tsx
 */

import React, { useMemo } from 'react';
import styles from './index.less';
import IconFont from '@/components/Icon';
import { Dropdown, Menu } from 'antd';
import { memberAction, shareMode } from './enum';
import logger from '@/utils/logger';
import {
  NERoomInfo,
  NERoomMemberInfo,
} from 'kit-room-web/dist/types/src/core/apis';
import RoomKitImpl from 'kit-room-web';

interface menuListDefault {
  type: number;
  label: string;
  handler(): void;
  visible(): boolean;
}

export default React.memo(
  (props: {
    className?: string;
    userInfo: NERoomMemberInfo;
    meetingInfo: Partial<NERoomInfo>;
    roomkit: RoomKitImpl;
  }) => {
    const { className = '', userInfo, meetingInfo = {}, roomkit } = props;

    // const videoRef = useRef<HTMLVideoElement>(null);
    // useEffect(() => {
    //   const cur = videoRef.current as any;
    //   if (streams[uid]?.basicStream?._play) {
    //     streams[uid].basicStream._play.videoDom = cur;
    //   }
    //   if (memberMap[uid]?.screenSharing === 1) {
    //     cur.srcObject = streams[uid]?.screenStream;
    //   } else {
    //     cur.srcObject = streams[uid]?.stream;
    //   }
    //   // logger.log('videoCard', uid, streams[uid]?.stream);
    // }, [streams[uid], uid, memberMap[uid]?.screenSharing]);

    const menuList: Array<menuListDefault> = useMemo(
      () => [
        {
          type: memberAction.shareWhiteShare,
          label: '授权白板互动',
          handler: () => {
            roomkit
              .getInRoomService()
              .getInRoomWhiteboardController()
              .setInteractPrivilege(userInfo.accountId, true)
              .then(() => {
                logger.log('白板授权成功');
              })
              .catch((e: any) => {
                logger.warn('白板授权失败', e);
              });
          },
          visible: () => !userInfo.whiteBoardInteract,
        },
        {
          type: memberAction.cancelShareWhiteShare,
          label: '取消白板互动',
          handler: () => {
            roomkit
              .getInRoomService()
              .getInRoomWhiteboardController()
              .setInteractPrivilege(userInfo.accountId, false)
              .then(() => {
                logger.log('取消白板授权成功');
              })
              .catch((e: any) => {
                logger.warn('取消白板授权失败', e);
              });
          },
          visible: () => !!userInfo.whiteBoardInteract,
        },
      ],
      [roomkit, userInfo],
    );

    const roomInfo = useMemo(() => {
      return roomkit.getInRoomService().getCurrentRoomInfo();
    }, [roomkit]);

    const MoreAction = () => {
      return (
        <Menu>
          {menuList.map(
            (item: menuListDefault) =>
              item.visible() && (
                <Menu.Item key={item.type} onClick={item.handler}>
                  {item.label}
                </Menu.Item>
              ),
          )}
        </Menu>
      );
    };

    const isLocalScreen = useMemo(() => {
      const avRoomUid = roomInfo.avRoomUid || '';
      return (
        meetingInfo.shareMode === shareMode.screen &&
        meetingInfo.screenSharersAvRoomUid &&
        userInfo.avRoomUid === avRoomUid &&
        meetingInfo.screenSharersAvRoomUid.includes(avRoomUid + '')
      );
    }, [roomInfo, userInfo, meetingInfo]);

    return (
      <>
        <div
          id={`video-${userInfo.avRoomUid}`}
          className={`${styles.videoCard} ${className} ${
            !!userInfo.hangUp || isLocalScreen ? styles.graybg : ''
          }`}
        >
          {/* <video
          ref={videoRef}
          autoPlay
          // muted
          className={`${
            (!(memberMap[uid]?.video === 1 || memberMap[uid]?.video === 4) ||
              !!memberMap[uid]?.hangUp ||
              isLocalScreen) &&
            styles.hideVideo
          } ${styles.guestVideo}`}
        ></video> */}
          {!(
            userInfo.video === 1 ||
            userInfo.video === 4 ||
            userInfo.screenSharing === 1
          ) &&
            !userInfo.hangUp && (
              <div className={styles.centerName}>
                <span>{userInfo.nickName}</span>
              </div>
            )}
          {!userInfo.hangUp &&
            meetingInfo.shareMode === shareMode.whiteboard &&
            (meetingInfo.whiteboardAvRoomUid || []).includes(
              (roomInfo.avRoomUid || '').toString(),
            ) &&
            roomInfo.avRoomUid !== userInfo.avRoomUid && (
              <Dropdown
                trigger={['click']}
                className={styles.moreAction}
                placement="bottomRight"
                overlay={MoreAction}
              >
                <IconFont type="iconyx-tv-more1x" />
              </Dropdown>
            )}
          {!!userInfo.hangUp && (
            <div className={styles.centerName}>
              {roomInfo.avRoomUid !== userInfo.avRoomUid ? '对方' : '您'}
              已挂起通话
            </div>
          )}
          {
            <div className={styles.cornerName}>
              <span>{userInfo.nickName}</span>
            </div>
          }
          {isLocalScreen && (
            <div className={styles.centerName}>
              {userInfo.nickName}正在屏幕共享
            </div>
          )}
          {!userInfo.hangUp && (
            <div className={styles.audioStatus}>
              <span>
                {userInfo.audio === 1 || userInfo.audio === 4 ? (
                  <IconFont
                    className={styles.audioStatusOn}
                    type="iconyx-tv-voice-onx"
                  />
                ) : (
                  <IconFont
                    className={styles.audioStatusOff}
                    type="iconyx-tv-voice-offx"
                  />
                )}
              </span>
            </div>
          )}
        </div>
      </>
    );
  },
);
