# Confkit Dashboard Backend

基于 Rust + Axum 的后端服务，为 Confkit Dashboard 提供 API。

## 快速开始

### 安装开发工具

```bash
# 安装 cargo-make (任务运行器)
cargo install cargo-make

# 安装 cargo-watch (热更新)
cargo install cargo-watch
```

### 开发命令

```bash
# 开发模式 (带热更新 + 自动清理端口)
cargo make dev

# 清理端口
cargo make kill-port

# 普通运行
cargo make run

# 生产构建
cargo make build

# 代码检查
cargo make check

# 格式化代码
cargo make fmt

# Lint 检查
cargo make lint

# 运行测试
cargo make test

# 自动修复
cargo make fix

# 完整 CI 检查
cargo make ci

# 清理构建产物
cargo make clean
```

### 传统 Cargo 命令

```bash
# 运行
cargo run

# 构建
cargo build --release

# 测试
cargo test

# 格式化
cargo fmt

# Clippy
cargo clippy
```

## API 端点

### 工作区管理
- `GET /api/workspaces` - 获取所有工作区
- `GET /api/workspaces/{name}` - 获取单个工作区配置
- `PUT /api/workspaces/{name}` - 更新工作区配置

### 构建操作
- `POST /api/workspaces/{name}/actions/build` - 触发构建

## 项目结构

```
src/
├── main.rs              # 入口 + 路由
├── handlers/            # API 处理函数
│   ├── workspaces.rs    # 工作区相关
│   └── build.rs         # 构建相关
├── services/            # 业务逻辑
│   ├── fs.rs            # 文件系统操作
│   └── cli.rs           # CLI 调用
└── models/              # 数据模型
    └── workspace.rs
```

## 配置

- 默认端口: `8080`
- 工作区路径: `./.confkit/spaces/`

## 开发规范

- 使用 `rustfmt` 格式化代码
- 使用 `clippy` 进行 lint 检查
- 所有 public API 需要文档注释
- 错误处理使用 `anyhow::Result`
