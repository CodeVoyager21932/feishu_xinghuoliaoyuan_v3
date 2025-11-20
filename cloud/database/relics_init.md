# 红色信物数据库初始化文档

## 集合列表

### 1. relics（信物表）
存储所有可收集的红色信物基础数据。

**字段结构**：
| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `_id` | String | 是 | 自动生成的唯一ID | - |
| `relic_id` | String | 是 | 信物ID | "relic_ssr_001" |
| `name` | String | 是 | 信物名称 | "南湖红船模型" |
| `rarity` | String | 是 | 稀有度 | "SSR" / "SR" / "R" |
| `image` | String | 是 | 图片URL | "/images/relics/red-boat.png" |
| `related_hero_id` | String | 否 | 关联英雄ID | "hero_001" |
| `related_event` | String | 否 | 关联事件 | "中共一大" |
| `story` | String | 是 | 信物故事 | "1921年7月..." |
| `year` | Number | 是 | 年份 | 1921 |
| `category` | String | 是 | 分类 | "革命遗物" |
| `created_at` | Date | 是 | 创建时间 | 自动生成 |

**索引设置**：
- `relic_id`: 唯一索引
- `rarity`: 普通索引

---

### 2. user_relics（用户信物表）
存储用户拥有的信物及碎片数量。

**字段结构**：
| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `_id` | String | 是 | 自动生成的唯一ID | - |
| `_openid` | String | 是 | 用户OpenID | 自动获取 |
| `relic_id` | String | 是 | 信物ID | "relic_ssr_001" |
| `rarity` | String | 是 | 稀有度 | "SSR" |
| `fragments` | Number | 是 | 碎片数量 | 50 |
| `obtained_at` | Date | 是 | 获得时间 | 自动生成 |

**索引设置**：
- `_openid` + `relic_id`: 复合唯一索引

---

### 3. draw_history（抽奖历史表）
记录用户的抽奖历史。

**字段结构**：
| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `_id` | String | 是 | 自动生成的唯一ID | - |
| `_openid` | String | 是 | 用户OpenID | 自动获取 |
| `relic_id` | String | 是 | 抽到的信物ID | "relic_ssr_001" |
| `rarity` | String | 是 | 稀有度 | "SSR" |
| `is_new` | Boolean | 是 | 是否新获得 | true |
| `fragments_gained` | Number | 是 | 获得碎片数 | 0 或 50 |
| `points_cost` | Number | 是 | 消耗积分 | 100 |
| `drawn_at` | Date | 是 | 抽取时间 | 自动生成 |

**索引设置**：
- `_openid`: 普通索引
- `drawn_at`: 普通索引（降序）

---

### 4. users（用户表 - 需要添加积分字段）
在现有用户表中添加积分字段。

**新增字段**：
| 字段名 | 类型 | 必填 | 说明 | 默认值 |
|--------|------|------|------|--------|
| `points` | Number | 是 | 学习积分 | 500 |

---

## 初始化步骤

### 步骤 1: 创建集合
在云开发控制台 → 数据库 → 添加集合：
1. `relics`
2. `user_relics`
3. `draw_history`

### 步骤 2: 设置索引

#### relics 集合
```javascript
// 唯一索引
db.collection('relics').createIndex({
  relic_id: 1
}, {
  unique: true
});

// 普通索引
db.collection('relics').createIndex({
  rarity: 1
});
```

#### user_relics 集合
```javascript
// 复合唯一索引
db.collection('user_relics').createIndex({
  _openid: 1,
  relic_id: 1
}, {
  unique: true
});
```

#### draw_history 集合
```javascript
// 普通索引
db.collection('draw_history').createIndex({
  _openid: 1
});

db.collection('draw_history').createIndex({
  drawn_at: -1
});
```

### 步骤 3: 导入信物数据（可选）
如果需要将信物数据存储在云端，可以导入 JSON 数据。

**注意**：当前实现使用前端本地数据（`miniprogram/data/relics.js`），云端仅存储用户收集记录。

---

## 权重配置说明

### 稀有度概率
- **SSR（传说）**: 5%
- **SR（稀有）**: 25%
- **R（普通）**: 70%

### 重复信物碎片转换
- **SSR 重复**: 50 碎片
- **SR 重复**: 20 碎片
- **R 重复**: 5 碎片

### 抽取消耗
- 每次抽取消耗：**100 积分**

---

## 积分获取方式

用户可通过以下方式获得积分：
1. **每日签到**: +10 积分
2. **完成卡片学习**: +5 积分/张
3. **AI 对话互动**: +2 积分/次
4. **连续打卡奖励**: 
   - 3天: +30 积分
   - 7天: +50 积分
   - 30天: +200 积分

---

## 测试数据

### 测试用户积分
```javascript
// 在 users 集合中更新测试用户
db.collection('users').where({
  _openid: 'test-openid'
}).update({
  data: {
    points: 1000
  }
});
```

### 模拟抽奖
```javascript
// 调用云函数测试
wx.cloud.callFunction({
  name: 'draw-relic',
  success: (res) => {
    console.log('抽奖结果', res.result);
  }
});
```

---

## 注意事项

1. **数据一致性**: 确保 `relics.js` 中的 `relic_id` 与云函数中的 `RELICS_BY_RARITY` 保持一致
2. **积分安全**: 所有积分操作必须在云函数中进行，防止前端篡改
3. **并发控制**: 使用数据库事务确保抽奖过程的原子性
4. **图片资源**: 提前准备好所有信物的图片资源

---

## 常见问题

### Q1: 如何调整稀有度概率？
A: 修改云函数 `draw-relic/index.js` 中的 `RARITY_WEIGHTS` 配置。

### Q2: 如何添加新信物？
A: 在 `miniprogram/data/relics.js` 中添加新数据，并更新云函数中的 `RELICS_BY_RARITY`。

### Q3: 用户积分不足怎么办？
A: 引导用户完成学习任务获取积分，或提供积分兑换功能。

---

**初始化完成后，请测试抽奖功能确保正常运行！**
