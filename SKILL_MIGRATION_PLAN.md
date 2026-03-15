# ⚡ 技能 1 秒迁移方案

**生成时间:** 2026-03-16 07:51 GMT+8  
**目标:** 实现技能秒级迁移/切换  
**状态:** 方案设计

---

## 🎯 核心思路

技能迁移的本质是**配置 + 上下文**的快速切换，不是重新安装。

### 关键策略
1. **预安装所有技能** - 避免安装等待时间
2. **配置热切换** - 动态切换 API Key/配置
3. **上下文快照** - 保存/恢复技能状态
4. **技能分组** - 按场景预配置技能包

---

## 📊 当前技能状态分析

### 已安装技能 (22 个)
```
✅ 已就绪：12 个 (原已安装)
✅ 新安装：10 个 (obsidian, sag, ffmpeg 等)
⏳ 待安装：~15 个 (CLI 工具)
❌ macOS 跳过：7 个 (Windows 无法使用)
```

### 技能分类
| 类别 | 数量 | 迁移难度 |
|------|------|---------|
| **npm 包** | ~8 个 | ⚡ 秒级 (配置切换) |
| **pip 包** | ~6 个 | ⚡ 秒级 (配置切换) |
| **CLI 工具** | ~8 个 | ⚡ 秒级 ( PATH 切换) |
| **API 配置** | ~8 个 | ⚡ 秒级 (环境变量) |
| **macOS 限定** | 7 个 | ❌ 无法迁移 |

---

## ⚡ 1 秒迁移方案

### 方案 A: 配置热切换 (推荐)

**原理:** 技能已预安装，通过切换配置实现"秒迁移"

#### 实现方式
```bash
# 1. 预安装所有技能 (一次性)
npm install -g obsidian-cli sag himalaya ...
pip install nano-pdf uv ...

# 2. 创建配置集
mkdir C:\Users\JINDA\.openclaw\skill-profiles\
  ├── web-dev/        # 网站开发配置
  ├── content/        # 内容创作配置
  ├── ops/            # 运维配置
  └── default/        # 默认配置

# 3. 每个配置集包含:
# - openclaw.json (技能启用列表)
# - .env (API Keys)
# - PATH 设置 (CLI 工具路径)
```

#### 切换命令
```bash
# 切换到网站开发配置
openclaw profile switch web-dev

# 切换到内容创作配置
openclaw profile switch content

# 切换回默认配置
openclaw profile switch default
```

#### 切换时间
- **配置加载:** <100ms
- **环境变量:** <100ms
- **技能激活:** <500ms
- **总计:** **<1 秒** ✅

---

### 方案 B: 技能快照 (进阶)

**原理:** 使用 Docker/WSL2 容器化技能环境

#### 实现方式
```bash
# 1. 创建技能容器
docker create --name openclaw-skills node:latest

# 2. 预安装所有技能到容器
docker exec openclaw-skills npm install -g ...

# 3. 创建容器快照
docker commit openclaw-skills openclaw-skills:snapshot

# 4. 快速启动
docker run --rm openclaw-skills:snapshot
```

#### 切换时间
- **容器启动:** 1-3 秒
- **技能加载:** <1 秒
- **总计:** **2-4 秒** ⚡

---

### 方案 C: 并行技能池 (高级)

**原理:** 多个技能实例并行运行，按需切换

#### 架构设计
```
┌─────────────────────────────────────┐
│         OpenClaw Gateway            │
├─────────────────────────────────────┤
│  Skill Pool 1: Web Dev              │
│  - obsidian, coding-agent, ffmpeg   │
├─────────────────────────────────────┤
│  Skill Pool 2: Content              │
│  - himalaya, sag, nano-pdf          │
├─────────────────────────────────────┤
│  Skill Pool 3: Ops                  │
│  - healthcheck, mcporter, jq        │
└─────────────────────────────────────┘
```

#### 切换时间
- **路由切换:** <50ms
- **技能激活:** <200ms
- **总计:** **<300ms** ⚡⚡⚡

---

## 🔧 实施方案 (推荐方案 A)

### 步骤 1: 预安装所有技能

```bash
# 一次性安装所有可用技能
npm install -g obsidian-cli sag himalaya claude-code ...
pip install nano-pdf uv ...

# 下载 CLI 工具
# jq, ripgrep, ffmpeg, etc.
```

**时间:** 10-15 分钟 (仅首次)

### 步骤 2: 创建配置集

```bash
# 创建配置目录
mkdir C:\Users\JINDA\.openclaw\skill-profiles\{web-dev,content,ops,default}

# 复制基础配置
cp C:\Users\JINDA\.openclaw\openclaw.json C:\Users\JINDA\.openclaw\skill-profiles\web-dev\
```

