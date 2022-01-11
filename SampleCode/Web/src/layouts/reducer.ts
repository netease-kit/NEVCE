import {
  NETransportStats,
  NERtcSessionStats,
  NERtcAudioSendStats,
  NERtcVideoSendStats,
  NERtcAudioRecvStats,
  NERtcVideoRecvStats,
  NERtcNetworkQualityInfo,
} from 'kit-room-web/dist/types/src/core/types/services/inRoomService';

export type Step = 'login' | 'server' | 'beCall';

export interface InitialState {
  nickName: string;
  step: Step;
  inService: boolean;
  categories: string[];
  roomId: string;
  enableAI: boolean;
  sessionStats: NERtcSessionStats;
  networkQuality: NERtcNetworkQualityInfo[];
  transportStats: NETransportStats;
  localAudioStats: NERtcAudioSendStats[];
  remoteAudioStats: NERtcAudioRecvStats[];
  localVideoStats: NERtcVideoSendStats[];
  remoteVideoStats: NERtcVideoRecvStats[];
}

export type IDispatch = {
  type: 'update';
  payload: Partial<InitialState>;
};

export const initialState: InitialState = {
  nickName: '坐席昵称',
  step: 'login',
  inService: false,
  categories: [],
  roomId: '',
  enableAI: false,
  sessionStats: {} as NERtcSessionStats,
  networkQuality: [],
  transportStats: {} as NETransportStats,
  localAudioStats: [],
  localVideoStats: [],
  remoteAudioStats: [],
  remoteVideoStats: [],
};

export const reducer = (
  state: InitialState,
  action: IDispatch,
): InitialState => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return { ...state };
  }
};
