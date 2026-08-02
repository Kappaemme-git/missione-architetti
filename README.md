# Missione Architetti

Sito dello studio di architettura e interior design di Roberta Marta e Fortunato Pagano, Ascoli Piceno.

Sito statico: solo HTML, CSS e JavaScript. Nessuna dipendenza da installare, nessun passaggio di build.

## Struttura

```
index.html          Homepage
progetti.html       Galleria dei lavori
privacy.html        Informativa privacy e cookie
robots.txt
vercel.json         Cache e intestazioni di sicurezza
assets/
  style.css
  script.js
  img/              Immagini e anteprime dei video
  video/            Video compressi per il web
```

I file sorgente originali (video 4K, grafiche Instagram, logo) restano fuori dal
repository: li esclude `.gitignore`. Il sito usa solo le versioni compresse in
`assets/`, circa 22 MB in tutto contro gli oltre 1,4 GB di partenza.

## Sviluppo in locale

Aprire `index.html` nel browser è sufficiente. Per un server locale:

```bash
python3 -m http.server 8000
```

## Pubblicazione su Vercel

1. Su vercel.com scegliere **Add New → Project** e importare il repository.
2. Framework Preset: **Other**. Build Command e Output Directory vanno lasciati vuoti.
3. Deploy.

Ogni push sul ramo `main` aggiorna il sito online.

## Da completare

- [ ] Riattivare i tag `canonical` in `index.html` e `progetti.html` con il dominio definitivo
- [ ] Aggiungere la sitemap in `robots.txt`
- [ ] Inserire ragione sociale, P.IVA e sede in `privacy.html`
- [ ] Rivedere con Roberta e Fortunato le descrizioni dei progetti in `progetti.html`
- [ ] Aggiungere via e numero civico ai contatti

## Aggiungere un progetto

In `progetti.html` copiare un blocco `<article class="project">`, cambiare numero,
categoria, titolo, descrizione e i percorsi di video e anteprima.

Per comprimere un nuovo video:

```bash
ffmpeg -i originale.mp4 -vf "scale=1100:-2,fps=25" -an \
  -c:v libx264 -preset medium -tune film -crf 24 \
  -pix_fmt yuv420p -movflags +faststart assets/video/nuovo.mp4

ffmpeg -ss 1 -i assets/video/nuovo.mp4 -frames:v 1 -q:v 3 \
  assets/img/nuovo-poster.jpg
```

## Colori

| Colore | Codice    | Uso                        |
|--------|-----------|----------------------------|
| Navy   | `#0D192E` | Sfondi scuri, testo        |
| Oro    | `#C9A44C` | Accenti, link, filetti     |
| Crema  | `#F6F4EF` | Sfondi chiari              |
| Giallo | `#F4EE51` | Solo nel logo              |

Caratteri: Playfair Display per i titoli, Jost per il testo.
