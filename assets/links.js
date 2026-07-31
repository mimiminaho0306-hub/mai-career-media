/* ===================================================================
   ステージの次へ — CTAリンク集中管理システム（キャリアリード獲得版）
   -------------------------------------------------------------------
   ■ このファイルが唯一の「リンクの正本」です。
     サイト内のすべてのCTAボタンは、HTML側では
     <a data-offer="daini"> と書くだけ。遷移先はここで決まります。

   ■ A8の提携が承認されたら、下の OFFERS の url に
     A8で取得したアフィリリンクを貼るだけで、全ページのCTAが
     一斉に切り替わります。HTMLは1文字も触りません。

   ■ url が空のあいだは fallback（各社の公式サイト）に自動でつながるので、
     提携前でもリンク切れは起きません。
       - url が空      → 公式サイトへ / rel="noopener noreferrer"
       - url を設定済み → アフィリリンクへ / rel="sponsored noopener noreferrer"

   ■ クリックは自動で計測されます（GA4）。
   =================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     ① オファー定義 ← A8承認後はここの url だけ書き換える
        （fallback は提携前の仮リンク。実際の広告主はA8審査で確定）
     ------------------------------------------------------------------ */
  var OFFERS = {
    // 20代・第二新卒・既卒・フリーター向け（本命）＝★株式会社ネオキャリア 提携承認済み(2026-07-24)
    // 第二新卒エージェントneo / 就職エージェントneo。A8の広告リンク(px.a8.net...)を url に貼れば即有効化
    daini: {
      url: 'https://px.a8.net/svt/ejp?a8mat=4B89KU+DBA0AQ+3Y6M+5ZEMP',  // ★ネオキャリア 稼働中(2026-07-24)
      fallback: 'https://tenshoku-agent-neo.com/',
      label: 'ネオキャリア（第二新卒エージェントneo／20代・既卒・フリーター）',
      programId: 's00000018427001005000'
    },
    // マーケ/クリエイティブ職の人材紹介＝★株式会社マスメディアン 提携承認済み(2026-07-30)
    // “見られる仕事”出身と好相性。新規面談7,000円。記事に data-offer="creative" を置くと有効化
    creative: {
      url: 'https://px.a8.net/svt/ejp?a8mat=4B8COT+14HJGI+3JN0+5YJRM',  // ★マスメディアン 承認済み(2026-07-30)・掲載サイト=まい転職アフィ
      fallback: 'https://www.massmedian.co.jp/',
      label: 'マスメディアン（マーケ・クリエイティブ職の転職）',
      programId: 's00000016542001'
    },
    // 新卒・既卒・27卒の就活サポート＝★株式会社ウズウズ【UZUZ新卒】提携承認済み(2026-07-27)
    // 新規無料相談15,000円（高単価）。記事に data-offer="shinsotsu" を置くと有効化
    shinsotsu: {
      url: 'https://px.a8.net/svt/ejp?a8mat=4B89KU+DBVFWI+33T0+1ZG8B6',  // ★UZUZ新卒 承認済み(2026-07-27)・掲載サイト=まい転職アフィ
      fallback: 'https://uzuz.jp/',
      label: 'UZUZ新卒（新卒・既卒・27卒の無料就活相談）',
      programId: 's00000014490012'
    },
    // フリーランス/未経験の相談窓口（審査ありの中単価枠・任意）
    freelance: {
      url: '',
      fallback: 'https://doda.jp/',
      label: 'フリーランス・未経験の相談窓口',
      programId: ''
    },
    // 低単価・低ハードルの入口＝ミイダス（無料で市場価値診断・A8掲載確認済み）
    // 「まだ相談は重い人」を拾う軽い代替CTA。高単価(daini)と役割が違うので併用可
    miidas: {
      url: '',                                   // ← A8のアフィリリンク（ミイダス）をここに
      fallback: 'https://miidas.jp/',
      label: 'ミイダス（無料で市場価値を診断）',
      programId: ''
    },
    // 【AI×キャリア・高単価】生成AIスクールの無料相談/無料説明会（リード獲得）
    // NT10: 導線の終点は"無料相談まで"・受講料/給付金/返金を記事で開示・契約を煽らない
    aischool: {
      url: '',                                   // ← A8/アクセストレードのアフィリリンクをここに
      fallback: 'https://shift-ai.co.jp/',
      label: '生成AIスクール（無料相談・無料説明会）',
      programId: ''
    },
    // 【AI×キャリア・低単価】AIツールのサブスク/登録（低ハードルの入口・煽り不要でクリーン）
    aitool: {
      url: '',
      fallback: 'https://openai.com/chatgpt/',
      label: 'AIツール（まず触ってみる）',
      programId: ''
    },
    // 【資料請求/無料体験・中単価】キャリアコーチング・講座（成果=資料請求/無料体験＝面談より軽い入口）
    // 例: ポジウィル(無料体験会)・マジキャリ・キャリア/資格講座の資料請求。まいの読者と好相性
    shiryo: {
      url: '',
      fallback: 'https://posiwill.jp/career/',
      label: 'キャリアコーチング/講座（無料体験・資料請求）',
      programId: ''
    },
    // 【副業・低〜中単価】副業を"始める入口"＝クラウドソーシング登録/スキルシェア/女性向けスキルスクール
    // NT10: 「誰でも月◯万」info商材・高額塾・投資/FX商材・ネットワークビジネスは不採用（搾取/煽りNG）
    fukugyo: {
      url: 'https://px.a8.net/svt/ejp?a8mat=4B8DGQ+3BO6WY+2PEO+5YJRM',  // ★ココナラ(出品) 承認済み(2026-07-31)・掲載サイト=まい転職アフィ
      fallback: 'https://coconala.com/',
      label: '副業の入口（ココナラ／自分のスキルを出品して売る）',
      programId: 's00000012624001'
    }
  };
  /* ↑ fallback URLは提携前の仮リンク。実在の広告主・最新URLはA8管理画面で確認して差し替える。
     承認された案件の url にA8リンクを貼れば、その時点で全CTAがアフィリリンクへ一斉切替。 */

  /* ------------------------------------------------------------------
     ② GA4測定ID ← 発行したらここに入れる（任意）
        例: 'G-XXXXXXXXXX'
     ------------------------------------------------------------------ */
  var GA4_ID = '';

  /* ------------------------------------------------------------------
     ③ 以下は触らなくて大丈夫です
     ------------------------------------------------------------------ */
  function apply() {
    var links = document.querySelectorAll('a[data-offer]');
    Array.prototype.forEach.call(links, function (a) {
      var key = a.getAttribute('data-offer');
      var offer = OFFERS[key];
      if (!offer) return;
      var isAffiliate = !!offer.url;
      var href = isAffiliate ? offer.url : offer.fallback;
      a.setAttribute('href', href);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', isAffiliate
        ? 'sponsored noopener noreferrer'
        : 'noopener noreferrer');
      a.setAttribute('data-offer-state', isAffiliate ? 'affiliate' : 'official');
      a.addEventListener('click', function () { track(key, offer, a); });
    });
  }

  function track(key, offer, el) {
    var position = el.getAttribute('data-cta-pos') || 'unknown';
    var page = location.pathname.replace(/^\//, '') || 'index.html';
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'offer_click', {
        offer_key: key, offer_label: offer.label,
        cta_position: position, page_path: page
      });
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'offer_click', offer_key: key, cta_position: position, page_path: page });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else { apply(); }
})();
