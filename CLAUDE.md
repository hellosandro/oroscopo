# Oroscopo da scontrino

Minisito statico che mostra l'oroscopo settimanale di Rob Brezsny (Free Will Astrology), tradotto in italiano, impaginato per essere stampato su una stampante termica da 58mm.

## Chi sono e come lavorare con me

- Sono un grafico, non uno sviluppatore. Spiegami le cose tecniche in modo semplice, passo per passo, senza dare per scontato che conosca il terminale o Git.
- Amo la bella tipografia e il minimalismo: ogni scelta visiva deve essere sobria e intenzionale. Niente decorazioni superflue, niente colori.
- Quando dai orari, usa sempre il fuso orario italiano (CET/CEST).
- Prima di modifiche grosse alla grafica, mostrami cosa cambi e aspetta il mio ok.
- Rispondimi in italiano.
- Lavora direttamente sul branch `main`: niente rami di prova.

## Stack

- HTML + CSS + un po' di JavaScript vanilla. Nessun framework, nessun passaggio di build.
- Codice su GitHub, pubblicato su Vercel (deploy automatico a ogni push sul branch `main`).
- Font da Google Fonts: solo Manuale (pesi 300, 400, 700, 800; il 300 solo per la data nel titolo della home).

## Struttura

```
/
├── index.html          → home: elenco dei 12 segni
├── segno.html          → pagina del singolo segno (lo "scontrino")
├── nota.html           → note e disclaimer, in italiano e inglese (URL pulito /nota)
├── style.css           → stili condivisi
├── app.js              → legge i dati e riempie le pagine
├── data/
│   └── settimana.json  → testi della settimana (l'unico file da aggiornare ogni settimana)
├── glifi/              → un SVG per segno (pesci.svg, vergine.svg, …)
├── illustrazioni/      → un'illustrazione a colori per segno, ritagliata da originale.svg
├── icone/              → icona della web app (apple-touch-icon 180px, 192/512px) e favicon: simbolo astrologico nero su bianco
├── vercel.json         → URL puliti: /pesci → segno.html?s=pesci
└── CLAUDE.md
```

## Formato di `data/settimana.json`

```json
{
  "settimana": "22—28 ott 2026",
  "autore": "Rob Brezsny",
  "segni": [
    {
      "slug": "pesci",
      "nome": "Pesci",
      "paragrafi": [
        "Primo paragrafo…",
        "Secondo paragrafo…"
      ],
      "originale": {
        "nome": "Pisces",
        "paragrafi": ["First paragraph…", "Second paragraph…"]
      }
    }
  ],
  "originale": { "settimana": "22—28 Oct 2026" }
}
```

`originale` contiene il testo inglese di Brezsny, diviso negli stessi paragrafi della traduzione, con apostrofi e virgolette tipografici (’ “ ”).

Ordine dei segni: Ariete, Toro, Gemelli, Cancro, Leone, Vergine, Bilancia, Scorpione, Sagittario, Capricorno, Acquario, Pesci.

## Design dello scontrino (non cambiarlo senza chiedermelo)

