# 🧰 56 个技能学习计划

**生成时间:** 2026-03-16 07:30 GMT+8  
**总技能数:** 56 个  
**当前就绪:** 12 个 (21.4%)  
**目标:** 100% 就绪

---

## 📊 技能状态分类

### ✅ 已就绪 (12 个 - 21.4%)

无需安装，已可使用：
1. feishu-doc
2. feishu-drive
3. feishu-perm
4. feishu-wiki
5. clawhub
6. gh-issues
7. github
8. healthcheck
9. mcporter
10. node-connect
11. skill-creator
12. weather

---

### ⏳ 可安装 (约 25 个)

需要安装 CLI 工具或配置：

#### 优先级 P0 - 立即安装

| 技能 | 安装方式 | 依赖 |
|------|---------|------|
| **obsidian** | `npm install -g obsidian-cli` | obsidian-cli |
| **sag** | `npm install -g sag` | sag + ELEVENLABS_API_KEY |
| **discord** | 配置 openclaw.json | channels.discord.token |
| **session-logs** | `choco install jq ripgrep` | jq, rg |
| **video-frames** | `choco install ffmpeg` | ffmpeg |
| **tmux** | WSL2 或 Git Bash | tmux |
| **1password** | 下载 1Password CLI | op |

#### 优先级 P1 - 按需安装

| 技能 | 安装方式 | 依赖 |
|------|---------|------|
| **himalaya** | `cargo install himalaya` | Rust + himalaya |
| **gog** | 从 gogcli.sh 下载 | gog CLI |
| **blucli** | 从 blucli.sh 下载 | blu CLI |
| **camsnap** | 从 camsnap.ai 下载 | camsnap CLI |
| **eightctl** | 从 eightctl.sh 下载 | eightctl CLI |
| **gifgrep** | 从 gifgrep.com 下载 | gifgrep CLI |
| **nano-pdf** | `pip install nano-pdf` | nano-pdf |
| **openhue** | 从 openhue.io 下载 | openhue CLI |
| **oracle** | 从 askoracle.dev 下载 | oracle CLI |
| **ordercli** | 从 ordercli.sh 下载 | ordercli CLI |
| **songsee** | GitHub Releases | songsee CLI |
| **sonoscli** | 从 sonoscli.sh 下载 | sonos CLI |
| **summarize** | 从 summarize.sh 下载 | summarize CLI |
| **wacli** | 从 wacli.sh 下载 | wacli CLI |
| **xurl** | GitHub Releases | xurl CLI |
| **gemini** | `npm install -g @anthropic-ai/gemini-cli` | gemini CLI |
| **goplaces** | GitHub Releases | goplaces + API Key |
| **notion** | 配置 API Key | NOTION_API_KEY |
| **trello** | 配置 API Key | TRELLO_API_KEY, TRELLO_TOKEN |
| **openai-image-gen** | 配置 API Key | OPENAI_API_KEY |
| **openai-whisper-api** | 配置 API Key | OPENAI_API_KEY |
| **nano-banana-pro** | `pip install uv` + API Key | uv + GEMINI_API_KEY |
| **sherpa-onnx-tts** | 配置运行时目录 | SHERPA_ONNX_RUNTIME_DIR, MODEL_DIR |
| **coding-agent** | 安装 Claude Code/Codex | claude 或 codex CLI |
| **slack** | 配置 openclaw.json | channels.slack |
| **voice-call** | 配置 openclaw.json | plugins.entries.voice-call.enabled |
| **bluebubbles** | 配置 openclaw.json | channels.bluebubbles |

---

### ❌ 无法安装 (约 19 个)

#### macOS 限定 (Windows 无法使用 - 8 个)

| 技能 | 原因 |
|------|------|
| apple-notes | macOS 限定 (memo CLI) |
| apple-reminders | macOS 限定 (remindctl) |
| bear-notes | macOS 限定 (grizzly) |
| imsg | macOS 限定 (iMessage) |
| model-usage | macOS 限定 (codexbar) |
| peekaboo | macOS 限定 (macOS UI) |
| things-mac | macOS 限定 (Things 3) |
| **小计** | **7 个** |

#### 需要特殊配置 (2 个)

| 技能 | 原因 |
|------|------|
| openai-whisper | 需要 Python + Whisper 模型 (较大) |
| spotify-player | 需要 spogo 或 spotify_player |

---

## 🎯 学习策略

### 阶段 1: 核心技能 (本周)
- [ ] obsidian (知识库)
- [ ] discord (消息通知)
- [ ] session-logs (日志分析)
- [ ] video-frames (媒体处理)

### 阶段 2: 扩展技能 (下周)
- [ ] sag (TTS 语音)
- [ ] himalaya (邮件管理)
- [ ] gog (Google Workspace)
- [ ] coding-agent (代码开发)

### 阶段 3: 按需技能 (未来)
- 智能家居类 (openhue, eightctl, sonoscli)
- 媒体处理类 (camsnap, gifgrep, songsee)
- 工具类 (oracle, ordercli, wacli, xurl)

### 跳过技能
- macOS 限定 (7 个) - Windows 环境无法使用
- 特殊依赖 (2 个) - 需要时再安装

---

## 📈 预期结果

| 类别 | 数量 | 最终状态 |
|------|------|---------|
| 已就绪 | 12 | ✅ 100% |
| 可安装 | 25 | ⏳ 安装中 |
| macOS 限定 | 7 | ❌ 跳过 |
| 特殊依赖 | 2 | ⏳ 按需安装 |
| **总计** | **56** | **预期 47/56 (84%)** |

---

## 🔧 快速安装命令

### 批量安装 (Windows)

```powershell
# 1. 安装基础工具
npm install -g obsidian-cli sag
choco install -y jq ripgrep ffmpeg tmux

# 2. 安装 Python 工具
pip install nano-pdf uv

# 3. 安装 Rust 工具 (需要 Rust)
cargo install himalaya

# 4. 下载其他 CLI 工具
# 访问各项目 homepage 下载安装
```

### 配置 API 密钥

```json
// openclaw.json
{
  "channels": {
    "discord": {
      "token": "YOUR_DISCORD_TOKEN"
    },
    "slack": {
      "token": "YOUR_SLACK_TOKEN"
    }
  }
}
```

---

*最后更新：2026-03-16 07:30*  
*下次更新：安装进度完成后*
