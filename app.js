// Legge data/settimana.json e riempie la home o lo scontrino del segno.

fetch("data/settimana.json")
  .then((risposta) => risposta.json())
  .then((dati) => {
    if (document.getElementById("elenco")) riempiHome(dati);
    if (document.getElementById("scontrino")) riempiSegno(dati);
  });

function riempiHome(dati) {
  document.getElementById("settimana").textContent = dati.settimana;
  const elenco = document.getElementById("elenco");
  for (const segno of dati.segni) {
    const voce = document.createElement("li");
    voce.innerHTML =
      `<a href="${segno.slug}"><span class="nome-segno">${segno.nome}</span>` +
      `<img src="glifi/${segno.slug}.svg" alt=""></a>`;
    elenco.append(voce);
  }

  adattaAlTelefono();
  addEventListener("resize", adattaAlTelefono);
}

function riempiSegno(dati) {
  // /pesci (URL pulito su Vercel) oppure segno.html?s=pesci
  const slug =
    new URLSearchParams(location.search).get("s") ||
    location.pathname.split("/").filter(Boolean).pop();
  const segno = dati.segni.find((s) => s.slug === slug) || dati.segni[0];

  document.title = segno.nome;
  document.getElementById("scontrino").dataset.segno = segno.slug;
  document.getElementById("nome").textContent = segno.nome;
  document.getElementById("glifo").src = `glifi/${segno.slug}.svg`;
  document.getElementById("autore").textContent = dati.autore;
  document.getElementById("data").textContent = dati.settimana;

  adattaAlTelefono();
  addEventListener("resize", adattaAlTelefono);

  const testo = document.getElementById("testo");
  for (const paragrafo of segno.paragrafi) {
    const p = document.createElement("p");
    p.textContent = paragrafo;
    testo.append(p);
  }

  document.fonts.ready.then(impostaLunghezzaPagina);
}

// La carta è in rotolo: la pagina di stampa è lunga quanto lo scontrino.
function impostaLunghezzaPagina() {
  const scontrino = document.getElementById("scontrino");
  const zoom = parseFloat(scontrino.style.zoom) || 1;
  const altezza = scontrino.getBoundingClientRect().height / zoom;
  const millimetri = Math.ceil((altezza * 25.4) / 96) + 1;
  const stile = document.createElement("style");
  stile.textContent = `@page { size: 58mm ${millimetri}mm; margin: 0; }`;
  document.head.append(stile);
}

// Sul telefono la colonna (48mm) viene ingrandita in proporzione
// fino a occupare tutta la larghezza dello schermo.
function adattaAlTelefono() {
  const foglio = document.querySelector(".foglio");
  const telefono = matchMedia("screen and (max-width: 600px)").matches;
  const larghezza = (48 / 25.4) * 96; // 48mm in pixel
  foglio.style.zoom = telefono ? innerWidth / larghezza : "";
}
