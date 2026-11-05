// Sfondo animato della home: stelle che fluttuano e si legano con fili
// quando sono vicine. Solo a schermo: in stampa il canvas è nascosto.
// Il colore segue il tema (variabili --inchiostro e --carta di style.css).
// Tre piani di profondità: le stelle vicine sono più grandi, più veloci e
// più nere. Il mouse le scosta, un clic su un punto vuoto ne fa nascere altre.

(() => {
  const cielo = document.createElement("canvas");
  cielo.className = "cielo";
  cielo.setAttribute("aria-hidden", "true");
  document.body.prepend(cielo);
  const foglio = document.getElementById("foglio");
  const ctx = cielo.getContext("2d");
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DISTANZA = 150; // oltre questa distanza (in pixel) due stelle non si legano

  let W, H, telefono;
  let stelle = [];
  // puntatore: tx/ty dove si trova, mx/my dove lo sfondo lo "insegue" piano
  let tx = 0, ty = 0, mx = 0, my = 0, puntatoreX = -1e4, puntatoreY = -1e4;

  // cielo sempre uguale a ogni visita
  let seme = 31;
  const caso = () => (seme = (seme * 16807) % 2147483647) / 2147483647;

  function nuovaStella(x, y) {
    const z = caso(); // 0 lontana, 1 vicina
    const v = 0.15 + z * 0.45;
    return {
      x: x ?? caso() * W,
      y: y ?? caso() * H,
      z,
      vx: (caso() - 0.5) * v,
      vy: (caso() - 0.5) * v,
      r: 0.8 + z * 2.2 + caso() * 0.6,
      fase: caso() * 6.3,
    };
  }

  function misura() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    cielo.width = W * dpr;
    cielo.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    telefono = W <= 480;
    seme = 31;
    const quante = Math.round(Math.min(170, (W * H) / 7500));
    stelle = Array.from({ length: quante }, () => nuovaStella());
  }

  // sul telefono le stelle passano dietro al testo: più tenui
  const forza = () => (telefono ? 0.45 : 1);

  // colori del tema attuale, come "r,g,b"
  let INK = "0,0,0", CARTA = "255,255,255";
  function rgb(colore) {
    let h = colore.trim().replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return isNaN(n) ? null : `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  }
  function leggiColori() {
    const stile = getComputedStyle(document.documentElement);
    INK = rgb(stile.getPropertyValue("--inchiostro")) || INK;
    CARTA = rgb(stile.getPropertyValue("--carta")) || CARTA;
  }

  // al computer il cielo si dirada sotto le colonne, così il testo resta pulito
  function radura() {
    if (telefono) return;
    const r = foglio.getBoundingClientRect();
    const sfuma = 90, da = r.left - sfuma, a = r.right + sfuma;
    const g = ctx.createLinearGradient(da, 0, a, 0);
    const bordo = sfuma / (a - da);
    g.addColorStop(0, `rgba(${CARTA},0)`);
    g.addColorStop(bordo, `rgba(${CARTA},1)`);
    g.addColorStop(1 - bordo, `rgba(${CARTA},1)`);
    g.addColorStop(1, `rgba(${CARTA},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(da, 0, a - da, H);
  }

  let tempo = 0;
  function disegna(dt) {
    tempo += dt;
    leggiColori();
    const k = dt / 16;
    mx += (tx - mx) * 0.03;
    my += (ty - my) * 0.03;
    ctx.clearRect(0, 0, W, H);

    for (const s of stelle) {
      // le stelle si scostano dal puntatore
      const dx = s.x - puntatoreX, dy = s.y - puntatoreY, d = Math.hypot(dx, dy);
      if (d < 110 && d > 0) {
        const f = (1 - d / 110) * 2.2 * k;
        s.x += (dx / d) * f;
        s.y += (dy / d) * f;
      }
      // deriva lenta + leggera parallasse: le vicine si spostano di più
      s.x += s.vx * k - mx * s.z * 0.6;
      s.y += s.vy * k - my * s.z * 0.6;
      if (s.x < -20) s.x = W + 20;
      if (s.x > W + 20) s.x = -20;
      if (s.y < -20) s.y = H + 20;
      if (s.y > H + 20) s.y = -20;
    }

    // fili tra stelle vicine dello stesso piano
    ctx.lineWidth = 1;
    for (let i = 0; i < stelle.length; i++) {
      for (let j = i + 1; j < stelle.length; j++) {
        const a = stelle[i], b = stelle[j];
        if (Math.abs(a.z - b.z) > 0.45) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < DISTANZA) {
          const alfa = (1 - d / DISTANZA) * (0.15 + Math.min(a.z, b.z) * 0.45) * forza();
          ctx.strokeStyle = `rgba(${INK},${alfa})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // stelle, con un leggero scintillio
    for (const s of stelle) {
      const luce = 0.35 + s.z * 0.65 - (Math.sin(tempo * 0.0015 + s.fase) + 1) * 0.08;
      ctx.fillStyle = `rgba(${INK},${luce * forza()})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 7);
      ctx.fill();
    }

    radura();
  }

  addEventListener("pointermove", (e) => {
    puntatoreX = e.clientX;
    puntatoreY = e.clientY;
    tx = e.clientX / W - 0.5;
    ty = e.clientY / H - 0.5;
  });

  addEventListener("click", (e) => {
    if (quieto || e.target.closest("a, button")) return;
    for (let i = 0; i < 4; i++) {
      stelle.push(nuovaStella(e.clientX + (caso() - 0.5) * 20, e.clientY + (caso() - 0.5) * 20));
    }
    if (stelle.length > 260) stelle.splice(0, stelle.length - 260);
  });

  addEventListener("resize", () => {
    misura();
    if (quieto) disegna(0);
  });

  // con le animazioni ridotte il cielo è fermo: lo ridisegniamo se cambia il tema
  if (quieto) {
    new MutationObserver(() => disegna(0)).observe(document.documentElement, { attributes: true });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => disegna(0));
  }

  misura();
  if (quieto) {
    disegna(0); // chi ha ridotto le animazioni vede un cielo fermo
  } else {
    let prima = performance.now();
    const ciclo = (ora) => {
      disegna(Math.min(ora - prima, 50));
      prima = ora;
      requestAnimationFrame(ciclo);
    };
    requestAnimationFrame(ciclo);
  }
})();
