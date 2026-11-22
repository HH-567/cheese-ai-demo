/* 纯前端演示用的 API 适配层：拦截 /api/*，返回本地数据。 */
(() => {
  const BASE = "/cheese-ai-demo";
  const originalFetch = window.fetch.bind(window);
  const cache = {};
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fixture = async (name) => {
    if (!cache[name]) {
      const response = await originalFetch(`${BASE}/mock/fixtures/${name}.json`);
      cache[name] = await response.json();
    }
    return structuredClone(cache[name]);
  };

  const normalize = (text) =>
    String(text || "").toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "").trim();
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
    let common = 0;
    A.forEach((gram) => { if (B.has(gram)) common += 1; });
    return (2 * common) / (A.size + B.size || 1);
  };

  let qa = null;
  const getQa = async () => {
    if (!qa) qa = await (await originalFetch(`${BASE}/data/qa.json`)).json();
    return qa;
  };

  const match = async (query) => {
    const items = await getQa();
    const key = normalize(query);
    if (/鹈鹕|pelican/i.test(query) && /骑|bicycle|bike|单车/i.test(query)) {
      const pelican = items.find((item) => item.tool === "pelican");
      if (pelican) return { item: pelican, kind: "tool", score: 1 };
    }
    let best = null;
    for (const item of items) {
      for (const [index, text] of [item.q, ...(item.v || [])].entries()) {
        if (normalize(text) === key) {
          return { item, kind: index === 0 ? "exact" : "alias", score: 1 };
        }
      }
      const score = dice(key, normalize(item.q));
      if (!best || score > best.score) best = { item, kind: "semantic", score };
    }
    if (best && best.score >= 0.55) return best;
    return null;
  };

  const now = () => new Date().toISOString();
  const demoSessionId = "ses_demo";
  let demoSession = null;
  let currentUser = null;
  const extraSessions = [];
  const sessionStore = new Map();

  const getDemoSession = async () => {
    if (demoSession) return demoSession;
    const detail = await fixture("session-detail");
    demoSession = {
      ...detail,
      id: demoSessionId,
      owner_id: "u-a",
      title: "校园卡丢了怎么挂失？",
      scope: "shared",
      created_at: "2026-11-22T08:35:47.903+00:00",
      updated_at: now(),
      messages: detail.messages.map((message) => ({ ...message, session_id: demoSessionId })),
    };
    sessionStore.set(demoSessionId, demoSession);
    return demoSession;
  };

  const getSessionById = async (id) => {
    await getDemoSession();
    return sessionStore.get(id) || sessionStore.get(demoSessionId);
  };

  const sessionsPayload = async () => {
    const session = await getDemoSession();
    const list = await fixture("sessions");
    const others = list
      .filter((item) => item.id !== session.id)
      .slice(0, 4)
      .map((item, index) => ({ ...item, title: ["补考没过怎么办？", "校历去哪儿查？", "宿舍报修电话是多少？", "你好"][index] || item.title }));
    const merged = [
      { id: session.id, owner_id: "u-a", title: session.title, scope: "shared",
        created_at: session.created_at, updated_at: now(), last_source: "library" },
      ...extraSessions.map((item) => ({ id: item.id, owner_id: item.owner_id, title: item.title,
        scope: item.scope, created_at: item.created_at, updated_at: now(), last_source: null })),
      ...others,
    ];
    const seen = new Set();
    return merged.filter((item) => !seen.has(item.title) && seen.add(item.title));
  };

  const streamAnswer = (query, result) => {
    const encoder = new TextEncoder();
    const answer = result
      ? result.item.a
      : "这个问题还不在演示库里。静态演示版没有接入云端，完整版会在未命中时调用大模型，并把答案写回库。你可以先试试下面的相近问题：";
    const messageId = `msg_demo_${Math.random().toString(16).slice(2, 10)}`;
    const trace = result
      ? [
          { key: "refs", label: "指代补全", state: "skip", detail: "未检测到指代" },
          { key: "memory", label: "会话记忆", state: "skip", detail: "新会话，无历史上下文" },
          { key: "tool", label: "本地工具", state: "skip", detail: "不是日期或算术请求" },
          { key: "exact", label: "精确匹配", state: "ok", detail: "在 34661 条可见记录中查找" },
          { key: "alias", label: "等价问法", state: result.kind === "alias" ? "ok" : "skip",
            detail: result.kind === "alias" ? "命中已收录问法" : "无等价问法" },
          { key: "semantic", label: "语义检索", state: result.kind === "semantic" ? "ok" : "skip",
            detail: result.kind === "semantic" ? `相似度 ${Math.round(result.score * 100)}%` : "无可靠候选" },
          { key: "verify", label: "条件校验", state: "ok", detail: "对象、输入、语言和适用条件一致" },
          { key: "pause", label: "暂停检查", state: "ok", detail: "目标未暂停" },
          { key: "answer", label: "返回答案", state: "ok", detail: "读取当前发布版本 · 0 次云端调用" },
        ]
      : [
          { key: "refs", label: "指代补全", state: "skip", detail: "未检测到指代" },
          { key: "memory", label: "会话记忆", state: "skip", detail: "新会话，无历史上下文" },
          { key: "tool", label: "本地工具", state: "skip", detail: "不是日期或算术请求" },
          { key: "exact", label: "精确匹配", state: "skip", detail: "未命中" },
          { key: "alias", label: "等价问法", state: "skip", detail: "未命中" },
          { key: "semantic", label: "语义检索", state: "skip", detail: "候选低于阈值" },
          { key: "answer", label: "云端兜底", state: "skip", detail: "静态演示版不调用模型" },
        ];

    if (result?.kind === "tool") {
      const step = trace.find((item) => item.key === "tool");
      if (step) { step.state = "ok"; step.detail = "画图请求，本地生成整页 HTML"; }
    }

    return new Response(new ReadableStream({
      async start(controller) {
        const send = (event, data) => controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        send("start", { message_id: messageId });
        const chunks = Math.max(3, Math.min(8, Math.ceil(answer.length / 60)));
        const size = Math.ceil(answer.length / chunks);
        for (let offset = 0; offset < answer.length; offset += size) {
          send("delta", { text: answer.slice(offset, offset + size) });
          await sleep(28);
        }
        send("done", {
          content: answer,
          source: result ? (result.kind === "tool" ? "tool" : "library") : "local",
          message_id: messageId,
          trace,
          cloud_calls: 0,
          first_token_ms: 0,
          cost: 0,
          total_ms: result ? 42 : 6,
          group_id: result?.item.q ? `demo_${result.item.q}` : undefined,
          version_id: undefined,
          matched_alias: result?.kind === "alias" ? query : undefined,
          match_type: result?.kind || undefined,
          group_scope: "shared",
          group_owner_id: "u-a",
          score: result?.score ?? undefined,
          variant_styles: [],
          query,
        });
        controller.close();
      },
    }), { status: 200, headers: { "Content-Type": "text/event-stream" } });
  };

  const remember = async (session, query, answer, result) => {
    session.messages.push(
      { id: `msg_u_${Date.now()}`, session_id: session.id, role: "user", content: query, source: null,
        group_id: null, version_id: null, matched_alias: null, match_type: null, cloud_calls: 0,
        first_token_ms: 0, total_ms: 0, cost: 0, status: "done", created_at: now(), meta: {} },
      { id: `msg_a_${Date.now()}`, session_id: session.id, role: "assistant", content: answer,
        source: result ? (result.kind === "tool" ? "tool" : "library") : "local", group_id: result?.item.q || null, version_id: null,
        matched_alias: result?.kind === "alias" ? query : null, match_type: result?.kind || null,
        cloud_calls: 0, first_token_ms: 0, total_ms: result ? 42 : 6, cost: 0, status: "done",
        created_at: now(), meta: { query, trace: [], cloud_calls: 0, source: result ? "library" : "local", match_type: result?.kind || null, matched_alias: result?.kind === "alias" ? query : null, group_scope: "shared", group_owner_id: "u-a", total_ms: result ? 42 : 6 } },
    );
    session.title = query.slice(0, 30);
  };

  const handle = async (path, method, init) => {
    if (path === "/api/auth/me" && method === "GET") {
      if (!currentUser) return json({ detail: "未登录" }, 401);
      return json({ user: currentUser });
    }
    if (path === "/api/auth/login" && method === "POST") {
      const body = init.body ? JSON.parse(init.body) : {};
      const users = await fixture("demo-users");
      const found = users.find((item) => item.id === body.user_id) || users[0];
      currentUser = { ...found, verified: true };
      return json({ user: currentUser });
    }
    if (path === "/api/auth/logout") { currentUser = null; return json({ ok: true }); }
    if (path === "/api/auth/options") return json(await fixture("auth-options"));
    if (path === "/api/demo/users") return json(await fixture("demo-users"));
    if (path === "/api/settings" && method === "GET") {
      const settings = await fixture("settings");
      settings.font_scale = 100;
      return json(settings);
    }
    if (path === "/api/settings" && method === "PATCH") {
      const settings = await fixture("settings");
      settings.font_scale = 100;
      return json({ ...settings, ...(init.body ? JSON.parse(init.body) : {}) });
    }
    if (path === "/api/sessions" && method === "GET") return json(await sessionsPayload());
    if (path === "/api/sessions" && method === "POST") {
      const session = { id: `ses_demo_${Date.now()}`, owner_id: "u-a", title: "新对话", scope: "shared",
        created_at: now(), updated_at: now(), summary: null, images: [], documents: [], messages: [] };
      extraSessions.unshift(session);
      sessionStore.set(session.id, session);
      return json(session);
    }
    if (path === "/api/sessions/import") return json({ session_id: demoSessionId, count: 0 });
    if (/^\/api\/sessions\/[^/]+\/messages$/.test(path) && method === "POST") {
      const body = init.body ? JSON.parse(init.body) : {};
      const query = String(body.text || "");
      const result = await match(query);
      const answer = result ? result.item.a
        : "这个问题还不在演示库里。静态演示版没有接入云端，完整版会在未命中时调用大模型，并把答案写回库。你可以先试试下面的相近问题：";
      const target = await getSessionById(path.split("/")[3]);
      void remember(target, query, answer, result);
      return streamAnswer(query, result);
    }
    if (/^\/api\/sessions\/[^/]+$/.test(path) && method === "GET") {
      const id = path.split("/").pop();
      const session = await getSessionById(id);
      return json(session);
    }
    if (/^\/api\/sessions\/[^/]+$/.test(path) && method === "DELETE") return json({ ok: true });
    if (/^\/api\/sessions\/[^/]+\/messages\/[^/]+\/variant$/.test(path)) return json({ ok: true });
    if (path.startsWith("/api/groups?") || path === "/api/groups") return json(await fixture("groups"));
    if (/^\/api\/groups\/[^/]+$/.test(path)) {
      const id = decodeURIComponent(path.split("/").pop());
      const groups = await fixture("groups");
      const item = groups.items.find((group) => group.id === id) || groups.items[0];
      const detail = await fixture("group-detail");
      if (detail.id === item.id) return json(detail);
      const qaItems = await getQa();
      const answer = qaItems.find((entry) => entry.q === item.original)?.a || "（演示数据）这条问答的完整答案在正式库里。";
      return json({ ...item, aliases: [], versions: [{ id: item.current_version_id, group_id: item.id, n: 1,
        answer, basis: "演示数据", by_user_id: "u-a", status: "published", created_at: item.created_at }],
        suspensions: [], learn_task: null, can_manage: true });
    }
    if (path.startsWith("/api/groups/") && path.endsWith("/aliases")) return json([]);
    if (path === "/api/knowledge/documents" && method === "GET") return json({
      can_manage: true,
      documents: [
        { id: "doc_handbook", name: "中国农业大学学生手册.pdf", size: 2411724, active: 1, created_at: "2026-11-20T10:12:00+00:00" },
        { id: "doc_guide", name: "校园办事指南.md", size: 24880, active: 1, created_at: "2026-11-21T09:30:00+00:00" },
      ],
    });
    if (path === "/api/knowledge/documents") return json({ ok: true });
    if (path === "/api/governance") return json(await fixture("governance"));
    if (path === "/api/governance/pending") return json(await fixture("governance-pending"));
    if (path === "/api/admin/members") {
      const members = await fixture("members");
      members.members = members.members.filter((member) => member.id.startsWith("u-"));
      return json(members);
    }
    if (path === "/api/providers") return json(await fixture("providers"));
    if (path === "/api/methods") return json(await fixture("methods"));
    if (path === "/api/work/rules") return json(await fixture("work-rules"));
    if (path.startsWith("/api/usage")) return json(await fixture("usage"));
    if (path === "/api/reports" && method === "POST") return json({ bypassed: false });
    if (path.startsWith("/api/reports/")) return json({ ok: true });
    if (path === "/api/revisions") return json({ revision_id: "rev_demo" });
    if (path.startsWith("/api/revisions/")) return json({ ok: true });
    if (path === "/api/shared-submissions") return json({ submitted: 0, skipped: 0 });
    if (path.startsWith("/api/alias-suggestions")) return json({ ok: true });
    if (path.startsWith("/api/speech")) return json({ text: "" });
    if (path === "/api/health") return json({ ok: true, cloud_configured: false, model: "deepseek-v4.1-flash-1017" });
    return json({ ok: true });
  };

  const banner = document.createElement("div");
  banner.textContent = "静态演示 · 1,000+ 条问答样例，不连接后端；完整版含登录、治理与云端兜底";
  Object.assign(banner.style, {
    position: "fixed", right: "16px", bottom: "16px",
    background: "rgba(20,20,20,.86)", color: "#ffd84a", font: "12px/1.4 'Microsoft YaHei',sans-serif",
    padding: "8px 14px", borderRadius: "999px", zIndex: 9999, pointerEvents: "none",
    boxShadow: "0 8px 24px rgba(0,0,0,.18)", whiteSpace: "nowrap", maxWidth: "calc(100vw - 32px)",
  });
  window.addEventListener("DOMContentLoaded", () => { if (window.matchMedia("(min-width: 720px)").matches) document.body.append(banner); });

  const autoLogin = window.setInterval(() => {
    const root = document.querySelector("#dsh-startup-root");
    const gate = root?.querySelector(".dsu-btn");
    if (gate && root.innerText.includes("授予访问权限") && !gate.dataset.autoGrant) {
      gate.dataset.autoGrant = "1";
      window.setTimeout(() => window.dispatchEvent(new Event("dsh-startup:done")), 300);
      return;
    }
    const password = document.querySelector('input[name="password"]');
    const submit = document.querySelector(".qishi-submit");
    if (password && submit && !password.dataset.autoLogin) {
      password.dataset.autoLogin = "1";
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      const account = document.querySelector('input[name="username"]');
      if (account && !account.value) {
        setter.call(account, "u-a");
        account.dispatchEvent(new Event("input", { bubbles: true }));
      }
      setter.call(password, "demo1234");
      password.dispatchEvent(new Event("input", { bubbles: true }));
      window.setTimeout(() => submit.click(), 500);
    }
  }, 400);

  window.fetch = async (input, init = {}) => {
    const raw = typeof input === "string" ? input : input.url;
    const url = new URL(raw, location.origin);
    if (!url.pathname.startsWith("/api/")) return originalFetch(input, init);
    return handle(url.pathname, (init.method || "GET").toUpperCase(), init);
  };
})();
