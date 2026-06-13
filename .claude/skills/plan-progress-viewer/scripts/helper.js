(function() {
  const WS_URL = 'ws://' + window.location.host;
  let ws = null;

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === 'reload') {
        window.location.reload();
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      setTimeout(connect, 1000);
    };
  }

  // Parse markdown tasklist to HTML
  function parsePlan(markdown) {
    const lines = markdown.split('\n');
    let html = '';
    let currentPhase = null;
    let phaseTasks = [];
    let totalTasks = 0;
    let completedTasks = 0;

    function flushPhase() {
      if (!currentPhase) return;

      const phaseCompleted = phaseTasks.filter(t => t.checked).length;
      const phaseTotal = phaseTasks.length;
      const phaseStatus = phaseCompleted === phaseTotal ? 'completed'
        : phaseCompleted > 0 ? 'in-progress'
        : 'pending';

      html += `<div class="phase-section">`;
      html += `<div class="phase-header">`;
      html += `<h3>${currentPhase}</h3>`;
      html += `<span class="phase-badge ${phaseStatus}">${phaseCompleted}/${phaseTotal}</span>`;
      html += `</div>`;
      html += `<div class="task-list">`;

      phaseTasks.forEach(task => {
        const itemClass = task.checked ? 'task-item completed' : 'task-item';
        html += `<div class="${itemClass}">`;
        html += `<div class="task-checkbox ${task.checked ? 'checked' : ''}"></div>`;
        html += `<div class="task-text">${task.text}</div>`;
        html += `</div>`;
      });

      html += `</div></div>`;
      phaseTasks = [];
    }

    // Progress summary header
    html += `<div class="progress-summary">`;
    html += `<h2>Implementation Progress</h2>`;

    lines.forEach(line => {
      // Phase header
      if (line.match(/^#{1,3}\s+Phase\s+\d+/i)) {
        flushPhase();
        currentPhase = line.replace(/^#{1,3}\s+/, '').trim();
      }
      // Task item
      else if (line.match(/^-\s+\[([ xX])\]/)) {
        const checked = line.match(/\[x\]/i) !== null;
        const text = line.replace(/^-\s+\[([ xX])\]\s+/, '').trim();
        phaseTasks.push({ checked, text });
        totalTasks++;
        if (checked) completedTasks++;
      }
    });

    flushPhase();

    // Update progress summary
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    document.querySelector('.progress-summary h2').innerHTML =
      `Implementation Progress <span style="color: var(--text-secondary); font-size: 0.9rem;">(${percentage}%)</span>`;

    html = `<div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentage}%"></div>
    </div>
    <div class="progress-stats">
      <div><strong>${completedTasks}</strong> / ${totalTasks} tasks completed</div>
      <div><strong>${totalTasks - completedTasks}</strong> remaining</div>
    </div>
    </div>` + html;

    // Session info
    const startTime = new Date().toLocaleString();
    html += `<div class="session-info">`;
    html += `<div class="info-row"><span>Session Started:</span><strong>${startTime}</strong></div>`;
    html += `<div class="info-row"><span>Last Updated:</span><strong>${new Date().toLocaleString()}</strong></div>`;
    html += `</div>`;

    return html;
  }

  // Initial render
  function renderPlan() {
    fetch('/files/plan.md')
      .then(res => res.text())
      .then(markdown => {
        const html = parsePlan(markdown);
        document.getElementById('claude-content').innerHTML = html;
      })
      .catch(err => {
        console.error('Failed to load plan:', err);
        document.getElementById('claude-content').innerHTML =
          '<div style="padding: 2rem; color: var(--error);">Failed to load plan file</div>';
      });
  }

  renderPlan();
  connect();

  // Re-render on visibility change (when user switches back to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      renderPlan();
    }
  });
})();
