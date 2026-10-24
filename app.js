// Legge data/settimana.json e riempie la home o lo scontrino del segno.

fetch("data/settimana.json")
  .then((risposta) => risposta.json())
  .then((dati) => {
    if (document.getElementById("elenco")) riempiHome(dati);
    if (document.getElementById("scontrino")) riempiSegno(dati);
  });

function riempiHome(dati) {
  document.getElementById("autore").textContent = dati.autore;
  const [prima, seconda] = dividiData(dati.settimana);
  const settimana = document.getElementById("settimana");
  settimana.append(prima, document.createElement("br"), seconda);
  const elenco = document.getElementById("elenco");
  for (const segno of dati.segni) {
    const voce = document.createElement("li");
    voce.innerHTML =
      `<a href="${segno.slug}"><span class="nome-segno">${segno.nome}</span>` +
      `<img src="glifi/${segno.slug}.svg" alt=""></a>`;
    elenco.append(voce);
  }

  adattaAlloSchermo();
  addEventListener("resize", adattaAlloSchermo);
}

// Divide la data della settimana in due righe:
// "22—28 ott 2026"     → "22—28"        / "ott 2026"
// "29 ott—4 nov 2026"  → "29 ott—4 nov" / "2026"
// "29 dic 2026—4 gen 2027" → "29 dic 2026—" / "4 gen 2027"
function dividiData(data) {
  const parole = data.split(" ");
  const anno = parole.pop();
  const mese = parole.pop();
  const inizio = parole.join(" ");
  if (/\d{4}/.test(inizio)) {
    const [primo, secondo] = data.split("—");
    return [primo + "—", secondo];
  }
  if (/[a-z]/i.test(inizio)) return [inizio + " " + mese, anno];
  return [inizio, mese + " " + anno];
}

function riempiSegno(dati) {
  // /pesci (URL pulito su Vercel) oppure segno.html?s=pesci
  const slug =
    new URLSearchParams(location.search).get("s") ||
    location.pathname.split("/").filter(Boolean).pop();
  const segno = dati.segni.find((s) => s.slug === slug) || dati.segni[0];

  document.getElementById("scontrino").dataset.segno = segno.slug;
  document.getElementById("glifo").src = `glifi/${segno.slug}.svg`;
  document.getElementById("autore").textContent = dati.autore;

  adattaAlloSchermo();
  addEventListener("resize", adattaAlloSchermo);
  mostraIllustrazione(segno.slug);

  // Footer: english | italiano. La scelta resta per gli altri segni.
  for (const link of document.querySelectorAll("#lingue a")) {
    link.addEventListener("click", (evento) => {
      evento.preventDefault();
      try {
        localStorage.setItem("lingua", link.dataset.lingua);
      } catch {}
      scriviTesto(dati, segno, link.dataset.lingua);
    });
  }
  let lingua = "it";
  try {
    lingua = localStorage.getItem("lingua") || "it";
  } catch {}
  scriviTesto(dati, segno, lingua);
}

// Riempie lo scontrino nella lingua scelta: "it" (traduzione) o "en" (originale).
function scriviTesto(dati, segno, lingua) {
  const inglese = lingua === "en" && segno.originale;
  const testi = inglese ? segno.originale : segno;
  const settimana = inglese ? dati.originale.settimana : dati.settimana;

  document.getElementById("scontrino").lang = inglese ? "en" : "it";
  document.title = testi.nome;
  document.getElementById("nome").textContent = testi.nome;
  document.getElementById("data").textContent = settimana;

  const testo = document.getElementById("testo");
  testo.replaceChildren();
  for (const paragrafo of testi.paragrafi) {
    const p = document.createElement("p");
    p.textContent = paragrafo;
    testo.append(p);
  }

  for (const link of document.querySelectorAll("#lingue a")) {
    link.classList.toggle("attiva", link.dataset.lingua === (inglese ? "en" : "it"));
  }

  document.fonts.ready.then(impostaLunghezzaPagina);
}

// Al computer, accanto allo scontrino, l'illustrazione del segno (se c'è).
function mostraIllustrazione(slug) {
  const illustrazione = document.getElementById("illustrazione");
  illustrazione.onload = () => (illustrazione.hidden = false);
  illustrazione.src = `illustrazioni/${slug}.svg`;
}

// La carta è in rotolo: la pagina di stampa è lunga quanto lo scontrino.
function impostaLunghezzaPagina() {
  const scontrino = document.getElementById("scontrino");
  const zoom = parseFloat(scontrino.style.zoom) || 1;
  const altezza = scontrino.getBoundingClientRect().height / zoom;
  const millimetri = Math.ceil((altezza * 25.4) / 96) + 1;
  let stile = document.getElementById("pagina");
  if (!stile) {
    stile = document.createElement("style");
    stile.id = "pagina";
    document.head.append(stile);
  }
  stile.textContent = `@page { size: 58mm ${millimetri}mm; margin: 0; }`;
}

// A schermo la colonna (48mm) viene ingrandita in proporzione:
// sul telefono fino a tutta la larghezza, al computer fino a 280 pixel.
// In stampa resta a 48mm.
function adattaAlloSchermo() {
  const foglio = document.querySelector(".foglio");
  const telefono = matchMedia("screen and (max-width: 600px)").matches;
  const larghezza = (48 / 25.4) * 96; // 48mm in pixel
  foglio.style.zoom = (telefono ? innerWidth : 280) / larghezza;
}
