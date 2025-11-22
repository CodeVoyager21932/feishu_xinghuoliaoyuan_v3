# 云数据库配置指南

## 一、创建集合

在微信开发者工具的"云开发控制台" → "数据库"中，创建以下集合：

### 1. heroes（英雄人物表）
```json
{
  "_id": "auto-generated",
  "name": "雷锋",
  "title": "全心全意为人民服务的楷模",
  "avatar_path": "heroes/leifeng.jpg",
  "era": "construction",
  "tags": ["模范", "战士", "奉献"],
  "description": "雷锋（1940-1962），湖南长沙人，中国人民解放军战士...",
  "birth_year": 1940,
  "death_year": 1962,
  "quote": "人的生命是有限的，可是为人民服务是无限的",
  "sort_order": 1,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**era 字段枚举值**：
- `revolution`: 革命时期（1921-1949）
- `construction`: 建设时期（1949-1978）
- `reform`: 改革时期（1978-2012）
- `newera`: 新时代（2012至今）

### 2. events（历史事件表）
```json
{
  "_id": "auto-generated",
  "title": "中国共产党成立",
  "date": "1921-07-23",
  "year": 1921,
  "location": "上海",
  "summary": "中国共产党第一次全国代表大会在上海召开...",
  "category": "revolution",
  "importance": 5,
  "related_heroes": ["hero_id_1", "hero_id_2"],
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**category 字段枚举值**：
- `revolution`: 革命时期
- `construction`: 建设时期
- `reform`: 改革时期

### 3. quotes（每日名言表）
```json
{
  "_id": "auto-generated",
  "content": "星星之火，可以燎原",
  "author": "毛泽东",
  "hero_id": "hero_id_optional",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## 二、设置索引

为提升查询性能，建议在以下字段上创建索引：

### heroes 集合
- `name` (普通索引)
- `era` (普通索引)
- `sort_order` (普通索引)

### events 集合
- `year` (普通索引)
- `category` (普通索引)
- `importance` (普通索引)

## 三、权限配置

在"云开发控制台" → "数据库" → "权限设置"中：

### 推荐配置（开发阶段）
```json
{
  "read": true,
  "write": false
}
```
- 所有用户可读
- 仅管理员可写（通过云函数或控制台）

### 生产环境配置
```json
{
  "read": "auth.openid != null",
  "write": false
}
```
- 仅登录用户可读
- 仅管理员可写

## 四、数据导入

### 方式 1: 手动录入
在云开发控制台 → 数据库 → 对应集合 → "添加记录"

### 方式 2: JSON 导入
1. 准备 JSON 文件（参考 `sample-data/` 目录）
2. 在云开发控制台 → 数据库 → 对应集合 → "导入"
3. 选择 JSON 文件上传

### 方式 3: 云函数批量导入
```javascript
// cloud/functions/init-data/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const heroes = [
    { name: '雷锋', title: '全心全意为人民服务的楷模', ... },
    // ... 更多数据
  ];

  try {
    const result = await db.collection('heroes').add({
      data: heroes
    });
    return { success: true, ids: result._id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

## 五、数据迁移

### 从本地 JS 文件迁移到云数据库

#### 步骤 1: 转换数据格式
```javascript
// 原本地数据: miniprogram/data/heroes.js
const heroes = [
  { id: 1, name: '雷锋', ... }
];

// 转换为云数据库格式（移除 id 字段，添加必要字段）
const cloudHeroes = heroes.map(hero => ({
  name: hero.name,
  title: hero.title,
  avatar_path: hero.avatar || '',
  era: hero.era || 'construction',
  tags: hero.tags || [],
  description: hero.description || '',
  sort_order: hero.id || 999,
  created_at: new Date()
}));
```

#### 步骤 2: 导出为 JSON
```javascript
const fs = require('fs');
fs.writeFileSync('heroes.json', JSON.stringify(cloudHeroes, null, 2));
```

#### 步骤 3: 导入到云数据库
使用云开发控制台的"导入"功能

## 六、测试数据

### 快速测试（最小数据集）
```javascript
// 1 个英雄
db.collection('heroes').add({
  data: {
    name: '雷锋',
    title: '全心全意为人民服务的楷模',
    avatar_path: '',
    era: 'construction',
    tags: ['模范', '战士'],
    description: '雷锋精神永存',
    sort_order: 1
  }
});

// 1 条名言
db.collection('quotes').add({
  data: {
    content: '人的生命是有限的，可是为人民服务是无限的',
    author: '雷锋'
  }
});

// 1 个事件
db.collection('events').add({
  data: {
    title: '中国共产党成立',
    date: '1921-07-23',
    year: 1921,
    location: '上海',
    summary: '中国共产党第一次全国代表大会召开',
    category: 'revolution',
    importance: 5
  }
});
```

## 七、故障排查

### 问题 1: 查询返回空数组
**原因**：集合不存在或权限配置错误
**解决**：
1. 检查集合名称是否正确
2. 检查权限设置是否允许读取
3. 在控制台手动查询验证数据存在

### 问题 2: 提示"permission denied"
**原因**：权限配置过严
**解决**：临时设置为 `{ "read": true }` 测试

### 问题 3: 数据导入失败
**原因**：JSON 格式错误或字段类型不匹配
**解决**：
1. 使用 JSON 校验工具检查格式
2. 确保日期字段使用 ISO 8601 格式
3. 确保数组字段使用 `[]` 而非字符串

## 八、性能优化建议

1. **分页查询**：单次查询不超过 100 条
2. **使用索引**：在常用查询字段上建立索引
3. **缓存策略**：前端缓存不常变化的数据（如英雄列表）
4. **按需加载**：详情页数据按需请求，不在列表页加载

## 九、数据备份

### 定期备份
1. 云开发控制台 → 数据库 → 导出
2. 选择集合 → 导出为 JSON
3. 保存到本地或云存储

### 自动备份（云函数定时触发）
```javascript
// cloud/functions/backup-db/index.js
exports.main = async (event, context) => {
  const db = cloud.database();
  const collections = ['heroes', 'events', 'quotes'];
  
  for (const collectionName of collections) {
    const data = await db.collection(collectionName).get();
    // 上传到云存储
    await cloud.uploadFile({
      cloudPath: `backup/${collectionName}_${Date.now()}.json`,
      fileContent: JSON.stringify(data.data)
    });
  }
  
  return { success: true };
};
```

## 十、下一步

- [ ] 创建 3 个集合
- [ ] 设置索引
- [ ] 配置权限
- [ ] 导入测试数据
- [ ] 在小程序中测试 DBService
- [ ] 迁移完整数据
- [ ] 删除本地 `data/` 目录
