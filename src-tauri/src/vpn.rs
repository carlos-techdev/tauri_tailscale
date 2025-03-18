use std::process::Command;
const AUTH_KEY: &str = "tskey-auth-krCQJfRtaD11CNTRL-74RHek7tBBYmauFvNcQDBYDzAdBDKi5e";
const LOGIN_SERVER: &str = "https://login.tailscale.com";

/// Connects to Tailscale VPN with username and password
#[tauri::command]
pub fn connect_vpn(username: String, password: String) -> Result<String, String> {
    if username == "dmytrosokolovskyi80@gmail.com" && password == "dmytro" {
        let output = if cfg!(target_os = "windows") {
            Command::new("cmd")
                .args(&[
                    "/C",
                    &format!(
                        "tailscale up --auth-key={} --login-server={}",
                        AUTH_KEY, LOGIN_SERVER
                    ),
                ])
                .output()
        } else {
            Command::new("sh")
                .arg("-c")
                .arg(format!(
                    "tailscale up --auth-key={} --login-server={}",
                    AUTH_KEY, LOGIN_SERVER
                ))
                .output()
        };

        match output {
            Ok(output) => {
                if output.status.success() {
                    Ok("Connected to Tailscale successfully".to_string())
                } else {
                    Err(format!(
                        "Failed to connect: {}",
                        String::from_utf8_lossy(&output.stderr)
                    ))
                }
            }
            Err(err) => Err(format!("Error executing command: {}", err)),
        }
    } else {
        return Err("Email or password is incorrect".to_string());
    }
}

/// Disconnects from Tailscale VPN
#[tauri::command]
pub fn disconnect_vpn() -> Result<String, String> {
    let output = if cfg!(target_os = "windows") {
        Command::new("cmd").args(&["/C", "tailscale down"]).output()
    } else {
        Command::new("sh").arg("-c").arg("tailscale down").output()
    };

    match output {
        Ok(output) => {
            if output.status.success() {
                Ok("Disconnected from Tailscale".to_string())
            } else {
                Err(format!(
                    "Failed to disconnect: {}",
                    String::from_utf8_lossy(&output.stderr)
                ))
            }
        }
        Err(err) => Err(format!("Error executing command: {}", err)),
    }
}
