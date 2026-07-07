import type { DesignConfig } from './design-config.js'

const WEIGHT_DESC: Record<string, string> = {
  thin: 'font-light', normal: 'font-normal', medium: 'font-medium', bold: 'font-semibold',
}
const DENSITY_HEIGHT: Record<string, string> = {
  compact: 'h-8', normal: 'h-9', comfortable: 'h-10',
}
const BORDER_DESC: Record<string, string> = {
  solid: '`border`（1px 实线）', none: '`border-0`（无边框）', subtle: '`border-border/40`（半透明边框）',
}
const ELEVATION_CARD: Record<string, string> = {
  flat: 'shadow-none', subtle: 'shadow-sm', medium: 'shadow-md', dramatic: 'shadow-xl',
}
const BUTTON_DESC: Record<string, string> = { default: 'rounded-md', pill: 'rounded-full', square: 'rounded-none' }
const CARD_DESC: Record<string, string> = {
  bordered: 'border + shadow-sm', elevated: '无边框 + shadow-lg', flat: '无边框无阴影', glass: 'bg-card/80 + backdrop-blur-md',
}
const INPUT_DESC: Record<string, string> = {
  outline: 'border + bg-transparent', filled: 'border-0 bg-muted', underline: 'border-b + rounded-none',
}

interface GenerateAgentMdParams {
  hex: string
  brandName: string
  fontName: string
  pageType: string
  designConfig: DesignConfig
}

