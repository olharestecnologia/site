import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    // Validação dos campos obrigatórios
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Validação básica de email
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

    await transporter.sendMail({
      from: `Formulário Site Olhares <${smtpUser}>`,
      to: toEmail,
      replyTo: data.email,
      subject: `[Site] ${data.subject || 'Contato pelo site'}`,
      html: `
        <h2>Nova mensagem do site</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefone:</strong> ${data.phone || 'Não informado'}</p>
        <p><strong>Assunto:</strong> ${data.subject || 'Não informado'}</p>
        <hr />
        <h3>Mensagem:</h3>
        <p>${data.message.replace(/\n/g, '<br />')}</p>
      `,
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
