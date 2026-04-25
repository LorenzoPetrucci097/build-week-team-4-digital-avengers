#!/usr/bin/env bash
#
# claude-start.sh  (v2)
# Launcher interattivo per Claude Code con scelta del metodo di autenticazione.
#
# Distingue correttamente tra:
#   - Abbonamento Pro/Max  (OAuth, niente API key)
#   - API key Console      (sk-ant-..., a consumo)
#   - OpenRouter           (gateway compatibile Anthropic)
#
# Uso:
#   ./claude-start.sh              → menu standard
#   ./claude-start.sh -- <args>    → passa <args> a Claude Code
#

set -euo pipefail

# ─────────────────────────────────────────────────────────────
# Configurazione percorsi
# ─────────────────────────────────────────────────────────────
KEYS_FILE="${HOME}/.config/claude-launcher/keys.env"

# ─────────────────────────────────────────────────────────────
# Colori
# ─────────────────────────────────────────────────────────────
if [ -t 1 ] && command -v tput >/dev/null 2>&1 && [ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]; then
    BOLD="$(tput bold)"
    DIM="$(tput dim)"
    RED="$(tput setaf 1)"
    GREEN="$(tput setaf 2)"
    YELLOW="$(tput setaf 3)"
    BLUE="$(tput setaf 4)"
    CYAN="$(tput setaf 6)"
    RESET="$(tput sgr0)"
else
    BOLD="" DIM="" RED="" GREEN="" YELLOW="" BLUE="" CYAN="" RESET=""
fi

err()  { printf "%s[ERR]%s %s\n"  "$RED"    "$RESET" "$*" >&2; }
warn() { printf "%s[!]%s %s\n"    "$YELLOW" "$RESET" "$*" >&2; }
info() { printf "%s[i]%s %s\n"    "$CYAN"   "$RESET" "$*"; }
ok()   { printf "%s[OK]%s %s\n"   "$GREEN"  "$RESET" "$*"; }

# ─────────────────────────────────────────────────────────────
# Pre-flight checks
# ─────────────────────────────────────────────────────────────
check_claude_installed() {
    if ! command -v claude >/dev/null 2>&1; then
        err "Claude Code non è installato o non è nel PATH."
        echo
        echo "Installalo con:"
        echo "  ${BOLD}curl -fsSL https://claude.ai/install.sh | bash${RESET}"
        echo
        exit 1
    fi
}

check_keys_file() {
    if [ ! -f "$KEYS_FILE" ]; then
        warn "File chiavi non trovato: $KEYS_FILE"
        info "Le opzioni 2 (API key) e 3/4 (OpenRouter) non saranno utilizzabili."
        info "L'opzione 1 (abbonamento) funzionerà comunque."
        echo
        return 0
    fi

    local perms
    perms="$(stat -c '%a' "$KEYS_FILE" 2>/dev/null || echo "?")"
    if [ "$perms" != "600" ] && [ "$perms" != "400" ]; then
        warn "Permessi del file chiavi: $perms (consigliato: 600)"
        warn "Correggi con: chmod 600 $KEYS_FILE"
    fi
}

