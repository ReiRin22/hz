import { exec } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Steering API Server 自動起動エンドポイント
 *
 * GET /api/ensure-steering-server
 *
 * Steering API Server (localhost:3002) が起動していなければ自動起動する
 */
export async function GET() {
  try {
    // プロジェクトルートから .claude/plans/api/ensure-running.sh を実行
    const scriptPath = path.join(process.cwd(), '../../.claude/plans/api/ensure-running.sh');

    const { stdout, stderr } = await execAsync(`bash "${scriptPath}"`);

    return NextResponse.json({
      success: true,
      message: 'Steering API Server is running',
      output: stdout,
      error: stderr || null,
    });
  } catch (error) {
    console.error('Failed to ensure Steering API Server:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to start Steering API Server',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
