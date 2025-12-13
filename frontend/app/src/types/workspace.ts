export interface WorkspaceInfo {
  name: string;
  path: string;
}

export interface WorkspaceConfig {
  name: string;
  [key: string]: any;
}
