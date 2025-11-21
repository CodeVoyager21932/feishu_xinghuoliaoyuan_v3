# 图片技术规范约束文档

## 📋 总体约束

### 通用规范
- **格式**: PNG-24（支持透明通道）
- **背景**: 透明背景（Transparent）
- **色彩空间**: sRGB
- **压缩**: 使用 TinyPNG 压缩后 < 指定大小
- **命名**: 小写字母 + 下划线，如 `ai_chat.png`

### 设计风格约束
- **风格**: 扁平化设计（Flat Design）
- **主色**: #D32F2F（深红色）
- **辅色**: #FFD700（金色，仅用于点缀）
- **灰色**: #BDBDBD（浅灰，用于空状态）
- **线条**: 统一粗细 2-4px
- **圆角**: 统一半径（如使用）
- **无阴影**: 不使用 drop-shadow
- **无渐变**: 或仅使用简单线性渐变

---

## 🎯 核心图片规范（3个）

### 1. xinghuo-avatar.png
```yaml
文件名: xinghuo-avatar.png
路径: /images/
用途: AI讲解员头像
尺寸: 400 x 400 px
格式: PNG-24
背景: 透明
主色: #D32F2F
辅色: #FFD700（可选）
文件大小: < 100 KB
设计要求:
  - 圆形或圆角方形构图
  - 主体为五角星或火炬图案
  - 简洁现代，易于识别
  - 适合在各种背景上显示
```

### 2. empty-state.png
```yaml
文件名: empty-state.png
路径: /images/
用途: 空状态提示图标
尺寸: 400 x 400 px
格式: PNG-24
背景: 透明
主色: #BDBDBD（浅灰）
辅色: 无
文件大小: < 50 KB
设计要求:
  - 线性图标风格
  - 线条粗细 2-3px
  - 简约空盒子或文件夹图案
  - 传达"暂无内容"含义
```

### 3. default-avatar.png
```yaml
文件名: default-avatar.png
路径: /images/
用途: 默认用户头像
尺寸: 200 x 200 px
格式: PNG-24
背景: 不透明（圆形）
主色: #D32F2F
辅色: #FFFFFF（人物剪影）
文件大小: < 100 KB
设计要求:
  - 圆形头像
  - 简化的人物剪影
  - 红色背景 + 白色图形
  - 中性友好
```

---

## 🎨 功能图标规范（11个）

### 统一约束
```yaml
尺寸: 256 x 256 px（推荐）或 512 x 512 px（高清）
格式: PNG-24
背景: 透明
主色: #D32F2F
线条粗细: 3-4px（统一）
文件大小: < 50 KB（每个）
设计风格: 线性图标或面性图标（统一选择一种）
内边距: 留出 10-15% 安全边距
```

### 4. ai_chat.png
```yaml
文件名: ai_chat.png
路径: /images/icons/
功能: 先辈回响（AI讲解员）
图案建议: 对话气泡 + 星星元素
关键元素: 气泡、AI符号、对话
```

### 5. knowledge_graph.png
```yaml
文件名: knowledge_graph.png
路径: /images/icons/
功能: 星火燎原（知识图谱）
图案建议: 网络节点、连接线、星系图
关键元素: 节点、连线、网络
```

### 6. flashcards.png
```yaml
文件名: flashcards.png
路径: /images/icons/
功能: 拾光碎片（卡片学习）
图案建议: 堆叠卡片、书签
关键元素: 卡片、学习、记忆
```

### 7. hero_gallery.png
```yaml
文件名: hero_gallery.png
路径: /images/icons/
功能: 民族脊梁（英雄长廊）
图案建议: 勋章、奖杯、星星
关键元素: 荣誉、英雄、群星
```

### 8. mystery_box.png
```yaml
文件名: mystery_box.png
路径: /images/icons/
功能: 尘封档案（机密档案）
图案建议: 宝箱、档案盒、密封文件
关键元素: 神秘、档案、探索
```

### 9. museum.png
```yaml
文件名: museum.png
路径: /images/icons/
功能: 初心印记（珍藏馆）
图案建议: 展示框、相册、博物馆
关键元素: 收藏、珍藏、记忆
```

