# ぱずぎり素材帐

《刀剣乱舞 ぱずぎり》非官方玩家工具。网站仍是纯静态页面，可直接放在 GitHub Pages 仓库根目录；运行时不读取 Excel、不请求外部接口，也不需要安装依赖或执行打包命令。

## 文件结构

| 路径 | 作用 |
| --- | --- |
| `index.html` | 网页入口、页面标题和静态导航；通过相对路径加载样式及脚本 |
| `css/site.css` | 原网页的全部样式，未重新设计布局 |
| `data/stages.js` | 关卡编号及各关卡的可掉落素材 |
| `data/swords.js` | 刀种、刀剑编号、稀有度及各阶段所需材料 |
| `data/materials.js` | 掉落素材、贈物分类及制作配方 |
| `data/item-icons.js` | 素材名称与图标文件的对应关系 |
| `assets/items/` | 从原网页提取的 62 张素材图标 |
| `assets/ui/`、`assets/brand.png` | 从原网页提取的插图、网站图标 |
| `js/calculation.js` | 独立的配方递归展开和最终素材计算 |
| `js/drops.js` | 多素材关卡筛选与查询页面 |
| `js/calculator.js` | 刀剑筛选、手动输入和计算器页面 |
| `js/pages.js` | 首页与使用说明 |
| `js/shared.js`、`js/main.js`、`js/ui-assets.js` | 共用状态、页面路由、启动与插图引用 |
| `tests/` | 原版数据摘要与计算回归测试；发布时可一并保留 |

所有文件引用均使用相对路径，适用于 `用户名.github.io/仓库名/` 形式的 GitHub Pages 地址。现有 `#home`、`#drops`、`#calculator`、`#about` 页面地址保持不变。原网页未使用 `localStorage` 或 `sessionStorage`；筛选和输入值原本只在当前页面会话中保存。

## 更新游戏数据

### 新增或修改关卡

编辑 `data/stages.js` 的 `stages` 数组。每一项写成：

```js
{"id":"4-1","drops":["水","桃"]}
```

`id` 为关卡编号，`drops` 只写该关卡实际可掉落的素材名称。新增名称时，同时加入 `data/materials.js` 的 `dropMaterials`；需要图标时，在 `assets/items/` 放入图片，并在 `data/item-icons.js` 加入名称与路径的对应项。筛选程序无需修改，多选仍按“全部目标素材同时掉落”筛选。

### 新增刀剑或更新解放材料

编辑 `data/swords.js` 的 `swords` 数组。可以复制一把现有刀剑的对象，再修改 `id`、`baseId`、`rarity`、`rarityId`、`typeId`、`type`、`displayName` 和 `stages`。其中 `id` 必须唯一，`baseId` 决定列表中的刀剑编号顺序，`typeId` 应与本文件的 `swordTypes` 对应。每个阶段包括 `stage`、`cap` 和 `materials`：

```js
{"stage":2,"cap":30,"materials":[["紙",2],["水",4]]}
```

`materials` 中每组依次为物品名称与数量。若加入新的贈物配方，在 `data/materials.js` 的 `recipes` 中添加“成品名称 → 材料名称及数量”。配方会递归展开为掉落素材，程序无需为每把刀单独编写计算规则。原网页中的絵具配方只消耗小判；计算器保留原规则，不将小判计入最终掉落素材。

修改数据后，检查名称拼写是否在关卡、配方和刀剑需求中一致。`tests/baseline.json` 记录的是本次重构时的原版数据摘要；游戏更新导致它对应的数量或摘要变化时，应先核对新数据来源和预期计算结果，再更新基线，不能仅为通过测试而改摘要。

## 本地检查

直接双击 `index.html` 时，浏览器可能因本地文件的模块安全限制而不加载脚本；请通过 GitHub Pages 或本地静态服务器打开。若电脑已有 Python 3，可在本目录运行 `python3 -m http.server 8000`，再访问 `http://localhost:8000/`。发布网站本身不需要 Python。

若电脑已有 Node.js，可运行 `node --test tests/regression.mjs`。测试使用 Node.js 自带模块，不需要安装 npm 包。它核对 36 个关卡、55 把刀剑、33 种掉落素材、29 个配方、62 张素材图标，并验证所有 165 个刀剑阶段的计算结果与重构前的基线一致。

本次还在桌面宽度 1366 像素和手机宽度 390 像素下，对比了原版和重构版的首页、关卡筛选、手动计算、已有数量、重置、刀剑计算、工具跳转和使用说明。相应页面文字、选择项和图片加载一致；首页及计算器截图逐像素一致。尚未在真实 iPhone Safari、Android 浏览器或线上 GitHub Pages 仓库中验证。

## 发布到 GitHub Pages

1. 将本目录中的 `index.html`、`css/`、`js/`、`data/`、`assets/` 和 `README.md` 上传到**现有仓库的同一发布目录**，保留文件夹层级。不要只上传 `index.html`。
2. 保持仓库当前的 GitHub Pages 来源分支与目录设置不变，提交并推送修改。无需运行构建命令。
3. 等待 GitHub Pages 发布完成，访问原网站地址并检查首页、关卡查询和计算器。GitHub Pages 的仓库子路径会由相对文件引用自动适配。

网站继续标注“非官方玩家工具，与游戏官方及相关权利方无关”。
