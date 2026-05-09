import { useState } from "react";

const SMIC = 11.88;
const fmt = (n) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const maj = { "25": 1.25, "50": 1.50 };

const inp = { background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a3a", borderRadius: "8px", padding: "13px 16px", color: "#f0ece4", fontSize: "15px", outline: "none", fontFamily: "Georgia, serif", width: "100%", boxSizing: "border-box" };
const btn = { width: "100%", marginTop: "40px", padding: "18px", background: "#c8a96e", color: "#0a0a0f", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "Georgia, serif" };
const lbl = { fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#666", marginBottom: "10px" };

export default function App() {
  const [step, setStep] = useState(1);
  const [taux, setTaux] = useState("");
  const [contrat, setContrat] = useState("35");
  const [travaillees, setTravaillees] = useState("");
  const [recu, setRecu] = useState("");
  const [majoration, setMajoration] = useState("25");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const t = parseFloat(taux) || SMIC;
    const c = parseFloat(contrat) || 35;
    const tr = parseFloat(travaillees) || 0;
    const r = parseFloat(recu) || 0;
    const normales = Math.min(tr, c);
    const sup = Math.max(0, tr - c);
    const du = normales * t + sup * t * maj[majoration];
    const diff = du - r;
    setResult({ du, recu: r, diff, normales, sup, taux: t, statut: diff > 10 ? "anomalie" : diff > 0 ? "leger" : "ok" });
    setStep(3);
  };

  const reset = () => { setStep(1); setResult(null); setTaux(""); setContrat("35"); setTravaillees(""); setRecu(""); };

  const bg = "#0a0a0f";
  const gold = "#c8a96e";

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "Georgia, serif", color: "#f0ece4", margin: 0 }}>
      <div style={{ borderBottom: "1px solid #2a2a3a", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: gold, textTransform: "uppercase", marginBottom: "4px" }}>Outil de vérification</div>
          <div style={{ fontSize: "20px", fontWeight: "700" }}>Mon Salaire Juste</div>
        </div>
        <div style={{ fontSize: "11px", color: "#444", letterSpacing: "1px" }}>SMIC · {fmt(SMIC)}/h</div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "48px" }}>
          {[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: "2px", background: step >= s ? gold : "#2a2a3a", borderRadius: "2px" }} />)}
        </div>

        {step === 1 && (
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "32px", letterSpacing: "-1px" }}>Votre contrat</h1>

            <div style={{ marginBottom: "24px" }}>
              <div style={lbl}>Type de contrat</div>
              <div style={{ display: "flex", gap: "10px" }}>
                {["CDI", "CDD", "Intérim"].map(t => (
                  <button key={t} onClick={() => {}} style={{ flex: 1, padding: "12px", border: "1px solid #2a2a3a", background: "transparent", color: "#f0ece4", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "Georgia, serif" }}>{t}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={lbl}>Heures contractuelles / semaine</div>
              <input style={inp} placeholder="Ex: 35" value={contrat} onChange={e => setContrat(e.target.value)} type="number" />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={lbl}>Taux horaire brut (€) — laisser vide = SMIC</div>
              <input style={inp} placeholder={`Min. ${SMIC} (SMIC)`} value={taux} onChange={e => setTaux(e.target.value)} type="number" step="0.01" />
            </div>

            <button style={btn} onClick={() => setStep(2)}>Continuer →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "32px", letterSpacing: "-1px" }}>Ce mois-ci</h1>

            <div style={{ marginBottom: "24px" }}>
              <div style={lbl}>Heures réellement travaillées</div>
              <input style={inp} placeholder="Ex: 42" value={travaillees} onChange={e => setTravaillees(e.target.value)} type="number" />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={lbl}>Majoration heures supplémentaires</div>
              <div style={{ display: "flex", gap: "10px" }}>
                {[{ v: "25", l: "+25% (légal)" }, { v: "50", l: "+50% (>8h sup)" }].map(o => (
                  <button key={o.v} onClick={() => setMajoration(o.v)} style={{ flex: 1, padding: "12px", border: `1px solid ${majoration === o.v ? gold : "#2a2a3a"}`, background: majoration === o.v ? "rgba(200,169,110,0.1)" : "transparent", color: majoration === o.v ? gold : "#666", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "Georgia, serif" }}>{o.l}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={lbl}>Salaire brut reçu (€)</div>
              <input style={inp} placeholder="Ex: 1450" value={recu} onChange={e => setRecu(e.target.value)} type="number" step="0.01" />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
              <button onClick={() => setStep(1)} style={{ ...btn, marginTop: 0, flex: "0 0 auto", padding: "18px 24px", background: "transparent", border: "1px solid #2a2a3a", color: "#888" }}>← Retour</button>
              <button onClick={calculate} style={{ ...btn, marginTop: 0, flex: 1 }}>Vérifier →</button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "32px", letterSpacing: "-1px" }}>Résultat</h1>

            <div style={{ padding: "24px", borderRadius: "12px", marginBottom: "24px", border: `1px solid ${result.statut === "ok" ? "#2a5a3a" : "#5a1a1a"}`, background: result.statut === "ok" ? "rgba(42,90,58,0.15)" : "rgba(90,26,26,0.2)" }}>
              <div style={{ fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px", color: result.statut === "ok" ? "#5dba7d" : "#e05c5c" }}>
                {result.statut === "ok" ? "✓ Salaire conforme" : "✗ Anomalie détectée"}
              </div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>
                {result.statut === "ok" ? "Votre salaire semble correct." : `Il vous manque ${fmt(result.diff)}`}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              {[
                { l: "Salaire dû", v: fmt(result.du), c: gold },
                { l: "Salaire reçu", v: fmt(result.recu), c: "#f0ece4" },
                { l: "Heures normales", v: `${result.normales}h`, c: "#f0ece4" },
                { l: "Heures sup", v: `${result.sup}h`, c: result.sup > 0 ? gold : "#f0ece4" },
              ].map(card => (
                <div key={card.l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #2a2a3a", borderRadius: "10px", padding: "18px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#555", marginBottom: "8px" }}>{card.l}</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: card.c }}>{card.v}</div>
                </div>
              ))}
            </div>

            {result.statut !== "ok" && (
              <div style={{ background: "rgba(200,169,110,0.05)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "14px" }}>Que faire ?</div>
                <div style={{ fontSize: "14px", color: "#aaa", lineHeight: "1.8" }}>
                  ① Comparez avec votre fiche de paie.<br />
                  ② Contactez votre employeur par écrit.<br />
                  ③ Inspection du Travail : <strong style={{ color: "#f0ece4" }}>0 801 468 468</strong> (gratuit).<br />
                  ④ En intérim : contactez l'agence directement.
                </div>
              </div>
            )}

            <button onClick={reset} style={{ ...btn, background: "transparent", border: "1px solid #2a2a3a", color: "#888" }}>← Nouvelle vérification</button>
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid #1a1a2a", padding: "20px", textAlign: "center", fontSize: "12px", color: "#333" }}>
        Cet outil est indicatif. Pour un litige, consultez l'Inspection du Travail.
      </div>
    </div>
  );
}
