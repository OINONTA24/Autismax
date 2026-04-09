import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {  Heart,Users,Target,Sparkles,HandHeart,Globe,Menu,X,BookOpen,Stethoscope,Brain,Wrench,Calendar,Facebook,Twitter,Instagram,Linkedin,ArrowLeft,Eye,Mail,ShieldCheck,Phone,MapPin,ArrowRight,} from "lucide-react";
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { GalleryModal } from './components/GalleryModal';
import TeacherPortal from "./components/TeacherPortal";



type Page =
  | "home"
  | "login"
  | "servicio-cursos"
  | "servicio-diagnosticos"
  | "servicio-talleres"
  | "servicio-terapias"
  | "galeria-instalaciones"
  | "donativos";

// Definición de galerías para cada instalación
const galleryData = {
  "edificio-principal": {
    title: "Edificio Principal",
    images: [
      {
        url: "https://autismax.org.mx/wp-content/uploads/2018/12/fachada.jpg",
        title: "Fachada_principal",
        description:
          "Vista frontal de nuestro edificio moderno",
      },
      {
        url: "https://images.unsplash.com/photo-1692818769925-6b815111c653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGZhY2lsaXR5fGVufDF8fHx8MTc2ODMzNjUzMXww&ixlib=rb-4.1.0&q=80&w=1080",
        title: "Instalaciones_modernas",
        description: "Descripcion ",
      },
      {
        url: "https://autismax.org.mx/wp-content/uploads/2018/12/ofic-2.jpg",
        title: "Oficinas",
        description: "Oficinas y áreas de gestión",
      },
    ],
  },
  "aulas-aprendizaje": {
    title: "Aulas de Aprendizaje",
    images: [
      {
        url: "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181120_122309-1.jpg",
        title: "Aula_principal",
        description: "Descripcion",
      },
      {
        url: "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181120_122527.jpg",
        title: "Aula_interactiva",
        description: "Descripcion",
      },
      {
        url: "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181120_122456.jpg",
        title: "Sala_de_estudio",
        description: "Descripcion",
      },
      {
        url: "https://autismax.org.mx/wp-content/uploads/2019/01/thumbnail_20181120_122512-1.jpg",
        title: "Biblioteca",
        description: "Descripcion",
      },
    ],
  },
  "salas-terapia": {
    title: "Salas de Terapia",
    images: [
      {
        url: "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181120_122640.jpg",
        title: "Sala_de_terapia_1",
        description: "Ambiente tranquilo y privado",
      },
      {
        url: "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181120_122629.jpg",
        title: "Sala_de_terapia_2",
        description: "Atención personalizada",
      },
      {
        url: "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181120_122550.jpg",
        title: "Sala_de_meditación",
        description: "Espacio para relajación y mindfulness",
      },
    ],
  },
  "talleres-oficios": {
    title: "Talleres de Oficios",
    images: [
      {
        url: "https://autismax.org.mx/wp-content/uploads/2019/01/thumbnail_20181121_134720.jpg",
        title: "Taller_principal",
        description:
          "Espacio equipado para actividades prácticas",
      },
      {
        url: "https://autismax.org.mx/wp-content/uploads/2019/01/thumbnail_20181120_122512-1.jpg",
        title: "Taller_de_manualidades",
        description: "Área de trabajo creativo",
      },
    ],
  },
  "area-recreativa": {
    title: "Área Recreativa",
    images: [
      {
        url: "https://autismax.org.mx/wp-content/uploads/2019/01/20181206_134452-scaled.jpg",
        title: "Área_de_juegos",
        description: "Espacios seguros para niños",
      },
    ],
  },
  "sala-multiusos": {
    title: "Pasillos y cocina",
    images: [
      {
        url: "https://autismax.org.mx/wp-content/uploads/2018/12/cocina-ok.jpg",
        title: "Pasillo",
        description: "Pasillo principal",
      },
      {
        url: "https://autismax.org.mx/wp-content/uploads/2018/12/cocina-ok.jpg",
        title: "Cocina",
        description: "Capacidad para 200 personas",
      },
    ],
  },
};



