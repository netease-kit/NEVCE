import React, { useReducer, useEffect, useState, useMemo } from 'react';
import { IRouteComponentProps } from 'umi';
import Header from '@/components/Header';
import { initialState, reducer } from './reducer';
import { changeNickName } from '@/apis';
import config from '@/config';
import { message } from 'antd';
import logger from '@/utils/logger';
import Ring, { RingType } from '@/components/Ring';
import { Agent } from 'vce-sdk-web';
import { NEAccountInfo } from 'kit-room-web/dist/types/src/core/apis';

import 'antd/dist/antd.less';
import './global.less';
import styles from './index.less';

export default function Layout({
  children,
  location,
  route,
  history,
  match,
}: IRouteComponentProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // @ts-ignore
  window.dispatch = dispatch;

  const agent = useMemo(() => {
    const _agent = new Agent();
    _agent.init({
      debug: true,
      appKey: config.appKey,
      baseDomain: config.vceDomain,
      roomkitDomain: config.roomkitDomain,
      scene: config.sceneName,
      neRtcServerAddresses: config?.neRtcServerAddresses,
      imPrivateConf: config?.imPrivateConf,
    });
    return _agent;
  }, []);

  const roomkit = useMemo(() => {
    return agent.getRoomKit();
  }, [agent]);

  // @ts-ignore
  window.roomkit = roomkit;

  const { step, inService, nickName, categories } = state;

  const [loginLoading, setLoginLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<
    { label: string; value: string }[]
  >([]);
  const [ringPlay, setRingPlay] = useState(false);
  const [ringType, setRingType] = useState<RingType>('');
  const [guestCode, setGuestCode] = useState('');
  const [guestName, setGuestName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accountToken, setAccountToken] = useState('');

  useEffect(() => {
    const handler = () => {
      if (step === 'beCall') {
        dispatch({ type: 'update', payload: { step: 'server' } });
      }
    };
    const rejectHandler = async () => {
      if (step === 'beCall') {
        await agent.reject();
      }
    };
    window.addEventListener('beforeunload', rejectHandler);
    window.addEventListener('unload', handler);
    return () => {
      window.removeEventListener('beforeunload', rejectHandler);
      window.removeEventListener('unload', handler);
    };
  }, [step, agent]);

  useEffect(() => {
    (async () => {
      if (step === 'server') {
        const imDisconnectHandler = async (err: any) => {
          if (!err || !err.code) {
            return;
          }
          logger.log('im ???????????????', err);
          if (err.code === 'kicked') {
            message.success('??????????????????????????????????????????????????????');
          } else if (err.code === 'logout') {
            message.success('????????????');
          } else {
            message.error('im ????????????');
          }
          try {
            const res = await Promise.allSettled([
              agent.checkout(true),
              agent.reject(),
              agent.leaveRoom(false),
              agent.logout(),
            ]);
            res.forEach((item) => {
              if (item.status === 'rejected') {
                logger.warn('resetState part fail: ', item.reason);
              }
            });
          } catch (error) {
            logger.error('checkout and leaveRoom and logout fail: ', error);
          } finally {
            setLogoutLoading(false);
            setAccountId('');
            setAccountToken('');
            dispatch({
              type: 'update',
              payload: {
                categories: [],
                step: 'login',
                inService: false,
                nickName: '????????????',
              },
            });
            if (location.pathname !== '/') {
              history.push({
                pathname: '/',
              });
            }
          }
        };

        try {
          const res = await agent.queryGroupList();
          const list = res.categoryList.map((item) => ({
            label: item.desc,
            value: item.code,
          }));
          setCategoryList(list);
          if (!categories.length) {
            dispatch({
              type: 'update',
              payload: { categories: list.map((item) => item.value) },
            });
          }
        } catch (err) {
          message.error('????????????????????????');
          return;
        }

        agent.off('onInviteAgentJoinRoom');
        agent.off('onCallStateChange');
        roomkit?.getImImpl().off('imDisconnect');

        agent.on(
          'onInviteAgentJoinRoom',
          ({ roomId, categoryList, visitorNickname }) => {
            setGuestCode(categoryList[0]);
            setGuestName(visitorNickname);
            dispatch({
              type: 'update',
              payload: {
                step: 'beCall',
                roomId,
              },
            });
            onPlayRing(true, 'beCall');
          },
        );
        agent.on('onCallStateChange', (state) => {
          if (state === 0) {
            setGuestCode('');
            setGuestName('');
            dispatch({
              type: 'update',
              payload: {
                step: 'server',
                roomId: '',
              },
            });
            onPlayRing(false, '');
          }
        });
        roomkit?.getImImpl().on('imDisconnect', (err) => {
          imDisconnectHandler(err);
        });
      }
    })();
  }, [step, agent, roomkit, categories, location.pathname, history]);

  const onLogin = async (username: string, password: string) => {
    setLoginLoading(true);
    let res: NEAccountInfo;
    try {
      res = await agent.login({
        username,
        password,
      });
      message.success('????????????');
    } catch (err) {
      message.error('???????????????' + err.msg);
      logger.log('????????????: ', err);
    } finally {
      setLoginLoading(false);
    }
    // @ts-ignore
    if (!res) {
      return;
    }
    try {
      // ???????????????????????????
      // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      // ?????????????????????????????????????????????????????????
      await agent.checkout(true);
    } catch (err) {
      // message.error('??????????????????');
      logger.log('???????????????????????????????????????', err);
    } finally {
      setAccountId(res.accountId);
      setAccountToken(res.accountToken);
      dispatch({
        type: 'update',
        payload: {
          nickName: res.nickname,
          step: 'server',
        },
      });
    }
  };

  const onSaveSetting = (nickName: string) => {
    setSaveLoading(true);
    changeNickName({
      nickname: nickName,
      accountId,
      accountToken,
    })
      .then(() => {
        message.success('?????????????????????');
        dispatch({ type: 'update', payload: { nickName } });
      })
      .catch((err) => {
        message.error('?????????????????????' + err.msg);
        logger.log('??????????????????: ', err);
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const onLogout = () => {
    setLogoutLoading(true);
    agent
      .logout()
      .catch((err) => {
        message.error('??????????????????');
      })
      .finally(() => {
        setLogoutLoading(false);
      });
  };

  const onAccept = () => {
    // setAcceptLoading(true);
    onPlayRing(false, '');
    dispatch({ type: 'update', payload: { step: 'server' } });
    history.push({
      pathname: '/meeting',
    });
  };

  const onReject = () => {
    agent
      .reject()
      .then(() => {
        onPlayRing(false, '');
        dispatch({ type: 'update', payload: { step: 'server' } });
      })
      .catch((err) => {
        message.error('????????????');
        logger.error('???????????????', err);
      });
  };

  // ????????????
  const onPlayRing = (play: boolean, type: RingType) => {
    logger.log('playRing: ', play, type);
    setRingPlay(play);
    setRingType(type);
  };

  const onServiceChange = (value: boolean) => {
    if (value) {
      dispatch({ type: 'update', payload: { inService: true } });
    } else {
      dispatch({
        type: 'update',
        payload: { inService: false },
      });
      if (location.pathname === '/') {
        // ?????????????????????????????????????????????
        agent.reject().finally(() => {
          dispatch({
            type: 'update',
            payload: { step: 'server' },
          });
        });
      }
    }
  };

  const genProps = () => {
    const baseProps = {
      state,
      dispatch,
    };
    switch (location.pathname) {
      case '/':
        return {
          ...baseProps,
          loginLoading,
          logoutLoading,
          saveLoading,
          categoryList,
          login: onLogin,
          accept: onAccept,
          reject: onReject,
          logout: onLogout,
          saveSetting: onSaveSetting,
        };
      case '/meeting':
        return {
          ...baseProps,
          agent,
          guestCode,
          guestName,
          categoryList,
        };
      default:
        return baseProps;
    }
  };

  return (
    <div className={styles.fullScreen}>
      <Header
        inService={inService}
        nickName={nickName}
        showSwitch={step !== 'login'}
        categoryList={categories}
        disabled={!categories.length || !nickName}
        onServiceChange={onServiceChange}
        agent={agent}
      />
      {/* <Mask visible={imLoading || g2Loading}>
        <Spin style={{ color: 'red' }} size="large" tip="?????????????????????" />
      </Mask> */}
      <Ring play={ringPlay} type={ringType} />
      {React.cloneElement(children, genProps())}
    </div>
  );
}
