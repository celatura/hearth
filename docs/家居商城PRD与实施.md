# Hearth 家居商城 — PRD 与实施计划

## 1. 背景与目标

- 一面实作（限时 50 分钟）：面向海外消费者的商品选购 Web 应用，需达到可向客户演示的程度，桌面与移动端体验均良好。
- 评价重点：业务理解、功能正确性、使用体验、代码质量、交付完整度；功能数量不作为主要依据，合理取舍与完成度更重要；线上部署为大幅加分项。
- 已确认决策：极简家居生活品类；含轻量模拟结账闭环；组件库 shadcn/ui；状态管理 TanStack Query + Zustand（按需引入，见 §4 理由）。

## 2. 产品定位与范围

- 品牌 **Hearth**，Slogan "Considered objects for everyday living"；全英文 UI、USD 定价、模拟商品数据。
- 核心用户旅程：浏览商品 → 搜索/分类/排序查找 → 商品详情 → 加入购物车 → 购物车管理 → 模拟结账 → 下单成功。
- 明确非目标（取舍素材）：无后端、无登录、无真实支付、单语言单币种、无 wishlist/订单历史。

## 3. 功能需求

### P0 核心
| 模块 | 要求 |
| --- | --- |
| 商品目录 | 响应式网格（移动 2 列 / 桌面 4 列），卡片含图、名称、分类、价格、评分星级 |
| 查找 | 搜索框（300ms 防抖，匹配名称/描述/分类）；分类 chips（All/Decor/Textiles/Kitchen/Lighting）；排序（Featured / 价格升降 / 评分） |
| 商品详情 `/products/[id]` | 大图、评分、价格（含划线原价）、描述、卖点列表、库存状态、数量步进器、加购按钮、同分类"你也可能喜欢"、无效 id 404 |
| 购物车 | Sheet 抽屉（缩略图/数量增减/删除/小计），localStorage 持久化，头部角标数量 |
| 结账 `/checkout` | 订单摘要（满 $50 免运费，否则 $5.90）、联系信息表单（姓名/邮箱/地址，前端必填与邮箱格式校验）→ 模拟下单（800ms loading）→ 成功态（订单号，如 `HH-2604-83021` + Demo 提示）→ 清空购物车 |
| 状态完备 | 骨架屏（列表/详情）、搜索无结果空态、购物车空态、查询失败重试（retry: 1） |
| 响应式与可访问性 | 390px~1440px；sticky 头部；图标按钮 aria-label；图片 alt；焦点样式（shadcn 默认） |

### P1 低成本增强
商品徽标（New / Best Seller / Sale）、免运费进度条（"You're $12 away from free shipping"）、加购 toast（sonner）、吸底式移动端搜索行。

## 4. 状态管理设计（两库引入的必要性）

- **URL searchParams**（`q` / `category` / `sort`）：列表筛选的事实来源，可分享、支持前进后退，无需额外库。
- **TanStack Query v5**：商品数据属于"服务端状态"——缓存、queryKey 按筛选参数隔离、加载/错误态、重试。Next 16 官方内置其集成指南，属于官方推荐路径。
- **Zustand v5 + persist**：购物车是跨路由客户端状态（头部角标、抽屉、结账页共享），持久化避免刷新丢数据；抽屉开合状态并入同一 store。
- 结论：两者均为真实需求，非过度设计。

## 5. 数据与技术方案

- **技术栈**：Next.js 16.4.2（App Router, cacheComponents）+ React 19 + TS + Tailwind v4 + shadcn/ui + TanStack Query v5 + Zustand v5 + sonner；包管理 bun。
- **数据层**：`lib/products.ts` 内置 12 件商品（4 分类 × 3 件，含名称/价格/原价/评分/评论数/徽标/描述/卖点/库存），`lib/api.ts` 提供带 300–600ms 模拟延迟的异步 API（`getProducts(filters)` / `getProduct(id)`），后续可无缝替换为真实 HTTP。
- **商品清单**：Decor（Terra Vase $42、Halo Wall Mirror $119、Amber No.5 Candle $28）、Textiles（Cloud Linen Throw $68、Loom Cushion Cover $34、Fjord Wool Rug $149 原价 $189）、Kitchen & Dining（Daybreak Mug $24、Grain Serving Board $36、Ember Stoneware Pitcher $48）、Lighting（Lumen Table Lamp $89、Orbit Pendant Light $129、Dusk Wall Sconce $59）。
- **商品图**：用 ImageGen 分 3 批（每批 4 张并行）生成统一暖白影棚风格商品图 → `public/products/`；生成失败的单件回退同色系 CSS 占位。演示不依赖任何外网图床。
- **视觉方向**：暖白底（#FAF8F5）+ 炭黑文字 + 陶土色点缀；Fraunces（衬线标题）+ Geist（正文/UI）；克制留白、商品优先，避免模板感。
- **Next 16 关键约定**（AGENTS.md 要求先读 `node_modules/next/dist/docs/`，已核对官方 TanStack Query 指南）：`cacheComponents` 开启时 useQuery 组件必须置于 Suspense 边界内（骨架屏即 fallback）；页面 `params` 为 Promise（用 `PageProps<'/products/[id]'>`）；shadcn 初始化若对 Tailwind v4 + turbopack 检测异常则手动写 `components.json`。

