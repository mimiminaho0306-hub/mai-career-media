/* ===================================================================
   くるま売却ノート — アクセス解析（GA4）
   -------------------------------------------------------------------
   ■ 使い方：下の MEASUREMENT_ID に GA4 の測定ID（G-XXXXXXXXXX）を
     入れるだけで計測が始まります。それまでは何も送信しません。

   ■ GA4の測定IDの取り方（無料）
     1. https://analytics.google.com/ にGoogleアカウントでログイン
     2. 「管理」→「プロパティを作成」→ サイト名などを入力
     3. データストリーム →「ウェブ」→ URLに
        https://kuruma-baikyaku-note.vercel.app を入力
     4. 発行される「測定ID（G-から始まる文字列）」を下にコピー

   ■ 入れると何が見えるようになるか
     - どのページが読まれているか／どこから来たか
     - CTAのクリック（offer_click イベント）
       → どの記事の、どの位置のCTAが押されたかまで分かります
         （assets/links.js が data-cta-pos ごとに送信します）

   ■ IPの匿名化について
     GA4はIPアドレスを保存しない設計のため、追加設定は不要です。
     Cookieの利用はプライバシーポリシーに記載済みです。
   =================================================================== */

(function () {
  'use strict';

  var MEASUREMENT_ID = '';   // ← ここに G-XXXXXXXXXX を入れる

  // 未設定なら何もしない（外部通信ゼロ・表示速度に影響なし）
  if (!/^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(s);
})();
