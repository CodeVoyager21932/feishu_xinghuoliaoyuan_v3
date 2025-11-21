# 小程序图片资源添加指南

本指南将帮助您了解如何在微信小程序中正确添加和使用图片资源。

## 1. 图片存放位置 (Directory Structure)

建议将所有本地图片资源存放在 `miniprogram/images/` 目录下。为了保持项目整洁，建议根据功能创建子目录：

*   `miniprogram/images/icons/`：存放图标（如按钮图标、导航图标）
*   `miniprogram/images/heroes/`：存放内容图片（如人物头像、展示图）
*   `miniprogram/images/decorations/`：存放装饰性元素（如分割线、背景纹理）
*   `miniprogram/images/tabbar/`：存放底部导航栏图标

## 2. 添加步骤 (Steps)

1.  **准备图片**：
    *   确保图片清晰度足够（建议为显示尺寸的 2 倍以适配高清屏）。
    *   **重要**：请务必压缩图片！小程序主包大小限制为 2MB。推荐使用 [TinyPNG](https://tinypng.com/) 等工具压缩。
    *   推荐格式：PNG (透明背景), JPG (照片), SVG (矢量图标), WebP (高性能)。
2.  **放入目录**：
    *   将图片文件复制到 `miniprogram/images/` 下的相应子文件夹中。
    *   **命名规范**：建议使用**小写字母**、**数字**和**下划线**，例如 `icon_home_active.png`。避免使用中文或特殊字符。

## 3. 在代码中使用图片 (Usage)

### 3.1 在 WXML 中使用 (推荐)

使用 `<image>` 标签加载本地图片。**请始终使用以 `/` 开头的绝对路径**。

```html
<!-- 示例：加载一个图标 -->
<image class="my-icon" src="/images/icons/biography.png" mode="aspectFit" />

<!-- 示例：加载一个头像 -->
<image class="avatar" src="/images/heroes/leifeng.png" mode="aspectFill" />
```

*   `mode="aspectFit"`: 保持纵横比缩放图片，使图片的长边能完全显示出来。
*   `mode="aspectFill"`: 保持纵横比缩放图片，只保证图片的短边能完全显示出来（常用于头像、卡片封面）。

### 3.2 在 JS 数据中使用 (动态绑定)

如果您需要根据数据动态显示图片（例如列表渲染），请在 JS 文件中定义路径。

**JS 文件 (`page.js`):**
```javascript
Page({
  data: {
    // 定义图片路径
    heroImage: '/images/heroes/leifeng.png',
    
    // 数组数据
    iconList: [
      { id: 1, url: '/images/icons/medal.png', name: '勋章' },
      { id: 2, url: '/images/icons/quote.png', name: '语录' }
    ]
  }
})
```

**WXML 文件 (`page.wxml`):**
```html
<!-- 绑定单个图片 -->
<image src="{{heroImage}}" />

<!-- 循环渲染列表 -->
<view wx:for="{{iconList}}" wx:key="id">
  <image src="{{item.url}}" />
  <text>{{item.name}}</text>
</view>
```

### 3.3 在 WXSS 样式中使用 (背景图)

**注意**：微信小程序 WXSS 中的 `background-image` 属性**不支持**本地路径（如 `/images/bg.png`）。

**解决方案**：

1.  **使用 Base64 编码**（适用于很小的图标）：
    ```css
    .icon {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...");
    }
    ```
2.  **使用 `<image>` 标签模拟背景**（推荐）：
    使用绝对定位将 `<image>` 放在最底层。
    ```html
    <view class="container">
      <!-- 背景图 -->
      <image class="bg-image" src="/images/backgrounds/main_bg.jpg" mode="aspectFill" />
      
      <!-- 页面内容 -->
      <view class="content">...</view>
    </view>
    ```
    ```css
    .bg-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1; /* 确保在内容下方 */
    }
    ```
3.  **使用网络图片**（不推荐用于核心资源）：
    如果图片存储在服务器上，可以使用 HTTPS URL。
    ```css
    .header {
      background-image: url("https://example.com/my-bg.jpg");
    }
    ```

## 4. 常见问题排查

*   **图片不显示？**
    *   检查路径是否正确：是否以 `/` 开头？文件名拼写是否一致（区分大小写）？
    *   检查图片是否存在于 `miniprogram` 目录下。
*   **预览时报错 "文件过大"？**
    *   检查图片大小，单张图片建议不超过 200KB。
    *   检查 `miniprogram/images` 文件夹总大小，如果太大，需要压缩或删除无用图片。

---
*生成时间: 2025-11-21*
