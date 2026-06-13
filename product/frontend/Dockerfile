FROM node:22-bookworm-slim
WORKDIR /workspaces/harz/product/frontend

# 共通ディレクトリのコピー（プロジェクトルート基準）
COPY front_bff_shared /workspaces/harz/product/front_bff_shared

# ディレクトリ内のpackage.jsonをコピーしてインストール
COPY frontend/package*.json ./
RUN npm install
RUN chmod -R 755 node_modules/.bin

# ソースコードをコピー
COPY frontend .

# デフォルトの起動設定（Compose側で上書きされるが、単体起動用に残す）
ENV RUN_COMMAND=dev
CMD npm run ${RUN_COMMAND}