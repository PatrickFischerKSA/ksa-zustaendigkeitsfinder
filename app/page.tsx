"use client";

import { FormEvent, useMemo, useState } from "react";

type Entry = { topic: string; people: string[]; aliases?: string };

const names: Record<string, string> = {
  OsM: "Martin von Ostheim",
  ZüT: "Tobias Zürrer",
  RaF: "Felix Rauchenstein",
  GrJo: "Jonas Gresch",
  AlC: "Christian Albrecht",
  GrJ: "GrJ",
  ReRo: "ReRo",
};

const raw: Array<[string, string, string?]> = [
  ["Ämterliste", "OsM", "ämter funktionen"],
  ["Auslandsjahr", "ZüT", "ausland schüler austausch"],
  ["Austauschschüler", "ZüT", "austausch gastschüler"],
  ["Bildungsbroschüre (Jahresbericht)", "OsM", "jahresbericht broschüre"],
  ["EVAK-Koffer Pfäffikon", "OsM", "evakuation notfall"],
  ["FMP Abschlussprüfungen", "RaF/AlC", "fachmaturität prüfung"],
  ["FMP allgemeine Arbeiten inkl. Kick-off", "AlC", "fachmaturität"],
  ["FMP Eröffnung Schuljahr (Briefschaften)", "AlC", "fachmaturität schulstart"],
  ["FMS Abschlussprüfungen", "RaF/AlC", "fachmittelschule prüfung"],
  ["FMS allgemeine Arbeiten inkl. Sitzungen", "AlC", "fachmittelschule"],
  ["Konferenzen (Eröffnung SJ, Fachvorsteher, KLP, RK, SK)", "OsM", "konferenz sitzung"],
  ["Maturaprüfungen", "RaF", "matura abschlussprüfung"],
  ["Maturazeitung / letzter Schultag (LSD)", "ZüT", "matura zeitung letzter schultag"],
  ["Medienauswertung", "OsM", "medien presse"],
  ["Medienmitteilungen", "OsM", "presse kommunikation"],
  ["Sekundarschülerschaftsnachmittag", "ZüT", "sek schüler nachmittag"],
  ["Notenwesen / Zeugnisse", "RaF", "noten zeugnis"],
  ["Öffentlicher Informationsabend", "ZüT", "infoabend information"],
  ["Postwesen Pfäffikon", "GrJo", "post brief paket"],
  ["Promotionskonferenzen (Organisation)", "RaF", "promotion konferenz"],
  ["Rekurse", "OsM", "rekurs beschwerde"],
  ["Schul- und Lehrerstatistik", "RaF/OsM", "statistik lehrer"],
  ["Schulbestätigungen", "RaF", "bestätigung bescheinigung"],
  ["Schüleradministration Pfäffikon", "RaF", "schüler administration pfäffikon"],
  ["Schülerdatenbank", "RaF", "schüler daten"],
  ["Tag der offenen Schulen", "ZüT", "tag offene tür besuch"],
  ["Übertritte", "RaF", "übertritt wechsel"],
  ["Abschlussfeier", "AlC", "abschluss feiern"],
  ["Absenz- und Dispenswesen Schülerschaft", "ZüT", "absenz absenzen dispens urlaub fehlen"],
  ["Archiv Nuolen", "OsM/GrJo", "archiv nuolen"],
  ["Büromaterial / Papiervorräte Nuolen", "GrJo", "papier material büro nuolen"],
  ["Busplanung", "AlC", "bus transport"],
  ["Disziplinarwesen Schülerschaft", "ZüT", "disziplin verhalten"],
  ["Ehemaligenvereine", "OsM", "alumni ehemalige"],
  ["Einsätze von Schulklassen", "ZüT", "klasse einsatz"],
  ["Elternabende 1. Klassen", "ZüT", "eltern abend erste klasse"],
  ["Elterngespräche", "RaF", "eltern gespräch"],
  ["Eröffnung Schuljahr: Orientierung neue 1. KLP", "RaF", "schulstart klassenlehrperson"],
  ["Eröffnung Schuljahr: 1. Schultag", "ZüT", "schulbeginn erster schultag"],
  ["Eröffnung Schuljahr: Infopost 1.-4. Gymi-Klassen", "ZüT", "briefschaften schulstart gymnasium"],
  ["Eröffnung Schuljahr: Infopost 1.-3. FMS-Klassen", "AlC", "briefschaften schulstart fachmittelschule"],
  ["Eröffnung Schuljahr: Infopost 1.-5. K&S-Klassen", "AlC", "briefschaften schulstart kunst sport"],
  ["EVAK-Koffer Nuolen", "OsM", "evakuation notfall"],
  ["Examen", "RaF", "prüfung examen"],
  ["Februarstudienwoche", "ZüT", "studienwoche februar"],
  ["Flyer online / Inserate", "ZüT", "werbung inserat flyer"],
  ["FMP Abschlussfeier", "AlC", "fachmaturität feier"],
  ["FMS Studienwochen", "AlC", "fachmittelschule studienwoche"],
  ["Grittibänz verteilen", "GrJo", "grittibänz"],
  ["Herbststudienwoche", "RaF", "studienwoche herbst"],
  ["Postwesen Nuolen", "GrJo", "post brief paket nuolen"],
  ["Projekttage 2. Gymi-Klassen", "AlC", "projekt tage gymnasium"],
  ["Schnuppertage", "ZüT", "schnuppern besuch"],
  ["Schüleradministration Nuolen", "RaF", "schüler administration nuolen"],
  ["Schuljahresschlussessen", "ZüT", "schluss essen schuljahr"],
  ["SekGymiTage", "ZüT", "sek gymi tage"],
  ["Nachteilsausgleich (NAM)", "ZüT", "nachteil ausgleich nam"],
  ["Spind Nuolen", "GrJo", "schliessfach locker nuolen"],
  ["Suchtprävention", "AlC", "sucht prävention alkohol drogen"],
  ["Unterhalt Kopiergeräte Nuolen", "GrJo", "kopierer drucker nuolen"],
  ["Weihnachtsfeier & Weihnachtsapéro", "AlC/GrJo", "weihnachten apéro"],
  ["Adressdatenbank externe inkl. Abgeberschulen", "OsM/RaF", "adresse externe schule datenbank"],
  ["Administration Q2E", "AlC", "q2e qualität"],
  ["Administration Weiterbildung", "AlC", "weiterbildung fortbildung"],
  ["Aufnahmeprüfungen ordentlich 1. Klasse (AP)", "RaF", "aufnahme prüfung erste klasse"],
  ["Bücherbestellungen", "GrJo", "buch bücher bestellen"],
  ["Büromaterial / Drucksachen / Papiervorräte Pfäffikon", "GrJo", "papier drucksachen büro pfäffikon"],
  ["Fotoarchiv", "GrJo", "foto bild archiv"],
  ["Infoboard", "GrJo", "info board anzeige"],
  ["Jahresterminplan / Schuljahresplan", "ZüT", "termin kalender jahresplan"],
  ["Kranken-App", "RaF", "krank app gesundheit"],
  ["Mitarbeitenden-Präsenz (Ferien, Abwesenheit, SL)", "OsM/GrJo", "personal präsenz ferien abwesenheit"],
  ["Online-Prüfen (Geräte)", "AlC", "online prüfung gerät laptop"],
  ["Personaldatenbank", "OsM", "personal datenbank mitarbeiter"],
  ["Personelles Administration", "OsM", "personal administration"],
  ["Personelles Anstellungen", "OsM/GrJo", "personal anstellung vertrag"],
  ["Personelles Arbeitszeugnisse", "OsM", "personal arbeitszeugnis"],
  ["Personelles Geburtstagskarten", "OsM", "personal geburtstag karte"],
  ["Personelles Spontanbewerbungen", "OsM", "personal bewerbung"],
  ["Personelles Stellvertretungen", "AlC/OsM", "personal stellvertretung vertretung"],
  ["Reglemente und Weisungen", "ZüT", "reglement weisung regel"],
  ["Schülerschafts- und Personalausweise (Secanda)", "GrJo", "ausweis karte secanda"],
  ["Schulgeldrechnung", "GrJo", "schulgeld rechnung"],
  ["Spind Pfäffikon", "GrJo", "schliessfach locker pfäffikon"],
  ["Sportanlässe / Schneesportlager", "GrJo", "sport lager ski schnee"],
  ["Tutoring", "ZüT", "tutor"],
  ["Unterhalt Kopiergeräte Pfäffikon", "GrJo", "kopierer drucker pfäffikon"],
  ["Website", "GrJo", "webseite internet homepage"],
  ["Fachmaturaarbeit", "AlC", "fachmatura arbeit fma"],
  ["Facharbeit", "AlC", "fach arbeit"],
  ["Freifächer", "RaF", "frei fach kurs"],
  ["Instrumentalunterricht", "RaF", "instrument musik unterricht"],
  ["Klassenchef-Meeting", "ZüT", "klassensprecher chef meeting"],
  ["Klassentag / Uni-ETH-Tag", "ZüT", "klasse universität eth"],
  ["Matura-Arbeit inkl. Kick-off und Prämierung", "ZüT", "maturaarbeit ma prämierung"],
  ["Mietwesen", "GrJo", "miete raum vermietung"],
  ["Nachschub / Rückschub Kaffee und Rahm", "GrJo", "kaffee rahm nachschub"],
  ["Schülerschaftsrat (SSR)", "ZüT", "schülerrat ssr"],
  ["Studienberatung", "ZüT", "studium beratung"],
  ["Studieninformationen / Aushänge", "ZüT", "studium info aushang"],
  ["Theater / Chor / Orchester", "OsM/GrJo/AlC", "kultur musik aufführung"],
  ["Vorbereitungen Wahlen EF/SPF", "ZüT", "ergänzungsfach schwerpunktfach wahl"],
  ["Einteilung EF/SPF inkl. Wechsel", "RaF", "ergänzungsfach schwerpunktfach einteilung wechsel"],
  ["Bildungsreise", "RaF", "reise bildung"],
  ["Fakturierung", "GrJo", "faktura rechnung"],
  ["FMS Praktika", "AlC", "fachmittelschule praktikum"],
  ["Fremdsprachenaufenthalt", "RaF", "sprache aufenthalt ausland"],
  ["K&S-Profile", "AlC", "kunst sport profil"],
  ["Sommergrill", "GrJo/OsM", "sommer grill fest"],
  ["Inventar", "GrJo", "inventar bestand"],
  ["Matura-Diplomgebühr", "GrJo", "matura diplom gebühr"],
  ["Neujahrskarten", "OsM", "neujahr karte"],
  ["Spesenabrechnung", "GrJo", "spesen abrechnung"],
  ["Zukunftstag", "ZüT", "zukunft tag"],
];

