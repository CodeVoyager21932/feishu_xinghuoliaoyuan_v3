# AI对话云函数

## 功能说明

处理AI对话请求，调用讯飞星火4.0 Ultra API，实现：
1. 普通对话模式（星火同志）
2. 英雄对话模式（角色扮演）
3. Function Call零幻觉知识检索

## 配置说明

### 1. 环境变量配置

在微信云开发控制台配置以下环境变量：

```
SPARK_APP_ID=你的讯飞星火AppID
SPARK_API_KEY=你的讯飞星火APIKey
SPARK_API_SECRET=你的讯飞星火APISecret
```

### 2. 获取讯飞星火API密钥

1. 访问 https://xinghuo.xfyun.cn/
2. 注册并登录
3. 进入控制台 -> API管理
4. 创建应用并获取 AppID、APIKey、APISecret

### 3. 上传知识库文件

将以下文件上传到云存储：
- `data/heroes.json` - 英雄人物数据
- `data/events.json` - 历史事件数据

上传路径示例：`cloud://your-env-id.xxxx/data/heroes.json`

### 4. 修改云函数代码

在 `index.js` 中修改云存储文件路径：

```javascript
const result = await cloud.downloadFile({
  fileID: 'cloud://your-env-id.xxxx/data/heroes.json' // 替换为实际路径
});
```

## 部署步骤

### 方法一：使用微信开发者工具

1. 打开微信开发者工具
2. 右键点击 `cloud/functions/ai-chat` 文件夹
3. 选择"上传并部署：云端安装依赖"

### 方法二：使用命令行

```bash
cd cloud/functions/ai-chat
npm install
wx-server-sdk upload
```

## 测试

在小程序中调用：

```javascript
wx.cloud.callFunction({
  name: 'ai-chat',
  data: {
    question: '南昌起义是什么时候？',
    history: [],
    mode: 'default'
  },
  success: res => {
    console.log(res.result.answer);
  }
});
```

## 注意事项

1. **API费用**：讯飞星火API按Token计费，注意控制对话历史长度
2. **超时设置**：云函数默认超时时间为20秒，AI响应可能需要5-10秒
3. **并发限制**：免费版API有并发限制，生产环境需升级套餐
4. **内容安全**：已实现基础的敏感词过滤，可根据需要增强

## 开发阶段临时方案

如果暂时没有讯飞星火API密钥，可以使用模拟数据：

在 `index.js` 中注释掉 `callSparkAPI` 调用，直接返回模拟回答：

```javascript
// 临时模拟回答
return { 
  answer: '这是一个模拟回答。南昌起义发生在1927年8月1日...' 
};
```

## 故障排查

### 问题1：云函数调用失败

- 检查云开发环境是否初始化
- 检查云函数是否部署成功
- 查看云函数日志

### 问题2：API调用超时

- 检查网络连接
- 检查API密钥是否正确
- 增加云函数超时时间

### 问题3：Function Call不生效

- 检查知识库JSON文件是否上传
- 检查云存储文件路径是否正确
- 查看云函数日志中的错误信息
