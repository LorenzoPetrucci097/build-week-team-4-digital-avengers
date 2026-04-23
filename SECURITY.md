# Security Policy

## ⚠️ Responsible Disclosure

Questo repository contiene **materiale didattico di cybersecurity** destinato all'uso esclusivamente in ambienti di laboratorio autorizzati. Tutti i tool, exploit e tecniche documentati sono forniti a scopo educativo e devono essere utilizzati **solamente su sistemi nei quali si dispone di autorizzazione scritta**.

### Contesto di Utilizzo Autorizzato
- ✅ Esercitazioni su **DVWA** (ambiente virtualizzato)
- ✅ Lab su **Metasploit** in ambienti isolati
- ✅ **CTF ufficiali** con permesso degli organizzatori
- ✅ **Test di penetrazione autorizzati** con regolare contratto di engagement
- ✅ **Ambienti di training** con supervisione tecnica

---

## 🚫 Uso Vietato

È **strettamente vietato** utilizzare questo materiale per:

1. **Test su sistemi senza autorizzazione scritta**
   - Applicazioni web di terzi
   - Infrastrutture aziendali
   - Sistemi governativi o critici
   - Device o reti di proprietà altrui

2. **Distribuzione di malware funzionante**
   - Non diffondere exploit compilati
   - Non condividere payload funzionanti al di fuori di contesti autorizzati
   - Non ripubblicare strumenti allo scopo di danneggiare

3. **Utilizzo di credenziali reali di terzi**
   - Non immagazzinare credenziali in questo repo
   - Non utilizzare dati roubati per accesso a sistemi reali
   - Rispettare la privacy altrui

4. **Evasione di meccanismi di sicurezza a fini criminali**
   - WAF bypass per attacchi malevoli
   - Kernel exploit per intrusioni non autorizzate
   - Strumenti di escalazione per fini illeciti

---

## 📋 Checklist di Conformità

**Prima di qualsiasi esercitazione pratica:**

- [ ] Ho ricevuto autorizzazione scritta dal proprietario del sistema
- [ ] Lavoro solo su ambienti virtualizzati o di lab
- [ ] Non utilizzo dati o credenziali reali
- [ ] Non distribuisco exploit al di fuori di questo repository
- [ ] Ho letto e compreso la documentazione didattica
- [ ] Conosco le implicazioni legali dell'hacking non autorizzato

---

## 🔐 Gestione Dati Sensibili

### Cosa NON tracciare in git
```
- Chiavi private (*.key, id_rsa, *.pem)
- Credenziali (.env, secrets, tokens)
- Dump database con dati reali
- PCAP con traffico sensibile
- Wordlist di hash crackati da sistemi reali
```

Consulta `.gitignore` per la lista completa.

### Cosa NON condividere
- Flag da CTF non conclusi (fino alla fine della competizione)
- Dati esfilmati (anche in contesto di lab)
- Screenshot con dati sensibili visibili

---

## ⚖️ Responsabilità Legale

### Avviso di Non Responsabilità
Il team **Digital Avengers** e Epicode Italia **non si assumono alcuna responsabilità** per:
- Danni derivanti dall'uso non autorizzato di questo materiale
- Violazioni di leggi locali, nazionali o internazionali
- Accesso non autorizzato a sistemi informatici
- Furto di dati o proprietà intellettuale altrui

### Normative di Riferimento
- 🔹 **Italia:** Artt. 615-ter, 615-quater, 615-quinquies, 635 Codice Penale (abuso informatico)
- 🔹 **EU:** GDPR (protezione dati), NIS Directive (cybersecurity critica)
- 🔹 **USA:** Computer Fraud and Abuse Act (CFAA)
- 🔹 **Internazionale:** Budapest Convention on Cybercrime

---

## 📧 Contatti e Segnalazioni

Per questioni di **responsible disclosure** o segnalazioni di vulnerabilità nei nostri lab:

**Email di contatto:** [da definire con team lead]

### Processo di Segnalazione
1. Invia una email **privata** (non su GitHub issues pubblici)
2. Descrivere la vulnerabilità in dettaglio
3. Includere step-by-step per riprodurre il problema
4. Attendere 48h per una risposta iniziale
5. Non divulgare pubblicamente prima della patch

---

## 🛡️ Audit e Compliance

Questo repository è sottoposto a:
- ✅ **Code review** prima di ogni commit
- ✅ **Verifica di file sensibili** via `.gitignore`
- ✅ **Log di accesso** tramite GitHub
- ✅ **Attribution tracking** per ogni esercitazione

---

## 📚 Risorse di Apprendimento Ethico

Se desideri imparare la cybersecurity **in modo legale e etico**:

- [Hack The Box](https://www.hackthebox.com/) — Piattaforma CTF legittima
- [TryHackMe](https://www.tryhackme.com/) — Lab gamificati autorizzati
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — Training OWASP
- [PentesterLab](https://pentesterlab.com/) — Corso pratico legale
- [Metasploit Unleashed](https://www.metasploitunleashed.info/) — Documentazione ufficiale

---

## ✍️ Consenso

Utilizzando questo repository, **accetti implicitamente** i termini di questa Security Policy.  
In caso di dubbi o violazioni, contatta immediatamente il team lead.

---

**Ultima modifica:** 23 Aprile 2026  
**Responsabile:** Digital Avengers Security Team  
**Build Week:** Cybersecurity (20–25 Aprile 2026)