- Carta 58mm, area stampabile 48mm, margine laterale interno 1,5mm.
- `@page { size: 58mm …; margin: 0; }`: la carta è in rotolo, quindi la lunghezza è variabile e `app.js` la imposta segno per segno in base al testo. Di solito 10–12 cm: se uno scontrino supera i 13 cm circa, avvisami.
- Solo nero puro `#000` su bianco: niente grigi, niente sfumature (la stampa termica li rende male).
- Modo scuro: di base segue l'impostazione del dispositivo (`prefers-color-scheme: dark`); nel footer "dark | light" (dopo le lingue, prima di "note", stesso stile, quello attivo in 700) lo forza e la scelta resta salvata nel browser. Solo a schermo: bianco puro `#fff` su nero puro `#000`, simboli invertiti in bianco, illustrazioni a colori invariate. I colori sono le variabili `--carta` e `--inchiostro` in `style.css`. In stampa sempre nero su bianco. Con Snap&tag in modo scuro lo scontrino esce nero: non importa.
- Testata: nome del segno a sinistra in Manuale 800, 19.5pt (lo stesso per tutti: è il corpo con cui ci sta Capricorno, il nome più lungo), interlinea 0.85, tracking −0.02em. Simbolo del segno a destra, SVG a tratto 9×9mm, `stroke-width` 8 su viewBox 100, estremità arrotondate.
- Riga tratteggiata 1px sotto la testata e sopra la firma, margine verticale 2,2mm.
- Testo: Manuale 400, 8pt, interlinea 1.32, sillabazione automatica (`lang="it"`, `hyphens: auto`), allineato a sinistra. Nessuno spazio tra i paragrafi: dal secondo in poi rientro di prima riga di 1em.
- Firma: su una riga, Manuale 700, 6.5pt, maiuscolo, tracking 0.06em. "ROB BREZSNY" a sinistra, data della settimana a destra.
- Nessun altro elemento: niente nome del sito, niente date del segno, niente box evidenziati.
- A schermo niente zoom: tutte le misure dello scontrino (mm e pt) sono moltiplicate per una scala `--s` in `style.css` (1 in stampa). Computer e finestre da 481px: scala 1,5434 (testo circa 16,5px, titoli circa 40px), colonna fissa di 280 pixel, centrato su pagina bianca (nessun fondo colorato, nessun bordo), senza pulsanti (si stampa con il comando del browser o con Snap&tag). In stampa solo lo scontrino, fondo bianco, nessun margine.
- In fondo alla pagina, solo a schermo, un footer "english | italiano": centrato, agganciato al bordo in basso (24px dal fondo; se la pagina è più lunga dello schermo, dopo tutto il resto), Manuale 15px, la lingua attiva in 700. Serve per passare dall'originale alla traduzione; la scelta resta per gli altri segni. In inglese cambiano nome del segno, testo (con `lang="en"` per la sillabazione) e data della firma.
- Il nome del segno è un link all'elenco dei segni (la home): nessun segno visivo, sottolineato solo al passaggio del mouse.
- Al computer (da 960px), a destra dello scontrino, l'illustrazione a colori del segno (`illustrazioni/<slug>.svg`), larga 420 pixel, allineata in alto, a 64 pixel dallo scontrino. Con finestre più strette (481–959px) sta sotto lo scontrino, larga 280 pixel come lo scontrino. Sul telefono sta sotto lo scontrino, a tutta larghezza con gli stessi margini del testo, 16px (Snap&tag la stampa insieme allo scontrino: scelta voluta). Non compare nella stampa dal browser. Le illustrazioni vengono da `illustrazioni/originale.svg`: "Zodiac sign collection" di pikisuperstar su Magnific (https://www.magnific.com/premium-vector/zodiac-sign-collection_15184288.htm), licenza Premium a nome di Sandro, scaricata il 25 ott 2026: uso illimitato senza obbligo di citazione.
- Sul telefono (schermi fino a 480px): pagina bianca, colonna a tutta larghezza con 16px di margine laterale (testo, righe tratteggiate e illustrazione), su tutte le pagine. Testo a 18px (scala `--s` 1,6875, che vale anche per firma, spazi e righe) e titoli a 31,5px: nomi dei segni, titolo della home e simboli usano una scala a parte, `--st` 1,2115. Sugli schermi più larghi le righe diventano solo più lunghe, al massimo fino a 480px. La lunghezza di stampa si misura su una copia invisibile a 48mm con entrambe le scale a 1.

## Simboli (riferimento, viewBox 0 0 100 100)

- Pesci: `M24 8 C46 30 46 70 24 92` · `M76 8 C54 30 54 70 76 92` · `M28 50 H72`
- Bilancia: `M10 82 H90` · `M10 62 H31 A22 22 0 1 1 69 62 H90`
- Vergine: `M12 30 V84` · `M12 40 C12 24 34 24 34 40 V84` · `M34 40 C34 24 56 24 56 40 V72 C56 92 84 90 86 72 C88 58 72 60 66 92`

Disegna gli altri nove con lo stesso stile: tratto uniforme, geometria semplice, coerenti tra loro. Mostrameli tutti insieme prima di usarli.

## Home (`index.html`)

Minimale, su pagina bianca, con le stesse colonne dello scontrino (45mm di testo, righe tratteggiate).

