use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Serialize, Deserialize)]
struct LinkRecord {
    id: String,
    name: String,
    link: String,
    comments: Vec<String>,
}

fn get_data_path(app: &tauri::AppHandle) -> PathBuf {
    let mut path = app.path().app_data_dir().unwrap();
    path.push("links.json");
    path
}

#[tauri::command]
fn load_links(app: tauri::AppHandle) -> Result<Vec<LinkRecord>, String> {
    let path = get_data_path(&app);

    if !path.exists() {
        return Ok(vec![]);
    }

    let data = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let records: Vec<LinkRecord> =
        serde_json::from_str(&data).map_err(|e| e.to_string())?;

    Ok(records)
}

#[tauri::command]
fn save_links(app: tauri::AppHandle, records: Vec<LinkRecord>) -> Result<(), String> {
    let path = get_data_path(&app);

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    let json = serde_json::to_string_pretty(&records)
        .map_err(|e| e.to_string())?;

    fs::write(path, json).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_links, save_links])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
