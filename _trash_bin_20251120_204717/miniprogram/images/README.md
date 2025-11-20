# 图片资源说明

## 需要准备的图片

### 1. 英雄头像（heroes/）

尺寸：200x200px，圆形裁剪
格式：PNG，透明背景

- `leifeng.png` - 雷锋
- `jiaoyulu.png` - 焦裕禄
- `lengyun.png` - 冷云
- `zhaoyiman.png` - 赵一曼
- `huangjigu.png` - 黄继光
- `qiujiahe.png` - 邱少云

### 2. 系统图标

- `xinghuo-avatar.png` - 星火同志头像（200x200px）
- `default-avatar.png` - 默认用户头像（200x200px）

### 3. TabBar图标

尺寸：81x81px
格式：PNG

- `tab-home.png` / `tab-home-active.png` - 首页
- `tab-graph.png` / `tab-graph-active.png` - 知识图谱
- `tab-card.png` / `tab-card-active.png` - 卡片学习
- `tab-profile.png` / `tab-profile-active.png` - 我的

### 4. 功能图标

尺寸：128x128px

- `icon-ai.png` - AI讲解员
- `icon-graph.png` - 知识图谱
- `icon-card.png` - 卡片学习
- `icon-hero.png` - 英雄长廊

## 临时占位方案

开发阶段可以使用以下方式：

1. **使用在线图片**：修改代码中的图片路径为网络URL
2. **使用纯色占位**：在WXSS中使用背景色代替图片
3. **使用Emoji**：在文本中使用Emoji代替图标

## 图片优化建议

1. 使用 TinyPNG 压缩所有图片
2. 英雄头像控制在 50KB 以内
3. 图标控制在 10KB 以内
4. 优先使用 WebP 格式（降级为 PNG）

## 图片来源建议

1. **英雄头像**：从官方党史网站、纪念馆官网获取
2. **图标**：使用 iconfont.cn 或 flaticon.com
3. **确保版权**：使用公共领域或CC0协议的图片
