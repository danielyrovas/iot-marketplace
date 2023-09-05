// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use directories::ProjectDirs;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Config {
    wallet_key: Option<String>,
}

impl Config {
    fn merge(&self, new: Config) -> Self {
        Self {
            wallet_key: new.wallet_key.or(self.wallet_key.to_owned()),
        }
    }
}

#[tauri::command(rename_all = "snake_case")]
fn load_config() -> Config {
    let default = Config {
        wallet_key: Some("".into()),
    };

    let dirs = ProjectDirs::from("org", "IoT Marketplace", "SenShaMart")
        .expect("Could not configure cache directory");
    std::fs::create_dir_all(dirs.cache_dir()).expect("Could not create cache directory");

    if let Ok(file_str) = std::fs::read_to_string(dirs.cache_dir().join("conf.json")) {
        let conf =
            serde_json::from_str::<Config>(&file_str).expect("The file is not a valid JSON file");
        default.merge(conf)
    } else {
        default
    }
}

#[tauri::command(rename_all = "snake_case")]
fn save_config(config: Config) {
    println!("Saving config {:?}", config);
    let dirs = ProjectDirs::from("org", "IoT Marketplace", "SenShaMart")
        .expect("Could not configure cache directory");
    std::fs::create_dir_all(dirs.cache_dir()).expect("Could not create cache directory");

    let conf_json = serde_json::to_string_pretty(&config).expect("Could not serialize to JSON");
    std::fs::write(dirs.cache_dir().join("conf.json"), conf_json).expect("Could not write to file");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_config, save_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
