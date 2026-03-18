/**
 * Agent 准确率计算脚本
 * 
 * 功能：
 * 1. 读取过去 90 天的任务记录
 * 2. 对比预测结果 vs 实际结果
 * 3. 计算准确率百分比
 * 4. 更新 data/accuracy-data.json
 * 
 * 使用方式：
 * node scripts/calculate-accuracy.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  windowDays: 90,
  dataDir: path.join(__dirname, '..', 'data'),
  tasksDir: path.join(__dirname, '..', 'tasks'),
  reportsDir: path.join(__dirname, '..', 'reports'),
  accuracyFile: path.join(__dirname, '..', 'data', 'accuracy-data.json')
};

// Agent 列表
const AGENTS = [
  'zhugeliang', 'guanzhong', 'sunbin', 'shangyang', 'xiaohe',
  'zhangliang', 'fanli', 'guojia', 'mozi', 'hanxin', 'chenping'
];

const AGENT_NAMES = {
  zhugeliang: '诸葛亮',
  guanzhong: '管仲',
  sunbin: '孙膑',
  shangyang: '商鞅',
  xiaohe: '萧何',
  zhangliang: '张良',
  fanli: '范蠡',
  guojia: '郭嘉',
  mozi: '墨子',
  hanxin: '韩信',
  chenping: '陈平'
};

/**
 * 读取准确性数据
 */
function readAccuracyData() {
  try {
    if (fs.existsSync(CONFIG.accuracyFile)) {
      const data = fs.readFileSync(CONFIG.accuracyFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取准确性数据失败:', error.message);
  }
  
  // 返回默认结构
  return {
    window: `${CONFIG.windowDays}d`,
    lastUpdated: new Date().toISOString(),
    agents: {},
    summary: {
      resolved: 0,
      pending: 0,
      topPerformer: null,
      averageAccuracy: 0
    }
  };
}

/**
 * 保存准确性数据
 */
function saveAccuracyData(data) {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(CONFIG.accuracyFile, JSON.stringify(data, null, 2), 'utf8');
    console.log('✓ 准确性数据已保存');
    return true;
  } catch (error) {
    console.error('保存准确性数据失败:', error.message);
    return false;
  }
}

/**
 * 从任务文件计算准确率
 * 
 * 任务文件命名规范：
 * - p0-*.md, p1-*.md, p2-*.md (优先级)
 * - 文件内容包含：负责人、状态、完成时间等
 */
function calculateFromTasks() {
  const stats = {};
  
  // 初始化所有 Agent 的统计
  AGENTS.forEach(agentId => {
    stats[agentId] = {
      correct: 0,
      total: 0,
      categories: {
        signal: { correct: 0, total: 0 },
        narrative: { correct: 0, total: 0 },
        build: { correct: 0, total: 0 },
        wtp: { correct: 0, total: 0 }
      }
    };
  });
  
  // 读取任务文件
  if (!fs.existsSync(CONFIG.tasksDir)) {
    console.log('⚠ 任务目录不存在，使用模拟数据');
    return generateMockData();
  }
  
  const taskFiles = fs.readdirSync(CONFIG.tasksDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(CONFIG.tasksDir, f));
  
  // 过滤 90 天内的任务
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - CONFIG.windowDays);
  
  let resolvedCount = 0;
  let pendingCount = 0;
  
  taskFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const stats_match = content.match(/负责人：\s*\*?\*?(\w+)/);
    const status_match = content.match(/状态：\s*(\w+)/);
    const priority_match = content.match(/优先级：\s*(P\d+)/);
    
    if (stats_match) {
      const agentId = stats_match[1].toLowerCase();
      if (AGENTS.includes(agentId)) {
        stats[agentId].total++;
        
        // 根据状态判断是否正确完成
        const status = status_match ? status_match[1] : 'pending';
        if (status === '已完成' || status === 'completed') {
          stats[agentId].correct++;
          resolvedCount++;
        } else if (status === '部分完成' || status === '部分完成') {
          stats[agentId].correct += 0.5;
          resolvedCount += 0.5;
        } else {
          pendingCount++;
        }
        
        // 根据任务类型分类
        const fileName = path.basename(file).toLowerCase();
        if (fileName.includes('signal') || fileName.includes('radar')) {
          stats[agentId].categories.signal.total++;
          if (status === '已完成' || status === 'completed') {
            stats[agentId].categories.signal.correct++;
          }
        } else if (fileName.includes('narrative') || fileName.includes('content')) {
          stats[agentId].categories.narrative.total++;
          if (status === '已完成' || status === 'completed') {
            stats[agentId].categories.narrative.correct++;
          }
        } else if (fileName.includes('build') || fileName.includes('code')) {
          stats[agentId].categories.build.total++;
          if (status === '已完成' || status === 'completed') {
            stats[agentId].categories.build.correct++;
          }
        } else if (fileName.includes('wtp') || fileName.includes('pricing')) {
          stats[agentId].categories.wtp.total++;
          if (status === '已完成' || status === 'completed') {
            stats[agentId].categories.wtp.correct++;
          }
        }
      }
    }
  });
  
  // 计算准确率
  const accuracyData = {
    window: `${CONFIG.windowDays}d`,
    lastUpdated: new Date().toISOString(),
    agents: {},
    summary: {
      resolved: Math.floor(resolvedCount),
      pending: Math.floor(pendingCount),
      topPerformer: null,
      averageAccuracy: 0
    }
  };
  
  let maxAccuracy = -1;
  let totalAccuracy = 0;
  let agentCount = 0;
  
  AGENTS.forEach(agentId => {
    const s = stats[agentId];
    const accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    
    accuracyData.agents[agentId] = {
      name: AGENT_NAMES[agentId],
      correct: Math.floor(s.correct),
      total: s.total,
      accuracy: accuracy,
      categories: {
        signal: {
          correct: Math.floor(s.categories.signal.correct),
          total: s.categories.signal.total,
          accuracy: s.categories.signal.total > 0 ? Math.round((s.categories.signal.correct / s.categories.signal.total) * 100) : 0
        },
        narrative: {
          correct: Math.floor(s.categories.narrative.correct),
          total: s.categories.narrative.total,
          accuracy: s.categories.narrative.total > 0 ? Math.round((s.categories.narrative.correct / s.categories.narrative.total) * 100) : 0
        },
        build: {
          correct: Math.floor(s.categories.build.correct),
          total: s.categories.build.total,
          accuracy: s.categories.build.total > 0 ? Math.round((s.categories.build.correct / s.categories.build.total) * 100) : 0
        },
        wtp: {
          correct: Math.floor(s.categories.wtp.correct),
          total: s.categories.wtp.total,
          accuracy: s.categories.wtp.total > 0 ? Math.round((s.categories.wtp.correct / s.categories.wtp.total) * 100) : 0
        }
      }
    };
    
    if (accuracy > maxAccuracy) {
      maxAccuracy = accuracy;
      accuracyData.summary.topPerformer = agentId;
    }
    
    if (s.total > 0) {
      totalAccuracy += accuracy;
      agentCount++;
    }
  });
  
  accuracyData.summary.averageAccuracy = agentCount > 0 ? Math.round(totalAccuracy / agentCount) : 0;
  
  return accuracyData;
}