### 10. pk_battle.png
```yaml
文件名: pk_battle.png
路径: /images/icons/
功能: 上下求索（知识竞答）
图案建议: 问号、对战、竞赛
关键元素: 问答、探索、挑战
```

### 11. radio.png
```yaml
文件名: radio.png
路径: /images/icons/
功能: 永不消逝（红色电台）
图案建议: 复古收音机、电波、天线
关键元素: 广播、电波、历史
```

### 12. biography.png
```yaml
文件名: biography.png
路径: /images/icons/
功能: 传记
图案建议: 书本、文档、羽毛笔
关键元素: 书籍、记录、历史
```

### 13. medal.png
```yaml
文件名: medal.png
路径: /images/icons/
功能: 勋章
图案建议: 圆形勋章、丝带、星星
关键元素: 荣誉、奖励、成就
主色: #D32F2F + #FFD700（金色）
```

### 14. quote.png
```yaml
文件名: quote.png
路径: /images/icons/
功能: 名言
图案建议: 引号、文字、对话框
关键元素: 引用、语录、文字
```

---

## 🖼️ 英雄头像规范（6个）- 可选

### 统一约束
```yaml
尺寸: 400 x 500 px（竖版）或 500 x 500 px（方形）
格式: JPG（照片）或 PNG（插画）
背景: 可以有背景
质量: JPG 质量 85-90%
文件大小: < 200 KB（每个）
风格: 统一（全部真实照片 或 全部插画）
色调: 统一调色（可选）
```

### 15-20. 英雄头像列表
```yaml
leifeng.png: 雷锋
jiaoyulu.png: 焦裕禄
huangjigu.png: 黄继光
zhaoyiman.png: 赵一曼
lengyun.png: 冷云
qiujiahe.png: 邱家河
```

---

## 📏 尺寸对照表

| 类型 | 标准尺寸 | 高清尺寸 | 最大文件大小 |
|------|----------|----------|--------------|
| 核心图片 | 200-400px | 400-800px | 100 KB |
| 功能图标 | 256x256px | 512x512px | 50 KB |
| 英雄头像 | 400x500px | 800x1000px | 200 KB |

---

## 🎨 色彩规范

### 主色调
```css
--primary-red: #D32F2F;      /* 主红色 - 必须使用 */
--dark-red: #B71C1C;         /* 深红色 - 可选 */
--light-red: #FFCDD2;        /* 浅红色 - 可选 */
```

### 辅助色
```css
--gold: #FFD700;             /* 金色 - 仅用于勋章、荣誉 */
--dark-gray: #1F1F1F;        /* 深灰 - 文字（不用于图标）*/
--light-gray: #BDBDBD;       /* 浅灰 - 仅用于空状态 */
--white: #FFFFFF;            /* 白色 - 背景或剪影 */
```

### 禁止使用的颜色
- ❌ 蓝色、绿色、紫色等其他主题色
- ❌ 过于鲜艳的荧光色
- ❌ 黑色作为主色（可用于线条）

---

## 📐 几何规范

### 线条粗细
```yaml
细线: 2px（用于细节）
标准线: 3px（推荐）
粗线: 4px（用于主体）
统一: 同一图标内线条粗细必须一致
```

### 圆角半径
```yaml
小圆角: 4-8px
中圆角: 12-16px
大圆角: 20-24px
统一: 同一套图标圆角半径必须一致
```

### 内边距
```yaml
安全边距: 图标内容距离画布边缘至少 10-15%
示例: 256px 图标，内容区域约 220px
```

---

## 🚫 禁止事项

### 设计禁止
- ❌ 使用阴影效果（drop-shadow, box-shadow）
- ❌ 使用复杂渐变（允许简单线性渐变）
- ❌ 使用3D效果或透视
- ❌ 使用过多细节（保持简洁）
- ❌ 使用位图纹理
- ❌ 使用模糊效果

### 技术禁止
- ❌ 使用 GIF 或 WebP 格式
- ❌ 使用 CMYK 色彩空间
- ❌ 包含 EXIF 元数据
- ❌ 使用非标准尺寸
- ❌ 文件大小超过限制

