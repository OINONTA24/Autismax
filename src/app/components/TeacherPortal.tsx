import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProfesorFormView, MateriaFormView } from "./TeacherPortalExtensions";
import {
  Home,
  Users,
  ClipboardList,
  UserCircle,
  LogOut,
  Search,
  Plus,
  Calendar,
  Edit,
  Trash2,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Clock,
  ChevronRight,
  Eye,
  X,
  ChevronDown,
  Settings,
  FileText,
  Shield,
  Activity,
} from "lucide-react";

/**
 * RUTAS DEL PORTAL (route:*)
 * route:/portal - Dashboard principal
 * route:/portal/alumnos - Lista de alumnos
 * route:/portal/alumnos/nuevo - Formulario nuevo alumno
 * route:/portal/alumnos/:id/editar - Formulario editar alumno
 * route:/portal/evaluaciones - Lista de evaluaciones
 * route:/portal/evaluaciones/nueva - Formulario nueva evaluación
 * route:/portal/observaciones/nueva - Formulario nueva observación
 * route:/portal/perfil - Mi perfil
 * 
 * RUTAS ADMIN (visibility: admin-only)
 * route:/admin - Panel administrativo
 * route:/admin/profesores - Gestión de profesores
 * route:/admin/alumnos - Gestión de alumnos (admin)
 * route:/admin/materias - Gestión de materias
 * route:/admin/evaluaciones - Gestión de evaluaciones
 * route:/admin/configuracion - Configuración del sistema
 */

type PortalRoute =
  | "portal"
  | "portal/alumnos"
  | "portal/alumnos/nuevo"
  | "portal/alumnos/:id/editar"
  | "portal/evaluaciones"
  | "portal/evaluaciones/nueva"
  | "portal/observaciones/nueva"
  | "portal/perfil"
  | "admin"
  | "admin/profesores"
  | "admin/alumnos"
  | "admin/materias"
  | "admin/materias/nueva"
  | "admin/evaluaciones"
  | "admin/configuracion"
  | "admin/profesores/nuevo";

interface TeacherPortalProps {
  onLogout: () => void;
}

// --- MOLDES DE DATOS (INTERFACES) ---
export interface Alumno {
  id: string;
  nombre: string;
  edad: number;
  grupo: string;
  tutorNombre: string;
  ultimaEvaluacion: string;
  progreso: number;
  asignadoA: string;
}

export interface Materia {
  id: string;
  nombre: string;
  activo: boolean;
}

export interface Evaluacion {
  id: string;
  alumnoId: string;
  alumnoNombre: string;
  materiaId: string;
  materiaNombre: string;
  profesorUid: string;
  fecha: string;
  estado: "pendiente" | "completada";
  puntaje?: 1 | 2 | 3; // El '?' significa que puede no existir si está pendiente
  comentarios?: string;
}

export interface Observacion {
  id: string;
  alumnoId: string;
  profesorUid: string;
  profesorNombre: string;
  tema: string;
  observacion: string;
  fecha: string;
}

export interface Profesor {
  uid: string;
  nombre: string;
  email: string;
  rol: "admin" | "profesor";
  alumnosAsignados: number;
}

interface UsuarioLogueado {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  rol: string;
}

interface UsuarioPerfil {
  uid: string;
  nombre: string;
  email: string;
  rol: "admin" | "profesor";
}

