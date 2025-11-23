use axum::{
    routing::get,
    Json, Router,
};
use serde_json::{json, Value};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    // 初始化 tracing，用于日志记录
    tracing_subscriber::fmt::init();

    // 定义我们的应用路由
    let app = Router::new()
        .route("/", get(root))
        .route("/api/workspaces", get(get_workspaces));

    // 定义服务监听的地址和端口
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::info!("listening on {}", addr);

    // 启动服务
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// 根路径处理函数
async fn root() -> &'static str {
    "Welcome to Confkit Dashboard Backend!"
}

// API: 获取工作区列表 (占位符实现)
async fn get_workspaces() -> Json<Value> {
    // TODO: 将来这里会扫描文件系统并返回真实的 a spaces 列表
    let workspaces = json!([
        { "name": "hello", "path": ".confkit/spaces/hello/hello-confkit.yml" },
        { "name": "engine", "path": ".confkit/spaces/confkit/engine.yml" },
    ]);
    Json(workspaces)
}