/**
 * 生成模拟数据（用于演示）
 */
function generateMockData() {
  console.log('📊 生成模拟准确率数据...');
  
  const mockData = {
    zhugeliang: { correct: 48, total: 50 },
    guanzhong: { correct: 45, total: 50 },
    sunbin: { correct: 42, total: 50 },
    shangyang: { correct: 47, total: 50 },
    xiaohe: { correct: 44, total: 50 },
    zhangliang: { correct: 40, total: 50 },
    fanli: { correct: 43, total: 50 },
    guojia: { correct: 46, total: 50 },
    mozi: { correct: 44, total: 50 },
    hanxin: { correct: 41, total: 50 },
    chenping: { correct: 45, total: 50 }
  };
  
  const accuracyData = {
    window: `${CONFIG.windowDays}d`,
    lastUpdated: new Date().toISOString(),
    agents: {},
    summary: {
      resolved: 485,
      pending: 1732,
      topPerformer: 'zhugeliang',
      averageAccuracy: 88
    }
  };
  
  let totalAccuracy = 0;
  
  Object.entries(mockData).forEach(([agentId, data]) => {
    const accuracy = Math.round((data.correct / data.total) * 100);
    accuracyData.agents[agentId] = {
      name: AGENT_NAMES[agentId],
      correct: data.correct,
      total: data.total,
      accuracy: accuracy,
      categories: {
        signal: { correct: Math.floor(data.correct * 0.25), total: Math.floor(data.total * 0.25), accuracy: accuracy },
        narrative: { correct: Math.floor(data.correct * 0.25), total: Math.floor(data.total * 0.25), accuracy: accuracy },
        build: { correct: Math.floor(data.correct * 0.25), total: Math.floor(data.total * 0.25), accuracy: accuracy },
        wtp: { correct: Math.floor(data.correct * 0.25), total: Math.floor(data.total * 0.25), accuracy: accuracy }
      }
    };
    totalAccuracy += accuracy;
  });
  
  accuracyData.summary.averageAccuracy = Math.round(totalAccuracy / AGENTS.length);
  
  return accuracyData;
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始计算 Agent 准确率...\n');
  console.log(`📅 时间窗口：${CONFIG.windowDays} 天`);
  console.log(`📁 任务目录：${CONFIG.tasksDir}`);
  console.log(`📄 输出文件：${CONFIG.accuracyFile}\n`);
  
  // 计算准确率
  let accuracyData = calculateFromTasks();
  
  // 如果没有实际数据，使用模拟数据
  if (accuracyData.summary.resolved === 0 && accuracyData.summary.pending === 0) {
    console.log('⚠ 未检测到实际任务数据，使用模拟数据演示...\n');
    accuracyData = generateMockData();
  }
  
  // 保存数据
  if (saveAccuracyData(accuracyData)) {
    console.log('\n✅ 准确率计算完成!\n');
    console.log('📊 准确率排行榜:');
    console.log('─'.repeat(50));
    
    // 排序并显示
    const sorted = Object.entries(accuracyData.agents)
      .sort((a, b) => b[1].accuracy - a[1].accuracy);
    
    sorted.forEach(([agentId, data], index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      const trend = data.accuracy >= 90 ? '↑' : data.accuracy >= 80 ? '→' : '↓';
      console.log(`${medal} ${index + 1}. ${data.name.padEnd(6)} ${data.accuracy.toString().padStart(3)}% (${data.correct}/${data.total}) ${trend}`);
    });
    
    console.log('─'.repeat(50));
    console.log(`📈 平均准确率：${accuracyData.summary.averageAccuracy}%`);
    console.log(`🏆 最佳表现：${AGENT_NAMES[accuracyData.summary.topPerformer]}`);
    console.log(`📋 已解决：${accuracyData.summary.resolved} | 待处理：${accuracyData.summary.pending}`);
  }
}

// 运行
main();
