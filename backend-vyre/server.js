const express = require("express");
const cors    = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

/* ── CORS: libera explicitamente o domínio do Vercel ── */
const allowedOrigins = [
  "https://vyrenext.vercel.app",          // ajuste para o seu domínio real no Vercel
  "https://www.vyrenext.com.br",          // domínio customizado (se tiver)
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn("CORS bloqueado para origin:", origin);
    return callback(new Error("Origem não permitida: " + origin));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

app.use(express.json());

/* ── Health check ── */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API Vyre rodando" });
});

/* ── Transporter ── */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS   // use App Password do Google, não a senha normal
  }
});

transporter.verify()
  .then(() => console.log("✅ SMTP pronto"))
  .catch(err => console.error("❌ Erro SMTP:", err.message));

/* ── Rota de envio ── */
app.post("/enviar", async (req, res) => {
  const { nome, email, whatsapp, servico, mensagem } = req.body;

  console.log("📩 Novo contato recebido:", { nome, email, servico });

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, email e mensagem" });
  }

  try {
    await transporter.sendMail({
      from:    `"Site Vyre Next" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_USER,
      replyTo: email,
      subject: `📬 Novo contato: ${nome} — ${servico || "Sem serviço selecionado"}`,
      text: `
Novo contato recebido pelo site!

Nome:      ${nome}
Email:     ${email}
WhatsApp:  ${whatsapp || "Não informado"}
Serviço:   ${servico  || "Não selecionado"}

Mensagem:
${mensagem}

---
Enviado via site Vyre Next
      `.trim()
    });

    console.log("✅ Email enviado para", process.env.EMAIL_USER);
    return res.status(200).json({ success: true, message: "Email enviado com sucesso!" });

  } catch (err) {
    console.error("❌ Erro ao enviar email:", err.message);
    return res.status(500).json({ error: "Erro ao enviar email. Tente novamente." });
  }
});

/* ── Start ── */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});