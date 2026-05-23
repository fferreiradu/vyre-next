const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {

    const { nome, email, whatsapp, servico, mensagem } = req.body;

    if (!nome || !email || !mensagem || !servico) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 1. Email interno — notificação para a Vyre Next
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Novo contato - ${nome}`,
      html: `
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp || "-"}</p>
        <p><strong>Serviço:</strong> ${servico}</p>
        <hr>
        <p>${mensagem}</p>
      `
    });

    // 2. Email de confirmação para o usuário
    try {
      await transporter.sendMail({
        from: `"Vyre Next" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Recebemos sua mensagem, ${nome.split(' ')[0]}!`,
        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin:0;padding:0;background:#f4f1f9;font-family:'Segoe UI',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1f9;padding:40px 20px;">
              <tr>
                <td align="center">
                  <table width="100%" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(124,58,255,0.10);">
                    <tr>
                      <td style="background:linear-gradient(135deg,#1a0533,#4a1a8f);padding:40px 40px 32px;text-align:center;">
                        <div style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">
                          Vyre<span style="color:#c084fc;">Next</span>
                        </div>
                        <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:8px 0 0;letter-spacing:0.08em;text-transform:uppercase;">
                          Tecnologia Integrada
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:40px 40px 32px;">
                        <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0f0520;line-height:1.3;">
                          Olá, ${nome.split(' ')[0]}! Recebemos sua mensagem 👋
                        </h1>
                        <p style="margin:0 0 20px;font-size:15px;color:#4a3d5c;line-height:1.7;">
                          Obrigado por entrar em contato com a <strong>Vyre Next</strong>. Nossa equipe já recebeu sua solicitação e em breve um especialista entrará em contato para entender melhor como podemos ajudar o seu negócio.
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7fb;border:1px solid #e8e0f5;border-radius:10px;margin-bottom:28px;">
                          <tr>
                            <td style="padding:20px 24px;">
                              <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#7c3aff;letter-spacing:0.14em;text-transform:uppercase;">
                                Resumo do seu contato
                              </p>
                              <p style="margin:0 0 6px;font-size:14px;color:#4a3d5c;">
                                <strong style="color:#0f0520;">Serviço de interesse:</strong> ${servico}
                              </p>
                              <p style="margin:0;font-size:14px;color:#4a3d5c;">
                                <strong style="color:#0f0520;">Mensagem:</strong> ${mensagem}
                              </p>
                            </td>
                          </tr>
                        </table>
                        <p style="margin:0 0 28px;font-size:15px;color:#4a3d5c;line-height:1.7;">
                          Enquanto isso, se tiver alguma dúvida urgente, pode nos chamar diretamente pelo WhatsApp:
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                          <tr>
                            <td style="background:#7c3aff;border-radius:8px;">
                              <a href="https://wa.me/5549988050290" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.04em;">
                                💬 Falar no WhatsApp
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin:0;font-size:15px;color:#4a3d5c;line-height:1.7;">
                          Até breve,<br>
                          <strong style="color:#0f0520;">Equipe Vyre Next</strong>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#f8f7fb;border-top:1px solid #e8e0f5;padding:24px 40px;text-align:center;">
                        <p style="margin:0 0 6px;font-size:12px;color:#8a7a9e;">
                          Caçador, SC — Atendimento Nacional
                        </p>
                        <p style="margin:0;font-size:11px;color:#b0a0c0;">
                          © 2026 Vyre Next. Todos os direitos reservados.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      });
    } catch (emailConfirmError) {
      console.error("ERRO EMAIL CONFIRMAÇÃO:", emailConfirmError);
      // Não falha o request — o email interno já foi enviado
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("ERRO EMAIL INTERNO:", error);
    return res.status(500).json({ error: "Erro ao enviar email." });
  }

};