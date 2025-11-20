# 每日名言数据库初始化文档

## 集合名称
`daily_quotes`

## 字段结构

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `_id` | String | 是 | 自动生成的唯一ID | - |
| `date` | String | 是 | 日期（YYYY-MM-DD格式） | "2025-11-20" |
| `image_url` | String | 是 | 背景大图URL | "/images/daily-sign-bg/bg-001.jpg" |
| `quote_content` | String | 是 | 名言内容 | "为有牺牲多壮志，敢教日月换新天。" |
| `author` | String | 是 | 出处/作者 | "毛泽东《七律·到韶山》" |
| `lucky_tips` | String | 否 | 今日宜/忌 | "学习党史，传承红色基因" |
| `created_at` | Date | 是 | 创建时间 | 自动生成 |

## 索引设置
- 在 `date` 字段上创建唯一索引，确保每天只有一条记录

## 初始化步骤

### 1. 在微信开发者工具中创建集合
1. 打开"云开发控制台"
2. 进入"数据库"
3. 点击"添加集合"
4. 输入集合名：`daily_quotes`
5. 点击"确定"

### 2. 设置索引
1. 进入 `daily_quotes` 集合
2. 点击"索引管理"
3. 添加索引：
   - 字段名：`date`
   - 类型：升序
   - 唯一：是

### 3. 导入示例数据
可以使用以下JSON数据导入（在"记录"标签页点击"导入"）：

```json
[
  {
    "date": "2025-11-20",
    "image_url": "/images/daily-sign-bg/bg-001.jpg",
    "quote_content": "为有牺牲多壮志，敢教日月换新天。",
    "author": "毛泽东《七律·到韶山》",
    "lucky_tips": "学习党史，传承红色基因",
    "created_at": {"$date": "2025-11-20T00:00:00.000Z"}
  },
  {
    "date": "2025-11-21",
    "image_url": "/images/daily-sign-bg/bg-002.jpg",
    "quote_content": "雄关漫道真如铁，而今迈步从头越。",
    "author": "毛泽东《忆秦娥·娄山关》",
    "lucky_tips": "坚定信念，勇往直前",
    "created_at": {"$date": "2025-11-21T00:00:00.000Z"}
  },
  {
    "date": "2025-11-22",
    "image_url": "/images/daily-sign-bg/bg-003.jpg",
    "quote_content": "红军不怕远征难，万水千山只等闲。",
    "author": "毛泽东《七律·长征》",
    "lucky_tips": "不畏艰险，砥砺前行",
    "created_at": {"$date": "2025-11-22T00:00:00.000Z"}
  }
]
```

## 数据维护建议

### 每月批量添加
建议每月初批量添加当月的名言数据，可以使用云函数批量导入。

### 内容来源
1. 毛泽东诗词
2. 革命先烈名言
3. 党的重要文献摘录
4. 习近平总书记重要讲话

### 图片准备
- 提前准备好对应日期的背景图片
- 上传到云存储或使用CDN
- 确保图片尺寸为 750×1334px

## 云函数调用示例

```javascript
// 在小程序中调用
wx.cloud.callFunction({
  name: 'get-daily-quote',
  success: (res) => {
    console.log('今日名言', res.result.data);
    this.setData({
      todayQuote: res.result.data
    });
  },
  fail: (err) => {
    console.error('获取失败', err);
  }
});
```

## 注意事项
1. 确保云开发环境已初始化
2. 图片URL需要是可访问的路径
3. 名言内容需要审核，确保政治正确
4. 建议定期备份数据库
