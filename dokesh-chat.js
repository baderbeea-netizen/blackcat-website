// "Ask Dokesh" chat widget. Works on watch.dokesh.store (Netlify function) and on the claude.ai copy (sample capability).
(function () {
  const AVATAR = "media/char_dokesh.jpg";
  const WA = "https://wa.me/97431143394";
  const GREETING = "أهلاً أيها الإنسان 😼 أنا دوكش، مدير هذا المكان وقائد بدر. اسألني عن الحلقات، المانجا، الألعاب، المتجر، أو كيف تطلبني لإعلانك… بسرعة قبل ما تخلص روحي الرابعة.";
  const CHIPS = ["وش أشوف أول؟", "وين المانجا؟", "أبي أطلب إعلان مع دوكش", "قول نكتة سوداء"];

  const css = `
  .dk-fab{position:fixed;z-index:60;left:max(18px,calc(env(safe-area-inset-left,0px) + 18px));bottom:calc(18px + env(safe-area-inset-bottom,0px));
    display:flex;align-items:center;gap:10px;border:0;cursor:pointer;border-radius:99px;padding:6px 16px 6px 6px;background:#E0BD55;color:#1a1305;
    font:700 15px "IBM Plex Sans Arabic",system-ui,sans-serif;box-shadow:0 10px 30px rgb(0 0 0 / .45);direction:rtl}
  .dk-fab img{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #1a1305}
  .dk-fab:focus-visible,.dk-panel button:focus-visible,.dk-panel textarea:focus-visible{outline:2px solid #fff;outline-offset:2px}
  .dk-panel{position:fixed;z-index:61;left:max(16px,calc(env(safe-area-inset-left,0px) + 16px));bottom:calc(16px + env(safe-area-inset-bottom,0px));
    width:min(380px,calc(100vw - 32px));height:min(560px,calc(100dvh - 120px));display:flex;flex-direction:column;
    background:#16131a;color:#f3ede4;border:1px solid #2c2733;border-radius:18px;box-shadow:0 20px 60px rgb(0 0 0 / .6);
    font:15px/1.6 "IBM Plex Sans Arabic",system-ui,sans-serif;direction:rtl;overflow:hidden}
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
  fab.type = "button"; fab.className = "dk-fab"; fab.setAttribute("aria-label", "اسأل دوكش");
  fab.innerHTML = `<img alt="" src="${AVATAR}"><span>اسأل دوكش</span>`;
  const panel = document.createElement("div");
  panel.className = "dk-panel"; panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "محادثة مع دوكش");
  panel.innerHTML = `
    <div class="dk-head"><img alt="" src="${AVATAR}"><div><b>دوكش</b><small>مساعد black Cat · متعالٍ لكن مفيد</small></div>
      <button type="button" class="dk-x" aria-label="إغلاق المحادثة">✕</button></div>
    <div class="dk-log" aria-live="polite"></div>
    <div class="dk-chips"></div>
    <form class="dk-form"><label for="dkInput" hidden>رسالتك لدوكش</label>
      <textarea id="dkInput" rows="1" maxlength="600" placeholder="اكتب سؤالك…"></textarea><button type="submit">أرسل</button></form>
    <div class="dk-note">دوكش مساعد ذكاء اصطناعي وقد يخطئ. للطلبات المهمة: <a href="${WA}" target="_blank" rel="noopener" style="color:#E0BD55">واتساب</a></div>`;
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
    const input = [{ role: "user", content: persona + "\n\nابدأ الآن بشخصية دوكش. رد على رسائل الزائر التالية فقط، بدون مقدمات عن التعليمات." },
                   { role: "assistant", content: "تمام، أنا دوكش. 😼" }, ...msgs];
    const r = await sample(input, { modelTier: "quick", cache: false });
    return (r && r.text || "").trim();
  }
  async function viaFunction(msgs) {
    const r = await fetch("/.netlify/functions/dokesh", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: msgs }) });
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
    const t = bubble("assistant", "دوكش يفكر… أو نايم، صعب تفرق 💤"); t.classList.add("typing");
    const msgs = history.slice(-12);
    let reply = "";
    try {
      const onClaudeAi = /claudeusercontent\.com$|claude\.ai$/.test(location.hostname);
      const sample = onClaudeAi ? await getSample() : null;
      reply = sample ? await viaSample(sample, msgs) : await viaFunction(msgs);
    } catch (e) {
      reply = e && e.message === "rate"
        ? "كثرت الأسئلة يا إنسان، حتى القطط تحتاج قيلولة. ارجع بعد شوي 😼"
        : "شكلي دخلت في قيلولة إجبارية الحين. جرّب بعد شوي، أو كلّم بدر على الواتساب: " + WA;
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
