import React, { FC, useState } from 'react';
import styles from './index.less';
import { Switch, message } from 'antd';
import logger from '@/utils/logger';
import { Agent } from 'vce-sdk-web';
import config from '@/config';

interface IProps {
  inService: boolean;
  showSwitch: boolean;
  nickName: string;
  categoryList: string[];
  onServiceChange: (inService: boolean) => void;
  disabled?: boolean;
  agent: Agent;
}

const Header: FC<IProps> = ({
  inService,
  showSwitch,
  nickName,
  categoryList,
  onServiceChange,
  disabled = false,
  agent,
}) => {
  const [loading, setLoading] = useState(false);

  const onlineHandler = () => {
    setLoading(true);
    agent
      .checkin(categoryList)
      .then(() => {
        onServiceChange(true);
        message.success('开启服务成功！');
      })
      .catch((err) => {
        message.error('客服上线失败');
        logger.log('客服上线失败: ', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const offlineHandler = () => {
    setLoading(true);
    agent
      .checkout(true)
      .then(() => {
        onServiceChange(false);
        message.success('关闭服务成功！');
      })
      .catch((err) => {
        message.error('客服下线失败');
        logger.log('客服下线失败：', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.header}>
      {config.scene.title}
      {showSwitch ? (
        <div className={styles.headerSwitch}>
          <Switch
            loading={loading}
            checked={inService}
            disabled={disabled}
            onChange={() => {
              inService ? offlineHandler() : onlineHandler();
            }}
          />
          <span className={styles.headerSwitchText}>{nickName}</span>
        </div>
      ) : null}
    </div>
  );
};

export default Header;