- Titolo su quattro righe, allineato a sinistra, tutto a 19.5pt come i nomi dei segni: "Oroscopo di" / "Rob Brezsny" in Manuale 800, poi la data in Manuale 300 su due righe, divisa in automatico da `app.js`: "22—28" / "ott 2026"; a cavallo di due mesi "29 ott—4 nov" / "2026"; a cavallo di due anni "29 dic 2026—" / "4 gen 2027".
- Sotto, i 12 segni: ognuno come la testata del suo scontrino (nome Manuale 800 19.5pt), ma con simbolo e spazi sopra/sotto ridotti del 25% (righe più basse del 25%); separati da righe tratteggiate e linkati alla pagina del segno. Anche lo spazio sopra il titolo è ridotto allo stesso modo, così titolo e prima riga partono allineati.
- Computer (da 960px): tre colonne con 6mm di spazio tra l'una e l'altra. Nella prima il titolo, nella seconda Ariete–Vergine, nella terza Bilancia–Pesci. Ingrandita a schermo come lo scontrino.
- Telefono: una colonna sola a tutta larghezza, con il titolo in alto. Righe più basse che al computer (spazi sopra/sotto 8,5px, simboli 28,8px, riga di circa 47px), perché titolo e 12 segni stiano in una schermata di iPhone 13 (l’ultimo segno finisce a circa 718px).
- In fondo, come nelle pagine dei segni, il footer "english | italiano" centrato contro il bordo in basso. In inglese il titolo diventa "Horoscopes by" / "Rob Brezsny" / data inglese, e i segni prendono il nome inglese. La scelta della lingua vale per tutto il sito.

## Note (`nota.html`)

- Link "note" / "notes" nel footer di tutte le pagine, a destra di "english | italiano", staccato di 1,5em.
- Stessa colonna dello scontrino: titolo "Note" / "Notes" come la testata (link alla home), sotto il testo. Segue la lingua scelta.
- Contenuto: sito personale senza scopo di lucro; oroscopi di Rob Brezsny con link a freewillastrology.com e © Rob Brezsny; traduzioni amatoriali e non ufficiali, non riviste né approvate dall'autore; illustrazioni di pikisuperstar (senza citare la licenza); icona del sito con l'attribuzione obbligatoria di Flaticon, il link "Horoscope icons created by Magnific - Flaticon" (https://www.flaticon.com/free-icons/horoscope): licenza gratuita con attribuzione, non toglierlo; simboli, impaginazione e sito di Sandro Stefanelli, con link a https://sandrostefanelli.com; richieste di rimozione con un link "scrivimi" / "write to me" (l'indirizzo non compare nel testo) all'indirizzo iCloud "Nascondi la mia email" 53_razza.bufalo@icloud.com (non usare altri indirizzi).

## Aggiornamento settimanale

Quando ti incollo il testo della pagina "All Signs (printer-friendly)" in inglese:

1. Estrai i 12 oroscopi e la data della settimana.
2. Traducili in italiano naturale e scorrevole, fedele al tono ironico e affettuoso dell'originale. Non riassumere e non aggiungere nulla.
3. Dividi ogni testo in 2–3 paragrafi dove il senso lo suggerisce.
4. Riscrivi `data/settimana.json`, salvando anche l'originale inglese diviso negli stessi paragrafi.
5. Misura la lunghezza di ogni scontrino e segnalami quelli oltre i 13 cm circa.
6. Fammi vedere un'anteprima, poi, solo con il mio ok, fai commit con messaggio `Settimana del <data>` e push su `main`. Vercel pubblica da solo in un paio di minuti.

### A richiesta

Non consulto l'oroscopo ogni settimana, quindi l'aggiornamento si fa solo quando lo chiedo (per esempio "aggiorna l'oroscopo"). In quel caso non serve che incolli il testo: scarica tu https://freewillastrology.com/horoscopes/printer-friendly (il dominio è consentito nelle impostazioni di rete dell'ambiente cloud) e fai i passi 1–6 qui sopra. Se la settimana è la stessa già online, dimmelo e non toccare niente.

L'attività programmata "Oroscopo della settimana" (ogni mercoledì alle 8:47) esiste ma è in pausa: riattivala solo se te lo chiedo.

## Diritti e visibilità

I testi sono di Rob Brezsny e protetti da copyright. Il sito è per uso personale: deve restare privato (Vercel Deployment Protection attiva, `<meta name="robots" content="noindex">` in ogni pagina) finché non ho un permesso esplicito dell'autore per pubblicarlo.
