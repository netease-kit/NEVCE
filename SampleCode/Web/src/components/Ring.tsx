import React, { useRef, FC, useEffect } from 'react';

export type RingType = 'call' | 'beCall' | 'timeout' | 'busy' | 'reject' | '';

interface IProps {
  play: boolean;
  type: RingType;
}

const Ring: FC<IProps> = ({ play, type }) => {
  const connectAudioRef = useRef<HTMLAudioElement>(null);
  const noResponseAudioRef = useRef<HTMLAudioElement>(null);
  const peerBusyAudioRef = useRef<HTMLAudioElement>(null);
  const peerRejectAudioRef = useRef<HTMLAudioElement>(null);
  const ringAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const allPause = () => {
      connectAudioRef.current?.pause();
      noResponseAudioRef.current?.pause();
      peerBusyAudioRef.current?.pause();
      peerRejectAudioRef.current?.pause();
      ringAudioRef.current?.pause();
    };
    if (!play || !type) {
      allPause();
      return;
    }
    if (type === 'call') {
      allPause();
      connectAudioRef.current?.play();
    } else if (type === 'beCall') {
      allPause();
      ringAudioRef.current?.play();
    } else if (type === 'busy') {
      allPause();
      peerBusyAudioRef.current?.play();
    } else if (type === 'reject') {
      allPause();
      peerRejectAudioRef.current?.play();
    } else if (type === 'timeout') {
      allPause();
      noResponseAudioRef.current?.play();
    }
  }, [play, type]);

  useEffect(() => {
    const ringHandler = () => {
      ringAudioRef.current?.play();
    };
    connectAudioRef.current?.addEventListener('ended', ringHandler);
    return () => {
      connectAudioRef.current?.removeEventListener('ended', ringHandler);
    };
  }, []);

  return (
    <div>
      <audio
        ref={connectAudioRef}
        src={require('@/assets/audio/avchat_connecting.mp3').default}
        autoPlay={false}
      ></audio>
      <audio
        ref={noResponseAudioRef}
        src={require('@/assets/audio/avchat_no_response.mp3').default}
        autoPlay={false}
      ></audio>
      <audio
        ref={peerBusyAudioRef}
        src={require('@/assets/audio/avchat_peer_busy.mp3').default}
        autoPlay={false}
      ></audio>
      <audio
        ref={peerRejectAudioRef}
        src={require('@/assets/audio/avchat_peer_reject.mp3').default}
        autoPlay={false}
      ></audio>
      <audio
        ref={ringAudioRef}
        src={require('@/assets/audio/avchat_ring.mp3').default}
        loop={true}
        autoPlay={false}
      ></audio>
    </div>
  );
};

export default Ring;
