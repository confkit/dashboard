mod handlers;
mod models;
mod services;

use axum::{routing::{get, post}, Router};
use handlers::{
    build::build_workspace as build_workspace_handler,
    workspaces::{get_workspace, list_workspaces, update_workspace, AppState},
};
use std::{net::SocketAddr, path::PathBuf, sync::Arc};

#[tokio::main]
async fn main() {
    // 初始化日志
    tracing_subscriber::fmt::init();

    // 应用状态: 工作区基础路径 (当前目录)
    let base_path = PathBuf::from(".");
    let state = Arc::new(AppState { base_path });

    // 路由配置
    let app = Router::new()
        .route("/", get(root))
        .route("/api/workspaces", get(list_workspaces))
        .route(
            "/api/workspaces/{name}",
            get(get_workspace).put(update_workspace),
        )
        .route(
            "/api/workspaces/{name}/actions/build",
            post(build_workspace_handler),
        )
        .with_state(state);

    // 启动服务
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));

    let listener = match tokio::net::TcpListener::bind(addr).await {
        Ok(listener) => {
            tracing::info!("listening on {}", addr);
            listener
        }
        Err(e) => {
            tracing::error!("Failed to bind to {}: {}", addr, e);
            tracing::error!("Port {} is already in use. Please run: lsof -ti :8080 | xargs kill -9", 8080);
            std::process::exit(1);
        }
    };

    if let Err(e) = axum::serve(listener, app).await {
        tracing::error!("Server error: {}", e);
        std::process::exit(1);
    }
}

async fn root() -> &'static str {
    "Confkit Dashboard Backend - Ready"
}
