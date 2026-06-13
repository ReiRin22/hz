# PoC検証報告書：マルチテナント基盤におけるPatient CRUD機能の実装

## 1. 検証の目的

本PoCでは、.NET 10環境において、PostgreSQLのスキーマを動的に切り替えることで、患者データ（Patient）をテナント（クリニック等）ごとに完全に分離して管理できることを検証した。特に、DB接続のライフサイクル管理とスキーマ解決の整合性に重点を置いた。

## 2. 修正および実装した主要な技術要素

### 2.1 パッケージ依存関係の適正化

* **修正内容**: `Microsoft.OpenApi` は、Swashbuckle 7.2.0 と整合する 1.6.22 へ固定。
* **効果**: モデル（`Patient` クラス等）がプロジェクト全体から正しく参照可能になり、ビルドエラーを解消。

### 2.2 接続競合の解決（インターセプターの最適化）

* **修正内容**: `DbConnectionInterceptor` において、接続が開く「前」に手動で `OpenAsync` を呼ぶ実装から、接続が完了した「後」の `ConnectionOpenedAsync` イベントで `SET search_path` を発行する実装へ変更。
* **効果**: EF Core 本体の接続管理との衝突（`Connection already open`）を完全に回避し、安定したクエリ実行を実現。

## 3. Swagger による動的検証

Swagger UI を活用し、フロントエンドが未実装の段階でバックエンドのテナント分離機能を検証した。

* **検証手順**:

1. Swagger の `Authorize` 機能で `tenant_a` を指定。
2. `GET /api/patients` を実行し、Aクリニックの患者のみが表示されることを確認。
3. `Authorize` を `tenant_b` へ切り替え、Bクリニックの患者データへと表示が即座に切り替わることを確認。

---

## 4. 追加・修正したコードの抜粋

### 4.1 `TenantSchemaInterceptor.cs`　テナント（スキーマ）の設定

```csharp
public override async Task ConnectionOpenedAsync(DbConnection connection, ConnectionEndEventData eventData, CancellationToken ct = default)
{
    if (!string.IsNullOrEmpty(_tenantService.TenantId))
    {
        await using var command = connection.CreateCommand();
        // 接続が開いた直後に、カレントスキーマを動的に指定
        command.CommandText = $"SET search_path TO \"{_tenantService.TenantId}\", public;";
        await command.ExecuteNonQueryAsync(ct);
    }
    await base.ConnectionOpenedAsync(connection, eventData, ct);
}

```

### 4.2 `Program.cs`　SwaggerおよびDIの設定

```csharp
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "KarteDomainService API", Version = "v1" });

    // Swagger UIで「X-Tenant-ID」ヘッダーを入力できるようにする設定
    c.AddSecurityDefinition("TenantID", new OpenApiSecurityScheme
    {
        Name = "X-Tenant-ID",
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Header,
        Description = "テナントIDを入力してください (例: tenant_a, tenant_b)"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "TenantID" }
            }, Array.Empty<string>()
        }
    });
});

// レイヤードアーキテクチャのDI登録
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IPatientService, PatientService>();

var app = builder.Build();

// 開発環境（Development）の場合のみ、Swagger UIを表示する設定
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // これが /swagger の画面を提供します
}
app.Run();

```

### 4.3 ディレクトリ構成とレイヤー実装

機能単位（Feature-based）の階層構造を採用し、関心の分離を図った。

**構成案:**

```text
KarteDomainService/
├── Features/
│   └── Karte/
│       ├── Controllers/
│       │   └── PatientsController.cs    (APIエンドポイント)
│       ├── Services/
│       │   ├── IPatientService.cs
│       │   └── PatientService.cs         (ビジネスロジック)
│       ├── Repositories/
│       │   ├── IPatientRepository.cs
│       │   └── PatientRepository.cs      (データアクセス)
│       └── Entities/
│           └── Patient.cs                (データモデル)
```

**実装（Repository & Service & Controller）:**

```csharp
// Repository: DB操作の隠蔽
public class PatientRepository(ApplicationDbContext context) : IPatientRepository {
    public async Task<IEnumerable<Patient>> GetAllAsync() => await context.Patients.ToListAsync();
}

// Service: ビジネスロジック
public class PatientService(IPatientRepository repository) : IPatientService {
    public async Task<IEnumerable<Patient>> GetPatientsAsync() => await repository.GetAllAsync();
}

// Controller: API窓口
[ApiController]
[Route("api/[controller]")]
public class PatientsController(IPatientService patientService) : ControllerBase {
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Patient>>> Get() => Ok(await patientService.GetPatientsAsync());
}

```

---

## 5. 検証結果

本検証により、.NET 10 と EF Core を用いた **「Schema-per-tenant」方式のマルチテナント Patient CRUD 基盤** が完成した。これにより、開発者はテナント分離のロジックを意識することなく、標準的な Entity Framework の操作でセキュアなデータアクセスが可能となることが実証された。