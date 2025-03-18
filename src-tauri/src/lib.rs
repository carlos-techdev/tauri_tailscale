// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod vpn; // Import VPN logic

use vpn::{connect_vpn, disconnect_vpn};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            connect_vpn,
            disconnect_vpn,
            // get_connection_time
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
