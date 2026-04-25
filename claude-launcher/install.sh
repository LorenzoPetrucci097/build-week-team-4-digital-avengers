#!/usr/bin/env bash
#
# install.sh
# Installa il claude-launcher su Kali Linux (o qualsiasi sistema con bash).
#
# Cosa fa:
#   1. Copia claude-start.sh in ~/.local/bin/
#   2. Crea ~/.config/claude-launcher/ se non esiste
#   3. Copia il template keys.env (solo se non esiste già)
#   4. Imposta i permessi corretti
#   5. Aggiunge un alias 'cc' al ~/.bashrc (opzionale, chiede prima)
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="${HOME}/.local/bin"
CONFIG_DIR="${HOME}/.config/claude-launcher"
KEYS_FILE="${CONFIG_DIR}/keys.env"
BASHRC="${HOME}/.bashrc"

# Colori
if [ -t 1 ]; then
    BOLD="$(tput bold)"; GREEN="$(tput setaf 2)"; YELLOW="$(tput setaf 3)"
    CYAN="$(tput setaf 6)"; RESET="$(tput sgr0)"
else
    BOLD=""; GREEN=""; YELLOW=""; CYAN=""; RESET=""
fi

ok()   { echo "${GREEN}[OK]${RESET} $*"; }
info() { echo "${CYAN}[i]${RESET} $*"; }
warn() { echo "${YELLOW}[!]${RESET} $*"; }

echo "${BOLD}Installazione Claude Launcher${RESET}"
echo

# ─────────────────────────────────────────────────────────────
# 1. Crea ~/.local/bin se non esiste
# ─────────────────────────────────────────────────────────────
mkdir -p "$INSTALL_DIR"
ok "Directory pronta: $INSTALL_DIR"

# ─────────────────────────────────────────────────────────────
# 2. Copia lo script principale
# ─────────────────────────────────────────────────────────────
cp "${SCRIPT_DIR}/claude-start.sh" "${INSTALL_DIR}/claude-start"
chmod +x "${INSTALL_DIR}/claude-start"
ok "Script installato: ${INSTALL_DIR}/claude-start"

# ─────────────────────────────────────────────────────────────
# 3. Prepara la directory di config
# ─────────────────────────────────────────────────────────────
mkdir -p "$CONFIG_DIR"
chmod 700 "$CONFIG_DIR"
ok "Directory config pronta: $CONFIG_DIR"

# ─────────────────────────────────────────────────────────────
# 4. Copia il template keys.env (solo se non esiste già)
# ─────────────────────────────────────────────────────────────
if [ -f "$KEYS_FILE" ]; then
    warn "$KEYS_FILE esiste già — non lo sovrascrivo."
else
    cp "${SCRIPT_DIR}/keys.env.example" "$KEYS_FILE"
    chmod 600 "$KEYS_FILE"
    ok "Template chiavi copiato: $KEYS_FILE (permessi 600)"
fi

# ─────────────────────────────────────────────────────────────
# 5. Verifica che ~/.local/bin sia nel PATH
# ─────────────────────────────────────────────────────────────
if [[ ":$PATH:" != *":${INSTALL_DIR}:"* ]]; then
    warn "~/.local/bin non è nel tuo PATH."
    echo "    Aggiungi questa riga a $BASHRC:"
    echo "    ${BOLD}export PATH=\"\$HOME/.local/bin:\$PATH\"${RESET}"
fi

# ─────────────────────────────────────────────────────────────
# 6. Proponi alias 'cc'
# ─────────────────────────────────────────────────────────────
echo
read -r -p "Vuoi aggiungere l'alias 'cc' a $BASHRC? [y/N] " resp
if [[ "$resp" =~ ^[Yy]$ ]]; then
    if grep -q "alias cc=.*claude-start" "$BASHRC" 2>/dev/null; then
        warn "L'alias 'cc' esiste già in $BASHRC."
    else
        printf "\n# Claude Code Launcher\nalias cc='claude-start'\n" >> "$BASHRC"
        ok "Alias 'cc' aggiunto a $BASHRC"
        info "Ricarica con: source $BASHRC"
    fi
fi

# ─────────────────────────────────────────────────────────────
# Riepilogo finale
# ─────────────────────────────────────────────────────────────
cat <<EOF

${BOLD}${GREEN}Installazione completata!${RESET}

${BOLD}Prossimi passi:${RESET}

  1. Inserisci le tue chiavi API:
     ${BOLD}nano $KEYS_FILE${RESET}

  2. Lancia il launcher:
     ${BOLD}claude-start${RESET}     ${CYAN}# oppure 'cc' se hai aggiunto l'alias${RESET}

  3. Dentro Claude Code, verifica con:
     ${BOLD}/status${RESET}

EOF
