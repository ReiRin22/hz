using NetArchTest.Rules;
using NUnit.Framework;

namespace KarteDomainService.Tests.Architecture;

/// <summary>
/// ドメイン間の直接参照を禁止するアーキテクチャテスト。
/// 違反があれば dotnet test が失敗し、CI をブロックする。
/// </summary>
[TestFixture]
public class DomainIsolationTests
{
    /// <summary>
    /// ドメイン A のクラスが、別ドメイン B の Repository を参照していないことを検証する。
    /// </summary>
    [Test]
    [TestCaseSource(nameof(DomainPairs))]
    public void DomainShouldNotDependOnOtherDomainRepository(string domainA, string domainB)
    {
        var result = Types
            .InAssembly(typeof(Program).Assembly)
            .That().ResideInNamespaceStartingWith(
                $"KarteDomainService.Features.{domainA}")
            .ShouldNot().HaveDependencyOn(
                $"KarteDomainService.Features.{domainB}.Repositories")
            .GetResult();

        Assert.That(result.IsSuccessful, Is.True,
            $"[違反] {domainA} ドメインが {domainB} の Repository を直接参照しています。" +
            $"\n違反クラス: {string.Join(", ", result.FailingTypeNames ?? [])}");
    }

    /// <summary>
    /// ドメイン A → B かつ B → A の循環依存がないことを検証する。
    /// 両方向の依存が同時に存在する場合のみ失敗する。
    /// </summary>
    [Test]
    [TestCaseSource(nameof(DomainPairs))]
    public void DomainShouldNotHaveCyclicDependency(string domainA, string domainB)
    {
        var assembly = typeof(Program).Assembly;
        var nsA = $"KarteDomainService.Features.{domainA}";
        var nsB = $"KarteDomainService.Features.{domainB}";

        // A → B の依存があるか（失敗 = 依存あり）
        var aDependsOnB = Types.InAssembly(assembly)
            .That().ResideInNamespaceStartingWith(nsA)
            .Should().NotHaveDependencyOn(nsB)
            .GetResult();

        // B → A の依存があるか（失敗 = 依存あり）
        var bDependsOnA = Types.InAssembly(assembly)
            .That().ResideInNamespaceStartingWith(nsB)
            .Should().NotHaveDependencyOn(nsA)
            .GetResult();

        // 両方向に依存がある = 循環 → テスト失敗
        var isCyclic = !aDependsOnB.IsSuccessful && !bDependsOnA.IsSuccessful;
        Assert.That(isCyclic, Is.False,
            $"[循環依存] {domainA} ↔ {domainB} で双方向の依存があります。" +
            $"\n{domainA} 側の違反クラス: {string.Join(", ", aDependsOnB.FailingTypeNames ?? [])}" +
            $"\n{domainB} 側の違反クラス: {string.Join(", ", bDependsOnA.FailingTypeNames ?? [])}");
    }

    /// <summary>
    /// アセンブリ内の型を走査して Features 直下のドメイン名を自動抽出する。
    /// 新しいドメインフォルダを追加してもこのメソッドの変更は不要。
    /// </summary>
    private static IEnumerable<TestCaseData> DomainPairs()
    {
        // "KarteDomainService.Features.{Domain}.{Layer}" から {Domain} 部分を抽出
        var domains = typeof(Program).Assembly
            .GetTypes()
            .Select(t => t.Namespace ?? "")
            .Where(ns => ns.StartsWith("KarteDomainService.Features."))
            .Select(ns => ns.Split('.')[2])
            .Distinct()
            .ToArray();

        foreach (var a in domains)
            foreach (var b in domains)
                if (a != b)
                    yield return new TestCaseData(a, b)
                        .SetName($"{a} ↔ {b}");
    }
}
