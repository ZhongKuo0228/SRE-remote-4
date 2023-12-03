# SRE 班 Remote 4 作業

## 作業基本說明

### 伺服器說明

-   IP：18.143.170.134
-   Region: 新加坡 (ap-southeast-1)
-   主機規格：t2.micro
-   主機 OS：Ubuntu 22.04
-   Security Group: allow SSH & HTTP
-   需要的程式：

    -   git
        -   安裝指令：`sudo apt install git`
    -   nginx

        -   安裝指令：`sudo apt install nginx`
        -   建立靜態代理設定檔：`sudo vim /etc/nginx/sites-available/yourdomain.com`<br>

        ```md
        server {
        listen 80;
        server_name 18.143.170.134; # IP 部分改成伺服器的 Public IP
        location / {
        proxy_pass http://localhost:3000; # Port 3000 改成 API server 使用的 Port
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        }
        ```

        -   將剛剛建立的靜態網站連接到 nginx 啓動靜態網站的：`sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/`
        -   重新啓動 ngnix :`sudo systemctl restart nginx`
        -   確認 nginx 有正常啓動：`sudo systemctl status nginx`
        -   從瀏覽器輸入伺服器 IP，如果在 API server 未啓動的狀態下，應該會出現 `502 Bad Gateway `的提示，表示反向代理有成功設定

    -   docker & docker compose
        -   請照官方教學：https://docs.docker.com/engine/install/ubuntu/
        -   修改 user 加入到 docker 的群組，後續不用在使用 sudo 就能使用 docker：`sudo usermod -aG docker ubuntu`，記得要重開一個新的終端機才會生效
        -   確認安裝版本：`docker -v && docker compose version`，以下說明適用於 docker compose v2.0 以上，1.0 的使用者請根據官方說明調整相關指令與配置
-   專案架構：
-   ![CleanShot 2023-12-03 at 15 54 45](https://github.com/ZhongKuo0228/SRE-remote-4/assets/119053086/9b011775-bb75-4543-b94a-3cf390d29886)



### API Server 說明

-   使用程式語言：JavaScript（Node.js）
-   使用後端框架：fastify
-   提供的 API：
    -   假訂單建立：http://18.143.170.134/fake?num=xx
    -   假訂單內容查詢：http://18.143.170.134/query?sno=xx
    -   訂單物流狀態總覽：http://18.143.170.134/trackingSummary
    -   快取內容確認：http://18.143.170.134/cacheList
    -   清除所有快取：http://18.143.170.134/cacheClean
-   關聯式資料庫：mysql
    -   Table Schema
    -   ![CleanShot 2023-12-02 at 15 02 51@2x](https://github.com/ZhongKuo0228/SRE-remote-4/assets/119053086/967b9e72-54f3-4e3a-b691-aad13ca30cac)

-   快取資料庫：redis
    -   快取儲存方式：
        -   使用 String 的方式儲存快取
        -   KEY: `packageStatus_sno=${key}`
        -   Value: `query?sno=${key}`的結果
        -   使用 `EX` 來設定過期時間，預設是 3600 秒

## 部署方式

### 下載程式碼

輸入 `git clone https://github.com/ZhongKuo0228/SRE-remote-4.git` 下載程式碼

### 修改配置

1. 進入專案資料夾：`cd SRE-remote-4`
2. 複製 env 檔修改：`cp env.example .env`
3. 修改 `.env` 的內容，如果要使用 docker compose 啓動，則將配置修改成與 `docker-compose.yml` 相同，基本上可以不做更動就能正常執行
4. 若想直接執行

-   輸入 `npm insatll` 安裝 npm 套件
-   將 `.env` 內容修改成符合本地主機的 mysql 與 redis 的設定
-   將 `/DB_backup/pure_db_backup.sql` 匯入到本地主機的 mysql
-   輸入 `node app.js` 即可啓動伺服器
-   若想在背景執行 server，可使用 `pm2` 套件

### 使用 Docker Compose 啓動伺服器

-   因爲 API Server 的映像檔是使用 dockerfile 產生的，啓動 docker compose 需要 build 映像檔，指令爲: `docker compose up --build -d`
-   使用 `docker ps`，看是否有 3 個程式剛剛產生的 container
-   ![CleanShot 2023-12-03 at 15 15 20@2x](https://github.com/ZhongKuo0228/SRE-remote-4/assets/119053086/25370182-cb19-448b-b93b-5d5a4ad5c47a)


### 清理環境

-   關閉 docker compose，需要進到專案資料，輸入 `docker compose down`
-   因爲 dokcer compose 內爲了讓 mysql 的資料內容持久化，所以有掛 volume，如果需要連同 volume 的內容一起刪除，請輸入 `docker compose down --volumes`

### 定期建立總表

-   在 `/job` 可以看到定期建立訂單物流狀態報表的 shell scrpit 檔，執行後就會建立一個 JSON 檔，內含截至目前爲止訂單物流狀態報表，如果沒有要上傳到 S3 的話，請把 `aws s3 cp "${SAVE_DIR}/${CURRENT_TIME}.json" "s3://tracking-summary/tracking-summary-json/${CURRENT_TIME}.json"`刪除
-   查看 `cronJobDoc.txt`，內有 CronJob 的執行指令說明，執行後，使用 `crontab -l` 查看現有的 CronJob 任務

## 已知 BUG

目前 API Server 使用 docker compose 第一次啓動時，會因爲 mysql 尚未初始化完成，伺服器無法連線 DB 報錯而 Crash，若遇到這個問題時，請先使用 `docker ps -a` 查看 API Server 的 container id，再使用指令 `docker restart <container_id>` 重啓。
