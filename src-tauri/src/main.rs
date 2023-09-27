// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use tauri::{
    api::process::{Command, CommandEvent},
    Manager,
};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Config {
    blockchain_location: Option<String>,
    api_port: Option<String>,
    wallet_key: Option<String>,
    chain_server_port: Option<String>,
    chain_server_public_address: Option<String>,
    chain_server_peers: Vec<String>,
}

impl Config {
    fn merge(&self, new: Config) -> Self {
        // let chain_server_peers: Vec<String> = vec![];
        Self {
            blockchain_location: new
                .blockchain_location
                .or(self.blockchain_location.to_owned()),
            api_port: new.api_port.or(self.api_port.to_owned()),
            wallet_key: new.wallet_key.or(self.wallet_key.to_owned()),
            chain_server_port: new
                .chain_server_port
                .or(self.chain_server_port.to_owned()),
            chain_server_public_address: new
                .chain_server_public_address
                .or(self.chain_server_public_address.to_owned()),
            chain_server_peers: [
                self.chain_server_peers.to_owned(),
                new.chain_server_peers,
            ]
            .concat(),
            // self.chain_server_peers.to_owned(),
        }
        // cfg.chain_server_peers
        // .append(&mut new.chain_server_peers.clone());
    }
}

#[tauri::command(rename_all = "snake_case")]
fn load_config() -> Config {
    let dirs = ProjectDirs::from("org", "IoT Marketplace", "SenShaMart")
        .expect("Could not configure cache directory");
    std::fs::create_dir_all(dirs.cache_dir())
        .expect("Could not create cache directory");

    let default = Config {
        blockchain_location: Some(
            dirs.cache_dir()
                .join("blockchain.json")
                .display()
                .to_string(),
        ),
        api_port: Some("4000".into()),
        wallet_key: Some("".into()),
        chain_server_port: Some("4002".into()),
        chain_server_public_address: Some("-".into()),
        chain_server_peers: vec!["ws://136.186.108.192:3002".into()],
    };

    if let Ok(file_str) =
        std::fs::read_to_string(dirs.cache_dir().join("conf.json"))
    {
        let conf =
            serde_json::from_str::<Config>(&file_str).unwrap_or_else(|_| {
                save_config(default.clone());
                default.clone()
            });
        default.merge(conf)
    } else {
        default
    }
}

#[tauri::command(rename_all = "snake_case")]
fn save_config(config: Config) {
    // println!("Saving config {:?}", config);
    let dirs = ProjectDirs::from("org", "IoT Marketplace", "SenShaMart")
        .expect("Could not configure cache directory");
    std::fs::create_dir_all(dirs.cache_dir())
        .expect("Could not create cache directory");

    let conf_json = serde_json::to_string_pretty(&config)
        .expect("Could not serialize to JSON");
    std::fs::write(dirs.cache_dir().join("conf.json"), conf_json)
        .expect("Could not write to file");
}

fn serve_chain(_window: tauri::Window) {
    // `new_sidecar()` expects just the filename, NOT the whole path like in JavaScript
    // thread::sleep(Duration::from_secs(4));

    println!("spawning chain process");

    let (mut rx, mut child) = Command::new_sidecar("app")
        .expect("failed to create `chain server` binary command")
        .spawn()
        .expect("Failed to spawn sidecar");

    let cfg_str = serde_json::to_string(&load_config()).unwrap();
    println!("writing config to stdin: {}", cfg_str);
    child.write(cfg_str.as_bytes()).unwrap();

    tauri::async_runtime::spawn(async move {
        // read events such as stdout
        while let Some(event) = rx.recv().await {
            if let CommandEvent::Stdout(line) = event {
                println!("{line}");
            }
        }
    });
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // window;
            let window = app.get_window("main").unwrap();
            serve_chain(window);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![load_config, save_config,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
