import React from 'react';
import { Modal, Radio, message, ButtonProps, Button } from 'antd';

import styles from './index.less';

interface IProps {
  title: string;
  onOk: (value: string) => void;
  onOk2?: () => void;
  serviceList: { label: string; value: string }[];
  okText?: string;
  ok2Text?: string;
  onCancel: () => void;
  width?: number;
  visible?: boolean;
  okLoading?: boolean;
  ok2Loading?: boolean;
}

const radioStyle: React.CSSProperties = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const ServiceModal: React.FC<IProps> = ({
  onOk,
  onOk2,
  onCancel,
  width = 400,
  visible = false,
  title,
  okText = '确定',
  ok2Text = '确定',
  serviceList = [],
  okLoading = false,
  ok2Loading = false,
}) => {
  const [checkValue, setCheckValue] = React.useState<string>('');

  const okHandler = () => {
    if (!checkValue) {
      message.error('请选择某一业务');
      return;
    }
    onOk(checkValue);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      width={width}
      centered
      className={styles.forwardModal}
      footer={null}
    >
      <p>选择需要{title}的业务</p>
      <Radio.Group
        value={checkValue}
        onChange={(e) => setCheckValue(e.target.value)}
      >
        {serviceList.map((item) => (
          <Radio style={radioStyle} key={item.value} value={item.value}>
            {item.label}
          </Radio>
        ))}
      </Radio.Group>
      <footer className={styles.forwardFooter}>
        <Button
          shape="round"
          type="primary"
          className={styles.forwardFooterBtn}
          onClick={okHandler}
          loading={okLoading}
        >
          {okText}
        </Button>
        {!!onOk2 && (
          <Button
            shape="round"
            type="default"
            className={styles.forwardFooterBtn}
            onClick={onOk2}
            loading={ok2Loading}
          >
            {ok2Text}
          </Button>
        )}
      </footer>
    </Modal>
  );
};

export default ServiceModal;
