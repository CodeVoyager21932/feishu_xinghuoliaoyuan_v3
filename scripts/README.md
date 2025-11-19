# 自动化脚本说明

## 📋 可用脚本

### 1. auto-compile.bat - 自动编译脚本

**功能**：自动打开微信开发者工具并编译项目

**使用前配置**：
1. 打开微信开发者工具
2. 点击"设置" → "安全设置"
3. 开启"服务端口"（默认端口：9420）
4. 修改脚本中的 CLI 路径

**使用方法**：
```bash
# 双击运行
scripts/auto-compile.bat

# 或在命令行中运行
cd scripts
auto-compile.bat
```

---

### 2. ci-upload.js - CI 自动上传脚本

**功能**：自动上传代码到微信小程序后台，生成体验版

**使用前配置**：

#### 步骤1：安装依赖
```bash
npm install miniprogram-ci --save-dev
```

#### 步骤2：获取上传密钥
1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 进入"开发" → "开发管理" → "开发设置"
3. 在"小程序代码上传"部分，点击"生成"
4. 下载密钥文件 `private.key`
5. 将密钥文件放在项目根目录

#### 步骤3：配置 AppID
修改 `ci-upload.js` 中的配置：
```javascript
const config = {
  appid: 'wx1234567890abcdef',  // 替换为你的 AppID
  // ...
};
```

**使用方法**：

```bash
# 上传代码到微信后台
node scripts/ci-upload.js upload

# 生成预览二维码
node scripts/ci-upload.js preview
```

---

## 🚀 推荐工作流

### 开发阶段（本地测试）

1. **打开微信开发者工具**
   - 手动打开微信开发者工具
   - 导入项目：`C:\Users\72998\Desktop\xunfei\miniprogram`
   - 点击"编译"查看效果

2. **修改代码**
   - 在 VS Code 或其他编辑器中修改代码
   - 保存后，微信开发者工具会自动重新编译

3. **查看效果**
   - 在模拟器中查看
   - 点击"预览"生成二维码，在真机上测试

### 提交阶段（上传体验版）

1. **使用 CI 工具上传**
   ```bash
   node scripts/ci-upload.js upload
   ```

2. **在微信公众平台查看**
   - 登录微信公众平台
   - 进入"版本管理"
   - 查看上传的版本
   - 设置为体验版

3. **分享给测试人员**
   - 添加体验成员
   - 分享体验版二维码

---

## 🛠️ 微信开发者工具 CLI 命令参考

### 开启 CLI 功能

1. 打开微信开发者工具
2. 设置 → 安全设置 → 开启"服务端口"

### 常用命令

```bash
# CLI 路径（Windows）
set CLI="C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat"

# 打开项目
%CLI% open --project C:\path\to\miniprogram

# 关闭项目
%CLI% close --project C:\path\to\miniprogram

# 预览项目（生成二维码）
%CLI% preview --project C:\path\to\miniprogram

# 上传代码
%CLI% upload --project C:\path\to\miniprogram --version 1.0.0 --desc "版本描述"

# 构建 npm
%CLI% build-npm --project C:\path\to\miniprogram

# 自动化测试
%CLI% auto --project C:\path\to\miniprogram
```

---

## 📝 package.json 脚本配置

在 `package.json` 中添加快捷脚本：

```json
{
  "scripts": {
    "dev": "echo 请在微信开发者工具中打开项目",
    "upload": "node scripts/ci-upload.js upload",
    "preview": "node scripts/ci-upload.js preview",
    "test": "echo 运行测试"
  }
}
```

使用方法：
```bash
npm run upload   # 上传代码
npm run preview  # 生成预览
```

---

## ⚠️ 注意事项

### 1. 安全性
- ⚠️ **不要将 `private.key` 提交到 Git**
- 已在 `.gitignore` 中添加忽略规则
- 密钥文件仅用于 CI/CD，不要分享给他人

### 2. 权限
- 需要小程序管理员权限才能生成上传密钥
- 体验版需要添加体验成员才能访问

### 3. 限制
- 每天上传次数有限制（通常为 100 次）
- 体验版有效期为 15 天
- 同时只能有一个体验版

---

## 🔗 相关文档

- [微信小程序 CI 文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)
- [微信开发者工具命令行](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)
- [miniprogram-ci npm 包](https://www.npmjs.com/package/miniprogram-ci)

---

## 🆘 常见问题

### Q: 找不到 CLI 路径？
A: 在微信开发者工具中，点击"设置" → "通用设置"，可以看到安装路径

### Q: 提示"未开启服务端口"？
A: 在微信开发者工具中，"设置" → "安全设置" → 开启"服务端口"

### Q: 上传失败，提示"密钥错误"？
A: 检查 `private.key` 文件是否正确，AppID 是否匹配

### Q: 如何在 CI/CD 中使用？
A: 可以在 GitHub Actions、Jenkins 等 CI 工具中运行 `ci-upload.js` 脚本
