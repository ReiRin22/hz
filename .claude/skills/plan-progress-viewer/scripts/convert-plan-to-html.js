#!/usr/bin/env node
// Convert phase plan markdown to rich HTML with progress tracking

const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('Usage: node convert-plan-to-html.js <input.md> <output.html>');
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

const markdown = fs.readFileSync(inputFile, 'utf-8');

// Parse markdown and extract structure
function parseMarkdown(md) {
  const lines = md.split('\n');
  let currentTask = null;
  const tasks = [];
  let inCodeBlock = false;
  let metadata = {};

  for (const line of lines) {
    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    // Extract metadata
    if (line.startsWith('**目標:**')) {
      metadata.goal = line.replace('**目標:**', '').trim();
    } else if (line.startsWith('**アーキテクチャ:**')) {
      metadata.architecture = line.replace('**アーキテクチャ:**', '').trim();
    } else if (line.startsWith('**技術スタック:**')) {
      metadata.techStack = line.replace('**技術スタック:**', '').trim();
    }

    // Parse task headers - support multiple formats:
    // - "## タスク 0-1: Title" (Phase plan format)
    // - "## T1-1: Title" (Phase plan short format)
    // - "## タスク 1: Title" (standard format)
    const taskMatch = line.match(/^## (?:タスク )?([T\d]+-?\d+): (.+)/);
    if (taskMatch) {
      if (currentTask) tasks.push(currentTask);
      currentTask = {
        number: taskMatch[1],
        title: taskMatch[2],
        steps: []
      };
      continue;
    }

    // Parse steps (checkboxes) - support multiple formats:
    // - "- [ ] **Step text**" (bold format)
    // - "- [x] **Step text**" (bold completed)
    // - "- [ ] Step text" (plain format)
    // - "- [x] Step text" (plain completed)
    const stepMatch = line.match(/^- \[([ xX])\] (?:\*\*)?(.+?)(?:\*\*)?$/);
    if (stepMatch && currentTask) {
      const checked = stepMatch[1].toLowerCase() === 'x';
      const stepText = stepMatch[2];
      currentTask.steps.push({ checked, text: stepText });
    }
  }

  if (currentTask) tasks.push(currentTask);

  return { metadata, tasks };
}

const { metadata, tasks } = parseMarkdown(markdown);

// Calculate progress
const totalSteps = tasks.reduce((sum, task) => sum + task.steps.length, 0);
const completedSteps = tasks.reduce((sum, task) =>
  sum + task.steps.filter(s => s.checked).length, 0);
const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

// Generate HTML
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Phase 0 Implementation Plan</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }

    :root {
      --bg-primary: #f5f5f7;
      --bg-secondary: #ffffff;
      --bg-tertiary: #e5e5e7;
      --border: #d1d1d6;
      --text-primary: #1d1d1f;
      --text-secondary: #86868b;
      --text-tertiary: #aeaeb2;
      --accent: #0071e3;
      --accent-hover: #0077ed;
      --success: #34c759;
      --warning: #ff9f0a;
      --error: #ff3b30;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #1d1d1f;
        --bg-secondary: #2d2d2f;
        --bg-tertiary: #3d3d3f;
        --border: #424245;
        --text-primary: #f5f5f7;
        --text-secondary: #86868b;
        --text-tertiary: #636366;
        --accent: #0a84ff;
        --accent-hover: #409cff;
      }
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
      line-height: 1.6;
    }

    .header {
      background: var(--bg-secondary);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }
    .header h1 { font-size: 1.25rem; font-weight: 600; }
    .header .status {
      font-size: 0.875rem;
      color: var(--success);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .header .status::before {
      content: '';
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .main { flex: 1; overflow-y: auto; }
    #content { padding: 2rem; max-width: 1200px; margin: 0 auto; }

    .metadata {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .metadata h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--accent);
    }
    .metadata-item {
      margin: 0.75rem 0;
      font-size: 0.95rem;
    }
    .metadata-item strong {
      color: var(--text-secondary);
      font-weight: 500;
      display: inline-block;
      min-width: 120px;
    }

    .progress-summary {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .progress-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .progress-percent {
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent);
    }
    .progress-bar-container {
      background: var(--bg-tertiary);
      height: 12px;
      border-radius: 6px;
      margin: 1rem 0;
      overflow: hidden;
    }
    .progress-bar {
      background: linear-gradient(90deg, var(--accent), var(--success));
      height: 100%;
      transition: width 0.5s ease;
      border-radius: 6px;
    }
    .progress-stats {
      display: flex;
      gap: 2rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .progress-stats strong {
      color: var(--text-primary);
      font-weight: 600;
    }

    .task-section {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
    }
    .task-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--accent);
    }
    .task-badge {
      font-size: 0.75rem;
      padding: 0.35rem 0.75rem;
      border-radius: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .task-badge.completed {
      background: var(--success);
      color: white;
    }
    .task-badge.in-progress {
      background: var(--warning);
      color: white;
    }
    .task-badge.pending {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }

    .step-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    .step-item:hover {
      background: var(--bg-tertiary);
      transform: translateX(4px);
    }
    .step-item.completed {
      opacity: 0.6;
    }
    .step-checkbox {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border: 2px solid var(--border);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
      transition: all 0.2s ease;
    }
    .step-checkbox.checked {
      background: var(--success);
      border-color: var(--success);
    }
    .step-checkbox.checked::after {
      content: '✓';
      color: white;
      font-size: 1rem;
      font-weight: bold;
    }
    .step-text {
      flex: 1;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .step-item.completed .step-text {
      text-decoration: line-through;
      color: var(--text-secondary);
    }

    .footer {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border);
      padding: 1rem 2rem;
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 Phase 0 Implementation Plan</h1>
    <div class="status">Live</div>
  </div>

  <div class="main">
    <div id="content">
      ${metadata.goal || metadata.architecture || metadata.techStack ? `
      <div class="metadata">
        <h2>📋 Overview</h2>
        ${metadata.goal ? `<div class="metadata-item"><strong>目標:</strong> ${metadata.goal}</div>` : ''}
        ${metadata.architecture ? `<div class="metadata-item"><strong>アーキテクチャ:</strong> ${metadata.architecture}</div>` : ''}
        ${metadata.techStack ? `<div class="metadata-item"><strong>技術スタック:</strong> ${metadata.techStack}</div>` : ''}
      </div>
      ` : ''}

      <div class="progress-summary">
        <div class="progress-title">
          <span>📊 Progress</span>
          <span class="progress-percent">${progressPercent}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progressPercent}%"></div>
        </div>
        <div class="progress-stats">
          <span><strong>${completedSteps}</strong> / ${totalSteps} steps completed</span>
          <span><strong>${tasks.filter(t => t.steps.every(s => s.checked)).length}</strong> / ${tasks.length} tasks completed</span>
        </div>
      </div>

      ${tasks.map(task => {
        const taskCompleted = task.steps.length > 0 && task.steps.every(s => s.checked);
        const taskInProgress = task.steps.some(s => s.checked) && !taskCompleted;
        const taskStatus = taskCompleted ? 'completed' : taskInProgress ? 'in-progress' : 'pending';

        return `
        <div class="task-section">
          <div class="task-header">
            <h3>タスク ${task.number}: ${task.title}</h3>
            <span class="task-badge ${taskStatus}">
              ${taskStatus === 'completed' ? '✓ 完了' : taskStatus === 'in-progress' ? '▶ 進行中' : '○ 未着手'}
            </span>
          </div>
          <div class="step-list">
            ${task.steps.map(step => `
              <div class="step-item ${step.checked ? 'completed' : ''}">
                <div class="step-checkbox ${step.checked ? 'checked' : ''}"></div>
                <div class="step-text">${step.text}</div>
              </div>
            `).join('')}
          </div>
        </div>
        `;
      }).join('')}
    </div>
  </div>

  <div class="footer">
    Auto-refreshes on file change · Last updated: ${new Date().toLocaleString('ja-JP')}
  </div>

  <script>
    // WebSocket connection for live updates
    const ws = new WebSocket('ws://' + location.host);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'reload') {
        location.reload();
      }
    };
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => location.reload(), 3000);
    };
  </script>
</body>
</html>`;

fs.writeFileSync(outputFile, html, 'utf-8');
console.log(`✅ Generated: ${outputFile}`);
