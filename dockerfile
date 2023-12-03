# 選擇一個基礎映像
FROM node:20.10.0-slim

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安裝依賴
RUN yarn install

# 複製所有源代碼到工作目錄
COPY . .

# 暴露端口
EXPOSE 3000

# 運行命令
CMD ["yarn", "start"]