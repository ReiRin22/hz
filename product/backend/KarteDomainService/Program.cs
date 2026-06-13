using Microsoft.OpenApi.Models;
using KarteDomainService.Features.ExamResult.Services;
using KarteDomainService.Features.Sample.ClinicalEntry.Repositories;
using KarteDomainService.Features.Sample.ClinicalEntry.Services;
using KarteDomainService.Features.Sample.Master.Repositories;
using KarteDomainService.Features.Sample.Master.Services;
using KarteDomainService.Shared.Data;
using KarteDomainService.Shared.Middlewares;
using KarteDomainService.Shared.Services;
using Microsoft.EntityFrameworkCore;
using NLog;
using NLog.Web;

// NLogの初期化
var logger = LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
try
{
    var builder = WebApplication.CreateBuilder(args);

    // Swaggerサービスの登録
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "KarteDomainService API", Version = "v1" });

            // Swagger UIで「X-Tenant-ID」ヘッダーを入力できるようにする設定
            c.AddSecurityDefinition("TenantID", new OpenApiSecurityScheme
            {
                Name = "X-Tenant-Id",
                Type = SecuritySchemeType.ApiKey,
                In = ParameterLocation.Header,
                Description = "テナントIDを入力してください (例: tenant_a, tenant_b)"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "TenantID"
                    }
                },
                Array.Empty<string>()
            }
        });
    });

    // NLogをロギングプロバイダーとして登録
    builder.Logging.ClearProviders();
    builder.Host.UseNLog();

    // Add services to the container.

    builder.Services.AddScoped<TenantService>();

    // ExamResult
    builder.Services.AddScoped<ITestResultsService, TestResultsService>();

    // ClinicalEntry
    builder.Services.AddScoped<ClinicalEntryRepository>();
    builder.Services.AddScoped<ClinicalEntryService>();

    // Master
    builder.Services.AddScoped<BloodTypeMasterRepository>();
    builder.Services.AddScoped<BloodTypeMasterService>();

    // DbContext登録
    builder.Services.AddScoped<TenantSchemaInterceptor>();
    builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        options.UseNpgsql(connectionString);
        var interceptor = serviceProvider.GetRequiredService<TenantSchemaInterceptor>();
        options.AddInterceptors(interceptor);
    });

    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        });
    // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
    //builder.Services.AddOpenApi();

    var app = builder.Build();

    // 共通例外ハンドラーを最初の方に入れる
    app.UseMiddleware<ExceptionMiddleware>();
    app.UseMiddleware<TenantMiddleware>();

    app.UseStaticFiles();
    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        //app.MapOpenApi();
        app.UseSwagger();
        app.UseSwaggerUI(); // これが /swagger の画面を提供します
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    // DB初期化とマイグレーション適用
    //using (var scope = app.Services.CreateScope())
    //{
    //    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    //    var tenants = new[] { "tenant_a", "tenant_b" }; // 検証用テナントリスト

    //    foreach (var tenant in tenants)
    //    {
    //        // 1. スキーマ作成（これは public など別の接続でもOK）
    //        await context.Database.ExecuteSqlRawAsync($"CREATE SCHEMA IF NOT EXISTS \"{tenant}\";");

    //        // 2. ★重要：接続を明示的に開いてから search_path をセットする
    //        var connection = context.Database.GetDbConnection();
    //        if (connection.State != System.Data.ConnectionState.Open) await connection.OpenAsync();

    //        using (var command = connection.CreateCommand())
    //        {
    //            command.CommandText = $"SET search_path TO \"{tenant}\";";
    //            await command.ExecuteNonQueryAsync();
    //        }

    //        // 3. この状態（search_pathがセットされたセッション）でマイグレーション実行
    //        await context.Database.MigrateAsync();

    //        // 4. データ投入
    //        if (!await context.Patients.AnyAsync())
    //        {
    //            context.Patients.Add(new Patient
    //            {
    //                Name = $"{tenant}のテスト患者",
    //                PatientCode = $"P-{tenant.ToUpper()}-001"
    //            });
    //            await context.SaveChangesAsync();
    //        }
    //    }
    //}
    app.Run();
}
catch (Exception exception)
{
    logger.Error(exception, "Stopped program because of exception");
    throw;
}
finally
{
    LogManager.Shutdown();
}

