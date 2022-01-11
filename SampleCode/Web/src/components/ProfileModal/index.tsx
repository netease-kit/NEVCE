import React, { FC, useMemo, useState } from 'react';
import { Modal, Layout, Menu, Select, Form } from 'antd';
import RoomKitImpl from 'kit-room-web';
import IconFont from '../Icon';
import logger from '@/utils/logger';

import styles from './index.less';

export interface IProps {
  roomkit: RoomKitImpl;
  cameraId: string;
  cameraList: { label: string; deviceId: string }[];
  onCameraChange: (cameraId: string) => void;
  visible: boolean;
  onClose: () => void;
}

const { Sider, Content } = Layout;
const { Option } = Select;

const ProfileModal: FC<IProps> = ({
  roomkit,
  cameraId,
  cameraList,
  onCameraChange,
  visible,
  onClose,
}) => {
  const webRTC2 = useMemo(() => {
    return roomkit.getRtcImpl().WebRTC2;
  }, [roomkit]);

  const [resolution, setResolution] = useState<number>(
    webRTC2.VIDEO_QUALITY_720p,
  );
  const [frameRate, setFrameRate] = useState<number>(
    webRTC2.CHAT_VIDEO_FRAME_RATE_25,
  );

  const handleChangeResolution = async (value: number) => {
    try {
      setResolution(value);
      await roomkit.getRtcImpl().close('video');
      roomkit?.getInRoomService().getInRoomVideoController().setCallProfile({
        resolution: value,
      });
      await roomkit.getRtcImpl().open('video');
    } catch (error) {
      logger.error('handleChangeResolution 失败: ', error);
    }
  };

  const handleChangeFrameRate = async (value: number) => {
    try {
      setFrameRate(value);
      await roomkit.getRtcImpl().close('video');
      roomkit?.getInRoomService().getInRoomVideoController().setCallProfile({
        frameRate: value,
      });
      await roomkit.getRtcImpl().open('video');
    } catch (error) {
      logger.error('handleChangeFrameRate 失败: ', error);
    }
  };

  return (
    <Modal
      title="视频选项"
      visible={visible}
      width={800}
      centered
      onCancel={onClose}
      className={styles.settingModal}
      footer={null}
    >
      <Layout>
        <Sider width={160} className={styles.settingSide}>
          <Menu selectedKeys={['video']}>
            <Menu.Item key="video" className={styles.settingMenuItem}>
              <IconFont type="iconyx-tv-video-onx" />
              视频
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className={styles.settingContent}>
          {
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              colon={false}
            >
              <Form.Item label="摄像头">
                <Select value={cameraId} onChange={onCameraChange}>
                  {cameraList.map((item) => (
                    <Option key={item.deviceId} value={item.deviceId}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="帧率">
                <Select
                  placeholder="默认"
                  value={frameRate}
                  onChange={handleChangeFrameRate}
                >
                  <Option value={webRTC2.CHAT_VIDEO_FRAME_RATE_5}>
                    每秒5帧
                  </Option>
                  <Option value={webRTC2.CHAT_VIDEO_FRAME_RATE_10}>
                    每秒10帧
                  </Option>
                  <Option value={webRTC2.CHAT_VIDEO_FRAME_RATE_15}>
                    每秒15帧
                  </Option>
                  <Option value={webRTC2.CHAT_VIDEO_FRAME_RATE_20}>
                    每秒20帧
                  </Option>
                  <Option value={webRTC2.CHAT_VIDEO_FRAME_RATE_25}>
                    每秒25帧
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item label="分辨率">
                <Select
                  value={resolution}
                  placeholder="默认"
                  onChange={handleChangeResolution}
                >
                  <Option value={webRTC2.VIDEO_QUALITY_180p}>320*180</Option>
                  <Option value={webRTC2.VIDEO_QUALITY_480p}>640*480</Option>
                  <Option value={webRTC2.VIDEO_QUALITY_720p}>1280*720</Option>
                  <Option value={webRTC2.VIDEO_QUALITY_1080p}>1920*1080</Option>
                </Select>
              </Form.Item>
            </Form>
          }
        </Content>
      </Layout>
    </Modal>
  );
};

export default ProfileModal;
