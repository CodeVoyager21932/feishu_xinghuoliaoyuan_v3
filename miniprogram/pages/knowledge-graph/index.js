// pages/knowledge-graph/index.js
const graphData = require('../../data/graph.js');

Page({
  data: {
    filter: 'all',
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
    this.initCanvas();
    this.loadGraphData();
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
            canvasHeight: res[0].height
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
    
    this.setData({
      nodes: processedNodes,
      edges: edges,
      filteredNodes: processedNodes,
      filteredEdges: edges,
      isLoading: false
    });
    
    this.drawGraph();
  },

  // 计算节点位置（时间轴布局）
  calculateNodePositions(nodes) {
    const { canvasWidth, canvasHeight } = this.data;
    const padding = 50;
    const usableWidth = canvasWidth - padding * 2;
    const usableHeight = canvasHeight - padding * 2;
    
    // 找出时间范围
    const years = nodes.map(n => n.year).filter(y => y);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearRange = maxYear - minYear;
    
    // 按类型分组
    const eventNodes = nodes.filter(n => n.type === 'event');
    const personNodes = nodes.filter(n => n.type === 'person');
    
    // 计算位置
    const processedNodes = nodes.map(node => {
      let x, y;
      
      if (node.year) {
        // X轴：按时间排列
        x = padding + ((node.year - minYear) / yearRange) * usableWidth;
        
        // Y轴：事件在上半部分，人物在下半部分
        if (node.type === 'event') {
          y = padding + usableHeight * 0.3 + (Math.random() - 0.5) * 100;
        } else {
          y = padding + usableHeight * 0.7 + (Math.random() - 0.5) * 100;
        }
      } else {
        // 没有年份的节点随机放置
        x = padding + Math.random() * usableWidth;
        y = padding + Math.random() * usableHeight;
      }
      
      return {
        ...node,
        x,
        y,
        radius: node.importance ? node.importance * 4 + 10 : 15
      };
    });
    
    return processedNodes;
  },

  // 绘制图谱
  drawGraph() {
    if (!this.ctx) return;
    
    const { ctx } = this;
    const { canvasWidth, canvasHeight, filteredNodes, filteredEdges, scale, offsetX, offsetY } = this.data;
    
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 保存状态
    ctx.save();
    
    // 应用缩放和平移
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    
    // 绘制边
    this.drawEdges(filteredEdges, filteredNodes);
    
    // 绘制节点
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
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  },

  // 绘制节点
  drawNodes(nodes) {
    const { ctx } = this;
    
    nodes.forEach(node => {
      // 绘制圆形
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      
      // 根据类型设置颜色
      if (node.type === 'event') {
        ctx.fillStyle = '#D32F2F';
      } else if (node.type === 'person') {
        ctx.fillStyle = '#1976D2';
      } else {
        ctx.fillStyle = '#757575';
      }
      
      ctx.fill();
      
      // 绘制边框
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 绘制文字
      ctx.fillStyle = '#212121';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + node.radius + 15);
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
    
    if (filter === 'all') {
      this.setData({
        filteredNodes: nodes,
        filteredEdges: edges
      });
    } else {
      const filteredNodes = nodes.filter(n => n.era === filter);
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      const filteredEdges = edges.filter(e => 
        nodeIds.has(e.source) && nodeIds.has(e.target)
      );
      
      this.setData({
        filteredNodes,
        filteredEdges
      });
    }
    
    this.drawGraph();
  },

  // 触摸开始
  onTouchStart(e) {
    const touch = e.touches[0];
    this.lastX = touch.x;
    this.lastY = touch.y;
    this.startX = touch.x;
    this.startY = touch.y;
  },

  // 触摸移动（拖拽）
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

  // 触摸结束
  onTouchEnd(e) {
    // 判断是点击还是拖拽
    const touch = e.changedTouches[0];
    const distance = Math.sqrt(
      Math.pow(touch.x - this.startX, 2) + 
      Math.pow(touch.y - this.startY, 2)
    );
    
    // 如果移动距离小于10，认为是点击
    if (distance < 10) {
      this.handleNodeClick(touch.x, touch.y);
    }
  },

  // 画布点击
  onCanvasTap(e) {
    this.handleNodeClick(e.detail.x, e.detail.y);
  },

  // 处理节点点击
  handleNodeClick(x, y) {
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
      
      if (distance <= node.radius) {
        this.showNodeDetail(node);
        return;
      }
    }
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
  stopPropagation() {},

  // AI详解
  askAI() {
    const { selectedNode } = this.data;
    const question = `请详细介绍${selectedNode.label}`;
    
    wx.navigateTo({
      url: `/pages/ai-chat/index?question=${encodeURIComponent(question)}`
    });
  }
});
