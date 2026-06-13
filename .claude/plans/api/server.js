#!/usr/bin/env node

/**
 * Steering API Server
 *
 * .claude/plans/ 配下の同期スクリプトを実行する独立 API サーバー
 * Next.js から独立して動作する
 */

const http = require('http');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

const PORT = process.env.STEERING_API_PORT || 3002;
const SCRIPT_DIR = path.join(__dirname, '..');

// CORS ヘッダーを追加
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  // POST /sync - 同期実行
  if (req.method === 'POST' && req.url === '/sync') {
    try {
      // リクエストボディからユーザー名を取得
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString();
      }

      let userName = process.env.STEERING_USER_NAME || '渡部';

      if (body) {
        try {
          const data = JSON.parse(body);
          if (data.userName) {
            userName = data.userName;
          }
        } catch (e) {
          // JSON パースエラーは無視してデフォルト値を使用
        }
      }

      const scriptPath = path.join(SCRIPT_DIR, 'sync-all.sh');

      console.log(`[${new Date().toISOString()}] Executing sync for: ${userName}`);

      const { stdout, stderr } = await execAsync(`bash "${scriptPath}" "${userName}"`);

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        userName,
        output: stdout,
        error: stderr || null,
      }));
    } catch (error) {
      console.error('Sync failed:', error);
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify({
        success: false,
        error: error.message,
      }));
    }
    return;
  }

  // POST /open-dashboard - ダッシュボード起動
  if (req.method === 'POST' && req.url === '/open-dashboard') {
    try {
      const scriptPath = path.join(SCRIPT_DIR, 'dashboard', 'open-dashboard.sh');

      console.log(`[${new Date().toISOString()}] Opening dashboard`);

      const { stdout, stderr } = await execAsync(`bash "${scriptPath}"`);

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        output: stdout,
        error: stderr || null,
      }));
    } catch (error) {
      console.error('Open dashboard failed:', error);
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify({
        success: false,
        error: error.message,
      }));
    }
    return;
  }

  // GET /health - ヘルスチェック
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // 404
  res.writeHead(404, corsHeaders);
  res.end(JSON.stringify({
    error: 'Not Found',
  }));
});

server.listen(PORT, () => {
  console.log('==========================================');
  console.log('Steering API Server');
  console.log('==========================================');
  console.log(`Port: ${PORT}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('');
  console.log('Endpoints:');
  console.log(`  POST http://localhost:${PORT}/sync`);
  console.log(`  POST http://localhost:${PORT}/open-dashboard`);
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log('==========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
