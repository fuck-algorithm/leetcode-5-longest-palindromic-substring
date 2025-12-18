import { useState, useCallback, useRef, useEffect } from 'react';
import { AlgorithmType, AnimationState, VisualizationStep } from '../types';
import { DPAlgorithmExecutor } from '../algorithms/dp';
import { CenterExpansionExecutor } from '../algorithms/centerExpansion';

const DEFAULT_SPEED = 1;
const MIN_SPEED = 0.5;
const MAX_SPEED = 3;
const BASE_INTERVAL = 1000;

export function useAnimationController() {
  const [state, setState] = useState<AnimationState>({
    input: 'babad',
    algorithm: 'center-expansion',
    steps: [],
    currentStepIndex: 0,
    isPlaying: false,
    playbackSpeed: DEFAULT_SPEED,
    isComplete: false,
  });

  const intervalRef = useRef<number | null>(null);

  const clearPlayInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const initialize = useCallback((input: string, algorithm: AlgorithmType) => {
    clearPlayInterval();
    
    const executor = algorithm === 'dp' 
      ? new DPAlgorithmExecutor() 
      : new CenterExpansionExecutor();
    
    const steps = executor.execute(input);

    setState({
      input,
      algorithm,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      playbackSpeed: state.playbackSpeed,
      isComplete: false,
    });
  }, [clearPlayInterval, state.playbackSpeed]);

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    clearPlayInterval();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, [clearPlayInterval]);

  const nextStep = useCallback(() => {
    setState(prev => {
      const newIndex = Math.min(prev.currentStepIndex + 1, prev.steps.length - 1);
      return {
        ...prev,
        currentStepIndex: newIndex,
        isComplete: newIndex === prev.steps.length - 1,
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStepIndex: Math.max(prev.currentStepIndex - 1, 0),
      isComplete: false,
    }));
  }, []);

  const reset = useCallback(() => {
    clearPlayInterval();
    setState(prev => ({
      ...prev,
      currentStepIndex: 0,
      isPlaying: false,
      isComplete: false,
    }));
  }, [clearPlayInterval]);

  const goToStep = useCallback((stepIndex: number) => {
    setState(prev => {
      const clampedIndex = Math.max(0, Math.min(stepIndex, prev.steps.length - 1));
      return {
        ...prev,
        currentStepIndex: clampedIndex,
        isComplete: clampedIndex === prev.steps.length - 1,
      };
    });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    const clampedSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed));
    setState(prev => ({ ...prev, playbackSpeed: clampedSpeed }));
  }, []);

  const getCurrentStep = useCallback((): VisualizationStep | null => {
    return state.steps[state.currentStepIndex] ?? null;
  }, [state.steps, state.currentStepIndex]);

  // 自动播放逻辑
  useEffect(() => {
    if (state.isPlaying && !state.isComplete) {
      const interval = BASE_INTERVAL / state.playbackSpeed;
      intervalRef.current = window.setInterval(() => {
        setState(prev => {
          if (prev.currentStepIndex >= prev.steps.length - 1) {
            clearPlayInterval();
            return { ...prev, isPlaying: false, isComplete: true };
          }
          return {
            ...prev,
            currentStepIndex: prev.currentStepIndex + 1,
            isComplete: prev.currentStepIndex + 1 === prev.steps.length - 1,
          };
        });
      }, interval);
    }

    return clearPlayInterval;
  }, [state.isPlaying, state.playbackSpeed, state.isComplete, clearPlayInterval]);

  // 初始化默认输入
  useEffect(() => {
    initialize('babad', 'center-expansion');
  }, []);

  return {
    state,
    initialize,
    play,
    pause,
    nextStep,
    prevStep,
    reset,
    goToStep,
    setSpeed,
    getCurrentStep,
  };
}
