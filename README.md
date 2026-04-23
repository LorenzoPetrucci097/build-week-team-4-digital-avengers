# 🛡️ Digital Avengers — Build Week Cybersecurity

> Documentazione tecnica delle esercitazioni pratiche di cybersecurity: pentesting, analisi malware, incident response, exploit development.

## 📋 Panoramica

Repository del team **Digital Avengers** per la **Build Week Cybersecurity** (20–25 Aprile 2026). Raccoglie l'intero ciclo di esercitazioni pratiche: dall'identificazione di vulnerabilità web alla exploitation di sistemi Linux, dall'analisi di malware alla redazione di report professionali.

Tutti i contenuti sono **materiale didattico** destinato esclusivamente a ambienti di laboratorio autorizzati (DVWA, macchine virtuali, CTF ufficiali).

## 👥 Il Team

| Nome | Ruolo |
|------|-------|
| **Lorenzo Petrucci** | Penetration Tester, Lead |
| **Christian Koscielniak Pinto** | Security Analyst |
| **Gabriele Chinnici** | Exploit Developer |
| **Wafa Saghir** | Incident Response |
| **Amy Antonella Acosta Hugo** | Malware Analysis |
| **Domenico Mendola** | Network Security |
| **Corrado Vaccarecci** | Infrastructure Hardening |

## 🗂️ Struttura del Repository

```
.
├── day1/                          # SQL Injection — DVWA
│   ├── Guida_Illustrata_SQLi_DVWA_v2.html
│   ├── Report_Day1_Task01_SQLi_DVWA.pdf
│   └── img/                       # Screenshot SQLi step-by-step
│
├── day2/                          # Cross-Site Scripting (XSS)
│   ├── Guida_Illustrata_XSS_DVWA_v2.html
│   ├── cookie_catcher.py          # Strumento per cattura cookie XSS
│   ├── logs/                      # Dati catturati (CSV, JSONL)
│   ├── Report_XSS_Day2/
│   └── .venv/                     # Environment Python (da escludere)
│
├── day3/                          # Buffer Overflow — Scripting C
│   ├── Script/
│   │   ├── Bof_01.c               # BoF exploit #1
│   │   ├── Bof_02.c               # BoF exploit #2
│   │   ├── menu.c                 # Menu interattivo
│   │   └── input.txt              # Dati test
│   └── report day 3.pdf
│
├── day4/                          # Samba Exploitation
│   ├── Report_Day4_Samba_Exploit_DigitalAvengers.pdf
│   └── img/                       # Screenshot Nessus, Nmap, Samba
│
├── day5/                          # Metasploit Professional
│   └── Report_Giorno5_Metasploit_Professionale.pdf
│
├── CTF-EpicodeHarryP/             # Bonus: HarryPotter Black Box CTF
│   ├── Report_Day3_Bonus_BlackBox_DigitalAvengers.html
│   └── img/                       # Screenshoot exploit chain
│
├── CTF-Jangow01/                  # Task Extra: Jango Web CTF
│   ├── Report_BuildWeek_Task_Extra01_Jangow01_DigitalAvengers.pdf
│   └── img/                       # Netdiscover, Gobuster, kernel exploit
│
├── CTF-LupinOne/                  # CTF Challenge — Lupin Security
│   ├── CTF_LupinOne_Report.pdf
│   └── img/                       # Screenshot della soluzione
│
├── CTF Extra - Il Riccio Pazzo/   # AI-Powered CTF Challenge (Streamlit + OpenAI)
│   ├── Riccio/
│   │   ├── Riccio2.py             # Applicazione Streamlit interactive
│   │   ├── requirements.txt       # Dipendenze Python (OpenAI SDK, etc)
│   │   └── .venv/                 # Environment (escluso da git)
│   └── README.md                  # Documentazione setup
│
├── final_summary/                 # Sintesi progettuale
│
├── README.md                      # Questo file
├── .gitignore                     # Esclusioni sensibili
└── SECURITY.md                    # Policy di sicurezza
```

## 🎯 Task Completati

### Day 1: SQL Injection (SQLi) su DVWA
**Descrizione:** Sfruttamento sistematico della vulnerabilità di iniezione SQL in DVWA, con estrazione dati da database MySQL.  
**Tool:** Burp Suite, DVWA  
**Output:** Guida illustrata HTML + Report PDF (2.2 MB)  
**Status:** ✅ Completato

### Day 2: Cross-Site Scripting (XSS) e Cookie Theft
**Descrizione:** Attacco XSS su DVWA, cattura cookie via Python, analisi dei dati rubati.  
**Tool:** Python (Flask), Burp Suite, DVWA  
**Output:** Guida XSS + Cookie catcher script + Logs CSV/JSONL  
**Status:** ✅ Completato

### Day 3: Buffer Overflow (BoF) — Exploit in C
**Descrizione:** Sviluppo exploit per vulnerabilità di buffer overflow, debugging con GDB, overflow ASLR-aware.  
**Tool:** GCC, GDB, C  
**Output:** Exploit BoF #1, BoF #2 + Menu interattivo  
**Status:** ✅ Completato + **Bonus:** HarryPotter Black Box CTF (report HTML)

