// "Support" button: opens a small dialog and sends the visitor to PayPal with any amount they choose.
(function () {
  const PAYPAL_BUSINESS = "Bader.beea@gmail.com";
  const EN = window.BC_LANG === "en";
  const L = EN ? {
    btn: "Support", title: "Support black Cat",
    body: "Dokesh says: \"Every dollar buys me tuna and buys Badr time to make the next episode. Badr thanks you; I merely tolerate you, warmly.\"",
    other: "Other amount", note: "Secure payment on PayPal. You can pay with a card or a PayPal account, in any currency.",
    close: "Close", item: "Support Black Cat Studio"
  } : {
    btn: "دعم", title: "ادعم black Cat",
    body: "دوكش يقول: «كل دولار يشتري لي تونة، ويشتري لبدر وقتاً ليصنع الحلقة الجاية. بدر يشكرك، وأنا أتحمّلك… بحرارة.»",
    other: "مبلغ آخر", note: "الدفع آمن عبر PayPal، بالبطاقة أو بحساب PayPal، وبأي عملة.",
    close: "إغلاق", item: "Support Black Cat Studio"
  };
  const url = (amt) => "https://www.paypal.com/donate/?business=" + encodeURIComponent(PAYPAL_BUSINESS) +
    "&currency_code=USD&no_recurring=0&item_name=" + encodeURIComponent(L.item) + (amt ? "&amount=" + amt : "");

  const css = `
  .sp-btn{display:inline-flex;align-items:center;gap:6px;text-decoration:none;font:700 14px "IBM Plex Sans Arabic",system-ui,sans-serif;cursor:pointer;
    border-radius:99px;padding:7px 14px;border:1px solid #E0BD55;background:transparent;color:#E0BD55}
  .sp-btn:hover{background:#E0BD55;color:#1a1305}
  .sp-btn:focus-visible,.sp-box a:focus-visible,.sp-box button:focus-visible{outline:2px solid #fff;outline-offset:2px}
  .sp-ov[hidden]{display:none}.sp-ov{position:fixed;inset:0;z-index:70;background:rgb(6 5 8 / .8);display:flex;align-items:center;justify-content:center;
    padding:calc(16px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) calc(16px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
  .sp-box{width:min(420px,100%);background:#16131a;color:#f3ede4;border:1px solid #2c2733;border-radius:18px;padding:22px;
    font:15px/1.65 "IBM Plex Sans Arabic",system-ui,sans-serif;box-shadow:0 20px 60px rgb(0 0 0 / .6)}
  .sp-top{display:flex;align-items:center;gap:12px;margin-bottom:10px}
  .sp-top img{width:56px;height:56px;border-radius:50%;object-fit:cover;border:2px solid #E0BD55}
  .sp-top h3{margin:0;font-size:20px}
  .sp-box p{margin:0 0 16px;color:#d8d0c6}
  .sp-amts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:10px}
  .sp-amts a{display:grid;place-items:center;text-decoration:none;font-weight:700;border-radius:12px;padding:10px 0;background:#1f1b25;border:1px solid #2c2733;color:#f3ede4}
  .sp-amts a:hover{border-color:#E0BD55;color:#E0BD55}
  .sp-other{display:block;text-align:center;text-decoration:none;font-weight:700;border-radius:12px;padding:11px;background:#E0BD55;color:#1a1305}
  .sp-note{font-size:12px;color:#a49bab;margin:12px 0 0;text-align:center}
  .sp-x{display:block;margin:12px auto 0;font:inherit;font-size:14px;cursor:pointer;background:none;border:1px solid #2c2733;color:#f3ede4;border-radius:10px;padding:6px 16px}
  .sp-fab{display:none;position:fixed;z-index:64;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px));
    align-items:center;gap:7px;border:0;border-radius:99px;padding:10px 16px;background:#E0BD55;color:#1a1305;cursor:pointer;
    font:700 15px "IBM Plex Sans Arabic",system-ui,sans-serif;box-shadow:0 8px 24px rgb(0 0 0 / .45)}
  .sp-fab:focus-visible{outline:2px solid #fff;outline-offset:2px}
  @media (max-width:760px){.nav-end .sp-btn{display:none}.sp-fab{display:inline-flex}}
  body.sp-nonav .sp-fab{display:inline-flex}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const heart = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6.1 4.5c2.2 0 3.6 1.2 4.4 2.4l1.5 2 1.5-2c.8-1.2 2.2-2.4 4.4-2.4 3.8 0 5.7 4 4.1 7.2C19.5 16.4 12 21 12 21z"/></svg>';
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "sp-btn"; btn.setAttribute("data-no-i18n", ""); btn.setAttribute("aria-label", L.title);
  btn.innerHTML = heart + "<span>" + L.btn + "</span>";

  const ov = document.createElement("div");
  ov.className = "sp-ov"; ov.hidden = true; ov.setAttribute("data-no-i18n", ""); ov.dir = EN ? "ltr" : "rtl";
  ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", L.title);
  ov.innerHTML = `<div class="sp-box">
      <div class="sp-top"><img src="media/char_dokesh.jpg" alt=""><h3>${L.title}</h3></div>
      <p>${L.body}</p>
      <div class="sp-amts">${[3, 5, 10, 25].map(a => `<a href="${url(a)}" target="_blank" rel="noopener">$${a}</a>`).join("")}</div>
      <a class="sp-other" href="${url(0)}" target="_blank" rel="noopener">${L.other}</a>
      <p class="sp-note">${L.note}</p>
      <button type="button" class="sp-x">${L.close}</button></div>`;
  document.body.appendChild(ov);

  // Floating button: always shown on phones (the header has no room there) and on pages without a header.
  const fab = document.createElement("button");
  fab.type = "button"; fab.className = "sp-fab"; fab.setAttribute("data-no-i18n", ""); fab.setAttribute("aria-label", L.title);
  fab.innerHTML = heart + "<span>" + L.btn + "</span>";
  function place() {
    const nav = document.querySelector(".nav-end");
    if (nav) { const pill = nav.querySelector(".pill"); nav.insertBefore(btn, pill || null); }
    else document.body.classList.add("sp-nonav");
    document.body.appendChild(fab);
  }
  let last = null;
  const open = () => { last = document.activeElement; ov.hidden = false; ov.querySelector(".sp-amts a").focus(); };
  btn.onclick = open; fab.onclick = open;
  const close = () => { ov.hidden = true; (last || btn).focus(); };
  ov.querySelector(".sp-x").onclick = close;
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !ov.hidden) close(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", place); else place();
})();
