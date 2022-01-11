/*
 * @Author: your name
 * @Date: 2021-02-25 19:30:01
 * @LastEditTime: 2021-03-16 13:54:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /App-Finance-Web/src/pages/meeting/NetworkHover.tsx
 */

import React, { useMemo } from 'react';
import styles from './index.less';
import { Table } from 'antd';
import { networkQuality as networkStatus } from './enum';
import { NERoomMemberInfo } from 'kit-room-web/dist/types/src/core/apis';
import {
  NERtcNetworkQualityInfo,
  NERtcAudioSendStats,
  NERtcVideoSendStats,
  NERtcAudioRecvStats,
  NERtcVideoRecvStats,
} from 'kit-room-web/dist/types/src/core/types/services/inRoomService';
import { InitialState } from '@/layouts/reducer';

export interface IProps {
  state: InitialState;
  userId: string;
  users: NERoomMemberInfo[];
}

export default React.memo((props: IProps) => {
  const { userId, users, state } = props;

  const {
    networkQuality = [],
    sessionStats,
    transportStats,
    localVideoStats = [],
    remoteVideoStats = [],
    localAudioStats = [],
    remoteAudioStats = [],
  } = state;

  const columns = [
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: '上行网络状态',
      dataIndex: 'uplinkNetworkQuality',
      key: 'uplinkNetworkQuality',
    },
    {
      title: '下行网络状态',
      dataIndex: 'downlinkNetworkQuality',
      key: 'downlinkNetworkQuality',
    },
    {
      title: '视频帧率',
      dataIndex: 'renderFrameRate',
      key: 'renderFrameRate',
    },
    {
      title: '视频分辨率',
      dataIndex: 'resolution',
      key: 'resolution',
    },
    {
      title: 'RTT时延',
      dataIndex: 'transportDelay',
      key: 'transportDelay',
    },
    {
      title: '语音丢包率',
      dataIndex: 'audioPacketLossRate',
      key: 'audioPacketLossRate',
    },
    {
      title: '视频丢包率',
      dataIndex: 'videoPacketLossRate',
      key: 'videoPacketLossRate',
    },
    {
      title: '视频码率',
      dataIndex: 'videoBitrate',
      key: 'videoBitrate',
    },
    {
      title: '音频码率',
      dataIndex: 'audioBitrate',
      key: 'audioBitrate',
    },
  ];
  const dataLocal = useMemo(() => {
    return [
      {
        title: '网络类型',
        value: transportStats.NetworkType || '--',
      },
      // {
      //   title: '延时',
      //   value: `${transportStats?.txRtt || 0}ms`,
      // },
      {
        title: '上行带宽',
        value: `${sessionStats?.SendBitrate || 0}kb`,
      },
      {
        title: '下行带宽',
        value: `${sessionStats?.RecvBitrate || 0}kb`,
      },
      // {
      //   title: '视频帧率',
      //   value: `${localVideoStats[0]?.CaptureFrameRate || 0}fps`,
      // },
      // {
      //   title: '视频分辨率',
      //   value: `${localVideoStats[0]?.CaptureResolutionWidth || 0}*${
      //     localVideoStats[0]?.CaptureResolutionHeight || 0
      //   }`,
      // },
    ];
  }, [transportStats, sessionStats]);

  const dataSourse = useMemo(() => {
    const arr = users.map((item) => item.accountId);
    const localIndex = arr.findIndex((ele) => ele === userId);
    if (localIndex !== -1) {
      arr.splice(localIndex, 1);
      arr.unshift(userId);
    }
    const res = arr.map((item) => {
      const memberNetworkQuality: NERtcNetworkQualityInfo =
        networkQuality.find((ele: any) => ele.userId === item) ||
        ({} as NERtcNetworkQualityInfo);
      const memberVideoStats =
        item === userId
          ? localVideoStats[0]
          : remoteVideoStats.find((j) => j.userId === item);
      const memberAudioStats =
        item === userId
          ? localAudioStats[0]
          : remoteAudioStats.find((j) => j.userId === item);
      return {
        userId: item,
        nickName: users.find((j) => j.accountId === item)?.nickName || '-',
        uplinkNetworkQuality:
          networkStatus[memberNetworkQuality?.uplinkNetworkQuality],
        downlinkNetworkQuality:
          networkStatus[memberNetworkQuality?.downlinkNetworkQuality],
        resolution: `${
          (memberVideoStats as NERtcVideoSendStats)?.CaptureResolutionWidth ||
          (memberVideoStats as NERtcVideoRecvStats)?.RecvResolutionWidth ||
          0
        }*${
          (memberVideoStats as NERtcVideoSendStats)?.CaptureResolutionHeight ||
          (memberVideoStats as NERtcVideoRecvStats)?.RecvResolutionHeight ||
          0
        }`,
        transportDelay: `${
          (memberVideoStats as NERtcVideoSendStats)?.EncodeDelay ||
          (memberVideoStats as NERtcVideoRecvStats)?.TransportDelay ||
          '--'
        }ms`,
        renderFrameRate: `${
          (memberVideoStats as NERtcVideoSendStats)?.SendFrameRate ||
          (memberVideoStats as NERtcVideoRecvStats)?.RenderFrameRate ||
          '--'
        }fps`,
        audioPacketLossRate: `${
          (memberAudioStats as NERtcAudioRecvStats)?.PacketLossRate || '0'
        }%`,
        audioBitrate: `${
          (memberAudioStats as NERtcAudioRecvStats)?.RecvBitrate ||
          (memberAudioStats as NERtcAudioSendStats)?.SendBitrate ||
          '--'
        }Kbps`,
        videoPacketLossRate: `${
          (memberVideoStats as NERtcVideoRecvStats)?.PacketLossRate || '0'
        }%`,
        videoBitrate: `${
          (memberVideoStats as NERtcVideoRecvStats)?.RecvBitrate ||
          (memberVideoStats as NERtcVideoSendStats)?.SendBitrate ||
          '--'
        }Kbps`,
      };
    });
    return res;
  }, [
    networkQuality,
    localVideoStats,
    remoteVideoStats,
    localAudioStats,
    remoteAudioStats,
    userId,
    users,
  ]);

  return (
    <>
      <div className={styles.networkhover}>
        <div className={styles.localInfo}>
          {dataLocal.map((item) => (
            <p key={item.title}>
              <span className={styles.listTitle}>{item.title}</span>
              <span className={styles.listValue}>{item.value}</span>
            </p>
          ))}
        </div>
        <Table
          rowKey="userId"
          columns={columns}
          dataSource={dataSourse}
          pagination={false}
          scroll={{
            y: 320,
          }}
        />
      </div>
    </>
  );
});
