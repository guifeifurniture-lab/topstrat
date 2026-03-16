# Office 实时数据更新脚本 - v2

**版本：** 2.0  
**更新时间：** 2026-03-17 06:07  
**改进：** 从 sessions 文件读取真实任务状态

---

## 🔧 修复内容

**问题：** 之前显示全员 idle，没有读取实际任务

**解决：** 从 sessions/*.session 文件读取：
- currentTask（当前任务）
- status（状态）
- lastHeartbeat（最后心跳）

---

## 📊 数据映射

| sessions 字段 | office-state 字段 |
|--------------|------------------|
| 当前任务 | currentTask |
| 状态 | status |
| 最后心跳 | lastActivity |
| Agent ID | id |
| 角色 | role |

---

## 🚀 执行方式

```bash
node api/update-office-state.js
```

**自动执行：** GitHub Actions 每 5 分钟

---

*更新时间：2026-03-17 06:07*
