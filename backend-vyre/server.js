import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/enviar", async (req, res) => {
  try {
    const { nome, email, whatsapp, servico, mensagem } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Novo contato - ${nome}`,
      html: `
        <h2>Nova mensagem do site</h2>

        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Serviço:</strong> ${servico}</p>

        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
      `
    });

    return res.json({
      success: true
    });

  } catch (error) {
    console.error("ERRO:", error);

    return res.status(500).json({
      success: false,
      error: "Erro ao enviar email"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});