// "Ask Dokesh" chat widget. Works on watch.dokesh.store (Netlify function) and on the claude.ai copy (sample capability).
(function () {
  const AVATAR = "media/char_dokesh.jpg";
  const WA = "https://wa.me/97431143394";
  const EN = window.BC_LANG === "en";
  const L = EN ? {
    greet: "Greetings, human 😼 I'm Dokesh, manager of this place and owner of Badr. Ask me about the episodes, the manga, the games, the shop, or how to hire me for your ad… quickly, I'm on my fourth life.",
    chips: ["What should I watch first?", "Where's the manga?", "I want an ad with Dokesh", "Tell me a dark joke"],
    fab: "Ask Dokesh", sub: "black Cat assistant · aloof but helpful", close: "Close chat", dialog: "Chat with Dokesh", label: "Your message to Dokesh",
    ph: "Type your question…", send: "Send", note: "Dokesh is an AI assistant and can make mistakes. For important requests:", wa: "WhatsApp",
    typing: "Dokesh is thinking… or napping, hard to tell 💤",
    rate: "Too many questions, human. Even cats need a nap. Come back in a bit 😼",
    fail: "Looks like I fell into a mandatory nap. Try again soon, or message Badr on WhatsApp: ",
    hint: "The visitor's browser is in English: reply in English unless they write in another language."
  } : {
    greet: "أهلاً أيها الإنسان 😼 أنا دوكش، مدير هذا المكان وقائد بدر. اسألني عن الحلقات، المانجا، الألعاب، المتجر، أو كيف تطلبني لإعلانك… بسرعة قبل ما تخلص روحي الرابعة.",
    chips: ["وش أشوف أول؟", "وين المانجا؟", "أبي أطلب إعلان مع دوكش", "قول نكتة سوداء"],
    fab: "اسأل دوكش", sub: "مساعد black Cat · متعالٍ لكن مفيد", close: "إغلاق المحادثة", dialog: "محادثة مع دوكش", label: "رسالتك لدوكش",
    ph: "اكتب سؤالك…", send: "أرسل", note: "دوكش مساعد ذكاء اصطناعي وقد يخطئ. للطلبات المهمة:", wa: "واتساب",
    typing: "دوكش يفكر… أو نايم، صعب تفرق 💤",
    rate: "كثرت الأسئلة يا إنسان، حتى القطط تحتاج قيلولة. ارجع بعد شوي 😼",
    fail: "شكلي دخلت في قيلولة إجبارية الحين. جرّب بعد شوي، أو كلّم بدر على الواتساب: ",
    hint: ""
  };
  const GREETING = L.greet, CHIPS = L.chips;
  const DIR = EN ? "ltr" : "rtl";

  const css = `
  .dk-fab{position:fixed;z-index:60;left:max(18px,calc(env(safe-area-inset-left,0px) + 18px));bottom:calc(18px + env(safe-area-inset-bottom,0px));
    display:flex;align-items:center;gap:10px;border:0;cursor:pointer;border-radius:99px;padding:6px 16px 6px 6px;background:#E0BD55;color:#1a1305;
    font:700 15px "IBM Plex Sans Arabic",system-ui,sans-serif;box-shadow:0 10px 30px rgb(0 0 0 / .45)}
  .dk-fab img{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #1a1305}
  .dk-fab:focus-visible,.dk-panel button:focus-visible,.dk-panel textarea:focus-visible{outline:2px solid #fff;outline-offset:2px}
  .dk-panel{position:fixed;z-index:61;left:max(16px,calc(env(safe-area-inset-left,0px) + 16px));bottom:calc(16px + env(safe-area-inset-bottom,0px));
    width:min(380px,calc(100vw - 32px));height:min(560px,calc(100dvh - 120px));display:flex;flex-direction:column;
    background:#16131a;color:#f3ede4;border:1px solid #2c2733;border-radius:18px;box-shadow:0 20px 60px rgb(0 0 0 / .6);
    font:15px/1.6 "IBM Plex Sans Arabic",system-ui,sans-serif;overflow:hidden}
  .dk-head{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#1f1b25;border-bottom:1px solid #2c2733}
  .dk-head img{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid #E0BD55}
  .dk-head b{display:block;font-size:16px}.dk-head small{color:#a49bab;font-size:12px}
  .dk-x{margin-inline-start:auto;background:none;border:1px solid #2c2733;color:#f3ede4;border-radius:10px;width:34px;height:34px;cursor:pointer;font-size:16px}
  .dk-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .dk-m{max-width:85%;padding:8px 12px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word}
  .dk-m.bot{align-self:flex-start;background:#1f1b25;border:1px solid #2c2733;border-start-start-radius:4px}
  .dk-m.me{align-self:flex-end;background:#E0BD55;color:#1a1305;border-start-end-radius:4px}
  .dk-m a{color:#E0BD55}.dk-m.me a{color:#1a1305}
  .dk-m.typing{color:#a49bab}
  .dk-chips{display:flex;gap:6px;flex-wrap:wrap;padding:0 14px 10px}
  .dk-chips button{font:inherit;font-size:13px;cursor:pointer;border-radius:99px;padding:4px 12px;border:1px solid #2c2733;background:transparent;color:#f3ede4}
  .dk-chips button:hover{border-color:#E0BD55}
  .dk-form{display:flex;gap:8px;padding:10px;border-top:1px solid #2c2733;background:#1f1b25}
  .dk-form textarea{flex:1;resize:none;font:inherit;color:#f3ede4;background:#0c0a0e;border:1px solid #2c2733;border-radius:12px;padding:8px 10px;height:42px;max-height:110px}
  .dk-form button{font:inherit;font-weight:700;cursor:pointer;border:0;border-radius:12px;padding:0 16px;background:#E0BD55;color:#1a1305}
  .dk-form button:disabled{opacity:.5;cursor:default}
  .dk-note{font-size:11px;color:#a49bab;text-align:center;padding:0 10px 8px;background:#1f1b25}
  @media (prefers-reduced-motion:no-preference){.dk-panel{animation:dkIn .18s ease-out}@keyframes dkIn{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}}
  `;
  const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  const fab = document.createElement("button");
  fab.type = "button"; fab.className = "dk-fab"; fab.dir = DIR; fab.setAttribute("data-no-i18n", ""); fab.setAttribute("aria-label", L.fab);
  fab.innerHTML = `<img alt="" src="${AVATAR}"><span>${L.fab}</span>`;
  const panel = document.createElement("div");
  panel.className = "dk-panel"; panel.hidden = true; panel.dir = DIR; panel.setAttribute("data-no-i18n", ""); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", L.dialog);
  panel.innerHTML = `
    <div class="dk-head"><img alt="" src="${AVATAR}"><div><b>${EN ? "Dokesh" : "دوكش"}</b><small>${L.sub}</small></div>
      <button type="button" class="dk-x" aria-label="${L.close}">✕</button></div>
    <div class="dk-log" aria-live="polite"></div>
    <div class="dk-chips"></div>
    <form class="dk-form"><label for="dkInput" hidden>${L.label}</label>
      <textarea id="dkInput" rows="1" maxlength="600" placeholder="${L.ph}"></textarea><button type="submit">${L.send}</button></form>
    <div class="dk-note">${L.note} <a href="${WA}" target="_blank" rel="noopener" style="color:#E0BD55">${L.wa}</a></div>`;
  document.body.append(fab, panel);

  const log = panel.querySelector(".dk-log"), chips = panel.querySelector(".dk-chips"),
        form = panel.querySelector(".dk-form"), input = panel.querySelector("textarea"), send = form.querySelector("button");
  let history = [];
  try { history = JSON.parse(sessionStorage.getItem("dk_chat") || "[]"); } catch (e) {}
  const save = () => { try { sessionStorage.setItem("dk_chat", JSON.stringify(history.slice(-20))); } catch (e) {} };

  function linkify(el, text) {
    el.textContent = "";
    const re = /(https?:\/\/[^\s]+|(?:dokesh\.store|watch\.dokesh\.store)[^\s]*|(?:manga|legends|play)\.html)/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
      el.append(text.slice(last, m.index));
      const a = document.createElement("a"); let href = m[0].replace(/[.,،)]+$/, "");
      a.textContent = href; a.href = /^https?:/.test(href) ? href : (/\.html/.test(href) && !/dokesh\.store/.test(href) ? href : "https://" + href);
      if (/^https?:/.test(a.href) && !a.href.startsWith(location.origin)) { a.target = "_blank"; a.rel = "noopener"; }
      el.append(a); el.append(m[0].slice(href.length)); last = m.index + m[0].length;
    }
    el.append(text.slice(last));
  }
  function bubble(role, text) {
    const d = document.createElement("div"); d.className = "dk-m " + (role === "user" ? "me" : "bot");
    linkify(d, text); log.append(d); log.scrollTop = log.scrollHeight; return d;
  }
  function renderAll() {
    log.textContent = ""; bubble("assistant", GREETING);
    history.forEach(m => bubble(m.role, m.content));
    chips.hidden = history.length > 0;
  }
  chips.innerHTML = ""; CHIPS.forEach(c => { const b = document.createElement("button"); b.type = "button"; b.textContent = c; b.onclick = () => ask(c); chips.append(b); });

  // ---------- backends ----------
  let samplePromise = null;
  function getSample() {
    if (!window.claude || !window.claude.use) return Promise.resolve(null);
    if (!samplePromise) samplePromise = window.claude.use("sample").catch(() => null);
    return samplePromise;
  }
  async function viaSample(sample, msgs) {
    const persona = (window.DOKESH_PERSONA || "");
    const input = [{ role: "user", content: persona + (L.hint ? "\n\n" + L.hint : "") + "\n\nابدأ الآن بشخصية دوكش. رد على رسائل الزائر التالية فقط، بدون مقدمات عن التعليمات." },
                   { role: "assistant", content: "تمام، أنا دوكش. 😼" }, ...msgs];
    const r = await sample(input, { modelTier: "quick", cache: false });
    return (r && r.text || "").trim();
  }
  async function viaFunction(msgs) {
    const r = await fetch("/.netlify/functions/dokesh", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: msgs, lang: EN ? "en" : "ar" }) });
    let data = {}; try { data = await r.json(); } catch (e) {}
    if (r.status === 429) throw new Error("rate");
    if (!r.ok || !data.text) throw new Error(data.error || "fail");
    return data.text;
  }

  let busy = false;
  async function ask(text) {
    text = (text || "").trim(); if (!text || busy) return;
    busy = true; send.disabled = true; chips.hidden = true;
    history.push({ role: "user", content: text.slice(0, 600) }); save();
    bubble("user", text); input.value = "";
    const t = bubble("assistant", L.typing); t.classList.add("typing");
    const msgs = history.slice(-12);
    let reply = "";
    try {
      const onClaudeAi = /claudeusercontent\.com$|claude\.ai$/.test(location.hostname);
      const sample = onClaudeAi ? await getSample() : null;
      reply = sample ? await viaSample(sample, msgs) : await viaFunction(msgs);
    } catch (e) {
      reply = e && e.message === "rate"
        ? L.rate
        : L.fail + WA;
    }
    t.classList.remove("typing"); linkify(t, reply);
    history.push({ role: "assistant", content: reply }); save();
    log.scrollTop = log.scrollHeight; busy = false; send.disabled = false; input.focus();
  }

  form.addEventListener("submit", e => { e.preventDefault(); ask(input.value); });
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input.value); } });
  fab.onclick = () => { panel.hidden = false; fab.hidden = true; renderAll(); input.focus(); };
  panel.querySelector(".dk-x").onclick = () => { panel.hidden = true; fab.hidden = false; fab.focus(); };
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) panel.querySelector(".dk-x").click(); });
})();
