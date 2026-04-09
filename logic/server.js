// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001; // Puedes usar el puerto que prefieras

const supabase = require('./supabase'); //Importamos nuestra conexión a Supabase

// Middlewares
app.use(cors()); // Permite que tu frontend de Vite se conecte aquí
app.use(express.json()); // Permite recibir datos en formato JSON

// Configuración del transportador SMTP (Gmail)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_EMAIL_USER,
    pass: process.env.GOOGLE_EMAIL_APP_PASSWORD,
  },
});

// Ruta para recibir los correos desde tu página (Vite)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: 'El email y el mensaje son obligatorios.' });
    }

    // 3. Componer el correo con un diseño atractivo
    const mailOptions = {
      from: `"${name} (Sitio Web)" <${process.env.GOOGLE_EMAIL_USER}>`, // Usamos el correo del sistema para evitar que Gmail lo marque como spam
      replyTo: email, // Si el administrador le da a "Responder", le contestará al interesado
      to: process.env.GOOGLE_EMAIL_USER, // El destino es el correo de la fundación
      subject: `📢 Nuevo mensaje de contacto: ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || 'No proporcionado'}\nMensaje:\n${message}`, // Respaldo por si el lector de correos no soporta HTML
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <div style="background: linear-gradient(to right, #2563eb, #1d4ed8); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">
              Fundación Autismax
            </h1>
            <p style="color: #bfdbfe; margin: 5px 0 0 0; font-size: 14px;">
              Nueva solicitud de contacto desde la web
            </p>
          </div>

          <div style="padding: 30px 20px; background-color: #f9fafb;">
            <p style="color: #374151; font-size: 16px; margin-top: 0; margin-bottom: 25px; line-height: 1.5;">
              ¡Hola! Alguien ha dejado un mensaje en la sección de contáctanos. Aquí tienes los detalles:
            </p>

            <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px; width: 30%;">👤 <strong>Nombre:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 15px; font-weight: 500;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">✉️ <strong>Email:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 15px;">
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">📞 <strong>Teléfono:</strong></td>
                  <td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 500;">${phone || 'No proporcionado'}</td>
                </tr>
              </table>
            </div>

            <h3 style="color: #374151; font-size: 16px; margin: 0 0 10px 0;">Mensaje del usuario:</h3>
            <div style="background-color: #ffffff; border-left: 4px solid #2563eb; padding: 15px 20px; border-radius: 0 8px 8px 0; border-top: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
              <p style="color: #4b5563; line-height: 1.6; margin: 0; white-space: pre-wrap; font-style: italic;">"${message}"</p>
            </div>

          </div>

          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              Este es un mensaje automático generado por el sitio web de Fundación Autismax.<br>
              Por favor, no respondas directamente a esta dirección de envío.
            </p>
          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mensaje enviado exitosamente.' });

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error interno al enviar el mensaje.' });
  }
});


// Ruta para Iniciar Sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validar la contraseña usando el sistema seguro de Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    // 2. Si la contraseña es correcta, buscamos su ROL y datos en nuestra tabla 'maestros'
    const { data: maestroData, error: dbError } = await supabase
      .from('maestros')
      .select('*, usuarios(*)') // Hacemos JOIN para traer su nombre también
      .eq('correo', email)
      .single(); // .single() porque un correo solo debe pertenecer a un maestro

    if (dbError || !maestroData) {
      return res.status(404).json({ error: 'Usuario autenticado, pero no tiene perfil de maestro asignado.' });
    }

    // 3. Enviamos la respuesta de éxito al Frontend con los datos limpios
    res.status(200).json({
      mensaje: '¡Login exitoso!',
      token: authData.session.access_token, // Token de seguridad para el futuro
      usuario: {
        id: maestroData.id_maestro,
        nombre: maestroData.usuarios.nombre,
        apellidos: `${maestroData.usuarios.apellido_p} ${maestroData.usuarios.apellido_m || ''}`,
        correo: maestroData.correo,
        rol: maestroData.rol // Aquí viaja si es 'Administrador' o 'Profesor'
      }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});