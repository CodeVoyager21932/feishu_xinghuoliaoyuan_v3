# 星火 - 红色教育智能体小程序

## 项目简介

"星火"是一个基于认知智能的红色党史学习平台，通过讯飞星火大模型驱动的AI虚拟讲解员、知识图谱可视化、游戏化学习机制等创新技术，为青少年学生打造沉浸式的红色文化学习体验。

## 核心技术亮点

1. **Function Call零幻觉AI讲解员**：通过讯飞星火API的Function Call功能，连接本地知识库，确保历史事实准确无误
2. **时间轴知识图谱**：使用AntV G6实现创新的时间轴布局，将党史事件按时间顺序可视化
3. **Tinder式卡片学习**：结合艾宾浩斯遗忘曲线的游戏化学习机制

## 技术栈

- **前端**：微信小程序原生开发
- **后端**：微信云开发（云函数、云数据库、云存储）
- **AI能力**：讯飞星火4.0 Ultra API
- **图可视化**：AntV G6

## 项目结构

```
.
├── .kiro/specs/qihang-miniprogram/  # 项目规格文档
│   ├── requirements.md              # 需求文档
│   ├── design.md                    # 设计文档
│   └── tasks.md                     # 任务清单
├── miniprogram/                     # 小程序前端代码（待创建）
├── cloud/                           # 云函数代码（待创建）
└── README.md                        # 项目说明
```

## 开发计划

**总计：7天**
- Day 1-2：项目初始化 + AI对话模块
- Day 3-4：知识图谱模块
- Day 5：Tinder卡片学习模块
- Day 6：英雄长廊 + 用户系统
- Day 7：测试优化 + 部署

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/CodeVoyager21932/feishu_xinghuoliaoyuan.git
cd feishu_xinghuoliaoyuan
```

### 2. 查看规格文档

- [需求文档](.kiro/specs/qihang-miniprogram/requirements.md)
- [设计文档](.kiro/specs/qihang-miniprogram/design.md)
- [任务清单](.kiro/specs/qihang-miniprogram/tasks.md)

### 3. 开始开发

打开 `tasks.md` 文件，按照任务清单逐步实现功能。

## 核心功能

- ✅ 用户认证与个人中心
- ✅ AI虚拟讲解员（支持与英雄对话）
- ✅ 党史知识图谱可视化
- ✅ 英雄长廊
- ✅ Tinder式卡片学习
- ✅ 学习打卡与成就系统

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目仅用于学习和竞赛目的。

## 联系方式

如有问题，请提交 Issue 或联系项目维护者。

---

**让红色基因代代相传，让星火燎原！** 🔥