export default function TeacherPortal({ onLogout }: { onLogout: () => void }) {
  const [usuario, setUsuario] = useState<UsuarioLogueado | null>(null);
  const [currentRoute, setCurrentRoute] = useState<PortalRoute>("portal");
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<string | null>(null);
  const [showDetalleAlumnoModal, setShowDetalleAlumnoModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  // Estados que se llenarán con la base de datos
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  // 3. Pequeña pantalla de carga de seguridad
  if (!usuario) {
    return <div className="flex items-center justify-center min-h-screen">Cargando tu portal...</div>;
  }

  // 4. Creamos una variable rápida para saber si es admin
  const esAdmin = usuario.rol === 'admin';

  // 1. Traducimos el rol de la Base de Datos al formato que Figma/React espera
  const rolFrontend: "admin" | "profesor" = 
    (usuario.rol === 'Administrador' || usuario.rol === 'admin') ? 'admin' : 'profesor';

  // 2. Creamos un "doble" del usuario exclusivo para el componente PerfilView
  const usuarioAdaptadoParaPerfil = {
    uid: String(usuario.id), // Convertimos el número a string por si acaso
    nombre: `${usuario.nombre} ${usuario.apellidos}`,
    email: usuario.correo,
    rol: rolFrontend
  };

  const navigateTo = (route: PortalRoute, params?: Record<string, string>) => {
    setCurrentRoute(route);
    setQueryParams(params || {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDetalleAlumno = (alumnoId: string) => {
    setSelectedAlumnoId(alumnoId);
    setShowDetalleAlumnoModal(true);
  };

  const closeDetalleAlumno = () => {
    setShowDetalleAlumnoModal(false);
    setSelectedAlumnoId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      <div className="flex">
        {/* Sidebar - visibility: both */}
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          onLogout={onLogout}
          userRole={rolFrontend} 
        />

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Header - ¡Aquí estaba el error principal! Pasamos el usuario real */}
          <Header usuario={usuario} onLogout={onLogout} esAdmin={esAdmin} />

          <div className="p-8">
            {/* route:/portal */}
            {currentRoute === "portal" && (
              <DashboardView onNavigate={navigateTo} userRole={rolFrontend} alumnos={[]} evaluaciones={[]} observaciones={[]} />
            )}

            {/* route:/portal/alumnos */}
            {currentRoute === "portal/alumnos" && (
              <AlumnosListView
                alumnos={alumnos}
                onNavigate={navigateTo}
                onOpenDetalle={openDetalleAlumno}
                userRole={rolFrontend}
              />
            )}

            {/* route:/portal/alumnos/nuevo */}
            {currentRoute === "portal/alumnos/nuevo" && (
              <AlumnoFormView mode="create" onNavigate={navigateTo} alumnos={[]}/>
            )}

            {/* route:/portal/alumnos/:id/editar */}
            {currentRoute === "portal/alumnos/:id/editar" && queryParams.id && (
              <AlumnoFormView
                mode="edit"
                alumnoId={queryParams.id}
                onNavigate={navigateTo} alumnos={[]} />
            )}

            {/* route:/portal/evaluaciones */}
            {currentRoute === "portal/evaluaciones" && (
              <EvaluacionesListView
                evaluaciones={evaluaciones}
                onNavigate={navigateTo}
              />
            )}

            {/* route:/portal/evaluaciones/nueva */}
            {currentRoute === "portal/evaluaciones/nueva" && (
              <EvaluacionFormView
                queryParams={queryParams}
                onNavigate={navigateTo}
                materias={materias}
                alumnos={alumnos}
              />
            )}

            {/* route:/portal/observaciones/nueva */}
            {currentRoute === "portal/observaciones/nueva" && (
              <ObservacionFormView
                queryParams={queryParams}
                onNavigate={navigateTo}
                alumnos={alumnos}
              />
            )}

            {/* route:/portal/perfil */}
            {currentRoute === "portal/perfil" && <PerfilView user={usuarioAdaptadoParaPerfil} />}

            {/* --- RUTAS DE ADMINISTRADOR ---
              Usamos la variable esAdmin que creaste arriba para que quede más limpio
            */}

            {/* route:/admin - visibility: admin-only */}
            {currentRoute === "admin" && esAdmin && (
              <AdminDashboardView onNavigate={navigateTo} profesores={[]} alumnos={[]} evaluaciones={[]} materias={[]} />
            )}

            {/* route:/admin/profesores - visibility: admin-only */}
            {currentRoute === "admin/profesores" && esAdmin && (
              <AdminProfesoresView profesores={profesores} onNavigate={navigateTo} />
            )}

            {/* route:/admin/profesores/nuevo */}
            {currentRoute === "admin/profesores/nuevo" && esAdmin && (
              <ProfesorFormView onNavigate={navigateTo} />
            )}

            {/* route:/admin/alumnos - visibility: admin-only}*/}
            {currentRoute === "admin/alumnos" && esAdmin && (
              <AdminAlumnosView alumnos={alumnos} />
            )}

            {/* route:/admin/materias - visibility: admin-only */}
            {currentRoute === "admin/materias" && esAdmin && (
              <AdminMateriasView materias={materias} onNavigate={navigateTo} />
            )}
            
            {/* route:/admin/materias/nueva */}
            {currentRoute === "admin/materias/nueva" && esAdmin && (
              <MateriaFormView onNavigate={navigateTo} />
            )}

            {/* route:/admin/evaluaciones - visibility: admin-only */}
            {currentRoute === "admin/evaluaciones" && esAdmin && (
              <AdminEvaluacionesView evaluaciones={evaluaciones} />
            )}

            {/* route:/admin/configuracion - visibility: admin-only*/} 
            {currentRoute === "admin/configuracion" && esAdmin && (
              <AdminConfiguracionView />
            )}
          </div>
        </div>
      </div>

      {/* Modal: Detalle de alumno */}
      <AnimatePresence>
        {showDetalleAlumnoModal && selectedAlumnoId && (
          <DetalleAlumnoModal
            alumno={alumnos.find((a) => a.id === selectedAlumnoId)!}
            observaciones={observaciones.filter(
              (o) => o.alumnoId === selectedAlumnoId
            )}
            evaluaciones={evaluaciones.filter(
              (e) => e.alumnoId === selectedAlumnoId
            )}
            materias={materias}
            onClose={closeDetalleAlumno}
            onNavigate={navigateTo}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Sidebar Component
 * visibility: both (admin y profesor ven items básicos)
 * visibility: admin-only (bloques de administración)
 * Tiene la finalidad de poder determinar distintos roles
 * donde cada uno tiene distintas funciones
 */
function Sidebar({
  currentRoute,
  onNavigate,
  onLogout,
  userRole,
}: {
  currentRoute: PortalRoute;
  onNavigate: (route: PortalRoute) => void;
  onLogout: () => void;
  userRole: "admin" | "profesor";
}) {
  const menuItems = [
    { id: "portal" as PortalRoute, icon: Home, label: "Inicio", role: "both" },
    {
      id: "portal/alumnos" as PortalRoute,
      icon: Users,
      label: "Alumnos",
      role: "both",
    },
    {
      id: "portal/evaluaciones" as PortalRoute,
      icon: ClipboardList,
      label: "Evaluaciones",
      role: "both",
    },
    {
      id: "portal/perfil" as PortalRoute,
      icon: UserCircle,
      label: "Mi Perfil",
      role: "both",
    },
  ];

  // visibility: admin-only
  const adminMenuItems = [
    { id: "admin" as PortalRoute, icon: Shield, label: "Panel Admin" },
    { id: "admin/profesores" as PortalRoute, icon: Users, label: "Profesores" },
    { id: "admin/alumnos" as PortalRoute, icon: Users, label: "Alumnos (Admin)" },
    { id: "admin/materias" as PortalRoute, icon: BookOpen, label: "Materias" },
    {
      id: "admin/evaluaciones" as PortalRoute,
      icon: ClipboardList,
      label: "Evaluaciones",
    },
    { id: "admin/configuracion" as PortalRoute, icon: Settings, label: "Configuración" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-2xl flex flex-col z-40">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-pink-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Portal de</h2>
            <p className="text-sm text-gray-600">Profesores</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Items básicos - visibility: both */}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id || currentRoute.startsWith(item.id + "/");

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{item.label}</span>
            </button>
          );
        })}

        {/* Separador Admin - visibility: admin-only */}
        {userRole === "admin" && (
          <>
            <div className="pt-6 pb-2 px-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Administración
              </p>
            </div>

            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-yellow-50"
                  }`}
                  data-visibility="admin-only"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </button>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          id="menu-item-signout"
          className="w-full flex items-center gap-3 px-4 py-3 text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Header Component
 * Sin icono de notificaciones
 * IDs: header-title, user-menu-button, menu-item-profile, menu-item-signout
 */
function Header({
  usuario,
  onLogout,
  esAdmin,
}: {
  usuario: UsuarioLogueado;
  onLogout: () => void;
  esAdmin: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 id="header-title" className="text-2xl font-bold">
            Portal de Profesores
          </h1>
          <p className="text-gray-600">Martes, 3 de Febrero 2026</p>
        </div>
        <div className="relative">
          <button
            id="user-menu-button"
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div className="text-right">
              <p className="font-semibold text-sm">{usuario.nombre} {usuario.apellidos}</p>
              <p className="text-xs text-gray-600 capitalize">{usuario.rol}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
              {/* Calculamos iniciales de forma segura con los nuevos datos */}
              {usuario.nombre.charAt(0).toUpperCase()}
              {usuario.apellidos.charAt(0).toUpperCase()}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
              >
                <button
                  id="menu-item-profile"
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-2"
                  onClick={() => {
                    setShowMenu(false);
                    // Navigate to profile
                  }}
                >
                  <UserCircle className="w-4 h-4" />
                  Mi perfil
                </button>
                <button
                  id="menu-item-signout"
                  onClick={() => {
                    setShowMenu(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-pink-600 hover:bg-pink-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/**
 * route:/portal
 * Dashboard principal
 * Data: profesores, alumnos, evaluaciones, observaciones
 */
function DashboardView({
  onNavigate,
  userRole,
  alumnos, 
  evaluaciones, 
  observaciones, 
}: {
  onNavigate: (route: PortalRoute, params?: Record<string, string>) => void;
  userRole: "admin" | "profesor";
  alumnos: Alumno[];
  evaluaciones: Evaluacion[];
  observaciones: Observacion[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold">Dashboard</h2>

      {/* Tarjetas de indicadores - IDs: stat-* */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          id="stat-total-alumnos"
          className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer"
          onClick={() => onNavigate("portal/alumnos")}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-blue-600">
              {alumnos.length}
            </span>
          </div>
          <h3 className="font-bold text-gray-700">Alumnos Asignados</h3>
          <p className="text-sm text-gray-600 mt-1">Total de estudiantes activos</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          id="stat-proximas-evaluaciones"
          className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer"
          onClick={() => onNavigate("portal/evaluaciones")}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-pink-600">
              {evaluaciones.filter((e) => e.estado === "pendiente").length}
            </span>
          </div>
          <h3 className="font-bold text-gray-700">Próximas Evaluaciones</h3>
          <p className="text-sm text-gray-600 mt-1">Pendientes esta semana</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          id="stat-ultimas-actividades"
          className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-yellow-600">
              {observaciones.length + evaluaciones.filter(e => e.estado === "completada").length}
            </span>
          </div>
          <h3 className="font-bold text-gray-700">Actividades Recientes</h3>
          <p className="text-sm text-gray-600 mt-1">Observaciones y evaluaciones</p>
        </motion.div>
      </div>

      {/* Accesos rápidos - IDs: cta-* */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Accesos Rápidos</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            id="cta-nueva-evaluacion"
            onClick={() => onNavigate("portal/evaluaciones/nueva")}
            className="p-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Nueva Evaluación</span>
          </button>
          <button
            id="cta-agregar-nota"
            onClick={() => onNavigate("portal/observaciones/nueva")}
            className="p-4 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3"
          >
            <Edit className="w-5 h-5" />
            <span className="font-semibold">Agregar Nota</span>
          </button>
          <button
            id="cta-consultar-historial"
            onClick={() => onNavigate("portal/alumnos")}
            className="p-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3"
          >
            <Eye className="w-5 h-5" />
            <span className="font-semibold">Consultar Historial</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * route:/portal/alumnos
 * Lista de alumnos con búsqueda y filtros
 * Acción: "Ver detalles" abre modal (no navega)
 * Data: alumnos (CRUD profesor: solo asignados, admin: total)
 */
function AlumnosListView({
  alumnos,
  onNavigate,
  onOpenDetalle,
  userRole,
}: {
  alumnos: Alumno[];
  onNavigate: (route: PortalRoute, params?: Record<string, string>) => void;
  onOpenDetalle: (id: string) => void;
  userRole: "admin" | "profesor";
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");

  const filteredAlumnos = alumnos.filter((alumno) => {
    const matchesSearch = alumno.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "todos" ||
      alumno.grupo.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Mis Alumnos</h2>
        <button
          id="btn-agregar-alumno"
          onClick={() => onNavigate("portal/alumnos/nuevo")}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar Alumno
        </button>
      </div>

      {/* Búsqueda y filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar alumno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {["Todos", "Grupo A", "Grupo B", "Grupo C"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter.toLowerCase())}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  selectedFilter === filter.toLowerCase()
                    ? "bg-gradient-to-r from-blue-600 to-pink-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de alumnos */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredAlumnos.map((alumno, index) => (
          <motion.div
            key={alumno.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {alumno.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1 truncate">{alumno.nombre}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                  <span>{alumno.edad} años</span>
                  <span>•</span>
                  <span>{alumno.grupo}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Última evaluación: {alumno.ultimaEvaluacion}
                </p>
              </div>
            </div>

            {/* Progreso */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progreso</span>
                <span className="font-bold text-blue-600">{alumno.progreso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${alumno.progreso}%` }}
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <button
                id={`btn-ver-detalles-${alumno.id}`}
                onClick={() => onOpenDetalle(alumno.id)}
                className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Detalles
              </button>
              <button
                onClick={() =>
                  onNavigate("portal/alumnos/:id/editar", { id: alumno.id })
                }
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAlumnos.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500">Sin datos disponibles</p>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Modal: Detalle de alumno
 * No navega, abre como overlay
 * IDs: modal-detalle-alumno, modal-close, modal-nueva-evaluacion, modal-agregar-nota
 * Muestra: datos, progreso, calificaciones por materia (1-3), observaciones
 */
function DetalleAlumnoModal({
  alumno,
  observaciones,
  evaluaciones,
  materias,
  onClose,
  onNavigate,
}: {
  alumno: Alumno;
  observaciones: Observacion[];
  evaluaciones: Evaluacion[];
  materias: Materia[];
  onClose: () => void;
  onNavigate: (route: PortalRoute, params?: Record<string, string>) => void;
}) {
  // Calcular calificaciones por materia
  const calificacionesPorMateria = materias.map((materia) => {
    const evaluacionesMateria = evaluaciones.filter(
      (e) => e.materiaId === materia.id && e.estado === "completada"
    );
    const promedio =
      evaluacionesMateria.length > 0
        ? evaluacionesMateria.reduce((sum, e) => sum + (e.puntaje || 0), 0) /
          evaluacionesMateria.length
        : 0;

    return {
      materia: materia.nombre,
      puntaje: promedio,
      evaluaciones: evaluacionesMateria.length,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        id="modal-detalle-alumno"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start rounded-t-3xl">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {alumno.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{alumno.nombre}</h2>
              <div className="flex gap-3 text-gray-600">
                <span>{alumno.edad} años</span>
                <span>•</span>
                <span>{alumno.grupo}</span>
              </div>
              {alumno.tutorNombre && (
                <p className="text-sm text-gray-500 mt-1">
                  Tutor: {alumno.tutorNombre}
                </p>
              )}
            </div>
          </div>
          <button
            id="modal-close"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Progreso general */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Progreso General</span>
              <span className="text-2xl font-bold text-blue-600">
                {alumno.progreso}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${alumno.progreso}%` }}
                transition={{ duration: 1 }}
                className="bg-gradient-to-r from-blue-600 to-pink-600 h-4 rounded-full"
              />
            </div>
          </div>

          {/* Gráfica de progreso */}
          <div>
            <h3 className="text-lg font-bold mb-3">Evolución del Progreso</h3>
            <div
              id="chart-progreso-alumno"
              className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl p-6 h-48 flex items-center justify-center"
            >
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-blue-600" />
                <p className="text-sm">(Gráfica de evolución)</p>
              </div>
            </div>
          </div>

          {/* Calificaciones por materia - Escala 1-3 */}
          <div>
            <h3 className="text-lg font-bold mb-3">Calificaciones por Materia</h3>
            <p className="text-xs text-gray-500 mb-3">
              Escala: 1 = Iniciado · 2 = En proceso · 3 = Alcanzado
            </p>
            <div className="space-y-3">
              {calificacionesPorMateria.map((cal) => (
                <div key={cal.materia} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{cal.materia}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-lg font-bold ${
                          cal.puntaje >= 2.5
                            ? "bg-green-100 text-green-700"
                            : cal.puntaje >= 1.5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {cal.puntaje > 0 ? cal.puntaje.toFixed(1) : "—"}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({cal.evaluaciones} eval.)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        cal.puntaje >= 2.5
                          ? "bg-green-500"
                          : cal.puntaje >= 1.5
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${(cal.puntaje / 3) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historial de observaciones */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              Observaciones ({observaciones.length})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {observaciones.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  Sin datos disponibles
                </p>
              ) : (
                observaciones.map((obs) => (
                  <div
                    key={obs.id}
                    className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">{obs.tema}</span>
                      <span className="text-xs text-gray-500">{obs.fecha}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{obs.observacion}</p>
                    <p className="text-xs text-gray-500">Por: {obs.profesorNombre}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <button
              id="modal-nueva-evaluacion"
              onClick={() => {
                onClose();
                onNavigate("portal/evaluaciones/nueva", { alumnoId: alumno.id });
              }}
              className="py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Evaluación
            </button>
            <button
              id="modal-agregar-nota"
              onClick={() => {
                onClose();
                onNavigate("portal/observaciones/nueva", { alumnoId: alumno.id });
              }}
              className="py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Agregar Nota
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * route:/portal/alumnos/nuevo o route:/portal/alumnos/:id/editar
 * Formulario de alumno
 * Data: alumnos (action-save-alumno, action-delete-alumno)
 * IDs: alumno-guardar, alumno-cancelar, alumno-eliminar
 * Permisos: profesor CRUD solo asignados, admin CRUD total
 */
function AlumnoFormView({
  mode,
  alumnoId,
  onNavigate,
  alumnos,
}: {
  mode: "create" | "edit";
  alumnoId?: string;
  onNavigate: (route: PortalRoute) => void;
  alumnos: Alumno[];
}) {
  const alumno =
    mode === "edit"
      ? alumnos.find((a) => a.id === alumnoId)
      : null;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // action-save-alumno → addDoc/updateDoc
    console.log("Guardado correctamente");
    onNavigate("portal/alumnos");
  };

  const handleDelete = () => {
    // action-delete-alumno → deleteDoc (solo admin o propietario)
    console.log("Alumno eliminado");
    setShowDeleteModal(false);
    onNavigate("portal/alumnos");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl"
    >
      <button
        onClick={() => onNavigate("portal/alumnos")}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
        Volver a la lista
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">
          {mode === "create" ? "Nuevo Alumno" : "Editar Alumno"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="field-nombre"
                className="block text-gray-700 mb-2 font-semibold"
              >
                Nombre completo
              </label>
              <input
                id="field-nombre"
                type="text"
                defaultValue={alumno?.nombre || ""}
                required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="field-edad"
                className="block text-gray-700 mb-2 font-semibold"
              >
                Edad
              </label>
              <input
                id="field-edad"
                type="number"
                defaultValue={alumno?.edad || ""}
                required
                min="1"
                max="100"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="field-grupo"
                className="block text-gray-700 mb-2 font-semibold"
              >
                Grupo
              </label>
              <input
                id="field-grupo"
                type="text"
                defaultValue={alumno?.grupo || ""}
                required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="field-tutor"
                className="block text-gray-700 mb-2 font-semibold"
              >
                Nombre del tutor (opcional)
              </label>
              <input
                id="field-tutor"
                type="text"
                defaultValue={alumno?.tutorNombre || ""}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              id="alumno-guardar"
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Guardar
            </button>
            <button
              id="alumno-cancelar"
              type="button"
              onClick={() => onNavigate("portal/alumnos")}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
          </div>

          {/* Eliminar (solo en modo edit) */}
          {mode === "edit" && (
            <button
              id="alumno-eliminar"
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-3 text-pink-600 hover:bg-pink-50 rounded-xl font-semibold transition-all"
            >
              Eliminar Alumno
            </button>
          )}
        </form>
      </div>

      {/* Modal de confirmación de eliminación */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">Confirmar eliminación</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar este alumno? Esta acción no se
                puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-all"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * route:/portal/evaluaciones
 * Lista de evaluaciones con filtros
 * Sin botones "Editar" y "Eliminar"
 * Botón: "Realizar evaluación" navega a route:/portal/evaluaciones/nueva
 * IDs: filter-*, btn-realizar-evaluacion-*, btn-nueva-evaluacion
 */
function EvaluacionesListView({
  evaluaciones,
  onNavigate,
}: {
  evaluaciones: Evaluacion[];
  onNavigate: (route: PortalRoute, params?: Record<string, string>) => void;
}) {
  const [selectedFilter, setSelectedFilter] = useState<
    "todas" | "pendientes" | "completadas"
  >("todas");

  const filteredEvaluaciones = evaluaciones.filter((e) => {
    if (selectedFilter === "todas") return true;
    return e.estado === selectedFilter.slice(0, -1); // "pendientes" → "pendiente"
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Evaluaciones</h2>
        <button
          id="btn-nueva-evaluacion"
          onClick={() => onNavigate("portal/evaluaciones/nueva")}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Evaluación
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-4 flex gap-3">
        <button
          id="filter-todas"
          onClick={() => setSelectedFilter("todas")}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            selectedFilter === "todas"
              ? "bg-gradient-to-r from-blue-600 to-pink-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Todas
        </button>
        <button
          id="filter-pendientes"
          onClick={() => setSelectedFilter("pendientes")}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            selectedFilter === "pendientes"
              ? "bg-gradient-to-r from-blue-600 to-pink-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Pendientes
        </button>
        <button
          id="filter-completadas"
          onClick={() => setSelectedFilter("completadas")}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            selectedFilter === "completadas"
              ? "bg-gradient-to-r from-blue-600 to-pink-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Completadas
        </button>
      </div>

      {/* Lista de evaluaciones */}
      <div className="space-y-4">
        {filteredEvaluaciones.map((evaluacion) => (
          <motion.div
            key={evaluacion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{evaluacion.alumnoNombre}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      evaluacion.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {evaluacion.estado === "pendiente" ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Pendiente
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Completada
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  Materia: {evaluacion.materiaNombre}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {evaluacion.fecha}
                </p>
                {evaluacion.estado === "completada" && evaluacion.puntaje && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-semibold">Puntaje:</span>
                      <span
                        className={`px-3 py-1 rounded-lg font-bold ${
                          evaluacion.puntaje === 3
                            ? "bg-green-100 text-green-700"
                            : evaluacion.puntaje === 2
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {evaluacion.puntaje}{" "}
                        {evaluacion.puntaje === 3
                          ? "- Alcanzado"
                          : evaluacion.puntaje === 2
                          ? "- En proceso"
                          : "- Iniciado"}
                      </span>
                    </div>
                    {evaluacion.comentarios && (
                      <p className="text-sm text-gray-700">{evaluacion.comentarios}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {evaluacion.estado === "pendiente" && (
                  <button
                    id={`btn-realizar-evaluacion-${evaluacion.id}`}
                    onClick={() =>
                      onNavigate("portal/evaluaciones/nueva", {
                        alumnoId: evaluacion.alumnoId,
                        materiaId: evaluacion.materiaId,
                      })
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Realizar evaluación
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredEvaluaciones.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500">Sin datos disponibles</p>
        </div>
      )}
    </motion.div>
  );
}

/**
 * route:/portal/evaluaciones/nueva
 * Formulario de evaluación (crear/completar)
 * Precarga con query params si existen
 * IDs: eva-guardar, eva-cancelar
 * Data: action-save-evaluacion → addDoc
 * Escala 1-3 si completada
 */
function EvaluacionFormView({
  queryParams,
  onNavigate,
  materias,
  alumnos,
}: {
  queryParams: Record<string, string>;
  onNavigate: (route: PortalRoute) => void;
  materias:Materia[];
  alumnos: Alumno[];
}) {
  const [estado, setEstado] = useState<"pendiente" | "completada">("completada");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // action-save-evaluacion → addDoc(collection(db,'evaluaciones'), {...})
    console.log("Evaluación guardada correctamente");
    onNavigate("portal/evaluaciones");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl"
    >
      <button
        onClick={() => onNavigate("portal/evaluaciones")}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
        Volver a evaluaciones
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Nueva Evaluación</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Alumno</label>
              <select
                defaultValue={queryParams.alumnoId || ""}
                required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Seleccionar alumno</option>
                {alumnos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Materia</label>
              <select
                defaultValue={queryParams.materiaId || ""}
                required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Seleccionar materia</option>
                {materias
                  .filter((m) => m.activo)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Fecha</label>
              <input
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Estado</label>
              <select
                value={estado}
                onChange={(e) =>
                  setEstado(e.target.value as "pendiente" | "completada")
                }
                required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="pendiente">Pendiente</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          </div>

          {estado === "completada" && (
            <>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Puntaje (1-3)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  1 = Iniciado · 2 = En proceso · 3 = Alcanzado
                </p>
                <select
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                >
                  <option value="">Seleccionar puntaje</option>
                  <option value="1">1 - Iniciado</option>
                  <option value="2">2 - En proceso</option>
                  <option value="3">3 - Alcanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Comentarios
                </label>
                <textarea
                  rows={4}
                  placeholder="Observaciones sobre el desempeño del alumno..."
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors resize-none"
                />
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button
              id="eva-guardar"
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Guardar Evaluación
            </button>
            <button
              id="eva-cancelar"
              type="button"
              onClick={() => onNavigate("portal/evaluaciones")}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

/**
 * route:/portal/observaciones/nueva
 * Formulario de observación
 * IDs: obs-guardar, obs-cancelar
 * Data: action-save-observacion → addDoc
 */
function ObservacionFormView({
  queryParams,
  onNavigate,
  alumnos,
}: {
  queryParams: Record<string, string>;
  onNavigate: (route: PortalRoute) => void;
  alumnos: Alumno[];
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // action-save-observacion → addDoc(collection(db,'observaciones'), {...})
    console.log("Observación guardada correctamente");
    onNavigate("portal/alumnos");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl"
    >
      <button
        onClick={() => onNavigate("portal/alumnos")}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
        Volver
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Agregar Observación</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Alumno</label>
            <select
              defaultValue={queryParams.alumnoId || ""}
              required
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
            >
              <option value="">Seleccionar alumno</option>
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Tema</label>
            <input
              type="text"
              placeholder="Ej: Comportamiento en clase, Desarrollo social, etc."
              required
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Observación
            </label>
            <textarea
              rows={6}
              placeholder="Describe la observación..."
              required
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Fecha y hora
            </label>
            <input
              type="datetime-local"
              defaultValue={new Date().toISOString().slice(0, 16)}
              required
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              id="obs-guardar"
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Guardar Observación
            </button>
            <button
              id="obs-cancelar"
              type="button"
              onClick={() => onNavigate("portal/alumnos")}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

/**
 * route:/portal/perfil
 * Mi perfil del profesor
 */
function PerfilView({ user }: { user: UsuarioPerfil }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold">Mi Perfil</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Información Personal</h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Nombre completo
                </label>
                <input
                  type="text"
                  defaultValue={user.nombre}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Rol</label>
              <input
                type="text"
                value={user.rol === "admin" ? "Administrador" : "Profesor"}
                disabled
                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
              />
            </div>
            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Guardar Cambios
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Foto de Perfil</h3>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-pink-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
              {user.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors mb-2">
              Cambiar Foto
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Cambiar Contraseña</h3>
        <p className="text-gray-600 mb-4">
          Para cambiar tu contraseña, utiliza el sistema de autenticación.
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Cambiar Contraseña
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// VISTAS ADMIN (visibility: admin-only)
// ============================================================================

/**
 * route:/admin
 * Panel administrativo
 * visibility: admin-only
 */
function AdminDashboardView({
  onNavigate,
  profesores,
  alumnos,
  evaluaciones,
  materias,
}: {
  profesores: Profesor[];
  onNavigate: (route: PortalRoute) => void;
  alumnos: Alumno[];
  evaluaciones: Evaluacion[];
  materias: Materia[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      data-visibility="admin-only"
    >
      <h2 className="text-3xl font-bold">Panel de Administración</h2>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-700">Total Profesores</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {profesores.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-700">Total Alumnos</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {alumnos.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-700">Evaluaciones del Mes</h3>
          <p className="text-3xl font-bold text-pink-600 mt-2">
            {evaluaciones.filter((e) => e.estado === "completada").length}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-700">Materias Activas</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {materias.filter((m) => m.activo).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Accesos Rápidos</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate("admin/profesores")}
            className="p-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3"
          >
            <Users className="w-5 h-5" />
            <span className="font-semibold">Gestionar Profesores</span>
          </button>
          <button
            onClick={() => onNavigate("admin/materias")}
            className="p-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">Gestionar Materias</span>
          </button>
          <button
            onClick={() => onNavigate("admin/evaluaciones")}
            className="p-4 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3"
          >
            <ClipboardList className="w-5 h-5" />
            <span className="font-semibold">Gestionar Evaluaciones</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * route:/admin/profesores
 * Gestión de profesores
 * visibility: admin-only
 * IDs: btn-admin-agregar-profesor, btn-admin-editar-profesor, badge-rol-*
 */
function AdminProfesoresView({
  profesores,
  onNavigate,
}: {
  profesores:  Profesor[];
  onNavigate: (route: PortalRoute) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      data-visibility="admin-only"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestión de Profesores</h2>
        <button
          id="btn-admin-agregar-profesor"
          onClick={() => onNavigate("admin/profesores/nuevo" as PortalRoute)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar Profesor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Nombre</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Rol</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Alumnos Asignados
                </th>
                <th className="px-6 py-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profesores.map((prof) => (
                <tr key={prof.uid} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{prof.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{prof.email}</td>
                  <td className="px-6 py-4">
                    <span
                      id={`badge-rol-${prof.rol}`}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        prof.rol === "admin"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {prof.rol === "admin" ? "Administrador" : "Profesor"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{prof.alumnosAsignados}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        id={`btn-admin-editar-profesor-${prof.uid}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        onClick={() => console.log('Eliminar profesor', prof.uid)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * route:/admin/alumnos
 * Gestión de alumnos (admin)
 * visibility: admin-only
 */
function AdminAlumnosView({ alumnos }: { alumnos: Alumno[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      data-visibility="admin-only"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestión de Alumnos (Admin)</h2>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Agregar Alumno
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Nombre</th>
                <th className="px-6 py-4 text-left font-semibold">Edad</th>
                <th className="px-6 py-4 text-left font-semibold">Grupo</th>
                <th className="px-6 py-4 text-left font-semibold">Tutor</th>
                <th className="px-6 py-4 text-left font-semibold">Progreso</th>
                <th className="px-6 py-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alumnos.map((alumno) => (
                <tr key={alumno.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{alumno.nombre}</td>
                  <td className="px-6 py-4">{alumno.edad}</td>
                  <td className="px-6 py-4">{alumno.grupo}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {alumno.tutorNombre || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600">
                      {alumno.progreso}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * route:/admin/materias
 * Gestión de materias
 * visibility: admin-only
 */
function AdminMateriasView({ materias, onNavigate }: { materias: Materia[]; onNavigate: (route: PortalRoute) => void; }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      data-visibility="admin-only"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestión de Materias</h2>
        <button 
          onClick={() => onNavigate("admin/materias/nueva" as PortalRoute)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar Materia
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {materias.map((materia) => (
          <motion.div
            key={materia.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{materia.nombre}</h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    materia.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {materia.activo ? "Activa" : "Inactiva"}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * route:/admin/evaluaciones
 * Gestión de evaluaciones (admin)
 * visibility: admin-only
 * IDs: admin-eval-editar, admin-eval-eliminar
 */
function AdminEvaluacionesView({
  evaluaciones,
}: {
  evaluaciones: Evaluacion[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      data-visibility="admin-only"
    >
      <h2 className="text-3xl font-bold">Gestión de Evaluaciones (Admin)</h2>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por alumno, profesor o materia..."
            className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
          />
          <input
            type="date"
            className="p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-4">
          {evaluaciones.map((evaluacion) => (
            <div
              key={evaluacion.id}
              className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{evaluacion.alumnoNombre}</h4>
                  <p className="text-sm text-gray-600">
                    {evaluacion.materiaNombre} • {evaluacion.fecha}
                  </p>
                  {evaluacion.estado === "completada" && evaluacion.puntaje && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                      Puntaje: {evaluacion.puntaje}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    id={`admin-eval-editar-${evaluacion.id}`}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    id={`admin-eval-eliminar-${evaluacion.id}`}
                    className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * route:/admin/configuracion
 * Configuración del sistema
 * visibility: admin-only
 */
function AdminConfiguracionView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      data-visibility="admin-only"
    >
      <h2 className="text-3xl font-bold">Configuración del Sistema</h2>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6">Ajustes Generales</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Nombre del portal
            </label>
            <input
              type="text"
              defaultValue="Portal de Profesores - Autismax"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Leyenda de escala de evaluación
            </label>
            <div className="space-y-2">
              <input
                type="text"
                defaultValue="1 = Iniciado"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
              <input
                type="text"
                defaultValue="2 = En proceso"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
              <input
                type="text"
                defaultValue="3 = Alcanzado"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            Guardar Configuración
          </button>
        </div>
      </div>
    </motion.div>
  );
}
