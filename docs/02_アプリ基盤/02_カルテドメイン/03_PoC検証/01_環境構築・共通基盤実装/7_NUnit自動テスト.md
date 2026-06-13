# 技術検証報告書：NUnit による PatientController 単体テストの導入

## 1. 検証の目的

`PatientController` に対し、DB・HTTPサーバーなしで動作する自動テストを導入する。
サービス層をモック化することで、Controller のルーティング・ステータスコード・レスポンス内容のみを高速に検証できる基盤を確立することを目的とした。

---

## 2. テスト環境の構成

### ディレクトリ構造

```
poc/backend/
  KarteDomainService.sln              ← 両プロジェクトを管理するソリューション
  KarteDomainService/                 ← メインプロジェクト（既存）
  KarteDomainService.Tests/           ← テストプロジェクト（新規）
    KarteDomainService.Tests.csproj
    Features/
      Karte/
        PatientControllerTests.cs
poc/
  .devcontainer/
    karte-domain-service-test/
      devcontainer.json               ← DevContainer 設定
```

### 使用ライブラリ

| パッケージ | 用途 |
|---|---|
| `NUnit 4.x` | テストフレームワーク |
| `NUnit3TestAdapter` | `dotnet test` との統合 |
| `Microsoft.NET.Test.Sdk` | dotnet test の実行ホスト（必須） |
| `Moq` | IPatientService・ITenantService のモック化 |

---

## 3. 実装内容

### ① テストプロジェクトの構成（KarteDomainService.Tests.csproj）

メインプロジェクトをプロジェクト参照することで、エンティティ・インターフェースをそのまま使用できる。

```xml
<ItemGroup>
  <PackageReference Include="NUnit" Version="4.3.2" />
  <PackageReference Include="NUnit3TestAdapter" Version="4.6.0" />
  <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.13.0" />
  <PackageReference Include="Moq" Version="4.20.72" />
</ItemGroup>
<ItemGroup>
  <ProjectReference Include="..\KarteDomainService\KarteDomainService.csproj" />
</ItemGroup>
```

### ② モックのセットアップ（[SetUp]）

`PatientController` は `HttpContext.RequestServices` 経由で `ITenantService` を取得する設計のため、
`DefaultHttpContext` にモック済みの `IServiceProvider` を注入してテスト用コンテキストを構築した。

```csharp
[SetUp]
public void SetUp()
{
    _serviceMock = new Mock<IPatientService>();

    var tenantServiceMock = new Mock<ITenantService>();
    tenantServiceMock.Setup(t => t.TenantId).Returns("tenant_test");

    var serviceProviderMock = new Mock<IServiceProvider>();
    serviceProviderMock
        .Setup(sp => sp.GetService(typeof(ITenantService)))
        .Returns(tenantServiceMock.Object);

    var httpContext = new DefaultHttpContext
    {
        RequestServices = serviceProviderMock.Object,
    };

    _controller = new PatientController(_serviceMock.Object)
    {
        ControllerContext = new ControllerContext { HttpContext = httpContext },
    };
}
```

### ③ テストケース一覧

| テスト名 | 検証内容 | 期待レスポンス |
|---|---|---|
| `GetAll_WhenPatientsExist_ReturnsOkWithList` | 患者一覧取得（正常系） | 200 OK + リスト |
| `GetById_WhenFound_ReturnsOk` | 患者取得（ID一致） | 200 OK + 患者 |
| `GetById_WhenNotFound_Returns404` | 患者取得（ID不在） | 404 Not Found |
| `Create_ValidPatient_Returns201Created` | 患者登録（正常系） | 201 Created |
| `Update_WhenIdMismatch_Returns400BadRequest` | 更新（URLとボディのID不一致） | 400 Bad Request |
| `Update_WhenNotFound_Returns404` | 更新（患者不在） | 404 Not Found |
| `Update_WhenFound_ReturnsOkWithUpdatedPatient` | 更新（正常系） | 200 OK |
| `Delete_WhenFound_Returns204NoContent` | 削除（正常系） | 204 No Content |
| `Delete_WhenNotFound_Returns404` | 削除（患者不在） | 404 Not Found |

---

## 4. DevContainer 設定

DevContainer 起動時に `postCreateCommand` でテストプロジェクトの依存パッケージを自動復元する。
これにより `dotnet test` がコンテナ内で即時実行できる状態になる。

**poc/.devcontainer/karte-domain-service-test/devcontainer.json**

```json
{
  "name": "Harz PoC KarteDomainService Test",
  "image": "mcr.microsoft.com/devcontainers/dotnet:1-10.0",
  "postCreateCommand": "dotnet tool restore && dotnet restore /workspaces/harz/poc/backend/KarteDomainService.Tests/KarteDomainService.Tests.csproj",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-dotnettools.csdevkit",
        "ms-dotnettools.csharp",
        "formulahendry.dotnet-test-explorer"
      ]
    }
  }
}
```

---

## 5. テスト実行方法

```bash
# テストプロジェクト単体で実行
cd poc/backend
dotnet test KarteDomainService.Tests/KarteDomainService.Tests.csproj

# ソリューション全体でまとめて実行
dotnet test KarteDomainService.sln
```

---

## 6. テスト実行結果

```
テスト実行を開始しています。お待ちください...
合計 1 個のテスト ファイルが指定されたパターンと一致しました。

成功!   -失敗:     0、合格:     9、スキップ:     0、合計:     9、期間: 406 ms - KarteDomainService.Tests.dll (net10.0)
```

| 項目 | 結果 |
|---|---|
| **合格** | **9 件** |
| **失敗** | 0 件 |
| **スキップ** | 0 件 |
| **実行時間** | 406 ms |

全テストケースが初回実行でパスした。

---

## 7. 評価と考察

- **DB 不要**: `IPatientService` をモック化することで、PostgreSQL なしでコントローラーの振る舞いを検証できる。
- **高速**: モック差し替えのみのため、9件を 406 ms で完了。
- **HttpContext のモック**: `ITenantService` が `RequestServices` 経由で解決される設計は、テストで `DefaultHttpContext` に `IServiceProvider` を注入することで吸収できる。
- **今後の拡張**: 

  - `CreateConsultation`・`AddPrescription`・`UploadPhoto` エンドポイントのテストケースを追加することで、Controller 全体のカバレッジを向上できる。
  - GitLabのCICDパイプラインを利用した、MR時に自動テストを実行する仕組みの構築
  - Claude Codeを利用したTDD環境構築
