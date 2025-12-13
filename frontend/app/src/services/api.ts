import type { WorkspaceInfo, WorkspaceConfig } from '../types/workspace';

// 开发环境使用代理，生产环境使用完整 URL
const API_BASE = import.meta.env.DEV ? '/api' : 'http://127.0.0.1:8080/api';

export const api = {
  async getWorkspaces(): Promise<WorkspaceInfo[]> {
    const res = await fetch(`${API_BASE}/workspaces`);
    if (!res.ok) throw new Error('Failed to fetch workspaces');
    return res.json();
  },

  async getWorkspace(name: string): Promise<WorkspaceConfig> {
    const res = await fetch(`${API_BASE}/workspaces/${name}`);
    if (!res.ok) throw new Error(`Failed to fetch workspace: ${name}`);
    return res.json();
  },

  async updateWorkspace(name: string, config: WorkspaceConfig): Promise<void> {
    const res = await fetch(`${API_BASE}/workspaces/${name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error(`Failed to update workspace: ${name}`);
  },

  async buildWorkspace(name: string): Promise<{ status: string; output: string }> {
    const res = await fetch(`${API_BASE}/workspaces/${name}/actions/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error(`Failed to build workspace: ${name}`);
    return res.json();
  },
};
