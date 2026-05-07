import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

/* ─────────────────────────────────────────
   CORS
───────────────────────────────────────── */
app.use(cors({
  origin: [
    "https://vyre-next.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

/* ─────────────────────────────────────────
   TESTE API
───────────────────────────────────────── */
app.get("/", (req, res) => {
  res.status(200).send("API ONLINE");
});

/* ─────────────────────────────────────────
   NODEMAILER
───────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ─────────────────────────────────────────
   ROTA ENVIAR
───────────────────────────────────────── */
app.post("/enviar", async (req, res) => {
  try {

    console.log("BODY RECEBIDO:");
    console.log(req.body);

    const {
      nome,
      email,
      whatsapp,
      servico,
      mensagem
    } = req.body;

    if (!nome || !email || !mensagem) {
      return res.status(400).json({
        success: false,
        error: "Campos obrigatórios faltando"
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Novo contato - ${nome}`,
      html: `
        <h2>Nova mensagem do site</h2>

        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp || "Não informado"}</p>
        <p><strong>Serviço:</strong> ${servico || "Não informado"}</p>

        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
      `
    });

    console.log("EMAIL ENVIADO");

    return res.status(200).json({
      success: true,
      message: "Email enviado com sucesso"
    });

  } catch (error) {

    console.error("ERRO AO ENVIAR EMAIL:");
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message || "Erro interno no servidor"
    });
  }
});

/* ─────────────────────────────────────────
   404
───────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada"
  });
});

/* ─────────────────────────────────────────
   START SERVER
───────────────────────────────────────── */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});