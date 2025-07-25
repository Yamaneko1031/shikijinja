# 式岐神社

## 📖 概要（What is this?）

このプロジェクトは、仮想神社サイトです。  
IT業界に縁のある神様が祀られている神社で、
IT業界で働く人々にご利益があればという想いで作りました。

ユーザーは神社でおなじみの「おみくじ」「絵馬」「おまもり」「賽銭」などのコンテンツを楽しむことができます。

## 🧰 使用技術（Tech Stack）

### フレームワーク・ライブラリ

- **Framework**: [Next.js 15](https://nextjs.org/) with [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

### データベース・認証

- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Google/GitHub providers

### AI統合

- **AI Integration**: [Google Gemini API](https://ai.google.dev/) and [OpenAI API](https://openai.com/api/)
- コンテンツモデレーション、おみくじ生成、絵馬レスポンスに活用

### 開発環境

- WSL2（Ubuntu）+ Cursor + GitHub
- ローカル環境、プレビュー環境では同じDB(supabase)に接続します

## 🧙 コンセプト／世界観（Optional）

- しきねこ（式岐猫呼）：エンジニアの神様
- いろは（彩白）：デザインの神様
- てんてん（纏点）：PMの神様

上記のIT業界に縁のある神様が祀られております。  
この神社の参拝者に対して、それぞれの神様がアドバイスやご利益を授けてくれます。

## 🚀 開発環境での起動方法（Getting Started）

```bash
git clone https://github.com/Yamaneko1031/shikijinja.git
cd shikijinja
npm install
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス！
