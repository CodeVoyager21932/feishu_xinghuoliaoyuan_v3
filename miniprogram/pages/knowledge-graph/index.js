// pages/knowledge-graph/index.js
const graphData = require('../../data/graph.js');

Page({
  data: {
    filter: 'all',
    viewMode: 'timeline', // timeline | graph
    showDetail: false,
    selectedNode: {},
    isLoading: true,

    // 画布相关
    canvasWidth: 0,
    canvasHeight: 0,
    scale: 1,
    offsetX: 0,
    offsetY: 0,

    // 图谱数据
    nodes: [],
    edges: [],
    filteredNodes: [],
    filteredEdges: []
  },

  onLoad() {
    this.loadGraphData();
  },

  // 切换视图
  switchView(e) {
    const mode = e.currentTarget.dataset.mode;
    if (mode === this.data.viewMode) return;

    this.setData({ viewMode: mode });

    if (mode === 'graph') {
      // 延迟初始化 Canvas，等待视图渲染
      setTimeout(() => {
        this.initCanvas();
      }, 100);
    }
  },

  // 初始化画布
  async initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#graph-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          const dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);

          this.canvas = canvas;
          this.ctx = ctx;
          this.setData({
            canvasWidth: res[0].width,
            canvasHeight: res[0].height,
            // 重置缩放和平移
            scale: 1,
            offsetX: 0,
            offsetY: 0
          });

          this.drawGraph();
        }
      });
  },

  // 加载图谱数据
  loadGraphData() {
    const { nodes, edges } = graphData;

    // 计算节点位置（时间轴布局）
    const processedNodes = this.calculateNodePositions(nodes);

    // 按时间排序（用于时间轴视图）
    const sortedNodes = [...processedNodes].sort((a, b) => (a.year || 0) - (b.year || 0));

    this.setData({
      nodes: processedNodes,
      edges: edges,
      filteredNodes: sortedNodes,
      filteredEdges: edges,
      isLoading: false
    });
  },

  // 计算节点位置（力导向布局的简化版 + 时间轴约束）
  calculateNodePositions(nodes) {
    // 假设画布大小（用于预计算）
    const width = 750; // rpx
    const height = 1000; // rpx
    const padding = 50;

    // 找出时间范围
    const years = nodes.map(n => n.year).filter(y => y);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearRange = maxYear - minYear;

    // 计算位置
    const processedNodes = nodes.map(node => {
      let x, y;

      if (node.year) {
        // X轴：按时间排列，增加随机扰动避免重叠
        const timeProgress = (node.year - minYear) / yearRange;
        x = padding + timeProgress * (width - padding * 2);

        // Y轴：事件在上半部分，人物在下半部分，正弦波分布
        const wave = Math.sin(timeProgress * Math.PI * 2) * 100;

        if (node.type === 'event') {
          y = height * 0.3 + wave + (Math.random() - 0.5) * 100;
        } else {
          y = height * 0.7 + wave + (Math.random() - 0.5) * 100;
        }
      } else {
        x = width / 2 + (Math.random() - 0.5) * 400;
        y = height / 2 + (Math.random() - 0.5) * 400;
      }

      return {
        ...node,
        x,
        y,
        // 节点大小：根据重要性
        radius: node.importance ? node.importance * 5 + 15 : 20
      };
    });

    return processedNodes;
  },

  // 绘制图谱 (Premium Style)
  drawGraph() {
    if (!this.ctx) return;

    const { ctx } = this;
    const { canvasWidth, canvasHeight, filteredNodes, filteredEdges, scale, offsetX, offsetY } = this.data;

    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 绘制深色背景
    // ctx.fillStyle = '#1a1a1a';
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 保存状态
    ctx.save();

    // 应用缩放和平移
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // 绘制连接线 (Glowing Edges)
    this.drawEdges(filteredEdges, filteredNodes);

    // 绘制节点 (Glowing Nodes)
    this.drawNodes(filteredNodes);

    // 恢复状态
    ctx.restore();
  },

  // 绘制边
  drawEdges(edges, nodes) {
    const { ctx } = this;
    const nodeMap = {};
    nodes.forEach(n => nodeMap[n.id] = n);

    edges.forEach(edge => {
      const source = nodeMap[edge.source];
      const target = nodeMap[edge.target];

      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);

      // 渐变线条
      const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  },

  // 绘制节点
  drawNodes(nodes) {
    const { ctx } = this;

    nodes.forEach(node => {
      // 绘制光晕
      const glowRadius = node.radius * 1.5;
      const gradient = ctx.createRadialGradient(node.x, node.y, node.radius * 0.5, node.x, node.y, glowRadius);

      if (node.type === 'event') {
        gradient.addColorStop(0, 'rgba(211, 47, 47, 0.6)');
        gradient.addColorStop(1, 'rgba(211, 47, 47, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(25, 118, 210, 0.6)');
        gradient.addColorStop(1, 'rgba(25, 118, 210, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 绘制核心
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      if (node.type === 'event') {
        ctx.fillStyle = '#D32F2F';
      } else {
        ctx.fillStyle = '#1976D2';
      }

      ctx.fill();

      // 绘制高光
      ctx.beginPath();
      ctx.arc(node.x - node.radius * 0.3, node.y - node.radius * 0.3, node.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();

      // 绘制边框
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制文字
      if (node.importance > 1 || this.data.scale > 1.2) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.x, node.y + node.radius + 5);
      }
    });
  },

  // 筛选切换
  onFilterChange(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ filter });
    this.applyFilter(filter);
  },

  // 应用筛选
  applyFilter(filter) {
    const { nodes, edges } = this.data;

    let filteredNodes = [];
    let filteredEdges = [];

    if (filter === 'all') {
      filteredNodes = nodes;
      filteredEdges = edges;
    } else {
      filteredNodes = nodes.filter(n => n.era === filter);
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = edges.filter(e =>
        nodeIds.has(e.source) && nodeIds.has(e.target)
      );
    }

    // 重新排序（时间轴视图需要）
    const sortedNodes = [...filteredNodes].sort((a, b) => (a.year || 0) - (b.year || 0));

    this.setData({
      filteredNodes: sortedNodes,
      filteredEdges
    });

    // 如果在图谱模式，重绘
    if (this.data.viewMode === 'graph') {
      this.drawGraph();
    }
  },

  // 节点点击事件 (Timeline View)
  onNodeClick(e) {
    const node = e.currentTarget.dataset.node;
    this.showNodeDetail(node);
  },

  // 触摸开始 (Graph View)
  onTouchStart(e) {
    const touch = e.touches[0];
    this.lastX = touch.x;
    this.lastY = touch.y;
    this.startX = touch.x;
    this.startY = touch.y;
  },

  // 触摸移动 (Graph View)
  onTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = touch.x - this.lastX;
    const deltaY = touch.y - this.lastY;

    this.setData({
      offsetX: this.data.offsetX + deltaX,
      offsetY: this.data.offsetY + deltaY
    });

    this.lastX = touch.x;
    this.lastY = touch.y;

    this.drawGraph();
  },

  // 触摸结束 (Graph View)
  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const distance = Math.sqrt(
      Math.pow(touch.x - this.startX, 2) +
      Math.pow(touch.y - this.startY, 2)
    );

    // 如果移动距离小于10，认为是点击
    if (distance < 10) {
      this.handleCanvasClick(touch.x, touch.y);
    }
  },

  // 处理画布点击
  handleCanvasClick(x, y) {
    const { filteredNodes, scale, offsetX, offsetY } = this.data;

    // 转换坐标
    const canvasX = (x - offsetX) / scale;
    const canvasY = (y - offsetY) / scale;

    // 查找点击的节点
    for (let node of filteredNodes) {
      const distance = Math.sqrt(
        Math.pow(canvasX - node.x, 2) +
        Math.pow(canvasY - node.y, 2)
      );

      // 增加点击判定范围
      if (distance <= node.radius + 10) {
        this.showNodeDetail(node);
        return;
      }
    }
  },

  // 复位图谱
  resetGraph() {
    this.setData({
      scale: 1,
      offsetX: 0,
      offsetY: 0
    });
    this.drawGraph();
  },

  // 显示节点详情
  showNodeDetail(node) {
    this.setData({
      selectedNode: node,
      showDetail: true
    });
  },

  // 隐藏详情
  hideDetail() {
    this.setData({
      showDetail: false
    });
  },

  // 阻止冒泡
  stopPropagation() { },

  // AI详解
  askAI() {
    const { selectedNode } = this.data;
    const question = `请详细介绍${selectedNode.label}`;

    wx.navigateTo({
      url: `/pages/ai-chat/index?question=${encodeURIComponent(question)}`
    });
  }
});
