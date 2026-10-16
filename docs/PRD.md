# Hearth 家居商城 — PRD

## 1. 背景与目标

- **场景**：一面实作（限时 50 分钟）——面向海外消费者的商品选购 Web 应用，需达到可向客户演示的程度，桌面与移动端体验均良好。
- **评价重点**：业务理解、功能正确性、使用体验、代码质量、交付完整度；功能数量不作为主要依据，合理取舍与完成度更重要；线上部署为大幅加分项。
- **已确认决策**：极简家居生活品类；含轻量模拟结账闭环；组件库 shadcn/ui；状态管理 TanStack Query + Zustand（理由见 §4）。

## 2. 产品定位与范围

- 品牌 **Hearth**，Slogan "Considered objects for everyday living"；全英文 UI、USD 定价、模拟商品数据。
- 核心用户旅程：浏览商品 → 搜索/分类/排序查找 → 商品详情 → 加入购物车 → 购物车管理 → 模拟结账 → 下单成功。
- 明确非目标（取舍素材）：无后端、无登录、无真实支付、单语言单币种、无 wishlist/订单历史。

## 3. 功能需求

### P0 核心

| 模块 | 要求 | 状态 |
| --- | --- | --- |
| 商品目录 | 响应式网格（移动 2 列 / 桌面 4 列），卡片含图、名称、分类、价格、评分星级 | 完成 |
| 查找 | 搜索框（300ms 防抖，匹配名称/描述/分类）；分类 chips（All/Decor/Textiles/Kitchen/Lighting）；排序（Featured / 价格升降 / 评分） | 完成 |
| 商品详情 `/products/[id]` | 大图、评分、价格（含划线原价）、描述、卖点列表、库存状态、数量步进器、加购按钮、同分类"你也可能喜欢"、无效 id 404 | 完成 |
| 购物车 | Sheet 抽屉（缩略图/数量增减/删除/小计），localStorage 持久化，头部角标数量 | 完成 |
| 结账 `/checkout` | 订单摘要（满 $50 免运费，否则 $5.90）、联系信息表单（姓名/邮箱/地址，前端必填与邮箱格式校验）→ 模拟下单（800ms loading）→ 成功态（订单号 + Demo 提示）→ 清空购物车 | 完成 |
| 状态完备 | 骨架屏（列表/详情）、搜索无结果空态、购物车空态、查询失败重试（retry: 1） | 完成 |
| 响应式与可访问性 | 390px~1440px；sticky 头部；图标按钮 aria-label；图片 alt；焦点样式 | 完成 |

### P1 低成本增强

- 商品徽标（New / Best Seller / Sale）——完成
- 免运费进度条（"You're $12 away from free shipping" / "Free shipping unlocked."）——完成
- 加购 toast（sonner，含 View cart 动作）——完成
- 吸底式移动端搜索行（catalog 底部 sticky，滚动到页尾自然让位）——完成

## 4. 状态管理设计（两库引入的必要性）

- **URL searchParams**（`q` / `category` / `sort`）：列表筛选的事实来源，可分享、支持前进后退，无需额外库。
- **TanStack Query v5**：商品数据属于"服务端状态"——缓存、queryKey 按筛选参数隔离（已在 `lib/queries.ts` 规范化）、加载/错误态、重试。Next 16 官方指南内置其集成路径。
- **Zustand v5 + persist**：购物车是跨路由客户端状态（头部角标、抽屉、结账页共享），持久化避免刷新丢数据；抽屉开合状态并入同一 store（不参与持久化）。
- 结论：两者均为真实需求，非过度设计。

## 5. 数据与技术方案

- **技术栈**：Next.js 16.4.2（App Router, cacheComponents）+ React 19 + TS + Tailwind v4 + shadcn/ui + TanStack Query v5 + Zustand v5 + sonner；包管理 bun。
- **数据层**：`lib/products.ts` 内置 12 件商品（4 分类 × 3，含名称/价格/原价/评分/评论数/徽标/描述/卖点/库存），`lib/api.ts` 提供带 300–600ms 模拟延迟的异步 API（`getProducts(filters)` / `getProduct(id)` / `getRelatedProducts(id)`），后续可无缝替换为真实 HTTP。
- **商品清单**：Decor（Terra Vase $42、Halo Wall Mirror $119、Amber No.5 Candle $28）、Textiles（Cloud Linen Throw $68、Loom Cushion Cover $34、Fjord Wool Rug $149 原价 $189）、Kitchen & Dining（Daybreak Mug $24、Grain Serving Board $36、Ember Stoneware Pitcher $48）、Lighting（Lumen Table Lamp $89、Orbit Pendant Light $129、Dusk Wall Sconce $59）。
- **商品图**：ImageGen 分 3 批（每批 4 张并行）生成统一暖白影棚风格商品图 → `public/products/`（12/12 成功，未用到 CSS 占位回退）。
- **视觉方向**：暖白底（#FAF8F5）+ 炭黑文字 + 陶土色点缀；Fraunces（衬线标题）+ Geist（正文/UI）；克制留白、商品优先，避免模板感。
- **Next 16 关键约定**（已核对 `node_modules/next/dist/docs/` 官方文档）：
  - `cacheComponents` 开启时，使用 TanStack Query 的组件置于 Suspense 边界内（骨架屏即 fallback）；`useSearchParams` 同样需在边界内；
  - 详情页 `params` 为 Promise（`PageProps<'/products/[id]'>`），配合 `generateStaticParams` 在构建期预渲染 12 个商品壳；`generateMetadata` 读取 params 生成每件商品的标题；
  - 未在 `generateStaticParams` 中的无效 id 在请求期动态渲染并 `notFound()`（实测返回 HTTP 404）；
  - shadcn CLI（3.x，radix-nova 预设）对 Tailwind v4 检测正常，一次初始化成功。

