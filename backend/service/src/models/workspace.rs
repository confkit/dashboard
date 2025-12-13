use serde::{Deserialize, Serialize};
use std::path::PathBuf;

/// 工作区基本信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkspaceInfo {
    pub name: String,
    pub path: String,
}

/// 工作区完整配置 (从 YAML 解析)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkspaceConfig {
    pub name: String,
    #[serde(flatten)]
    pub config: serde_yaml::Value,
}

impl WorkspaceInfo {
    pub fn new(name: String, path: PathBuf) -> Self {
        Self {
            name,
            path: path.to_string_lossy().to_string(),
        }
    }
}
