import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameAudioState {
  // Audio elements
  backgroundMusic: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  errorSound: HTMLAudioElement | null;
  clickSound: HTMLAudioElement | null;
  
  // Settings
  isMuted: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  
  // Current state
  currentTrack: string | null;
  isLoading: boolean;
  
  // Actions
  initializeAudio: () => void;
  toggleMute: () => void;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  playSuccess: () => void;
  playError: () => void;
  playClick: () => void;
  playBackgroundMusic: (trackName?: string) => void;
  stopBackgroundMusic: () => void;
  fadeToTrack: (trackName: string, duration?: number) => void;
}

export const useGameAudio = create<GameAudioState>()(
  subscribeWithSelector((set, get) => ({
    backgroundMusic: null,
    successSound: null,
    errorSound: null,
    clickSound: null,
    
    isMuted: false,
    masterVolume: 0.7,
    musicVolume: 0.5,
    sfxVolume: 0.8,
    
    currentTrack: null,
    isLoading: false,
    
    initializeAudio: async () => {
      console.log('Initializing game audio system...');
      set({ isLoading: true });
      
      try {
        // Load sound effects
        const successSound = new Audio('/sounds/success.mp3');
        const errorSound = new Audio('/sounds/hit.mp3'); // Using hit.mp3 for error
        const backgroundMusic = new Audio('/sounds/background.mp3');
        
        // Configure audio elements
        backgroundMusic.loop = true;
        backgroundMusic.volume = get().musicVolume * get().masterVolume;
        
        successSound.volume = get().sfxVolume * get().masterVolume;
        errorSound.volume = get().sfxVolume * get().masterVolume;
        
        // Pre-load audio files
        await Promise.all([
          loadAudio(successSound),
          loadAudio(errorSound),
          loadAudio(backgroundMusic)
        ]);
        
        set({
          backgroundMusic,
          successSound,
          errorSound,
          isLoading: false
        });
        
        console.log('Audio system initialized successfully');
        
        // Start background music
        get().playBackgroundMusic('background');
        
      } catch (error) {
        console.error('Failed to initialize audio system:', error);
        set({ isLoading: false });
      }
    },
    
    toggleMute: () => {
      const newMutedState = !get().isMuted;
      set({ isMuted: newMutedState });
      
      const state = get();
      
      if (state.backgroundMusic) {
        state.backgroundMusic.muted = newMutedState;
      }
      
      console.log(`Audio ${newMutedState ? 'muted' : 'unmuted'}`);
    },
    
    setMasterVolume: (volume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      set({ masterVolume: clampedVolume });
      
      // Update all audio volumes
      const state = get();
      updateAudioVolumes(state);
      
      console.log(`Master volume set to: ${(clampedVolume * 100).toFixed(0)}%`);
    },
    
    setMusicVolume: (volume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      set({ musicVolume: clampedVolume });
      
      const state = get();
      if (state.backgroundMusic) {
        state.backgroundMusic.volume = clampedVolume * state.masterVolume;
      }
      
      console.log(`Music volume set to: ${(clampedVolume * 100).toFixed(0)}%`);
    },
    
    setSfxVolume: (volume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      set({ sfxVolume: clampedVolume });
      
      const state = get();
      updateSfxVolumes(state);
      
      console.log(`SFX volume set to: ${(clampedVolume * 100).toFixed(0)}%`);
    },
    
    playSuccess: () => {
      const state = get();
      
      if (state.isMuted || !state.successSound) {
        return;
      }
      
      try {
        state.successSound.currentTime = 0;
        state.successSound.play().catch(error => {
          console.log('Success sound play prevented:', error);
        });
      } catch (error) {
        console.error('Error playing success sound:', error);
      }
    },
    
    playError: () => {
      const state = get();
      
      if (state.isMuted || !state.errorSound) {
        return;
      }
      
      try {
        state.errorSound.currentTime = 0;
        state.errorSound.play().catch(error => {
          console.log('Error sound play prevented:', error);
        });
      } catch (error) {
        console.error('Error playing error sound:', error);
      }
    },
    
    playClick: () => {
      const state = get();
      
      if (state.isMuted || !state.clickSound) {
        return;
      }
      
      try {
        state.clickSound.currentTime = 0;
        state.clickSound.play().catch(error => {
          console.log('Click sound play prevented:', error);
        });
      } catch (error) {
        console.error('Error playing click sound:', error);
      }
    },
    
    playBackgroundMusic: (trackName: string = 'background') => {
      const state = get();
      
      if (state.isMuted || !state.backgroundMusic) {
        return;
      }
      
      if (state.currentTrack === trackName) {
        return; // Already playing this track
      }
      
      try {
        state.backgroundMusic.currentTime = 0;
        state.backgroundMusic.play().catch(error => {
          console.log('Background music play prevented:', error);
        });
        
        set({ currentTrack: trackName });
        console.log(`Playing background music: ${trackName}`);
        
      } catch (error) {
        console.error('Error playing background music:', error);
      }
    },
    
    stopBackgroundMusic: () => {
      const state = get();
      
      if (state.backgroundMusic) {
        state.backgroundMusic.pause();
        state.backgroundMusic.currentTime = 0;
        set({ currentTrack: null });
        console.log('Background music stopped');
      }
    },
    
    fadeToTrack: (trackName: string, duration: number = 2000) => {
      const state = get();
      
      if (!state.backgroundMusic || state.isMuted) {
        return;
      }
      
      // Simple fade implementation
      const startVolume = state.backgroundMusic.volume;
      const targetVolume = state.musicVolume * state.masterVolume;
      const steps = 20;
      const stepTime = duration / steps;
      let currentStep = 0;
      
      const fadeOut = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const currentVolume = startVolume * (1 - progress);
        
        if (state.backgroundMusic) {
          state.backgroundMusic.volume = Math.max(0, currentVolume);
        }
        
        if (currentStep >= steps) {
          clearInterval(fadeOut);
          
          // Switch track and fade in
          get().playBackgroundMusic(trackName);
          
          // Fade in new track
          let fadeInStep = 0;
          const fadeIn = setInterval(() => {
            fadeInStep++;
            const progress = fadeInStep / steps;
            const currentVolume = targetVolume * progress;
            
            if (state.backgroundMusic) {
              state.backgroundMusic.volume = Math.min(targetVolume, currentVolume);
            }
            
            if (fadeInStep >= steps) {
              clearInterval(fadeIn);
            }
          }, stepTime);
        }
      }, stepTime);
    }
  }))
);

