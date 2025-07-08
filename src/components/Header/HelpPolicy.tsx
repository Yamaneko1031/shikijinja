'use client';

import React from 'react';
import { Button } from '../_shared/Button';

type Props = {
  onClose: () => void;
};

export default function HelpPolicy({ onClose }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center text-black">
      <div className="min-h-[3rem] flex justify-center items-center">プライバシーポリシー</div>
      <div className="max-h-[60vh] w-full overflow-scroll m-1 p-2 border-2 border-gray-100 flex flex-col gap-2">
        <ul className="help-ul">
          <li>
            <h3>基本方針</h3>
            <p>
              式岐神社（以下「当神社」）は、ユーザーのプライバシーを尊重し、個人情報の保護に関する法律（以下「個人情報保護法」）、EU一般データ保護規則（GDPR）ほか関連法令・ガイドラインを遵守します。また、本ポリシーに従い、個人情報を安全かつ適切に取り扱います。
            </p>
          </li>
          <li>
            <h3>個人情報の定義</h3>
            <p>
              個人情報とは、生存する個人に関する情報であって、当該情報に含まれる氏名、メールアドレス等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含む）
            </p>
          </li>
          <li>
            <h3>取得する情報と取得方法</h3>
            <table>
              <tr>
                <th>区分</th>
                <th>具体例</th>
                <th>取得タイミング／方法</th>
              </tr>
              <tr>
                <td>アカウント情報</td>
                <td>ニックネーム、メールアドレス、SNS連携ID</td>
                <td>会員登録・SNSログイン時</td>
              </tr>
              <tr>
                <td>ログデータ</td>
                <td>IPアドレス、ブラウザ種別、参照元URL、操作履歴</td>
                <td>サイト閲覧時に自動取得</td>
              </tr>
              <tr>
                <td>Cookie／ローカルストレージ</td>
                <td>セッションID、ゲストID、トークン情報</td>
                <td>サイト利用時にブラウザへ保存</td>
              </tr>
              <tr>
                <td>投稿データ</td>
                <td>参拝記録、絵馬の内容、おみくじの選択結果、お守りの授与履歴</td>
                <td>ユーザー投稿時</td>
              </tr>
            </table>
          </li>
          <li>
            <h3>利用目的</h3>
            <p>取得した個人情報は、以下の目的の範囲内で利用します。</p>
            <ul>
              <li>
                <p>サイト機能（絵馬投稿、御守授与、おみくじ、徳ポイント管理等）の提供・運営</p>
              </li>
              <li>
                <p>アカウント認証（ゲスト→会員昇格を含む）およびセキュリティ確保</p>
              </li>
              <li>
                <p>サービス改善、パフォーマンス解析、アクセス解析等</p>
              </li>
              <li>
                <p>統計データの作成および利用（個人を特定しない形での集計・分析）</p>
              </li>
              <li>
                <p>不正利用・迷惑行為の防止</p>
              </li>
              <li>
                <p>広告・プロモーションの配信および効果測定</p>
              </li>
              <li>
                <p>お問い合わせ対応、重要なお知らせの通知</p>
              </li>
              <li>
                <p>法令または公的機関の要請への対応</p>
              </li>
            </ul>
          </li>
          <li>
            <h3>第三者提供・共同利用</h3>
            <p>当神社は、次の場合を除き、取得した個人情報を第三者に提供しません。</p>
            <ul>
              <li>
                <p>本人の同意がある場合</p>
              </li>
              <li>
                <p>法令に基づく場合</p>
              </li>
              <li>
                <p>人の生命・身体・財産の保護のために必要で、本人の同意取得が困難な場合</p>
              </li>
              <li>
                <p>
                  業務委託に伴い、委託先に必要な範囲で提供する場合（例：Supabase Inc.、Vercel
                  Inc.、OpenAI LLC ほか）
                </p>
              </li>
            </ul>
          </li>
          <li>
            <h3>個人情報の管理</h3>
            <ul>
              <li>
                <p>
                  不正アクセス・紛失・破壊・改ざん・漏えいを防ぐための合理的なセキュリティ対策を講じます。
                </p>
              </li>
              <li>
                <p>委託先に対しても適切な監督を行います。</p>
              </li>
              <li>
                <p>個人情報を不要となった場合、速やかに削除・廃棄します。</p>
              </li>
            </ul>
          </li>
          <li>
            <h3>開示・訂正・削除・利用停止等の手続き</h3>
            <p>
              本人または代理人から、自己の個人情報に関して開示、訂正、追加、削除、利用停止、消去などを求められた場合、本人確認の上、合理的な期間・範囲で対応します。
            </p>
          </li>
          <li>
            <h3>Cookie等の利用について</h3>
            <ul>
              <li>
                <p>当サイトは利便性向上・アクセス解析・広告最適化のためCookieを使用します。</p>
              </li>
              <li>
                <p>
                  ブラウザ設定によりCookieの受け入れを拒否できますが、一部機能が利用できない場合があります。
                </p>
              </li>
              <li>
                <p>主要利用ツール</p>
                <ul>
                  <li>Google Analytics</li>
                  <li>Vercel Web Analytics</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <h3>アクセス解析・広告配信サービス</h3>
            <p>
              当サイトでは以下の外部サービスを利用し、ユーザー行動を解析・広告配信の最適化を行う場合があります。
            </p>
            <ul>
              <li>
                <p>Google Analytics</p>
              </li>
              <li>
                <p>Vercel Web Analytics</p>
              </li>
            </ul>
            <p>
              （外部サービスがCookie等を通じて取得したデータは、各社のプライバシーポリシーに基づき管理されます）
            </p>
          </li>
          <li>
            <h3>お問い合わせ窓口</h3>
            <p>
              本ポリシーに関するご質問やご意見は、下記X（旧Twitter）アカウントまでご連絡ください。
            </p>
            <p>
              アカウント：
              <a href="https://x.com/Nekoyama1031" target="_blank" rel="noopener noreferrer">
                @Nekoyama1031
              </a>
            </p>
          </li>
          <li>
            <h3>本ポリシーの改定</h3>
            <p>
              本ポリシーの内容は、関係法令の改正やサービス内容の変更に応じて予告なく改定することがあります。
            </p>
            <p>最終更新日：2025年7月8日</p>
          </li>
        </ul>
      </div>
      <div className="min-h-[3rem] flex justify-center items-center">
        <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
          閉じる
        </Button>
      </div>
    </div>
  );
}
