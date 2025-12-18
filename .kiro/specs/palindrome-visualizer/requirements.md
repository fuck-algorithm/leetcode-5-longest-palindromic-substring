# Requirements Document

## Introduction

本系统是一个算法可视化引擎，用于演示"最长回文子串"问题的解法。系统支持动态规划（DP）和中心扩散法两种算法的分步动画演示，用户可以自定义输入字符串，并通过分镜播放的方式逐步理解算法执行过程。系统采用 TypeScript + React + D3.js 技术栈，以单屏幕应用的形式呈现。

## Glossary

- **Palindrome_Visualizer**: 最长回文子串算法可视化引擎系统
- **DP_Algorithm**: 动态规划算法，使用二维表格记录子串是否为回文
- **Center_Expansion_Algorithm**: 中心扩散算法，从每个可能的中心向两边扩展寻找回文
- **Animation_Step**: 算法执行过程中的单个可视化步骤
- **Playback_Controller**: 控制动画播放、暂停、步进的组件
- **Input_Panel**: 用户输入自定义字符串的面板
- **Visualization_Canvas**: D3.js 渲染算法动画的画布区域

## Requirements

### Requirement 1: 用户输入管理

**User Story:** As a 学习者, I want 输入自定义字符串, so that 我可以观察算法如何处理不同的输入。

#### Acceptance Criteria

1. WHEN 用户在输入框中输入字符串并提交 THEN Palindrome_Visualizer SHALL 验证输入仅包含数字和英文字母
2. WHEN 用户提交有效字符串 THEN Palindrome_Visualizer SHALL 重置当前动画状态并准备新的演示
3. WHEN 用户提交空字符串或无效字符 THEN Palindrome_Visualizer SHALL 显示错误提示并保持当前状态
4. WHEN 用户提交长度超过50个字符的字符串 THEN Palindrome_Visualizer SHALL 显示警告并截断至50个字符
5. THE Palindrome_Visualizer SHALL 提供默认示例字符串 "babad" 作为初始输入

### Requirement 2: 算法选择与切换

**User Story:** As a 学习者, I want 在动态规划和中心扩散法之间切换, so that 我可以比较两种算法的执行过程。

#### Acceptance Criteria

1. THE Palindrome_Visualizer SHALL 提供算法选择器，包含 DP_Algorithm 和 Center_Expansion_Algorithm 两个选项
2. WHEN 用户选择不同算法 THEN Palindrome_Visualizer SHALL 重置动画并显示所选算法的可视化界面
3. WHEN 算法切换时 THEN Palindrome_Visualizer SHALL 保留当前输入字符串
4. THE Palindrome_Visualizer SHALL 默认选择 DP_Algorithm 作为初始算法

### Requirement 3: 动态规划算法可视化

**User Story:** As a 学习者, I want 观看动态规划算法的分步演示, so that 我可以理解 DP 表格的填充过程。

#### Acceptance Criteria

1. WHEN DP_Algorithm 被选中 THEN Visualization_Canvas SHALL 显示一个 n×n 的二维表格（n 为字符串长度）
2. WHEN 动画播放每一步 THEN Visualization_Canvas SHALL 高亮当前正在计算的单元格
3. WHEN 单元格被计算完成 THEN Visualization_Canvas SHALL 用不同颜色标识该子串是否为回文（绿色表示是，灰色表示否）
4. WHILE 动画播放 THEN Visualization_Canvas SHALL 在字符串显示区域高亮当前正在检查的子串
5. WHEN 发现更长的回文子串 THEN Visualization_Canvas SHALL 更新并高亮显示当前最长回文
6. THE Palindrome_Visualizer SHALL 在每一步显示当前步骤的文字说明

### Requirement 4: 中心扩散算法可视化

**User Story:** As a 学习者, I want 观看中心扩散算法的分步演示, so that 我可以理解从中心向两边扩展的过程。

#### Acceptance Criteria