function commonBase(params: GenerateAgentMdParams) {
  const { hex, brandName, fontName, pageType, designConfig: dc } = params

  return `# tensor_ui — ${brandName} 设计系统

> 品牌: ${brandName} | 主色: \`${hex}\` | 字体: ${fontName} | 页面类型: ${pageType}

本文档定义了 tensor_ui 统一设计系统的技术栈、可用组件、设计 token 和编码约定。所有 AI agent 和开发者在构建前端页面时必须遵守这些规范。

## 技术栈

- **框架**: Next.js 15 (App Router, React 19, RSC)
- **UI 组件库**: shadcn/ui (New York style)，基于 Radix UI 原语
- **样式**: Tailwind CSS v4，OKLCH 色彩空间 CSS 变量
- **图标**: Lucide React (\`lucide-react\`)
- **字体**: ${fontName}，通过 \`next/font/google\` 加载
- **主题**: \`next-themes\`，使用 \`.dark\` class 策略
- **表单验证**: React Hook Form + Zod
- **动画**: Framer Motion + tw-animate-css
- **图表**: Recharts

## 目录结构

\`\`\`
components/
  ui/                   # shadcn/ui 基础组件（禁止修改）
  theme-provider.tsx    # 暗/亮主题 Provider
  theme-toggle.tsx      # 主题切换按钮
lib/
  utils.ts              # cn() class 合并工具
hooks/                  # 自定义 React hooks
app/
  globals.css           # OKLCH 设计 token 定义
  layout.tsx            # 根 layout（字体 + ThemeProvider）
  page.tsx              # 首页
\`\`\`

## 可用 UI 组件 (components/ui/)

### 布局与容器
\`card\`, \`separator\`, \`aspect-ratio\`, \`resizable\`, \`scroll-area\`

### 表单控件
\`button\`, \`input\`, \`textarea\`, \`select\`, \`checkbox\`, \`radio-group\`, \`switch\`, \`slider\`, \`toggle\`, \`toggle-group\`, \`label\`, \`field\`, \`input-group\`, \`button-group\`, \`form\`, \`input-otp\`, \`calendar\`

### 导航
\`tabs\`, \`accordion\`, \`menubar\`, \`navigation-menu\`, \`breadcrumb\`, \`pagination\`, \`sidebar\`, \`collapsible\`

### 反馈与弹层
\`dialog\`, \`alert-dialog\`, \`sheet\`, \`drawer\`, \`popover\`, \`hover-card\`, \`tooltip\`, \`context-menu\`, \`dropdown-menu\`, \`command\`, \`toast\`, \`toaster\`, \`sonner\`, \`alert\`, \`progress\`, \`spinner\`, \`skeleton\`, \`empty\`, \`badge\`

### 数据展示
\`table\`, \`avatar\`, \`carousel\`, \`chart\`

### 工具
\`kbd\`（键盘快捷键显示）

## 设计 Token (app/globals.css)

色彩系统使用 OKLCH 色彩空间 + CSS 变量。所有颜色通过 \`.dark\` class 自动适配暗色模式。

### 语义色彩
| Token | 用途 |
|---|---|
| \`background\` / \`foreground\` | 页面基色 |
| \`card\` / \`card-foreground\` | 卡片表面 |
| \`primary\` / \`primary-foreground\` | 主要操作（按钮、链接） |
| \`secondary\` / \`secondary-foreground\` | 次要操作 |
| \`muted\` / \`muted-foreground\` | 弱化文字、柔和背景 |
| \`accent\` / \`accent-foreground\` | 强调高亮 |
| \`destructive\` / \`destructive-foreground\` | 危险/删除操作 |
| \`border\` | 默认边框 |
| \`input\` | 输入框边框 |
| \`ring\` | 焦点环颜色 |
| \`sidebar\` / \`sidebar-*\` | 侧边栏专用色彩 |

### 圆角
- \`--radius\`: 0.625rem（基准值）
- 派生值: \`radius-sm\`, \`radius-md\`, \`radius-lg\`, \`radius-xl\`

### 字体
- 无衬线: \`font-sans\` → ${fontName}
- 等宽: \`font-mono\` → Geist Mono

## 当前设计配置（7 维度）

### §1 排版 (typography)
| 配置项 | 当前值 | 说明 |
|--------|--------|------|
| \`weightStyle\` | \`${dc.typography.weightStyle}\` | 交互元素字重：Button/Badge/Tabs 使用 \`${WEIGHT_DESC[dc.typography.weightStyle]}\` |

### §2 形状 (shape)
| 配置项 | 当前值 | 说明 |
|--------|--------|------|
| \`density\` | \`${dc.shape.density}\` | 控件密度：Button ${DENSITY_HEIGHT[dc.shape.density]}、Input ${DENSITY_HEIGHT[dc.shape.density]} |
| \`borderStyle\` | \`${dc.shape.borderStyle}\` | 边框风格：Card/Input/Badge 使用 ${BORDER_DESC[dc.shape.borderStyle]} |

### §3 深度 (elevation)
| 配置项 | 当前值 | 说明 |
|--------|--------|------|
| \`style\` | \`${dc.elevation.style}\` | 阴影层级：Card=${ELEVATION_CARD[dc.elevation.style]} |

### §4 组件风格 (components)
| 配置项 | 当前值 | 说明 |
|--------|--------|------|
| \`buttonShape\` | \`${dc.components.buttonShape}\` | 按钮圆角：${BUTTON_DESC[dc.components.buttonShape]} |
| \`cardStyle\` | \`${dc.components.cardStyle}\` | 卡片风格：${CARD_DESC[dc.components.cardStyle]} |
| \`inputStyle\` | \`${dc.components.inputStyle}\` | 输入框风格：${INPUT_DESC[dc.components.inputStyle]} |

### 设计约束（AI 生成时必须遵守）

1. **字重约束**: 所有交互元素使用 \`${WEIGHT_DESC[dc.typography.weightStyle]}\`，标题使用更重一级的字重，禁止在同一页面混用超过 3 种字重
2. **密度约束**: 按钮默认高度 ${DENSITY_HEIGHT[dc.shape.density]}，输入框高度 ${DENSITY_HEIGHT[dc.shape.density]}，保持控件垂直对齐
3. **边框约束**: 容器类组件使用 ${BORDER_DESC[dc.shape.borderStyle]}
4. **阴影约束**: 层级关系必须一致——Card 使用 \`${ELEVATION_CARD[dc.elevation.style]}\`，不得倒置
5. **按钮约束**: 所有 Button 使用 \`${BUTTON_DESC[dc.components.buttonShape]}\` 圆角
6. **卡片约束**: Card 统一使用 ${CARD_DESC[dc.components.cardStyle]} 风格
7. **输入框约束**: Input/Textarea/Select 使用 ${INPUT_DESC[dc.components.inputStyle]} 风格

## 编码规范

### Class 合并
始终使用 \`cn()\` 合并 Tailwind class：
\`\`\`tsx
import { cn, Button, Card, CardContent, CardHeader, CardTitle } from '@tensor-ui/core'
<div className={cn('base-class', condition && 'conditional-class', className)} />
\`\`\`

### 组件导入
\`\`\`tsx
\`\`\`

### 图标
使用 Lucide React 图标，通过 className 控制尺寸：
\`\`\`tsx
import { Search, Plus, Settings } from 'lucide-react'
<Search className="h-4 w-4" />
\`\`\`

### 组件变体 (CVA)
shadcn/ui 组件使用 \`class-variance-authority\` 管理变体：
\`\`\`tsx
<Button variant="outline" size="sm">点击</Button>
<Badge variant="secondary">标签</Badge>
\`\`\`

### 主题
- 使用语义色彩 token（\`bg-background\`、\`text-foreground\`、\`border-border\`），禁止硬编码颜色
- 暗色模式由 CSS 变量自动处理
- 在 layout 中使用 \`ThemeProvider\`，用 \`ThemeToggle\` 供用户切换

### 文件约定
- 页面放在 \`app/\` 下（Next.js App Router）
- 共享组件放在 \`components/\` 下
- 客户端组件必须加 \`'use client'\` 指令
- 优先使用 TypeScript (\`.tsx\`)，也接受 JavaScript (\`.jsx\`)

## 在新项目中创建页面

1. 从导出包复制 \`components/ui/\`、\`lib/utils.ts\`、\`globals.css\` 到你的项目
2. 安装所需依赖（见 README.md）
3. 在 \`layout.tsx\` 中配置字体和 \`ThemeProvider\`
4. 创建 \`app/your-page/page.tsx\`
5. 从 \`@/components/ui/\` 导入所需组件
6. 使用语义色彩 token 进行样式设计

---
`
}

