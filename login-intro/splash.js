/* ============================================================================
 * dsh-startup-screen — 启动动画运行时（浏览器端，零依赖）
 * ----------------------------------------------------------------------------
 * 由 Host 半侧注入到 index.html，在 React 应用挂载之前接管首屏：
 *
 *   第一幕  黑幕 + DeepSeek 鲸鱼标识／"深度求索"／"DEEPSEEK"（字距收紧 + 扫光）
 *   过场    过曝洗白（黑 → 灰 → 暖白底板），对应参考片的硬切洗白
 *   第二幕  暖白"技术档案"底板：左上品牌块左→右擦出、右下 POWERED BY、进度条
 *   序列    需要访问许可 → 身份资料确认 → 接收访问需求 → 读取完毕 → 验证通过
 *           → 欢迎 <身份名称> 访问；每步中文大字 + 英文等宽字幕 + 底部长句日志
 *   交互    第 1、2 步等待用户确认（按钮 / Enter / 空格 / 点击），可跳过
 *   终幕    WELCOME TO / [DEEPSEEK HARNESS] / 鲸鱼标识，青红色散故障后揭幕
 *   转场    v2.12.0：三段自定义转场（第一幕入场 / 第一幕→第二幕 / 第二幕→桌面），
 *           类型 dissolve|flash|glitch|scanline|slide|iris|black|none，默认 dissolve
 *
 * 配置来自 window.__DSH_STARTUP__（Host 侧注入），也可用
 * window.__DSH_STARTUP_API__.replay() 重播。
 * ========================================================================== */
