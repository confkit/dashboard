import type { RouteConfig } from '@fukict/router';
import { Dashboard } from './pages/Dashboard';
import { WorkspaceEditor } from './pages/WorkspaceEditor';

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: Dashboard,
    meta: { title: 'Workspaces' },
  },
  {
    path: '/workspaces/:name',
    component: WorkspaceEditor,
    meta: { title: 'Edit Workspace' },
  },
];
