# Oroscopo da scontrino

Minisito statico che mostra l'oroscopo settimanale di Rob Brezsny (Free Will Astrology), tradotto in italiano, impaginato per essere stampato su una stampante termica da 58mm.

## Chi sono e come lavorare con me

- Sono un grafico, non uno sviluppatore. Spiegami le cose tecniche in modo semplice, passo per passo, senza dare per scontato che conosca il terminale o Git.
- Amo la bella tipografia e il minimalismo: ogni scelta visiva deve essere sobria e intenzionale. Niente decorazioni superflue, niente colori.
- Quando dai orari, usa sempre il fuso orario italiano (CET/CEST).
- Prima di modifiche grosse alla grafica, mostrami cosa cambi e aspetta il mio ok.
- Rispondimi in italiano.

## Stack

- HTML + CSS + un po' di JavaScript vanilla. Nessun framework, nessun passaggio di build.
- Codice su GitHub, pubblicato su Vercel (deploy automatico a ogni push sul branch `main`).
- Font da Google Fonts: solo Manuale (pesi 400, 700, 800).

## Struttura

```
/
├── index.html          → home: elenco dei 12 segni
├── segno.html          → pagina del singolo segno (lo "scontrino")
├── style.css           → stili condivisi
├── app.js              → legge i dati e riempie le pagine
├── data/
│   └── settimana.json  → testi della settimana (l'unico file da aggiornare ogni settimana)
├── glifi/              → un SVG per segno (pesci.svg, vergine.svg, …)
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
      ]
    }
  ]
}
```

Ordine dei segni: Ariete, Toro, Gemelli, Cancro, Leone, Vergine, Bilancia, Scorpione, Sagittario, Capricorno, Acquario, Pesci.

## Design dello scontrino (non cambiarlo senza chiedermelo)

- Carta 58mm, area stampabile 48mm, margine laterale interno 2,5mm.
- `@page { size: 58mm 110mm; margin: 0; }`. Lo scontrino deve restare sotto i 10 cm circa: se un testo è lungo, avvisami invece di allungare la pagina.
- Solo nero puro `#000` su bianco: niente grigi, niente sfumature (la stampa termica li rende male).
- Testata: nome del segno a sinistra in Manuale 800, 26pt, interlinea 0.85, tracking −0.02em. Simbolo del segno a destra, SVG a tratto 9×9mm, `stroke-width` 8 su viewBox 100, estremità arrotondate. Se un nome lungo non ci sta, riduci il corpo solo per quel segno.
- Riga tratteggiata 1px sotto la testata e sopra la firma, margine verticale 2,2mm.
- Testo: Manuale 400, 8pt, interlinea 1.32, sillabazione automatica (`lang="it"`, `hyphens: auto`), allineato a sinistra. Nessuno spazio tra i paragrafi: dal secondo in poi rientro di prima riga di 1em.
- Firma: su una riga, Manuale 700, 6.5pt, maiuscolo, tracking 0.06em. "ROB BREZSNY" a sinistra, data della settimana a destra.
- Nessun altro elemento: niente nome del sito, niente date del segno, niente box evidenziati.
- A schermo: scontrino centrato su fondo `#e9e9e6`, con un pulsante discreto "Stampa" (`window.print()`) nascosto in stampa. In stampa solo lo scontrino, fondo bianco, nessun margine.

## Simboli (riferimento, viewBox 0 0 100 100)

- Pesci: `M24 8 C46 30 46 70 24 92` · `M76 8 C54 30 54 70 76 92` · `M28 50 H72`
- Bilancia: `M10 82 H90` · `M10 62 H31 A22 22 0 1 1 69 62 H90`
- Vergine: `M12 30 V84` · `M12 40 C12 24 34 24 34 40 V84` · `M34 40 C34 24 56 24 56 40 V72 C56 92 84 90 86 72 C88 58 72 60 66 92`

Disegna gli altri nove con lo stesso stile: tratto uniforme, geometria semplice, coerenti tra loro. Mostrameli tutti insieme prima di usarli.

## Home (`index.html`)

Minimale: la data della settimana e i 12 nomi dei segni in Manuale, ciascuno con il suo simbolo, come link alla pagina del segno. Stessa sobrietà dello scontrino.

## Aggiornamento settimanale

Quando ti incollo il testo della pagina "All Signs (printer-friendly)" in inglese:

1. Estrai i 12 oroscopi e la data della settimana.
2. Traducili in italiano naturale e scorrevole, fedele al tono ironico e affettuoso dell'originale. Non riassumere e non aggiungere nulla.
3. Dividi ogni testo in 2–3 paragrafi dove il senso lo suggerisce.
4. Riscrivi `data/settimana.json`.
5. Controlla che nessuno scontrino superi la lunghezza massima e segnalami quelli a rischio.
6. Fammi vedere un'anteprima, poi, solo con il mio ok, fai commit con messaggio `Settimana del <data>` e push su `main`. Vercel pubblica da solo in un paio di minuti.

## Diritti e visibilità

I testi sono di Rob Brezsny e protetti da copyright. Il sito è per uso personale: deve restare privato (Vercel Deployment Protection attiva, `<meta name="robots" content="noindex">` in ogni pagina) finché non ho un permesso esplicito dell'autore per pubblicarlo.
