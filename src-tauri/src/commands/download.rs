use serde::Serialize;
use std::{
    fs::{self, File},
    io::Write,
    path::Path,
};
use tauri::Emitter;

#[derive(Clone, Serialize)]
struct DownloadProgress {
    downloaded: u64,
    total: u64,
    percentage: f64,
    file_name: String,
}

pub fn download_file(url: &str, dest: &Path) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(parent) = dest.parent() {
        fs::create_dir_all(parent)?;
    }
    let mut response = reqwest::blocking::get(url)?;
    if !response.status().is_success() {
        return Err(format!("failed to download file: status {}", response.status()).into());
    }
    let mut file = fs::File::create(dest)?;
    let content_length = response.content_length();

    let bytes_written = std::io::copy(&mut response, &mut file)?;
    if let Some(expected) = content_length {
        if bytes_written != expected {
            return Err(format!(
                "couldn't complete download: expected {} bytes, got {} bytes",
                expected, bytes_written
            )
            .into());
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn get_file_size(url: String) -> Result<u64, String> {
    let client = reqwest::Client::new();
    let response = client.head(&url).send().await.map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!(
            "Failed to get file size: status {}",
            response.status()
        ));
    }

    let size = response.content_length().unwrap_or(0);
    Ok(size)
}

#[tauri::command]
pub async fn download_file_command(
    url: String,
    dest: String,
    window: tauri::Window,
) -> Result<(), String> {
    let dest_path = std::path::PathBuf::from(&dest);
    let file_name = dest_path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown")
        .to_string();

    if let Some(parent) = dest_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    let client = reqwest::Client::new();
    let mut response = client.get(&url).send().await.map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!(
            "failed to download file: status {}",
            response.status()
        ));
    }

    let total_size = response.content_length().unwrap_or(0);

    let mut file = tokio::fs::File::create(&dest_path)
        .await
        .map_err(|e| e.to_string())?;

    let mut downloaded: u64 = 0;

    while let Some(chunk) = response.chunk().await.map_err(|e| e.to_string())? {
        tokio::io::AsyncWriteExt::write_all(&mut file, &chunk)
            .await
            .map_err(|e| e.to_string())?;

        downloaded += chunk.len() as u64;

        let percentage = if total_size > 0 {
            ((downloaded as f64) / (total_size as f64)) * 100.0
        } else {
            0.0
        };

        let _ = window.emit(
            "download-progress",
            DownloadProgress {
                downloaded,
                total: total_size,
                percentage,
                file_name: file_name.clone(),
            },
        );
    }

    Ok(())
}
