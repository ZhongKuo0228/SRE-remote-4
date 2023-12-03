#!/bin/bash

# 當前時間並轉成指定格式 YYYY-MM-DDTHH:MM:SSZ
CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# 指定 API_的 Endpoint
API_PATH="http://localhost:3000/trackingSummary"

# 設定保存 JSON 的路徑 
SAVE_DIR="${PWD}/save"
# SAVE_DIR="/path/to/save"

# 建立資料夾
mkdir -p "$SAVE_DIR"

# 執行 curl 並將結果保存
curl "$API_PATH" -o "${SAVE_DIR}/${CURRENT_TIME}.json"

# 將檔案上傳到 S3
aws s3 cp "${SAVE_DIR}/${CURRENT_TIME}.json" "s3://tracking-summary/tracking-summary-json/${CURRENT_TIME}.json"