---

## ✅ 验收标准

### 必须通过的检查项
```yaml
文件格式:
  - [ ] PNG-24 或 JPG（根据类型）
  - [ ] 透明背景（PNG图标）
  - [ ] sRGB 色彩空间

尺寸规格:
  - [ ] 符合指定尺寸
  - [ ] 宽高比正确
  - [ ] 分辨率 72 DPI 或更高

颜色规范:
  - [ ] 使用指定色值 #D32F2F
  - [ ] 无禁用颜色
  - [ ] 色彩一致性

文件大小:
  - [ ] 图标 < 50 KB
  - [ ] 核心图片 < 100 KB
  - [ ] 头像 < 200 KB

视觉质量:
  - [ ] 边缘清晰，无锯齿
  - [ ] 线条流畅
  - [ ] 构图居中平衡
  - [ ] 在白色和深色背景上都清晰可见

风格一致性:
  - [ ] 与其他图标风格统一
  - [ ] 线条粗细一致
  - [ ] 圆角半径一致
  - [ ] 整体视觉和谐
```

---

## 📦 交付清单

### 文件命名检查
```
✅ 正确: ai_chat.png
✅ 正确: xinghuo-avatar.png
❌ 错误: AI_Chat.PNG
❌ 错误: ai chat.png
❌ 错误: 先辈回响.png
```

### 目录结构
```
miniprogram/images/
├── xinghuo-avatar.png          (400x400, <100KB)
├── empty-state.png             (400x400, <50KB)
├── default-avatar.png          (200x200, <100KB)
├── icons/
│   ├── ai_chat.png            (256x256, <50KB)
│   ├── knowledge_graph.png    (256x256, <50KB)
│   ├── flashcards.png         (256x256, <50KB)
│   ├── hero_gallery.png       (256x256, <50KB)
│   ├── mystery_box.png        (256x256, <50KB)
│   ├── museum.png             (256x256, <50KB)
│   ├── pk_battle.png          (256x256, <50KB)
│   ├── radio.png              (256x256, <50KB)
│   ├── biography.png          (256x256, <50KB)
│   ├── medal.png              (256x256, <50KB)
│   └── quote.png              (256x256, <50KB)
└── heroes/                     (可选)
    ├── leifeng.png            (400x500, <200KB)
    ├── jiaoyulu.png           (400x500, <200KB)
    ├── huangjigu.png          (400x500, <200KB)
    ├── zhaoyiman.png          (400x500, <200KB)
    ├── lengyun.png            (400x500, <200KB)
    └── qiujiahe.png           (400x500, <200KB)
```

---

## 🔧 工具推荐

### 压缩工具
- **TinyPNG**: https://tinypng.com（必须使用）
- **Squoosh**: https://squoosh.app（备选）

### 尺寸调整
- **ILoveIMG**: https://iloveimg.com/resize-image
- **Photoshop**: 图像 → 图像大小
- **GIMP**: 图像 → 缩放图像

### 格式转换
- **CloudConvert**: https://cloudconvert.com
- **Photoshop**: 导出为 → PNG/JPG

### 去除背景
- **Remove.bg**: https://remove.bg
- **Photoshop**: 选择 → 主体 → 删除背景

---

## 📊 质量检查命令

### 检查文件信息（Windows）
```cmd
cd miniprogram\images\icons
dir *.png
```

### 检查图片尺寸（需要 ImageMagick）
```bash
identify -format "%f: %wx%h %b\n" *.png
```

### 批量检查文件大小
```bash
ls -lh *.png
```

---

## 📝 备注

1. **优先级**: 核心图片 > 功能图标 > 英雄头像
2. **风格统一**: 所有图标必须使用相同的设计风格
3. **测试**: 在白色和深色背景上都要测试显示效果
4. **备份**: 保留原始高分辨率文件（如 SVG 或 PSD）
5. **版本控制**: 使用 Git 管理图片资源

---

**文档版本**: 1.0  
**最后更新**: 2025-11-21