1. WHEN Center_Expansion_Algorithm 被选中 THEN Visualization_Canvas SHALL 显示字符串及其索引位置
2. WHEN 动画播放每一步 THEN Visualization_Canvas SHALL 标记当前扩展中心位置（单字符中心或双字符中心）
3. WHEN 从中心向外扩展 THEN Visualization_Canvas SHALL 用动画箭头或高亮显示左右指针的移动
4. WHEN 扩展过程中字符匹配 THEN Visualization_Canvas SHALL 用绿色高亮匹配的字符对
5. WHEN 扩展过程中字符不匹配或到达边界 THEN Visualization_Canvas SHALL 停止当前中心的扩展并显示结果
6. WHEN 发现更长的回文子串 THEN Visualization_Canvas SHALL 更新并高亮显示当前最长回文
7. THE Palindrome_Visualizer SHALL 在每一步显示当前步骤的文字说明

### Requirement 5: 动画播放控制

**User Story:** As a 学习者, I want 控制动画的播放速度和进度, so that 我可以按自己的节奏学习算法。

#### Acceptance Criteria

1. THE Playback_Controller SHALL 提供播放、暂停、上一步、下一步、重置按钮
2. WHEN 用户点击播放按钮 THEN Palindrome_Visualizer SHALL 自动按设定速度逐步播放动画
3. WHEN 用户点击暂停按钮 THEN Palindrome_Visualizer SHALL 暂停在当前步骤
4. WHEN 用户点击上一步按钮 THEN Palindrome_Visualizer SHALL 回退到前一个 Animation_Step
5. WHEN 用户点击下一步按钮 THEN Palindrome_Visualizer SHALL 前进到下一个 Animation_Step
6. WHEN 用户点击重置按钮 THEN Palindrome_Visualizer SHALL 将动画重置到初始状态
7. THE Playback_Controller SHALL 提供速度滑块，允许用户调整播放速度（0.5x 到 3x）
8. THE Playback_Controller SHALL 显示当前步骤进度（如 "步骤 5/20"）

### Requirement 6: 单屏幕布局

**User Story:** As a 学习者, I want 在单个屏幕内看到所有必要信息, so that 我不需要滚动页面就能完整体验。

#### Acceptance Criteria

1. THE Palindrome_Visualizer SHALL 在单个视口内显示所有组件，无需垂直滚动
2. THE Palindrome_Visualizer SHALL 采用响应式布局，适配不同屏幕尺寸（最小支持 1280×720）
3. THE Palindrome_Visualizer SHALL 将界面划分为：顶部控制区（输入和算法选择）、中部可视化区、底部播放控制区
4. WHEN 窗口尺寸变化 THEN Visualization_Canvas SHALL 自动调整大小以适应可用空间

### Requirement 7: 结果展示

**User Story:** As a 学习者, I want 在动画结束后看到最终结果, so that 我可以验证算法的正确性。

#### Acceptance Criteria

1. WHEN 动画播放完成 THEN Palindrome_Visualizer SHALL 显示最长回文子串的结果
2. WHEN 动画播放完成 THEN Palindrome_Visualizer SHALL 显示算法执行的总步骤数
3. THE Palindrome_Visualizer SHALL 在结果区域高亮显示原字符串中最长回文子串的位置
4. WHEN 存在多个相同长度的最长回文子串 THEN Palindrome_Visualizer SHALL 显示第一个找到的结果

### Requirement 8: 算法步骤数据序列化

**User Story:** As a 开发者, I want 算法步骤能够被序列化和反序列化, so that 动画引擎可以正确回放任意步骤。

#### Acceptance Criteria

1. THE Palindrome_Visualizer SHALL 将算法执行过程转换为 Animation_Step 数组
2. WHEN 序列化 Animation_Step THEN Palindrome_Visualizer SHALL 使用 JSON 格式存储步骤数据
3. WHEN 反序列化 Animation_Step THEN Palindrome_Visualizer SHALL 还原完整的步骤状态
4. THE Palindrome_Visualizer SHALL 为每个 Animation_Step 包含：步骤编号、算法状态、高亮位置、说明文字
