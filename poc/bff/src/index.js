import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3001;
// 1. まず共通設定（CORSなど）
app.use(cors({
    origin: 'http://localhost:3000', // frontendのURLを許可
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
// 2. 【重要】APIの定義より先に Interceptor確認用のログ処理を書く
app.use((req, res, next) => {
    const encryptedKey = req.headers['x-encrypted-key']; // Axiosから送られたヘッダー
    console.log(`[BFF Log] Request Path: ${req.path}`);
    console.log(`[BFF Log] X-Encrypted-Key: ${encryptedKey}`);
    next(); // これを忘れると通信が止まります
});
// --- モックデータの生成 (1万件) ---
const mockData = Array.from({ length: 10000 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `ユーザー ${i + 1}`,
    description: `${i + 1}番目のユーザーの経過記録詳細データです。`
}));
// --- エンドポイント1: 1万件全件取得 ---
app.get('/api/karte', (req, res) => {
    console.log('GET /api/karte - 1万件のデータを送信します');
    res.json(mockData);
});
// index.js の個別取得エンドポイントを改造
app.get('/api/user/:id', (req, res) => {
    const id = req.params.id;
    // --- 検証1: 3秒わざと遅らせる (Loading UIの確認用) ---
    setTimeout(() => {
        // --- 検証2: IDが "error" だったら500エラーを返す (Error UIの確認用) ---
        if (id === "error") {
            return res.status(500).json({ message: "Internal Server Error" });
        }
        const user = mockData.find(u => u.id === id);
        if (user) {
            const responseData = {
                id: req.params.id,
                name: user.name,
                description: user.description
            };
            res.json(responseData);
        }
        else {
            res.status(404).json({ message: "Not Found" });
        }
    }, 3000); // 3000ミリ秒 = 3秒待機
});
// サーバー起動
app.listen(PORT, () => {
    console.log(`BFF Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map