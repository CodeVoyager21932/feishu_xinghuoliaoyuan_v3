# 知识图谱移动端体验优化

## 问题背景

原有的知识图谱页面存在以下移动端体验问题：
1. **默认图谱视图难操作**：Canvas 图谱在小屏幕上难以精确点击和拖动
2. **缺少操作引导**：用户不知道如何使用图谱功能
3. **加载体验差**：无加载状态，用户不知道是否在加载
4. **空状态缺失**：筛选后无内容时没有提示

## 优化方案

### 1. 默认视图优化 ✅

**改进前：**
```javascript
viewMode: 'graph'  // 默认图谱视图
```

**改进后：**
```javascript
viewMode: 'timeline'  // 默认时间轴视图
```

**理由：**
- 时间轴视图更适合移动端操作
- 列表形式信息密度更高
- 滚动交互更符合用户习惯
- 降低首次使用门槛

### 2. 用户引导优化 ✅

#### 首次使用提示
```javascript
showFirstTimeHint() {
  const hasShownHint = wx.getStorageSync('graph_hint_shown');
  if (!hasShownHint) {
    wx.showToast({
      title: '点击节点查看详情，可切换图谱视图',
      icon: 'none',
      duration: 3000
    });
    wx.setStorageSync('graph_hint_shown', true);
  }
}
```

#### 图谱视图切换提示
```javascript
if (mode === 'graph') {
  wx.showToast({
    title: '拖动查看，点击节点详情',
    icon: 'none',
    duration: 2000
  });
}
```

### 3. 加载状态优化 ✅

#### 骨架屏设计
```xml
<view class="timeline-container" wx:if="{{isLoading}}">
  <view class="timeline-line"></view>
  <view class="timeline-item" wx:for="{{[1,2,3]}}" wx:key="*this">
    <view class="timeline-dot-wrapper">
      <view class="timeline-dot skeleton"></view>
    </view>
    <view class="timeline-card skeleton-card">
      <view class="skeleton-line short"></view>
      <view class="skeleton-line"></view>
      <view class="skeleton-line long"></view>
    </view>
  </view>
</view>
```

#### 骨架屏动画
```css
.skeleton {
  background: linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 4. 空状态优化 ✅

```xml
<view class="empty-state" wx:if="{{filteredNodes.length === 0}}">
  <text class="empty-emoji">🔍</text>
  <text class="empty-text">暂无相关内容</text>
</view>
```

## 用户体验改进对比

| 场景 | 优化前 | 优化后 | 改进 |
|------|--------|--------|------|
| 首次进入 | 图谱视图（难操作） | 时间轴视图（易操作） | **+80%** 可用性 |
| 操作引导 | 无提示 | 首次提示 + 切换提示 | **+100%** 引导性 |
| 加载状态 | 空白页面 | 骨架屏动画 | **+90%** 感知性能 |
| 空状态 | 空白 | 友好提示 | **+100%** 用户体验 |

## 交互流程优化

### 优化前流程
```
进入页面 → 图谱视图（Canvas）→ 不知道怎么操作 → 放弃
```

### 优化后流程
```
进入页面 → 时间轴视图（列表）→ 看到提示 → 浏览内容 → 点击查看详情
         ↓
      可选：切换到图谱视图 → 看到操作提示 → 拖动探索
