# 星火小程序开发指南

> 最后更新: 2024-11-20  
> 适用版本: v3.0+

---

## 📋 目录

- [快速开始](#快速开始)
- [开发环境配置](#开发环境配置)
- [项目结构](#项目结构)
- [开发规范](#开发规范)
- [常用命令](#常用命令)
- [调试技巧](#调试技巧)
- [常见问题](#常见问题)
- [部署流程](#部署流程)

---

## 🚀 快速开始

### 前置要求

- **微信开发者工具** >= 1.06.0
- **Node.js** >= 14.0.0 (可选，用于脚本工具)
- **Python** >= 3.6 (可选，用于清理脚本)
- **Git** (版本控制)

### 5分钟上手

1. **克隆项目**
   ```bash
   git clone https://github.com/CodeVoyager21932/feishu_xinghuoliaoyuan_v3.git
   cd feishu_xinghuoliaoyuan_v3
   ```

2. **打开项目**
   - 启动微信开发者工具
   - 导入项目目录: `miniprogram/`
   - 选择测试号或输入 AppID

3. **配置云开发**
   - 在 `miniprogram/app.js` 中配置云环境 ID
   ```javascript
   wx.cloud.init({
     env: 'your-cloud-env-id', // 替换为你的云环境ID
     traceUser: true,
   });
   ```

4. **编译运行**
   - 点击"编译"按钮
   - 在模拟器中查看效果

---

## 🛠️ 开发环境配置

### 1. 微信开发者工具配置

#### 基础设置
```
工具 -> 设置 -> 通用设置
├── 自动保存: ✅ 开启
├── 编译时自动保存: ✅ 开启
└── 修改文件时自动编译: ✅ 开启
```

#### 调试设置
```
工具 -> 设置 -> 调试设置
├── 不校验合法域名: ✅ 开启 (开发阶段)
├── 不校验 TLS 版本: ✅ 开启 (开发阶段)
└── 启用调试: ✅ 开启
```

#### 项目设置
```json
{
  "miniprogramRoot": "miniprogram/",
  "cloudfunctionRoot": "cloud/functions/",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "minified": true
  }
}
```

---

### 2. 云开发环境配置

#### 创建云环境

1. 打开微信开发者工具
2. 点击"云开发"按钮
3. 创建新环境（推荐：开发环境 + 生产环境）
4. 记录环境 ID

#### 配置云函数

```bash
# 进入云函数目录
cd cloud/functions/ai-chat

# 安装依赖
npm install

# 上传云函数
右键云函数 -> 上传并部署：云端安装依赖
```

#### 配置云数据库

参考文档：
- `cloud/database/daily_quotes_init.md`
- `cloud/database/relics_init.md`

---

### 3. API 密钥配置

#### 讯飞星火 API

1. 注册讯飞开放平台账号
2. 创建应用获取 API 密钥
3. 在云函数中配置：

```javascript
// cloud/functions/ai-chat/config.js
module.exports = {
  SPARK_API_KEY: 'your-api-key',
  SPARK_API_SECRET: 'your-api-secret',
  SPARK_APP_ID: 'your-app-id'
};
```

⚠️ **安全提示**: 不要将密钥提交到 Git 仓库

---

## 📁 项目结构

```
feishu_xinghuoliaoyuan_v3/
├── .git/                           # Git 版本控制
├── .kiro/                          # Kiro IDE 配置
│   └── specs/                      # 项目规范文档
│       ├── requirements.md         # 需求文档
│       ├── design.md               # 设计文档
│       └── tasks.md                # 任务清单
├── cloud/                          # 云开发
│   ├── database/                   # 数据库初始化脚本
│   │   ├── daily_quotes_init.md
│   │   └── relics_init.md
│   └── functions/                  # 云函数
│       ├── ai-chat/                # AI 对话云函数
│       ├── draw-relic/             # 抽奖云函数
│       └── get-daily-quote/        # 每日名言云函数
├── docs/                           # 项目文档
│   ├── DAILY-SIGN-FEATURE.md       # 日签功能文档
│   ├── DAILY-SIGN-OFFSCREEN-RENDERING.md
│   ├── DAILY-SIGN-TEST-GUIDE.md
│   ├── KNOWLEDGE-GRAPH-MOBILE-UX.md
│   └── RED-RELICS-FEATURE.md
├── miniprogram/                    # 小程序代码
│   ├── app.js                      # 应用入口
│   ├── app.json                    # 全局配置
│   ├── app.wxss                    # 全局样式
│   ├── components/                 # 组件
│   │   ├── audio-player/           # 音频播放器
│   │   ├── daily-sign-modal/       # 日签弹窗
│   │   └── navigation-bar/         # 自定义导航栏
│   ├── data/                       # 数据文件
│   │   ├── cards.js                # 卡片数据
│   │   ├── daily-quotes.js         # 每日名言
│   │   ├── graph.js                # 知识图谱数据
│   │   ├── heroes.js               # 英雄数据
│   │   ├── quiz-questions.js       # 题库数据
│   │   ├── radio-playlist.js       # 电台播放列表
│   │   └── relics.js               # 文物数据
│   ├── images/                     # 图片资源
│   ├── pages/                      # 页面
│   │   ├── index/                  # 首页
│   │   ├── ai-chat/                # AI 对话
│   │   ├── knowledge-graph/        # 知识图谱
│   │   ├── card-learning/          # 卡片学习
│   │   ├── hero-gallery/           # 英雄长廊
│   │   ├── hero-detail/            # 英雄详情
│   │   ├── profile/                # 个人中心
│   │   ├── mystery-box/            # 盲盒抽奖
│   │   ├── museum/                 # 珍藏馆
│   │   ├── pk-battle/              # PK 对战
│   │   └── radio/                  # 红色电台
│   ├── styles/                     # 样式文件
│   └── utils/                      # 工具函数
│       ├── audio-manager.js        # 音频管理
│       └── error-handler.js        # 错误处理
├── scripts/                        # 脚本工具
│   ├── auto-compile.bat            # 自动编译
│   ├── ci-upload.js                # CI 上传
│   └── README.md
├── README.md                       # 项目说明
├── DEVELOPMENT.md                  # 开发指南 (本文档)
├── TESTING-GUIDE.md                # 测试指南
├── PROJECT-HEALTH-ASSESSMENT.md    # 项目健康度评估
├── CLEANUP-REPORT.md               # 清理报告
└── package.json                    # 项目配置
```

---

## 📝 开发规范

### 1. 代码规范

#### 命名规范

```javascript
// 文件命名: kebab-case
// 示例: daily-sign-modal.js, hero-gallery.wxml

// 变量命名: camelCase
const userName = 'John';
const isLoading = false;

// 常量命名: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// 组件命名: PascalCase (在 JSON 中使用 kebab-case)
// 组件文件: daily-sign-modal/
// 使用: <daily-sign-modal />

// 函数命名: camelCase, 动词开头
function getUserInfo() { }
function handleClick() { }
function onLoad() { }
```

#### 注释规范

```javascript
/**
 * 函数说明
 * @param {string} name - 参数说明
 * @returns {object} 返回值说明
 */
function exampleFunction(name) {
  // 单行注释
  return { name };
}

// 页面/组件注释
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 数据说明
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 实现逻辑
  }
});
```

#### 代码格式

```javascript
// 使用 2 空格缩进
// 字符串使用单引号
// 语句末尾加分号
// 对象和数组最后一项不加逗号

const config = {
  name: 'example',
  value: 123
};

const list = [
  'item1',
  'item2'
];
```

---

### 2. 文件组织规范

#### 页面文件结构

```
pages/example/
├── index.js        # 页面逻辑
├── index.json      # 页面配置
├── index.wxml      # 页面结构
└── index.wxss      # 页面样式
```

#### 组件文件结构

```
components/example/
├── example.js      # 组件逻辑
├── example.json    # 组件配置
├── example.wxml    # 组件结构
└── example.wxss    # 组件样式
```

---

### 3. Git 提交规范

#### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

#### 示例

```bash
# 好的提交
git commit -m "feat(ai-chat): 添加英雄对话模式"
git commit -m "fix(card-learning): 修复滑动卡顿问题"
git commit -m "docs: 更新开发指南"

# 不好的提交
git commit -m "update"
git commit -m "fix bug"
git commit -m "修改了一些东西"
```

---

## 🔧 常用命令

### Git 操作

```bash
# 查看状态
git status

# 添加文件
git add .

# 提交更改
git commit -m "feat: 添加新功能"

# 推送到远程
git push origin main

# 拉取最新代码
git pull origin main

# 查看提交历史
git log --oneline -10

# 创建分支
git checkout -b feature/new-feature

# 切换分支
git checkout main
```

---

### 项目清理

```bash
# 运行自动清理脚本
python auto_cleanup.py

# 运行文档清理脚本
python docs_cleanup_script.py

# 查看清理报告
cat CLEANUP-REPORT.md
```

---

### 云函数操作

```bash
# 上传云函数
右键云函数目录 -> 上传并部署：云端安装依赖

# 查看云函数日志
云开发控制台 -> 云函数 -> 日志

# 本地调试云函数
右键云函数 -> 本地调试
```

---

## 🐛 调试技巧

### 1. 控制台调试

```javascript
// 基础日志
console.log('普通日志');
console.warn('警告信息');
console.error('错误信息');

// 对象日志
console.log('用户信息:', userInfo);
console.table(dataList); // 表格形式

// 性能监控
console.time('操作耗时');
// ... 执行操作
console.timeEnd('操作耗时');
```

---

### 2. 断点调试

1. 在代码行号左侧点击设置断点
2. 点击"调试"按钮启动调试模式
3. 使用调试工具栏控制执行流程

---

### 3. 网络请求调试

```javascript
// 在 app.js 中添加请求拦截
wx.request = (function(request) {
  return function(config) {
    console.log('请求:', config);
    
    const originalSuccess = config.success;
    config.success = function(res) {
      console.log('响应:', res);
      originalSuccess && originalSuccess(res);
    };
    
    return request(config);
  };
})(wx.request);
```

---

### 4. 性能分析

```javascript
// 使用 Performance API
const performance = wx.getPerformance();
const observer = performance.createObserver((entryList) => {
  console.log('性能数据:', entryList.getEntries());
});

observer.observe({ entryTypes: ['render', 'script'] });
```

---

## ❓ 常见问题

### Q1: 编译报错 "Cannot read property 'includes' of undefined"

**原因**: 变量未定义就调用 includes 方法

**解决方案**:
```javascript
// 错误写法
if (array.includes(item)) { }

// 正确写法
if (Array.isArray(array) && array.includes(item)) { }
if (str && str.includes('keyword')) { }
```

---

### Q2: 云函数调用失败

**可能原因**:
1. 云环境 ID 配置错误
2. 云函数未上传或未部署
3. 权限配置问题

**解决方案**:
```javascript
// 1. 检查云环境配置
wx.cloud.init({
  env: 'your-correct-env-id'
});

// 2. 重新上传云函数
右键云函数 -> 上传并部署：云端安装依赖

// 3. 检查云函数权限
云开发控制台 -> 云函数 -> 权限设置
```

---

### Q3: 图片不显示

**可能原因**:
1. 图片路径错误
2. 图片文件不存在
3. 图片格式不支持

**解决方案**:
```javascript
// 使用绝对路径
<image src="/images/avatar.png" />

// 使用云存储
<image src="{{cloudImageUrl}}" />

// 添加错误处理
<image src="{{imageUrl}}" binderror="onImageError" />
```

---

### Q4: 页面跳转失败

**可能原因**:
1. 页面路径未在 app.json 中注册
2. 使用了错误的跳转方法
3. 页面栈超过限制（最多10层）

**解决方案**:
```javascript
// 1. 确保页面已注册
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/detail/detail"
  ]
}

// 2. 使用正确的跳转方法
wx.navigateTo({ url: '/pages/detail/detail' }); // 保留当前页
wx.redirectTo({ url: '/pages/detail/detail' }); // 关闭当前页
wx.switchTab({ url: '/pages/index/index' });    // TabBar 页面
wx.reLaunch({ url: '/pages/index/index' });     // 关闭所有页面

// 3. 页面栈满时使用 redirectTo 或 reLaunch
```

---

### Q5: 数据不更新

**可能原因**:
1. 未使用 setData 更新数据
2. setData 路径错误
3. 数据引用问题

**解决方案**:
```javascript
// 错误写法
this.data.name = 'new name'; // 不会触发视图更新

// 正确写法
this.setData({
  name: 'new name'
});

// 更新对象属性
this.setData({
  'user.name': 'new name',
  'list[0].value': 100
});

// 更新数组
this.setData({
  list: [...this.data.list, newItem]
});
```

---

## 🚀 部署流程

### 1. 开发环境测试

```bash
# 1. 本地测试
在微信开发者工具中测试所有功能

# 2. 真机预览
点击"预览"按钮，扫码在真机上测试

# 3. 体验版发布
点击"上传"按钮，填写版本号和备注
```

---

### 2. 提交审核

1. 登录微信公众平台
2. 进入"版本管理"
3. 选择体验版，点击"提交审核"
4. 填写审核信息
5. 等待审核结果（通常1-7天）

---

### 3. 发布上线

1. 审核通过后，在"版本管理"中点击"发布"
2. 确认发布信息
3. 点击"确定"完成发布

---

### 4. 版本回滚

如果发现问题需要回滚：

1. 进入"版本管理"
2. 找到历史版本
3. 点击"回退"
4. 确认回退操作

---

## 📚 相关文档

### 项目文档
- [README.md](./README.md) - 项目说明
- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - 测试指南
- [PROJECT-HEALTH-ASSESSMENT.md](./PROJECT-HEALTH-ASSESSMENT.md) - 健康度评估
- [CLEANUP-REPORT.md](./CLEANUP-REPORT.md) - 清理报告

### 功能文档
- [日签功能文档](./docs/DAILY-SIGN-FEATURE.md)
- [知识图谱 UX 文档](./docs/KNOWLEDGE-GRAPH-MOBILE-UX.md)
- [红色文物功能文档](./docs/RED-RELICS-FEATURE.md)

### 规范文档
- [需求文档](./.kiro/specs/qihang-miniprogram/requirements.md)
- [设计文档](./.kiro/specs/qihang-miniprogram/design.md)
- [任务清单](./.kiro/specs/qihang-miniprogram/tasks.md)

### 外部文档
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [讯飞星火 API 文档](https://www.xfyun.cn/doc/spark/Web.html)

---

## 🤝 贡献指南

### 提交 Pull Request

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码审查

所有 PR 需要经过代码审查才能合并：
- 代码符合规范
- 功能测试通过
- 文档已更新
- 无明显性能问题

---

## 📞 获取帮助

### 遇到问题？

1. 查看本文档的[常见问题](#常见问题)部分
2. 搜索 [Issues](https://github.com/CodeVoyager21932/feishu_xinghuoliaoyuan_v3/issues)
3. 创建新的 Issue 描述问题
4. 联系项目维护者

### 反馈建议

欢迎通过以下方式提供反馈：
- GitHub Issues
- Pull Request
- 项目讨论区

---

## 📄 许可证

本项目采用 ISC 许可证。详见 [LICENSE](./LICENSE) 文件。

---

**文档维护**: Kiro AI Assistant  
**最后更新**: 2024-11-20  
**文档版本**: v1.0
