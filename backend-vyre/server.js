const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Vyre rodando 🚀");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify()
  .then(() => console.log("SMTP pronto"))
  .catch(err => console.error("Erro SMTP:", err));

app.post("/enviar", async (req, res) => {
  const { nome, email, whatsapp, servico, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  try {
    await transporter.sendMail({
      from: `"Site Vyre" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Novo contato do site",
      text: `
Nome: ${nome}
Email: ${email}
WhatsApp: ${whatsapp || "-"}
Serviço: ${servico || "-"}

Mensagem:
${mensagem}
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao enviar" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});