export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeGallery, setActiveGallery] = useState<
    keyof typeof galleryData | null
  >(null);

    // --- CÓDIGO NUEVO PARA EL FORMULARIO DE CONTACTO ---
  const [nombreContacto, setNombreContacto] = useState('');
  const [emailContacto, setEmailContacto] = useState('');
  const [mensajeContacto, setMensajeContacto] = useState('');
  const [estadoEnvio, setEstadoEnvio] = useState('');
  const [numeroContacto, setNumeroContacto] = useState('');

  //Variables para el login
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const handleSubmitContacto = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstadoEnvio('Enviando mensaje, por favor espera...');

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nombreContacto,
          email: emailContacto,
          message: mensajeContacto,
          phone: numeroContacto,
        }),
      });

      if (response.ok) {
        setEstadoEnvio('¡Tu mensaje ha sido enviado con éxito!');
        setNombreContacto('');
        setEmailContacto('');
        setMensajeContacto('');
        // Opcional: Ocultar el mensaje después de unos segundos
        setTimeout(() => setEstadoEnvio(''), 5000); 
      } else {
        setEstadoEnvio('Ocurrió un error al enviar. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setEstadoEnvio('No pudimos conectar con el servidor.');
    }
  };
  // --- FIN CÓDIGO NUEVO ---

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin('');
    setCargando(true);
   

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLogin, password: passwordLogin }),
      });

      const data = await response.json();

      if (response.ok) {
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        setIsLoggedIn(true);

        alert(`Bienvenido ${data.usuario.nombre} (${data.usuario.rol})`);

      } else {
        // Mostrar error (ej. Contraseña incorrecta)
        setErrorLogin(data.error);
      }
    } catch (err) {
      console.error(err);
      setErrorLogin('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setIsLoggedIn(false);
  };
  
  if (isLoggedIn) {
    return <TeacherPortal onLogout={handleLogout} />
  }

  

  // Página de Login
  if (currentPage === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-yellow-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => navigateToPage("home")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600">
                Portal para profesorado
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Mostrar error si existe */}
              {errorLogin && <p className="text-red-500 text-sm">{errorLogin}</p>} 
              
              {/* Boton de inicio de sesion */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={cargando}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300"
              >                
                {cargando ? 'Verificando...' : 'Entrar'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-gray-700 text-center">
                <strong>Nota:</strong> El acceso está
                restringido a personal autorizado. Para
                solicitar credenciales, contacte al
                administrador.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Página de Servicio - Cursos
  if (currentPage === "servicio-cursos") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 p-6">
        <div className="container mx-auto max-w-5xl">
          <button
            onClick={() => navigateToPage("home")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">
                  Cursos Educativos
                </h1>
                <p className="text-gray-600">
                  Programas de formación académica y desarrollo
                  personal
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Descripción del Programa
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nuestros cursos están diseñados para brindar
                oportunidades educativas de calidad a niños,
                jóvenes y adultos de comunidades vulnerables.
                Ofrecemos una amplia variedad de programas que
                van desde refuerzo escolar hasta formación en
                habilidades específicas.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Todos nuestros cursos son impartidos por
                profesionales capacitados y utilizan
                metodologías pedagógicas modernas que promueven
                el aprendizaje significativo y el desarrollo
                integral de los participantes.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Cursos Disponibles
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Comunicación y lenguaje",
                  "Arte terapia",
                  "Entrenamiento de sombras",
                ].map((curso, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      {curso}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                ¿Interesado en nuestros cursos?
              </h2>
              <p className="text-center text-gray-700 mb-6">
                Completa el formulario y nos pondremos en
                contacto contigo para brindarte más información
              </p>
              <form onSubmit={handleSubmitContacto} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={nombreContacto}
                    onChange={(e) => setNombreContacto(e.target.value)}
                    placeholder="Nombre completo"
                    required
                    className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    value={emailContacto}
                    onChange={(e) => setEmailContacto(e.target.value)}
                    placeholder="Email"
                    required
                    className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>
                
                <input
                  type="tel"
                  value={numeroContacto}
                  onChange={(e) => setNumeroContacto(e.target.value)}
                  placeholder="Teléfono"
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                />
                <textarea
                  value={mensajeContacto}
                  onChange={(e) => setMensajeContacto(e.target.value)}
                  rows={4}
                  required
                  placeholder="Cuéntanos qué curso te interesa y cualquier pregunta que tengas..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors resize-none"
                ></textarea>
                {/*Envio del correo*/ }
                {estadoEnvio && (
                  <div className={`p-3 rounded-lg text-center font-medium ${
                    estadoEnvio.includes('éxito') 
                      ? 'bg-green-100 text-green-700' 
                      : estadoEnvio.includes('espera') 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {estadoEnvio}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={estadoEnvio.includes('espera')}
                  className={`w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 ${
                    estadoEnvio.includes('espera') ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {estadoEnvio.includes('espera') ? 'Enviando...' : 'Enviar Mensaje'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Página de Servicio - Talleres
  if (currentPage === "servicio-talleres") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-6">
        <div className="container mx-auto max-w-5xl">
          <button
            onClick={() => navigateToPage("home")}
            className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-yellow-600 to-amber-600 p-4 rounded-2xl">
                <Wrench className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">
                  Talleres Prácticos
                </h1>
                <p className="text-gray-600">
                  Desarrollo de habilidades y oficios
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Nuestro Taller de habilidades para la vida diaria
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                El objetivo de los talleres es preparar a los niños y 
                jóvenes con autismo para enfrentar los retos que 
                representa la vida diaria como personas autosuficientes,
                mejorando su calidad de vida y su capacidad de 
                adaptación a la sociedad.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Las habilidades de vida diaria o autonomía y 
                cuidado personal se cuentan entre las conductas más 
                importantes que pueden desarrollar las personas con 
                autismo. Dichas habilidades incluyen todos los 
                comportamientos relacionados con el aseo, el vestido, 
                la alimentación y la apariencia personal, 
                son actividades cotidianas de las que todo el mundo 
                participa tan plena e independientemente como es 
                posible, y son indispensables para la integración 
                social de las personas.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Talleres Disponibles
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Carpintería y Ebanistería",
                  "Costura y Confección",
                  "Repostería y Panadería",
                  "Electricidad Básica",
                  "Artes y Manualidades",
                  "Huertos Urbanos",
                ].map((taller, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl"
                  >
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    <span className="text-gray-700">
                      {taller}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Inscríbete
              </h2>
              <p className="text-center text-gray-700 mb-6">
                Completa el formulario y recibe información
                sobre próximas fechas
              </p>
              <form onSubmit={handleSubmitContacto} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={nombreContacto}
                    onChange={(e) => setNombreContacto(e.target.value)}
                    placeholder="Nombre completo"
                    required
                    className="p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-600 focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    value={emailContacto}
                    onChange={(e) => setEmailContacto(e.target.value)}
                    placeholder="Email"
                    required
                    className="p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-600 focus:outline-none transition-colors"
                  />
                </div>
                <input
                  type="tel"
                  value={numeroContacto}
                  onChange={(e) => setNumeroContacto(e.target.value)}
                  placeholder="Teléfono"
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-600 focus:outline-none transition-colors"
                />
                <textarea
                  rows={4}
                  value={mensajeContacto}
                  onChange={(e) => setMensajeContacto(e.target.value)}
                  required
                  placeholder="¿Qué taller te interesa? ¿Tienes experiencia previa?"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-600 focus:outline-none transition-colors resize-none"
                ></textarea>
                
                {/* Mensaje de estado del envío */}
                {estadoEnvio && (
                  <div className={`p-3 rounded-lg text-center font-medium ${
                    estadoEnvio.includes('éxito') 
                      ? 'bg-green-100 text-green-700' 
                      : estadoEnvio.includes('espera') 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {estadoEnvio}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300"
                >
                  Solicitar Información
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Página de Servicio - Terapias
  if (currentPage === "servicio-terapias") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <div className="container mx-auto max-w-5xl">
          <button
            onClick={() => navigateToPage("home")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-4 rounded-2xl">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">
                  Terapias Especializadas
                </h1>
                <p className="text-gray-600">
                  Atención personalizada para tu bienestar
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Servicios Terapéuticos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ofrecemos servicios
                terapéuticos diseñados para abordar las
                necesidades específicas de cada persona. Nuestro
                equipo de terapeutas certificados trabaja con un
                enfoque integral, considerando los aspectos
                físicos, emocionales y sociales del bienestar.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Cada plan terapéutico es personalizado y se
                ajusta según el progreso del paciente,
                garantizando resultados efectivos y sostenibles.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Tipos de Terapia
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Terapia Física",
                  "Terapia Familiar",
                  "Equinoterapia",
                ].map((terapia, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      {terapia}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Agenda tu Sesión
              </h2>
              <p className="text-center text-gray-700 mb-6">
                Contáctanos para más información sobre nuestros
                servicios terapéuticos
              </p>
              <form onSubmit={handleSubmitContacto} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={nombreContacto}
                    onChange={(e) => setNombreContacto(e.target.value)}
                    placeholder="Nombre completo"
                    required
                    className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    value={emailContacto}
                    onChange={(e) => setEmailContacto(e.target.value)}
                    placeholder="Email"
                    required
                    className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>
                <input
                  type="tel"
                  value={numeroContacto}
                  onChange={(e) => setNumeroContacto(e.target.value)}
                  required
                  placeholder="Teléfono"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                />
                <textarea
                  rows={4}
                  value={mensajeContacto}
                  onChange={(e) => setMensajeContacto(e.target.value)}
                  required
                  placeholder="¿Qué tipo de terapia necesitas? Cuéntanos más sobre tu situación..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors resize-none"
                ></textarea>
                {/* Envio de mensaje*/}
                {estadoEnvio && (
                  <div className={`p-3 rounded-lg text-center font-medium ${
                    estadoEnvio.includes('éxito') 
                      ? 'bg-green-100 text-green-700' 
                      : estadoEnvio.includes('espera') 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {estadoEnvio}
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300"
                >
                  Solicitar Información
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Página de Galería de Instalaciones
  if (currentPage === "galeria-instalaciones") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6">
        <div className="container mx-auto max-w-6xl">
          <button
            onClick={() => navigateToPage("home")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Galería de{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Instalaciones
                </span>
              </h1>
              <p className="text-xl text-gray-700">
                Conoce nuestros espacios diseñados para tu
                comodidad y aprendizaje
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  image:
                    "https://autismax.org.mx/wp-content/uploads/2018/12/fachada.jpg",
                  title: "Edificio Principal",
                  description:
                    "Vista exterior de nuestras modernas instalaciones",
                },
                {
                  image:
                    "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181120_122527.jpg",
                  title: "Aulas de Aprendizaje",
                  description:
                    "Espacios luminosos equipados con tecnología",
                },
                {
                  image:
                    "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181120_122629.jpg",
                  title: "Salas de Terapia",
                  description:
                    "Ambientes tranquilos para atención personalizada",
                },
                {
                  image:
                    "https://autismax.org.mx/wp-content/uploads/2019/01/thumbnail_20181121_134720.jpg",
                  title: "Talleres",
                  description:
                    "Espacios equipados para talleres prácticos",
                },
                {
                  image:
                    "https://autismax.org.mx/wp-content/uploads/2019/01/20181206_134452-scaled.jpg",
                  title: "Área Recreativa",
                  description:
                    "Espacios para actividades lúdicas y deportivas",
                },
                {
                  image:
                    "https://autismax.org.mx/wp-content/uploads/2019/01/thumbnail_20181120_122512-1.jpg",
                  title: "Sala Multiusos",
                  description:
                    "Espacio versátil para eventos y reuniones",
                },
              ].map((facility, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {facility.title}
                    </h3>
                    <p className="text-gray-600">
                      {facility.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-700 mb-6">
                ¿Quieres visitarnos? Agenda una visita guiada
                por nuestras instalaciones
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateToPage("home")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300"
              >
                Contáctanos para agendar
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Página Principal
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg"
            : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigateToPage("home")}
            >
              <Heart className="w-8 h-8 text-pink-600 fill-pink-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                Fundación Autismax
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Inicio
              </button>
              <a
                href="https://www.paypal.com/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 inline-block text-center"
              >
                Donativos
              </a>
              <button
                onClick={() => scrollToSection("contactos")}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Contactos
              </button>
              {cargando ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 border-2 border-pink-600 text-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-all duration-300"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <button
                  onClick={() => navigateToPage("login")}
                  className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  Log In
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden flex flex-col gap-4 mt-4 pb-4"
            >
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 text-left"
              >
                Inicio
              </button>
              <a
                href="https://www.paypal.com/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-pink-600 transition-colors duration-300 text-left"
              >
                Donativos
              </a>
              <button
                onClick={() => scrollToSection("contactos")}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 text-left"
              >
                Contactos
              </button>
              {cargando ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-pink-600 transition-colors duration-300 text-left"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <button
                  onClick={() => navigateToPage("login")}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-300 text-left"
                >
                  Log In
                </button>
              )}
            </motion.nav>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section
        id="inicio"
        className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 min-h-screen flex items-center"
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Transformando vidas,
                <span className="bg-gradient-to-r from-blue-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                  {" "}
                  construyendo futuro
                </span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Somos una fundación dedicada a mejorar la
                calidad de vida de las comunidades más
                necesitadas a través de programas de educación,
                salud y desarrollo social.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.paypal.com/donate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-block"
                >
                  Haz una donación
                </a>
                <button
                  onClick={() =>
                    scrollToSection("quienes-somos")
                  }
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  Conoce más
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-pink-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <ImageWithFallback
                src="https://autismax.org.mx/wp-content/uploads/2016/04/Logo-autismax-6776.jpg"
                alt="Voluntarios ayudando"
                className="rounded-3xl shadow-2xl relative z-10 w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section id="quienes-somos" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                ¿Quiénes{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Somos?
                </span>
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Autismax es una institución de asistencia
                privada fundada en 2009 con el objetivo de
                atender niños y jóvenes con autismo en la zona
                norte de la ciudad de méxico.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Ofrecemos un programa integral con amplia
                experiencia en discapacidad, enfocado en la
                autonomía y calidad de vida. mediante planes
                individuales y evaluaciones semanales, logramos
                avances en habilidades y conducta,
                consolidándonos como una opción clínica y
                educativa especializada.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    9+
                  </div>
                  <div className="text-sm text-gray-600">
                    Años de experiencia
                  </div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-pink-600 mb-1">
                    x
                  </div>
                  <div className="text-sm text-gray-600">
                    Vidas impactadas
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-300 rounded-full blur-2xl opacity-40"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1617080090911-91409e3496ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzdXBwb3J0JTIwaGFuZHN8ZW58MXx8fHwxNzY4NDMyNjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Apoyo_comunitario"
                className="rounded-3xl shadow-2xl relative z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nuestra Misión */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Nuestra{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Misión
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Atender a niños y jóvenes con autismo en la zona
              norte de la ciudad de méxico, a través de un un
              programa integral que busca la dignidad y la
              autonomía de los beneficiarios y mejorar su
              calidad de vida.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nuestra Visión */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-block p-4 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-2xl mb-6">
                <Eye className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Nuestra{" "}
                <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Visión
                </span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Ser una institucion lider en la atención de
                niños y jovenes con autismo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Nuestros Valores */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-block p-4 bg-gradient-to-br from-green-600 to-amber-600 rounded-2xl mb-6">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Nuestros{" "}
                <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Valores
                </span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Confianza, honestidad, etica, amor ,
                comprensión, tolerancia, responsabilidad y
                respeto.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section
        id="servicios"
        className="py-20 bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Nuestros{" "}
              <span className="bg-gradient-to-r from-pink-600 to-yellow-600 bg-clip-text text-transparent">
                Servicios
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ofrecemos una variedad de servicios los cuales son
              los siguientes:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-10 h-10" />,
                title: "Cursos",
                description:
                  "Programas educativos en diversas áreas del conocimiento para todas las edades.",
                color: "from-blue-600 to-blue-700",
                bgColor:
                  "bg-gradient-to-br from-blue-50 to-sky-50",
                page: "servicio-cursos" as Page,
              },
              {
                icon: <Wrench className="w-10 h-10" />,
                title: "Talleres",
                description:
                  "Talleres de habilidades para vida diaria.",
                color: "from-yellow-600 to-amber-600",
                bgColor:
                  "bg-gradient-to-br from-yellow-50 to-amber-50",
                page: "servicio-talleres" as Page,
              },
              {
                icon: <Brain className="w-10 h-10" />,
                title: "Terapias",
                description:
                  "Sesiones terapéuticas personalizadas: familiares, físicas y equinoterapias.",
                color: "from-blue-600 to-cyan-600",
                bgColor:
                  "bg-gradient-to-br from-blue-50 to-cyan-50",
                page: "servicio-terapias" as Page,
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => navigateToPage(service.page)}
                className={`${service.bgColor} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer`}
              >
                <div
                  className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-700 mb-4">
                  {service.description}
                </p>
                <div className="flex items-center text-blue-600 font-semibold">
                  Más información
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instalaciones */}
      <section id="instalaciones" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Nuestras{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Instalaciones
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Espacios diseñados para brindar comodidad y
              facilitar el aprendizaje
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image:
                  "https://autismax.org.mx/wp-content/uploads/2018/12/fachada.jpg",
                title: "Edificio Principal",
                description:
                  "Instalaciones modernas equipadas con tecnología de punta",
                galleryKey: "edificio-principal" as const,
              },
              {
                image:
                  "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181120_122456.jpg",
                title: "Aulas de Aprendizaje",
                description:
                  "Espacios educativos luminosos y confortables",
                galleryKey: "aulas-aprendizaje" as const,
              },
              {
                image:
                  "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181120_122629.jpg",
                title: "Salas de Terapia",
                description:
                  "Ambientes tranquilos para atención personalizada",
                galleryKey: "salas-terapia" as const,
              },
              {
                image:
                  "https://autismax.org.mx/wp-content/uploads/2018/12/thumbnail_20181121_134720-1.jpg",
                title: "Talleres",
                description:
                  "Espacios equipados para talleres prácticos",
                galleryKey: "talleres-oficios" as const,
              },
              {
                image:
                  "https://autismax.org.mx/wp-content/uploads/2019/01/20181206_134452-scaled.jpg",
                title: "Área Recreativa",
                description:
                  "Espacios para actividades lúdicas y deportivas",
                galleryKey: "area-recreativa" as const,
              },
              {
                image:
                  "https://autismax.org.mx/wp-content/uploads/2019/01/thumbnail_20181120_122512-1.jpg",
                title: "Sala Multiusos",
                description:
                  "Espacio versátil para eventos y reuniones",
                galleryKey: "sala-multiusos" as const,
              },
            ].map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                onClick={() =>
                  setActiveGallery(facility.galleryKey)
                }
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {facility.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold">
                    Ver galería
                    <Eye className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Redes Sociales */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Síguenos en{" "}
              <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Redes Sociales
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Mantente al día con nuestras actividades, eventos
              e historias inspiradoras
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: <Facebook className="w-8 h-8" />,
                name: "Facebook",
                handle: "@autismax",
                href: "https://www.facebook.com/autismax",
                color: "from-blue-600 to-blue-700",
                bgColor: "bg-blue-50",
              },
              {
                icon: <Instagram className="w-8 h-8" />,
                name: "Instagram",
                handle: "@fundacionautismax",
                href: "https://www.instagram.com/fundacionautismax/?hl=es",
                color: "from-red-600 to-pink-600",
                bgColor: "bg-red-50",
              },
              {
                icon: <Linkedin className="w-8 h-8" />,
                name: "Linkedin",
                handle: "@mary-leonmuñoz",
                href: "https://www.linkedin.com/in/mary-leonmuñoz-44b44344/?originalSubdomain=mx",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-60",
              },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank" // abre en nueva pestaña
                rel="noopener noreferrer" // seguridad
                aria-label={`${social.name} ${social.handle}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`${social.bgColor} p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300 block`}
              >
                <div
                  className={`bg-gradient-to-br ${social.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mx-auto mb-4`}
                >
                  {social.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">
                  {social.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {social.handle}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contactos Section */}
      <section
        id="contactos"
        className="py-20 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Contáctanos
              </span>
            </h2>
            <p className="text-xl text-gray-700">
              Estamos aquí para responder tus preguntas y
              escuchar tus ideas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <ImageWithFallback
                src="https://autismax.org.mx/wp-content/uploads/2016/04/Logo-autismax-6776.jpg"
                alt="Contacto"
                className="rounded-3xl shadow-2xl"
              />
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email</h3>
                    <p className="text-gray-600">
                      autismax.iap2009@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      Teléfono
                    </h3>
                    <p className="text-gray-600">
                      +52 (55) 4171-3818
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      Dirección
                    </h3>
                    <p className="text-gray-600">
                      Av. Fuentes de Satélite 3A, Lomas de
                      Bellavista. C.P. 52994. Cd. López Mateos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      Horario
                    </h3>
                    <p className="text-gray-600">
                      Lun - Vie: 9:00 AM - 6:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmitContacto} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombreContacto}
                    onChange={(e) => setNombreContacto(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    value={emailContacto}
                    onChange={(e) => setEmailContacto(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Numero
                  </label>
                  <input
                    value={numeroContacto}
                    onChange={(e) => setNumeroContacto(e.target.value)}
                    placeholder="Coloca tu numero celular"
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Mensaje
                  </label>
                  <textarea
                    value={mensajeContacto}
                    onChange={(e) => setMensajeContacto(e.target.value)}
                    rows={5}
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors duration-300 resize-none"
                  ></textarea>
                </div>

                {/* Mensaje de estado del envío */}
                {estadoEnvio && (
                  <div className={`p-3 rounded-lg text-center font-medium ${
                    estadoEnvio.includes('éxito') 
                      ? 'bg-green-100 text-green-700' 
                      : estadoEnvio.includes('espera') 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {estadoEnvio}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={estadoEnvio.includes('espera')}
                  className={`w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 ${
                    estadoEnvio.includes('espera') ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {estadoEnvio.includes('espera') ? 'Enviando...' : 'Enviar Mensaje'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-red-600 fill-red-600" />
                <span className="text-xl font-bold">
                  Fundación Autismax
                </span>
              </div>
              <p className="text-gray-400">
                Educando desde 2009
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => scrollToSection("inicio")}
                    className="hover:text-blue-400 transition-colors"
                  >
                    Inicio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      scrollToSection("quienes-somos")
                    }
                    className="hover:text-blue-400 transition-colors"
                  >
                    Quiénes Somos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("servicios")}
                    className="hover:text-blue-400 transition-colors"
                  >
                    Servicios
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToPage("donativos")}
                    className="hover:text-red-400 transition-colors"
                  >
                    Donativos
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-blue-400 transition-colors">
                  autismax.iap2009@gmail.com
                </li>
                <li className="hover:text-blue-400 transition-colors">
                  +52 (55) 4171-3818
                </li>
                <li className="hover:text-blue-400 transition-colors">
                  Lun - Vie: 9:00 AM - 6:30 PM
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Síguenos</h4>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/autismax/"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/fundacionautismax/"
                  className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                {/*<a
                  href=""
                  className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center hover:bg-sky-700 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>*/}
                <a
                  href="https://www.linkedin.com/in/mary-leonmuñoz-44b44344/?originalSubdomain=mx"
                  className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2026 Fundación Autismax. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Gallery Modal */}
      {activeGallery && (
        <GalleryModal
          isOpen={true}
          onClose={() => setActiveGallery(null)}
          title={galleryData[activeGallery].title}
          images={galleryData[activeGallery].images}
        />
      )}
    </div>
  );
}