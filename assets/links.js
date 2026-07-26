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
    // 20代・中退・既卒・フリーター向け（本命）＝A8「えーかおキャリア」新規面談 約15,000円
    daini: {
      url: '',                                   // ← A8のアフィリリンク（えーかおキャリア）をここに
      fallback: 'https://e-kao-career.jp/',
      label: 'えーかおキャリア（20代・第二新卒／新規面談）',
      programId: ''                              // ← A8のプログラムIDをメモ
    },
    // 実力主義企業への若年層転職＝A8「識学キャリア」新規面談 約25,000円
    creative: {
      url: '',
      fallback: 'https://shikigaku-career.jp/',
      label: '識学キャリア（若年層／新規面談）',
      programId: ''
    },
    // 未経験OK・相談だけで成果＝A8「フミダス」無料転職相談 約8,000〜10,000円
    freelance: {
      url: '',
      fallback: 'https://fumidasu.jp/',
      label: 'フミダス（未経験OK／無料転職相談）',
      programId: ''
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
