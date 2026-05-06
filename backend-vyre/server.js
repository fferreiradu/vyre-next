const express    = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

/* ══════════════════════════════════════════
   CORS — manual, sem o pacote cors
   Funciona com qualquer origem (Vercel, etc.)
══════════════════════════════════════════ */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  /* Responde o preflight imediatamente */
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

/* ── Health check ── */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API Vyre rodando 🚀" });
});

/* ── Transporter ── */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS   // App Password do Google — não a senha normal
  }
});

transporter.verify()
  .then(() => console.log("✅ SMTP pronto"))
  .catch(err  => console.error("❌ Erro SMTP:", err.message));

/* ── Envio ── */
app.post("/enviar", async (req, res) => {
  const { nome, email, whatsapp, servico, mensagem } = req.body;

  console.log("📩 Contato recebido:", { nome, email, servico });

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, email e mensagem" });
  }

  try {
    await transporter.sendMail({
      from:    `"Site Vyre Next" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_USER,
      replyTo: email,
      subject: `📬 Novo contato: ${nome} — ${servico || "Sem serviço"}`,
      text: `
Novo contato pelo site!

Nome:      ${nome}
Email:     ${email}
WhatsApp:  ${whatsapp  || "Não informado"}
Serviço:   ${servico   || "Não selecionado"}

Mensagem:
${mensagem}
      `.trim()
    });

    console.log("✅ Email enviado");
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("❌ Erro ao enviar:", err.message);
    return res.status(500).json({ error: "Erro ao enviar email." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Porta ${PORT}`));