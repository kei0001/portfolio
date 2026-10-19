# Portfolio — GitHub Pages preview

Figmaをもとに制作したポートフォリオのHTMLプレビュー。現在はトップページ、LUSTR、torabo-tsuki keymapperを実装しています。

## 公開先

- Repository: `kei0001/portfolio`
- URL (公開後): `https://kei0001.github.io/portfolio/`
- GitHub Pages: `Settings > Pages > Build and deployment > Deploy from a branch`、`main`、`/(root)`

このリポジトリのルートにファイルを配置します。すべて相対パスで参照しているため、`/portfolio/` サブパスで動作します。

## 主要ファイル

- `index.html` — ASCII treeを使ったトップページ
- `works/product/lustr.html` — LUSTR ケーススタディ
- `works/product/torabo-tsuki-keymapper.html` — キーマッパー ケーススタディ
- `style.css`, `main.js` — 共通のスタイルと挙動
- `assets/` — LUSTRのスクリーンショット、作例、検索グラフ
- `.nojekyll` — GitHub PagesがJekyll処理を行わないようにする設定

## 今後の更新

ローカルでHTML/CSSを修正 → `main` ブランチにpush → GitHub Pagesで実機確認、という流れで更新します。

未完成: Splitgram / identity / visual / about詳細 / contact詳細。
torabo-tsukiの画像は一部がHTML/CSSによる再現であり、Figma内の実スクリーンショットとはまだ一致していません。

## 公開前の確認（2026-10-19）

- GitHub Pages は GitHub 上で `Settings > Pages > Deploy from a branch > main > /(root)` を選択して有効にしてください。
- HTML/CSS/JavaScript と LUSTR のヒーロー画像（軽量JPEG）はコミット済みです。
- `assets/lustr-fidelity.svg` と `assets/gsc-growth.svg` は **一時的な画像プレースホルダー** です。完成版へ差し替える際は、配布した ZIP の `assets/lustr-fidelity.png` と `assets/gsc-growth.png` をアップロードし、`works/product/lustr.html` の画像パスを PNG に戻してください。
- ヒーローも高画質版 `assets/lustr-app.png` に差し替え可能です。現状の `assets/lustr-app.jpg` は小サイズのプレビューです。
