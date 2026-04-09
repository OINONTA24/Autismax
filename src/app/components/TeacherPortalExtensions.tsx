import { motion } from "motion/react";
import { Plus, Edit, Trash2 } from "lucide-react";

/**
 * route:/admin/profesores/nuevo
 */
export function ProfesorFormView({ onNavigate }: { onNavigate: (route: any) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
      <button onClick={() => onNavigate("admin/profesores")} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 transition-colors">
        Volver a la lista
      </button>
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Nuevo Profesor</h2>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNavigate("admin/profesores"); }}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Nombre completo</label>
              <input type="text" required className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Email</label>
              <input type="email" required className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Contraseña temporal</label>
              <input type="password" required className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Rol</label>
              <select className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors">
                <option value="profesor">Profesor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Guardar
            </button>
            <button type="button" onClick={() => onNavigate("admin/profesores")} className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

/**
 * route:/admin/materias/nueva
 */
export function MateriaFormView({ onNavigate }: { onNavigate: (route: any) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
      <button onClick={() => onNavigate("admin/materias")} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 transition-colors">
        Volver a la lista
      </button>
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Nueva Materia</h2>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNavigate("admin/materias"); }}>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Nombre de la materia</label>
            <input type="text" required className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Descripción (opcional)</label>
            <textarea rows={3} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors resize-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="materia-activa" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
            <label htmlFor="materia-activa" className="text-gray-700 font-semibold">Materia activa</label>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Guardar
            </button>
            <button type="button" onClick={() => onNavigate("admin/materias")} className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
