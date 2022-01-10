import React from 'react';

import styles from './index.less';

interface IProps {
  children: React.ReactNode;
  visible: boolean;
}

const Mask: React.FC<IProps> = ({ children, visible }) => {
  return (
    <div style={{ display: visible ? 'flex' : 'none' }} className={styles.mask}>
      {children}
    </div>
  );
};

export default Mask;
