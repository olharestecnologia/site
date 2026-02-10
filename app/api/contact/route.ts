import { NextRequest, NextResponse } from 'next/server'

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

    const apiKey = process.env.MAILGUN_API_KEY
    const domain = process.env.MAILGUN_DOMAIN
    const toEmail = process.env.CONTACT_EMAIL_TO

    if (!apiKey || !domain || !toEmail) {
      console.error('Mailgun environment variables not configured')
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      )
    }

    // Preparar dados do email
    const formData = new FormData()
    formData.append('from', `Formulário Site Olhares <mailgun@${domain}>`)
    formData.append('to', toEmail)
    formData.append('subject', `[Site] ${data.subject || 'Contato pelo site'}`)
    formData.append('html', `
      <h2>Nova mensagem do site</h2>
      <p><strong>Nome:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Telefone:</strong> ${data.phone || 'Não informado'}</p>
      <p><strong>Assunto:</strong> ${data.subject || 'Não informado'}</p>
      <hr />
      <h3>Mensagem:</h3>
      <p>${data.message.replace(/\n/g, '<br />')}</p>
    `)
    formData.append('h:Reply-To', data.email)

    // Enviar via API do Mailgun
    const response = await fetch(
      `https://api.mailgun.net/v3/${domain}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
        },
        body: formData,
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Mailgun error:', errorData)
      return NextResponse.json(
        { error: 'Erro ao enviar mensagem' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Mensagem enviada com sucesso!' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
