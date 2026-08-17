"use client";

import { FormEvent, useState } from "react";

export function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError("Das Passwort ist nicht korrekt.");
        setPending(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Die Anmeldung ist gerade nicht möglich. Bitte versuche es erneut.");
      setPending(false);
    }
  };

  return (
    <main className="gatePage">
      <section className="gateCard">
        <div className="gateBrand"><strong>ksa</strong><span>Zuständigkeitsfinder</span></div>
        <div className="gateEyebrow"><span /> Geschützter Bereich</div>
        <h1>Wer kümmert sich<br />eigentlich <em>darum?</em></h1>
        <p>Bitte gib das gemeinsame Passwort ein, um den KSA-Zuständigkeitsfinder zu öffnen.</p>
        <form onSubmit={submit} className="gateForm">
          <label htmlFor="site-password">Passwort</label>
          <div className="gateInputRow">
            <input id="site-password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" autoFocus required />
            <button type="submit" disabled={pending}>{pending ? "Prüfen …" : "Öffnen"}</button>
          </div>
          {error && <p className="gateError" role="alert">{error}</p>}
        </form>
      </section>
    </main>
  );
}