## 6. 文件结构

```
app/
  layout.tsx            # 字体、metadata、Header/Footer/CartSheet/Toaster
  providers.tsx         # 'use client'，QueryClient 单例 Provider
  page.tsx              # 首页：Hero + Hero 下方 Suspense > CatalogView
  products/[id]/page.tsx# 详情：await params + Suspense > ProductDetailView
  checkout/page.tsx     # 结账（表单态 → 成功态）+ 空购物车守卫
  globals.css           # shadcn 主题 tokens + 定制色板
components/
  layout/header.tsx     # logo / 搜索 / 购物车角标按钮
  layout/footer.tsx
  catalog/catalog-view.tsx, catalog-toolbar.tsx, product-card.tsx, grid-skeleton.tsx
  product/product-detail-view.tsx, qty-stepper.tsx, related-products.tsx
  cart/cart-sheet.tsx, cart-line.tsx
lib/
  types.ts, products.ts (mock 数据), api.ts (模拟 API), queries.ts (queryOptions 契约)
  store/cart.ts (zustand + persist), format.ts (Intl USD 格式化)
public/products/*.webp
docs/PRD.md, docs/交付说明.md（交付物）
README.md（重写：栈/启动/结构/配置说明）
```

## 7. 实施阶段（50 分钟预算）

- **P0 底座（≈5'）**：PRD 落盘 `docs/PRD.md`；`bun add @tanstack/react-query zustand`；shadcn 非交互初始化 + add（button/card/badge/sheet/input/textarea/select/separator/skeleton/sonner/label）；providers；主题 tokens；字体
- **P1 数据层（≈4'）**：types、12 件商品数据、api、queries、cart store；同时 ImageGen 3 批生成 12 张商品图
- **P2 全局布局（≈4'）**：Header（角标用 mounted 标记避免 persist 水合不一致）、Footer、Toaster
- **P3 首页目录（≈10'）**：Hero + 信任条、Toolbar（chips/排序/防抖搜索接 URL 参数）、卡片网格、骨架、空态
- **P4 详情页（≈8'）**：详情视图、步进器、加购、推荐区、404
- **P5 购物车（≈5'）**：抽屉交互、免运费进度、持久化、toast 反馈
- **P6 结账（≈6'）**：摘要 + 表单校验 + 模拟下单 + 成功态 + 清空
- **P7 验证（≈5'）**：agent-browser 在 1440 桌面与 390 移动视口走通全流程（搜索→详情→加购→抽屉→结账→成功），截图检查
- **P8 交付（≈3'）**：`bun run build` 通过（重点排查 cacheComponents 预渲染与 Suspense 边界）；README + `docs/交付说明.md`（完成内容/验证场景/已知问题/取舍 + 录屏脚本）
- **P9 加分部署（≈5'）**：用 vercel-deploy 技能部署上线（需用户完成一次 Vercel 授权登录）→ 线上 URL 复验核心流程 → 回填交付说明

## 8. 验证计划

- 功能：搜索 "lamp" 命中、分类过滤、排序切换、加购角标、抽屉增减/删除、刷新后购物车保留、结账→成功→购物车清空、无结果空态。
- 视觉：390 / 1440 两档截图核对布局与文案。
- 构建：`bun run build` 零错误。
- 线上：部署后重走核心流程并截图，写入交付说明（呼应评分点"如何确认线上版本可用"）。

## 9. 交付物清单

1. 完整源码（本仓库，含依赖声明与启动命令）
2. `docs/PRD.md`（本文档内容整理落盘）
3. `README.md`（安装 `bun install` / 启动 `bun dev` / 构建说明 / 目录结构）
4. `docs/交付说明.md`（完成内容、实测场景、已知问题、主要取舍、录屏脚本）
5. 线上访问链接（加分项，P9 产出）

## 10. 假设与主要取舍（面试交流素材）

- 用客户端 mock API 层替代真实后端：保留异步/缓存语义，换取限时内的交付确定性与演示稳定性。
- 结账为纯前端模拟（题目明确无需真实支付）：保留表单校验与完整闭环以展示正确性。
- 单语言英文、单币种 USD，聚焦海外消费者场景。
- 不引入测试框架与 CI：以 agent-browser 实机验证替代（时间预算内收益最高）。