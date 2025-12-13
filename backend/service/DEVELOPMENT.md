# 开发指南

## 开发工具安装

```bash
# 安装 cargo-make (推荐)
cargo install cargo-make

# 安装 cargo-watch (热更新必需)
cargo install cargo-watch
```

## 开发命令

### 推荐方式 (cargo-make)

```bash
# 开发模式 - 带热更新 ⭐
cargo make dev

# 运行
cargo make run

# 构建
cargo make build

# 检查
cargo make check

# 格式化
cargo make fmt

# Lint
cargo make lint

# 测试
cargo make test

# 完整 CI
cargo make ci
```

### 传统方式

```bash
# 运行
cargo run

# 带热更新
cargo watch -x run

# 构建
cargo build --release

# 测试
cargo test
```

## 开发流程

### 1. 启动开发服务器

```bash
cd backend/service
cargo make dev
```

服务器会：
- 启动在 `http://127.0.0.1:8080`
- 监听 `src/**/*.rs` 和 `Cargo.toml` 变化
- 自动重新编译和重启

### 2. 代码修改

修改任何 Rust 文件，保存后会自动：
1. 重新编译
2. 重启服务器
3. 显示编译输出

### 3. 提交前检查

```bash
# 格式化 + Lint + 测试
cargo make ci

# 或分步执行
cargo make fmt    # 格式化
cargo make lint   # Clippy 检查
cargo make test   # 运行测试
```

## 常见问题

### 端口被占用

**方法 1: 使用 cargo-make (推荐)**
```bash
cargo make kill-port
```

**方法 2: 手动清理**
```bash
# 查找并杀死占用端口的进程
lsof -ti :8080 | xargs kill -9

# 或使用脚本
./scripts/kill-port.sh 8080
```

**说明**: `cargo make dev` 会自动清理端口，无需手动操作。

### 编译速度优化

项目已配置：
- 增量编译 (`.cargo/config.toml`)
- 开发依赖隔离

### 清理构建缓存

```bash
cargo make clean
# 或
cargo clean
```

## 项目配置文件

- `Makefile.toml` - cargo-make 任务定义
- `.cargo/config.toml` - Cargo 构建配置
- `.watchexec.toml` - watchexec 监控配置（可选）
- `Cargo.toml` - 项目依赖

## 推荐 IDE 设置

### VS Code

安装插件:
- `rust-analyzer` - Rust 语言服务器
- `Better TOML` - TOML 语法高亮
- `CodeLLDB` - 调试支持

### 其他

- RustRover
- IntelliJ IDEA + Rust 插件
