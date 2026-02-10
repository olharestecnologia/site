import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactFormData {
  name: string
  email: string
  phone: string
  type: string
  subject: string
  message: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildEmailHtml(data: ContactFormData): string {
  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email)
  const phone = data.phone ? escapeHtml(data.phone) : null
  const type = data.type ? escapeHtml(data.type) : null
  const subject = data.subject ? escapeHtml(data.subject) : null
  const message = escapeHtml(data.message).replace(/\n/g, '<br />')

  const typeBadgeColors: Record<string, { bg: string; text: string }> = {
    'Dúvida': { bg: '#E0F2FE', text: '#0369A1' },
    'Reclamação': { bg: '#FEF2F2', text: '#B91C1C' },
    'Sugestão': { bg: '#F0FDF4', text: '#15803D' },
    'Elogio': { bg: '#FFFBEB', text: '#A16207' },
    'Outro': { bg: '#F3F4F6', text: '#374151' },
  }
  const badge = type ? (typeBadgeColors[type] || typeBadgeColors['Outro']) : null

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0086bf,#088089);padding:28px 32px;border-radius:12px 12px 0 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">
                      Olhares Oftalmologia
                    </h1>
                    <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">
                      Nova mensagem recebida pelo site
                    </p>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    ${badge ? `<span style="display:inline-block;background-color:${badge.bg};color:${badge.text};padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;">${type}</span>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:32px;">

              <!-- Info Cards -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:16px;background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding:0 8px 12px 0;vertical-align:top;">
                          <p style="margin:0 0 2px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Nome</p>
                          <p style="margin:0;font-size:15px;color:#1e293b;font-weight:600;">${name}</p>
                        </td>
                        <td width="50%" style="padding:0 0 12px 8px;vertical-align:top;">
                          <p style="margin:0 0 2px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">E-mail</p>
                          <p style="margin:0;font-size:15px;color:#1e293b;">
                            <a href="mailto:${email}" style="color:#0086bf;text-decoration:none;">${email}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding:0 8px 0 0;vertical-align:top;">
                          <p style="margin:0 0 2px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Telefone</p>
                          <p style="margin:0;font-size:15px;color:#1e293b;">${phone || '<span style="color:#94a3b8;">Não informado</span>'}</p>
                        </td>
                        <td width="50%" style="padding:0 0 0 8px;vertical-align:top;">
                          <p style="margin:0 0 2px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Assunto</p>
                          <p style="margin:0;font-size:15px;color:#1e293b;">${subject || '<span style="color:#94a3b8;">Não informado</span>'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Mensagem</p>
                    <div style="padding:16px;background-color:#f8fafc;border-radius:8px;border-left:4px solid #0086bf;font-size:14px;line-height:1.7;color:#334155;">
                      ${message}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Reply Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re: ${subject || 'Contato pelo site'}" style="display:inline-block;background-color:#0086bf;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                      Responder ${name.split(' ')[0]}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 32px;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                Recebido em ${now} &bull; Formulário do site Olhares Oftalmologia
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const toEmail = process.env.CONTACT_EMAIL_TO

    if (!smtpUser || !smtpPass || !toEmail) {
      console.error('SMTP environment variables not configured')
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const typePrefix = data.type ? `[${data.type}]` : '[Site]'
    const subjectLine = `${typePrefix} ${data.subject || 'Contato pelo site'}`

    await transporter.sendMail({
      from: `Formulário Site Olhares <${smtpUser}>`,
      to: toEmail,
      replyTo: data.email,
      subject: subjectLine,
      html: buildEmailHtml(data),
    })

    return NextResponse.json({ success: true, message: 'Mensagem enviada com sucesso!' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}
