use anyhow::Result;
use tokio::process::Command;

/// 执行构建命令
pub async fn build_workspace(name: &str) -> Result<String> {
    let output = Command::new("confkit")
        .arg("build")
        .arg(name)
        .output()
        .await?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        let error = String::from_utf8_lossy(&output.stderr).to_string();
        Err(anyhow::anyhow!("Build failed: {}", error))
    }
}