## 6. 文件结构

```
app/
  layout.tsx            # 字体、metadata、Header/Footer/CartSheet/Toaster
  providers.tsx         # 'use client'，QueryClient 单例 Provider
  page.tsx              # 首页：Hero + Hero 下方 Suspense > CatalogView
  products/[id]/page.tsx# 详情：await params + Suspense > ProductDetailView
  checkout/page.tsx     # 结账（表单态 → 成功态）+ 空购物车守卫
  not-found.tsx         # 定制 404（无效商品 id）
  globals.css           # shadcn 主题 tokens + 定制色板 + 入场动画
components/
  layout/               # header / footer / search-field / cart-button
  catalog/              # catalog-view / catalog-toolbar / product-card / grid-skeleton / mobile-search-bar
  product/              # product-detail-view / qty-stepper / related-products / star-rating / detail-skeleton
  cart/                 # cart-sheet / cart-line / shipping-progress
  checkout/             # checkout-view
  query-error-boundary.tsx
lib/
  types.ts, products.ts, api.ts, queries.ts
  store/cart.ts, format.ts
hooks/use-hydrated.ts
public/products/*.png
docs/PRD.md, docs/交付说明.md
README.md
```

## 7. 实施阶段（50 分钟预算）

| 阶段 | 内容 | 实际 |
| --- | --- | --- |
| P0 底座 | PRD 落盘、装依赖、shadcn 初始化、providers、主题、字体 | 完成 |
| P1 数据层 | types、12 件商品、api、queries、cart store；并行生成商品图 | 完成 |
| P2 全局布局 | Header（mounted 水合守卫）、Footer、Toaster、CartSheet | 完成 |
| P3 首页目录 | Hero + 信任条、Toolbar（chips/排序/防抖搜索接 URL）、网格、骨架、空态 | 完成 |
| P4 详情页 | 详情视图、步进器、加购、推荐区、404 | 完成 |
| P5 购物车 | 抽屉交互、免运费进度、持久化、toast 反馈 | 完成 |
| P6 结账 | 摘要 + 表单校验 + 模拟下单 + 成功态 + 清空 | 完成 |
| P7 验证 | agent-browser 在 1440 / 390 视口走通全流程（多张实测截图） | 完成 |
| P8 交付 | `bun run build` 通过（18 个静态页）；README + 交付说明 | 完成 |
| P9 加分部署 | vercel 部署上线（需一次 Vercel 授权） | 待用户授权后执行 |

## 8. 验证计划与结果

- **功能**：搜索 "lamp" 命中、分类过滤（Lighting 3 件）、排序切换（price-asc 后 Dusk $59 置顶）、加购角标、抽屉增减/删除、刷新后购物车保留、结账→成功→清空、无结果空态、无效 id HTTP 404 —— 全部通过（见 `docs/交付说明.md` 截图清单）。
- **视觉**：390 / 1440 两档截图核对布局与文案；a11y 审计（axe-core）1 处 landmark 问题已修复。
- **构建**：`bun run build` 零错误：`/`、`/checkout`、`/_not-found` 静态预渲染，`/products/[id]` Partial Prerender 且 12 个商品路径全部生成。
- **线上**：部署后重走核心流程并截图，写入交付说明（P9）。

## 9. 交付物清单

1. 完整源码（本仓库，含依赖声明与启动命令）
2. `docs/PRD.md`（本文档）
3. `README.md`（安装 / 启动 / 构建 / 目录结构）
4. `docs/交付说明.md`（完成内容、实测场景、已知问题、主要取舍、录屏脚本）
5. 线上访问链接（加分项，P9 产出）

## 10. 假设与主要取舍（面试交流素材）

- 用客户端 mock API 层替代真实后端：保留异步/缓存语义，换取限时内的交付确定性与演示稳定性；替换真实后端只需改 `lib/api.ts`。
- 结账为纯前端模拟（题目明确无需真实支付）：保留表单校验与完整闭环以展示正确性。
- 单语言英文、单币种 USD，聚焦海外消费者场景。
- 不引入测试框架与 CI：以 agent-browser 实机验证替代（时间预算内收益最高）。
- 仅浅色主题：暖色"家居画廊"是品牌身份的一部分，不做深色模式。
