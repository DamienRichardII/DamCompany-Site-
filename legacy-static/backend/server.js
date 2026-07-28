/* =====================================================================
   DAMCOMPANY — Backend minimal (Express)
   Route : POST /api/contact
   - Validation basique des champs
   - Réponse JSON
   Prêt pour une future intégration email (Resend, Nodemailer, etc.).
   Ce backend est OPTIONNEL : le site frontend fonctionne sans lui.
   ===================================================================== */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// (Optionnel) servir le frontend statique si on lance tout depuis le backend
app.use(express.static(path.join(__dirname, "..", "frontend")));

// --- Route de santé ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "damcompany-backend" });
});

// --- Validation simple ---
function validateContact(body) {
  const errors = [];
  const { prenom, nom, email, service, message } = body || {};
  if (!prenom || !prenom.trim()) errors.push("prenom");
  if (!nom || !nom.trim()) errors.push("nom");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email");
  if (!service || !service.trim()) errors.push("service");
  if (!message || !message.trim()) errors.push("message");
  return errors;
}

// --- Route contact ---
app.post("/api/contact", (req, res) => {
  const errors = validateContact(req.body);
  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Champs invalides ou manquants.",
      fields: errors,
    });
  }

  // TODO (future) : envoyer un email avec Resend / Nodemailer.
  // Exemple :
  //   await resend.emails.send({ from, to, subject, html });
  // Pour l'instant, on logge et on confirme la réception.
  console.log("[contact] Nouvelle demande :", {
    prenom: req.body.prenom,
    nom: req.body.nom,
    email: req.body.email,
    service: req.body.service,
  });

  return res.json({
    success: true,
    message: "Demande reçue avec succès.",
  });
});

app.listen(PORT, () => {
  console.log(`DamCompany backend en écoute sur http://localhost:${PORT}`);
});
