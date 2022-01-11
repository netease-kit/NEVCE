import React, { useMemo, useState, Dispatch, FC, useEffect } from 'react';
import { Input, Button, Divider, Checkbox } from 'antd';
import { IDispatch, InitialState } from '@/layouts/reducer';

import styles from './index.less';
import { useCallback } from 'react';
import config from '@/config';

interface IProps {
  state: InitialState;
  dispatch: Dispatch<IDispatch>;
  loginLoading: boolean;
  logoutLoading: boolean;
  saveLoading: boolean;
  // acceptLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  accept: () => void;
  reject: () => void;
  saveSetting: (nickName: string) => void;
  categoryList: { label: string; value: string }[];
}

const Login: FC<IProps> = ({
  state,
  dispatch,
  loginLoading,
  logoutLoading,
  saveLoading,
  // acceptLoading,
  login,
  logout,
  accept,
  reject,
  saveSetting,
  categoryList,
}) => {
  const [username, setUsername] = useState('19500000004');
  const [password, setPassword] = useState('123456789');
  const [tempNickName, setTempNickName] = useState('坐席昵称');

  const { step, inService, categories, nickName, enableAI } = state;

  useEffect(() => {
    setTempNickName(nickName);
  }, [nickName]);

  const loginKeyPress = useCallback(
    (event) => {
      login(username, password);
    },
    [login, username, password],
  );

  const loginContent = useMemo(
    () => (
      <>
        {config.scene.showLogo ? (
          <img
            className={styles.logo}
            src={require('@/assets/images/logo.png')}
            alt=""
          />
        ) : (
          <div className={styles.logo}></div>
        )}
        <Input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          onPressEnter={loginKeyPress}
          placeholder="用户名"
          bordered={false}
          maxLength={16}
          allowClear
        />
        <Divider style={{ margin: '0 0 20px' }} />
        <Input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          onPressEnter={loginKeyPress}
          placeholder="密码"
          bordered={false}
          maxLength={16}
          allowClear
        />
        <Divider style={{ margin: '0 0 115px' }} />
        <Button
          onClick={() => {
            login(username, password);
          }}
          type="primary"
          className={styles.loginButton}
          loading={loginLoading}
        >
          登录
        </Button>
      </>
    ),
    [username, password, loginLoading, login, loginKeyPress],
  );

  const serverContent = useMemo(
    () => (
      <>
        {inService ? (
          <div className={styles.onlineTip}>服务开启中，等待客户呼入</div>
        ) : (
          <div className={styles.offlineTip}>
            服务已关闭，暂时不接受客户呼入
          </div>
        )}
        <Input
          value={tempNickName}
          onChange={(e) => {
            setTempNickName(e.target.value);
          }}
          disabled={inService}
          placeholder="坐席昵称"
          bordered={false}
          allowClear
        />
        <Divider style={{ margin: '0 0 20px' }} />
        <div className={styles.typesTip}>业务受理类型</div>
        <Checkbox.Group
          value={categories}
          onChange={(value) => {
            dispatch({
              type: 'update',
              payload: { categories: value as string[] },
            });
          }}
          disabled={inService}
        >
          {categoryList.map((item, index) => (
            <div
              key={item.value}
              className={index !== 0 ? styles.categoryItem : ''}
            >
              <Checkbox value={item.value}>{item.label}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>
        <div className={styles.typesTip} style={{ marginTop: 15 }}>
          数字人模式
        </div>
        <div>
          <Checkbox
            checked={enableAI}
            disabled={inService}
            onChange={(e) => {
              dispatch({
                type: 'update',
                payload: {
                  enableAI: e.target.checked,
                },
              });
            }}
          >
            开启数字人模式
          </Checkbox>
        </div>
        <div className={styles.serverButtons}>
          <Button
            className={styles.onlineButton}
            onClick={() => {
              saveSetting(tempNickName);
            }}
            type="primary"
            loading={saveLoading}
            disabled={inService || !tempNickName}
          >
            保存设置
          </Button>
          <Button
            className={styles.logoutButton}
            onClick={logout}
            type="primary"
            loading={logoutLoading}
            danger
          >
            退出登录
          </Button>
        </div>
      </>
    ),
    [
      tempNickName,
      categories,
      inService,
      categoryList,
      logoutLoading,
      saveLoading,
      logout,
      saveSetting,
      dispatch,
      enableAI,
    ],
  );

  const beCallContent = useMemo(
    () => (
      <>
        <div className={styles.beCallText}>有客户呼入，请接听…</div>
        <img
          className={styles.beCallIcon}
          src={require('@/assets/images/user-icon.png')}
          alt=""
        />
        <div className={styles.buttonGroup}>
          <Button
            className={styles.rejectButton}
            onClick={reject}
            type="primary"
            danger
          >
            拒接
          </Button>
          <Button
            // loading={acceptLoading}
            className={styles.acceptButton}
            onClick={accept}
            type="primary"
          >
            接听
          </Button>
        </div>
      </>
    ),
    [accept, reject],
  );

  return (
    <div className={styles.content}>
      {step === 'server'
        ? serverContent
        : step === 'beCall'
        ? beCallContent
        : loginContent}
    </div>
  );
};

export default Login;
