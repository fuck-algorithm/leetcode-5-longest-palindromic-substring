// 算法类型枚举
export type AlgorithmType = 'dp' | 'center-expansion';

// 动画步骤基础接口
export interface AnimationStep {
  stepNumber: number;
  totalSteps: number;
  description: string;
  highlightedIndices: number[];
  currentLongestPalindrome: {
    start: number;
    end: number;
    text: string;
  };
}

// DP 算法特有步骤数据
export interface DPAnimationStep extends AnimationStep {
  type: 'dp';
  dpTable: boolean[][];
  currentCell: { row: number; col: number };
  cellState: 'checking' | 'palindrome' | 'not-palindrome';
}

// 中心扩散算法详细状态
export type CenterExpansionDetailedState = 
  | 'init'           // 算法初始化
  | 'select-center'  // 选择新的中心点
  | 'init-pointers'  // 初始化左右指针
  | 'comparing'      // 正在比较字符
  | 'matched'        // 字符匹配
  | 'mismatched'     // 字符不匹配
  | 'prepare-expand' // 准备扩展
  | 'move-pointers'  // 移动指针
  | 'boundary'       // 到达边界
  | 'update-longest' // 更新最长回文
  | 'center-complete'// 当前中心扩展完成
  | 'complete';      // 算法完成

// 中心扩散算法特有步骤数据
export interface CenterExpansionStep extends AnimationStep {
  type: 'center-expansion';
  centerIndex: number;
  centerType: 'single' | 'double';
  leftPointer: number;
  rightPointer: number;
  expandState: 'expanding' | 'matched' | 'mismatched' | 'boundary';
  detailedState?: CenterExpansionDetailedState; // 更详细的状态
}

// 统一步骤类型
export type VisualizationStep = DPAnimationStep | CenterExpansionStep;

// 动画状态
export interface AnimationState {
  input: string;
  algorithm: AlgorithmType;
  steps: VisualizationStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  isComplete: boolean;
}

// 验证结果
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedInput?: string;
}

// 序列化步骤格式
export interface SerializedStep {
  stepNumber: number;
  totalSteps: number;
  description: string;
  highlightedIndices: number[];
  currentLongestPalindrome: {
    start: number;
    end: number;
    text: string;
  };
  algorithmData: DPStepData | CenterExpansionStepData;
}

export interface DPStepData {
  type: 'dp';
  dpTable: boolean[][];
  currentCell: { row: number; col: number };
  cellState: string;
}

export interface CenterExpansionStepData {
  type: 'center-expansion';
  centerIndex: number;
  centerType: string;
  leftPointer: number;
  rightPointer: number;
  expandState: string;
}