// Helper functions
function loadAudio(audio: HTMLAudioElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const handleCanPlay = () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      resolve();
    };
    
    const handleError = () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      reject(new Error(`Failed to load audio: ${audio.src}`));
    };
    
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    
    // Start loading
    audio.load();
  });
}

function updateAudioVolumes(state: GameAudioState) {
  const masterVolume = state.masterVolume;
  
  if (state.backgroundMusic) {
    state.backgroundMusic.volume = state.musicVolume * masterVolume;
  }
  
  updateSfxVolumes(state);
}

function updateSfxVolumes(state: GameAudioState) {
  const sfxVolume = state.sfxVolume * state.masterVolume;
  
  if (state.successSound) {
    state.successSound.volume = sfxVolume;
  }
  
  if (state.errorSound) {
    state.errorSound.volume = sfxVolume;
  }
  
  if (state.clickSound) {
    state.clickSound.volume = sfxVolume;
  }
}

// Custom hook for easy access to audio functions
export function useAudioEffects() {
  const { playSuccess, playError, playClick } = useGameAudio();
  
  return {
    playSuccess,
    playError: playError, // Renamed for clarity
    playHit: playError, // Alias for backwards compatibility
    playClick
  };
}

// Subscribe to mute changes to update localStorage
useGameAudio.subscribe((state) => {
  localStorage.setItem('game-audio-settings', JSON.stringify({
    isMuted: state.isMuted,
    masterVolume: state.masterVolume,
    musicVolume: state.musicVolume,
    sfxVolume: state.sfxVolume
  }));
});

// Load audio settings from localStorage on initialization
const savedSettings = localStorage.getItem('game-audio-settings');
if (savedSettings) {
  try {
    const settings = JSON.parse(savedSettings);
    useGameAudio.setState({
      isMuted: settings.isMuted ?? false,
      masterVolume: settings.masterVolume ?? 0.7,
      musicVolume: settings.musicVolume ?? 0.5,
      sfxVolume: settings.sfxVolume ?? 0.8
    });
  } catch (error) {
    console.error('Failed to load audio settings:', error);
  }
}