const PAGE_LAYOUT: Record<string, string> = {
  landing: `## 页面布局节奏 — SaaS / 工具型

SaaS 页面的核心特征是 **等间距、对称、理性排布**。用户来这里是为了高效完成任务或快速了解产品价值。

### 页面结构流

\`\`\`
Nav (sticky, border-b, bg-background/95 backdrop-blur)
  → Hero (py-20, text-center, container 居中)
  → Separator
  → Features (py-20, grid-3 等宽卡片)
  → Separator
  → Social Proof (py-16, bg-card 交替背景, grid-4 数据指标)
  → Separator
  → Pricing (py-20, grid-3 定价卡片，中间高亮)
  → CTA (py-16, text-center)
  → Footer (border-t, py-8)
\`\`\`

### 导航栏

\`\`\`tsx
<nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/95 px-6 py-3 backdrop-blur">
  <span className="text-lg font-bold text-primary">Logo</span>
  <div className="flex items-center gap-4 text-sm text-muted-foreground">
    <span>产品</span>
    <span>定价</span>
    <span>文档</span>
    <Button size="sm">开始使用</Button>
  </div>
</nav>
\`\`\`

### 段落间距规则

| 区块 | 纵向间距 | 横向 | 分隔方式 |
|---|---|---|---|
| Hero | \`py-20\` ~ \`py-24\` | \`max-w-2xl mx-auto text-center\` | 下方 \`<Separator />\` |
| 特性区 | \`py-20\` | \`grid grid-cols-3 gap-6\` | 上下 \`<Separator />\` |
| 数据指标 | \`py-16\` | \`grid grid-cols-4 gap-4 text-center\` | \`bg-card\` 交替背景 |
| 定价 | \`py-20\` | \`grid grid-cols-3 gap-6\` | 上方 \`<Separator />\` |
| CTA | \`py-16\` | \`text-center\` | — |
| Footer | \`py-8\` | 全宽 | \`border-t\` |

### Dashboard / 后台布局

\`\`\`
Sidebar (fixed, w-64, bg-card, border-r)
  → TopBar (sticky, border-b, 搜索 + 头像)
  → Content (flex-1, overflow-auto, p-6)
    → Stats (grid-4 卡片)
    → Table / Chart (Card 包裹)
\`\`\`

\`\`\`tsx
<div className="flex h-screen">
  <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
    {/* logo + nav items + avatar */}
  </aside>
  <main className="flex-1 flex flex-col min-w-0">
    <div className="sticky top-0 border-b border-border bg-background px-6 py-3">
      {/* search + actions */}
    </div>
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* stats grid + table + chart */}
    </div>
  </main>
</div>
\`\`\`

### 高频组件

\`Card\`（统计/特性）、\`Table\`（数据列表）、\`Badge\`（状态标签）、\`Progress\`（进度条）、\`Tabs\`（内容切换）、\`Chart\`（图表）、\`Avatar\`（用户头像）

### 布局禁忌

- ❌ 不要用全屏 Hero（\`min-h-screen\`）— SaaS 页面信息密度优先
- ❌ 不要用 masonry / bento 网格 — 等宽 grid 更符合工具型气质
- ❌ 不要省略 Separator — SaaS 页面靠线性分隔建立结构感
- ❌ 不要使用大面积图片背景 — 保持干净的纯色背景
- ✅ 始终对称：grid-3、grid-4，保持列数一致
- ✅ 始终 text-center 的 Hero + CTA — 建立纵向中轴线`,

  dashboard: `## 页面布局节奏 — SaaS 仪表板

SaaS 仪表板的核心特征是 **功能导向、紧凑密集、侧栏+主区分离**。用户来这里是为了高效查看数据和操作。

### 页面结构流

\`\`\`
Sidebar (fixed, w-64, bg-card, border-r)
  → TopBar (sticky, border-b, 搜索 + 头像)
  → Content (flex-1, overflow-auto, p-6)
    → Stats (grid-4 卡片)
    → Table / Chart (Card 包裹)
    → Progress / 目标追踪
\`\`\`

### 布局模板

\`\`\`tsx
<div className="flex h-screen">
  <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
    {/* logo */}
    <div className="flex items-center gap-2 p-4">
      <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
        <TrendingUp className="h-4 w-4" />
      </div>
      <span className="font-semibold">Dashboard</span>
    </div>
    <Separator />
    {/* nav items */}
    <nav className="flex-1 p-3 space-y-1">
      <button className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm bg-accent text-accent-foreground">
        <LayoutDashboard className="h-4 w-4" /> 概览
      </button>
      <button className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
        <Users className="h-4 w-4" /> 用户
      </button>
    </nav>
    {/* bottom avatar */}
    <div className="p-3 border-t border-border flex items-center gap-2">
      <Avatar className="h-8 w-8"><AvatarFallback>JZ</AvatarFallback></Avatar>
      <span className="text-sm text-muted-foreground">Admin</span>
    </div>
  </aside>
  <main className="flex-1 flex flex-col min-w-0">
    <div className="sticky top-0 border-b border-border bg-background px-6 py-3 flex items-center justify-between">
      <Input placeholder="搜索..." className="w-64" />
      <Avatar className="h-8 w-8"><AvatarFallback>JZ</AvatarFallback></Avatar>
    </div>
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* stats grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">总收入</p>
          <p className="text-2xl font-semibold">¥128,430</p>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">↑12%</Badge>
        </CardContent></Card>
      </div>
      {/* table */}
      <Card>
        <CardHeader><CardTitle>最近订单</CardTitle></CardHeader>
        <CardContent><Table>...</Table></CardContent>
      </Card>
    </div>
  </main>
</div>
\`\`\`

### 段落间距规则

| 区块 | 间距 | 布局 |
|---|---|---|
| 统计卡片 | \`gap-4\` | \`grid grid-cols-4\` |
| 表格区 | \`p-0\`（Card 内嵌） | 全宽 Table |
| 图表区 | \`p-4\` | Card 包裹 |

### 高频组件

\`Card\`（统计）、\`Table\`（数据列表）、\`Badge\`（状态标签）、\`Progress\`（进度）、\`Tabs\`（切换）、\`Chart\`（图表）、\`Avatar\`（用户）、\`Input\`（搜索）

### 布局禁忌

- ❌ 不要用全屏 Hero — 仪表板没有 Hero
- ❌ 不要用大间距 \`py-20\` — 保持紧凑 \`p-4\` ~ \`p-6\`
- ❌ 不要用 text-center — 数据左对齐更易扫读
- ✅ 始终有侧边栏导航 + 顶部搜索栏
- ✅ 统计卡片 grid-4 等宽，每个含标签 + 数值 + 变化 Badge`,

  ecommerce: `## 页面布局节奏 — 电商 / 商城

电商页面的核心特征是 **高信息密度、紧凑间距、购物动线清晰**。用户来这里是为了浏览和购买商品。

### 页面结构流

\`\`\`
Nav (sticky, border-b, 三栏: Logo | 搜索栏 | 购物车+头像)
  → 公告栏 (bg-primary text-primary-foreground, py-1.5, text-center text-xs)
  → Banner / 轮播 (full-bleed, aspect-[21/9], Carousel 组件)
  → 分类导航 (overflow-x-auto, flex gap-3, 横向滚动)
  → 商品网格 (grid-2 ~ grid-4, gap-3~4, 无限加载)
  → 推荐商品 (横滑 scroll-x, "猜你喜欢")
  → Footer (bg-card, grid-4 链接列, 底部支付图标)
\`\`\`

### 导航栏

\`\`\`tsx
<nav className="sticky top-0 z-50 border-b border-border bg-background">
  {/* 顶部公告 */}
  <div className="bg-primary text-primary-foreground text-center text-xs py-1.5">
    新用户首单立减 ¥50 · 全场满 199 包邮
  </div>
  {/* 主导航 */}
  <div className="flex items-center gap-3 px-4 py-2">
    <span className="font-bold text-lg text-primary shrink-0">Store</span>
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder="搜索商品..." className="pl-9" />
    </div>
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px]">3</Badge>
    </Button>
  </div>
</nav>
\`\`\`

### 段落间距规则

| 区块 | 纵向间距 | 横向 | 分隔方式 |
|---|---|---|---|
| 公告栏 | \`py-1.5\` | 全宽 \`text-center\` | 无 |
| Banner | \`py-0\`（紧贴导航） | 全宽 \`aspect-[21/9]\` | 无 |
| 分类导航 | \`py-3 px-4\` | \`flex gap-3 overflow-x-auto\` | \`bg-card\` 背景色切换 |
| 商品网格 | \`p-4\` | \`grid grid-cols-2 gap-3\`（移动端）/ \`grid-cols-4\`（桌面端） | 无 Separator |
| 推荐横滑 | \`py-4 px-4\` | \`flex gap-3 overflow-x-auto\` | 小标题分隔 |
| Footer | \`py-8\` | \`grid grid-cols-4 gap-8\` | \`bg-card\` 背景色 |

### 商品卡片模板

\`\`\`tsx
<Card className="overflow-hidden bg-card">
  <div className="relative aspect-square bg-muted overflow-hidden">
    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
    {product.discount && (
      <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs">
        {product.discount}
      </Badge>
    )}
    <button className="absolute top-2 left-2 text-muted-foreground hover:text-primary">
      <Heart className="h-4 w-4" />
    </button>
  </div>
  <CardContent className="p-3 space-y-1.5">
    <p className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</p>
    <div className="flex items-center gap-1 text-xs">
      <span className="text-primary">{'★'.repeat(Math.round(product.rating))}</span>
      <span className="text-muted-foreground">({product.reviews})</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-primary font-bold text-lg">¥{product.price}</span>
      {product.originalPrice && (
        <span className="text-xs line-through text-muted-foreground">¥{product.originalPrice}</span>
      )}
    </div>
    <Button size="sm" className="w-full">加入购物车</Button>
  </CardContent>
</Card>
\`\`\`

### 分类标签导航模板

\`\`\`tsx
<div className="flex gap-2 overflow-x-auto px-4 py-3 bg-card scrollbar-hide">
  {categories.map(cat => (
    <Badge
      key={cat}
      variant={active === cat ? 'default' : 'secondary'}
      className="shrink-0 cursor-pointer"
    >
      {cat}
    </Badge>
  ))}
</div>
\`\`\`

### 高频组件

\`Card\`（商品卡片）、\`Badge\`（折扣/标签/分类）、\`Carousel\`（Banner 轮播）、\`Input\`（搜索）、\`Button\`（购物车/加购）、\`Separator\`（仅用于 Footer 内部）、\`Dialog/Sheet\`（购物车侧栏/快速查看）

### 布局禁忌

- ❌ 不要用 \`<Separator />\` 分隔商品区块 — 用 \`bg-card\` / \`bg-background\` 色块交替
- ❌ 不要用 \`text-center\` 居中布局 — 电商页面左对齐、信息密集
- ❌ 不要用大段文字描述 — 商品靠图片 + 价格 + 评分说话
- ❌ 不要用 \`py-20\` 大间距 — 电商间距紧凑，\`py-3\` ~ \`py-4\` 为主
- ❌ 不要用 \`grid-cols-3\` 等宽特性卡 — 这是 SaaS 模式
- ✅ 始终有搜索栏 — 电商导航必备
- ✅ 始终有购物车入口 — 右上角 icon + Badge 计数
- ✅ 价格用 \`text-primary font-bold text-lg\`，原价用 \`line-through text-muted-foreground\`
- ✅ 折扣用 \`bg-destructive\` Badge，醒目但不跟随品牌色`,

  portfolio: `## 页面布局节奏 — 品牌官网 / 作品集

品牌官网的核心特征是 **大留白、全屏段落、交错图文、视觉叙事**。用户来这里是为了感受品牌调性和了解产品价值。

### 页面结构流

\`\`\`
Nav (fixed, transparent → 滚动后 bg-background/95 backdrop-blur, border-b)
  → Hero (min-h-screen, 全屏大标题 + 副标题 + CTA)
  → 图文交错 Section 1 (py-32, 图左文右)
  → 图文交错 Section 2 (py-32, 文左图右, bg-card 交替)
  → 数据墙 (py-24, grid-3~4, 大数字 + 标签)
  → Bento Grid (不等高网格, auto-rows-[180px])
  → CTA (py-32, full-bleed bg-primary text-primary-foreground, 大按钮)
  → Footer (py-12, grid-4 链接 + 社交图标)
\`\`\`

### 导航栏

\`\`\`tsx
<nav className={cn(
  "fixed top-0 w-full z-50 transition-all duration-300 px-8 py-4",
  scrolled
    ? "bg-background/95 backdrop-blur border-b border-border"
    : "bg-transparent"
)}>
  <div className="flex items-center justify-between max-w-6xl mx-auto">
    <span className="text-xl font-bold text-foreground">Brand</span>
    <div className="flex items-center gap-8 text-sm">
      <span className="text-muted-foreground hover:text-foreground cursor-pointer">作品</span>
      <span className="text-muted-foreground hover:text-foreground cursor-pointer">关于</span>
      <Button>联系我们</Button>
    </div>
  </div>
</nav>
\`\`\`

### 段落间距规则

| 区块 | 纵向间距 | 横向 | 分隔方式 |
|---|---|---|---|
| Hero | \`min-h-screen\` + \`py-32\` | \`max-w-3xl mx-auto text-center\` 或 左对齐 | 无 Separator |
| 图文交错 | \`py-24\` ~ \`py-32\` | \`grid grid-cols-2 gap-16 items-center\` | \`bg-card\` / \`bg-background\` 交替 |
| 数据墙 | \`py-24\` | \`grid grid-cols-3 gap-8 text-center\` | 背景色切换 |
| Bento Grid | \`py-16\` | \`grid grid-cols-3 auto-rows-[180px] gap-3\` | 无 |
| CTA | \`py-32\` | \`text-center max-w-xl mx-auto\` | \`bg-primary text-primary-foreground\` 全屏色块 |
| Footer | \`py-12\` | \`grid grid-cols-4 gap-8 max-w-6xl mx-auto\` | \`border-t\` |

### Hero 全屏模板

\`\`\`tsx
<section className="min-h-screen flex items-center justify-center px-8">
  <div className="max-w-3xl text-center">
    <Badge variant="secondary" className="mb-6">全新发布</Badge>
    <h1 className="text-6xl font-bold leading-[1.08] tracking-tight text-foreground">
      让技术回归简单
    </h1>
    <p className="mt-6 text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
      为千万开发者打造的下一代开发平台，重新定义构建体验。
    </p>
    <div className="mt-10 flex items-center justify-center gap-4">
      <Button size="lg">免费开始</Button>
      <Button size="lg" variant="outline">预约演示</Button>
    </div>
  </div>
</section>
\`\`\`

### 图文交错模板

\`\`\`tsx
{/* 图左文右 */}
<section className="py-32 px-8">
  <div className="grid grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
      <img src={image} alt="" className="h-full w-full object-cover" />
    </div>
    <div>
      <Badge variant="secondary" className="mb-4">{label}</Badge>
      <h2 className="text-3xl font-bold text-foreground leading-tight">{title}</h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">{description}</p>
      <Button variant="outline" className="mt-6">
        了解更多 <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</section>

{/* 文左图右（交替，加 bg-card） */}
<section className="py-32 px-8 bg-card">
  <div className="grid grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
    <div>{/* 文字内容 */}</div>
    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
      <img src={image} alt="" className="h-full w-full object-cover" />
    </div>
  </div>
</section>
\`\`\`

### 全屏 CTA 模板

\`\`\`tsx
<section className="py-32 px-8 bg-primary text-primary-foreground">
  <div className="max-w-xl mx-auto text-center">
    <h2 className="text-4xl font-bold">准备好了吗？</h2>
    <p className="mt-4 text-primary-foreground/80">立即开始，免费体验 14 天全部功能。</p>
    <Button size="lg" variant="secondary" className="mt-8">免费注册</Button>
  </div>
</section>
\`\`\`

### 高频组件

\`Button\`（Hero CTA / 了解更多）、\`Badge\`（标签/版本号）、\`Card\`（评价卡片）、\`Carousel\`（评价轮播）、\`Avatar\`（评价者头像）

### 布局禁忌

- ❌ 不要用 \`<Separator />\` 分隔段落 — 用 \`bg-card\` / \`bg-background\` 交替背景色，或纯留白
- ❌ 不要用 \`py-20\` 均匀间距 — 品牌页用 \`py-24\` ~ \`py-32\` 大留白，制造呼吸感
- ❌ 不要用紧凑间距 — 品牌页靠留白建立高端感，越挤越廉价
- ✅ 导航栏透明起步，滚动后 \`backdrop-blur\` 过渡
- ✅ 图文交错：奇数段「图左文右」，偶数段「文左图右」+ \`bg-card\` 背景
- ✅ 数字指标用 \`text-5xl font-bold text-primary\` — 大数字震撼感
- ✅ CTA 段落用 \`bg-primary text-primary-foreground\` 全屏色块
- ✅ 字号比 SaaS 大一级：Hero \`text-6xl\`，段标题 \`text-3xl\`，正文 \`text-base\` ~ \`text-lg\``,

  pricing: `## 页面布局节奏 — 定价页

定价页的核心特征是 **三列对比、功能表清晰、转化导向**。用户来这里是为了选择合适的方案。

### 页面结构流

\`\`\`
Nav (sticky, border-b)
  → Header (py-12, text-center, Badge + 大标题 + 副标题)
  → Pricing Cards (grid-3, 中间高亮 border-primary + shadow-lg)
  → FAQ (py-12, Card 列表)
  → Footer (border-t)
\`\`\`

### 定价卡片模板

\`\`\`tsx
<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
  {plans.map(plan => (
    <Card className={cn(
      'bg-card',
      plan.highlighted && 'border-2 border-primary shadow-lg relative'
    )}>
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">最受欢迎</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <p className="text-xs text-muted-foreground">{plan.desc}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="text-sm text-muted-foreground">/月</span>
        </div>
        <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
          {plan.cta}
        </Button>
        <ul className="space-y-2 pt-2">
          {plan.features.map(f => (
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  ))}
</div>
\`\`\`

### 高频组件

\`Card\`（定价/FAQ）、\`Badge\`（推荐标签）、\`Button\`（CTA）、\`Separator\`

### 布局禁忌

- ❌ 不要超过 4 列 — 3 列最佳对比
- ❌ 不要隐藏价格 — 透明定价建立信任
- ✅ 中间方案用 \`border-2 border-primary shadow-lg\` 突出
- ✅ 功能列表用 Check 图标 + \`text-primary\``,

  login: `## 页面布局节奏 — 登录 / 注册

登录页的核心特征是 **全屏居中、单卡片、极简表单**。用户来这里只做一件事。

### 页面结构流

\`\`\`
全屏居中容器 (flex items-center justify-center min-h-screen)
  → Card (max-w-sm)
    → Logo + 标题 + 描述
    → Social Login (grid-2: GitHub + Google)
    → Separator ("或使用邮箱")
    → Form (Email + Password)
    → Submit Button (w-full)
    → 注册链接
\`\`\`

### 登录卡片模板

\`\`\`tsx
<div className="min-h-screen flex items-center justify-center px-4">
  <Card className="w-full max-w-sm">
    <CardHeader className="text-center pb-2">
      <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">A</span>
      </div>
      <CardTitle className="text-xl">欢迎回来</CardTitle>
      <CardDescription>登录你的账户以继续</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="gap-2"><Github className="h-4 w-4" />GitHub</Button>
        <Button variant="outline" className="gap-2"><Mail className="h-4 w-4" />Google</Button>
      </div>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">或使用邮箱</span>
        <Separator className="flex-1" />
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">邮箱</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">密码</Label>
            <span className="text-xs text-primary cursor-pointer hover:underline">忘记密码？</span>
          </div>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
      </div>
      <Button className="w-full">登录</Button>
      <p className="text-center text-xs text-muted-foreground">
        还没有账户？<span className="text-primary cursor-pointer hover:underline font-medium">注册</span>
      </p>
    </CardContent>
  </Card>
</div>
\`\`\`

### 高频组件

\`Card\`（登录容器）、\`Input\`（表单字段）、\`Button\`（提交/社交登录）、\`Label\`、\`Separator\`

### 布局禁忌

- ❌ 不要加侧边栏或导航 — 登录页极简
- ❌ 不要加太多表单字段 — 邮箱+密码足够
- ✅ 卡片 max-w-sm 居中
- ✅ 社交登录在表单上方`,

  blog: `## 页面布局节奏 — 博客 / 内容

博客页的核心特征是 **窄幅单栏、阅读优先、侧边栏辅助**。用户来这里是为了阅读文章。

### 页面结构流

\`\`\`
Nav (sticky, border-b, 标题 + 搜索 + 订阅按钮)
  → 主内容区 (flex 双栏, max-w-5xl mx-auto)
    → Main Column (flex-1)
      → Featured Article (大图 + 标题 + 摘要)
      → Separator
      → Post List (紧凑文章列表)
      → 加载更多按钮
    → Sidebar (w-48, sticky)
      → 标签云
      → 关于
      → 邮件订阅 Card
\`\`\`

### 段落间距规则

| 区块 | 间距 | 布局 |
|---|---|---|
| Featured | \`mb-8\` | 大图 \`aspect-[2/1]\` + 标题 + 摘要 |
| 文章列表 | \`space-y-6\` | Badge + 标题 + 摘要 + 元信息 |
| 侧边栏 | \`space-y-6\` | sticky top-16 |

### 文章列表模板

\`\`\`tsx
<article className="group cursor-pointer">
  <Badge variant="secondary" className="mb-1.5 text-[10px]">{post.category}</Badge>
  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
    {post.title}
  </h3>
  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
    <span>{post.author}</span> · <span>{post.date}</span> · <span>{post.readTime}</span>
  </div>
</article>
\`\`\`

### 高频组件

\`Card\`（订阅卡片）、\`Badge\`（分类标签）、\`Input\`（搜索/邮件）、\`Button\`（订阅/加载更多）、\`Avatar\`（作者头像）、\`Separator\`

### 布局禁忌

- ❌ 不要用 grid 铺文章 — 单栏列表更适合阅读
- ❌ 不要用大间距 — 文章间 space-y-6 即可
- ✅ Featured 文章用大图 + 标题突出
- ✅ 侧边栏 sticky，不抢主内容注意力`,
}

export function generateAgentMd(params: GenerateAgentMdParams): string {
  const base = commonBase(params)
  const layout = PAGE_LAYOUT[params.pageType] || PAGE_LAYOUT.landing
  return base + '\n' + layout + '\n'
}
