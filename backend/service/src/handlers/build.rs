use crate::services::cli;
use axum::{extract::Path, Json};
use serde_json::json;

use super::workspaces::ApiError;

/// POST /api/workspaces/:name/actions/build - 触发构建
pub async fn build_workspace(Path(name): Path<String>) -> Result<Json<serde_json::Value>, ApiError> {
    match cli::build_workspace(&name).await {
        Ok(output) => Ok(Json(json!({
            "status": "success",
            "output": output
        }))),
        Err(err) => Err(ApiError::Internal(err.to_string())),
    }
}