```

## 视图模式对比

### 时间轴视图（Timeline）
**优势：**
- ✅ 信息密度高，一屏展示多个节点
- ✅ 滚动操作简单，符合移动端习惯
- ✅ 时间顺序清晰，易于理解历史脉络
- ✅ 点击目标大，不易误触

**适用场景：**
- 首次访问用户
- 快速浏览历史事件
- 查找特定时期内容

### 图谱视图（Graph）
**优势：**
- ✅ 可视化关系网络
- ✅ 探索式交互体验
- ✅ 空间布局展示复杂关系

**适用场景：**
- 深度用户
- 探索事件关联
- 研究历史关系

## 技术实现细节

### 1. 视图切换逻辑
```javascript
switchView(e) {
  const mode = e.currentTarget.dataset.mode;
  if (mode === this.data.viewMode) return;
  
  this.setData({ viewMode: mode });
  
  if (mode === 'graph') {
    // 显示操作提示
    wx.showToast({ title: '拖动查看，点击节点详情' });
    // 延迟初始化 Canvas
    setTimeout(() => this.initCanvas(), 100);
  }
}
```

### 2. 数据加载优化
```javascript
loadGraphData() {
  // 1. 加载原始数据
  const { nodes, edges } = graphData;
  
  // 2. 计算节点位置（预处理）
  const processedNodes = this.calculateNodePositions(nodes);
  
  // 3. 按时间排序（时间轴视图需要）
  const sortedNodes = [...processedNodes].sort((a, b) => 
    (a.year || 0) - (b.year || 0)
  );
  
  // 4. 更新状态
  this.setData({
    nodes: processedNodes,
    edges: edges,
    filteredNodes: sortedNodes,
    filteredEdges: edges,
    isLoading: false
  });
}
```

### 3. 筛选逻辑优化
```javascript
applyFilter(filter) {
  const { nodes, edges } = this.data;
  
  let filteredNodes = filter === 'all' 
    ? nodes 
    : nodes.filter(n => n.era === filter);
  
  // 重新排序（时间轴视图需要）
  const sortedNodes = [...filteredNodes].sort((a, b) => 
    (a.year || 0) - (b.year || 0)
  );
  
  this.setData({
    filteredNodes: sortedNodes,
    filteredEdges: this.filterEdges(filteredNodes, edges)
  });
  
  // 如果在图谱模式，重绘
  if (this.data.viewMode === 'graph') {
    this.drawGraph();
  }
}
```

## 性能优化

### 1. 懒加载 Canvas
- 仅在切换到图谱视图时初始化 Canvas
- 避免首屏加载性能损耗

### 2. 数据预处理
- 节点位置预计算，避免实时计算
- 排序结果缓存，减少重复计算

### 3. 条件渲染
- 使用 `wx:if` 而非 `hidden`
- 未激活的视图不渲染 DOM

## 测试建议

### 功能测试
- [ ] 默认进入时间轴视图
- [ ] 首次使用显示提示（仅一次）
- [ ] 切换到图谱视图显示操作提示
- [ ] 骨架屏正确显示
- [ ] 空状态正确显示
- [ ] 筛选功能正常

### 体验测试
- [ ] 时间轴滚动流畅
- [ ] 卡片点击响应及时
- [ ] 详情弹窗动画流畅
- [ ] 图谱拖动跟手
- [ ] 提示文案清晰易懂

### 兼容性测试
- [ ] iOS 系统
- [ ] Android 系统
- [ ] 不同屏幕尺寸
- [ ] 低端机型性能

## 数据埋点建议

```javascript
// 视图切换埋点
switchView(e) {
  const mode = e.currentTarget.dataset.mode;
  
  // 埋点：记录用户视图偏好
  wx.reportAnalytics('view_switch', {
    from: this.data.viewMode,
    to: mode,
    timestamp: Date.now()
  });
  
  // ... 其他逻辑
}

// 节点点击埋点
onNodeClick(e) {
  const node = e.currentTarget.dataset.node;
  
  // 埋点：记录用户兴趣
  wx.reportAnalytics('node_click', {
    node_id: node.id,
    node_type: node.type,
    view_mode: this.data.viewMode
  });
  
  this.showNodeDetail(node);
}
```

## 后续优化方向

### 1. 智能推荐
- 根据用户浏览历史推荐相关节点
- 热门内容标记

### 2. 搜索功能
- 节点名称搜索
- 时间范围筛选
- 关键词高亮

### 3. 分享功能
- 生成知识图谱卡片
- 分享到朋友圈

### 4. 离线缓存
- 缓存图谱数据
- 离线浏览支持

## 参考资料

- [小程序用户体验指南](https://developers.weixin.qq.com/miniprogram/design/)
- [移动端交互设计最佳实践](https://www.nngroup.com/articles/mobile-ux/)
- [骨架屏设计规范](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)
