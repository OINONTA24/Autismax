// logic/supabase.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Leer las variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Crear la conexión
const supabase = createClient(supabaseUrl, supabaseKey);

// Exportar la conexión para poder usarla en nuestro server.js
module.exports = supabase;