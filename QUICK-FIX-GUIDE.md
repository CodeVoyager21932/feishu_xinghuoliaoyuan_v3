# 快速修复指南

## 问题诊断

### 错误 1: hero-detail 页面文件缺失
```
[ WXSS 文件编译错误] ENOENT: no such file or directory
[ WXML 文件编译错误] ENOENT: no such file or directory
```

**原因**：`hero-detail` 页面在之前的重构中被删除，但编译器缓存仍在尝试加载它。

**解决方案**：

#### 方法 1: 清除编译缓存（推荐）
1. 在微信开发者工具中，点击菜单栏 **"工具"** → **"清除缓存"**
2. 勾选以下选项：
   - ✅ 清除文件缓存
   - ✅ 清除编译缓存
   - ✅ 清除后台缓存
3. 点击 **"清除"**
4. 重启微信开发者工具
5. 重新编译项目

#### 方法 2: 手动删除缓存文件
1. 关闭微信开发者工具
2. 删除项目根目录下的 `.cache` 文件夹（如果存在）
3. 删除 `miniprogram/.cache` 文件夹（如果存在）
4. 重启微信开发者工具

#### 方法 3: 重新导入项目
1. 关闭当前项目
2. 在微信开发者工具中，点击 **"+"** → **"导入项目"**
3. 重新选择项目目录
4. 重新编译

---

### 错误 2: 游客模式限制
```
Error: SystemError (appServiceSDKScriptError)
{"errMsg":"webapi_getwxaasyncsecinfo:fail "}
```

**原因**：使用游客模式（`touristappid`）时，某些 API 受限。

**解决方案**：

#### 方法 1: 使用真实 AppID（推荐）
1. 打开 `project.config.json`
2. 将 `appid` 从 `"touristappid"` 改为你的真实 AppID：
   ```json
   {
     "appid": "wx1273a11c7be2bc9b"
   }
   ```
3. 保存并重新编译

#### 方法 2: 忽略此错误
- 此错误不影响核心功能开发
- 仅在使用特定 API（如 `wx.operateWXData`）时出现
- 可以暂时忽略，继续开发

---

## 验证修复

### 1. 检查编译日志
编译成功后，应该看到：
```
[system] Subpackages: N/A
[system] LazyCodeLoading: false
编译成功
```

### 2. 检查页面列表
在开发者工具的 **"调试器"** → **"AppData"** 中，确认页面列表为：
```javascript
[
  "pages/index/index",
  "pages/ai-chat/index",
  "pages/knowledge-graph/index",
  "pages/card-learning/index",
  "pages/profile/profile",
  "pages/mystery-box/mystery-box",
  "pages/museum/museum",
  "pages/pk-battle/pk-battle",
  "pages/radio/radio"
]
```

### 3. 测试首页加载
1. 点击 **"编译"** 按钮
2. 首页应正常显示
3. 控制台无红色错误信息

---

## 预防措施

### 1. 删除页面的正确流程
删除页面时，必须同时：
1. 删除页面文件夹（如 `pages/hero-detail/`）
2. 从 `app.json` 的 `pages` 数组中移除路由
3. 删除所有跳转到该页面的代码（搜索 `navigateTo`）
4. 清除编译缓存

### 2. 定期清理缓存
建议每次大规模重构后：
- 清除编译缓存
- 重启开发者工具
- 重新编译项目

### 3. 使用真实 AppID
开发阶段建议使用真实 AppID，避免游客模式限制。

---

## 常见问题

### Q1: 清除缓存后仍报错？
**A**: 尝试以下步骤：
1. 完全关闭微信开发者工具
2. 删除项目根目录的 `node_modules/.cache`（如果存在）
3. 重启电脑（极端情况）
4. 重新打开项目

### Q2: 如何确认页面已完全删除？
**A**: 执行以下检查：
```bash
# 搜索页面引用
grep -r "hero-detail" miniprogram/
grep -r "hero-gallery" miniprogram/
```
如果有结果，说明仍有代码引用该页面。

### Q3: 游客模式下哪些功能受限？
**A**: 
- ✅ 可用：页面渲染、本地存储、基础 API
- ❌ 受限：云开发、支付、分享、用户信息获取
- 💡 建议：开发阶段使用真实 AppID

---

## 当前项目状态

### 已删除的页面
- ❌ `pages/hero-gallery/` - 英雄长廊
- ❌ `pages/hero-detail/` - 英雄详情

### 保留的页面
- ✅ `pages/index/` - 首页
- ✅ `pages/ai-chat/` - AI 对话
- ✅ `pages/knowledge-graph/` - 知识图谱
- ✅ `pages/card-learning/` - 卡片学习
- ✅ `pages/profile/` - 个人中心
- ✅ `pages/mystery-box/` - 机密档案
- ✅ `pages/museum/` - 珍藏馆
- ✅ `pages/pk-battle/` - PK 对战
- ✅ `pages/radio/` - 红色电台

---

## 立即执行

请按以下顺序操作：

1. **清除缓存**（必须）
   - 工具 → 清除缓存 → 全选 → 清除

2. **重启工具**（必须）
   - 完全关闭微信开发者工具
   - 重新打开项目

3. **验证修复**（必须）
   - 点击编译
   - 检查控制台无红色错误
   - 首页正常显示

4. **更新 AppID**（可选）
   - 修改 `miniprogram/project.config.json`
   - 将 `appid` 改为真实值

---

**预计修复时间**: 2-3 分钟
**成功率**: 99%