### 步骤 3: 配置技能启用列表

**web-dev/openclaw.json:**
```json
{
  "skills": {
    "enabled": [
      "github",
      "gh-issues",
      "coding-agent",
      "obsidian",
      "video-frames",
      "session-logs"
    ]
  }
}
```

**content/openclaw.json:**
```json
{
  "skills": {
    "enabled": [
      "himalaya",
      "sag",
      "nano-pdf",
      "summarize",
      "openai-image-gen"
    ]
  }
}
```

### 步骤 4: 实现切换命令

**创建脚本:** `C:\Users\JINDA\.openclaw\scripts\switch-profile.ps1`

```powershell
param(
    [string]$profileName
)

$profilePath = "C:\Users\JINDA\.openclaw\skill-profiles\$profileName"
$targetConfig = "$profilePath\openclaw.json"

# 备份当前配置
Copy-Item "C:\Users\JINDA\.openclaw\openclaw.json" "C:\Users\JINDA\.openclaw\openclaw.json.bak"

# 切换配置
Copy-Item $targetConfig "C:\Users\JINDA\.openclaw\openclaw.json" -Force

# 重启 Gateway
openclaw gateway restart

Write-Host "✓ 切换到配置：$profileName"
```

### 步骤 5: 测试切换

```powershell
# 切换到网站开发配置
.\switch-profile.ps1 web-dev

# 验证
openclaw skills list

# 切换回默认
.\switch-profile.ps1 default
```

**切换时间:** <1 秒 ✅

---

## 📊 性能对比

| 方案 | 切换时间 | 实现难度 | 资源占用 | 推荐度 |
|------|---------|---------|---------|--------|
| **方案 A: 配置热切换** | **<1 秒** | ⭐⭐ | 低 | ⭐⭐⭐⭐⭐ |
| **方案 B: 技能快照** | 2-4 秒 | ⭐⭐⭐ | 中 | ⭐⭐⭐⭐ |
| **方案 C: 并行技能池** | **<300ms** | ⭐⭐⭐⭐⭐ | 高 | ⭐⭐⭐ |
| **当前 (重新安装)** | 5-30 分钟 | ⭐ | 低 | ⭐ |

---

## 🎯 最佳实践

### 1. 预安装策略
```bash
# 安装所有可用技能 (一次性)
npm install -g $(cat skills-npm.txt)
pip install $(cat skills-pip.txt)

# 验证安装
openclaw skills list --json | jq '.skills[] | select(.eligible==true)'
```

### 2. 配置集管理
```
skill-profiles/
├── default/           # 默认配置 (所有技能)
├── web-dev/          # 网站开发 (精简版)
├── content/          # 内容创作 (精简版)
├── ops/              # 运维 (精简版)
└── full/             # 完全体 (所有技能)
```

### 3. 快速切换别名
```powershell
# PowerShell 配置文件 (profile.ps1)
function Switch-SkillProfile {
    param([string]$name)
    & "C:\Users\JINDA\.openclaw\scripts\switch-profile.ps1" $name
}

Set-Alias sp Switch-SkillProfile

# 使用
sp web-dev    # 切换到网站开发
sp content    # 切换到内容创作
sp default    # 切换回默认
```

---

## ⏭️ 实施计划

### 阶段 1: 预安装 (今日)
- [ ] 安装所有可用技能
- [ ] 验证技能状态
- [ ] 创建配置目录

### 阶段 2: 配置集 (明日)
- [ ] 创建 4 个配置集 (default/web-dev/content/ops)
- [ ] 配置每个配置集的技能列表
- [ ] 测试配置切换

### 阶段 3: 自动化 (本周)
- [ ] 编写切换脚本
- [ ] 添加 PowerShell 别名
- [ ] 测试切换性能 (<1 秒)

### 阶段 4: 优化 (下周)
- [ ] 性能调优
- [ ] 添加更多配置集
- [ ] 文档完善

---

## 📈 预期效果

| 指标 | 当前 | 目标 | 提升 |
|------|------|------|------|
| **技能切换时间** | 5-30 分钟 | **<1 秒** | **300-1800x** |
| **配置灵活性** | 低 | 高 | ⭐⭐⭐⭐⭐ |
| **资源利用率** | 低 | 高 | ⭐⭐⭐⭐ |
| **用户体验** | 一般 | 优秀 | ⭐⭐⭐⭐⭐ |

---

*最后更新：2026-03-16 07:51*  
*下次更新：实施完成后*
