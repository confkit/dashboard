use crate::models::workspace::{WorkspaceConfig, WorkspaceInfo};
use std::path::{Path, PathBuf};
use tokio::fs;

/// 默认工作区目录
const WORKSPACES_DIR: &str = ".confkit/spaces";

/// 扫描所有工作区
pub async fn scan_workspaces(base_path: &Path) -> anyhow::Result<Vec<WorkspaceInfo>> {
    let spaces_dir = base_path.join(WORKSPACES_DIR);

    if !spaces_dir.exists() {
        return Ok(vec![]);
    }

    let mut workspaces = Vec::new();
    let mut entries = fs::read_dir(&spaces_dir).await?;

    while let Some(entry) = entries.next_entry().await? {
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }

        let workspace_name = path
            .file_name()
            .and_then(|n| n.to_str())
            .map(|s| s.to_string());

        if let Some(name) = workspace_name {
            // 查找该目录下的 YAML 文件
            if let Some(config_path) = find_yaml_config(&path).await {
                workspaces.push(WorkspaceInfo::new(name, config_path));
            }
        }
    }

    Ok(workspaces)
}

/// 查找目录下第一个 .yml 或 .yaml 文件
async fn find_yaml_config(dir: &Path) -> Option<PathBuf> {
    let mut entries = fs::read_dir(dir).await.ok()?;

    while let Some(entry) = entries.next_entry().await.ok()? {
        let path = entry.path();
        if path.is_file() {
            if let Some(ext) = path.extension() {
                if ext == "yml" || ext == "yaml" {
                    return Some(path);
                }
            }
        }
    }

    None
}

/// 读取工作区配置
pub async fn read_workspace_config(
    base_path: &Path,
    name: &str,
) -> anyhow::Result<WorkspaceConfig> {
    let spaces_dir = base_path.join(WORKSPACES_DIR).join(name);

    let config_path = find_yaml_config(&spaces_dir)
        .await
        .ok_or_else(|| anyhow::anyhow!("Workspace '{}' not found", name))?;

    let content = fs::read_to_string(&config_path).await?;
    let config: serde_yaml::Value = serde_yaml::from_str(&content)?;

    Ok(WorkspaceConfig {
        name: name.to_string(),
        config,
    })
}

/// 更新工作区配置
pub async fn write_workspace_config(
    base_path: &Path,
    name: &str,
    config: &serde_yaml::Value,
) -> anyhow::Result<()> {
    let spaces_dir = base_path.join(WORKSPACES_DIR).join(name);

    let config_path = find_yaml_config(&spaces_dir)
        .await
        .ok_or_else(|| anyhow::anyhow!("Workspace '{}' not found", name))?;

    let content = serde_yaml::to_string(config)?;
    fs::write(&config_path, content).await?;

    Ok(())
}