(function () {
  'use strict'

  if (window.__DSH_STARTUP_LOADED__) return
  window.__DSH_STARTUP_LOADED__ = true

  var ROOT_ID = 'dsh-startup-root'

  /* ── DeepSeek 官方鲸鱼标识（取自 DSH 自带 favicon.svg 的路径数据）──────── */
  /* ── 品牌标识：柒柿 AI（柿子 + 7）────────────────────────────────────
     这串路径是 tools/vectorize-icon.py 从 assets/icon/source-*.png 描出来的，
     tools/apply-icon.mjs 负责写回。换 logo 别手改这里：
       改图 → python tools/vectorize-icon.py → node tools/apply-icon.mjs
     片头中央、终幕、水印、时间线模板读的都是这一份。
     路径里带两个孔（7 的字腔、叶子和果身之间那道白缝），所以绘制端一律 evenodd。 */
  /* ── 品牌标识：柒柿 AI（柿子 + 7）────────────────────────────────────
     这串路径是 tools/vectorize-icon.py 从 assets/icon/source-*.png 描出来的，
     tools/apply-icon.mjs 负责写回。换 logo 别手改这里：
       改图 → python tools/vectorize-icon.py → node tools/apply-icon.mjs
     片头中央、终幕、水印、时间线模板读的都是这一份。
     路径里带两个孔（7 的字腔、叶子和果身之间那道白缝），所以绘制端一律 evenodd。 */
  /* ICON-PATH-BEGIN */
  var BRAND_PATH = 'M11.99 10.28L12.1 10.28L12.22 10.5L12.9 11.19L13.01 11.19L13.3 11.47L13.53 11.53L13.59 11.64L14.27 11.99L15.13 12.27L15.87 12.39L15.87 12.44L17.75 12.73L18.27 12.9L18.49 13.07L18.66 13.07L18.84 13.24L19.58 13.59L19.64 13.7L20.15 13.87L20.61 13.87L20.61 13.81L21.35 13.7L21.52 13.59L21.98 13.53L22.15 13.41L22.37 13.41L22.55 13.3L22.77 13.3L22.95 13.19L23.17 13.19L23.34 13.07L23.8 13.01L24.83 12.67L26.48 13.07L26.66 13.19L27.11 13.24L27.28 13.36L27.74 13.41L27.91 13.53L28.6 13.64L29 13.81L29.79 13.87L30.36 13.64L30.42 13.53L30.88 13.36L31.16 13.13L31.34 13.13L32.02 12.79L32.93 12.62L32.93 12.56L34.13 12.39L34.13 12.33L34.59 12.27L35.62 11.93L36.41 11.53L36.64 11.3L36.76 11.3L37.67 10.45L37.73 10.28L37.96 10.28L37.96 10.33L38.41 10.39L39.27 10.67L39.9 11.02L40.07 11.02L40.41 11.19L40.47 11.3L40.92 11.47L40.98 11.59L41.21 11.64L41.27 11.76L41.38 11.76L41.44 11.87L41.55 11.87L41.61 11.99L42.06 12.22L42.18 12.39L42.29 12.39L42.41 12.56L42.52 12.56L44.12 14.04L44.12 14.16L44.8 14.84L44.8 14.96L44.98 15.07L44.98 15.18L45.15 15.3L45.15 15.41L45.32 15.53L45.32 15.64L45.43 15.7L45.43 15.81L45.89 16.38L47.03 18.61L47.72 20.66L48 22.2L48.06 22.2L48.11 22.89L48.17 22.89L48.29 24.37L48.34 24.37L48.34 25.23L48.4 25.23L48.4 27.23L48.34 27.23L48.34 28.2L48.29 28.2L48.17 29.68L48.11 29.68L48.06 30.36L48 30.36L48 30.65L47.94 30.65L47.66 32.13L47.54 32.31L47.54 32.53L47.43 32.7L47.43 32.93L47.03 34.13L46.57 35.04L46.57 35.22L46.12 36.13L46 36.19L45.83 36.64L45.55 36.99L45.49 37.21L45.38 37.27L45.38 37.38L45.26 37.44L45.26 37.56L45.15 37.61L45.15 37.73L45.03 37.78L44.8 38.24L44.63 38.36L44.63 38.47L43.89 39.27L43.89 39.38L43.26 39.95L43.26 40.07L42.86 40.47L42.75 40.47L42.24 41.04L42.12 41.04L41.89 41.32L41.78 41.32L41.32 41.78L41.21 41.78L41.09 41.95L40.98 41.95L40.92 42.06L40.81 42.06L40.75 42.18L40.64 42.18L40.52 42.35L40.3 42.41L40.07 42.64L39.84 42.69L39.5 42.98L38.01 43.72L37.84 43.72L37.73 43.83L37.56 43.83L37.44 43.95L36.41 44.29L36.13 44.86L36.02 44.92L35.96 45.15L35.84 45.2L35.79 45.43L35.67 45.49L35.62 45.72L35.5 45.77L35.44 46L35.33 46.06L35.27 46.29L35.16 46.35L35.1 46.57L34.99 46.63L34.99 46.74L34.82 46.86L34.7 47.09L34.59 47.09L34.3 47.37L33.68 47.6L32.76 47.6L32.76 47.54L32.36 47.49L32.02 47.32L31.96 47.2L31.85 47.2L31.68 46.97L31.56 46.97L31.45 46.74L30.76 46.12L30.76 46L29.97 45.2L29.51 45.03L17.12 45.03L17.12 44.98L16.61 44.98L16.61 44.92L15.24 44.75L15.24 44.69L14.1 44.46L13.93 44.35L13.7 44.35L13.01 44.12L12.9 44.01L12.16 43.78L11.93 43.61L11.76 43.61L10.62 43.04L10.56 42.92L10.22 42.81L9.99 42.58L9.76 42.52L9.7 42.41L9.25 42.18L8.91 41.84L8.62 41.72L8.45 41.49L8.33 41.49L7.71 40.87L7.59 40.87L7.02 40.24L6.91 40.24L6.68 40.01L6.68 39.9L6.05 39.33L6.05 39.21L5.54 38.7L5.54 38.58L5.02 38.01L5.02 37.9L4.68 37.5L4.62 37.27L4.4 37.04L4.34 36.81L4.05 36.47L3.31 34.99L3.31 34.82L3.08 34.47L2.91 33.85L2.8 33.73L2.68 33.16L2.34 32.25L2.23 31.56L2.17 31.56L1.89 29.74L1.83 29.74L1.83 29.34L1.77 29.34L1.66 27.34L1.6 27.34L1.6 25.17L1.66 25.17L1.66 24.37L1.71 24.37L1.71 23.8L1.77 23.8L1.89 22.6L1.94 22.6L1.94 22.32L2 22.32L2 22.03L2.06 22.03L2.34 20.55L2.51 20.21L2.51 19.98L2.8 19.12L2.91 19.01L3.03 18.55L3.26 18.21L3.26 18.04L3.6 17.35L3.71 17.3L3.94 16.72L4.05 16.67L4.11 16.44L4.34 16.21L4.4 15.98L4.57 15.87L4.8 15.41L5.42 14.73L5.42 14.61L5.77 14.33L5.77 14.21L7.19 12.84L7.31 12.84L7.48 12.62L7.59 12.62L7.71 12.44L7.82 12.44L7.94 12.27L8.05 12.27L8.51 11.87L8.73 11.82L8.96 11.59L9.3 11.47L9.36 11.36L10.39 10.85L10.56 10.85L10.67 10.73L10.85 10.73L10.96 10.62ZM14.9 17.52L14.73 17.69L14.38 19.12L14.16 19.64L13.87 20.83L13.53 21.75L13.53 21.98L13.47 21.98L13.53 22.32L26.03 22.32L26.03 22.37L29.34 22.32L29.39 22.37L29.39 22.55L29.28 22.6L29.22 22.83L29.11 22.89L29.05 23.12L28.94 23.17L28.88 23.4L28.77 23.46L28.71 23.69L28.6 23.74L28.54 23.97L28.42 24.03L28.37 24.26L28.08 24.6L27.97 24.94L27.85 25L27.8 25.23L27.68 25.29L27.63 25.51L27.51 25.57L27.45 25.8L27.34 25.86L27.28 26.08L27 26.43L26.88 26.77L26.6 27.11L26.48 27.45L26.2 27.8L26.08 28.14L25.97 28.2L25.91 28.42L25.63 28.77L25.51 29.11L25.4 29.17L25.34 29.39L25.06 29.74L24.94 30.08L24.83 30.14L24.77 30.36L24.49 30.71L24.37 31.05L24.26 31.11L23.8 32.02L23.69 32.08L23.57 32.42L23.46 32.48L23.34 32.82L23.23 32.88L22.95 33.5L22.83 33.56L22.72 33.9L22.43 34.25L22.26 34.7L22.15 34.76L21.86 35.33L21.86 35.5L21.69 35.73L21.69 35.9L21.58 36.02L21.58 36.19L21.46 36.3L21.12 37.33L20.95 37.56L20.89 37.9L20.61 38.41L20.26 39.44L20.09 39.67L19.75 40.7L19.35 41.49L19.35 41.72L19.52 41.78L19.64 41.72L22.89 41.72L22.89 41.78L24.94 41.78L24.94 41.72L26.26 41.78L26.43 41.72L26.66 41.55L26.77 41.27L26.77 40.98L26.88 40.75L26.94 40.18L27.05 39.95L27.11 39.38L27.23 39.15L27.28 38.58L27.4 38.36L27.45 37.78L27.57 37.56L27.63 36.99L27.74 36.76L27.74 36.47L27.91 36.02L28.14 34.82L28.37 34.36L28.48 34.3L28.6 33.96L28.71 33.9L28.88 33.45L29 33.39L29.17 32.93L29.28 32.88L29.39 32.53L29.51 32.48L29.62 32.13L29.74 32.08L29.85 31.73L29.97 31.68L30.08 31.34L30.19 31.28L30.31 30.94L30.42 30.88L30.54 30.54L30.65 30.48L30.76 30.14L30.88 30.08L30.99 29.74L31.11 29.68L31.51 28.82L31.62 28.77L31.79 28.31L32.08 27.97L32.7 26.71L32.82 26.66L32.93 26.31L33.22 25.97L33.33 25.63L33.45 25.57L34.02 24.43L34.3 24.09L34.47 23.63L34.59 23.57L35.1 22.55L35.22 22.49L35.39 22.03L35.67 21.69L36.07 20.83L36.19 20.78L36.19 20.49L36.07 20.38L35.9 19.69L35.67 19.29L35.22 17.92L35.04 17.58L34.93 17.52ZM24.66 2.4L28.14 2.4L28.71 2.68L28.88 3.14L28.82 3.43L27.91 4.34L27.57 5.02L27.45 5.71L27.4 5.71L27.4 6.57L27.45 6.57L27.57 7.14L27.91 7.76L28.02 7.76L28.25 7.48L28.37 7.48L29 6.91L29.79 6.51L29.85 6.39L30.25 6.28L30.48 6.11L31.16 5.88L31.39 5.88L31.39 5.82L31.73 5.82L31.73 5.77L33.05 5.82L33.05 5.88L33.28 5.88L33.28 5.94L33.5 5.94L33.5 5.99L33.73 5.99L33.73 6.05L33.96 6.05L33.96 6.11L34.19 6.11L34.19 6.17L34.42 6.17L35.1 6.39L35.44 6.39L35.44 6.45L36.36 6.45L36.7 6.34L37.27 6.34L37.61 6.51L37.84 6.79L37.9 7.54L37.67 7.99L37.56 8.05L37.56 8.16L37.1 8.73L37.1 8.85L36.64 9.36L36.64 9.48L36.36 9.7L36.36 9.82L35.96 10.22L35.84 10.22L35.39 10.62L34.7 10.96L33.85 11.25L31.56 11.64L30.88 11.87L30.36 12.16L30.02 12.27L29.68 12.27L29.68 12.33L29.11 12.33L29.11 12.27L28.77 12.27L28.77 12.22L28.08 12.1L27.91 11.99L27.28 11.87L26.94 11.7L26.71 11.7L26.54 11.59L26.31 11.59L24.94 11.13L24.37 11.25L23.86 11.47L23.63 11.47L23.12 11.7L22.89 11.7L21.18 12.27L20.09 12.33L20.09 12.27L19.69 12.22L19.52 12.04L18.61 11.64L16.32 11.3L16.32 11.25L16.1 11.25L15.24 10.96L14.44 10.56L14.04 10.22L13.93 10.22L13.41 9.7L13.41 9.59L13.19 9.42L13.19 9.3L13.01 9.19L13.01 9.08L12.84 8.96L12.84 8.85L12.67 8.73L12.67 8.62L12.33 8.22L12.27 7.99L12.16 7.94L11.99 7.59L11.99 6.91L12.33 6.45L12.62 6.34L12.96 6.34L13.41 6.51L14.1 6.57L14.1 6.51L14.5 6.51L14.5 6.45L15.24 6.34L15.41 6.22L15.64 6.22L15.64 6.17L15.87 6.17L16.04 6.05L17.24 5.82L17.24 5.77L18.32 5.77L18.32 5.82L18.89 5.88L20.21 6.39L20.26 6.51L20.49 6.57L20.55 6.68L20.66 6.68L20.72 6.79L21.18 7.02L21.92 7.71L23.46 3.26L23.97 2.68Z'
  /* ICON-PATH-END */

  /* ── 默认配置（与 Host 侧 lib/index.js 的 DEFAULTS 保持一致）──────────── */
  var DEFAULTS = {
    enabled: true,
    mode: 'session',            // always | session | daily
    theme: 'light',             // light | dark
    speed: 1,
    requireInteraction: true,   // 第 1、2 步等待用户确认
    allowSkip: true,
    sound: true,                // 界面音效（WebAudio 合成，无音频文件）
    soundVolume: 0.5,
    voice: true,                // 女声播报
    voiceLang: 'en',            // en | zh | both
    voiceName: '',              // '' = 自动挑女声（见 FEMALE_HINTS）
    voiceRate: 0.88,            // 电影旁白档：比朗读慢，字与字之间才有重量
    voicePitch: 0.85,           // 压低音调，深沉的 AI 女声
    voiceVolume: 0.9,
    voiceCue: true,             // 念台词前的一声轻提示
    sfx: 'audio',               // audio=真素材（用户音频里抠的音效）/ synth=现场合成
    voiceSource: 'asset',       // asset=优先用真声素材 / tts=全部 TTS 合成
    voiceLead: 240,
    welcomeDelay: 550,             // 终幕欢迎语相对 05→06 和声钟的延迟（ms）
    /* v2.14.0 用户自备 BGM（与 lib/host-startup.js DEFAULTS 对齐） */
    bgmEnabled: false,
    bgmFile: '',
    bgmFile2: '',
    bgmVolume: 0.5,
    bgmBpm: 100,
    bgmBeats1: 16,
    bgmBeats2: 32,
    bgm1Start: 0,
    bgm2Start: 0,
    bgm1FadeIn: 1,
    bgm1FadeOut: 1,
    bgm2FadeIn: 1,
    bgm2FadeOut: 2,
    bgmCrossfade: 1200,
    bgm2Loop: false,
    bgmDuck: true,
    identity: 'JOYCE MOORE',    // ← 设置页可改的"身份名称"
    identityId: '0087',
    accessLevel: '3',
    brand1: 'DEEPSEEK',
    brand2: 'SYNTHESIZE INTELLIGENCE',
    brand3a: 'HARNESS',
    brand3b: 'OS',
    orgZh: '深度求索',
    orgEn: 'DEEPSEEK',
    orgSub: 'DEEPSEEK HARNESS',
    welcomeBox: 'DEEPSEEK HARNESS',
    footer: 'POWERED BY DEEPSEEK',
    accent: '#ff7500',
    glitchA: '#ff3b30',
    glitchB: '#2971b8',
    /* ── v2.12.0 三段自定义转场（与 Host 侧 lib/host-startup.js 的 DEFAULTS 对齐）──
       作用点：① 第一幕入场 ② 第一幕→第二幕 ③ 第二幕→桌面。
       'dissolve' = 旧行为（不挂覆盖层、时序逐帧不变）；'none' = 硬切。
       transitionMs 单位 ms（200–2000）；transitionDir 只影响 scanline / slide。 */
    transitionIn: 'dissolve',
    transitionJoin: 'dissolve',
    transitionOut: 'dissolve',
    transitionMs: 600,
    transitionDir: 'left'
  }

  /* ══ v2.12.0 三段自定义转场：归一化 + 只读调试钩子 ══════════════════════
     作用点：① 第一幕入场 ② 第一幕→第二幕 ③ 第二幕→桌面。
     配置由 Host 经 window.__DSH_STARTUP__ 下发（transitionIn/Join/Out、
     transitionMs、transitionDir）。注意：**不缓存进 C** —— 设置页「立即预览」
     会换掉 window.__DSH_STARTUP__ 再 replay，所以每次播放/每次转场都现读
     （见 transType()）。非法或缺失一律回落 'dissolve'（= 旧行为）。 */
  var TRANS_TYPES = ['dissolve', 'flash', 'glitch', 'scanline', 'slide', 'iris', 'black', 'none']
  var TRANS_DIRS = ['left', 'right', 'up', 'down']
  var TRANS_MS_DEFAULT = 600
  var TRANS_MS_MIN = 200
  var TRANS_MS_MAX = 2000

  /** 非法类型回落 fallback（默认 'dissolve'）；纯函数，调试钩子也用它 */
  function normalizeTransType(v, fallback) {
    var s = String(v == null ? '' : v).trim().toLowerCase()
    if (TRANS_TYPES.indexOf(s) >= 0) return s
    var f = String(fallback == null ? '' : fallback).trim().toLowerCase()
    return TRANS_TYPES.indexOf(f) >= 0 ? f : 'dissolve'
  }
  function normalizeTransDir(v) {
    var s = String(v == null ? '' : v).trim().toLowerCase()
    return TRANS_DIRS.indexOf(s) >= 0 ? s : 'left'
  }
  function normalizeTransMs(v) {
    var n = Number(v)
    if (!isFinite(n)) return TRANS_MS_DEFAULT
    return Math.min(TRANS_MS_MAX, Math.max(TRANS_MS_MIN, Math.round(n)))
  }

  /* 只读调试状态：冒烟测试断言「覆盖层有没有清干净」用，不参与业务 */
  var transState = { lastType: '', lastDir: '', overlays: 0 }
  try {
    Object.defineProperty(transState, 'active', {
      enumerable: true,
      get: function () {
        try { return document.querySelectorAll('.dsu-trans-overlay').length } catch (e) { return 0 }
      }
    })
  } catch (eDefine) { /* 老浏览器不支持 getter 就算了 */ }
  try {
    window.__DSH_TRANSITION_META__ = {
      types: TRANS_TYPES.slice(),
      dirs: TRANS_DIRS.slice(),
      normalize: normalizeTransType,
      normalizeDir: normalizeTransDir,
      normalizeMs: normalizeTransMs
    }
    window.__DSH_TRANSITION_STATE__ = transState
  } catch (eMeta) { /* 暴露失败不影响播放 */ }

  /* ── 序列脚本：中文主字 + 英文等宽字幕 + 底部日志 ───────────────────────
     `say` 是专门给语音播报用的自然语句（照着参考片里女声念状态行的节奏，
     正好卡在各自文字出现的时间点上）。 */
  /* ── 序列脚本 ──────────────────────────────────────────────────────────
     文字与真声素材一一对应（来自你给的音频）：
       line-1.mp3 = V1 需要访问许可
       line-2.mp3 = V2 身份资料确认
       line-3.mp3 = V4 接收访问需求
       line-4.mp3 = V5 开始读取权限
       line-5.mp3 = V6 读取完毕 · 核验通过
     V3 是用户名字独白，按你的要求不用。
     `say` 是素材拿不到时的 TTS 兜底文本；`audio` 是素材文件名（不含扩展名）。 */
  /* ── 分幕数据（模板化）───────────────────────────────────────────────────
     分幕不再写死：优先用 window.__DSH_STARTUP_TEMPLATE__（宿主从
     ~/.dsh/startup-templates/<id>/template.json 或插件自带 templates/<id>/ 读出来的纯 JSON），
     没选模板就用下面这份内置默认。

     模板可以是**任意幕数**：1 ~ 24 幕都行，每一幕的文案、音频槽、按钮、
     停留时长、进度都是数据。最后一幕之后的「终幕欢迎」仍由引擎负责 ——
     它要用设置里的身份名称，属于运行时状态而不是模板内容。 */
  var BUILTIN_STEPS = [
    {
      zh: '需要访问许可',
      en: 'ACCESS PERMISSION REQUIRED',
      say: 'Access permission required.',
      audio: 'line-1',
      log: '等待用户授权…',
      logEn: 'AWAITING OPERATOR CONSENT',
      badge: 'AUTHORIZATION',
      action: 'grant',
      btnZh: '授予访问权限',
      btnEn: 'GRANT ACCESS',
      hold: 900,
      progress: 0.34
    },
    {
      zh: '身份资料确认',
      en: 'IDENTITY VERIFICATION',
      say: 'Identity verification.',
      audio: 'line-2',
      log: '核对身份资料…',
      logEn: 'MATCHING OPERATOR RECORD',
      badge: 'IDENTITY',
      action: 'confirm',
      btnZh: '确认身份',
      btnEn: 'CONFIRM IDENTITY',
      hold: 700,
      progress: 0.5
    },
    {
      zh: '接收访问需求',
      en: 'ACCESS REQUEST RECEIVED',
      say: 'Access request received.',
      audio: 'line-3',
      log: '接收访问需求，建立会话通道…',
      logEn: 'HANDSHAKE ESTABLISHED',
      badge: 'REQUEST',
      action: 'auto',
      hold: 1200,
      progress: 0.66,
      assembleLogo: true
    },
    {
      zh: '开始读取权限',
      en: 'PERMISSION READ STARTED',
      say: 'Beginning permission read.',
      audio: 'line-4',
      log: '开始读取权限，索引工作区与会话…',
      logEn: 'READING PERMISSION SET',
      badge: 'READ',
      action: 'auto',
      hold: 1200,
      progress: 0.8,
      hex: true
    },
    {
      zh: '读取完毕 · 核验通过',
      en: 'READ COMPLETE · VERIFIED',
      say: 'Read complete. Verification passed.',
      audio: 'line-5',
      log: '读取完毕，核验通过，权限已授予',
      logEn: 'PERMISSION AUTHORIZED',
      badge: 'VERIFY',
      action: 'auto',
      hold: 1600,
      progress: 0.93,
      reticle: true
    }
  ]

  /* ══ QISHI PATCH 2/4 · 登录桥 ═════════════════════════════════════════════
     页面可以在 window.__QISHI_LOGIN__ 上注入一个对象，接管「身份资料确认」这一幕：
       mount({card, btn, hint})  这一幕开始时把登录表单画进原来的身份卡位置
       wait({resolve, step})     等真实核验通过后再 resolve，动画才继续往下走
     没注入时（比如别的项目只想单独用这支片头）整套行为和原版逐行一致。 */
  function qishiBridge() {
    var b = window.__QISHI_LOGIN__
    return (b && typeof b === 'object') ? b : null
  }
  var pendingGateStep = null

  var STEP_ACTIONS = { grant: 1, confirm: 1, auto: 1 }
  var AUDIO_SLOTS = { 'line-1': 1, 'line-2': 1, 'line-3': 1, 'line-4': 1, 'line-5': 1, 'line-6': 1, 'line-7': 1, 'line-8': 1, 'line-9': 1, 'line-10': 1, 'line-11': 1, 'line-12': 1, 'line-13': 1, 'line-14': 1, 'line-15': 1, 'line-16': 1 }

  /* 声音优先用「模板自带」的那份：模板 JSON 里写
       "assets": { "line-1": "assets/line-1.mp3", ... }
     就会去 /dsh-startup/template-asset/<模板id>/line-1.mp3 取；
     没有就回落全局 lib/assets/line-N.mp3（原来的行为）。
     这样不同模板可以有各自的配音，互不覆盖。 */
  /* ══ QISHI PATCH 1/4 · 资源基址 ═══════════════════════════════════════════
     原实现把声音写死成 Host 路由 /dsh-startup/voice/<pack>/line-N.mp3。
     提炼成独立静态页后没有那些路由，file:// 双击打开时绝对路径更是直接失效，
     所以改成读 window.__QISHI_ASSET_BASE__ 的相对基址（默认指向随包的 assets/）。
     同一个函数同时兼容两种命名空间：
       line-N / voice:x:line-N  → <base>/voices/<pack>/line-N.mp3
       sfx-*                    → <base>/sfx/<name>.mp3
     模板自带音频若存在，仍走 templates/<id>/ 分支（本项目未启用模板，不触发）。 */
  var ASSET_BASE = (function () {
    var b = window.__QISHI_ASSET_BASE__
    if (typeof b !== 'string' || !b) b = './vendor/dsh-boot-suite/lib/assets'
    return b.replace(/\/+$/, '')
  })()

  function assetUrl(name) {
    /* 扩展音色包：slot 形如 voice:a:line-1 */
    var mv = /^voice:([a-z]):(line-[1-9]\d?)$/.exec(name)
    if (mv) return ASSET_BASE + '/voices/' + mv[1] + '/' + mv[2] + '.mp3'
    var map = (TEMPLATE && TEMPLATE.assets) || null
    var file = (map && map[name]) ? String(map[name]).replace(/^.*\//, '') : ''
    if (file && /^[a-z0-9][a-z0-9._-]{0,40}\.(mp3|wav|ogg|m4a|aac)$/i.test(file) && TEMPLATE && TEMPLATE.id) {
      return ASSET_BASE + '/templates/' + encodeURIComponent(TEMPLATE.id) + '/' + file
    }
    var pack = (typeof C !== 'undefined' && C && C.voicePack) || 'f'
    if (pack === 'builtin') pack = 'f'
    if (/^line-[1-9]\d?$/.test(name)) return ASSET_BASE + '/voices/' + pack + '/' + name + '.mp3'
    return ASSET_BASE + '/sfx/' + name + '.mp3'
  }
  var MAX_STEPS = 24

  function tplText(v, fallback, max) {
    var s = (v === undefined || v === null) ? '' : String(v).trim()
    if (!s) return fallback
    return s.slice(0, max)
  }

  function tplNum(v, fallback, lo, hi) {
    var n = Number(v)
    if (!isFinite(n)) return fallback
    return Math.min(hi, Math.max(lo, n))
  }

  /** 把模板里的 steps 归一化成引擎能吃的数据：缺字段回落内置、越界夹取、幕数夹到 1~24。 */
  function normalizeSteps(raw) {
    var list = Array.isArray(raw) ? raw : []
    var out = []
    for (var i = 0; i < list.length && out.length < MAX_STEPS; i++) {
      var s = (list[i] && typeof list[i] === 'object') ? list[i] : {}
      var base = BUILTIN_STEPS[Math.min(i, BUILTIN_STEPS.length - 1)]
      out.push({
        zh: tplText(s.zh, base.zh, 40),
        en: tplText(s.en, base.en, 60),
        say: tplText(s.say, base.say, 200),
        audio: (typeof s.audio === 'string' && AUDIO_SLOTS[s.audio]) ? s.audio : base.audio,
        log: tplText(s.log, base.log, 48),
        logEn: tplText(s.logEn, base.logEn, 60),
        badge: tplText(s.badge, base.badge, 24),
        action: (typeof s.action === 'string' && STEP_ACTIONS[s.action]) ? s.action : 'auto',
        btnZh: tplText(s.btnZh, base.btnZh || '继续', 20),
        btnEn: tplText(s.btnEn, base.btnEn || 'CONTINUE', 24),
        hold: tplNum(s.hold, base.hold, 200, 8000),
        progress: (typeof s.progress === 'number' && isFinite(s.progress)) ? Math.min(1, Math.max(0, s.progress)) : null,
        assembleLogo: s.assembleLogo === true,
        reticle: s.reticle === true,
        hex: s.hex === true,
        /* 终端风：这一幕的版式（默认 log；card = 整块换成身份卡） */
        screen: (s.screen === 'card' || s.screen === 'none') ? s.screen : 'log',
        cardStatus: tplText(s.cardStatus, '', 24)
      })
    }
    if (!out.length) {
      for (var j = 0; j < BUILTIN_STEPS.length; j++) out.push(BUILTIN_STEPS[j])
    }
    /* 没写进度的按位置均分（n 幕 + 终幕 = n+1 段），这样任意幕数都不会把进度条走飞 */
    var total = out.length + 1
    for (var k = 0; k < out.length; k++) {
      if (out[k].progress === null) out[k].progress = Math.round(((k + 1) / total) * 100) / 100
    }
    return out
  }

  /* ── 字符图集：256 个两位十六进制字形。"字符粒子"的本体就是这些字，不是图片。 ── */
  var CHAR_ATLAS = {}
  function charAtlas(color) {
    var key = String(color || '#eaf6ff')
    if (CHAR_ATLAS[key]) return CHAR_ATLAS[key]
    var CELL = 32, COLS = 16
    var cv = document.createElement('canvas')
    cv.width = CELL * COLS; cv.height = CELL * COLS
    var g = cv.getContext('2d')
    if (!g) return null
    g.fillStyle = key
    g.font = 'bold 20px Consolas, Menlo, monospace'
    g.textAlign = 'center'; g.textBaseline = 'middle'
    var HEX = '0123456789ABCDEF'
    for (var i = 0; i < 256; i++) {
      g.fillText(HEX[i >> 4] + HEX[i & 15], (i % COLS) * CELL + CELL / 2, Math.floor(i / COLS) * CELL + CELL / 2)
    }
    CHAR_ATLAS[key] = { cv: cv, cell: CELL, cols: COLS }
    return CHAR_ATLAS[key]
  }

  /* ── 离线量字：画一遍文字 → 读 alpha → 网格采样 → 均匀抽稀到 count 个落点 ──
     和 550C 一样：先量宽度自适应字号，再用 stride 抽稀（不是截前 N 个，否则字会缺半边）。 */
  /* ── 唯一定位约定：left/top 恒为 0，位置只由 transform 表达，元素中心 = (cx, cy) ── */
  function placeLayer(node, cx, cy, w, h, extra) {
    node.style.left = '0px'
    node.style.top = '0px'
    node.style.transform = 'translate(' + (cx - w / 2) + 'px,' + (cy - h / 2) + 'px)' + (extra || '')
  }

  function buildTextTargets(text, count) {
    var W = 1280, H = 720
    var cv = document.createElement('canvas')
    cv.width = W; cv.height = H
    var g = cv.getContext('2d')
    if (!g) return []
    g.fillStyle = '#fff'
    g.textAlign = 'center'; g.textBaseline = 'middle'
    var base = Math.round(H * 0.26)
    g.font = '800 ' + base + 'px "Segoe UI", "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", Inter, system-ui, sans-serif'
    var tw = g.measureText(text).width
    var fit = W * 0.86
    var finalPx = base
    if (tw > fit) { finalPx = Math.floor(base * fit / tw); g.font = '800 ' + finalPx + 'px "Segoe UI", Inter, system-ui, sans-serif' }
    g.fillText(text, W / 2, H / 2)
    var data = null
    try { data = g.getImageData(0, 0, W, H).data } catch (e) { return [] }
    var step2 = 12
    function aAt(x, y) {
      if (x < 0 || y < 0 || x >= W || y >= H) return 0
      return data[(y * W + x) * 4 + 3]
    }
    var edge = [], inner = []
    for (var y = 0; y < H; y += step2) {
      for (var x = 0; x < W; x += step2) {
        if (aAt(x, y) <= 140) continue
        var isEdge = aAt(x - step2, y) <= 140 || aAt(x + step2, y) <= 140 || aAt(x, y - step2) <= 140 || aAt(x, y + step2) <= 140
        ;(isEdge ? edge : inner).push([x, y])
      }
    }
    if (!edge.length && !inner.length) return []
    /* 轮廓 65% / 内部 35%：字靠轮廓立住，内部只补层次 */
    var wantEdge = Math.min(edge.length, Math.round(count * 0.65))
    var out = []
    function pick(list, n) {
      if (!n || !list.length) return
      var stride = Math.max(1, Math.round(list.length / n))
      for (var k = 0; k < list.length && n > 0; k += stride) { out.push(list[k]); n-- }
    }
    pick(edge, wantEdge)
    pick(inner, count - out.length)
    /* 落点不够就循环补：保证每个粒子都有落点，不会在中途"变少" */
    if (out.length && out.length < count) {
      var pool = edge.length ? edge : inner
      var ci = 0
      while (out.length < count) {
        var base2 = pool[(ci * 13 + 7) % pool.length]
        var jx = ((ci * 37) % 13) - 6, jy = ((ci * 53) % 13) - 6
        out.push([base2[0] + jx, base2[1] + jy])
        ci++
      }
    }
    out.text = text
    out.fontPx = finalPx
    out.W = W; out.H = H
    return out
  }

  /* ── 取消体系：一次播放 = 一个 runSeq；跳过/收尾时 +1，旧定时器与旧 rAF 全部作废 ──
     参考 550C 的做法：任何延后执行的东西都必须能被一次 skip 整体掐掉，
     否则跳过之后还有定时器在后台改已卸掉的 DOM。 */
  var runSeq = 0
  /* 编辑器预览标记：模块级，onGateKey 与时间线都要读（之前丢在 runTimeline 内部，按键会 ReferenceError） */
  var EDIT = false
  function later(fn, ms) {
    var mySeq = runSeq
    return setTimeout(function () {
      if (mySeq !== runSeq) return   /* 已经被跳过/收尾，静默作废 */
      fn()
    }, ms)
  }
  function invalidateRun() { runSeq += 1 }

  var TEMPLATE = (window.__DSH_STARTUP_TEMPLATE__ && typeof window.__DSH_STARTUP_TEMPLATE__ === 'object')
    ? window.__DSH_STARTUP_TEMPLATE__
    : null
  var TEMPLATE2 = (window.__DSH_STARTUP_TEMPLATE2__ && typeof window.__DSH_STARTUP_TEMPLATE2__ === 'object')
    ? window.__DSH_STARTUP_TEMPLATE2__
    : null
  var STEPS = normalizeSteps(TEMPLATE && TEMPLATE.steps)
  /* v2 时间线模板：有 layers[] 就走图层关键帧渲染，否则走原来的分幕流程 */
  var TIMELINE = (TEMPLATE && Array.isArray(TEMPLATE.layers) && TEMPLATE.layers.length) ? TEMPLATE.layers : null

  function cfg() {
    var raw = (window.__DSH_STARTUP__ && typeof window.__DSH_STARTUP__ === 'object')
      ? window.__DSH_STARTUP__
      : {}
    var out = {}
    for (var k in DEFAULTS) if (Object.prototype.hasOwnProperty.call(DEFAULTS, k)) out[k] = DEFAULTS[k]
    for (var k2 in raw) {
      if (Object.prototype.hasOwnProperty.call(raw, k2) && raw[k2] !== undefined && raw[k2] !== null) {
        out[k2] = raw[k2]
      }
    }
    out.speed = Math.min(3, Math.max(0.35, Number(out.speed) || 1))
    /* v2.12.0 三段转场：C 里的值只是「读不到 window.__DSH_STARTUP__ 时的回落」，
       真正生效值由 transType()/transMsValue()/transDir() 每次现读。 */
    out.transitionIn = normalizeTransType(out.transitionIn)
    out.transitionJoin = normalizeTransType(out.transitionJoin)
    out.transitionOut = normalizeTransType(out.transitionOut)
    out.transitionMs = normalizeTransMs(out.transitionMs)
    out.transitionDir = normalizeTransDir(out.transitionDir)
    out.identity = String(out.identity || DEFAULTS.identity).slice(0, 48)
    /* 代号取身份名称里的字母数字；纯中文名字取不到时退回 OPERATOR */
    out.identityId = String(out.identityId || out.identity).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12)
    if (!out.identityId) out.identityId = 'OPERATOR'
    return out
  }

  var C = cfg()
  /* v2.16.7：当前正在构建哪一幕的时间线（1=第一幕，2=第二幕），用于视频原声开关 */
  var TIMELINE_ACT = 1

  /* 模板的配色。两条规矩：
     1) 用户手动挑过的颜色优先 —— 只有配置还是默认值时才让模板改；
     2) 底/字色没有对应配置项，模板说了算（这就是换皮肤的主要手段）。
     返回的 CSS 变量等根节点建好之后再 setProperty（见下面 root 那段）。 */
  function tplColor(v) {
    if (typeof v !== 'string') return ''
    var s = v.trim()
    if (/^#[0-9a-fA-F]{3,8}$/.test(s)) return s
    if (/^rgba?\(\s*[\d.]+%?\s*[, ]\s*[\d.]+%?\s*[, ]\s*[\d.]+%?\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/.test(s)) return s
    return ''
  }

  var TEMPLATE_CSS_VARS = (function () {
    var th = TEMPLATE && TEMPLATE.theme
    if (!th || typeof th !== 'object') return {}
    var userOwned = { accent: 'accent', glitchA: 'glitchA', glitchB: 'glitchB' }
    for (var k in userOwned) {
      if (!Object.prototype.hasOwnProperty.call(userOwned, k)) continue
      var c = tplColor(th[k])
      if (c && String(C[userOwned[k]]) === String(DEFAULTS[userOwned[k]])) C[userOwned[k]] = c
    }
    /* 模板要求深色、而用户没手动切过主题时，切到深色版式 */
    if (th.mode === 'dark' && String(C.theme) === String(DEFAULTS.theme)) C.theme = 'dark'
    var mapVars = {
      bg: '--dsu-bg', bg2: '--dsu-bg-2', ink: '--dsu-ink', inkSoft: '--dsu-ink-soft',
      muted: '--dsu-muted', hair: '--dsu-hair', hairSoft: '--dsu-hair-soft'
    }
    var out = {}
    for (var key in mapVars) {
      if (!Object.prototype.hasOwnProperty.call(mapVars, key)) continue
      var v = tplColor(th[key])
      if (v) out[mapVars[key]] = v
    }
    return out
  })()

  /** 重播：把运行时脚本重新挂一次（配置/身份名称改动后 preview 用它）。 */
  function injectSelf() {
    diagRun('replay/injectSelf')
    window.__DSH_STARTUP_LOADED__ = false
    /* v2.12.0：重播前把转场覆盖层收干净，否则旧实例的层会盖在新动画上 */
    try { transCleanup() } catch (eTr) { /* 忽略 */ }
    var old = document.getElementById(ROOT_ID)
    if (old && old.parentNode) old.parentNode.removeChild(old)
    window.__DSH_STARTUP_SKIP__ = false
    var s = document.createElement('script')
    /* 正式运行时由 Host 路由提供（加时间戳绕开缓存）；
       离线预览页会把相对路径写进 __DSH_STARTUP_SCRIPT_URL__，file:// 下不加查询串。 */
    if (window.__DSH_STARTUP_SCRIPT_URL__) {
      s.src = window.__DSH_STARTUP_SCRIPT_URL__
    } else {
      s.src = '/dsh-startup/splash.js?t=' + Date.now()
    }
    document.head.appendChild(s)
  }

  /* Host 侧的首屏兜底脚本已经判定"这次不播"（未启用 / 本会话已播 / 今日已播）：
     这里不再建 DOM，但仍然暴露 API，方便设置页按需重播。 */
  if (window.__DSH_STARTUP_SKIP__ === true) {
    window.__DSH_STARTUP_API__ = {
      steps: STEPS,
      template: (TEMPLATE && TEMPLATE.id) || '',
      replay: injectSelf,
      pause: pause,
      resume: resume,
      paused: function () { return PAUSED },
      skip: function () {},
      finish: function () {},
      config: C
    }
    return
  }

  /* 最后一道保险：无论前面哪一步抛异常，都不许把用户留在黑幕里 */
  setTimeout(function () {
    try {
      var r = document.getElementById(ROOT_ID)
      if (r && r.classList && r.classList.contains('dsu-boot')) {
        if (r.parentNode) r.parentNode.removeChild(r)
        document.documentElement.classList.remove('dsu-lock')
        if (document.body) document.body.style.overflow = ''
        window.__DSH_STARTUP_FAILED__ = true
      }
    } catch (e) { /* 兜底本身不许再抛 */ }
  }, 9000)

  /* ── 小工具 ───────────────────────────────────────────────────────────── */
  function el(tag, cls, text) {
    var n = document.createElement(tag)
    if (cls) n.className = cls
    if (text != null) n.textContent = text
    return n
  }

  function svgBrand(cls) {
    var ns = 'http://www.w3.org/2000/svg'
    var svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('viewBox', '0 0 50 50')
    svg.setAttribute('aria-hidden', 'true')
    if (cls) svg.setAttribute('class', cls)
    var base = (window.__QISHI_ASSET_BASE__ || '') + '/cheese/'
    var xlink = 'http://www.w3.org/1999/xlink'
    var ver = '?v=7'
    if (cls === 'dsu-brand-mark' || cls === 'dsu-w3-mark') {
      /* 黑底白标、欢迎页实心黑标：直接用现成图片，不做描线动画。 */
      var href = base + (cls === 'dsu-brand-mark' ? 'cheese-white.png' : 'cheese-black.png') + ver
      var img = document.createElementNS(ns, 'image')
      img.setAttribute('class', 'cheese-fill')
      img.setAttribute('href', href)
      img.setAttributeNS(xlink, 'xlink:href', href)
      img.setAttribute('width', '50')
      img.setAttribute('height', '50')
      img.setAttribute('preserveAspectRatio', 'xMidYMid meet')
      svg.appendChild(img)
      return svg
    }
    /* 纸面 logo：按写 C 的顺序画——右上起笔，经左上、左下，到右下收笔；
       再补上中间的点线，最后整体填充成实心。 */
    function mk(tag, attrs) {
      var node = document.createElementNS(ns, tag)
      for (var key in attrs) node.setAttribute(key, attrs[key])
      return node
    }
    var outline = mk('g', { class: 'cheese-outline-group', fill: 'none', stroke: 'currentColor',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    outline.appendChild(mk('path', {
      class: 'cheese-pen', d: 'M28.4,15.3 A10.5,10.5 0 1 0 28.4,34.7',
      'stroke-width': '1.6', pathLength: '100', 'stroke-dasharray': '100', 'stroke-dashoffset': '100'
    }))
    var parts = [
      ['circle', { cx: '20.5', cy: '25', r: '3.4' }, 1000],
      ['path', { d: 'M23.9,25 L29.4,24.2' }, 1120],
      ['circle', { cx: '30.4', cy: '24.2', r: '1.4' }, 1220],
      ['circle', { cx: '24.0', cy: '30.2', r: '1.4' }, 1320],
      ['path', { d: 'M36.4,7.6 L37.8,11.1 L41.3,12.5 L37.8,13.9 L36.4,17.4 L35,13.9 L31.5,12.5 L35,11.1 Z' }, 1440]
    ]
    for (var i = 0; i < parts.length; i++) {
      var attrs = { class: 'cheese-part', 'stroke-width': '1.5', pathLength: '100',
        'stroke-dasharray': '100', 'stroke-dashoffset': '100',
        style: 'animation-delay:' + parts[i][2] + 'ms' }
      for (var key in parts[i][1]) attrs[key] = parts[i][1][key]
      outline.appendChild(mk(parts[i][0], attrs))
    }
    var drawing = mk('g', { class: 'cheese-drawing',
      transform: 'translate(24.5 25) scale(1.26) translate(-24.5 -25)' })
    drawing.appendChild(outline)
    var solid = mk('g', { class: 'cheese-fill-shapes', fill: 'currentColor', opacity: '0' })
    solid.appendChild(mk('path', { d: 'M28.8,13.2 A12.6,12.6 0 1 0 28.8,36.8 L27.5,33.3 A8.8,8.8 0 1 1 27.5,16.7 Z' }))
    solid.appendChild(mk('circle', { cx: '20.5', cy: '25', r: '3.4' }))
    solid.appendChild(mk('path', { d: 'M23.9,25 L29.4,24.2', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linecap': 'round' }))
    solid.appendChild(mk('circle', { cx: '30.4', cy: '24.2', r: '1.4' }))
    solid.appendChild(mk('circle', { cx: '24.0', cy: '30.2', r: '1.4' }))
    solid.appendChild(mk('path', { d: 'M36.4,7.6 L37.8,11.1 L41.3,12.5 L37.8,13.9 L36.4,17.4 L35,13.9 L31.5,12.5 L35,11.1 Z' }))
    drawing.appendChild(solid)
    svg.appendChild(drawing)
    /* 收笔后落回原始标识图，保证最终形状和尺寸与原版一致。 */
    var finalHref = base + 'cheese-black.png' + ver
    var finalImg = document.createElementNS(ns, 'image')
    finalImg.setAttribute('class', 'cheese-final')
    finalImg.setAttribute('href', finalHref)
    finalImg.setAttributeNS(xlink, 'xlink:href', finalHref)
    finalImg.setAttribute('width', '50')
    finalImg.setAttribute('height', '50')
    finalImg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.appendChild(finalImg)
    return svg
  }

  /** 逐字渐显：比逐字截断更稳（居中排版不会因为字宽变化而抖动） */
  function typeIn(host, text, stagger) {
    host.textContent = ''
    var frag = document.createDocumentFragment()
    var n = 0
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i)
      if (ch === ' ') {
        frag.appendChild(document.createTextNode('\u00a0'))
        continue
      }
      var s = el('span', 'dsu-ch', ch)
      s.style.transitionDelay = Math.round(n * stagger) + 'ms'
      frag.appendChild(s)
      n++
    }
    host.appendChild(frag)
  }

  function setIn(node, on, cls) {
    if (!node) return
    node.classList.toggle(cls || 'dsu-in', !!on)
  }

  /* ── DOM 搭建 ─────────────────────────────────────────────────────────── */
  /* 上一次播放异常退出/重播可能留下转场覆盖层：新实例先把残留清干净，绝不让它挡屏 */
  try { transCleanup() } catch (eStaleTrans) { /* 清不掉也不影响播放 */ }
  var root = document.getElementById(ROOT_ID)
  if (!root) {
    root = el('div')
    root.id = ROOT_ID
    root.className = 'dsu-root'
    document.body.appendChild(root)
  }
  root.classList.toggle('dsu-dark', C.theme === 'dark')
  /* 模板声明 style:"terminal" 时切到终端版式（等宽、扫描线、日志行、身份卡） */
  var TERMINAL = !!(TEMPLATE && TEMPLATE.style === 'terminal')
  if (TERMINAL) root.classList.add('dsu-terminal')
  if (TIMELINE) root.classList.add('dsu-tl')
  root.style.setProperty('--dsu-speed', String(C.speed))
  root.style.setProperty('--dsu-accent', C.accent)
  root.style.setProperty('--dsu-glitch-a', C.glitchA)
  root.style.setProperty('--dsu-glitch-b', C.glitchB)
  /* 模板自定义的底/字色（内联样式优先级最高，压过 .dsu-dark 那套预设） */
  for (var tplVar in TEMPLATE_CSS_VARS) {
    if (Object.prototype.hasOwnProperty.call(TEMPLATE_CSS_VARS, tplVar)) root.style.setProperty(tplVar, TEMPLATE_CSS_VARS[tplVar])
  }

  var ui = {}
  var clockTimer = null
  var html =
    '<div class="dsu-plate"></div>' +
    '<div class="dsu-vignette"></div>' +
    '<div class="dsu-watermark"></div>' +
    '<div class="dsu-grain"></div>' +
    '<div class="dsu-black">' +
      '<div class="dsu-black-inner"></div>' +
      '<div class="dsu-sweep"></div>' +
    '</div>' +
    '<div class="dsu-wash"></div>' +
    '<header class="dsu-brand">' +
      '<div class="dsu-brand-1"></div><div class="dsu-brand-2"></div>' +
      '<div class="dsu-brand-3"><b></b><span></span></div>' +
    '</header>' +
    '<div class="dsu-stepcount">[ 00 / 06 ] INIT</div>' +
    '<div class="dsu-center">' +
      '<div class="dsu-status"><span class="dsu-status-zh"></span><i class="dsu-caret"></i></div>' +
      '<div class="dsu-sub-en"></div>' +
      '<div class="dsu-rule"></div>' +
      '<div class="dsu-logo"></div>' +
      '<div class="dsu-dots" hidden></div>' +
    '</div>' +
    '<div class="dsu-idline"></div>' +
    '<div class="dsu-reticle"></div>' +
    '<div class="dsu-hex"></div>' +
    '<div class="dsu-welcome">' +
      '<div class="dsu-w1">WELCOME TO</div>' +
      '<div class="dsu-w2"></div>' +
      '<div class="dsu-w3"></div>' +
      '<div class="dsu-w4"></div>' +
    '</div>' +
    '<div class="dsu-action">' +
      '<div class="dsu-card" hidden></div>' +
      '<button class="dsu-btn" type="button">' +
        '<span class="dsu-btn-zh"></span><span class="dsu-btn-en"></span>' +
      '</button>' +
      '<div class="dsu-hint"></div>' +
    '</div>' +
    '<div class="dsu-frame">' +
      '<i class="dsu-corner dsu-c-tl"></i><i class="dsu-corner dsu-c-tr"></i>' +
      '<i class="dsu-corner dsu-c-bl"></i><i class="dsu-corner dsu-c-br"></i>' +
      '<div class="dsu-scanline"></div>' +
    '</div>' +
    '<div class="dsu-slats"></div>' +
    '<div class="dsu-voice"><i></i><i></i><i></i><i></i><i></i></div>' +
    '<div class="dsu-meta"><span class="dsu-meta-1"></span><span class="dsu-meta-2"></span></div>' +
    '<div class="dsu-skip">SKIP ▸</div>' +
    '<footer class="dsu-foot"><span></span><i></i></footer>' +
    '<div class="dsu-subtitle">' +
      '<span class="dsu-sub-zh"></span><span class="dsu-sub-en2"></span>' +
    '</div>' +
    '<div class="dsu-progress"><i></i></div>' +
    '<div class="dsu-bloom"></div>' +
    '<div class="dsu-streak"></div>' +
    '<div class="dsu-flash"></div>'

  root.innerHTML = html

  function q(sel) { return root.querySelector(sel) }
  ui.plate = q('.dsu-plate')
  ui.watermark = q('.dsu-watermark')
  ui.black = q('.dsu-black')
  ui.blackInner = q('.dsu-black-inner')
  ui.sweep = q('.dsu-sweep')
  ui.wash = q('.dsu-wash')
  ui.flash = q('.dsu-flash')
  ui.bloom = q('.dsu-bloom')
  ui.streak = q('.dsu-streak')
  ui.vignette = q('.dsu-vignette')
  ui.brand = q('.dsu-brand')
  ui.center = q('.dsu-center')
  ui.brand1 = q('.dsu-brand-1')
  ui.brand2 = q('.dsu-brand-2')
  ui.brand3b = q('.dsu-brand-3 b')
  ui.brand3s = q('.dsu-brand-3 span')
  ui.stepcount = q('.dsu-stepcount')
  ui.status = q('.dsu-status')
  ui.statusZh = q('.dsu-status-zh')
  ui.caret = q('.dsu-caret')
  ui.subEn = q('.dsu-sub-en')
  ui.rule = q('.dsu-rule')
  ui.logo = q('.dsu-logo')
  ui.dots = q('.dsu-dots')
  ui.idline = q('.dsu-idline')
  ui.reticle = q('.dsu-reticle')
  ui.hex = q('.dsu-hex')
  ui.welcome = q('.dsu-welcome')
  ui.w1 = q('.dsu-w1')
  ui.w2 = q('.dsu-w2')
  ui.w3 = q('.dsu-w3')
  ui.w4 = q('.dsu-w4')
  ui.action = q('.dsu-action')
  ui.card = q('.dsu-card')
  ui.btn = q('.dsu-btn')
  ui.btnZh = q('.dsu-btn-zh')
  ui.btnEn = q('.dsu-btn-en')
  ui.hint = q('.dsu-hint')
  ui.skip = q('.dsu-skip')
  ui.foot = q('.dsu-foot')
  ui.footText = q('.dsu-foot span')
  ui.subZh = q('.dsu-sub-zh')
  ui.subEn2 = q('.dsu-sub-en2')
  ui.progress = q('.dsu-progress')
  ui.bar = q('.dsu-progress i')
  ui.frame = q('.dsu-frame')
  ui.scanline = q('.dsu-scanline')
  ui.slats = q('.dsu-slats')
  ui.voice = q('.dsu-voice')
  ui.meta = q('.dsu-meta')
  ui.meta1 = q('.dsu-meta-1')
  ui.meta2 = q('.dsu-meta-2')

  /* 内容填充 */
  ui.brand1.textContent = C.brand1
  ui.brand2.textContent = C.brand2
  ui.brand3b.textContent = C.brand3a
  ui.brand3s.textContent = C.brand3b
  ui.footText.textContent = C.footer
  ui.w2.textContent = C.welcomeBox
  ui.w4.textContent = '欢迎 ' + C.identity + ' 访问'
  ui.idline.textContent = '· ID CONFIRMED : ' + C.identityId

  ;(function blackStage() {
    var inner = ui.blackInner
    var brand = svgBrand('dsu-brand-mark')
    inner.appendChild(brand)
    inner.appendChild(el('div', 'dsu-black-zh', C.orgZh))
    var en = el('div', 'dsu-black-en', C.orgEn)
    inner.appendChild(en)
    inner.appendChild(el('div', 'dsu-black-sub', C.orgSub))
    ui.blackEn = en
  })()

  ;(function logoStage() {
    ui.logo.appendChild(svgBrand())
    ui.logo.appendChild(el('div', 'dsu-logolabel', C.logoLabel || 'C H E E S E'))   /* QISHI PATCH 8：logo 下方那行也走配置 */
  })()

  ;(function welcomeLogo() {
    ui.w3.appendChild(svgBrand('dsu-w3-mark'))
    ui.w3.appendChild(el('span', 'dsu-w3label', C.welcomeLabel || 'D E E P S E E K  ·  H A R N E S S')) /* QISHI PATCH 7：终幕小字改读配置 */
  })()

  ;(function watermark() {
    var boxes = [
      [0.60, 0.02, 0.16, 0.96], [0.78, 0.02, 0.16, 0.96], [0.96, 0.02, 0.16, 0.96],
      [0.05, 0.02, 0.10, 0.5]
    ]
    for (var i = 0; i < boxes.length; i++) {
      var b = boxes[i]
      var n = el('div', 'dsu-wm')
      n.style.left = (b[0] * 100) + '%'
      n.style.top = (b[1] * 100) + '%'
      n.style.width = (b[2] * 100) + '%'
      n.style.height = (b[3] * 100) + '%'
      ui.watermark.appendChild(n)
    }
  })()

  /* 左侧六格阶段柱 + 品牌块下方的小字数据行 + 实时时钟 */
  ;(function slatsAndMeta() {
    for (var i = 0; i < STEPS.length + 1; i++) ui.slats.appendChild(el('i', 'dsu-slat'))
    ui.meta1.textContent = 'REV 0.1.0 · WEB PROFILE'
    paintClock()
    clockTimer = setInterval(paintClock, 1000)
  })()

  ;(function reticle() {
    var ns = 'http://www.w3.org/2000/svg'
    var svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('viewBox', '0 0 400 400')
    function arc(cx, cy, r, a0, a1, cls, cap) {
      var rad = function (d) { return (d - 90) * Math.PI / 180 }
      var x0 = cx + r * Math.cos(rad(a0)), y0 = cy + r * Math.sin(rad(a0))
      var x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1))
      var large = (a1 - a0) > 180 ? 1 : 0
      var p = document.createElementNS(ns, 'path')
      p.setAttribute('d', 'M' + x0.toFixed(2) + ' ' + y0.toFixed(2) +
        ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2))
      p.setAttribute('class', cls)
      if (cap) p.setAttribute('stroke-linecap', cap)
      return { node: p, x: x1, y: y1, x0: x0, y0: y0 }
    }
    var gA = document.createElementNS(ns, 'g')
    gA.setAttribute('class', 'dsu-ret-rot-a')
    /* 300° 弧，缺口留在正下方 6 点钟方向：底部字幕永远不会被压到，
       弧末端圆点落在 5 点钟位置，和原片一致。 */
    var a = arc(200, 200, 150, 215, 505, 'dsu-ring-a', 'round')
    gA.appendChild(a.node)
    var da = document.createElementNS(ns, 'circle')
    da.setAttribute('class', 'dsu-dot-a')
    da.setAttribute('cx', a.x.toFixed(2)); da.setAttribute('cy', a.y.toFixed(2)); da.setAttribute('r', '7')
    gA.appendChild(da)
    svg.appendChild(gA)

    var gB = document.createElementNS(ns, 'g')
    gB.setAttribute('class', 'dsu-ret-rot-b')
    var b = arc(200, 200, 104, 200, 490, 'dsu-ring-b', 'round')
    gB.appendChild(b.node)
    var db = document.createElementNS(ns, 'circle')
    db.setAttribute('class', 'dsu-dot-b')
    db.setAttribute('cx', b.x0.toFixed(2)); db.setAttribute('cy', b.y0.toFixed(2)); db.setAttribute('r', '4')
    gB.appendChild(db)
    svg.appendChild(gB)

    var gC = document.createElementNS(ns, 'g')
    var bl = arc(200, 200, 62, 118, 242, 'dsu-bracket', 'round')
    var br = arc(200, 200, 62, 298, 62, 'dsu-bracket', 'round')
    gC.appendChild(bl.node); gC.appendChild(br.node)
    svg.appendChild(gC)

    var pts = [[152, 132], [252, 268], [278, 150]]
    for (var i = 0; i < pts.length; i++) {
      var c = document.createElementNS(ns, 'circle')
      c.setAttribute('class', 'dsu-dot-o')
      c.setAttribute('cx', pts[i][0]); c.setAttribute('cy', pts[i][1]); c.setAttribute('r', '2.8')
      svg.appendChild(c)
    }
    ui.reticle.appendChild(svg)
  })()

  /* ── 时间线引擎 ───────────────────────────────────────────────────────── */
  var timers = []
  var waiters = []
  var skipped = false
  var finished = false
  /** 安全统计视频元素数量（测试替身没有 querySelectorAll） */
  function videoCount() {
    try { return document.querySelectorAll ? document.querySelectorAll('video').length : 0 } catch (eVc) { return 0 }
  }
  /** 运行轨迹：写到宿主诊断日志，定位重复播放/时序问题 */
  function diagRun(msg) {
    if (C.diagnostics === false) return
    /* QISHI PATCH（附带）：独立静态页没有 /dsh-startup/diag 这个宿主路由，
       file:// 下更会刷一串 CORS 报错。没有宿主就干脆不发。 */
    if (window.location && window.location.protocol === 'file:') return
    try {
      fetch('/dsh-startup/diag', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: '[run] ' + msg
      }).catch(function () { /* 没宿主：诊断失败不影响播放 */ })
    } catch (e) { /* 诊断失败不影响播放 */ }
  }
  var hexTimer = null

  function ms(base) { return Math.round(base / C.speed) }

  /* ── 暂停 / 继续（只在模板编辑器的预览里用，不影响真实开机）────────────────
     做法是「软暂停」：每个等待点进门先过一道闸门，暂停时闸门关着 ——
     当前这一小段计时会走完，然后停在这一幕，不会把界面切成半帧。
     音频同步暂停（speechSynthesis），恢复时接着念。 */
  var PAUSED = false
  var resumeQueue = []

  function whenResumed() {
    if (!PAUSED) return Promise.resolve()
    return new Promise(function (res) { resumeQueue.push(res) })
  }

  function pause() {
    if (PAUSED) return false
    PAUSED = true
    try { if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) speechSynthesis.pause() } catch (e) { /* 没语音就算了 */ }
    return true
  }

  function resume() {
    if (!PAUSED) return false
    PAUSED = false
    try { if (typeof speechSynthesis !== 'undefined' && speechSynthesis.paused) speechSynthesis.resume() } catch (e) { /* noop */ }
    var q = resumeQueue
    resumeQueue = []
    for (var i = 0; i < q.length; i++) { try { q[i]() } catch (e2) { /* noop */ } }
    return true
  }

  function wait(base) {
    return whenResumed().then(function () {
      return waitTimer(base)
    })
  }

  function waitTimer(base) {
    /* 交互门：模板写 gates:[{from,to}]，在区间内按空格/回车就跳到 to（第一幕→第二幕） */
    /* ══ QISHI PATCH 5/6 · 没有模板时不许炸 ══════════════════════════════
       原实现直接读 TEMPLATE.gates，而 TEMPLATE 在「没注入模板块」时是 null。
       本项目的片头不挂模板（六幕用的就是内置 BUILTIN_STEPS），于是第一帧
       wait() 就抛 TypeError，被顶层兜底当场揭幕 —— 表现是「黑一下就没了」。
       这一行按其它位置的写法补上短路。 */
    var GATES = ((TEMPLATE && Array.isArray(TEMPLATE.gates)) ? TEMPLATE.gates : [])
      .filter(function (g) { return g && isFinite(Number(g.from)) && isFinite(Number(g.to)) })
    function activeGate() {
      for (var gi = 0; gi < GATES.length; gi++) {
        var g = GATES[gi]
        if (elapsed >= Number(g.from) && elapsed < Number(g.to)) return g
      }
      return null
    }
    function advanceGate() {
      var g = activeGate()
      if (!g) return false
      elapsed = Math.max(0, Math.min(duration, Number(g.to)))
      applyTimeline(tl, elapsed)
      return true
    }
    function onGateKey(ev) {
      if (finished || EDIT) return
      if (ev.code === 'Space' || ev.key === 'Enter') {
        if (advanceGate()) { ev.preventDefault(); try { ev.stopPropagation() } catch (e7) { /* noop */ } }
      }
    }
    try { window.addEventListener('keydown', onGateKey, true) } catch (e8) { /* noop */ }
    return new Promise(function (resolve) {
      if (skipped) return resolve()
      var done = false
      function fin() {
        if (done) return
        done = true
        var i = waiters.indexOf(fin)
        if (i >= 0) waiters.splice(i, 1)
        resolve()
      }
      var t = setTimeout(fin, Math.max(0, ms(base)))
      timers.push(t)
      waiters.push(fin)
    })
  }

  function waitAction() {
    return new Promise(function (resolve) {
      if (skipped || !C.requireInteraction) return resolve()
      var done = false
      function fin() {
        if (done) return
        done = true
        cleanup()
        resolve()
      }
      function onKey(e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); fin() }
      }
      function onClick(e) { e.preventDefault(); fin() }
      function cleanup() {
        ui.btn.removeEventListener('click', onClick)
        ui.action.removeEventListener('click', onClick)
        document.removeEventListener('keydown', onKey)
        var i = waiters.indexOf(fin)
        if (i >= 0) waiters.splice(i, 1)
      }
      /* ══ QISHI PATCH 3/4 · 登录闸门 ═══════════════════════════════════════
         原行为：点按钮 / 按 Enter 就立刻放行。接入真实鉴权后那等于按一下回车
         就绕过登录，所以「身份资料确认」这一幕改成等登录桥 resolve ——
         核验失败时它不 resolve，画面停在这一幕，用户可以重试或跳过。 */
      var bridge = qishiBridge()
      if (bridge && bridge.wait && pendingGateStep && pendingGateStep.action === 'confirm') {
        waiters.push(fin)
        try {
          bridge.wait({ resolve: fin, step: pendingGateStep })
        } catch (eGate) {
          fin()
        }
        return
      }
      ui.btn.addEventListener('click', onClick)
      ui.action.addEventListener('click', onClick)
      document.addEventListener('keydown', onKey)
      waiters.push(fin)
    })
  }

  function releaseAll() {
    for (var i = 0; i < timers.length; i++) clearTimeout(timers[i])
    timers.length = 0
    var list = waiters.slice()
    waiters.length = 0
    for (var j = 0; j < list.length; j++) { try { list[j]() } catch (err) { /* noop */ } }
  }

  /* ══ v2.12.0 三段自定义转场（覆盖层实现）════════════════════════════════
     设计：
       · 覆盖层 = body 直属 div.dsu-trans-overlay（z-index 2147483700，高于
         #dsh-startup-root 的 2147483000 与 act2 覆盖层的 2147483600），
         pointer-events:none —— 永远不挡交互。
       · 每种类型由 CSS 关键帧演两段：cover（盖住）→ 换场 → reveal（揭开），
         每段时长 = transitionMs/2（再按 speed 缩放）。JS 只负责挂层、切相位、按时移除。
       · 全部等待走 wait()：skip/finish 时 releaseAll() 解除等待，配合
         transCleanup() 兜底移除 —— 不会留下遮罩或定时器。
       · 任何异常都 catch 后按「无转场」继续；reduced-motion 视为硬切。 */
  var TRANS_Z = 2147483700
  var transOv = null        /* 当前活动覆盖层 */
  var transPreserve = false /* finish() 期间保留覆盖层（交给 transOut 的 reveal 移除） */

  /** 现读 window.__DSH_STARTUP__（设置页「立即预览」会整体替换它，缓存 C 会拿到旧值） */
  function transRaw() {
    try {
      return (window.__DSH_STARTUP__ && typeof window.__DSH_STARTUP__ === 'object')
        ? window.__DSH_STARTUP__
        : {}
    } catch (e) { return {} }
  }
  function transRead(key, def, norm) {
    var raw = transRaw()
    var v = raw[key]
    if (v === undefined || v === null || v === '') v = (C && C[key] !== undefined) ? C[key] : def
    return norm(v)
  }
  function transType(which) { return transRead('transition' + which, 'dissolve', normalizeTransType) }
  function transMsValue() { return transRead('transitionMs', TRANS_MS_DEFAULT, normalizeTransMs) }
  function transDir() { return transRead('transitionDir', 'left', normalizeTransDir) }
  function transReduced() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    } catch (e) { return false }
  }
  /** 需要覆盖层的类型（dissolve = 旧行为 / none = 硬切 / reduced-motion 都不挂层） */
  function transActive(kind) {
    return kind !== 'dissolve' && kind !== 'none' && !transReduced()
  }
  function transHalfMs() {
    return Math.max(80, Math.round(ms(transMsValue()) / 2))
  }
  function transCoverColor() {
    return C.theme === 'dark' ? '#0b0d12' : '#f7f1f8'
  }

  /** 建覆盖层并挂到 body；失败返回 null（= 回落无转场） */
  function transMount(kind, phase) {
    var ov = null
    try {
      var dir = transDir()
      ov = document.createElement('div')
      ov.className = 'dsu-trans-overlay dsu-trans-' + kind
      ov.id = 'dsh-startup-trans'
      ov.setAttribute('data-kind', kind)
      ov.setAttribute('data-dir', dir)
      ov.setAttribute('data-phase', phase || 'cover')
      ov.setAttribute('data-theme', C.theme === 'dark' ? 'dark' : 'light')
      ov.setAttribute('aria-hidden', 'true')
      ov.style.zIndex = String(TRANS_Z)
      ov.style.setProperty('--dsu-trans-dur', transHalfMs() + 'ms')
      ov.style.setProperty('--dsu-trans-bg', transCoverColor())
      ov.style.setProperty('--dsu-trans-accent', String(C.accent || '#ff7500'))
      var fill = document.createElement('div')
      fill.className = 'dsu-trans-fill'
      ov.appendChild(fill)
      /* glitch 额外两条 RGB 切片带（纯 CSS 装饰） */
      if (kind === 'glitch') {
        var ra = document.createElement('i'); ra.className = 'dsu-trans-rgb dsu-trans-rgb-a'
        var rb = document.createElement('i'); rb.className = 'dsu-trans-rgb dsu-trans-rgb-b'
        ov.appendChild(ra); ov.appendChild(rb)
      }
      var host = document.body || document.documentElement
      if (!host) return null
      host.appendChild(ov)
      transState.lastType = kind
      transState.lastDir = dir
      transState.overlays += 1
      return ov
    } catch (e) {
      try { if (ov && ov.parentNode) ov.parentNode.removeChild(ov) } catch (e2) { /* noop */ }
      return null
    }
  }

  function transDrop(ov) {
    if (!ov) return
    try { if (ov.parentNode) ov.parentNode.removeChild(ov) } catch (e) { /* noop */ }
    if (transOv === ov) transOv = null
    if (transState.overlays > 0) transState.overlays -= 1
  }

  /** 兜底清理：任何路径下都不允许覆盖层残留 */
  function transCleanup() {
    if (transOv) transDrop(transOv)
    transOv = null
    try {
      var list = document.querySelectorAll('.dsu-trans-overlay')
      for (var i = list.length - 1; i >= 0; i--) {
        if (list[i] && list[i].parentNode) list[i].parentNode.removeChild(list[i])
      }
    } catch (e) { /* noop */ }
    transState.overlays = 0
  }

  /** 第一幕入场：非阻塞播一次「从盖满到揭开」，第一幕在下面照常开始 */
  function transPlayIn(kind) {
    try {
      if (!transActive(kind)) return
      var ov = transMount(kind, 'reveal')
      if (!ov) return
      if (transOv && transOv !== ov) transDrop(transOv)
      transOv = ov
      wait(transHalfMs()).then(function () { transDrop(ov) })
    } catch (e) { try { transCleanup() } catch (e2) { /* noop */ } }
  }

  /** 盖住：resolve true = 已盖满可换场；false = 被 skip/finish 取消 */
  function transPlayCover(kind) {
    if (!transActive(kind)) return Promise.resolve(true)
    var myRun = runSeq
    try {
      var ov = transMount(kind, 'cover')
      if (!ov) return Promise.resolve(true)
      if (transOv && transOv !== ov) transDrop(transOv)
      transOv = ov
      return wait(transHalfMs()).then(function () {
        if (myRun !== runSeq || finished || skipped) return false
        return true
      })
    } catch (e) {
      try { transCleanup() } catch (e2) { /* noop */ }
      return Promise.resolve(true)
    }
  }

  /** 揭开：当前覆盖层从盖满播到透明并移除 */
  function transPlayReveal() {
    var ov = transOv
    if (!ov) return Promise.resolve()
    try {
      ov.setAttribute('data-phase', 'reveal')
      ov.style.setProperty('--dsu-trans-dur', transHalfMs() + 'ms')
    } catch (e) { transDrop(ov); return Promise.resolve() }
    return wait(transHalfMs()).then(function () { transDrop(ov) })
  }

  /** 退场：盖住 → 执行原 finish（收尾/卸根）→ 揭开。默认/硬切直接走原路。 */
  function transOut(kind, finishFn) {
    if (!transActive(kind)) {
      try { return Promise.resolve(finishFn()) } catch (e) { return Promise.resolve() }
    }
    return transPlayCover(kind).then(function (covered) {
      if (!covered) {
        try { return finishFn() } catch (e2) { return undefined }
      }
      transPreserve = true
      try { finishFn() } catch (e3) { /* 收尾失败也要揭开，绝不黑屏 */ }
      finally { transPreserve = false }
      return transPlayReveal()
    }).catch(function () {
      try { transCleanup() } catch (e4) { /* noop */ }
      try { return finishFn() } catch (e5) { return undefined }
    }).then(function () {
      /* 兜底：万一 reveal 的等待没走完（暂停/异常），到点强制清层 */
      try {
        setTimeout(function () { if (transOv) { try { transCleanup() } catch (e6) { /* noop */ } } },
          ms(transMsValue()) + 2600)
      } catch (e7) { /* noop */ }
    })
  }

  function setProgress(p) {
    var pct = Math.max(0, Math.min(1, p))
    ui.bar.style.width = Math.round(pct * 100) + '%'
  }

  /** 六格阶段柱：走过的压暗、当前的拉满并点亮主题橙 */
  function setSlats(active) {
    var items = ui.slats.children
    for (var i = 0; i < items.length; i++) {
      var idx = i + 1
      items[i].classList.toggle('dsu-on', idx === active)
      items[i].classList.toggle('dsu-past', idx < active)
    }
  }

  /** 扫描线自上而下扫一遍（底板洗白后一次，验准时再一次） */
  function sweep() {
    if (!ui.scanline) return
    ui.scanline.classList.remove('dsu-go')
    void ui.scanline.offsetWidth
    ui.scanline.classList.add('dsu-go')
  }

  function paintClock() {
    var d = new Date()
    var pad = function (n) { return (n < 10 ? '0' : '') + n }
    ui.meta2.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
  }

  function setSubtitle(zh, en) {
    ui.subZh.classList.remove('dsu-in')
    ui.subEn2.classList.remove('dsu-in')
    setTimeout(function () {
      ui.subZh.textContent = zh || ''
      ui.subEn2.textContent = en || ''
      ui.subZh.classList.add('dsu-in')
      if (en) ui.subEn2.classList.add('dsu-in')
    }, ms(140))
  }

  function setStepCount(i, code) {
    var totalSteps = STEPS.length + 1
    ui.stepcount.textContent = '[ ' + String(i).padStart(2, '0') + ' / ' +
      String(totalSteps).padStart(2, '0') + ' ] ' + code
  }

  function startHex() {
    var lines = 12
    function line() {
      var s = ''
      for (var i = 0; i < 26; i++) {
        s += '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16))
        if (i % 2 === 1) s += ' '
      }
      return s
    }
    function paint() {
      var out = []
      for (var i = 0; i < lines; i++) out.push(line())
      ui.hex.innerHTML = out.join('<br>')
    }
    paint()
    ui.hex.classList.add('dsu-in')
    audio.tickRun()
    hexTimer = setInterval(paint, 110)
  }
  function stopHex() {
    if (hexTimer) { clearInterval(hexTimer); hexTimer = null }
    ui.hex.classList.remove('dsu-in')
  }

  /* ── 声音 ──────────────────────────────────────────────────────────────
   * 两条独立的通道，都不依赖任何音频文件：
   *   audio —— 界面音效，WebAudio 现场合成（咔哒 / 双音确认 / 噪声扫频 / 和声钟）
   *   voice —— 女声播报，Web Speech API 念每一行的英文（照参考片的女声节奏：
   *            7.3-9.3s 念状态行、19.6-21.2s 念 PERMISSION AUTHORIZED）
   * 浏览器策略要求"先有用户手势"，所以第一次点击/按键会补一次解锁 + 补播。 */
  function clamp01(v, lo, hi) {
    var n = Number(v)
    return isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo
  }

  var audio = (function () {
    var ctx = null
    function ac(force) {
      /* 语音素材要独立于「界面音效」开关：force=true 时无视 C.sound */
      if (!C.sound && !force) return null
      try {
        var AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return null
        if (!ctx) ctx = new AC()
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') ctx.resume()
        return ctx
      } catch (e) { return null }
    }
    function vol(gain) { return Math.max(0.0002, (gain == null ? 0.05 : gain) * clamp01(C.soundVolume, 0, 1) * 2) }
    function tone(freq, dur, type, gain, delay, glideTo) {
      var c = ac(); if (!c) return
      try {
        var t0 = c.currentTime + (delay || 0)
        var o = c.createOscillator(), g = c.createGain()
        o.type = type || 'sine'
        o.frequency.setValueAtTime(freq, t0)
        if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur)
        g.gain.setValueAtTime(0.0001, t0)
        g.gain.exponentialRampToValueAtTime(vol(gain), t0 + Math.min(0.02, dur * 0.3))
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
        o.connect(g); g.connect(c.destination)
        o.start(t0); o.stop(t0 + dur + 0.03)
      } catch (e) { /* 静默降级 */ }
    }
    function noise(dur, gain) {
      var c = ac(); if (!c) return
      try {
        var n = Math.floor(c.sampleRate * dur)
        var buf = c.createBuffer(1, n, c.sampleRate)
        var d = buf.getChannelData(0)
        for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n)
        var src = c.createBufferSource(); src.buffer = buf
        var f = c.createBiquadFilter(); f.type = 'bandpass'
        f.frequency.value = 1500; f.Q.value = 0.6
        var g = c.createGain(); g.gain.value = vol(gain)
        src.connect(f); f.connect(g); g.connect(c.destination)
        src.start()
      } catch (e) { /* 静默降级 */ }
    }
    /* 从 /dsh-startup/asset/ 拉真素材（用户音频里抠出来的"哒"）并解码缓存；
       拿不到就自动回落到下面合成的音，功能不依赖网络/素材存在与否。 */
    var buffers = {}
    var fetching = {}
    function loadAsset(name) {
      if (C.sfx === 'synth') return
      if (buffers[name] || fetching[name]) return
      /* QISHI PATCH（附带）：file:// 下 fetch 本地文件必被同源策略拒掉，
         只会往控制台刷一串 CORS 报错。直接不试，音效走 tone() 现场合成。 */
      if (window.location && window.location.protocol === 'file:') return
      fetching[name] = true
      try {
        fetch(assetUrl(name))
          .then(function (r) { return r.ok ? r.arrayBuffer() : null })
          .then(function (ab) { return ab ? ac().decodeAudioData(ab) : null })
          .then(function (buf) { if (buf) buffers[name] = buf })
          .catch(function () { /* 没素材就走合成音 */ })
      } catch (e) { /* fetch 不存在也一样降级 */ }
    }
    /* 素材预加载：fetch + decodeAudioData 不需要用户手势，所以加载时就拉，
       这样第一步就能用真声，而不用等用户第一次点击。 */
    var pending = {}
    function ensureAsset(name) {
      if (buffers[name]) return Promise.resolve(true)
      if (pending[name]) return pending[name]
      /* ══ QISHI PATCH 6a · file:// 下别去 fetch 本地文件 ══════════════════
         同源策略会直接拒掉（控制台一串 CORS 报错），结果必然是 false。
         直接短路，交给 playAssetAndWait 的 <audio> 兜底。 */
      if (window.location && window.location.protocol === 'file:') return Promise.resolve(false)
      pending[name] = new Promise(function (resolve) {
        try {
          fetch(assetUrl(name))
            .then(function (r) { return r.ok ? r.arrayBuffer() : null })
            .then(function (ab) { if (!ab) return null; return ac(true).decodeAudioData(ab) })
            .then(function (buf) {
              if (buf) { buffers[name] = buf; resolve(true) } else { resolve(false) }
            })
            .catch(function () { resolve(false) })
        } catch (e) { resolve(false) }
      })
      return pending[name]
    }

    /* 配音效果预设：与模板编辑器里的 5 个音效同参数（AI 机械音/机器人/无线电/老电视/低沉）。
       素材先解码成 buffer，再在 BufferSource 后面串滤波 + 失真 + 环形调制，实时生效。 */
    var VOICE_FX_PRESETS = {
      'ai-mech': { hp: 130, lp: 4200, peak: { f: 260, g: 4, q: 1.0 }, drive: 0.15, ring: 0 },
      'robot': { hp: 180, lp: 3200, peak: { f: 1500, g: 3, q: 0.9 }, drive: 0.35, ring: 42 },
      'radio': { hp: 420, lp: 2800, peak: { f: 1800, g: 5, q: 1.2 }, drive: 0.6, ring: 0 },
      'oldtv': { hp: 220, lp: 2200, peak: null, drive: 0.45, ring: 0 },
      'dark': { hp: 90, lp: 1200, peak: { f: 180, g: 5, q: 0.8 }, drive: 0.1, ring: 0 }
    }
    function voiceDriveCurve(amount) {
      var k = Math.max(0, Math.min(1, Number(amount) || 0)) * 60
      var n = 1024, curve = new Float32Array(n)
      for (var i = 0; i < n; i++) {
        var x = (i * 2) / n - 1
        curve[i] = ((3 + k) * x * 20 * Math.PI / 180) / (Math.PI + k * Math.abs(x))
      }
      return curve
    }
    /** 播素材并等它播完，resolve 实际时长(ms)。fx 传 5 个效果之一；拿不到素材 resolve 0。 */
    function playAssetAndWait(name, gain, fx) {
      return new Promise(function (resolve) {
        var c = ac(true)
        var buf = buffers[name]
        if (!c || !buf) {
          /* ══ QISHI PATCH 6/6 · 双击打开（file://）时的台词兜底 ══════════
             file:// 页面不能 fetch 本地文件（同源策略），上面那条 fetch +
             decodeAudioData 的路拿不到 buffer，六句台词就整段静音。
             这里退回 <audio> 元素播同一个文件：媒体元素不受这条限制，
             双击 index.html 也能听见台词。fx 音效在这种情况下不叠加。 */
          if (!name || !/^(voice:[a-z]:)?line-[1-9]\d?$/.test(String(name))) { resolve(0); return }
          var url = ''
          try { url = assetUrl(name) } catch (eU) { url = '' }
          if (!url) { resolve(0); return }
          var a
          try { a = new Audio(url) } catch (eA) { resolve(0); return }
          var done = false
          function fin(ms) {
            if (done) return
            done = true
            resolve(ms)
          }
          try {
            a.volume = Math.min(1, (gain == null ? 0.85 : gain) * clamp01(C.voiceVolume, 0, 1) * 1.6)
          } catch (eV) { /* noop */ }
          a.addEventListener('ended', function () { fin(Math.round((a.duration || 0) * 1000)) })
          a.addEventListener('error', function () { fin(0) })
          var p = a.play()
          if (p && p.catch) p.catch(function () { fin(0) })
          /* 台词最长不到 6 秒；这里只是兜住「既不 ended 也不 error」的怪浏览器 */
          setTimeout(function () { fin(0) }, 8000)
          return
        }
        var osc = null
        try {
          var src = c.createBufferSource()
          src.buffer = buf
          var g = c.createGain()
          g.gain.value = Math.min(1, (gain == null ? 0.85 : gain) * clamp01(C.voiceVolume, 0, 1) * 1.6)
          var node = src
          var P = fx && VOICE_FX_PRESETS[fx]
          if (P) {
            if (P.hp) { var hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = P.hp; node.connect(hp); node = hp }
            if (P.lp) { var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = P.lp; node.connect(lp); node = lp }
            if (P.peak) { var pk = c.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = P.peak.f; pk.gain.value = P.peak.g; pk.Q.value = P.peak.q; node.connect(pk); node = pk }
            if (P.drive) { var ws = c.createWaveShaper(); ws.curve = voiceDriveCurve(P.drive); ws.oversample = '2x'; node.connect(ws); node = ws }
            if (P.ring) {
              var ringGain = c.createGain(); ringGain.gain.value = 0.55
              osc = c.createOscillator(); osc.frequency.value = P.ring; osc.type = 'sine'
              var modGain = c.createGain(); modGain.gain.value = 0.45
              osc.connect(modGain); modGain.connect(ringGain.gain)
              node.connect(ringGain); node = ringGain
            }
          }
          node.connect(g); g.connect(c.destination)
          src.onended = function () {
            if (osc) { try { osc.stop() } catch (eO) {}; try { osc.disconnect() } catch (eD) {} }
            resolve(Math.round(buf.duration * 1000))
          }
          src.start()
          if (osc) { try { osc.start() } catch (eS) {} }
        } catch (e) { resolve(0) }
      })
    }

    function playAsset(name, gain) {
      var c = ac(); if (!c) return false
      var buf = buffers[name]
      if (!buf) { loadAsset(name); return false }
      try {
        var src = c.createBufferSource()
        src.buffer = buf
        var g = c.createGain()
        g.gain.value = Math.min(1, (gain == null ? 0.55 : gain) * clamp01(C.soundVolume, 0, 1) * 2)
        src.connect(g); g.connect(c.destination)
        src.start()
        return true
      } catch (e) { return false }
    }

    /* ── 本地补丁：全局底噪床 ──────────────────────────────────────────
       6 幕是 6 个独立音频文件，幕间还有 240ms 过渡；底噪若只存在于文件里，
       留白与幕间就会"断信号"，安静环境下极易出戏。这里改为一条贯穿整段
       开机的循环底噪，揭幕时才停 —— 也就是影视混音里的"通道常开"。
       电平由预设②差分实测：白噪声 8.086e-3 + 120Hz 交流声 6.181e-3，
       并乘上与语音相同的增益，保证与人声同比例。 */
    var bedSrc = null, bedGain = null, bedLevel = 0, bedStartAt = 0, bedWanted = false
    /* 自动播放策略会让 AudioContext 一开始处于 suspended：这时候排进去的增益变化
       不会走，等上下文恢复（通常是用户第一次点击）时一次性生效 —— 听起来就是
       "底噪播到一半突然冒出来/断掉"。所以：上下文没跑起来就先等 statechange，
       等到真的 running 那一刻再从 0 淡入 0.3 秒，保证一听就是连续的一条。 */
    function bedStart() {
      try {
        /* 底噪改为用户可选：默认关闭，配置里 bedNoise=true 才铺 */
        var _bn = false
        try { _bn = cfg().bedNoise === true } catch (eN) { _bn = false }
        if (!_bn) return
        if (bedSrc) return
        bedWanted = true
        var c = ac(true); if (!c) return
        if (c.state === 'suspended') {
          var onState = function () {
            try { c.removeEventListener('statechange', onState) } catch (e0) {}
            if (!bedWanted || bedSrc) return
            if (c.state === 'running' || c.state === 'interrupted') startBed(c)
          }
          try { c.addEventListener('statechange', onState) } catch (e1) {}
          if (typeof c.resume === 'function') { try { c.resume() } catch (e2) {} }
          return
        }
        startBed(c)
      } catch (e) { /* 静默失败，绝不影响动画 */ }
    }
    function startBed(c) {
      try {
        if (bedSrc) return
        var len = Math.round(c.sampleRate * 2)
        var buf = c.createBuffer(1, len, c.sampleRate)
        var d = buf.getChannelData(0)
        for (var i = 0; i < len; i++) {
          /* 底噪床 v4：再 ×0.7（累计 -15dB）；交流声同步 ×0.7（累计 -19.5dB） */
          d[i] = (Math.random() * 2 - 1) * 0.001415 + Math.sin(2 * Math.PI * 120 * i / c.sampleRate) * 0.000649
        }
        bedGain = c.createGain()
        /* 底噪床 v4：改回「线性」淡入。
           v3 的指数淡入方向搞反了 —— 从 5e-5 指数爬升时，前 2.9 秒都在听阈以下，
           最后 0.1 秒才窜到目标值，听起来反而"突然出现"。
           淡入要线性/S 曲线；指数只适合淡出。 */
        var bedTarget = Math.min(1, 0.85 * clamp01(C.voiceVolume, 0, 1) * 1.6)
        var bedT0 = c.currentTime
        bedLevel = bedTarget
        bedStartAt = bedT0
        bedGain.gain.setValueAtTime(0, bedT0)
        /* 0.3 秒淡入就够了：它要的是「从第一帧就一直在」，不是慢慢出现 */
        bedGain.gain.linearRampToValueAtTime(bedTarget, bedT0 + 0.3)
        bedSrc = c.createBufferSource()
        bedSrc.buffer = buf
        bedSrc.loop = true
        bedSrc.connect(bedGain); bedGain.connect(c.destination)
        bedSrc.start()
      } catch (e) { /* 静默失败，绝不影响动画 */ }
    }
    function bedStop() {
      bedWanted = false
      try {
        if (bedSrc && bedGain) {
          var c = ac()
          var s = bedSrc
          if (c) {
            var t = c.currentTime
            /* 底噪床 v4：线性淡出，并修复起步值。
               不能用 gain.value 取"当前"增益 —— Web Audio 的 .value 返回最后一次
               设定值（即淡入起点的 0），不是插值结果，所以 v2/v3 的淡出实际是从 ~0
               淡到 0，等于瞬间静音。这里按线性公式自己算当前值。 */
            var g = bedGain.gain
            var elapsed = t - bedStartAt
            var cur = bedLevel * Math.max(0, Math.min(1, elapsed / 0.3))
            try { g.cancelScheduledValues(t) } catch (e3) {}
            g.setValueAtTime(cur, t)
            g.linearRampToValueAtTime(0, t + 2)
            setTimeout(function () { try { s.stop(); s.disconnect() } catch (e2) {} }, 2200)
          } else { s.stop() }
        }
      } catch (e) {}
      bedSrc = null
      try { if (bedGain) { bedGain.disconnect(); bedGain = null } } catch (e) {}
    }

    return {
      bedStart: bedStart,
      bedStop: bedStop,
      resume: function () { ac(); loadAsset('sfx-tick'); loadAsset('sfx-ticks-run') },
      preload: function () { loadAsset('sfx-tick'); loadAsset('sfx-ticks-run') },
      ensureAsset: ensureAsset,
      playAssetAndWait: playAssetAndWait,
      ctx: ac,
      decodeBuffer: function (ab) {
        var c = ac()
        return new Promise(function (resolve, reject) {
          if (!c) { reject(new Error('no audio context')); return }
          try {
            var p = c.decodeAudioData(ab, resolve, reject)
            if (p && typeof p.then === 'function') p.then(resolve, reject)
          } catch (e) { reject(e) }
        })
      },
      /* 文字渐显 / 阶段推进 / 按钮确认 —— 优先用真素材 */
      tick: function () { if (!playAsset('sfx-tick', 0.45)) tone(1760, 0.035, 'square', 0.022) },
      confirm: function () { if (!playAsset('sfx-tick', 0.85)) { tone(660, 0.09, 'triangle', 0.07); tone(990, 0.17, 'triangle', 0.055, 0.085) } },
      tickRun: function () { playAsset('sfx-ticks-run', 0.5) },
      step: function () { if (!playAsset('sfx-tick', 0.6)) { tone(880, 0.05, 'sine', 0.05); tone(1320, 0.07, 'sine', 0.028, 0.045) } },
      hover: function () { tone(2200, 0.02, 'sine', 0.018) },
      confirm: function () { tone(660, 0.09, 'triangle', 0.07); tone(990, 0.17, 'triangle', 0.055, 0.085) },
      sweep: function () { noise(0.75, 0.035) },
      /* 念台词之前的两声轻提示：这一笔让 TTS 从"浏览器念字"变成"系统播报" */
      cue: function () { tone(1046.5, 0.05, 'sine', 0.028); tone(1568, 0.06, 'sine', 0.02, 0.075) },
      rise: function () { tone(220, 1.1, 'sine', 0.032, 0, 990) },
      chime: function () {
        tone(659.25, 0.9, 'sine', 0.055)
        tone(830.61, 0.9, 'sine', 0.04, 0.09)
        tone(987.77, 1.3, 'sine', 0.045, 0.18)
      }
    }
  })()

  var voice = (function () {
    var supported = typeof window !== 'undefined' && !!window.speechSynthesis &&
      typeof window.SpeechSynthesisUtterance === 'function'
    var voices = []
    var picked = { en: null, zh: null }
    var meter = null
    var saidOnce = false
    var pending = { en: '', zh: '' }

    /* 想让它听起来像"AI 播报"，音色本身比什么都重要。
       同一台机器上，"Microsoft Zira Desktop" 是上世纪拼接合成，念长句塑料味很重；
       Edge 的 "... Online (Natural)"、Chrome 的 "Google ..."、macOS 的 Siri 才是神经网络音色。
       所以这里按分数挑，而不是挨个名字第一个命中。 */
    var NATURAL_HINTS = ['natural', 'neural', 'online', 'premium', 'enhanced', 'siri', 'google']
    var FEMALE_HINTS = [
      'aria', 'jenny', 'michelle', 'emma', 'ava', 'libby', 'sonia', 'maisie',
      'zira', 'samantha', 'karen', 'moira', 'tessa', 'victoria', 'serena', 'allison',
      'susan', 'fiona', 'hazel', 'female', 'woman',
      'xiaoxiao', 'xiaoyi', 'xiaomo', 'huihui', 'yaoyao', '晓晓', '晓伊', '女声'
    ]
    var MALE_HINTS = ['david', 'mark', 'guy', 'ryan', 'george', 'daniel', 'alex', 'fred',
      'male', 'yunxi', 'yunjian', 'kangkang']

    /** 给一个音色打分：神经网络 > 女声 > 语种吻合 > 本地 */
    function score(v, want) {
      var name = String(v.name || '').toLowerCase()
      var lang = String(v.lang || '').toLowerCase()
      var sc = 0
      for (var i = 0; i < NATURAL_HINTS.length; i++) {
        if (name.indexOf(NATURAL_HINTS[i]) !== -1) { sc += 60; break }
      }
      for (var j = 0; j < FEMALE_HINTS.length; j++) {
        if (name.indexOf(FEMALE_HINTS[j]) !== -1) { sc += 40; break }
      }
      for (var k = 0; k < MALE_HINTS.length; k++) {
        if (name.indexOf(MALE_HINTS[k]) !== -1) { sc -= 45; break }
      }
      if (lang.indexOf(want) === 0) sc += 25
      if (v.localService) sc += 4          /* 本地音色起播快，不会先卡半秒 */
      if (v.default) sc += 3
      return sc
    }

    /** 挑某语种最合适的一个音色（want 传 'en' / 'zh' 这样的两字母前缀） */
    function bestFor(want) {
      if (!voices.length) return null
      if (C.voiceName) {
        for (var i = 0; i < voices.length; i++) {
          var v = voices[i]
          if (v.name === C.voiceName && String(v.lang || '').toLowerCase().indexOf(want) === 0) return v
        }
      }
      var pool = []
      for (var j = 0; j < voices.length; j++) {
        if (String(voices[j].lang || '').toLowerCase().indexOf(want) === 0) pool.push(voices[j])
      }
      if (!pool.length) pool = voices.slice()
      var best = null
      var bs = -1e9
      for (var n = 0; n < pool.length; n++) {
        var sc = score(pool[n], want)
        if (sc > bs) { bs = sc; best = pool[n] }
      }
      return best
    }

    function setMeter(on) { if (meter) meter.classList.toggle('dsu-on', !!on) }

    function load() {
      if (!supported) return
      try { voices = window.speechSynthesis.getVoices() || [] } catch (e) { voices = [] }
      picked.en = bestFor('en')
      picked.zh = bestFor('zh')
    }

    /** 全大写名字有些引擎会一个字母一个字母念，转成 Title Case 更像在叫名字 */
    function spokenName(name) {
      return String(name || '').replace(/\S+/g, function (w) {
        return (/^[A-Z0-9.\-]+$/.test(w) && w.length > 1) ? w.charAt(0) + w.slice(1).toLowerCase() : w
      })
    }

    function utter(text, lang) {
      try {
        var u = new window.SpeechSynthesisUtterance(text)
        var v = lang.indexOf('zh') === 0 ? picked.zh : picked.en
        if (v) { u.voice = v; u.lang = v.lang || lang } else u.lang = lang
        /* 神经网络音色在 .95 / 1.02 这个档位最像"系统在播报"：
           再快就赶，再慢就假；音调略抬一点显得干净利落 */
        u.rate = clamp01(C.voiceRate, 0.5, 2)
        u.pitch = clamp01(C.voicePitch, 0, 2)
        u.volume = clamp01(C.voiceVolume, 0, 1)
        u.onstart = function () { setMeter(true) }
        u.onend = function () { setMeter(false) }
        u.onerror = function () { setMeter(false) }
        window.speechSynthesis.speak(u)
        return true
      } catch (e) { return false }
    }

    /** 一句话的时长估算（个别引擎不触发 onend 时兜底；中文按字、英文按字符） */
    function estimateMs(items) {
      var chars = 0
      var rate = clamp01(C.voiceRate, 0.5, 2) || 1
      for (var i = 0; i < items.length; i++) {
        var t = String(items[i].t || '')
        chars += /[\u4e00-\u9fa5]/.test(t) ? t.length * 1.7 : t.length
      }
      return Math.round((chars / 13) * 1000 / rate) + 460
    }

    function buildUtter(text, lang) {
      var u = new window.SpeechSynthesisUtterance(text)
      var v = lang.indexOf('zh') === 0 ? picked.zh : picked.en
      if (v) { u.voice = v; u.lang = v.lang || lang } else u.lang = lang
      u.rate = clamp01(C.voiceRate, 0.5, 2)
      u.pitch = clamp01(C.voicePitch, 0, 2)
      u.volume = clamp01(C.voiceVolume, 0, 1)
      return u
    }

    return {
      supported: supported,
      load: load,
      attach: function (node) { meter = node },

      /**
       * 念一行，返回"这一行实际花了多久(ms)"的 Promise。
       *
       * 三个关键决定：
       *  - **不 cancel 上一句**。原来每步都 cancel，用户点快一点、或者
       *    hold 短于台词长度，语音就被硬生生掐断 —— 那正是要避免的。
       *    speechSynthesis 本身是队列，不 cancel 就是顺序播报。
       *  - 提示音响过之后留 `voiceLead` 的空白再开口，这是旁白的呼吸感。
       *  - 等 `onend` 才 resolve，动画据此决定这一步停多久；个别引擎不触发
       *    onend 时按估算兜底，绝不把动画卡死。
       */
      line: function (en, zh, asset) {
        /* v2.13.16：旧 TTS 配音链路退役。这里只用「音色包 + 声音效果」两段：
           音色包决定用哪套干音（a–k）；效果在运行时叠加。
           素材缺失时静音，不再回落系统 TTS，避免旧机械音盖掉新音色。 */
        if (!asset || !C.voice || finished) return Promise.resolve(0)
        var useAsset = asset
        var tplAssets = (TEMPLATE && TEMPLATE.assets) || null
        var isGlobalLine = /^line-[1-9]\d?$/.test(asset) && !(tplAssets && tplAssets[asset])
        if (isGlobalLine) {
          var pack = String(C.voicePack || 'a')
          if (/^[a-k]$/.test(pack)) useAsset = 'voice:' + pack + ':' + asset
        }
        var fx = String(C.voiceFx || 'none')
        return audio.ensureAsset(useAsset).then(function (ok) {
          /* ══ QISHI PATCH 6b · 解码失败也要把台词念出来 ══════════════════
             file:// 下 ensureAsset 必然 false（见 6a）。上游在这里直接 return 0，
             整句就没了。改成继续走 playAssetAndWait —— 那边拿不到 buffer 时
             会退回 <audio> 元素播放同一个文件。 */
          if (finished) return 0
          if (!ok) return audio.playAssetAndWait(useAsset, 0.85, 'none')
          if (C.voiceCue !== false) audio.cue()
          if (isGlobalLine) bgm.duck(true)
          return audio.playAssetAndWait(useAsset, 0.85, isGlobalLine ? fx : 'none').then(function (ms) {
            if (isGlobalLine) bgm.duck(false)
            if (ms > 0) setMeter(true)
            return ms
          })
        })
      },
      /** TTS 路径：素材缺失 / voiceSource=tts / 终幕那条动态名字 */
      tts: function (en, zh) { return ttsLine(en, zh) },

      /** 不等待的版本：设置页试听 / 任何"念完就行"的场合 */
      say: function (en, zh) { return ttsLine(en, zh) },

      /** 浏览器要求"先有用户手势"才放声：第一次点击/按键解锁 + 补播当前行 */
      unlock: function () {
        try { if (supported) window.speechSynthesis.resume() } catch (e) {}
        audio.resume()
        /* 预热：先无声念一个空格，把引擎唤醒，避免第一句被吃掉开头半个字 */
        if (supported && !saidOnce) {
          try {
            var w = new window.SpeechSynthesisUtterance(' ')
            w.volume = 0
            var v = picked.en || picked.zh
            if (v) { w.voice = v; w.lang = v.lang }
            window.speechSynthesis.speak(w)
          } catch (e) { /* noop */ }
        }
        if (!saidOnce && C.voice && (pending.en || pending.zh)) this.say(pending.en, pending.zh)
      },
      speakName: spokenName,
      current: function () {
        var a = picked.en ? picked.en.name : ''
        var b = picked.zh ? picked.zh.name : ''
        return a === b ? a : (a + (b ? '  /  ' + b : ''))
      },
      listVoices: function () { return voices.slice() },
      /** 只有这里才真的掐断语音（跳过 / 揭幕） */
      stop: function () { try { if (supported) window.speechSynthesis.cancel() } catch (e) {} setMeter(false) }
    }

    /** TTS 合成并等它念完，resolve 实际时长(ms)；拿不到引擎时 resolve 0。 */
    function ttsLine(en, zh) {
      return new Promise(function (resolve) {
        if (!supported || !C.voice || finished) { resolve(0); return }
        pending = { en: en || '', zh: zh || '' }
        var items = []
        var mode = C.voiceLang
        if (mode === 'zh') { if (zh) items.push({ t: zh, l: 'zh-CN' }) }
        else if (mode === 'both') {
          if (zh) items.push({ t: zh, l: 'zh-CN' })
          if (en) items.push({ t: en, l: 'en-US' })
        } else if (en) { items.push({ t: en, l: 'en-US' }) }
        if (!items.length) { resolve(0); return }

        saidOnce = true
        if (C.voiceCue !== false) audio.cue()

        var startedAt = Date.now()
        var est = estimateMs(items)
        var lead = clamp01(C.voiceLead, 0, 1200)
        var settled = false
        var watchdog = null

        function settle() {
          if (settled) return
          settled = true
          if (watchdog) clearTimeout(watchdog)
          setMeter(false)
          resolve(Math.max(0, Date.now() - startedAt))
        }

        setTimeout(function () {
          if (finished) { settle(); return }
          var last = items.length - 1
          for (var i = 0; i <= last; i++) {
            var u = buildUtter(items[i].t, items[i].l)
            if (i === last) {
              u.onstart = function () { setMeter(true) }
              u.onend = settle
              u.onerror = settle
            }
            try { window.speechSynthesis.speak(u) } catch (e) { if (i === last) settle() }
          }
          watchdog = setTimeout(settle, est + 900)
        }, lead)
      })
    }
  })()

  /* 语音/音效接线：声卡要等用户手势才能出声，这里挂一次性解锁 */
  voice.attach(q('.dsu-voice'))
  ;(function preloadVoices() {
    if (C.voiceSource === 'tts') return
    for (var i = 0; i < STEPS.length; i++) if (STEPS[i].audio) audio.ensureAsset(STEPS[i].audio)
    audio.ensureAsset('line-6')   /* 终幕欢迎语 */
  })()
  ;(function wireSound() {
    voice.load()
    if (voice.supported && typeof window.speechSynthesis.addEventListener === 'function') {
      try { window.speechSynthesis.addEventListener('voiceschanged', function () { voice.load() }) } catch (e) {}
    }
    var unlocked = false
    function unlock() {
      if (unlocked) return
      unlocked = true
      voice.unlock()
      document.removeEventListener('pointerdown', unlock, true)
      document.removeEventListener('keydown', unlock, true)
      document.removeEventListener('touchstart', unlock, true)
    }
    document.addEventListener('pointerdown', unlock, true)
    document.addEventListener('keydown', unlock, true)
    document.addEventListener('touchstart', unlock, true)
  })()

  /* ── 时间线 ───────────────────────────────────────────────────────────── */
  /* 模板编辑器的预览要能从任意一幕开始（或者只播一幕）——
     宿主会注入 __DSH_STARTUP_JUMP__ = { start, count }，这里直接跳过开场直接进那一幕。 */
  var JUMP = (window.__DSH_STARTUP_JUMP__ && typeof window.__DSH_STARTUP_JUMP__ === 'object') ? window.__DSH_STARTUP_JUMP__ : null

  /** 把画面直接切到「档案底板已就位」的状态（跳过开场四段）。 */
  function jumpToStage() {
    try {
      ui.black.style.transition = 'opacity ' + ms(160) + 'ms linear'
      ui.black.style.opacity = '0'
      ui.plate.style.opacity = '1'
      ui.watermark.style.opacity = '1'
      ui.brand.classList.add('dsu-in')
      ui.foot.classList.add('dsu-in')
      ui.stepcount.classList.add('dsu-in')
      ui.idline.classList.add('dsu-in')
      ui.frame.classList.add('dsu-in')
      ui.slats.classList.add('dsu-in')
      ui.meta.classList.add('dsu-in')
      ui.vignette.classList.add('dsu-in')
      ui.voice.classList.add('dsu-in')
      if (C.allowSkip) ui.skip.classList.add('dsu-in')
      ui.black.style.display = 'none'
      sweep()
    } catch (e) { /* 跳转失败就按正常开场走 */ }
    return wait(160)
  }

  var runStarted = false
  /* ── v2.14.0 用户自备 BGM ───────────────────────────────────────
     只播放用户本机导入的音乐（宿主 /dsh-startup/music/file 提供）。
     三段：第一幕(loop) → 第二幕(可换曲) → 结束淡出；两段之间交叉叠化。
     任何异常都静默失败，绝不阻塞开机动画。 */
  var bgm = (function () {
    var ACTIVE = false
    var SECOND = false
    var cur = null          /* { src, gain, name, which } */
    var baseVol = 0
    var buffered = {}
    var ducked = false

    function num(v, d) { var n = Number(v); return isFinite(n) ? n : d }
    function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)) }
    function ctxNow() { var c = audio.ctx(); return c ? c.currentTime : 0 }

    function segOf(which) {
      var bpm = clamp(num(C.bgmBpm, 100), 40, 220)
      var beats = which === 1 ? clamp(Math.round(num(C.bgmBeats1, 16)), 4, 128) : clamp(Math.round(num(C.bgmBeats2, 32)), 4, 128)
      return {
        start: Math.max(0, num(which === 1 ? C.bgm1Start : C.bgm2Start, 0)),
        dur: beats * 60 / bpm,
        fadeIn: clamp(num(which === 1 ? C.bgm1FadeIn : C.bgm2FadeIn, 1), 0, 10),
        fadeOut: clamp(num(which === 1 ? C.bgm1FadeOut : C.bgm2FadeOut, 1), 0, 10),
        loop: which === 2 ? (C.bgmLoop !== false && C.bgm2Loop === true) : (C.bgmLoop !== false)
      }
    }

    function load(name) {
      if (!name) return Promise.resolve(null)
      if (buffered[name]) return Promise.resolve(buffered[name])
      return fetch('/dsh-startup/music/file?name=' + encodeURIComponent(name), { cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error('bgm http ' + r.status); return r.arrayBuffer() })
        .then(function (ab) { return audio.decodeBuffer(ab) })
        .then(function (buf) { if (buf) buffered[name] = buf; return buf })
        .catch(function () { return null })
    }

    function kill(fadeSec) {
      var old = cur
      cur = null
      if (!old) return
      try {
        var c = audio.ctx()
        var t = c ? c.currentTime : 0
        var g = old.gain.gain
        try {
          var v = g.value
          g.cancelScheduledValues(t)
          g.setValueAtTime(v, t)
          g.linearRampToValueAtTime(0, t + Math.max(0.05, fadeSec))
        } catch (e) {}
        var src = old.src
        var waitMs = Math.round(Math.max(0.05, fadeSec) * 1000) + 80
        setTimeout(function () { try { src.stop(); src.disconnect() } catch (e2) {} }, waitMs)
        setTimeout(function () { try { old.gain.disconnect() } catch (e3) {} }, waitMs + 50)
      } catch (e) {}
    }

    function startSeg(which, name) {
      return load(name).then(function (buf) {
        if (!ACTIVE || !buf) return
        var c = audio.ctx()
        if (!c) return
        var seg = segOf(which)
        var loop = seg.loop
        var dur = loop ? Math.min(buf.duration, Math.max(0.05, seg.dur)) : Math.max(0.05, buf.duration - seg.start)
        var src = c.createBufferSource()
        src.buffer = buf
        src.loop = loop
        var loopEnd = Math.min(buf.duration, seg.start + dur)
        if (seg.start >= buf.duration - 0.05) seg.start = 0
        src.loopStart = Math.max(0, Math.min(seg.start, buf.duration - 0.05))
        src.loopEnd = Math.max(src.loopStart + 0.05, loopEnd)
        var gain = c.createGain()
        gain.gain.value = 0
        src.connect(gain)
        gain.connect(c.destination)
        var t = c.currentTime
        var level = baseVol
        if (ducked && C.bgmDuck !== false) level = baseVol * 0.35
        var fi = Math.max(0.02, seg.fadeIn)
        try {
          gain.gain.setValueAtTime(0, t)
          gain.gain.linearRampToValueAtTime(level, t + fi)
        } catch (e) {}
        try { src.start(t, seg.start) } catch (e) { try { src.start() } catch (e2) { return } }
        cur = { src: src, gain: gain, name: name, which: which }
      })
    }

    function begin() {
      if (C.bgmEnabled !== true) { diagRun('bgm off'); return }
      if (!C.bgmFile) { diagRun('bgm no file'); return }
      ACTIVE = true
      SECOND = false
      ducked = false
      baseVol = clamp(num(C.bgmVolume, 0.5), 0, 1)
      try { audio.ctx() } catch (e) {}
      diagRun('bgm start file=' + C.bgmFile)
      startSeg(1, String(C.bgmFile))
      /* 预载第二段，换曲时无空档 */
      var name2 = String(C.bgmFile2 || C.bgmFile)
      if (name2) load(name2)
    }

    return {
      start: function () { if (ACTIVE) return; begin() },
      /* v2.15.10：iframe 模板掉线彩蛋——弹出时截断，重连后重播 */
      restart: function () { if (ACTIVE) return; begin() },
      cut: function () { if (!ACTIVE) return; ACTIVE = false; diagRun('bgm cut'); kill(0.12) },
      toSecond: function () {
        if (!ACTIVE || SECOND) return
        SECOND = true
        var name = String(C.bgmFile2 || C.bgmFile || '')
        if (!name) return
        var cross = clamp(num(C.bgmCrossfade, 1200), 0, 5000) / 1000
        diagRun('bgm to second file=' + name)
        startSeg(2, name)
        kill(cross > 0 ? cross : 0.12)
      },
      stop: function () {
        if (!ACTIVE) return
        ACTIVE = false
        diagRun('bgm stop')
        var out = clamp(num(C.bgm2FadeOut, 2), 0, 10)
        kill(out > 0 ? out : 0.15)
      },
      duck: function (on) {
        if (!ACTIVE || !cur || C.bgmDuck === false) return
        ducked = !!on
        var c = audio.ctx()
        if (!c) return
        var t = c.currentTime
        var target = on ? baseVol * 0.35 : baseVol
        try {
          cur.gain.gain.cancelScheduledValues(t)
          cur.gain.gain.setTargetAtTime(target, t, on ? 0.12 : 0.25)
        } catch (e) {}
      }
    }
  })()

  /* v2.15.0：iframe 启动模板（如 division-bigfish-codex）。
     整屏 iframe 自己演、自己判定彩蛋；宿主只负责挂载/收尾。
     - 完成：iframe postMessage {type:'dsh-startup-done'} 或 window 'dsh-startup-done' 事件
     - 跳过：postMessage skip / Esc / 设置页「立即预览」的跳过 API
     - 同源时顺手把作者编辑器侧栏藏掉，只留动画舞台。 */
  var iframeCleanup = null

  function runIframeTemplate(tpl, afterIframe) {
    diagRun('iframe template ' + tpl.id)
    var entry = String(tpl.entry || 'index.html').replace(/^\/+/, '')
    /* F-03：先向已认证的宿主申请一次性能力 token，再决定 iframe 地址。
       - 用户目录里的模板（untrusted）→ sandbox（无 allow-same-origin），拿不到 DSH Cookie/同源数据
       - 插件自带模板（trusted）→ 不加 sandbox，保留原来的同源注入（样式/Esc/焦点）
       - token 申请失败时退回旧的 template-file 同源地址，避免插件故障时开机动画卡死 */
    var sessionP = fetch('/dsh-startup/frame-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tpl.id })
    }).then(function (r) { return r.json() }).catch(function () { return { ok: false } })
    return sessionP.then(function (ts) {
      var sandboxed = false
      var frameSrc = ''
      if (ts && ts.ok === true && ts.token) {
        sandboxed = ts.untrusted === true
        frameSrc = '/dsh-startup/template-frame/' + encodeURIComponent(ts.token) + '/' + entry + (C.bigfishForceEgg ? '?egg=1' : '')
      } else {
        /* F-04：能力会话失败时绝不能再退回“同源且无 sandbox”的旧地址——
           那会让用户模板拿到 DSH 同源权限。回退也强制 sandbox，宁可动画能力受限也不放行同源。 */
        diagRun('frame-session failed; fallback template-file (sandboxed)')
        sandboxed = true
        frameSrc = '/dsh-startup/template-file/' + encodeURIComponent(tpl.id) + '/' + entry + (C.bigfishForceEgg ? '?egg=1' : '')
      }
      var wrap = document.createElement('div')
      wrap.setAttribute('data-dsh-iframe-template', tpl.id)
      wrap.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#000;overflow:hidden'
      var frame = document.createElement('iframe')
      frame.setAttribute('allow', 'autoplay; fullscreen')
      frame.setAttribute('allowfullscreen', 'true')
      if (sandboxed) frame.setAttribute('sandbox', 'allow-scripts')
      frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#000;display:block'
      frame.style.visibility = 'hidden'
      frame.src = frameSrc
      wrap.appendChild(frame)
      document.body.appendChild(wrap)

      var settle = null
      var done = new Promise(function (resolve) { settle = resolve })
      function finishOnce() { if (settle) { var fn2 = settle; settle = null; fn2() } }
      function onMessage(e) {
        /* F-03：只接受来自本 iframe 的消息（sandbox 时 origin 为 "null"，只能靠 source 校验） */
        if (!e || e.source !== frame.contentWindow) return
        var d = e.data
        if (d && typeof d === 'object' && (d.type === 'dsh-startup-done' || d.type === 'dsh-startup-skip')) finishOnce()
        /* 第三方 sandbox 模板只允许结束/跳过，不允许控 BGM/配音（内置受信模板才可） */
        if (sandboxed) return
        if (d && typeof d === 'object' && d.type === 'dsh-startup-voice') bgm.duck(d.on === true)
        if (d && typeof d === 'object' && d.type === 'dsh-startup-bgm') { if (d.on === false) bgm.cut(); else bgm.restart() }
      }
      function onKey(e) {
        if (e.key === 'Escape') { finishOnce(); return }
        if (e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space') {
          e.preventDefault()
          try { frame.contentWindow.postMessage({ type: 'dsh-tip-next' }, '*') } catch (eTip) { /* noop */ }
        }
      }
      window.addEventListener('message', onMessage)
      window.addEventListener('dsh-startup-done', finishOnce)
      document.addEventListener('keydown', onKey, true)
      frame.addEventListener('load', function () {
        if (!sandboxed) {
          try {
            var doc = frame.contentDocument
            if (doc && doc.head) {
              var st = doc.createElement('style')
              st.textContent = 'html,body{overflow:hidden!important;background:#000!important}main{display:block!important}aside{display:none!important}#stage{width:100vw!important;height:100vh!important;display:grid!important;place-items:center!important}svg#scene{width:100vw!important;height:100vh!important;max-height:none!important}'
              doc.head.appendChild(st)
            }
          } catch (err) { /* 跨域就跳过 */ }
          try {
            var ew = frame.contentWindow
            if (ew) {
              try { ew.focus() } catch (eFocus) { /* noop */ }
              var doc2 = frame.contentDocument
              if (doc2) doc2.addEventListener('keydown', function (eKey) {
                if (eKey.key === 'Escape') {
                  try { ew.parent.postMessage({ type: 'dsh-startup-skip' }, '*') } catch (e9) { /* noop */ }
                }
              })
            }
          } catch (err2) { /* noop */ }
        }
        try { frame.style.visibility = 'visible' } catch (err) { /* noop */ }
      })
      setTimeout(function () { try { frame.style.visibility = 'visible' } catch (err) { /* noop */ } }, 2000)
      var safety = setTimeout(finishOnce, (Number(tpl.duration) > 0 ? Number(tpl.duration) * 1000 : 45000) + 90000)
      iframeCleanup = function () {
        clearTimeout(safety)
        window.removeEventListener('message', onMessage)
        window.removeEventListener('dsh-startup-done', finishOnce)
        document.removeEventListener('keydown', onKey, true)
        try { if (wrap.parentNode) wrap.parentNode.removeChild(wrap) } catch (err) { /* noop */ }
        finishOnce()
      }
      return done.then(function () {
        if (typeof afterIframe === 'function') return afterIframe()
        return transOut(transType('Out'), finish)
      })
    })
  }

  function run() {
    if (runStarted) { diagRun('run skipped (duplicate entry)'); return Promise.resolve() }
    runStarted = true
    if (TEMPLATE && TEMPLATE.engine === 'iframe' && TEMPLATE.id) {
      /* v2.15.8：iframe 模板也支持用户自备 BGM（父页面播，模板自己演） */
      try { bgm.start() } catch (eBgmIframe) { /* 静默失败，绝不阻塞启动 */ }
      /* v2.16.6：iframe 第一幕结束后接第二幕（此前直接 finish，配了第二幕也永远不播） */
      return runIframeTemplate(TEMPLATE, function () {
        if (iframeCleanup) { try { iframeCleanup() } catch (eCleanIframe) { /* noop */ } iframeCleanup = null }
        return playSecondTemplate()
          .then(function () { return secondTransitionDone ? finish() : transOut(transType('Out'), finish) })
      }).catch(function (errIframe) {
        try { console.warn('[dsh-startup-screen] iframe+第二幕异常，直接收尾：', errIframe) } catch (e2) {}
        return finish()
      })
    }
    diagRun('run enter timeline=' + (TIMELINE ? 'v2' : 'v1') + ' tpl=' + ((TEMPLATE && TEMPLATE.id) || '?') + ' tpl2=' + ((TEMPLATE2 && TEMPLATE2.id) || 'none'))
    audio.bedStart()   /* 本地补丁：开机即"开通道"，底噪一路铺到揭幕 */
    bgm.start()
    /* v2 时间线模板：不演档案开场，直接跑图层时序 */
    if (TIMELINE) {
      /* v2.12.0：第一幕入场转场（非默认类型才挂覆盖层，且非阻塞 —— 第一幕照跑） */
      transPlayIn(transType('In'))
      return runTimeline()
        .then(function () { return playSecondTemplate() })
        /* v2.12.0：第二幕→桌面退场转场（第二幕分支已自行处理退场时直接 finish） */
        .then(function () { return secondTransitionDone ? finish() : transOut(transType('Out'), finish) })
        .catch(function (err) {
          try { console.warn('[dsh-startup-screen] 时间线异常，直接收尾：', err) } catch (e2) {}
          return finish()
        })
    }
    if (JUMP && typeof JUMP.start === 'number' && JUMP.start >= 0) {
      return Promise.resolve()
        .then(jumpToStage)
        .then(function () { return stepLoop(JUMP.start, JUMP.count) })
        .then(function () {
          /* 只播 N 幕（编辑器「▶ 本幕」）时**停在那一幕上**，不接终幕 ——
             否则第 N 幕一完就跳去揭幕，看起来像「一下闪到最后一屏」。 */
          if (typeof JUMP.count === 'number' && JUMP.count > 0) return null
          return finale()
        })
        .catch(function (err) {
          try { console.warn('[dsh-startup-screen] 跳转播放异常，直接揭幕：', err) } catch (e2) {}
          return finish()
        })
    }
    /* v2.12.0：v1 分幕流程的第一幕入场转场（非默认类型才挂覆盖层，且非阻塞） */
    transPlayIn(transType('In'))
    return Promise.resolve()
      /* 第一幕：黑幕 --> DeepSeek 标识 */
      .then(function () { return wait(820) })
      .then(function () {
        ui.blackInner.classList.add('dsu-in')
        audio.rise()
        return wait(240)
      })
      .then(function () {
        ui.blackEn.classList.add('dsu-tighten')
        return wait(880)
      })
      .then(function () {
        ui.sweep.classList.add('dsu-go')
        return wait(760)
      })
      /* 过场：过曝洗白 */
      .then(function () {
        ui.blackInner.classList.add('dsu-out')
        if (C.openingSweep !== false) audio.sweep()
        ui.wash.style.transition = 'opacity ' + ms(220) + 'ms linear'
        ui.wash.style.opacity = '1'
        return wait(260)
      })
      .then(function () {
        ui.plate.style.transition = 'opacity ' + ms(900) + 'ms ease'
        ui.plate.style.opacity = '1'
        ui.watermark.style.transition = 'opacity ' + ms(1100) + 'ms ease'
        ui.watermark.style.opacity = '1'
        ui.wash.style.transition = 'opacity ' + ms(720) + 'ms cubic-bezier(.2,.9,.2,1)'
        ui.wash.style.opacity = '0'
        ui.black.style.transition = 'opacity ' + ms(720) + 'ms ease'
        ui.black.style.opacity = '0'
        return wait(760)
      })
      /* 第二幕：品牌块 / 页脚 / 进度条 */
      .then(function () {
        ui.brand.classList.add('dsu-in')
        ui.foot.classList.add('dsu-in')
        ui.stepcount.classList.add('dsu-in')
        ui.idline.classList.add('dsu-in')
        ui.frame.classList.add('dsu-in')
        ui.slats.classList.add('dsu-in')
        ui.meta.classList.add('dsu-in')
        ui.vignette.classList.add('dsu-in')
        ui.voice.classList.add('dsu-in')
        setProgress(0.12)
        setStepCount(0, 'BOOT')
        setSlats(0)
        setSubtitle('系统自检中…', 'SYSTEM SELF-CHECK')
        if (C.allowSkip) ui.skip.classList.add('dsu-in')
        return wait(700)
      })
      .then(function () { ui.black.style.display = 'none'; sweep() })
      /* 六个阶段 */
      .then(function () { return stepLoop() })
      .then(function () { diagRun('first act done') })
      /* 终幕：若配了 v2 时间线第二幕，先播第二幕再收尾（否则旧版只播第一幕） */
      .then(function () {
        var hasSecond = !!(TEMPLATE2 && Array.isArray(TEMPLATE2.layers) && TEMPLATE2.layers.length)
        if (!hasSecond) return finale()
        /* 先把第一幕的终幕完整播完，再切第二幕（否则看起来像第一幕被截断） */
        return finale(true, true)
          .then(function () {
            try {
              root.classList.remove('dsu-handoff')
              root.classList.remove('dsu-out-content')
              root.classList.remove('dsu-peak')
              root.style.opacity = ''
            } catch (eRoot) { /* noop */ }
            return wait(160)
          })
          .then(function () { return playSecondTemplate() })
          .then(function () { return finish() })
      })
      .catch(function (err) {
        try { console.warn('[dsh-startup-screen] 动画异常，直接揭幕：', err) } catch (e2) {}
        return finish()
      })
  }

  /* ══ 时间线（v2 模板：layers[] + 关键帧）═════════════════════════════════
     v1 是"分幕"，v2 是"图层 + 关键帧"。两者共存：模板里有 layers 就走这里，
     否则走原来的分幕流程。M1 只做渲染器，编辑器界面是 M2。 */
  var TL_MAX_LAYERS = 60
  var TL_MAX_KF = 64

  var EASES = {
    linear: function (t) { return t },
    inCubic: function (t) { return t * t * t },
    outCubic: function (t) { return 1 - Math.pow(1 - t, 3) },
    inOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 },
    outQuint: function (t) { return 1 - Math.pow(1 - t, 5) },
    outBack: function (t) {
      var c1 = 1.70158, c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }
  }

  function easeOf(name) { return EASES[name] || EASES.outCubic }

  /** 在一组关键帧上取某个属性在 t 时刻的值（线性/命名缓动插值）。 */
  function kfAt(kfs, t, prop, fallback) {
    if (!kfs || !kfs.length) return fallback
    var prev = null
    for (var i = 0; i < kfs.length; i++) {
      var kf = kfs[i]
      if (kf.t === undefined) continue
      if (t < kf.t) {
        if (!prev) return (kf[prop] !== undefined ? kf[prop] : fallback)
        var span = kf.t - prev.t
        var p = span > 0 ? (t - prev.t) / span : 1
        p = Math.max(0, Math.min(1, p))
        /* 缓动挂在**段起始帧**上：这一帧的 ease 决定它到下一帧怎么走。
           （之前取的是段尾帧，跟编辑器文案对不上，改了曲线看不出效果） */
        var e = easeOf((prev && prev.ease) || kf.ease)
        var a = prev[prop] !== undefined ? prev[prop] : fallback
        var b = kf[prop] !== undefined ? kf[prop] : a
        return a + (b - a) * e(p)
      }
      prev = kf
    }
    return prev && prev[prop] !== undefined ? prev[prop] : fallback
  }

  function tlNumber(v, fallback) {
    var n = Number(v)
    return isFinite(n) ? n : fallback
  }

  var tlUi = null

  /* ── 方块聚合：把形状采样成目标点，方块从随机位置收敛过去 ──────────
     shape 预设：earth（行星+环带）/ moon（月面+陨坑）/ dsh（文字）
     采样走离屏 canvas：画形状 → 读 alpha → 均匀取点。不加载任何图片。 */
  function shapePoints(shape, text, count) {
    var W = 320, H = 320
    var cv = document.createElement('canvas')
    cv.width = W; cv.height = H
    var g = cv.getContext('2d')
    if (!g) return []
    g.clearRect(0, 0, W, H)
    g.fillStyle = '#fff'
    var kind = String(shape || 'earth')
    if (kind === 'whale') {
      /* 官方鲸鱼标识：viewBox 0 0 50 50，Path2D 直接吃 SVG 路径数据 */
      try {
        var wp = new Path2D(BRAND_PATH)
        var ws = 4.6
        g.save(); g.translate(W / 2 - 25 * ws, H / 2 - 25 * ws); g.scale(ws, ws); g.fill(wp, 'evenodd'); g.restore()
      } catch (e) { /* 浏览器不支持 Path2D 时退回文字 */
        g.font = 'bold 96px Consolas, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'
        g.fillText('DSH', W / 2, H / 2)
      }
    } else if (kind === 'dsh') {
      g.font = 'bold 104px Consolas, Menlo, monospace'
      g.textAlign = 'center'; g.textBaseline = 'middle'
      g.fillText(String(text || 'DSH').slice(0, 4), W / 2, H / 2)
    } else if (kind === 'moon') {
      /* moon：轮廓环 + 几处密集陨坑（用点团而不是挖空） */
      g.lineWidth = 7
      g.strokeStyle = '#fff'
      g.beginPath(); g.arc(W / 2, H / 2, 124, 0, Math.PI * 2); g.stroke()
      var craters = [[-52, -38, 20], [34, -58, 14], [58, 26, 18], [-16, 52, 12], [-70, 30, 9], [10, -6, 8]]
      for (var ci = 0; ci < craters.length; ci++) {
        g.lineWidth = 4
        g.beginPath(); g.arc(W / 2 + craters[ci][0], H / 2 + craters[ci][1], craters[ci][2], 0, Math.PI * 2); g.stroke()
      }
    } else {
      /* earth：只画"轮廓"和"大陆团块"，不填满——方块拼出来才有球的辨识度 */
      g.lineWidth = 7
      g.strokeStyle = '#fff'
      g.beginPath(); g.arc(W / 2, H / 2, 118, 0, Math.PI * 2); g.stroke()
      /* 倾斜环带：两道弧线 */
      g.lineWidth = 5
      g.beginPath(); g.ellipse(W / 2, H / 2, 166, 40, -0.3, Math.PI * 0.06, Math.PI * 0.94); g.stroke()
      g.beginPath(); g.ellipse(W / 2, H / 2, 166, 40, -0.3, Math.PI * 1.06, Math.PI * 1.94); g.stroke()
      var land = [[-44, -34, 34, 24], [28, -50, 26, 18], [44, 18, 30, 22], [-16, 46, 24, 16], [-58, 18, 18, 14]]
      for (var li = 0; li < land.length; li++) {
        g.beginPath(); g.ellipse(W / 2 + land[li][0], H / 2 + land[li][1], land[li][2], land[li][3], 0.5, 0, Math.PI * 2); g.fill()
      }
    }
    var data = null
    try { data = g.getImageData(0, 0, W, H).data } catch (e) { return [] }
    function alphaAt(x, y) {
      if (x < 0 || y < 0 || x >= W || y >= H) return 0
      return data[(y * W + x) * 4 + 3]
    }
    var edge = [], inner = []
    for (var y = 0; y < H; y += 2) {
      for (var x = 0; x < W; x += 2) {
        if (alphaAt(x, y) <= 128) continue
        /* 2px 内有透明像素 → 归为轮廓点 */
        var isEdge = alphaAt(x - 2, y) <= 128 || alphaAt(x + 2, y) <= 128 || alphaAt(x, y - 2) <= 128 || alphaAt(x, y + 2) <= 128
        ;(isEdge ? edge : inner).push([x - W / 2, y - H / 2])
      }
    }
    if (!edge.length && !inner.length) return []
    /* 轮廓占 70%，内部占 30%：靠轮廓才认得出形状 */
    var wantEdge = Math.min(edge.length, Math.round(count * 0.7))
    var wantInner = Math.min(inner.length, count - wantEdge)
    var out = []
    function pick(list, n) {
      if (!n || !list.length) return
      var step2 = Math.max(1, Math.floor(list.length / n))
      for (var k2 = 0; k2 < list.length && n > 0; k2 += step2) { out.push(list[k2]); n-- }
    }
    pick(edge, wantEdge)
    pick(inner, wantInner)
    return out
  }

  /* ── 线描图层：把形状画成 SVG 描边，再靠 dashoffset 生长 ──────────
     形状：whale（官方路径）/ earth（球+环+七大洲轮廓）/ moon（月面+陨坑）/ text（任意文字）
     文字用 SVG <text> 的描边虚线做"书写"，所以写什么都能长出来。 */
  function buildLineArt(node, L) {
    var sz = Math.max(40, Math.min(900, tlNumber(L.logoSize, 300)))
    node.style.width = sz + 'px'; node.style.height = sz + 'px'
    var ns = 'http://www.w3.org/2000/svg'
    var svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%')
    svg.setAttribute('viewBox', '0 0 100 100')
    svg.style.overflow = 'visible'
    var shape = String(L.shape || 'whale')
    var targets = [], lens = []
    function mk(tag, attrs) {
      var e2 = document.createElementNS(ns, tag)
      for (var k in attrs) e2.setAttribute(k, attrs[k])
      e2.setAttribute('fill', 'none')
      e2.setAttribute('stroke-linecap', 'round')
      e2.setAttribute('stroke-linejoin', 'round')
      svg.appendChild(e2)
      var len = 0
      try { len = e2.getTotalLength ? e2.getTotalLength() : 0 } catch (e3) { len = 0 }
      if (!len) {
        if (tag === 'circle') len = 2 * Math.PI * Number(attrs.r || 0)
        else if (tag === 'ellipse') len = Math.PI * (Number(attrs.rx || 0) + Number(attrs.ry || 0))
        else len = 6
      }
      targets.push(e2); lens.push(len)
      return e2
    }
    var nsz = sz
    if (shape === 'custom' && Array.isArray(L.paths) && L.paths.length) {
      var vw = tlNumber(L.viewW, 100), vh = tlNumber(L.viewH, 100)
      svg.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh)
      node.style.height = (sz * vh / vw) + 'px'
      for (var pi = 0; pi < L.paths.length; pi++) {
        var pd = L.paths[pi] && L.paths[pi].d ? String(L.paths[pi].d) : ''
        if (pd) mk('path', { d: pd })
      }
    } else if (shape === 'whale') {
      svg.setAttribute('viewBox', '0 0 50 50')
      mk('path', { d: BRAND_PATH, 'fill-rule': 'evenodd' })
    } else if (shape === 'earth') {
      mk('circle', { cx: 50, cy: 50, r: 34 })
      /* 经线/纬线：只画在球内，不要穿出去 */
      mk('path', { d: 'M16 50 Q50 42 84 50' })
      mk('path', { d: 'M16 50 Q50 58 84 50' })
      mk('path', { d: 'M50 16 Q42 50 50 84' })
      /* 大陆：不规则闭合轮廓（不是圆，避免变成"眼睛/嘴"） */
      mk('path', { d: 'M22 34 q4 -7 12 -8 q8 -1 11 4 q2 5 -2 9 q-5 6 -13 6 q-9 0 -10 -6 q0 -3 2 -5 Z' })
      mk('path', { d: 'M46 46 q7 -5 14 -1 q5 3 3 9 q-2 7 -10 8 q-9 1 -11 -6 q-1 -6 4 -10 Z' })
      mk('path', { d: 'M24 60 q6 -3 10 1 q3 5 -1 9 q-5 5 -10 2 q-4 -3 -3 -7 q1 -4 4 -5 Z' })
      mk('path', { d: 'M58 24 q6 -2 9 2 q2 4 -2 7 q-5 3 -8 -1 q-2 -4 1 -8 Z' })
      mk('path', { d: 'M62 58 q5 -2 7 2 q2 5 -3 7 q-5 1 -6 -4 q-1 -3 2 -5 Z' })
    } else if (shape === 'moon') {
      mk('circle', { cx: 50, cy: 50, r: 36 })
      mk('circle', { cx: 36, cy: 38, r: 9 })
      mk('circle', { cx: 58, cy: 30, r: 6 })
      mk('circle', { cx: 66, cy: 52, r: 8 })
      mk('circle', { cx: 42, cy: 64, r: 6 })
      mk('circle', { cx: 54, cy: 46, r: 4 })
    } else {
      var tEl = document.createElementNS(ns, 'text')
      tEl.setAttribute('x', '50'); tEl.setAttribute('y', '58')
      tEl.setAttribute('text-anchor', 'middle')
      tEl.setAttribute('font-family', 'Consolas, Menlo, monospace')
      tEl.setAttribute('font-weight', '700')
      tEl.setAttribute('font-size', String(tlNumber(L.fontSize, 30)))
      tEl.setAttribute('fill', 'none')
      tEl.setAttribute('stroke-linecap', 'round')
      tEl.textContent = String(L.text || 'DSH').slice(0, 12)
      svg.appendChild(tEl)
      targets.push(tEl)
      var tl2 = 0
      try { tl2 = tEl.getComputedTextLength() * 2.2 } catch (e4) { tl2 = 240 }
      lens.push(tl2)
    }
    node.appendChild(svg)
    return { targets: targets, lens: lens, shape: shape }
  }

  /** blocks 图层：建方块 + 记录随机起点与目标点 */
  function buildBlocks(node, L) {
    var count = Math.max(12, Math.min(180, tlNumber(L.count, 64)))
    var size = Math.max(2, Math.min(24, tlNumber(L.blockSize, 7)))
    var pts = shapePoints(L.shape, L.text, count)
    var blocks = []
    var seed = 0
    var sStr = String(L.id || 'blocks') + '|' + count + '|' + String(L.shape || '')
    for (var s3 = 0; s3 < sStr.length; s3++) seed = (seed * 31 + sStr.charCodeAt(s3)) >>> 0
    function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
    var spread = tlNumber(L.spread, 520)
    for (var i3 = 0; i3 < count; i3++) {
      var b = el('i')
      b.className = 'dsu-blk'
      b.style.width = size + 'px'; b.style.height = size + 'px'
      if (L.color) b.style.background = String(L.color)
      node.appendChild(b)
      var sc2 = tlNumber(L.shapeScale, 2.3)
      var target = pts.length ? [pts[i3 % pts.length][0] * sc2, pts[i3 % pts.length][1] * sc2] : [0, 0]
      blocks.push({
        el: b,
        sx: (rnd() * 2 - 1) * spread,
        sy: (rnd() * 2 - 1) * spread * 0.62,
        tx: target[0], ty: target[1],
        delay: rnd() * 0.45,
        wob: rnd() * Math.PI * 2,
        drift: 6 + rnd() * 22
      })
    }
    node.setAttribute('data-blocks', String(count))
    return { blocks: blocks, size: size }
  }

  /** 把模板的 layers 建成 DOM；返回 {stage, nodes, duration} */
  var TL_W = 1280, TL_H = 720

  /** 按窗口大小给舞台定缩放（letterbox 居中）—— 逻辑坐标永远是 1280×720 */
  function fitStage(stage) {
    var w = window.innerWidth || TL_W
    var h = window.innerHeight || TL_H
    var s = Math.min(w / TL_W, h / TL_H)
    stage.style.transform = 'translate(-50%, -50%) scale(' + s + ')'
  }

  function buildTimeline() {
    diagRun('buildTimeline start tpl=' + ((TEMPLATE && TEMPLATE.id) || '?') + ' layers=' + (TIMELINE ? TIMELINE.length : 0))
    var stage = el('div'); stage.className = 'dsu-tl-stage'
    fitStage(stage)
    window.addEventListener('resize', function () { fitStage(stage) })
    root.appendChild(stage)
    var nodes = []
    var list = timelineLayers()
    for (var i = 0; i < list.length; i++) {
      var L = list[i]
      var node = el('div')
      node.className = 'dsu-tl-layer dsu-tl-' + String(L.type || 'text')
      node.setAttribute('data-layer', String(L.id || ('layer-' + i)))
      if (L.type === 'video') {
        var vnode = document.createElement('video')
        vnode.className = 'dsu-tl-layer dsu-tl-video'
        vnode.setAttribute('data-layer', String(L.id || ('video-' + i)))
        /* v2.16.7：视频原声开关——第一幕用 act1VideoSound，第二幕用 act2VideoSound；默认静音 */
        var vSoundOn = TIMELINE_ACT === 2 ? (C.act2VideoSound === true) : (C.act1VideoSound === true)
        vnode.muted = !vSoundOn
        vnode.defaultMuted = !vSoundOn
        vnode.autoplay = true
        vnode.playsInline = true
        vnode.preload = 'auto'
        if (L.loop) vnode.loop = true
        var vw = Math.max(1, tlNumber(L.videoW, 1280))
        var vh = Math.max(1, tlNumber(L.videoH, 720))
        vnode.style.width = vw + 'px'
        vnode.style.height = vh + 'px'
        vnode.style.objectFit = 'cover'
        vnode.style.pointerEvents = 'none'
        var vfile = String(L.src || '').replace(/^.*\//, '')
        var vbase = ''
        try { vbase = String(window.__DSH_STARTUP_TPL_BASE__ || '') } catch (eV) { vbase = '' }
        if (!vbase) vbase = '/dsh-startup'
        if (vfile) {
          var vtpl = (TEMPLATE && TEMPLATE.id) ? String(TEMPLATE.id) : ''
          vnode.src = vbase + '/template-asset/' + encodeURIComponent(vtpl) + '/' + encodeURIComponent(vfile)
        }
        vnode.addEventListener('play', function () { diagRun('video play ' + vfile + ' vids=' + videoCount()) })
        vnode.addEventListener('ended', function () { diagRun('video ended ' + vfile) })
        vnode.addEventListener('error', function () { diagRun('video error ' + vfile) })
        /* v2.16.1：第二幕视频诊断（分辨率/时长/实测帧率/丢帧）+ 省电暂停自动恢复 + play() 失败静默 */
        vnode.addEventListener('loadedmetadata', function () {
          diagRun('video meta ' + vfile + ' ' + vnode.videoWidth + 'x' + vnode.videoHeight + ' dur=' + (isFinite(vnode.duration) ? vnode.duration.toFixed(2) : '?'))
        })
        var vResumeTimer = null
        vnode.addEventListener('pause', function () {
          /* Chromium 会把不可见的静音视频暂停省电；只要还在第二幕里就拉回来，避免“卡住/掉帧” */
          if (vnode.ended || !vnode.isConnected || vResumeTimer) return
          vResumeTimer = setTimeout(function () {
            vResumeTimer = null
            if (!vnode.isConnected || vnode.ended || !vnode.paused) return
            try { var vpR = vnode.play(); if (vpR && vpR.catch) vpR.catch(function () {}) } catch (eR) { /* noop */ }
          }, 260)
        })
        placeLayer(vnode, tlNumber(L.pos && L.pos[0], 640), tlNumber(L.pos && L.pos[1], 360), vw, vh)
        stage.appendChild(vnode)
        diagRun('video append ' + vfile + ' vids=' + videoCount())
        try {
          var vp0 = vnode.play()
          if (vp0 && vp0.catch) vp0.catch(function (eAudio) {
            if (!vSoundOn) return
            /* v2.16.7：未静音自动播放可能被浏览器策略拦下——退回静音再播，保证画面不卡 */
            try { vnode.muted = true; vnode.defaultMuted = true } catch (eMute) {}
            try { var vpM = vnode.play(); if (vpM && vpM.catch) vpM.catch(function () {}) } catch (eMute2) {}
            diagRun('video audio blocked, fallback muted ' + vfile)
          })
        } catch (ePlay) { /* autoplay blocked */ }
        if (vnode.requestVideoFrameCallback) {
          var vFrames = 0, vT0 = 0
          var onVFrame = function (now) {
            if (!vnode.isConnected) return
            if (!vT0) { vT0 = now; vFrames = 0 }
            vFrames += 1
            if (now - vT0 < 1200) {
              try { vnode.requestVideoFrameCallback(onVFrame) } catch (eF) { /* noop */ }
              return
            }
            var vq = null
            try { vq = vnode.getVideoPlaybackQuality() } catch (eQ) { /* noop */ }
            var vFps = vT0 ? Math.round(vFrames * 1000 / (now - vT0)) : 0
            diagRun('video stats ' + vfile + ' ' + vnode.videoWidth + 'x' + vnode.videoHeight + ' fps=' + vFps +
              ' dropped=' + (vq ? vq.droppedVideoFrames : '?') + '/' + (vq ? vq.totalVideoFrames : '?') +
              ' paused=' + vnode.paused)
          }
          try { vnode.requestVideoFrameCallback(onVFrame) } catch (eF0) { /* noop */ }
        } else {
          setTimeout(function () {
            if (!vnode.isConnected) return
            var vq2 = null
            try { if (vnode.getVideoPlaybackQuality) vq2 = vnode.getVideoPlaybackQuality() } catch (eQ2) { /* noop */ }
            diagRun('video stats ' + vfile + ' ' + vnode.videoWidth + 'x' + vnode.videoHeight +
              ' dropped=' + (vq2 ? vq2.droppedVideoFrames : '?') + '/' + (vq2 ? vq2.totalVideoFrames : '?'))
          }, 1500)
        }
        nodes.push({ def: L, node: vnode, video: vnode })
        continue
      }
      if (L.type === 'progress') {
        var pw = Math.max(40, Math.min(1200, tlNumber(L.barW, 420)))
        var ph = Math.max(1, Math.min(40, tlNumber(L.barH, 2)))
        node.style.width = pw + 'px'; node.style.height = ph + 'px'
        var track = el('div'); track.className = 'dsu-tl-progress-track'
        var fill = el('div'); fill.className = 'dsu-tl-progress-fill'
        if (L.barColor) fill.style.background = String(L.barColor)
        track.appendChild(fill); node.appendChild(track)
        stage.appendChild(node)
        nodes.push({ def: L, node: node, progress: { fill: fill }, cardW: pw, cardH: ph })
        continue
      }
      if (L.type === 'counter') {
        var cw2 = Math.max(60, Math.min(600, tlNumber(L.barW, 220)))
        var ch2 = Math.max(20, Math.min(200, tlNumber(L.barH, 56)))
        node.style.width = cw2 + 'px'; node.style.height = ch2 + 'px'
        node.className = 'dsu-tl-layer dsu-tl-counter'
        node.textContent = '0%'
        stage.appendChild(node)
        nodes.push({ def: L, node: node })
        continue
      }
      if (L.type === 'panel') {
        var pnW = Math.max(20, Math.min(1200, tlNumber(L.panelW, 360)))
        var pnH = Math.max(20, Math.min(800, tlNumber(L.panelH, 240)))
        node.style.width = pnW + 'px'; node.style.height = pnH + 'px'
        node.style.border = '1px solid ' + String(L.borderColor || 'rgba(140,200,255,.35)')
        node.style.borderRadius = tlNumber(L.radius, 6) + 'px'
        node.style.background = String(L.fill || 'rgba(8,18,32,.55)')
        if (L.glow) node.style.boxShadow = '0 0 ' + tlNumber(L.glow, 18) + 'px ' + String(L.borderColor || 'rgba(114,162,234,.5)')
        if (L.blur) { node.style.backdropFilter = 'blur(' + tlNumber(L.blur, 0) + 'px)'; node.style.webkitBackdropFilter = node.style.backdropFilter }
        if (L.clip) node.style.overflow = 'hidden'
        stage.appendChild(node)
        nodes.push({ def: L, node: node, panel: { w: pnW, h: pnH } })
        continue
      }
      if (L.type === 'chars') {
        var csz = Math.max(160, Math.min(900, tlNumber(L.logoSize, 420)))
        /* 画布"出血"：保证无论这个图层被挪多远，画布都还盖住整个舞台。
           由「最大位移」和「最大扩散倍率」自动算，用户不用手动调。 */
        var maxGs = 1, maxOffX = 0, maxOffY = 0
        ;(L.keyframes || []).forEach(function (k) {
          var g = Number(k.globeScale), x = Math.abs(Number(k.offsetX) || 0), y = Math.abs(Number(k.offsetY) || 0)
          if (isFinite(g) && g > maxGs) maxGs = g
          if (x > maxOffX) maxOffX = x
          if (y > maxOffY) maxOffY = y
        })
        var R0 = Math.max(70, Math.min(340, tlNumber(L.logoSize, 420) / 2))
        var needBySpread = (R0 * maxGs * 2 + 40) / 720
        var needByMoveW = (1280 + maxOffX * 2) / 1280
        var needByMoveH = (720 + maxOffY * 2) / 720
        var boxC = Math.max(1, Math.min(3.9, Math.max(tlNumber(L.boxScale, 1), needBySpread, needByMoveW, needByMoveH)))
        node.style.width = Math.round(1280 * boxC) + 'px'; node.style.height = Math.round(720 * boxC) + 'px'
        var ccv = document.createElement('canvas')
        ccv.width = Math.round(1280 * boxC); ccv.height = Math.round(720 * boxC)
        ccv.style.width = '100%'; ccv.style.height = '100%'
        node.appendChild(ccv)
        stage.appendChild(node)
        var charMeta = { cv: ccv, ctx: ccv.getContext('2d'), dots: Array.isArray(L.dots) ? L.dots : [], textTargets: null }
        charMeta.textTargets = buildTextTargets(String(L.formText || 'WELCOME BACK'), charMeta.dots.length)
        charMeta.box = boxC
        placeLayer(node, tlNumber(L.pos && L.pos[0], 640), tlNumber(L.pos && L.pos[1], 360), 1280 * boxC, 720 * boxC)
        nodes.push({ def: L, node: node, chars: charMeta, gsize: csz })
        continue
      }
      if (L.type === 'idcard') {
        var cw = tlNumber(L.cardW, 420), ch = tlNumber(L.cardH, 240)
        var cpx = tlNumber(L.pos && L.pos[0], 640), cpy = tlNumber(L.pos && L.pos[1], 360)
        node.style.width = cw + 'px'; node.style.height = ch + 'px'
        node.__cardW = cw; node.__cardH = ch
        placeLayer(node, cpx, cpy, cw, ch)
        var cbase = '/dsh-startup'
        try { if (window.__DSH_STARTUP_API_BASE__) cbase = String(window.__DSH_STARTUP_API_BASE__) } catch (e6) { /* noop */ }
        var cq = []
        ;['name', 'code', 'unit', 'level', 'issuer', 'validity', 'scope', 'bio', 'lock', 'status', 'color'].forEach(function (k) {
          if (L[k]) cq.push(k + '=' + encodeURIComponent(String(L[k])))
        })
        if (L.cardColor) cq.push('color=' + encodeURIComponent(String(L.cardColor)))
        cq.push('w=' + cw)
        var ifr = document.createElement('iframe')
        ifr.setAttribute('scrolling', 'no')
        ifr.style.cssText = 'border:0;width:100%;height:100%;background:transparent;display:block'
        ifr.src = cbase + '/idcard?' + cq.join('&')
        node.appendChild(ifr)
        stage.appendChild(node)
        nodes.push({ def: L, node: node })
        continue
      }
      if (L.type === 'globe') {
        var gsz = Math.max(120, Math.min(900, tlNumber(L.logoSize, 520)))
        node.style.width = gsz + 'px'; node.style.height = gsz + 'px'
        placeLayer(node, tlNumber(L.pos && L.pos[0], 640), tlNumber(L.pos && L.pos[1], 360), gsz, gsz)
        var ns2 = 'http://www.w3.org/2000/svg'
        var gsvg = document.createElementNS(ns2, 'svg')
        gsvg.setAttribute('width', '100%'); gsvg.setAttribute('height', '100%')
        gsvg.setAttribute('viewBox', '-260 -260 520 520')
        var cid = 'dsu-globe-clip-' + (nodes.length + 1)
        var defs = document.createElementNS(ns2, 'defs')
        var cp = document.createElementNS(ns2, 'clipPath'); cp.setAttribute('id', cid)
        var cc = document.createElementNS(ns2, 'circle'); cc.setAttribute('r', '235'); cp.appendChild(cc); defs.appendChild(cp)
        gsvg.appendChild(defs)
        var gridG = document.createElementNS(ns2, 'g'); gridG.setAttribute('clip-path', 'url(#' + cid + ')')
        var landG = document.createElementNS(ns2, 'g'); landG.setAttribute('clip-path', 'url(#' + cid + ')')
        var outC = document.createElementNS(ns2, 'circle')
        outC.setAttribute('r', '235'); outC.setAttribute('fill', 'none')
        gsvg.appendChild(gridG); gsvg.appendChild(landG); gsvg.appendChild(outC)
        node.appendChild(gsvg)
        stage.appendChild(node)
        var gRings = Array.isArray(L.rings) ? L.rings : []
        /* 学外援的做法：路径节点只建一次，之后每帧只更新 d（不重建 DOM） */
        var gCoast = []
        for (var gc = 0; gc < gRings.length; gc++) {
          var cpe = document.createElementNS(ns2, 'path')
          cpe.setAttribute('fill', 'none')
          cpe.setAttribute('stroke-linejoin', 'round')
          gCoast.push(cpe); landG.appendChild(cpe)
        }
        var gGrid = []
        if (L.showGrid !== false) {
          var gi2, lats2 = [], lons2 = []
          for (gi2 = -60; gi2 <= 60; gi2 += 30) lats2.push(gi2)
          for (gi2 = -180; gi2 < 180; gi2 += 30) lons2.push(gi2)
          var gTotal = lats2.length + lons2.length
          for (var gk = 0; gk < gTotal; gk++) {
            var gpe = document.createElementNS(ns2, 'path')
            gpe.setAttribute('fill', 'none')
            gpe.setAttribute('stroke-width', '0.7')
            gGrid.push(gpe); gridG.appendChild(gpe)
          }
        }
        nodes.push({ def: L, node: node, gsize: gsz, globe: {
          gridG: gridG, landG: landG, outline: outC, rings: gRings,
          coast: gCoast, grid: gGrid, lats: lats2, lons: lons2
        } })
        continue
      }
      if (L.type === 'logo') {
        var lmeta = buildLineArt(node, L)
        stage.appendChild(node)
        nodes.push({ def: L, node: node, logo: lmeta })
        continue
      }
      if (L.type === 'image') {
        var file = String(L.src || '').replace(/^.*\//, '')
        var ibase = ''
        try { ibase = String(window.__DSH_STARTUP_TPL_BASE__ || '') } catch (eIb) { ibase = '' }
        if (!ibase) ibase = '/dsh-startup'
        if (file) {
          node.style.backgroundImage = 'url("' + ibase + '/template-asset/' + encodeURIComponent((TEMPLATE && TEMPLATE.id) || '') + '/' + file + '")'
          node.style.backgroundSize = '100% 100%'
          node.style.backgroundPosition = 'center'
          node.style.backgroundRepeat = 'no-repeat'
        }
      } else if (L.type === 'line') {
        node.style.width = tlNumber(L.width, 400) + 'px'
      } else if (L.type === 'text') {
        node.textContent = String(L.text || '')
        if (L.font) {
          if (L.font.size) node.style.fontSize = tlNumber(L.font.size, 40) + 'px'
          if (L.font.weight) node.style.fontWeight = String(L.font.weight)
          if (L.font.tracking) node.style.letterSpacing = tlNumber(L.font.tracking, 0) + 'em'
        }
        if (L.color) node.style.color = String(L.color)
        node.style.whiteSpace = 'pre'
      }
      stage.appendChild(node)
      nodes.push({ def: L, node: node })
    }
    /* 叠层效果：全部走同一套壳，各自一个类；时间窗由 applyTimeline 控制 */
    var FX_TYPES = {
      scanline: 1, vignette: 1, glitch: 1, codes: 1, radar: 1, sonar: 1, readout: 1,
      grid: 1, crt: 1, letterbox: 1, hud: 1, bloom: 1
    }
    var fx = Array.isArray(TEMPLATE.effects) ? TEMPLATE.effects : []
    var fxNodes = []
    for (var f = 0; f < fx.length && f < 24; f++) {
      var e = fx[f] || {}
      var type = String(e.type || '')
      if (!FX_TYPES[type]) continue
      var node = el('div')
      node.className = 'dsu-fx dsu-fx-' + type
      node.style.opacity = String(tlNumber(e.opacity, 0.6))
      /* 效果也能摆位置/缩放/裁切（原来只能铺满全屏） */
      var fxX = tlNumber(e.x, 0), fxY = tlNumber(e.y, 0), fxS = tlNumber(e.scale, 1)
      if (fxX || fxY || fxS !== 1) {
        node.style.transformOrigin = '50% 50%'
        node.style.transform = 'translate(' + fxX + 'px,' + fxY + 'px) scale(' + fxS + ')'
      }
      var clipPct = tlNumber(e.clip, 0)
      if (clipPct > 0) node.style.clipPath = 'inset(' + Math.min(45, clipPct) + '%)'
      if (e.speed) node.style.setProperty('--fx-speed', String(tlNumber(e.speed, 1)))
      if (type === 'codes') {
        /* 伪代码雨：几列等宽文字，CSS 里循环滚动 */
        var cols = Math.max(3, Math.min(14, tlNumber(e.columns, 8)))
        for (var c = 0; c < cols; c++) {
          var col = el('div'); col.className = 'dsu-fx-code-col'
          col.style.left = (c * (100 / cols) + 1) + '%'
          col.style.animationDelay = (-(c * 0.7)) + 's'
          var txt = ''
          for (var L2 = 0; L2 < 18; L2++) txt += pseudoCodeLine(c * 7 + L2) + '\n'
          col.textContent = txt
          node.appendChild(col)
        }
      } else if (type === 'radar') {
        var boxR = el('div'); boxR.className = 'dsu-fx-circle-box'
        var sweep2 = el('div'); sweep2.className = 'dsu-fx-radar-sweep'; boxR.appendChild(sweep2)
        for (var r2 = 1; r2 <= 3; r2++) { var ring = el('div'); ring.className = 'dsu-fx-radar-ring'; ring.style.width = ring.style.height = (r2 * 33.3) + '%'; boxR.appendChild(ring) }
        node.appendChild(boxR)
      } else if (type === 'sonar') {
        var boxS = el('div'); boxS.className = 'dsu-fx-circle-box'
        for (var s2 = 0; s2 < 3; s2++) { var wv = el('div'); wv.className = 'dsu-fx-sonar-ring'; wv.style.animationDelay = (s2 * 1.1) + 's'; boxS.appendChild(wv) }
        node.appendChild(boxS)
      } else if (type === 'readout') {
        /* 四角装饰读数：内容由时间码确定性生成，每秒都在变但不乱跳 */
        ;['tl', 'tr', 'bl', 'br'].forEach(function (k) {
          var sp = el('span'); sp.className = 'dsu-fx-ro-' + k; node.appendChild(sp)
        })
      } else if (type === 'hud') {
        ;['tl', 'tr', 'bl', 'br'].forEach(function (k) { var cn = el('i'); cn.className = 'dsu-fx-hud-corner ' + k; node.appendChild(cn) })
      }
      stage.appendChild(node)
      fxNodes.push({ def: e, node: node })
    }
    function pseudoCodeLine(seed) {
      var pool = ['0x7F3A', 'SYS.OK', 'SCAN 41%', 'AUTH 3', '[####----]', 'PING 12ms', 'NODE 07', 'CRC 9F2C', 'GPU IDLE', '>- READY', 'KERNEL 6.1', 'SYNC ok']
      return pool[(seed * 7 + seed * seed) % pool.length]
    }
    return {
      stage: stage,
      nodes: nodes,
      fx: fxNodes,
      duration: Math.max(600, Math.min(60000, tlNumber(TEMPLATE.duration, 6000))),
      cues: (Array.isArray(TEMPLATE.audio) ? TEMPLATE.audio : []).filter(function (a) { return a && isFinite(Number(a.t)) && AUDIO_SLOTS[a.slot] }).slice(0, 24)
    }
  }

  /** 安全化：层数与每层关键帧数上限，防止模板把浏览器拖死 */
  function timelineLayers() {
    var out = []
    var raw = TIMELINE || []
    for (var i = 0; i < raw.length && out.length < TL_MAX_LAYERS; i++) {
      var L = raw[i]
      if (!L || typeof L !== 'object') continue
      var kfs = Array.isArray(L.keyframes) ? L.keyframes.filter(function (k) { return k && isFinite(Number(k.t)) }).slice(0, TL_MAX_KF) : []
      kfs.sort(function (a, b) { return a.t - b.t })
      out.push({
        id: L.id, type: L.type, text: L.text, font: L.font, color: L.color,
        /* 方块聚合层的参数（归一化是白名单，漏一个就回默认） */
        count: L.count, shape: L.shape, blockSize: L.blockSize, logoSize: L.logoSize,
        paths: L.paths, viewW: L.viewW, viewH: L.viewH, strokeWidth: L.strokeWidth, fontSize: L.fontSize,
        rings: L.rings, tilt: L.tilt, spinMs: L.spinMs, rotation0: L.rotation0, showGrid: L.showGrid,
        name: L.name, code: L.code, unit: L.unit, level: L.level, issuer: L.issuer,
        validity: L.validity, scope: L.scope, bio: L.bio, lock: L.lock, status: L.status,
        cardW: L.cardW, cardH: L.cardH, cardColor: L.cardColor,
        barW: L.barW, barH: L.barH, barColor: L.barColor, suffix: L.suffix,
        panelW: L.panelW, panelH: L.panelH, radius: L.radius, borderColor: L.borderColor, fill: L.fill, glow: L.glow, blur: L.blur, clip: L.clip,
        dots: L.dots, dotsFile: L.dotsFile, formText: L.formText, box: L.box, align: L.align, boxScale: L.boxScale, wipeFrom: L.wipeFrom,
        spread: L.spread, shapeScale: L.shapeScale,
        hasTyped: kfs.some(function (k) { return k.typed !== undefined }),
        src: L.src, width: L.width, pos: L.pos, size: L.size,
        keyframes: kfs
      })
    }
    return out
  }

  /** 把 t 时刻的状态应用到所有图层 */
  function applyTimeline(tl, t) {
    /* 效果层：带 from/to 时间窗，窗外隐藏 */
    if (tl.fx) {
      for (var f2 = 0; f2 < tl.fx.length; f2++) {
        var it2 = tl.fx[f2], d2 = it2.def || {}
        var from = d2.from === undefined ? -Infinity : Number(d2.from)
        var to = d2.to === undefined ? Infinity : Number(d2.to)
        var base = d2.opacity === undefined ? 0.6 : Number(d2.opacity)
        it2.node.style.opacity = String(t >= from && t <= to ? base : 0)
        if (d2.type === 'readout' && t >= from && t <= to) {
          var bucket = Math.floor(t / 120)
          if (it2.__b !== bucket) {
            it2.__b = bucket
            var hx = function (n) { var x = ((bucket * 2654435761 + n * 40503) >>> 0) % 65536; return ('0000' + x.toString(16).toUpperCase()).slice(-4) }
            var ss = (t / 1000).toFixed(2)
            var kids = it2.node.children
            if (kids[0]) kids[0].textContent = 'SYS // ' + hx(1) + ' · T+' + ss
            if (kids[1]) kids[1].textContent = 'FPS ' + (58 + (bucket % 5)) + ' · ' + hx(2)
            if (kids[2]) kids[2].textContent = 'LAT ' + (35 + (bucket % 9)) + '.' + hx(3).slice(0, 3) + ' N'
            if (kids[3]) kids[3].textContent = 'NODE ' + (100 + bucket % 47) + ' · ' + hx(4)
          }
        }
      }
    }
    for (var i = 0; i < tl.nodes.length; i++) {
      var it = tl.nodes[i], L = it.def, node = it.node
      var op = kfAt(L.keyframes, t, 'opacity', 1)
      var ox = kfAt(L.keyframes, t, 'offsetX', 0)
      var oy = kfAt(L.keyframes, t, 'offsetY', 0)
      var sc = kfAt(L.keyframes, t, 'scale', 1)
      var rot = kfAt(L.keyframes, t, 'rotate', 0)
      var skew = kfAt(L.keyframes, t, 'skew', 0)
      var baseX = L.pos && L.pos[0] !== undefined ? tlNumber(L.pos[0], 0) : 640
      var baseY = L.pos && L.pos[1] !== undefined ? tlNumber(L.pos[1], 0) : 360
      var sw = 0, sh = 0
      if (L.size && L.size[0]) {
        node.style.width = tlNumber(L.size[0], 100) + 'px'
        node.style.height = tlNumber(L.size[1], 100) + 'px'
      }
      node.style.opacity = String(Math.max(0, Math.min(1, op)))
      /* 进度条：value 0→1 控制填充宽度 */
      if (it.progress) {
        var pv = Math.max(0, Math.min(1, kfAt(L.keyframes, t, 'value', 0)))
        it.progress.fill.style.width = (pv * 100).toFixed(2) + '%'
        node.style.left = '0px'; node.style.top = '0px'
        var bwid = Number(L.barW) || 420, bhei = Number(L.barH) || 2
        node.style.transform = 'translate(' + (baseX + ox - bwid / 2) + 'px,' + (baseY + oy - bhei / 2) + 'px) scale(' + sc + ')'
        continue
      }
      /* 计数器：value 0→100，按整数显示，可带后缀 */
      if (L.type === 'counter') {
        var cv = Math.max(0, Math.min(100, kfAt(L.keyframes, t, 'value', 0)))
        var suffix = L.suffix === undefined ? '%' : String(L.suffix)
        node.textContent = Math.round(cv) + suffix
        node.style.left = '0px'; node.style.top = '0px'
        var cwid = Number(L.barW) || 220, chei = Number(L.barH) || 56
        node.style.transform = 'translate(' + (baseX + ox - cwid / 2) + 'px,' + (baseY + oy - chei / 2) + 'px) scale(' + sc + ')'
        continue
      }

      /* 面板：矩形框（登录卡 / 码流面板 / HUD 框） */
      if (it.panel) {
        var pW = it.panel.w, pH = it.panel.h
        node.style.left = '0px'; node.style.top = '0px'
        node.style.transform = 'translate(' + (baseX + ox - pW / 2) + 'px,' + (baseY + oy - pH / 2) + 'px) scale(' + sc + ') rotate(' + rot + 'deg)'
        continue
      }

      /* 身份卡：独立页面 iframe，位置/缩放与其它图层同一约定 */
      if (it.idcard) {
        var icw = node.__cardW || 420, ich = node.__cardH || 240
        node.style.left = '0px'; node.style.top = '0px'
        node.style.transform = 'translate(' + (baseX + ox - icw / 2) + 'px,' + (baseY + oy - ich / 2) + 'px) scale(' + sc + ')'
        continue
      }

      /* 字符地球：点云绕极轴转 + 正交投影，每 6 个点画一个十六进制字符 */
      if (it.chars) {
        var CH = it.chars, cg = CH.ctx
        node.style.left = '0px'; node.style.top = '0px'
        var boxF = CH.box || 1
        node.style.transform = 'translate(' + (baseX + ox - 640 * boxF) + 'px,' + (baseY + oy - 360 * boxF) + 'px) scale(' + sc + ') rotate(' + rot + 'deg)'
        var colC = L.color || '#eaf6ff'
        var ATL = charAtlas(colC)
        var boxD = CH.box || 1
        var size = Math.round(1280 * boxD), H2 = Math.round(720 * boxD), half = size / 2, halfY = H2 / 2
        /* 扩展画布时，文字目标点（按 1280x720 采样）要平移到画布中心坐标系 */
        var offCx = half - 640, offCy = halfY - 360
        var R0 = Math.max(70, Math.min(340, (it.gsize || 420) / 2))
        var rMul = Math.max(0.15, Math.min(8, kfAt(L.keyframes, t, 'globeScale', 1)))
        var R = R0 * rMul
        cg.clearRect(0, 0, size, H2)
        if (ATL && CH.dots.length) {
          var shade = cg.createRadialGradient(half - R * 0.35, halfY - R * 0.35, R * 0.08, half, halfY, R)
          shade.addColorStop(0, 'rgba(238,243,248,0.10)')
          shade.addColorStop(1, 'rgba(238,243,248,0.012)')
          var formNow = Math.max(0, Math.min(1, kfAt(L.keyframes, t, 'form', 0)))
          /* 轮廓/底光单独可淡出：outline 关键帧（默认 1） */
          var outA = Math.max(0, Math.min(1, kfAt(L.keyframes, t, 'outline', 1)))
          if (formNow < 0.35 && outA > 0.01 && rMul <= 1.3) {
            cg.globalAlpha = outA
            cg.beginPath(); cg.arc(half, halfY, R, 0, Math.PI * 2); cg.fillStyle = shade; cg.fill()
            cg.strokeStyle = 'rgba(114,162,234,' + (0.38 * outA) + ')'; cg.lineWidth = 1; cg.stroke()
            cg.globalAlpha = 1
          }
          var asmC = Math.max(0, Math.min(1, kfAt(L.keyframes, t, 'assemble', 1)))
          var seedC = 1
          function rndC() { seedC = (seedC * 1664525 + 1013904223) >>> 0; return seedC / 4294967296 }
          var spinC = tlNumber(L.spinMs, 18000)
          var theta = (t / Math.max(1000, spinC)) * Math.PI * 2 + tlNumber(L.rotation0, 0)
          cg.fillStyle = colC
          for (var di = 0; di < CH.dots.length; di++) {
            var latD = CH.dots[di][0] * Math.PI / 180, lonD = CH.dots[di][1] * Math.PI / 180
            var facingD = Math.cos(lonD + theta)
            if (facingD <= 0) continue
            var pxD = half + Math.sin(lonD + theta) * Math.cos(latD) * R
            var pyD = halfY - Math.sin(latD) * R
            /* 终幕：球 → 文字。同一批粒子飞过去，不换主体。 */
            if (asmC >= 1) {
              var formC = Math.max(0, Math.min(1, kfAt(L.keyframes, t, 'form', 0)))
              if (formC > 0 && CH.textTargets && CH.textTargets.length) {
                var tgtC = CH.textTargets[di % CH.textTargets.length]
                var eF = 1 - Math.pow(1 - formC, 3)
                var wobF = Math.sin(t * 0.003 + di * 0.7) * 10 * (1 - eF)
                pxD = pxD + (tgtC[0] + offCx - pxD) * eF + wobF
                pyD = pyD + (tgtC[1] + offCy - pyD) * eF + wobF * 0.6
                if (formC > 0.35) {
                  /* 不丢粒子：落点已补齐到粒子数 */
                  cg.globalAlpha = 0.55 + 0.45 * formC
                  var sF = 8 + 3 * formC
                  var cfF = (di * 37) % 256
                  var sxF = (cfF % ATL.cols) * ATL.cell, syF = Math.floor(cfF / ATL.cols) * ATL.cell
                  cg.drawImage(ATL.cv, sxF, syF, ATL.cell, ATL.cell, pxD - sF / 2, pyD - sF / 2, sF, sF)
                  continue
                }
              }
            }
            /* 汇聚：assemble<1 时从画布外的随机位置飞向球面点 */
            if (asmC < 1) {
              var k1 = rndC(), k2 = rndC(), k3 = rndC(), k4 = rndC()
              var delayC = k3 * 0.45
              var localC = Math.max(0, Math.min(1, (asmC - delayC) / Math.max(0.2, 1 - delayC)))
              var easeC = 1 - Math.pow(1 - localC, 3)
              var sxC = (k1 * 1.1 - 0.05) * size
              var syC = (k2 * 1.1 - 0.05) * H2
              var wobC = Math.sin(t * 0.0016 + k4 * 6.28) * (10 + 26 * k4) * (1 - easeC)
              pxD = sxC + (pxD - sxC) * easeC + wobC
              pyD = syC + (pyD - syC) * easeC * 0.98 + wobC * 0.6
              if (localC <= 0) {
                /* 细雨状态：粒子停在起始位置淡显，而不是完全消失 */
                cg.globalAlpha = 0.35
                if (di % 6 === 0) {
                  var cA = (di * 37) % 256
                  var sxA = (cA % ATL.cols) * ATL.cell, syA = Math.floor(cA / ATL.cols) * ATL.cell
                  cg.drawImage(ATL.cv, sxA, syA, ATL.cell, ATL.cell, pxD - 5, pyD - 5, 10, 10)
                } else {
                  cg.fillStyle = colC
                  cg.fillRect(pxD, pyD, 2, 2)
                }
                continue
              }
            }
            if (di % 6 === 0 || formNow > 0.5) {
              var cellD = (di * 37) % 256
              var sxd = (cellD % ATL.cols) * ATL.cell, syd = Math.floor(cellD / ATL.cols) * ATL.cell
              var gsz = (formNow > 0.5 ? 8 + 3 * formNow : 12 + 6 * facingD)
              cg.globalAlpha = 0.3 + 0.65 * facingD
              cg.drawImage(ATL.cv, sxd, syd, ATL.cell, ATL.cell, pxD - gsz / 2, pyD - gsz / 2, gsz, gsz)
            } else {
              cg.globalAlpha = 0.2 + 0.45 * facingD
              cg.fillRect(pxD, pyD, 2.6, 2.6)
            }
          }
          cg.globalAlpha = 1
          /* 注：不再叠实心字层 —— 粒子自己就是字，避免"先出字再吸附" */
          /* 无实心层 */
        }
      }

      /* 可旋转地球：正射投影每帧重算路径（不用图片、不用 WebGL） */
      if (it.globe) {
        var G = it.globe
        var R = 235
        var tilt = tlNumber(L.tilt, 0.12)
        var spinMs = tlNumber(L.spinMs, 24000)
        var rot0 = tlNumber(L.rotation0, -0.32)
        var rot = rot0 + (t / Math.max(1000, spinMs)) * Math.PI * 2
        var gcol = L.color || 'var(--dsu-accent)'
        function proj(lonDeg, latDeg) {
          var lon = lonDeg * Math.PI / 180, lat = latDeg * Math.PI / 180
          var d2 = lon - rot, cl = Math.cos(lat), sl = Math.sin(lat), cd = Math.cos(d2)
          return { x: R * cl * Math.sin(d2), y: -R * (sl * Math.cos(tilt) - cl * cd * Math.sin(tilt)), z: sl * Math.sin(tilt) + cl * cd * Math.cos(tilt) }
        }
        function ringToPath(ring2) {
          var dd = '', open3 = false, prev2 = null, prevP = null
          for (var qi = 0; qi <= ring2.length; qi++) {
            var cur2 = ring2[qi % ring2.length]
            var p2 = proj(cur2[0], cur2[1])
            if (!prevP) { prevP = p2; prev2 = cur2; continue }
            var pv = prevP.z >= 0, cv = p2.z >= 0
            if (pv && cv) { dd += (open3 ? 'L' : 'M') + p2.x.toFixed(1) + ',' + p2.y.toFixed(1); open3 = true }
            else if (pv !== cv) {
              var lo = 0, hi = 1, hp = null
              for (var bi2 = 0; bi2 < 9; bi2++) {
                var mid = (lo + hi) / 2
                var ip = [prev2[0] + (cur2[0] - prev2[0]) * mid, prev2[1] + (cur2[1] - prev2[1]) * mid]
                hp = proj(ip[0], ip[1])
                if ((prevP.z >= 0) === (hp.z >= 0)) lo = mid; else hi = mid
              }
              if (pv) { dd += (open3 ? 'L' : 'M') + hp.x.toFixed(1) + ',' + hp.y.toFixed(1) }
              else { dd += 'M' + hp.x.toFixed(1) + ',' + hp.y.toFixed(1) }
              open3 = !pv
            } else open3 = false
            prevP = p2; prev2 = cur2
          }
          return dd
        }
        for (var ri = 0; ri < G.rings.length; ri++) {
          var pe2 = G.coast[ri]
          if (!pe2) continue
          pe2.setAttribute('d', ringToPath(G.rings[ri]))
          pe2.setAttribute('stroke', gcol)
          pe2.setAttribute('stroke-width', String(tlNumber(L.strokeWidth, 1.1)))
        }
        if (G.grid && G.grid.length) {
          var gi3 = 0, mb2, lb2
          for (var li3 = 0; li3 < G.lats.length; li3++) {
            var d3 = '', o3 = false
            for (lb2 = -180; lb2 <= 180; lb2 += 6) {
              var pp = proj(lb2, G.lats[li3])
              if (pp.z >= 0) { d3 += (o3 ? 'L' : 'M') + pp.x.toFixed(1) + ',' + pp.y.toFixed(1); o3 = true } else o3 = false
            }
            var gl = G.grid[gi3++]
            gl.setAttribute('d', d3); gl.setAttribute('stroke', gcol); gl.setAttribute('stroke-opacity', '0.22')
          }
          for (var mi3 = 0; mi3 < G.lons.length; mi3++) {
            var d4 = '', o4 = false
            for (mb2 = -84; mb2 <= 84; mb2 += 6) {
              var p4 = proj(G.lons[mi3], mb2)
              if (p4.z >= 0) { d4 += (o4 ? 'L' : 'M') + p4.x.toFixed(1) + ',' + p4.y.toFixed(1); o4 = true } else o4 = false
            }
            var glm = G.grid[gi3++]
            if (glm) { glm.setAttribute('d', d4); glm.setAttribute('stroke', gcol); glm.setAttribute('stroke-opacity', '0.22') }
          }
        }
        G.outline.setAttribute('stroke', gcol)
        G.outline.setAttribute('stroke-width', String(tlNumber(L.strokeWidth, 1.1)))
        continue
      }

      /* 线描描绘：draw 0→1 时各条描边依次生长（鲸鱼/地球/月球/文字通用） */
      if (it.logo) {
        var dr = Math.max(0, Math.min(1, kfAt(L.keyframes, t, 'draw', 1)))
        var col = L.color || 'var(--dsu-accent)'
        var tgs = it.logo.targets
        for (var ti = 0; ti < tgs.length; ti++) {
          var tel = tgs[ti]
          tel.setAttribute('stroke', col)
          tel.setAttribute('stroke-width', String(tlNumber(L.strokeWidth, 1.2)))
          var ln2 = it.logo.lens[ti] || 0
          var lag = (ti / Math.max(1, tgs.length)) * 0.35
          var local = Math.max(0, Math.min(1, (dr - lag) / Math.max(0.2, 1 - lag)))
          tel.setAttribute('stroke-dasharray', String(ln2))
          tel.setAttribute('stroke-dashoffset', String(ln2 * (1 - local)))
        }
      }

      /* 方块聚合层：assemble 0→1 时方块从散布位置沿弧线收敛到形状点 */
      if (it.blocks && it.blocks.length) {
        /* 容器是锚点（宽高 0）：整组位置 = 图层 pos + 关键帧 offset */
        var bx = (L.pos && L.pos[0] !== undefined ? tlNumber(L.pos[0], 640) : 640) + ox
        var by = (L.pos && L.pos[1] !== undefined ? tlNumber(L.pos[1], 360) : 360) + oy
        var gsz2 = it.gsize || 520
        node.style.left = '0px'; node.style.top = '0px'
        node.style.transform = 'translate(' + (bx - gsz2 / 2) + 'px,' + (by - gsz2 / 2) + 'px) scale(' + sc + ')'
        var asm = Math.max(0, Math.min(1, kfAt(L.keyframes, t, 'assemble', 1)))
        var fluid = 0.9 + 0.1 * Math.sin(t * 0.004)
        for (var bi = 0; bi < it.blocks.length; bi++) {
          var B = it.blocks[bi]
          var lt = Math.max(0, Math.min(1, (asm - B.delay) / Math.max(0.001, 1 - B.delay)))
          var e3 = 1 - Math.pow(1 - lt, 3)
          /* 散布阶段：缓慢漂移 */
          var driftX = Math.sin(t * 0.0013 + B.wob) * B.drift
          var driftY = Math.cos(t * 0.0017 + B.wob) * B.drift * 0.6
          var sx2 = B.sx + driftX, sy2 = B.sy + driftY
          /* 收敛阶段：直线 + 垂直方向的小弧（弧线感） */
          var arc = Math.sin(Math.PI * lt) * (B.sx > 0 ? 34 : -34)
          var dx2 = (B.tx - sx2) * e3 + arc * (1 - Math.abs(0.5 - lt) * 2)
          var dy2 = (B.ty - sy2) * e3
          var finalX = (sx2 + dx2) * fluid
          var finalY = (sy2 + dy2) * fluid
          B.el.style.transform = 'translate3d(' + finalX.toFixed(1) + 'px,' + finalY.toFixed(1) + 'px,0)'
        }
        continue
      }
      /* 逐字出现：typed 0→1 时只显示前 N 个字符（全文始终留在 def.text 里） */
      if (L.type === 'text' && L.box) {
        node.classList.add('dsu-tl-box')
        var bs = Math.max(0.1, Math.min(5, kfAt(L.keyframes, t, 'boxScale', 1)))
        /* 框最小 = 贴着字（padding 4px），1 倍 = 默认，最大 5 倍 */
        node.style.padding = (4 + 12 * bs).toFixed(1) + 'px ' + (6 + 34 * bs).toFixed(1) + 'px'
      }
      /* 文字擦除：wipe 0→1，从左往右（或反向）逐渐露出文字 */
      if (L.type === 'text') {
        var wp = kfAt(L.keyframes, t, 'wipe', 1)
        var wpDir = L.wipeFrom === 'left' ? (1 - wp) : wp
        if (wpDir < 0.999) node.style.clipPath = 'inset(0 0 0 ' + ((1 - wpDir) * 100).toFixed(2) + '%)'
        else if (node.style.clipPath) node.style.clipPath = ''
      }
      if (L.type === 'text' && L.hasTyped) {
        var typed = Math.max(0, Math.min(1, kfAt(L.keyframes, t, 'typed', 1)))
        var full = String(L.text || '')
        var n2 = Math.round(full.length * typed)
        node.textContent = full.slice(0, n2)
        node.classList.toggle('dsu-typing', typed > 0 && typed < 1)
      }
      var tx = baseX + ox, ty = baseY + oy
      if (L.type === 'text' && L.align === 'left') {
        node.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + sc + ') rotate(' + rot + 'deg) skewX(' + skew + 'deg)'
      } else {
        node.style.transform = 'translate(-50%, -50%) translate(' + tx + 'px,' + ty + 'px) scale(' + sc + ') rotate(' + rot + 'deg) skewX(' + skew + 'deg)'
      }
      if (L.type === 'line') {
        var reveal = kfAt(L.keyframes, t, 'reveal', 1)
        node.style.transform += ' scaleX(' + Math.max(0, Math.min(1, reveal)) + ')'
      }
    }
  }

  /** 时间线控制器：编辑器靠它拖播放头（暂停时 seek 也能看任意时刻） */
  var tlCtl = { seek: null, duration: 0 }
  var tlSwap = null

  function exposeTl(ctl) {
    tlCtl = ctl
    try { window.__DSD_TL__ = ctl } catch (e) { /* noop */ }
    try { window.__DSH_STARTUP_TL__ = ctl } catch (e2) { /* noop */ }
  }

  /** 跑时间线：与现有引擎共用暂停、跳过、收尾 */
  /** 外置几何数据：图层写 ringsFile 就从模板资产里取（文件大时别塞进 template.json） */
  function preloadTimelineAssets() {
    var tpl = TEMPLATE || {}
    var layers = Array.isArray(tpl.layers) ? tpl.layers : []
    var jobs = []
    var base = ''
    try { base = String(window.__DSH_STARTUP_TPL_BASE__ || '') } catch (e) { base = '' }
    if (!base) base = '/dsh-startup'
    var id = String(tpl.id || '')
    for (var i = 0; i < layers.length; i++) {
      var L = layers[i]
      if (!L || typeof L !== 'object') continue
      if (L.dotsFile && (!Array.isArray(L.dots) || !L.dots.length) && id) {
        jobs.push((function (layer, file) {
          var url = base + '/template-asset/' + encodeURIComponent(id) + '/' + encodeURIComponent(file)
          return fetch(url, { cache: 'force-cache' })
            .then(function (r) { return r.ok ? r.json() : null })
            .then(function (data) {
              if (Array.isArray(data)) layer.dots = data
              else if (data && Array.isArray(data.dots)) layer.dots = data.dots
            })
            .catch(function () {})
        })(L, String(L.dotsFile)))
      }
      if (L.ringsFile && (!Array.isArray(L.rings) || !L.rings.length) && id) {
        jobs.push((function (layer, file) {
          var url = base + '/template-asset/' + encodeURIComponent(id) + '/' + encodeURIComponent(file)
          return fetch(url, { cache: 'force-cache' })
            .then(function (r) { return r.ok ? r.json() : null })
            .then(function (data) {
              if (Array.isArray(data)) layer.rings = data
              else if (data && Array.isArray(data.rings)) layer.rings = data.rings
              if (data && data.viewW) layer.viewW = data.viewW
            })
            .catch(function () { /* 取不到就用内联/空 */ })
        })(L, String(L.ringsFile)))
      }
    }
    if (!jobs.length) return Promise.resolve()
    return Promise.all(jobs).then(function () {
      /* 数据到齐后必须重建：否则会拿到"先建好的空壳" */
      tlUi = null
    })
  }

  /** 第二幕：把 TEMPLATE2 换上并再跑一遍时间线；没配第二幕就直接返回。 */
  var secondStarted = false
  /* 第二幕分支是否已经自己处理过「第二幕→桌面」退场（v2 主链路据此决定要不要再包 transOut） */
  var secondTransitionDone = false
  function playSecondTemplate() {
    TIMELINE_ACT = 2
    if (secondStarted) { diagRun('second skipped (duplicate)'); return Promise.resolve() }
    secondStarted = true
    diagRun('second enter tlSwap=' + !!tlSwap)
    if (!TEMPLATE2 || !Array.isArray(TEMPLATE2.layers) || !TEMPLATE2.layers.length) {
      return Promise.resolve()
    }
    /* v2.15.9：没有第二幕就不切第二段音乐（原来提前调用，导致「不播放第二幕」也会换曲） */
    bgm.toSecond()
    /* v2.12.0：衔接/退场选择在切换点现场读（设置页「立即预览」会换掉 window.__DSH_STARTUP__） */
    var joinType = transType('Join')
    var joinOverlay = transActive(joinType)
    var joinHardCut = joinType === 'none'
    var outType = transType('Out')
    var outOverlay = transActive(outType)
    var outHardCut = outType === 'none'
    if (!tlSwap) {
      /* 本分支自己负责「第二幕→桌面」退场（v2 主链路据此不再包一层 transOut）。
         ⚠️ v2.12.1 起两幕模板本身**不含任何进出场 fade**：下面的 600ms 淡入/淡出是
         转场引擎对默认 dissolve 的统一实现（模板 JSON 只提供内容与自身关键帧）。 */
      secondTransitionDone = true
      /* 第一幕是 v1 分幕模板：第二幕单独建一层全屏黑底覆盖层，
         盖住第一幕残留的 WELCOME/HUD，避免文字叠在视频上。
         这一层从透明淡入的 600ms 就是默认 dissolve 的衔接实现 —— 默认路径时序逐帧不变。 */
      var oldRoot = root
      var ov = document.createElement('div')
      ov.id = 'dsh-startup-act2'
      ov.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147483600;background:#000;overflow:hidden;opacity:0;transition:opacity 600ms ease'
      try { if (document.body && document.body.appendChild) document.body.appendChild(ov) } catch (eOv0) {}
      root = ov
      TEMPLATE = TEMPLATE2
      TIMELINE = TEMPLATE2.layers
      tlUi = null
      runTimeline._loaded = true
      var aborted = false
      return preloadTimelineAssets().then(function () {
        if (!joinOverlay) {
          /* dissolve = 转场引擎的统一实现：第二幕覆盖层 600ms 淡入（模板本身不含 fade）；
             none = 瞬时就位（硬切，不播任何东西） */
          try {
            if (joinHardCut) ov.style.transition = 'none'
            void ov.offsetWidth
            ov.style.opacity = '1'
          } catch (eFadeIn) {}
          return runTimeline()
        }
        /* 非默认衔接：覆盖动效盖满（换场点）→ 第二幕瞬时就位 → 揭开（第二幕同时开跑） */
        return transPlayCover(joinType).then(function (covered) {
          if (!covered) { aborted = true; return null }
          try { ov.style.transition = 'none'; void ov.offsetWidth; ov.style.opacity = '1' } catch (eJI) {}
          return Promise.all([runTimeline(), transPlayReveal()]).then(function () { return null })
        })
      }).then(function () {
        if (aborted) {
          try { if (ov.parentNode) ov.parentNode.removeChild(ov) } catch (eAbort) {}
          root = oldRoot
          return null
        }
        diagRun('second done (init)')
        if (outOverlay) {
          /* 非默认退场：盖住 → 拆掉第二幕覆盖层露出下面的 DSH 界面 → 揭开 */
          return transPlayCover(outType).then(function (covered2) {
            try { oldRoot.style.display = 'none' } catch (eHideRoot2) {}
            root = oldRoot
            try { if (ov.parentNode) ov.parentNode.removeChild(ov) } catch (eOv2) {}
            if (!covered2) { try { transCleanup() } catch (eTC) {} return null }
            return transPlayReveal()
          })
        }
        if (outHardCut) {
          /* 硬切：不走 600ms 淡出，直接藏旧根、拆覆盖层（与 dissolve 的唯一区别） */
          try { oldRoot.style.display = 'none' } catch (eHideRootH) {}
          root = oldRoot
          try { if (ov.parentNode) ov.parentNode.removeChild(ov) } catch (eOvH) {}
          return null
        }
        /* dissolve = 转场引擎的统一实现：第二幕覆盖层 600ms 淡出（模板本身不含 fade） */
        try { oldRoot.style.display = 'none' } catch (eHideRoot) {}
        try { ov.style.transition = 'opacity 600ms ease'; ov.style.opacity = '0' } catch (eFadeOut) {}
        return wait(650)
      }).then(function () {
        /* 默认路径收尾：把 root 换回第一幕旧根（现有行为，逐帧不变） */
        if (!outOverlay && !outHardCut) {
          root = oldRoot
          try { if (ov.parentNode) ov.parentNode.removeChild(ov) } catch (eOv) {}
        }
        return null
      })
    }
    /* ── 第一幕本身就是 v2 时间线：tlSwap 换模板（编辑器预览才会走到这里）──────
       默认 dissolve = 现状硬切（不挂覆盖层，时序/诊断行完全不变）；
       非默认 join 在覆盖峰值处换场，第二幕在揭开的同时开始跑。 */
    return new Promise(function (resolve) {
      TEMPLATE = TEMPLATE2
      TIMELINE = TEMPLATE2.layers
      var needsFiles = TIMELINE.some(function (L) {
        return L && ((L.dotsFile && !(Array.isArray(L.dots) && L.dots.length)) ||
                     (L.ringsFile && !(Array.isArray(L.rings) && L.rings.length)))
      })
      if (needsFiles) { try { preloadTimelineAssets().then(resolve, resolve) } catch (e2) { resolve() } } else { resolve() }
    }).then(function () {
      function go() { try { tlSwap(TEMPLATE2) } catch (e1) { /* 换模板失败就跳过第二幕 */ } }
      if (!joinOverlay) { go(); return runTimeline() }
      return transPlayCover(joinType).then(function (covered) {
        if (!covered) return null
        go()
        return Promise.all([runTimeline(), transPlayReveal()]).then(function () { return null })
      })
    }).then(function () { diagRun('second done') })
  }

  function runTimeline() {
    if (!tlUi && !runTimeline._loaded) {
      runTimeline._loaded = true
      return preloadTimelineAssets().then(function () { return runTimeline() })
    }
    var tl = tlUi || (tlUi = buildTimeline())
    var duration = tl.duration
    var elapsed = 0
    if (JUMP && isFinite(Number(JUMP.at))) elapsed = Math.max(0, Math.min(duration - 1, Number(JUMP.at)))
    var cuesFired = {}
    var last = 0
    /* 编辑器预览模式：到终点**不卸层**，停在最后一帧，允许来回拖。
       真实开机没有这个标记，收尾逻辑完全不变。 */
    var myRun = runSeq
    try {
      EDIT = !!window.__DSH_STARTUP_EDIT__ ||
        /[?&]edit=1/.test(String((window.location && window.location.search) || ''))
    } catch (e4) { EDIT = false }
    /* 暴露给编辑器：seek 直接把播放头挪到 ms 并重绘 */
    exposeTl({
      duration: duration,
      setTemplate: function (next) {
        if (!next || typeof next !== 'object') return false
        TEMPLATE = next
        TIMELINE = (Array.isArray(next.layers) && next.layers.length) ? next.layers : null
        function swap() {
          var old = tl
          TEMPLATE = next
          TIMELINE = (Array.isArray(next.layers) && next.layers.length) ? next.layers : null
          if (old.stage && old.stage.parentNode) { try { old.stage.parentNode.removeChild(old.stage) } catch (eR) {} }
          tlUi = null
          runTimeline._loaded = true
          var fresh = buildTimeline()
          old.stage = fresh.stage; old.nodes = fresh.nodes; old.fx = fresh.fx; old.duration = fresh.duration; old.cues = fresh.cues
          tlUi = old
          duration = fresh.duration
          cuesFired = {}
          stopAllAudio()
          applyTimeline(tl, elapsed)
          tlSwap = swap
          return true
        }
        var needsFiles = (Array.isArray(next.layers) ? next.layers : []).some(function (L) {
          return L && ((L.dotsFile && !(Array.isArray(L.dots) && L.dots.length)) || (L.ringsFile && !(Array.isArray(L.rings) && L.rings.length)))
        })
        if (needsFiles) { try { preloadTimelineAssets().then(swap) } catch (eP) {} return true }
        return swap()
      },
      playhead: function () { return elapsed },
      seek: function (ms2) {
        elapsed = Math.max(0, Math.min(duration, Number(ms2) || 0))
        stopAllAudio()
        for (var ci2 = 0; ci2 < tl.cues.length; ci2++) {
          var cc = tl.cues[ci2]
          var endT = Number(cc.t) + (Number(cc.dur) > 0 ? Number(cc.dur) : 1e9)
          cuesFired[ci2] = elapsed >= endT ? 1 : 0
        }
        applyTimeline(tl, elapsed)
      },
      playhead: function () { return elapsed },
      advance: function () { advanceGate() },
      layers: function () { return tl.nodes.length }
    })
    /* ── 简单音频剪辑：每条 cue 支持 偏移(off) / 时长(dur) / 音量(vol) / 淡入淡出 ── */
    var activeAudio = []
    function stopAllAudio() {
      for (var ai = 0; ai < activeAudio.length; ai++) { try { activeAudio[ai].pause() } catch (eA) {} }
      activeAudio = []
    }
    /* ── 音频效果预设：把真人录音处理成"AI/机械"的音色 ── */
    var FX_PRESETS = {
      'ai-mech': { hp: 130, lp: 4200, peak: { f: 260, g: 4, q: 1.0 }, drive: 0.15, ring: 0 },
      'robot': { hp: 180, lp: 3200, peak: { f: 1500, g: 3, q: 0.9 }, drive: 0.35, ring: 42 },
      'radio': { hp: 420, lp: 2800, peak: { f: 1800, g: 5, q: 1.2 }, drive: 0.6, ring: 0 },
      'oldtv': { hp: 220, lp: 2200, peak: null, drive: 0.45, ring: 0 },
      'dark': { hp: 90, lp: 1200, peak: { f: 180, g: 5, q: 0.8 }, drive: 0.1, ring: 0 }
    }
    function driveCurve(amount) {
      var k = Math.max(0, Math.min(1, amount)) * 60
      var n = 1024, curve = new Float32Array(n)
      for (var i = 0; i < n; i++) {
        var x = (i * 2) / n - 1
        curve[i] = ((3 + k) * x * 20 * Math.PI / 180) / (Math.PI + k * Math.abs(x))
      }
      return curve
    }
    function buildFxChain(a, cue, vol) {
      var P = FX_PRESETS[cue.fx]
      if (!P) return null
      var Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      var ctx = window.__DSH_FX_CTX__ || (window.__DSH_FX_CTX__ = new Ctx())
      try { if (ctx.state === 'suspended' && ctx.resume) ctx.resume() } catch (eR) {}
      var srcNode = ctx.createMediaElementSource(a)
      var node = srcNode
      if (P.hp) { var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = P.hp; node.connect(hp); node = hp }
      if (P.lp) { var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = P.lp; node.connect(lp); node = lp }
      if (P.peak) { var pk = ctx.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = P.peak.f; pk.gain.value = P.peak.g; pk.Q.value = P.peak.q; node.connect(pk); node = pk }
      if (P.drive) { var ws = ctx.createWaveShaper(); ws.curve = driveCurve(P.drive); ws.oversample = '2x'; node.connect(ws); node = ws }
      if (P.ring) {
        var ringGain = ctx.createGain(); ringGain.gain.value = 0.55
        var osc = ctx.createOscillator(); osc.frequency.value = P.ring; osc.type = 'sine'
        var modGain = ctx.createGain(); modGain.gain.value = 0.45
        osc.connect(modGain); modGain.connect(ringGain.gain)
        node.connect(ringGain); node = ringGain
        try { osc.start() } catch (eO) {}
      }
      var outGain = ctx.createGain(); outGain.gain.value = vol
      node.connect(outGain); outGain.connect(ctx.destination)
      return { ctx: ctx, src: srcNode, gain: outGain }
    }

    function playCue(cue, elapsedNow) {
      try {
        var url = assetUrl(cue.slot)
        var a = new Audio(url)
        var vol = cue.vol === undefined ? 0.9 : Math.max(0, Math.min(1, Number(cue.vol)))
        /* 音频总线：voice / sfx / amb，各自音量与静音 */
        var busKey = cue.bus || 'voice'
        var busCfg = ((TEMPLATE.audioBuses || {})[busKey]) || {}
        if (busCfg.mute) return
        var busVol = busCfg.vol === undefined ? 1 : Math.max(0, Math.min(1, Number(busCfg.vol)))
        vol *= busVol
        if (vol <= 0.001) return
        var offMs = Math.max(0, Number(cue.off) || 0)
        var durMs = Math.max(0, Number(cue.dur) || 0)
        /* 从播放头所在位置开始：跳过已经过去的那一段，而不是从头播 */
        var skip = Math.max(0, Number(elapsedNow) - Number(cue.t))
        if (durMs > 0 && skip >= durMs) return
        offMs += skip
        if (durMs > 0) durMs = Math.max(50, durMs - skip)
        var fin = Math.max(0, Number(cue.fadeIn) || 0)
        var fout = Math.max(0, Number(cue.fadeOut) || 0)
        a.preload = 'auto'
        var useFx = cue.fx && cue.fx !== 'none' && FX_PRESETS[cue.fx]
        if (useFx) { a.crossOrigin = 'anonymous' }
        a.volume = useFx ? 1 : (fin ? 0 : vol)
        function startAt() {
          try { if (offMs) a.currentTime = offMs / 1000 } catch (eS) {}
          var fxChain = null
          if (useFx) { try { fxChain = buildFxChain(a, cue, vol) } catch (eFx) { fxChain = null } }
          function setVol(v2) { try { if (fxChain && fxChain.gain) fxChain.gain.gain.value = v2; else a.volume = v2 } catch (eS2) {} }
          var p = a.play()
          if (p && p.catch) p.catch(function () { /* 自动播放策略 */ })
          if (fin) {
            var t0 = performance.now()
            var iv = setInterval(function () {
              var k = Math.min(1, (performance.now() - t0) / fin)
              setVol(vol * k)
              if (k >= 1) clearInterval(iv)
            }, 30)
          }
          if (durMs || fout) {
            var stopIn = durMs || 999999
            setTimeout(function () {
              try { a.pause() } catch (eP) {}
            }, stopIn)
            if (fout && durMs > fout) {
              setTimeout(function () {
                var tv = performance.now()
                var iv2 = setInterval(function () {
                  var k2 = 1 - Math.min(1, (performance.now() - tv) / fout)
                  setVol(vol * Math.max(0, k2))
                  if (k2 <= 0) clearInterval(iv2)
                }, 30)
              }, Math.max(0, durMs - fout))
            }
          }
        }
        if (a.readyState >= 1) startAt()
        else a.addEventListener('loadedmetadata', startAt, { once: true })
        activeAudio.push(a)
        if (activeAudio.length > 12) activeAudio.shift()
      } catch (eC) { /* 缺素材不播 */ }
    }

    return new Promise(function (resolve) {
      function loop(now) {
        if (finished) return resolve()
        if (!last) last = now
        var dt = Math.min(120, now - last)
        last = now
        if (!PAUSED && !skipped) elapsed += dt
        applyTimeline(tl, elapsed)
        for (var c = 0; c < tl.cues.length; c++) {
          var cue = tl.cues[c]
          var at = Number(cue.t)
          if (!PAUSED && !skipped && !cuesFired[c] && elapsed >= at) { cuesFired[c] = 1; if (!cue.mute) playCue(cue, elapsed) }
        }
        if (myRun !== runSeq) return   /* 被跳过/收尾：停止本循环 */
        if (elapsed >= duration) {
          if (EDIT) {
            /* 编辑模式：钳在终点、保持循环（暂停时不动），绝不 resolve/卸层 */
            elapsed = duration
            applyTimeline(tl, duration)
            requestAnimationFrame(loop)
            return
          }
          /* v2.12.1：时间线结束**不再加内嵌淡出**（原来的 dsu-out-content + 220ms 尾巴已删）。
             两幕现在是完全独立的片段：片尾一到立即 resolve，边界转场（dissolve/自定义）
             全部由转场引擎按 transitionMs 统一控制，换场点紧贴片尾，不再多等 220ms。 */
          resolve()
          return
        }
        requestAnimationFrame(loop)
      }
      requestAnimationFrame(loop)
    })
  }

  /* ══ 终端层：日志行 + 身份卡 ═══════════════════════════════════════════
     只在该模板声明 style:"terminal" 时启用；档案暖白 / 深海声呐完全不受影响。 */
  var termUi = null
  var CARD_ON = false

  function hashHex(s) {
    var h = 2166136261
    s = String(s || '')
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
    return (h >>> 0).toString(16).toUpperCase().slice(0, 8)
  }

  function ensureTerm() {
    if (!TERMINAL) return null
    if (termUi) return termUi
    if (!root) return null
    var log = el('div'); log.className = 'dsu-term-log'
    var card = el('div'); card.className = 'dsu-term-card'
    root.appendChild(log); root.appendChild(card)
    termUi = { log: log, card: card, cardBuilt: false }
    return termUi
  }

  function termLog(step) {
    var t = ensureTerm(); if (!t) return
    if (CARD_ON) { t.card.classList.remove('on'); CARD_ON = false; root.classList.remove('dsu-term-card-on') }
    var line = el('div'); line.className = 'dsu-term-line'
    var tag = el('span'); tag.className = 'tag'; tag.textContent = '[ OK ] '
    var body = el('span'); body.textContent = (step.logEn || step.log || '')
    line.appendChild(tag); line.appendChild(body)
    t.log.appendChild(line)
    while (t.log.children.length > 7) t.log.removeChild(t.log.firstChild)
    requestAnimationFrame(function () { line.classList.add('on') })
  }

  function termCard(step) {
    var t = ensureTerm(); if (!t) return
    var cfg = (TEMPLATE && TEMPLATE.card) || {}
    if (!t.cardBuilt) { buildCard(t.card, cfg); t.cardBuilt = true }
    fillCard(t.card, step, cfg)
    t.card.classList.add('on')
    CARD_ON = true
    root.classList.add('dsu-term-card-on')
  }

  function buildCard(card, cfg) {
    while (card.firstChild) card.removeChild(card.firstChild)
    var head = el('div'); head.className = 'dsu-term-card-head'
    var en = el('span'); en.className = 'en'; en.textContent = cfg.headEn || 'ACCESS PERMIT'
    var zh = el('span'); zh.className = 'zh'; zh.textContent = cfg.headZh || '身份许可'
    head.appendChild(en); head.appendChild(zh); card.appendChild(head)
    var rule = el('div'); rule.className = 'dsu-term-card-rule'; card.appendChild(rule)

    var body = el('div'); body.className = 'dsu-term-card-body'
    var left = el('div'); left.className = 'dsu-term-card-id'
    var photo = el('div'); photo.className = 'dsu-term-card-photo'; photo.setAttribute('data-photo', '1')
    var cap = el('span'); cap.textContent = cfg.photoCaption || ''
    photo.appendChild(cap); left.appendChild(photo)
    body.appendChild(left)

    var main = el('div'); main.className = 'dsu-term-card-main'
    var no = el('div'); no.className = 'dsu-term-card-no'; no.setAttribute('data-no', '1')
    var name = el('div'); name.className = 'dsu-term-card-name'; name.setAttribute('data-name', '1')
    var fields = el('div'); fields.className = 'dsu-term-card-fields'; fields.setAttribute('data-fields', '1')
    main.appendChild(no); main.appendChild(name); main.appendChild(fields)
    body.appendChild(main)

    var side = el('div'); side.className = 'dsu-term-card-side'
    var qr = el('div'); qr.className = 'dsu-term-card-qr'
    var canvas = el('canvas'); canvas.width = 25; canvas.height = 25
    qr.appendChild(canvas); side.appendChild(qr)
    body.appendChild(side)
    card.appendChild(body)

    /* 右下核验清单：把卡片中间那片空白填满，也让"核验"这件事有层次 */
    var checks = el('div'); checks.className = 'dsu-term-card-checks'; checks.setAttribute('data-checks', '1')
    side.appendChild(checks)

    var foot = el('div'); foot.className = 'dsu-term-card-foot'
    var wave = el('div'); wave.className = 'dsu-term-card-wave'
    for (var w = 0; w < 48; w++) {
      var bar = el('i')
      bar.style.animationDelay = ((w * 37) % 900) + 'ms'
      bar.style.animationDuration = (820 + ((w * 53) % 520)) + 'ms'
      wave.appendChild(bar)
    }
    var ft = el('div'); ft.className = 'foot'; ft.setAttribute('data-footer', '1')
    foot.appendChild(wave); foot.appendChild(ft); card.appendChild(foot)
  }

  function fillCard(card, step, cfg) {
    var idText = String(C.identityId || '0000')
    var serial = (cfg.serialPrefix || 'DSH') + '-' + idText + '-' + hashHex(idText + '|' + C.identity)
    var no = card.querySelector('[data-no]'); if (no) no.textContent = idText
    var nm = card.querySelector('[data-name]')
    if (nm) nm.textContent = String(C.identity || 'OPERATOR').toUpperCase() + (cfg.unit ? '  ·  ' + cfg.unit : '')
    var photo = card.querySelector('[data-photo]')
    if (photo && cfg.avatar && !photo.getAttribute('data-img')) {
      photo.setAttribute('data-img', '1')
      photo.style.backgroundImage = 'url(' + JSON.stringify('/dsh-startup/template-asset/' + encodeURIComponent((TEMPLATE && TEMPLATE.id) || '') + '/' + String(cfg.avatar).replace(/^.*\//, '')) + ')'
    }
    var fields = card.querySelector('[data-fields]')
    if (fields) {
      while (fields.firstChild) fields.removeChild(fields.firstChild)
      var rows = [
        ['证件编号', serial],
        ['签发机构', cfg.issuer || ''],
        ['授权等级', 'LEVEL ' + String(C.accessLevel || '1') + (cfg.levelScope ? ' · ' + cfg.levelScope : '')],
        ['有效期', cfg.validity || ''],
        ['许可范围', cfg.scope || ''],
        ['生物特征', cfg.biometrics || ''],
        ['核验状态', step.cardStatus || cfg.status || '比对完成']
      ]
      for (var r = 0; r < rows.length; r++) {
        if (!rows[r][1]) continue
        var f = el('div'); f.className = 'dsu-term-card-field'
        var lb = el('label'); lb.textContent = rows[r][0]
        var b = el('b'); b.textContent = rows[r][1]
        f.appendChild(lb); f.appendChild(b); fields.appendChild(f)
      }
    }
    var checks = card.querySelector('[data-checks]')
    if (checks) {
      while (checks.firstChild) checks.removeChild(checks.firstChild)
      var list = cfg.checks && cfg.checks.length ? cfg.checks : ['虹膜比对', '指纹比对', '证件校验', '权限判定']
      for (var c2 = 0; c2 < list.length; c2++) {
        var row = el('div')
        var name2 = el('span'); name2.textContent = String(list[c2])
        var ok = el('b'); ok.textContent = 'PASS'
        row.appendChild(name2); row.appendChild(ok); checks.appendChild(row)
      }
    }
    var ft = card.querySelector('[data-footer]'); if (ft) ft.textContent = cfg.footer || ''
    var cv = card.querySelector('canvas'); if (cv) drawQr(cv, serial + (step.cardStatus || ''))
  }

  /* 确定性伪二维码：同一身份每次画出来一样，不同身份不一样（装饰用，不是真二维码） */
  function drawQr(canvas, seed) {
    try {
      var ctx = canvas.getContext('2d'); if (!ctx) return
      var n = canvas.width
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, n, n)
      var h = 2166136261, s = String(seed || '')
      for (var k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619) }
      ctx.fillStyle = '#0b0f13'
      for (var y = 0; y < n; y++) {
        for (var x = 0; x < n; x++) {
          h ^= h << 13; h ^= h >>> 17; h ^= h << 5
          if (((h >>> 0) % 100) < 47) ctx.fillRect(x, y, 1, 1)
        }
      }
      function marker(cx, cy) {
        ctx.fillStyle = '#0b0f13'; ctx.fillRect(cx, cy, 7, 7)
        ctx.fillStyle = '#ffffff'; ctx.fillRect(cx + 1, cy + 1, 5, 5)
        ctx.fillStyle = '#0b0f13'; ctx.fillRect(cx + 2, cy + 2, 3, 3)
      }
      marker(0, 0); marker(n - 7, 0); marker(0, n - 7)
    } catch (e) { /* 装饰品，失败忽略 */ }
  }

  function stepLoop(startIndex, limit) {
    var from = Math.max(0, Math.min(STEPS.length - 1, Number(startIndex) || 0))
    var list = STEPS.slice(from)
    if (typeof limit === 'number' && limit > 0) list = list.slice(0, limit)
    var chain = Promise.resolve()
    list.forEach(function (step, k) {
      var i = from + k
      chain = chain.then(function () { return whenResumed() }).then(function () {
        if (finished) return
        var n = i + 1
        /* 本地补丁：这行读数与身份核验同进退 —— 第 3 幕起收掉。
           原代码只在 finale 里 remove('dsu-in')，所以它会一路挂到终幕。 */
        if (i >= 2) ui.idline.classList.remove('dsu-in')
        setStepCount(n, step.badge)
        setSlats(n)
        setProgress(step.progress)
        setSubtitle(step.log, step.logEn)
        /* 终端风：这一幕要么往日志里加一行，要么整块换成身份卡 */
        if (TERMINAL) {
          if (step.screen === 'card') termCard(step)
          else termLog(step)
        }
        audio.step()
        /* 语音在这里起头，但**不阻塞**下面的文字渐显 —— 两者同时发生 */
        var spoke = voice.line(step.say, step.zh, step.audio)

        ui.status.classList.toggle('dsu-zhline', true)
        /* 先摘掉 dsu-in 并强制一次样式计算，新的逐字 span 才会重新走渐显动画 */
        ui.status.classList.remove('dsu-in')
        ui.subEn.classList.remove('dsu-in')
        void ui.status.offsetWidth
        typeIn(ui.statusZh, step.zh, 46)
        typeIn(ui.subEn, step.en, 13)
        ui.caret.classList.toggle('dsu-on', !!step.action && step.action !== 'auto')
        requestAnimationFrame(function () {
          if (finished) return
          ui.status.classList.add('dsu-in')
          ui.subEn.classList.add('dsu-in')
        })
        ui.rule.classList.add('dsu-in')

        if (step.assembleLogo) assembleLogo()
        if (step.reticle) {
          /* 照原片：准星出现时中央只留状态字，鲸鱼标识和虚线收掉，别挤成一团 */
          ui.logo.classList.remove('dsu-in')
          ui.dots.hidden = true
          ui.reticle.classList.add('dsu-in')
          sweep()
        }
        if (step.hex) startHex()

        /* 这一步停多久 = max(视觉基准, 实际播报时长 + 收尾留白) —— 台词长就多停，
           台词短也不会干等。用户点得快时同样等这一句念完，不掐断。 */
        function holdFor(spoken) {
          var target = Math.max(ms(step.hold), (spoken || 0) + ms(240))
          return wait(Math.max(0, target - (spoken || 0)))
        }

        if (step.action === 'grant' || step.action === 'confirm') {
          showAction(step)
          return wait(520).then(function () { return waitAction() }).then(function () {
            hideAction()
            audio.confirm()
            ui.caret.classList.remove('dsu-on')
            return spoke
          }).then(function () { return wait(ms(320)) })
        }
        if (step.hex) {
          return spoke.then(holdFor).then(function () { stopHex() })
        }
        return spoke.then(holdFor)
      })
    })
    return chain
  }

  function assembleLogo() {
    ui.logo.classList.add('dsu-in')
    ui.dots.hidden = false
    /* 新标识是手写路径：加 cheese-write 触发「先写 C、再补小元素、最后填充」的动画。 */
    var brandSvg = ui.logo.querySelector('svg')
    if (brandSvg) brandSvg.classList.add('cheese-write')
    var path = ui.logo.querySelector('path')
    if (path && !(brandSvg && brandSvg.classList.contains('cheese-write')) && typeof path.getTotalLength === 'function') {
      try {
        var len = path.getTotalLength()
        /* ══ QISHI PATCH 10 · 落墨渐入（0.3 秒）══════════════════════════════
           原来收尾是 "transition: fill 420ms; fill: none → currentColor"。
           问题是 fill 从 none 变成颜色**不是可插值属性**，浏览器只会硬跳 ——
           那 420ms 的过渡形同虚设，黑面是「啪」地一下出现的。
           改法：填充色从头就在（currentColor），只把 fill-opacity 从 0 拉到 1，
           颜色不变、变的是不透明度，任何浏览器都平滑；描边同时 1.1 → 0 收掉。
           时长 300ms，起手时间仍是描线收笔后的 1450ms（跟随 speed 缩放）。 */
        path.style.fill = 'currentColor'
        path.style.fillOpacity = '0'
        path.style.stroke = 'currentColor'
        path.style.strokeWidth = '1.1'
        path.style.strokeDasharray = len
        path.style.strokeDashoffset = len
        /* 参考片的"一笔画成"：先勾线，再落墨成面 */
        path.animate(
          [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { duration: ms(1400), easing: 'cubic-bezier(.55,.06,.24,1)', fill: 'forwards' }
        )
        later(function () {
          path.style.transition = 'fill-opacity ' + ms(300) + 'ms ease, stroke-width ' + ms(300) + 'ms ease'
          path.style.fillOpacity = '1'
          path.style.strokeWidth = '0'
        }, ms(1450))
      } catch (err) { /* Web Animations 不可用时直接落墨 */ }
    }
    return wait(300)
  }

  function showAction(step) {
    pendingGateStep = step
    /* ══ QISHI PATCH 4/4 · 这一幕换成登录表单 ══════════════════════════════
       原版在这里画一张「身份名称 / 身份编号 / 权限等级」的只读卡，点一下就算
       确认身份。现在把卡的位置让给真实表单（账号 + 口令），按钮文案也跟着换；
       核验成功后由登录层把真实姓名/编号/权限回填到卡片的只读行里。 */
    var bridge = qishiBridge()
    if (step.action === 'confirm' && bridge && bridge.mount) {
      ui.card.hidden = false
      ui.card.innerHTML = ''
      ui.btnZh.textContent = bridge.btnZh || '验证身份'
      ui.btnEn.textContent = bridge.btnEn || 'VERIFY IDENTITY'
      ui.hint.innerHTML = bridge.hint || '输入身份名称与访问口令，按 <kbd>Enter</kbd> 核验'
      try {
        bridge.mount({ card: ui.card, btn: ui.btn, hint: ui.hint, btnZh: ui.btnZh, btnEn: ui.btnEn })
        ui.action.classList.add('dsu-in')
        ui.btn.classList.add('dsu-pulse')
        return
      } catch (eMount) {
        /* 桥坏了就退回原生身份卡，宁可少个登录框也不许卡在黑幕里 */
        ui.card.innerHTML = ''
      }
    }
    ui.btnZh.textContent = step.btnZh
    ui.btnEn.textContent = step.btnEn
    ui.card.hidden = step.action !== 'confirm'
    if (step.action === 'confirm') {
      ui.card.innerHTML = ''
      /* 纯中文标签 + 数字/名称，去掉英文双写与主机行，别堆信息 */
      var rows = [
        ['身份名称', C.identity, true],
        ['身份编号', C.identityId, false],
        ['权限等级', C.accessLevel, false]
      ]
      rows.forEach(function (r) {
        var row = el('div', 'dsu-card-row')
        row.appendChild(el('span', null, r[0]))
        row.appendChild(el('b', r[2] ? 'dsu-zhname' : null, r[1]))
        ui.card.appendChild(row)
      })
    }
    ui.hint.innerHTML = '按 <kbd>Enter</kbd> / <kbd>Space</kbd>，或点击按钮继续'
    ui.action.classList.add('dsu-in')
    ui.btn.classList.add('dsu-pulse')
  }

  function hideAction() {
    ui.action.classList.remove('dsu-in')
    ui.btn.classList.remove('dsu-pulse')
  }

  function finale(skipFinish, holdOpen) {
    if (finished) return Promise.resolve()
    /* v2.12.0：第二幕→桌面转场（每次收尾现读配置）。
       holdOpen=true 时（第一幕→v2 第二幕的衔接场景）退场由 playSecondTemplate 负责。 */
    var outType = transType('Out')
    var outOverlay = transActive(outType)
    var outHardCut = outType === 'none'
    setStepCount(6, 'WELCOME')
    setSlats(6)
    setProgress(1)
    /* 底部日志和终幕里的「欢迎 xxx 访问」区分开，避免同一句出现两遍 */
    setSubtitle('身份验证完成，会话已建立', 'IDENTITY VERIFIED · SESSION ESTABLISHED')
    audio.chime()
    /* 终幕欢迎语：用从 Video Project 3 截出来的真声素材（line-6）。
       素材缺失 / voiceSource=tts / voice 关闭时自动静音，不会退回 TTS 念白 ——
       因为这条素材是「欢迎访问」整句，和动态身份名称无关。 */
    /* 05→06 的过场和声钟约 1.5 秒。旧行为是钟声一响欢迎语就开口，听感太挤；
       现在按配置等钟声收尾再进最后一句，默认 1500ms，可在设置里微调。 */
    var welcomeDelay = Number(C.welcomeDelay)
    if (!isFinite(welcomeDelay)) welcomeDelay = 1500
    welcomeDelay = Math.max(0, Math.min(3000, welcomeDelay))
    var welcome = wait(welcomeDelay).then(function () { return voice.line(null, null, 'line-6') })

    ui.status.classList.remove('dsu-in')
    ui.subEn.classList.remove('dsu-in')
    ui.rule.classList.remove('dsu-in')
    ui.reticle.classList.remove('dsu-in')
    stopHex()
    /* 中央区（状态行/分隔线/鲸鱼/虚线）整体退场：不清掉会和 WELCOME 版式叠字 */
    ui.center.classList.add('dsu-off')
    ui.dots.hidden = true

    return wait(360)
      .then(function () {
        ui.welcome.classList.add('dsu-in')
        ui.idline.classList.remove('dsu-in')
        return wait(420)
      })
      .then(function () {
        /* 结尾色散故障：分片位移 + 0.5px 模糊 + 混合模式，读起来像镜头色散 */
        var targets = [ui.w1, ui.w2, ui.w4]
        targets.forEach(function (t) {
          t.classList.add('dsu-glitch')
          t.setAttribute('data-text', t.textContent)
        })
        ui.w2.classList.add('dsu-glitch-box')   /* 黑底白字那块换加色混合 */
        void ui.welcome.offsetWidth
        targets.forEach(function (t) { t.classList.add('dsu-on') })
        return wait(640)
      })
      /* 光晕从中心炸开 + 变形光条横扫 + 文字青色 halation */
      .then(function () {
        root.classList.add('dsu-peak')
        ui.bloom.classList.add('dsu-go')
        ui.streak.classList.add('dsu-go')
        return wait(430)
      })
      /* 光晕最亮那一下补一记极短高光（是"眨一下"，不是长时间糊白） */
      .then(function () {
        ui.flash.style.transition = 'opacity ' + ms(70) + 'ms linear'
        ui.flash.style.opacity = '0.72'
        return wait(90)
      })
      .then(function () {
        ui.flash.style.transition = 'opacity ' + ms(340) + 'ms cubic-bezier(0.4, 0, 0.2, 1)'
        ui.flash.style.opacity = '0'
        return wait(320)
      })
      /* 欢迎语没播完就不揭幕（素材缺失时这个 Promise 立刻 resolve，不影响节奏） */
      .then(function () { return welcome })
      /* 揭幕两段：① 内容先化进自己的底色（200ms）② 机位后撤 + 底色淡出（420ms）。
         两段加起来 620ms，和 finish() 的移除定时器对齐。
         ⚠️ v2.12.1 起这是**转场引擎对默认 dissolve 的实现**（模板本身不含 fade）：
         自定义 out 类型会跳过这两段、由 transOut 的 cover→finish→reveal 接管，绝不叠加。 */
      .then(function () {
        if (holdOpen || outOverlay || outHardCut) return wait(0)
        root.classList.add('dsu-out-content')
        return wait(200)
      })
      .then(function () {
        if (holdOpen || outOverlay || outHardCut) return
        root.classList.add('dsu-handoff')
        return wait(440)
      })
      .then(function () {
        if (skipFinish) return
        /* v2.12.0：非默认退场 —— 覆盖层动效盖住 → 原 finish（收尾/卸根）→ 揭开；
           'none' 直接 finish（硬切，不再走两段淡出）。默认 dissolve 原路不变。 */
        if (outOverlay) return transOut(outType, finish)
        return finish()
      })
  }

  function finish() {
    bgm.stop()
    if (iframeCleanup) { try { var cleanIframe = iframeCleanup; iframeCleanup = null; cleanIframe() } catch (eIframe) { /* noop */ } }
    if (finished) return
    diagRun('finish videos=' + videoCount())
    finished = true
    document.removeEventListener('keydown', onSkipKey)
    invalidateRun()   /* 取消体系：本次播放的延时任务全部作废 */
    /* v2.12.0：转场覆盖层兜底清理。transOut 的「揭开」阶段要保留覆盖层，
       此时 transPreserve=true，由 transPlayReveal 负责移除。 */
    if (!transPreserve) { try { transCleanup() } catch (eTrans) { /* 忽略 */ } }
    audio.bedStop()   /* 本地补丁：通道常开，到这里才关 */
    releaseAll()
    stopHex()
    voice.stop()
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null }
    try {
      if (C.mode === 'session') window.sessionStorage.setItem('dsh-startup-screen:shown', '1')
      if (C.mode === 'daily') {
        window.localStorage.setItem('dsh-startup-screen:day', new Date().toISOString().slice(0, 10))
      }
    } catch (err) { /* 隐私模式下不可写，忽略 */ }
    /* 解锁：Host 注入的关键样式用 html.dsu-lock 锁滚动，这里必须一并摘掉，
       否则揭幕后主界面会永远滚不动。 */
    /* 标题栏还回去：移除探针样式会让 DSH 重新测量一次，恢复它自己的颜色 */
    try {
      var capStyle = document.getElementById('dsh-startup-caption')
      if (capStyle && capStyle.parentNode) capStyle.parentNode.removeChild(capStyle)
    } catch (e3) { /* noop */ }
    document.documentElement.classList.remove('dsu-lock')
    document.documentElement.style.overflow = ''
    if (document.body) document.body.style.overflow = ''
    root.classList.remove('dsu-boot')
    /* 正常揭幕时内容与底色都已经淡完，只剩收尾；跳过/异常路径没走两段，用 dsu-gone 兜一层。 */
    var faded = (root.className || '').indexOf('dsu-handoff') !== -1
    root.classList.add('dsu-gone')
    setTimeout(function () {
      if (root && root.parentNode) root.parentNode.removeChild(root)
      try { window.dispatchEvent(new CustomEvent('dsh-startup:done')) } catch (err) { /* noop */ }
    }, faded ? ms(200) : ms(900))
  }

  function requestSkip() {
    if (skipped || finished) return
    skipped = true
    releaseAll()
    finish()
  }

  function onSkipKey(e) { if (e.key === 'Escape') requestSkip() }

  if (C.allowSkip && ui.skip) {
    ui.skip.hidden = false
    ui.skip.addEventListener('click', function (e) { e.stopPropagation(); requestSkip() })
    document.addEventListener('keydown', onSkipKey)
  } else if (ui.skip) {
    ui.skip.hidden = true
  }

  /* 对外 API：settings 面板里的"立即预览"按钮和重播都走它 */
  window.__DSH_STARTUP_API__ = {
    steps: STEPS,
    template: (TEMPLATE && TEMPLATE.id) || '',
    pause: pause,
    resume: resume,
    paused: function () { return PAUSED },
    seek: function (ms2) { try { return tlCtl.seek ? tlCtl.seek(ms2) : null } catch (e) { return null } },
    duration: function () { return tlCtl.duration || 0 },
    /* 设置页试听与冒烟测试用：直接念一行 */
    speak: function (en, zh) { voice.say(en, zh) },
    speakName: function (n) { return voice.speakName(n) },
    get voice() { return voice.current() },
    replay: injectSelf,
    skip: requestSkip,
    finish: finish,
    config: C
  }

  /* 锁滚动，动画期间不露出下面的应用 */
  document.documentElement.classList.add('dsu-lock')
  document.documentElement.style.overflow = 'hidden'
  if (document.body) document.body.style.overflow = 'hidden'
  setProgress(0.05)
  root.classList.remove('dsu-boot')

  function startIntro() {
    var context = C.waitForSoundGesture && C.sound ? audio.ctx() : null
    if (!context || context.state === 'running') return run()

    /* Start the timeline with the sound, so its first cue cannot queue before playback is allowed. */
    var controls = el('div', 'qishi-start-controls')
    var play = el('button', 'qishi-start-play', '播放开场')
    play.type = 'button'
    controls.appendChild(play)
    if (C.allowSkip) {
      var skip = el('button', 'qishi-start-skip', '跳过')
      skip.type = 'button'
      skip.addEventListener('click', requestSkip)
      controls.appendChild(skip)
    }
    ui.black.appendChild(controls)
    play.focus()
    play.addEventListener('click', function () {
      if (finished) return
      try { context.resume().catch(function () {}) } catch (e) { /* Audio unavailable */ }
      controls.remove()
      run()
    }, { once: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startIntro, { once: true })
  } else {
    startIntro()
  }
})()
