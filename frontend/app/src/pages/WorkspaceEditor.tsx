import { RouteComponent, Link } from '@fukict/router';
import { Button } from 'ui';
import { api } from '../services/api';
import type { WorkspaceConfig } from '../types/workspace';

export class WorkspaceEditor extends RouteComponent {
  private config: WorkspaceConfig | null = null;
  private yamlContent = '';
  private loading = true;
  private error: string | null = null;
  private saving = false;

  mounted() {
    const name = this.route.params.name as string;
    this.loadConfig(name);
  }

  async loadConfig(name: string) {
    try {
      this.loading = true;
      this.error = null;
      this.update();

      const config = await api.getWorkspace(name);
      this.config = { name, ...config };
      this.yamlContent = JSON.stringify(config, null, 2);
      this.loading = false;
      this.update();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Unknown error';
      this.loading = false;
      this.update();
    }
  }

  async handleSave() {
    if (!this.config) return;

    try {
      this.saving = true;
      this.error = null;
      this.update();

      const parsedConfig = JSON.parse(this.yamlContent);
      await api.updateWorkspace(this.config.name, parsedConfig);

      alert('Saved successfully!');
      this.saving = false;
      this.update();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to save';
      this.saving = false;
      this.update();
    }
  }

  render() {
    if (this.loading) {
      return (
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
          <p class="text-gray-600">Loading...</p>
        </div>
      );
    }

    if (this.error && !this.config) {
      return (
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
          <div class="text-center">
            <p class="text-red-600 mb-4">Error: {this.error}</p>
            <Link to="/">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div class="min-h-screen bg-gray-100">
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <Link to="/" class="text-blue-600 hover:text-blue-700 text-sm">
                ← Back to Workspaces
              </Link>
              <h1 class="text-2xl font-bold text-gray-900 mt-1">
                Edit: {this.config?.name}
              </h1>
            </div>
            <div class="flex gap-2">
              <Button
                variant="primary"
                onClick={() => this.handleSave()}
                disabled={this.saving}
              >
                {this.saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 py-8">
          {this.error && (
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {this.error}
            </div>
          )}

          <div class="bg-white rounded-lg shadow p-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Configuration (JSON)
            </label>
            <textarea
              class="w-full h-96 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={this.yamlContent}
              on:input={(e: any) => {
                this.yamlContent = e.target.value;
                this.update();
              }}
            />
            <p class="mt-2 text-sm text-gray-500">
              Edit the configuration in JSON format
            </p>
          </div>
        </main>
      </div>
    );
  }
}
