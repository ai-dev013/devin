import { useCallback, useRef, useEffect, useState } from 'react';

const BGM_TRACKS: Record<string, string> = {
  title: 'https://assets.mixkit.co/music/preview/mixkit-medieval-show-fanfare-announcement-226.mp3',
  village: 'https://assets.mixkit.co/music/preview/mixkit-forest-treasure-138.mp3',
  forest: 'https://assets.mixkit.co/music/preview/mixkit-deep-in-the-jungle-518.mp3',
  cave: 'https://assets.mixkit.co/music/preview/mixkit-dark-ambient-horror-suspense-2398.mp3',
  mountain: 'https://assets.mixkit.co/music/preview/mixkit-epic-orchestra-transition-2290.mp3',
  darkCastle: 'https://assets.mixkit.co/music/preview/mixkit-dark-ambient-horror-suspense-2398.mp3',
  battle: 'https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3',
  boss: 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3',
  victory: 'https://assets.mixkit.co/music/preview/mixkit-game-level-completed-2059.mp3',
  gameover: 'https://assets.mixkit.co/music/preview/mixkit-sad-game-over-trombone-471.mp3',
  ending: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
};

const SFX_TRACKS: Record<string, string> = {
  attack: 'https://assets.mixkit.co/active_storage/sfx/2785/2785-preview.mp3',
  magic: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  heal: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  hit: 'https://assets.mixkit.co/active_storage/sfx/2803/2803-preview.mp3',
  levelup: 'https://assets.mixkit.co/active_storage/sfx/1997/1997-preview.mp3',
  item: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
  select: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  cursor: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  door: 'https://assets.mixkit.co/active_storage/sfx/2858/2858-preview.mp3',
  chest: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
};

export function useAudio() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const sfxRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [currentBgm, setCurrentBgm] = useState<string>('');
  const [bgmVolume, setBgmVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const playBgm = useCallback((trackId: string, loop: boolean = true) => {
    if (currentBgm === trackId && bgmRef.current && !bgmRef.current.paused) {
      return;
    }

    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }

    const trackUrl = BGM_TRACKS[trackId];
    if (!trackUrl) {
      console.warn(`BGM track not found: ${trackId}`);
      return;
    }

    const audio = new Audio(trackUrl);
    audio.loop = loop;
    audio.volume = isMuted ? 0 : bgmVolume;
    
    audio.play().catch(err => {
      console.log('BGM autoplay blocked:', err);
    });

    bgmRef.current = audio;
    setCurrentBgm(trackId);
  }, [currentBgm, bgmVolume, isMuted]);

  const stopBgm = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
    setCurrentBgm('');
  }, []);

  const pauseBgm = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
    }
  }, []);

  const resumeBgm = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.play().catch(err => {
        console.log('BGM resume blocked:', err);
      });
    }
  }, []);

  const playSfx = useCallback((trackId: string) => {
    const trackUrl = SFX_TRACKS[trackId];
    if (!trackUrl) {
      console.warn(`SFX track not found: ${trackId}`);
      return;
    }

    let audio = sfxRefs.current.get(trackId);
    
    if (!audio) {
      audio = new Audio(trackUrl);
      sfxRefs.current.set(trackId, audio);
    }

    audio.volume = isMuted ? 0 : sfxVolume;
    audio.currentTime = 0;
    
    audio.play().catch(err => {
      console.log('SFX play blocked:', err);
    });
  }, [sfxVolume, isMuted]);

  const setMasterVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setBgmVolume(clampedVolume * 0.6);
    setSfxVolume(clampedVolume);
    
    if (bgmRef.current) {
      bgmRef.current.volume = isMuted ? 0 : clampedVolume * 0.6;
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      
      if (bgmRef.current) {
        bgmRef.current.volume = newMuted ? 0 : bgmVolume;
      }
      
      return newMuted;
    });
  }, [bgmVolume]);

  useEffect(() => {
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
      sfxRefs.current.forEach(audio => {
        audio.pause();
      });
      sfxRefs.current.clear();
    };
  }, []);

  return {
    playBgm,
    stopBgm,
    pauseBgm,
    resumeBgm,
    playSfx,
    setMasterVolume,
    toggleMute,
    isMuted,
    currentBgm,
    bgmVolume,
    sfxVolume,
  };
}
