# Claude Code Launcher

Launcher interattivo per **Claude Code** su Kali Linux (e qualsiasi sistema bash). Ti permette di scegliere quale provider API usare a ogni avvio: il tuo abbonamento Anthropic ufficiale, OpenRouter con mapping automatico, o OpenRouter con modelli custom.

## Come funziona

Lo script imposta le variabili d'ambiente che Claude Code legge nativamente (`ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY`, ecc.) **solo nella shell della sessione lanciata**. Niente proxy, niente router, niente Node.js — solo bash e variabili d'ambiente, esattamente come raccomandato dalla documentazione ufficiale OpenRouter.

Quando scegli un provider:
- **Anthropic ufficiale**: imposta `ANTHROPIC_API_KEY` con la tua chiave dall'abbonamento.
- **OpenRouter (default)**: imposta `ANTHROPIC_BASE_URL=https://openrouter.ai/api`, `ANTHROPIC_AUTH_TOKEN` con la chiave OpenRouter, e azzera `ANTHROPIC_API_KEY=""` (passaggio richiesto dalla doc OpenRouter).
- **OpenRouter (custom)**: come sopra, più ti chiede quali modelli specifici usare per i ruoli Opus/Sonnet/Haiku.

Le chiavi vivono in `~/.config/claude-launcher/keys.env` con permessi `600` — solo tu puoi leggerle, e non vengono mai esportate nell'ambiente globale del sistema.

## Installazione

```bash
git clone <questo-repo> claude-launcher    # oppure scarica i file manualmente
cd claude-launcher
chmod +x install.sh claude-start.sh
./install.sh
```

L'installer:
1. Copia `claude-start` in `~/.local/bin/`
2. Crea `~/.config/claude-launcher/` con permessi `700`
3. Copia il template `keys.env` (solo se non esiste già) con permessi `600`
4. Ti chiede se vuoi aggiungere l'alias `cc` a `~/.bashrc`

## Configurazione

Modifica le tue chiavi:

```bash
nano ~/.config/claude-launcher/keys.env
```

Devi popolare due variabili:

```bash
ANTHROPIC_API_KEY_REAL=sk-ant-api03-...     # da console.anthropic.com
OPENROUTER_API_KEY=sk-or-v1-...             # da openrouter.ai/settings/keys
```

> **Nota sul nome:** la chiave Anthropic la chiamiamo `ANTHROPIC_API_KEY_REAL` perché lo script imposta dinamicamente `ANTHROPIC_API_KEY` (a volte con la chiave vera, a volte vuota per OpenRouter). Tenerle separate evita confusione.

## Uso

```bash
claude-start          # oppure 'cc' se hai aggiunto l'alias
```

Vedrai:

```
╔══════════════════════════════════════════════════╗
║       Claude Code Launcher  -  Provider Select   ║
╚══════════════════════════════════════════════════╝

  [1] Anthropic (abbonamento ufficiale, default)
  [2] OpenRouter (modelli Anthropic via gateway)
  [3] OpenRouter (modello custom - lo scegli tu)
  [q] Esci

  Scelta:
```

Premi `1`, `2`, o `3`. Lo script imposta le variabili e lancia `claude` (Claude Code) nella stessa shell. Quando esci da Claude Code, le variabili svaniscono insieme alla shell.

### Passare argomenti a Claude Code

```bash
claude-start -- --resume                   # riprende l'ultima sessione
claude-start -- --print "fai X"            # modalità non interattiva
```

Tutto quello che metti dopo `--` viene passato direttamente a `claude`.

## Verifica

Una volta dentro Claude Code:

```
/status
```

Dovresti vedere il base URL e il tipo di auth in uso. Se sei passato da un provider all'altro e Claude Code sembra usare ancora il vecchio account, fai prima:

```
/logout
```

## Quando usare quale provider

| Provider | Quando |
|----------|--------|
| **Anthropic ufficiale** | Default. Il tuo abbonamento copre l'uso, latenza minima, supporto pieno per `/fast` e tutte le feature beta. |
| **OpenRouter (Anthropic mapping)** | Quando l'abbonamento è esaurito, durante outage Anthropic, o se vuoi failover automatico tra provider Anthropic. La doc OpenRouter raccomanda di tenere "Anthropic 1P" come provider top-priority per massima compatibilità. |
| **OpenRouter (custom)** | Quando vuoi sperimentare con modelli non-Anthropic (GLM-4.7, DeepSeek, ecc.). ⚠️ Claude Code è ottimizzato per Anthropic — modelli alternativi possono avere comportamenti imprevisti su tool use complesso. |

## Troubleshooting

**`claude: command not found`**
Claude Code non è installato. Installalo con: `curl -fsSL https://claude.ai/install.sh | bash`

**`ANTHROPIC_API_KEY_REAL non è settata`**
Hai popolato il file `keys.env`? Fai `nano ~/.config/claude-launcher/keys.env`.

**Auth errors quando uso OpenRouter**
Esci da Claude Code, rilancia `claude-start`, e dentro Claude Code fai `/logout` prima di mandare il primo messaggio. Le credenziali cached interferiscono.

**Voglio cambiare provider mid-session**
Esci da Claude Code (`Ctrl+D` o `/exit`) e rilancia `claude-start`. Ogni sessione è isolata.

## File del progetto

```
claude-launcher/
├── claude-start.sh          # script principale
├── keys.env.example         # template chiavi
├── install.sh               # installer one-shot
└── README.md                # questo file
```

## Sicurezza

- `keys.env` ha permessi `600` (rwx solo per te)
- `~/.config/claude-launcher/` ha permessi `700`
- Le API keys non finiscono mai in `~/.bashrc` o nell'environment globale
- Lo script parser di `keys.env` accetta solo righe `KEY=VALUE`, niente esecuzione di comandi arbitrari
