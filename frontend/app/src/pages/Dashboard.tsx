import { RouteComponent, Link } from '@fukict/router';
import { Button, Card } from 'ui';
import { api } from '../services/api';
import type { WorkspaceInfo } from '../types/workspace';

export class Dashboard extends RouteComponent {
  private workspaces: WorkspaceInfo[] = [];
  private loading = true;
  private error: string | null = null;

  mounted() {
    this.loadWorkspaces();
  }

  async loadWorkspaces() {
    try {
      this.loading = true;
      this.error = null;
      this.update();

      const data = await api.getWorkspaces();
      this.workspaces = data;
      this.loading = false;
      this.update();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Unknown error';
      this.loading = false;
      this.update();
    }
  }

  async handleBuild(name: string) {
    if (!confirm(`Start building workspace "${name}"?`)) return;

    try {
      const result = await api.buildWorkspace(name);
      alert(`Build started!\n\nOutput:\n${result.output}`);
    } catch (err) {
      alert(`Build failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  render() {
    if (this.loading) {
      return <div class="p-8 text-center">Loading...</div>;
    }

    if (this.error) {
      return (
        <div class="p-8 text-center text-red-600">
          <p>Error: {this.error}</p>
          <Button onClick={() => this.loadWorkspaces()} variant="secondary">
            Retry
          </Button>
        </div>
      );
    }

    return (
      <div class="min-h-screen bg-gray-100">
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 py-4">
            <h1 class="text-2xl font-bold text-gray-900">Confkit Dashboard</h1>
          </div>
        </header>
        <main class="max-w-7xl mx-auto px-4 py-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Workspaces</h2>
            <Button onClick={() => alert('Create workspace - Coming soon')}>
              Create New
            </Button>
          </div>
          {this.workspaces.length === 0 ? (
            <p class="text-gray-500 text-center py-8">No workspaces found</p>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {this.workspaces.map((ws) => (
                <Card
                  key={ws.name}
                  class="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h3 class="text-lg font-semibold mb-2">{ws.name}</h3>
                  <p class="text-sm text-gray-600 mb-4">{ws.path}</p>
                  <div class="flex gap-2">
                    <Link to={`/workspaces/${ws.name}`}>
                      <Button variant="secondary">Edit</Button>
                    </Link>
                    <Button
                      variant="primary"
                      onClick={() => this.handleBuild(ws.name)}
                    >
                      Build
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }
}
