(() => {
  const messages = document.getElementById("messages");
  const form = document.getElementById("composer");
  const input = document.getElementById("input");
  const send = document.getElementById("send");

  let items = [];
  let index = new Map(); // normalized key -> {item, kind}

  const normalize = (text) =>
    String(text || "")
      .toLowerCase()
      .replace(/[\s\p{P}\p{S}]/gu, "")
      .trim();

  const bigrams = (text) => {
    const set = new Set();
    for (let i = 0; i < text.length - 1; i += 1) set.add(text.slice(i, i + 2));
    return set;
  };

  const dice = (a, b) => {
    if (!a || !b) return 0;
    if (a === b) return 1;
    const A = bigrams(a);
    const B = bigrams(b);
    if (!A.size || !B.size) return 0;
    let common = 0;
    A.forEach((gram) => { if (B.has(gram)) common += 1; });
    return (2 * common) / (A.size + B.size);
  };

  const buildIndex = () => {
    index = new Map();
    items.forEach((item) => {
      const keys = [item.q, ...(item.v || [])];
      keys.forEach((text, position) => {
        const key = normalize(text);
        if (!key) return;
        if (!index.has(key)) index.set(key, { item, kind: position === 0 ? "原问" : "等价问法" });
      });
    });
  };

  const search = (query) => {
    const key = normalize(query);
    if (!key) return null;
    if (index.has(key)) return { item: index.get(key).item, kind: index.get(key).kind, score: 1 };

    let best = null;
    let bestKey = "";
    for (const [candidateKey, entry] of index) {
      const score = dice(key, candidateKey);
      if (score > (best?.score || 0)) {
        best = entry;
        bestKey = candidateKey;
        best.score = score;
      }
    }
    if (best && (best.score >= 0.55 || (key.length >= 4 && bestKey.includes(key)) || (bestKey.length >= 4 && key.includes(bestKey)))) {
      return { item: best.item, kind: "语义近似", score: best.score };
    }
    return null;
  };

  const nearest = (query, limit = 3) => {
    const key = normalize(query);
    return items
      .map((item) => ({ item, score: dice(key, normalize(item.q)) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };

  const addMessage = (role, build) => {
    const wrap = document.createElement("div");
    wrap.className = `msg ${role}`;
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = role === "user" ? "我" : "柒";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    build(bubble);
    wrap.append(avatar, bubble);
    messages.append(wrap);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  };

  const renderAnswer = (query, result) => {
    addMessage("bot", (bubble) => {
      const text = document.createElement("p");
      text.textContent = result.item.a;
      bubble.append(text);

      const meta = document.createElement("div");
      meta.className = "meta";
      const percent = Math.round(result.score * 100);
      meta.innerHTML = `<b>${result.kind}</b> · 匹配度 ${percent}% · 0 次云端调用 · 答案来自共享问答库`;
      bubble.append(meta);
    });
  };

  const renderMiss = (query) => {
    addMessage("bot", (bubble) => {
      const p = document.createElement("p");
      p.textContent = "静态演示版没有接入云端兜底。完整版会在未命中时交给大模型，并把答案写回库。你可以先试试这些最接近的问题：";
      p.className = "muted";
      bubble.append(p);
      const chips = document.createElement("div");
      chips.className = "chips";
      nearest(query).forEach(({ item }) => {
        const button = document.createElement("button");
        button.textContent = item.q;
        button.addEventListener("click", () => ask(item.q));
        chips.append(button);
      });
      bubble.append(chips);
    });
  };

  const ask = async (query) => {
    const text = String(query || "").trim();
    if (!text) return;
    addMessage("user", (bubble) => {
      const p = document.createElement("p");
      p.textContent = text;
      bubble.append(p);
    });
    input.value = "";
    send.disabled = true;

    const typing = addMessage("bot", (bubble) => {
      const p = document.createElement("p");
      p.textContent = "正在查本地问答库…";
      p.className = "muted";
      bubble.append(p);
    });

    await new Promise((resolve) => setTimeout(resolve, 160));
    const started = performance.now();
    const result = search(text);
    const elapsed = Math.max(0.1, performance.now() - started);
    typing.parentElement.remove();

    if (result) {
      renderAnswer(text, { ...result, elapsed });
    } else {
      renderMiss(text);
    }
    send.disabled = false;
    input.focus();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
  });

  document.getElementById("starterChips").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-q]");
    if (button) ask(button.dataset.q);
  });

  fetch("data/qa.json")
    .then((response) => response.json())
    .then((data) => {
      items = data;
      buildIndex();
      const count = document.querySelector(".stats div:first-child b");
      if (count) count.textContent = items.length;
      const label = document.querySelector(".stats div:first-child span");
      if (label) label.textContent = "本页精选问答";
    })
    .catch(() => {
      addMessage("bot", (bubble) => {
        const p = document.createElement("p");
        p.textContent = "演示数据加载失败，请刷新重试。";
        bubble.append(p);
      });
    });
})();
