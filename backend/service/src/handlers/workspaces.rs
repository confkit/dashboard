use crate::models::workspace::WorkspaceInfo;
use crate::services::fs;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use std::sync::Arc;

/// 应用状态
#[derive(Clone)]
pub struct AppState {
    pub base_path: std::path::PathBuf,
}

/// 统一错误响应
pub enum ApiError {
    NotFound(String),
    Internal(String),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            ApiError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            ApiError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        (status, Json(json!({ "error": message }))).into_response()
    }
}

impl From<anyhow::Error> for ApiError {
    fn from(err: anyhow::Error) -> Self {
        ApiError::Internal(err.to_string())
    }
}

/// GET /api/workspaces - 获取所有工作区列表
pub async fn list_workspaces(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<WorkspaceInfo>>, ApiError> {
    let workspaces = fs::scan_workspaces(&state.base_path).await?;
    Ok(Json(workspaces))
}

/// GET /api/workspaces/:name - 获取指定工作区配置
pub async fn get_workspace(
    State(state): State<Arc<AppState>>,
    Path(name): Path<String>,
) -> Result<Json<serde_yaml::Value>, ApiError> {
    let config = fs::read_workspace_config(&state.base_path, &name)
        .await
        .map_err(|_| ApiError::NotFound(format!("Workspace '{}' not found", name)))?;

    Ok(Json(config.config))
}

/// PUT /api/workspaces/:name - 更新工作区配置
pub async fn update_workspace(
    State(state): State<Arc<AppState>>,
    Path(name): Path<String>,
    Json(config): Json<serde_yaml::Value>,
) -> Result<StatusCode, ApiError> {
    fs::write_workspace_config(&state.base_path, &name, &config)
        .await
        .map_err(|_| ApiError::NotFound(format!("Workspace '{}' not found", name)))?;

    Ok(StatusCode::OK)
}
