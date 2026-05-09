import { useState } from "react";

const SMIC_HORAIRE = 11.88;

function formatEuro(n) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

const majoration = {
  "25": 1.25,
  "50": 1.50,
};

export default function App() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    tauxHoraire: "",
    heuresContrat: "35",
    heuresTravaillees: "",
    salaireRecu: "",
    typeContrat: "cdi",
    majorationHS: "25",
  });
  const [result, setResult] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const calculate = () => {
    const taux = parseFloat(form.tauxHoraire) || SMIC_HORAIRE;
    const contrat = parseFloat(form.heuresContrat) || 35;
    const travaillees = parseFloat(form.heuresTravaillees) || 0;
    const recu = parseFloat(form.salaireRecu) || 0;
    const maj = majoration[form.majorationHS];

    const heuresNormales = Math.min(travaillees, contrat);
    const heuresSup = Math.max(0, travaillees - contrat);

    const salaireDu = heuresNormales * taux + heuresSup * taux * maj;
    const difference = salaireDu - recu;
    const pourcentageEcart = recu > 0 ? ((difference / salaireDu) * 100) : 0;

    let statut = "ok";
    if (difference > 10) statut = "anomalie";
    else if (difference > 0) statut = "leger";

    setResult({
      salaireDu,
      salaireRecu: recu,
      difference,
      heuresSup,
      heuresNormales,
      taux,
      pourcentageEcart,
      statut,
    });
    setStep(3);
  };

  const reset = () => { setStep(1); setResult(null); setForm({ tauxHoraire: "", heuresContrat: "35", heuresTravaillees: "", salaireRecu: "", typeContrat: "cdi", majorationHS: "25" }); };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Georgia', serif",
      color: "#f0ece4",
      padding: "0",
      margin: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #2a2a3a",
        padding: "28px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.02)",
      }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#c8a96e", textTransform: "uppercase", marginBottom: "4px" }}>Outil de vérification</div>
          <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px" }}>Mon Salaire Juste</div>
        </div>
        <div style={{
          fontSize: "11px", letterSpacing: "2px", color: "#555", textTransform: "uppercase"
        }}>
          SMIC 2024 · {formatEuro(SMIC_HORAIRE)}/h
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 24px" }}>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "52px" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              height: "2px",
              flex: 1,
              background: step >= s ? "#c8a96e" : "#2a2a3a",
              transition: "background 0.4s",
              borderRadius: "2px",
            }} />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{ fontSize: "32px", fontWeight: "700", lineHeight: "1.2", marginBottom: "16px", letterSpacing: "-1px" }}>
                Votre contrat
              </h1>
              <p style={{ color: "#888", fontSize: "15px", lineHeight: "1.7" }}>
                Entrez les informations de base de votre contrat de travail.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              <Field label="Type de contrat">
                <div style={{ display: "flex", gap: "12px" }}>
                  {["cdi", "cdd", "interim"].map(t => (
                    <button key={t} onClick={() => set("typeContrat", t)} style={{
                      flex: 1, padding: "12px", border: `1px solid ${form.typeContrat === t ? "#c8a96e" : "#2a2a3a"}`,
                      background: form.typeContrat === t ? "rgba(200,169,110,0.1)" : "transparent",
                      color: form.typeContrat === t ? "#c8a96e" : "#666",
                      borderRadius: "8px", cursor: "pointer", fontSize: "13px",
                      letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.2s",
                    }}>
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Heures contractuelles par semaine">
                <div style={{ display: "flex", gap: "10px" }}>
                  {["35", "39", "Autre"].map(h => (
                    <button key={h} onClick={() => set("heuresContrat", h === "Autre" ? "" : h)} style={{
                      padding: "10px 20px",
                      border: `1px solid ${form.heuresContrat === h || (h === "Autre" && !["35","39"].includes(form.heuresContrat)) ? "#c8a96e" : "#2a2a3a"}`,
                      background: form.heuresContrat === h ? "rgba(200,169,110,0.1)" : "transparent",
                      color: "#f0ece4", borderRadius: "8px", cursor: "pointer", fontSize: "14px", transition: "all 0.2s",
                    }}>{h}h</button>
                  ))}
                  <input
                    placeholder="Nombre"
                    value={!["35", "39"].includes(form.heuresContrat) ? form.heuresContrat : ""}
                    onChange={e => set("heuresContrat", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </Field>

              <Field label="Taux horaire brut (€)">
                <div style={{ position: "relative" }}>
                  <input
                    placeholder={`Min. ${SMIC_HORAIRE} (SMIC)`}
                    value={form.tauxHoraire}
                    onChange={e => set("tauxHoraire", e.target.value)}
                    style={{ ...inputStyle, width: "100%", paddingLeft: "36px" }}
                    type="number"
                    step="0.01"
                  />
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#c8a96e", fontSize: "15px" }}>€</span>
                </div>
                <div style={{ fontSize: "12px", color: "#555", marginTop: "8px" }}>
                  Laissez vide pour utiliser le SMIC automatiquement
                </div>
              </Field>
            </div>

            <button onClick={() => setStep(2)} style={btnStyle}>
              Continuer →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{ fontSize: "32px", fontWeight: "700", lineHeight: "1.2", marginBottom: "16px", letterSpacing: "-1px" }}>
                Ce mois-ci
              </h1>
< truncated lines 185-197 >
                />
              </Field>

              <Field label="Majoration heures supplémentaires">
                <div style={{ display: "flex", gap: "12px" }}>
                  {[{ v: "25", label: "+25% (légal)" }, { v: "50", label: "+50% (>8h sup)" }].map(opt => (
                    <button key={opt.v} onClick={() => set("majorationHS", opt.v)} style={{
                      flex: 1, padding: "12px",
                      border: `1px solid ${form.majorationHS === opt.v ? "#c8a96e" : "#2a2a3a"}`,
                      background: form.majorationHS === opt.v ? "rgba(200,169,110,0.1)" : "transparent",
                      color: form.majorationHS === opt.v ? "#c8a96e" : "#666",
                      borderRadius: "8px", cursor: "pointer", fontSize: "13px", transition: "all 0.2s",
                    }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Salaire brut reçu (€)">
                <div style={{ position: "relative" }}>
                  <input
                    placeholder="Ex: 1450"
                    value={form.salaireRecu}
                    onChange={e => set("salaireRecu", e.target.value)}
                    style={{ ...inputStyle, width: "100%", paddingLeft: "36px" }}
                    type="number"
                    step="0.01"
                  />
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#c8a96e", fontSize: "15px" }}>€</span>
                </div>
              </Field>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "48px" }}>
              <button onClick={() => setStep(1)} style={{ ...btnStyle, background: "transparent", border: "1px solid #2a2a3a", color: "#888", flex: "0 0 auto", padding: "16px 28px" }}>
                ← Retour
              </button>
              <button onClick={calculate} style={{ ...btnStyle, flex: 1, marginTop: 0 }}>
                Vérifier mon salaire
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 - Results */}
        {step === 3 && result && (
          <div>
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{ fontSize: "32px", fontWeight: "700", lineHeight: "1.2", marginBottom: "16px", letterSpacing: "-1px" }}>
                Résultat
              </h1>
            </div>

            {/* Status banner */}
            <div style={{
              padding: "24px 28px",
              borderRadius: "12px",
              marginBottom: "32px",
              border: `1px solid ${result.statut === "ok" ? "#2a5a3a" : result.statut === "leger" ? "#5a4a1a" : "#5a1a1a"}`,
              background: result.statut === "ok" ? "rgba(42,90,58,0.15)" : result.statut === "leger" ? "rgba(90,74,26,0.15)" : "rgba(90,26,26,0.2)",
            }}>
              <div style={{ fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px", color: result.statut === "ok" ? "#5dba7d" : result.statut === "leger" ? "#c8a96e" : "#e05c5c" }}>
                {result.statut === "ok" ? "✓ Salaire conforme" : result.statut === "leger" ? "⚠ Légère anomalie" : "✗ Anomalie détectée"}
              </div>
              <div style={{ fontSize: "26px", fontWeight: "700" }}>
                {result.statut === "ok"
                  ? "Votre salaire semble correct."
                  : `Il vous manque ${formatEuro(result.difference)}`}
              </div>
              {result.statut !== "ok" && (
                <div style={{ fontSize: "14px", color: "#888", marginTop: "8px" }}>
                  Soit {result.pourcentageEcart.toFixed(1)}% de votre salaire dû
                </div>
              )}
            </div>

            {/* Detail cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              <Card label="Salaire dû" value={formatEuro(result.salaireDu)} highlight />
              <Card label="Salaire reçu" value={formatEuro(result.salaireRecu)} />
              <Card label="Heures normales" value={`${result.heuresNormales}h`} />
              <Card label="Heures supplémentaires" value={`${result.heuresSup}h`} accent={result.heuresSup > 0} />
            </div>

            {/* Calcul détail */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #2a2a3a", borderRadius: "12px", padding: "24px", marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#555", marginBottom: "16px" }}>Détail du calcul</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#aaa" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{result.heuresNormales}h × {formatEuro(result.taux)}</span>
                  <span style={{ color: "#f0ece4" }}>{formatEuro(result.heuresNormales * result.taux)}</span>
                </div>
                {result.heuresSup > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{result.heuresSup}h sup × {formatEuro(result.taux)} × {form.majorationHS === "25" ? "1,25" : "1,50"}</span>
                    <span style={{ color: "#c8a96e" }}>{formatEuro(result.heuresSup * result.taux * majoration[form.majorationHS])}</span>
                  </div>
                )}
                <div style={{ borderTop: "1px solid #2a2a3a", paddingTop: "10px", display: "flex", justifyContent: "space-between", color: "#f0ece4", fontWeight: "600" }}>
                  <span>Total dû</span>
                  <span>{formatEuro(result.salaireDu)}</span>
                </div>
              </div>
            </div>

            {/* Que faire */}
            {result.statut !== "ok" && (
              <div style={{ background: "rgba(200,169,110,0.05)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: "12px", padding: "24px", marginBottom: "32px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#c8a96e", marginBottom: "16px" }}>Que faire ?</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "#aaa", lineHeight: "1.7" }}>
                  <div>① Comparez ce résultat avec votre fiche de paie ligne par ligne.</div>
                  <div>② Contactez votre employeur ou RH par écrit (gardez une trace).</div>
                  <div>③ En cas de litige : contactez l'<strong style={{ color: "#f0ece4" }}>Inspection du Travail</strong> (0 801 468 468 — gratuit).</div>
                  <div>④ Pour l'intérim : contactez directement l'agence, pas l'entreprise utilisatrice.</div>
                </div>
              </div>
            )}

            <button onClick={reset} style={{ ...btnStyle, background: "transparent", border: "1px solid #2a2a3a", color: "#888" }}>
              ← Nouvelle vérification
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1a1a2a", padding: "24px 40px", textAlign: "center", fontSize: "12px", color: "#333" }}>
        Cet outil est indicatif. Pour un litige confirmé, consultez un professionnel ou l'Inspection du Travail.
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#666", marginBottom: "12px" }}>{label}</div>
      {children}
    </div>
  );
}

function Card({ label, value, highlight, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${highlight ? "rgba(200,169,110,0.3)" : "#2a2a3a"}`,
      borderRadius: "10px",
      padding: "20px",
    }}>
      <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#555", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "22px", fontWeight: "700", color: highlight ? "#c8a96e" : accent ? "#c8a96e" : "#f0ece4" }}>{value}</div>
    </div>
  );
}

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid #2a2a3a",
  borderRadius: "8px",
  padding: "13px 16px",
  color: "#f0ece4",
  fontSize: "15px",
  outline: "none",
  transition: "border 0.2s",
  fontFamily: "Georgia, serif",
};

const btnStyle = {
  width: "100%",
  marginTop: "48px",
  padding: "18px",
  background: "#c8a96e",
  color: "#0a0a0f",
  border: "none",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  letterSpacing: "0.5px",
  transition: "opacity 0.2s",
  fontFamily: "Georgia, serif",
