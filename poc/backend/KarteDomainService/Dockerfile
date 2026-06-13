FROM mcr.microsoft.com/dotnet/sdk:10.0 AS development
WORKDIR /workspaces/harz/poc/backend/KarteDomainService

# プロジェクトルート基準で、KarteDomainServiceフォルダの中身を全部 /app にコピー
# これにより /app/KarteDomainService.csproj という配置になります
COPY backend/KarteDomainService/ .

# /app 直下にあるプロジェクトファイルをリストア
RUN dotnet restore KarteDomainService.csproj

ENV DOTNET_WATCH_RESTART_ON_RUDE_EDIT=true
EXPOSE 7121

# 実行
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:7121"]