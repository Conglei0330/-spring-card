# 🐴 马年新春贺卡生成器

一款基于阿里云百炼的 AI 新春贺卡生成器，可一键生成祝福语和 9:16 竖版贺卡长图，特别适合发送给长辈、亲友、同事。

![马年新春贺卡](https://img.shields.io/badge/%E9%A9%AC%E5%B9%B4-2026-red?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)

## ✨ 核心功能

- 🎯 **一键生成贺词**：使用阿里云百炼 `qwen-max` 模型生成定制化新春祝福语
- 🎨 **自动合成贺卡**：使用 `qwen-vl-max` 生成背景图，Canvas 合成 9:16 长图
- 📱 **移动端优化**：大按钮、大字体、适老化设计，长辈也能轻松使用
- 💾 **一键保存**：支持复制文案、下载图片（兼容微信内置浏览器）
- 🔄 **无限换新**：不满意？点一下就能换一条贺词或换一张图片
- 🎭 **多种风格**：喜庆温暖、文雅大气、幽默风趣、简短精炼、四字成语等

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/spring-card.git
cd spring-card
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填入你的配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# 阿里云百炼 API Key（必填）
# 获取地址：https://bailian.console.aliyun.com/
DASHSCOPE_API_KEY=sk-bd82579fd32f40eb823a8398609f2893

# 阿里云 OSS 配置（可选，用于存储生成的图片）
# 获取地址：https://oss.console.aliyun.com/
OSS_REGION=oss-cn-hangzhou
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_BUCKET=spring-card

# 节流配置（防滥用）
RATE_LIMIT_GREETING=10  # 每分钟最多生成贺词次数
RATE_LIMIT_IMAGE=3      # 每分钟最多生成图片次数
```

**重要**：
- `DASHSCOPE_API_KEY` 是必填项，可在[阿里云百炼控制台](https://bailian.console.aliyun.com/)获取
- OSS 配置是可选的，如果不配置，图片会使用临时 URL（有效期约 1 小时）

### 4. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
spring-card/
├── components/          # React 组件
│   ├── Header.tsx      # 顶部标题组件
│   ├── GreetingForm.tsx # 生成表单组件
│   ├── GreetingResult.tsx # 贺词展示组件
│   └── CardPreview.tsx # 贺卡预览组件
├── lib/                # 工具库
│   ├── bailian.ts      # 百炼 SDK 封装
│   ├── canvas.ts       # Canvas 合成工具
│   ├── oss.ts          # OSS 上传工具
│   └── rate-limit.ts   # 限流工具
├── pages/              # Next.js 页面
│   ├── api/            # API 路由
│   │   ├── greeting.ts # 贺词生成接口
│   │   └── card.ts     # 图片生成接口
│   ├── _app.tsx        # 应用入口
│   ├── _document.tsx   # HTML 文档
│   └── index.tsx       # 主页面
├── styles/             # 样式文件
│   └── globals.css     # 全局样式（适老化）
├── .env.example        # 环境变量示例
├── .gitignore          # Git 忽略文件
├── next.config.js      # Next.js 配置
├── package.json        # 依赖配置
├── tailwind.config.js  # Tailwind CSS 配置
└── tsconfig.json       # TypeScript 配置
```

## 🎯 核心技术栈

- **前端框架**：Next.js 14 + React 18
- **语言**：TypeScript 5.3
- **样式**：Tailwind CSS 3.3 + 自定义 CSS（适老化）
- **AI 模型**：
  - 文案生成：阿里云百炼 `qwen-max`
  - 图片生成：阿里云百炼 `qwen-vl-max`
- **图片合成**：Canvas API（浏览器原生）
- **存储**：阿里云 OSS（可选）

## 🔧 API 接口说明

### 1. 贺词生成接口 `/api/greeting`

**请求方法**：`POST`

**请求参数**：

```json
{
  "target": "爸妈",           // 祝福对象：爸妈/亲友/同事/客户/老师/长辈
  "style": "喜庆温暖",        // 风格：喜庆温暖/文雅大气/幽默风趣/简短精炼/四字成语
  "length": "medium",         // 长度：short/medium/long
  "signature": "小明"         // 署名（可选）
}
```

**响应示例**：

```json
{
  "success": true,
  "data": {
    "text": "爸妈新年好！马年到，愿您二老龙马精神、笑口常开...",
    "alt": ["备选贺词1", "备选贺词2", "备选贺词3"],
    "short": "马年吉祥 阖家安康"
  },
  "remaining": 9  // 剩余可用次数
}
```

### 2. 图片生成接口 `/api/card`

**请求方法**：`POST`

**请求参数**：

```json
{
  "style": "default"  // 风格：default/ink/paper-cut/lantern/modern
}
```

**响应示例**：

```json
{
  "success": true,
  "data": {
    "imageUrl": "https://your-oss-bucket.oss-cn-hangzhou.aliyuncs.com/cards/xxx.png",
    "style": "default"
  },
  "remaining": 2  // 剩余可用次数
}
```

## 🎨 Canvas 合成原理

项目采用**前端 Canvas 合成**方案，确保文字清晰准确：

1. **后端生成背景图**：调用百炼 `qwen-vl-max` 生成 9:16 纯背景（无文字）
2. **前端 Canvas 合成**：
   - 绘制背景图（1080×1920）
   - 叠加半透明白底文本区
   - 渲染标题、贺词、署名（使用系统字体）
   - 自动换行、居中对齐
3. **导出 PNG**：Canvas.toBlob() 导出高清 PNG
4. **下载保存**：触发浏览器下载或提示长按保存

**优势**：
- ✅ 文字 100% 准确（避免 AI 生成文字乱码）
- ✅ 样式可控（字号、颜色、行距）
- ✅ 性能好（客户端渲染，不占用服务器资源）

## 📱 适老化设计

### 视觉设计
- 基础字号：18px（比常规 16px 大）
- 按钮高度：≥ 56px（易点击）
- 高对比度：红金配色，清晰易读
- 圆角按钮：16px 圆角，视觉柔和

### 交互设计
- 少输入：默认直接生成，可选项折叠
- 强引导：主按钮突出，次要按钮区分明显
- 容错：失败自动重试，提供"重新生成"
- 可见反馈：加载状态清晰，动画不刺眼

### 移动端优化
- 点击区域扩大（按钮 ≥ 48px）
- 支持长按保存图片（兼容微信）
- 吸底按钮（重要操作固定底部）
- 自动滚动（生成后滚动到结果区）

## 🚀 部署指南

### 部署到 Vercel（推荐）

1. 在 [Vercel](https://vercel.com) 注册账号
2. 导入 GitHub 仓库
3. 配置环境变量（与 `.env.local` 相同）
4. 点击部署

### 部署到阿里云函数计算

1. 安装 Serverless Devs：
   ```bash
   npm install -g @serverless-devs/s
   ```

2. 配置 `s.yaml`（参考官方文档）

3. 部署：
   ```bash
   s deploy
   ```

### 部署到服务器（Docker）

1. 创建 `Dockerfile`：
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. 构建并运行：
   ```bash
   docker build -t spring-card .
   docker run -p 3000:3000 --env-file .env.local spring-card
   ```

## ⚠️ 注意事项

### 1. API Key 安全
- ❌ 不要将 `.env.local` 提交到 Git
- ✅ 使用环境变量管理敏感信息
- ✅ 生产环境使用服务器端 API 调用

### 2. 成本控制
- 文案生成：约 0.001 元/次（qwen-max）
- 图片生成：约 0.05-0.1 元/次（qwen-vl-max）
- 建议设置每日预算上限（在百炼控制台）

### 3. 限流策略
- 默认：贺词每分钟 10 次，图片每分钟 3 次
- 生产环境建议使用 Redis 替代内存限流
- 考虑添加用户登录 + 防刷机制

### 4. 浏览器兼容性
- Chrome/Edge 90+：✅ 完全支持
- Safari 14+：✅ 完全支持（需 CORS 配置）
- 微信内置浏览器：✅ 支持长按保存
- IE 11：❌ 不支持（需 polyfill）

## 🐛 常见问题

### Q1: 图片生成很慢怎么办？
A: 图片生成需要 10-20 秒，这是 AI 模型的正常响应时间。建议：
- 前端显示进度提示
- 设置 30 秒超时
- 失败后提供重试按钮

### Q2: 微信内无法下载图片？
A: 微信内置浏览器限制直接下载，建议：
- 提示用户"长按图片保存"
- 或引导"右上角…用浏览器打开"

### Q3: 文字乱码或不准确？
A: 本项目使用 Canvas 前端合成，文字 100% 准确。如果仍有问题：
- 检查字体是否加载成功
- 尝试更换系统字体（如 Arial、SimSun）

### Q4: OSS 上传失败？
A: 检查 OSS 配置：
- Bucket 是否存在
- AccessKey 权限是否正确
- CORS 是否配置（允许浏览器跨域访问）

### Q5: 如何添加更多风格？
A: 修改 `lib/bailian.ts` 中的 `stylePrompts`：
```typescript
const stylePrompts: Record<string, string> = {
  default: '红金配色、祥云、灯笼...',
  custom: '你的自定义风格描述',
};
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add some amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 开源协议

本项目基于 [MIT 协议](LICENSE) 开源。

## 🙏 致谢

- [阿里云百炼](https://bailian.console.aliyun.com/) - 提供强大的 AI 能力
- [Next.js](https://nextjs.org/) - 优秀的 React 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用的 CSS 框架

---

**祝您马年吉祥，龙马精神！🐴✨**

如有问题或建议，欢迎提交 [Issue](https://github.com/your-username/spring-card/issues)。