const entries: Entry[] = raw.map(([topic, codes, aliases]) => ({
  topic,
  people: codes.split("/"),
  aliases,
}));

const stop = new Set("wer ist sind für fuer zuständig zustaendig bei an wen muss kann ich mich mit meinem meiner meine eine einen einem dem der die das und oder bitte frage thema geht es um zum zur wegen brauche möchte moechte wissen hilft helfen zuständigkeit zustaendigkeit".split(" "));
const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

function score(entry: Entry, query: string) {
  const q = normalize(query);
  if (!q) return 0;
  const hay = normalize(`${entry.topic} ${entry.aliases ?? ""} ${entry.people.join(" ")}`);
  if (hay.includes(q)) return 100 + q.length;
  const words = q.split(" ").filter((word) => word.length > 1 && !stop.has(word));
  return words.reduce((sum, word) => {
    if (hay.split(" ").includes(word)) return sum + 18;
    if (hay.includes(word) || word.length > 4 && hay.split(" ").some((part) => part.startsWith(word.slice(0, -1)))) return sum + 9;
    return sum;
  }, 0);
}

const examples = ["Ich brauche eine Schulbestätigung", "Wer hilft bei Absenzen?", "Mein Spind in Nuolen", "Frage zur Maturaarbeit"];

export default function Home() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const results = useMemo(() => entries
    .map((entry) => ({ entry, score: score(entry, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.topic.localeCompare(b.entry.topic, "de"))
    .slice(0, 6), [query]);

  const submit = (event: FormEvent) => { event.preventDefault(); setQuery(input.trim()); setShowAll(false); };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="KSA Zuständigkeitsfinder Startseite">
          <span className="brandMark">ksa</span><span className="brandText">Zuständigkeitsfinder</span>
        </a>
        <button className="directoryLink" onClick={() => setShowAll((value) => !value)}>{showAll ? "Übersicht schliessen" : "Alle Themen A–Z"}</button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> Internes Werkzeug · Stand 12.02.2026</div>
        <h1>Wer kümmert sich<br />eigentlich <em>darum?</em></h1>
        <p className="intro">Beschreibe dein Anliegen in einem Satz. Wir zeigen dir, wer an der KSA die richtige Ansprechperson ist.</p>

        <form className="search" onSubmit={submit}>
          <label htmlFor="question">Thema oder Frage</label>
          <div className="searchRow">
            <input id="question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="z. B. Wer ist für Schulbestätigungen zuständig?" autoComplete="off" />
            <button type="submit" aria-label="Zuständigkeit finden">Finden <span>↗</span></button>
          </div>
        </form>

        <div className="examples" aria-label="Beispielfragen">
          <span>Zum Ausprobieren:</span>
          {examples.map((example) => <button key={example} onClick={() => { setInput(example); setQuery(example); setShowAll(false); }}>{example}</button>)}
        </div>
      </section>

      {query && <section className="results" aria-live="polite">
        <div className="sectionHead">
          <div><span className="kicker">Ergebnis</span><h2>{results.length ? "Dafür bist du hier richtig" : "Noch kein Treffer"}</h2></div>
          <span className="count">{results.length} {results.length === 1 ? "Treffer" : "Treffer"}</span>
        </div>
        {results.length ? <div className="resultGrid">
          {results.map(({ entry }, index) => <article className="resultCard" key={entry.topic}>
            <div className="cardNumber">{String(index + 1).padStart(2, "0")}</div>
            <div className="cardBody">
              <p className="topic">{entry.topic}</p>
              <div className="people">
                {entry.people.map((code) => <div className="person" key={code}>
                  <span className="avatar">{names[code]?.split(" ").map((part) => part[0]).join("").slice(0, 2) || code.slice(0, 2)}</span>
                  <div><strong>{names[code] ?? code}</strong><small>{code}</small></div>
                </div>)}
              </div>
            </div>
          </article>)}
        </div> : <div className="empty"><span>?</span><p>Versuche es mit einem kürzeren Stichwort – zum Beispiel „Zeugnis“, „Kopierer“ oder „Studienwoche“.</p></div>}
      </section>}

      {showAll && <section className="directory">
        <div className="sectionHead"><div><span className="kicker">Verzeichnis</span><h2>Alle Aufgaben von A bis Z</h2></div><span className="count">{entries.length} Themen</span></div>
        <div className="directoryGrid">{[...entries].sort((a,b) => a.topic.localeCompare(b.topic, "de")).map((entry) => <button key={entry.topic} onClick={() => { setInput(entry.topic); setQuery(entry.topic); setShowAll(false); window.scrollTo({ top: 420, behavior: "smooth" }); }}><span>{entry.topic}</span><b>{entry.people.map((code) => names[code] ?? code).join(" · ")}</b></button>)}</div>
      </section>}

      <footer><span>ksa</span><p>Aufgabenbereiche der Schulleitung, Sekretariate und Verwaltung · In Kraft per 01.04.2026</p></footer>
    </main>
  );
}