# ─────────────────────────────────────────────────────────────
# Caricamento chiavi (solo se il file esiste)
# ─────────────────────────────────────────────────────────────
load_keys() {
    [ -f "$KEYS_FILE" ] || return 0

    while IFS='=' read -r key value; do
        [[ "$key" =~ ^[[:space:]]*# ]] && continue
        [[ -z "${key// }" ]] && continue
        value="${value%\"}"
        value="${value#\"}"
        value="${value%\'}"
        value="${value#\'}"
        if [[ "$key" =~ ^[A-Z_][A-Z0-9_]*$ ]]; then
            export "$key=$value"
        fi
    done < "$KEYS_FILE"
}

# ─────────────────────────────────────────────────────────────
# Pulizia: rimuove TUTTE le variabili di auth Claude
# Da chiamare prima di ogni setup, per partire da zero pulito.
# ─────────────────────────────────────────────────────────────
clear_auth_env() {
    unset ANTHROPIC_API_KEY
    unset ANTHROPIC_AUTH_TOKEN
    unset ANTHROPIC_BASE_URL
    unset ANTHROPIC_DEFAULT_OPUS_MODEL
    unset ANTHROPIC_DEFAULT_SONNET_MODEL
    unset ANTHROPIC_DEFAULT_HAIKU_MODEL
    unset CLAUDE_CODE_OAUTH_TOKEN
    unset CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
}

# ─────────────────────────────────────────────────────────────
# Menu interattivo
# ─────────────────────────────────────────────────────────────
show_menu() {
    clear
    cat <<EOF
${BOLD}${BLUE}╔═══════════════════════════════════════════════════════╗
║       Claude Code Launcher  -  Auth Method Select     ║
╚═══════════════════════════════════════════════════════╝${RESET}

  ${BOLD}[1]${RESET} Abbonamento Pro/Max  ${DIM}(OAuth, uso incluso)${RESET}
       ${DIM}→ login via browser, niente API key necessaria${RESET}

  ${BOLD}[2]${RESET} API Key Anthropic    ${DIM}(sk-ant-..., a consumo)${RESET}
       ${DIM}→ fatturata sul Console, anche se hai abbonamento${RESET}

  ${BOLD}[3]${RESET} OpenRouter (default) ${DIM}(modelli Anthropic via gateway)${RESET}
       ${DIM}→ usa i tuoi crediti OpenRouter${RESET}

  ${BOLD}[4]${RESET} OpenRouter (custom)  ${DIM}(modelli a tua scelta)${RESET}
       ${DIM}→ ti chiedo quali modelli usare per Opus/Sonnet/Haiku${RESET}

  ${BOLD}[q]${RESET} Esci

EOF
}

# ─────────────────────────────────────────────────────────────
# [1] Abbonamento Pro/Max — OAuth
# Niente env var: Claude Code userà i token OAuth salvati in ~/.claude/
# ─────────────────────────────────────────────────────────────
setup_subscription() {
    clear_auth_env

    ok "Modalità: Abbonamento Pro/Max (OAuth)"
    info "Nessuna API key impostata — Claude Code userà i token OAuth."

    if [ ! -d "${HOME}/.claude" ] || [ -z "$(ls -A "${HOME}/.claude" 2>/dev/null)" ]; then
        warn "Non sembri loggato. Al primo lancio, dentro Claude Code fai:"
        warn "  /login"
        warn "Si aprirà il browser per autenticarti col tuo account Pro/Max."
    fi
}

# ─────────────────────────────────────────────────────────────
# [2] API Key Anthropic Console
# ─────────────────────────────────────────────────────────────
setup_anthropic_apikey() {
    clear_auth_env

    if [ -z "${ANTHROPIC_API_KEY_REAL:-}" ]; then
        err "ANTHROPIC_API_KEY_REAL non è settata in $KEYS_FILE"
        info "Generala da: https://console.anthropic.com/settings/keys"
        return 1
    fi

    export ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY_REAL"

    ok "Modalità: API Key Anthropic (a consumo)"
    warn "Verrai fatturato per token consumati sul Console Anthropic."
    info "Questa NON è la modalità abbonamento — anche se hai Pro/Max."
}

# ─────────────────────────────────────────────────────────────
# [3] OpenRouter — mapping automatico Anthropic
# ─────────────────────────────────────────────────────────────
setup_openrouter_default() {
    clear_auth_env

    if [ -z "${OPENROUTER_API_KEY:-}" ]; then
        err "OPENROUTER_API_KEY non è settata in $KEYS_FILE"
        info "Generala da: https://openrouter.ai/settings/keys"
        return 1
    fi

    export ANTHROPIC_BASE_URL="https://openrouter.ai/api"
    export ANTHROPIC_AUTH_TOKEN="$OPENROUTER_API_KEY"
    export ANTHROPIC_API_KEY=""    # Esplicitamente vuota (richiesto da OpenRouter doc)
    export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1

    ok "Modalità: OpenRouter (mapping automatico modelli Anthropic)"
}

# ─────────────────────────────────────────────────────────────
# [4] OpenRouter — modelli custom
# ─────────────────────────────────────────────────────────────
setup_openrouter_custom() {
    clear_auth_env

    if [ -z "${OPENROUTER_API_KEY:-}" ]; then
        err "OPENROUTER_API_KEY non è settata in $KEYS_FILE"
        return 1
    fi

    echo
    info "Inserisci i modelli OpenRouter da usare (INVIO per default)."
    info "Esempi: 'anthropic/claude-opus-4.7', 'z-ai/glm-4.7'"
    echo

    read -r -p "  Opus    [anthropic/claude-opus-4.7]: "    custom_opus
    read -r -p "  Sonnet  [anthropic/claude-sonnet-4.6]: "  custom_sonnet
    read -r -p "  Haiku   [anthropic/claude-haiku-4.5]: "   custom_haiku

    export ANTHROPIC_BASE_URL="https://openrouter.ai/api"
    export ANTHROPIC_AUTH_TOKEN="$OPENROUTER_API_KEY"
    export ANTHROPIC_API_KEY=""
    export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
    export ANTHROPIC_DEFAULT_OPUS_MODEL="${custom_opus:-anthropic/claude-opus-4.7}"
    export ANTHROPIC_DEFAULT_SONNET_MODEL="${custom_sonnet:-anthropic/claude-sonnet-4.6}"
    export ANTHROPIC_DEFAULT_HAIKU_MODEL="${custom_haiku:-anthropic/claude-haiku-4.5}"

    ok "Modalità: OpenRouter (modelli custom)"
    info "  Opus   → $ANTHROPIC_DEFAULT_OPUS_MODEL"
    info "  Sonnet → $ANTHROPIC_DEFAULT_SONNET_MODEL"
    info "  Haiku  → $ANTHROPIC_DEFAULT_HAIKU_MODEL"
}

# ─────────────────────────────────────────────────────────────
# Riepilogo prima del lancio
# ─────────────────────────────────────────────────────────────
show_summary() {
    echo
    echo "${BOLD}Riepilogo sessione:${RESET}"

    if [ -n "${ANTHROPIC_BASE_URL:-}" ]; then
        echo "  Base URL : $ANTHROPIC_BASE_URL"
        echo "  Auth     : ANTHROPIC_AUTH_TOKEN (OpenRouter)"
    elif [ -n "${ANTHROPIC_API_KEY:-}" ]; then
        echo "  Base URL : https://api.anthropic.com (default)"
        echo "  Auth     : ANTHROPIC_API_KEY (Console, a consumo)"
    else
        echo "  Base URL : https://api.anthropic.com (default)"
        echo "  Auth     : OAuth subscription (Pro/Max)"
    fi

    echo "  Working  : $(pwd)"
    echo
    info "Dentro Claude Code, usa ${BOLD}/status${RESET} per verificare il metodo attivo."
    echo
}

# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────
main() {
    check_claude_installed
    check_keys_file
    load_keys

    local choice=""
    local configured=false

    while [ "$configured" = false ]; do
        show_menu
        read -r -p "  Scelta: " choice

        case "$choice" in
            1) setup_subscription          && configured=true ;;
            2) setup_anthropic_apikey      && configured=true ;;
            3) setup_openrouter_default    && configured=true ;;
            4) setup_openrouter_custom     && configured=true ;;
            q|Q)
                info "Uscita."
                exit 0
                ;;
            *)
                warn "Scelta non valida: '$choice'"
                sleep 1
                ;;
        esac

        if [ "$configured" = false ]; then
            echo
            read -r -p "  Premi INVIO per riprovare..." _
        fi
    done

    show_summary

    if [ "${1:-}" = "--" ]; then
        shift
        exec claude "$@"
    else
        exec claude
    fi
}

main "$@"
