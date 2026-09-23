# 🎓 Laurea Sofia — album fotografico live

Sito per la festa di laurea: ogni invitato apre il link/QR code dal telefono,
sceglie nome e colore, scatta le foto direttamente dalla fotocamera del
telefono e le vede comparire in tempo (quasi) reale nella galleria condivisa,
insieme a tutte le altre.

## Cosa include

- **Home** (`/`) — titolo "Laurea Sofia" con sfondo fotografico, contatore
  foto, galleria che si aggiorna da sola ogni 4 secondi, tasto per scattare
  e caricare una foto, like, download singolo in qualità originale, download
  di tutte le foto in uno zip.
- **Admin** (`/admin`) — protetta da password: elimina qualsiasi foto,
  mostra il QR code da condividere con gli invitati.
- **Modalità TV** (`/admin/tv`) — schermo intero senza pulsanti, pensato
  per essere proiettato durante la festa: mostra le foto a rotazione.
- Ogni foto è caricata **senza compressione**: viene salvata byte per byte
  come scattata dal telefono.
- Ognuno può eliminare **solo le foto che ha scattato lui**; l'admin può
  eliminare tutto.

## 1. Crea il progetto Supabase (gratuito)

1. Vai su [supabase.com](https://supabase.com) → crea un account → **New project**.
2. Una volta creato, vai su **SQL Editor**, apri il file `supabase/schema.sql`
   di questo progetto, copia tutto il contenuto, incollalo nell'editor e premi
   **Run**. Questo crea le tabelle `photos` e `likes`.
3. Vai su **Storage** → **New bucket** → chiamalo esattamente `photos` →
   attiva **Public bucket** → crea.
4. Vai su **Project Settings → API**: ti servono tre valori per il passo 3
   (sotto): `Project URL`, `anon public key`, `service_role key` (quest'ultima
   è segreta, non condividerla mai e non mandarla in chat/email in chiaro).

## 2. Configura il progetto in locale

```bash
npm install
cp .env.local.example .env.local
```

Apri `.env.local` e incolla i valori di Supabase, più:
- `ADMIN_PASSWORD`: la password che userai tu per entrare in `/admin`.
- `ADMIN_SESSION_SECRET`: una stringa casuale a caso (basta incollare
  qualsiasi sequenza lunga e imprevedibile, serve solo internamente).

Poi avvia in locale per provare:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## 3. Metti la foto di sfondo

Il file `public/sfondo.jpg` è già quello che mi hai mandato. Se vuoi
cambiarla, sostituisci semplicemente quel file mantenendo lo stesso nome
(`sfondo.jpg`).

## 4. Pubblica su Vercel

1. Carica questa cartella su un repository GitHub (oppure usa
   `vercel` da riga di comando / trascina la cartella su vercel.com/new).
2. Su [vercel.com](https://vercel.com) → **Add New Project** → importa il
   repository.
3. In **Environment Variables**, aggiungi le stesse variabili che hai messo
   in `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`).
4. Deploy. Dopo qualche secondo avrai il link pubblico, es.
   `https://laurea-sofia.vercel.app`.

## 5. Il giorno della festa

1. Vai su `/admin`, fai login con la tua password.
2. Trovi lì un QR code pronto: stampalo o mostralo, chi lo inquadra entra
   direttamente sul sito.
3. Se vuoi proiettare le foto durante la festa, apri `/admin/tv` sullo
   schermo/TV collegato.

## Note tecniche

- Le foto si aggiornano da sole (polling ogni 4 secondi): nessuno deve fare
  nulla, basta lasciare la pagina aperta.
- Non c'è login con password per gli invitati: chiunque abbia il link può
  caricare foto con il nome che sceglie. Va bene per un evento privato tra
  persone di fiducia; se un domani volessi qualcosa di più rigido, si può
  aggiungere un vero login in un secondo momento.
- Le variabili che iniziano con `NEXT_PUBLIC_` sono visibili nel browser
  (è normale e previsto); `SUPABASE_SERVICE_ROLE_KEY` e `ADMIN_PASSWORD` /
  `ADMIN_SESSION_SECRET` restano invece solo sul server: non vanno mai
  scritte nel codice, solo nelle variabili d'ambiente.
