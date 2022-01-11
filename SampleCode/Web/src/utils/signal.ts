import { SignalController } from '@/lib/NERTCCalling';

let signal: SignalController | undefined;

export const set = (s: any): SignalController => {
  if (!signal) {
    signal = new SignalController(s, {
      debug: true,
    });
  }
  return signal;
};

export const get = (s?: any): SignalController => {
  if (!signal) {
    signal = new SignalController(s, {
      debug: true,
    });
  }
  return signal;
};

export const clear = () => {
  if (signal) {
    signal.destroy();
    signal = undefined;
  }
};
