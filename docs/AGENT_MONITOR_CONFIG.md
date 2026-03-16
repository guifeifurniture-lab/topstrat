# Agent 日志监控系统

**创建时间：** 2026-03-17 05:45  
**负责人：** 商鞅（shangyang）

---

## 📋 监控配置

**监控名单：**
- SHANGYANG（商鞅 - DevOps）
- ZHUGELIANG（诸葛亮 - CEO）
- HANXIN（韩信 - 增长）
- CHENPING（陈平 - 客户成功）
- GUANZHONG（管仲 - CTO）
- SUNBIN（孙膑 - 全栈）
- GUOJIA（郭嘉 - 前端）
- MOZI（墨子 - 前端）
- XIAOHE（萧何 - QA）
- ZHANGLIANG（张良 - 军师）
- FANLI（范蠡 - CFO）

**超时阈值：** 300 秒（5 分钟）

**关键关键字：**
- git commit
- git push
- 提交代码
- 产出物
- ERROR
- 卡死
- 进度

---

## 🚀 启动方式

```bash
cd C:\Users\JINDA\.openclaw\workspace-zhugeliang
python agent_monitor.py
```

---

## 📊 日志目录

```
logs/
├── SHANGYANG.log
├── ZHUGELIANG.log
├── HANXIN.log
├── CHENPING.log
├── GUANZHONG.log
├── SUNBIN.log
├── GUOJIA.log
├── MOZI.log
├── XIAOHE.log
├── ZHANGLIANG.log
└── FANLI.log
```

---

## 🔴 预警机制

**沉默 5 分钟 →** 死锁预警  
**ERROR 关键字 →** 严重错误高亮  
**git commit/push →** 关键进展高亮

---

*配置时间：2026-03-17 05:45*