### Day 4: Samba Exploitation — Network Pentesting
**Descrizione:** Ricognizione Samba con Nessus/Nmap, identificazione CVE, exploitation con tool custom.  
**Tool:** Nessus, Nmap, Samba, kernel exploit  
**Output:** Report dettagliato con screenshoot della catena di exploit  
**Status:** ✅ Completato

### Day 5: Metasploit Professional
**Descrizione:** Automazione exploit via Metasploit Framework, creazione moduli custom, post-exploitation.  
**Tool:** Metasploit Framework, msfvenom, handler  
**Output:** Report finale Metasploit Professional  
**Status:** ✅ Completato

### Task Extra: CTF Jango Web
**Descrizione:** Challenge web con kernel exploit (CVE-45010), escalazione privilegi, flag finale.  
**Tool:** Gobuster, nmap, kernel exploit, prompt injection  
**Output:** Report PDF con walkthrough completo  
**Status:** ✅ Completato

### Task Extra: CTF Lupin One
**Descrizione:** Sfida di penetration testing indipendente con focus su exploitation e post-exploitation.  
**Tool:** Metasploit, network reconnaissance, privilege escalation  
**Output:** Report dettagliato con screenshots della catena di exploit  
**Status:** ✅ Completato

### Task Bonus: Il Riccio Pazzo — AI-Powered CTF
**Descrizione:** Challenge innovativa che combina Streamlit, OpenAI API e puzzle CTF. Interfaccia interattiva per risolvere enigmi di sicurezza con assistenza IA.  
**Tool:** Streamlit, Python, OpenAI API, Streamlit Secrets  
**Output:** Applicazione web interattiva, source code, documentazione setup  
**Status:** ✅ Completato (Repository GitHub esterno)  
**Link:** https://github.com/Olliys/Riccio-Pazzo-CTF

---

## 🧪 Tech Stack & Tool

| Categoria | Tool | Utilizzo |
|-----------|------|----------|
| **Vulnerability Assessment** | DVWA, DVWS | Target pratiche SQLi/XSS |
| | Nessus | Ricognizione Samba |
| | Nmap | Network mapping, port scanning |
| **Exploit Development** | Burp Suite | Web proxy, intercepting |
| | GDB | Debugging buffer overflow |
| | GCC | Compilation exploit C |
| | Metasploit Framework | Modular exploitation |
| | Kernel exploits (CVE-45010) | Privilege escalation |
| **Data Extraction** | Python 3 | Cookie catcher, scripting |
| | Flask | Web server per XSS payload |
| | MySQL | Database queries (SQLi) |
| **Reporting** | HTML, PDF | Documentazione report |
| | Screenshots | Evidence gathering |
| **Defensive** | WAF (teorico) | Defense evasion (slides) |

---

## 🚀 Quick Start

### 1. Clona il Repository
```bash
git clone https://github.com/digital-avengers/build-week-cybersecurity.git
cd build-week-cybersecurity
```

### 2. Prerequisiti
- **Kali Linux** (o equivalente: Parrot OS, BlackArch)
- **DVWA** (Damn Vulnerable Web Application) — dockerizzato
- **Metasploit Framework** (preinstallato su Kali)
- **GDB + GCC** per exploit C
- **Python 3.x** con pip
- **Nessus** (version gratuita o trial)

### 3. Naviga i Contenuti
Ogni `day*` folder contiene:
- **Guida HTML illustrata** — walkthrough visuale del task
- **Report PDF** — documentazione professionale
- **Artefatti** — script, exploit, logs

Esempio:
```bash
# Visualizza la guida SQLi
cd day1
open Guida_Illustrata_SQLi_DVWA_v2.html

# Leggi il report
open Report_Day1_Task01_SQLi_DVWA.pdf

# Esegui il cookie catcher (day2)
cd ../day2
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # se presente
python cookie_catcher.py
```

### 4. Setup DVWA Locale (opzionale)
```bash
# Docker
docker run -d -p 80:80 -p 3306:3306 vulnerables/web-dvwa:latest

# Accedi su http://localhost:80
# Default: admin / password
```

---

## 📜 Disclaimer

⚠️ **IMPORTANTE**: Questo repository contiene esclusivamente **materiale didattico per ambienti di laboratorio autorizzati**.

- ✅ **Uso Consentito:** DVWA, macchine virtuali personali, CTF ufficiali, ambienti di training con permesso scritto
- ❌ **Uso Vietato:** Sistemi senza autorizzazione, dati reali di terzi, distribuzione di exploit funzionanti
- ⚖️ **Responsabilità:** L'uso improprio è soggetto a leggi locali. Il team non assume responsabilità per danni derivati da uso non autorizzato.

---

## 📄 Licenza

Tutti i diritti riservati — **Uso esclusivamente interno e didattico** (Epicode Build Week 2026).  
Materiale non distribuibile al di fuori del contesto di training autorizzato.

---

## 🔗 Reference

- [DVWA — Damn Vulnerable Web Application](http://www.dvwa.co.uk/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Metasploit Documentation](https://docs.metasploit.com/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)

---

**Build Week:** 20–25 Aprile 2026  
**Team:** Digital Avengers  
**Institution:** Epicode Italia (CS0126IT — Cybersecurity)  
**Last Updated:** 23 Aprile 2026
