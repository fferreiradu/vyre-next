import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API ONLINE");
});

app.post("/enviar", async (req, res) => {

  console.log("REQUISIÇÃO RECEBIDA");

  try {

    const {
      nome,
      email,
      whatsapp,
      servico,
      mensagem
    } = req.body;

    return res.json({
      success: true,
      recebeu: {
        nome,
        email,
        whatsapp,
        servico,
        mensagem
      }
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RODANDO");
});