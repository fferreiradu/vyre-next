import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API ONLINE");
});

app.post("/enviar", async (req, res) => {
  console.log("📩 Requisição recebida:", req.body);

  const { nome, email, whatsapp, servico, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Preencha nome, email e mensagem." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS   
      }
    });

    await transporter.sendMail({
      from:    `"Site Vyre Next" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_USER,
      replyTo: email,
      subject: `📬 Novo contato: ${nome} — ${servico || "Sem serviço"}`,
      text: `
Nome:     ${nome}
Email:    ${email}
WhatsApp: ${whatsapp  || "Não informado"}
Serviço:  ${servico   || "Não selecionado"}

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
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));