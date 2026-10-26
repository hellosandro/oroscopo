// Legge data/settimana.json e riempie la home o lo scontrino del segno.

fetch("data/settimana.json")
  .then((risposta) => risposta.json())
  .then((dati) => {
    if (document.getElementById("elenco")) riempiHome(dati);
    if (document.getElementById("scontrino")) riempiSegno(dati);
  });

// Pagina delle note: non legge i dati, mostra il testo nella lingua scelta.
if (document.getElementById("nota")) {
  collegaLingue((lingua) => {
    for (const testo of document.querySelectorAll("#nota .testo")) {
      testo.hidden = testo.dataset.lingua !== lingua;
    }
    document.getElementById("titolo-nota").textContent =
      lingua === "en" ? "Notes" : "Note";
    document.documentElement.lang = lingua;
    segnaLinguaAttiva(lingua);
  });
}

function riempiHome(dati) {
  document.getElementById("autore").textContent = dati.autore;
  const elenco = document.getElementById("elenco");
  for (const segno of dati.segni) {
    const voce = document.createElement("li");
    voce.innerHTML =
      `<a href="${segno.slug}"><span class="nome-segno"></span>` +
      `<img src="glifi/${segno.slug}.svg" alt=""></a>`;
    elenco.append(voce);
  }

  collegaLingue((lingua) => scriviHome(dati, lingua));
}

// Riempie titolo e nomi dei segni della home nella lingua scelta.
function scriviHome(dati, lingua) {
  const inglese = lingua === "en" && dati.originale;
  document.documentElement.lang = inglese ? "en" : "it";
  document.getElementById("intestazione").textContent = inglese
    ? "Horoscopes by"
    : "Oroscopo di";

  const settimana = document.getElementById("settimana");
  const [prima, seconda] = dividiData(
    inglese ? dati.originale.settimana : dati.settimana
  );
  settimana.replaceChildren(prima, document.createElement("br"), seconda);

  const nomi = document.querySelectorAll("#elenco .nome-segno");
  dati.segni.forEach((segno, i) => {
    nomi[i].textContent =
      inglese && segno.originale ? segno.originale.nome : segno.nome;
  });

  segnaLinguaAttiva(inglese ? "en" : "it");
}

// Footer "english | italiano": ricorda la scelta e la applica a ogni pagina.
function collegaLingue(scrivi) {
  for (const link of document.querySelectorAll("#lingue a[data-lingua]")) {
    link.addEventListener("click", (evento) => {
      evento.preventDefault();
      try {
        localStorage.setItem("lingua", link.dataset.lingua);
      } catch {}
      scrivi(link.dataset.lingua);
    });
  }
  let lingua = "it";
  try {
    lingua = localStorage.getItem("lingua") || "it";
  } catch {}
  scrivi(lingua);
}

function segnaLinguaAttiva(lingua) {
  for (const link of document.querySelectorAll("#lingue a[data-lingua]")) {
    link.classList.toggle("attiva", link.dataset.lingua === lingua);
  }
  document.getElementById("link-nota").textContent =
    lingua === "en" ? "notes" : "note";
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

  mostraIllustrazione(segno.slug);

  collegaLingue((lingua) => scriviTesto(dati, segno, lingua));
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

  segnaLinguaAttiva(inglese ? "en" : "it");

  document.fonts.ready.then(impostaLunghezzaPagina);
}

// Al computer, accanto allo scontrino, l'illustrazione del segno (se c'è).
function mostraIllustrazione(slug) {
  const illustrazione = document.getElementById("illustrazione");
  illustrazione.onload = () => (illustrazione.hidden = false);
  illustrazione.src = `illustrazioni/${slug}.svg`;
}

// La carta è in rotolo: la pagina di stampa è lunga quanto lo scontrino.
// Lo misura su una copia invisibile con le misure di stampa (48mm, scala 1),
// perché a schermo la colonna ha un'altra larghezza.
function impostaLunghezzaPagina() {
  const copia = document.getElementById("scontrino").cloneNode(true);
  copia.removeAttribute("id");
  copia.style.cssText =
    "--s: 1; --st: 1; width: 48mm; position: absolute; left: -10000px; top: 0; visibility: hidden;";
  document.body.append(copia);
  const altezza = copia.getBoundingClientRect().height;
  copia.remove();
  const millimetri = Math.ceil((altezza * 25.4) / 96) + 1;
  let stile = document.getElementById("pagina");
  if (!stile) {
    stile = document.createElement("style");
    stile.id = "pagina";
    document.head.append(stile);
  }
  stile.textContent = `@page { size: 58mm ${millimetri}mm; margin: 0; }`;
}
