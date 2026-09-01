import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import DashboardCliente from '../modules/Cliente/DashboardCliente.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/cliente/dashboard',
      name: 'dashboard-cliente',
      component: DashboardCliente,
    },
    {
      path: '/cliente/perfil',
      name: 'perfil-cliente',
      component: () => import('../modules/Cliente/PerfilCliente.vue'),
    },
    {
      path: '/cliente/registro',
      name: 'registro-cliente',
      component: () => import('../modules/Cliente/ListaCliente.vue'),
    },
    {
      path: '/cliente/matricula',
      name: 'matricula-cliente',
      component: () => import('../modules/Cliente/GestionEstudiante.vue')

    },
    {
      path: '/cliente/boleta',
      name: 'boleta-cliente',
      component: () => import('../modules/Cliente/BoletaCliente.vue'),
    },
    {
      path: '/cliente/matriculas',
      name: 'matriculas-cliente',
      component: () => import('@/modules/Cliente/MatriculaEstudiante.vue'),
    },
    {
      path: '/cliente/asignaturas',
      name: 'asignaturas-cliente',
      component: () => import('../modules/Cliente/AsignaturasCliente.vue'),
    },
    {
      path: '/cliente/padres',
      name: 'registro-padres',
      component: () => import('../modules/Cliente/RegistroPadres.vue'),
    },
    {
      path: '/cliente/avisos',
      name: 'avisos-cliente',
      component: () => import('../modules/Cliente/AvisosCliente.vue'),
    },
    // Rutas Docente
    {
      path: '/docente/dashboard',
      name: 'dashboard-docente',
      component: () => import('../modules/Docente/DashboardDocente.vue'),
    },
    {
      path: '/docente/perfil',
      name: 'perfil-docente',
      component: () => import('../modules/Docente/PerfilDocente.vue'),
    },
    {
      path: '/docente/asignaturas',
      name: 'asignaturas-docente',
      component: () => import('../modules/Docente/AsignaturasDocente.vue'),
    },

    {
      path: '/docente/notas',
      name: 'notas-docente',
      component: () => import('../modules/Docente/NotasDocente.vue'),
    },
    {
      path: '/docente/estudiantes',
      name: 'estudiantes-docente',
      component: () => import('../modules/Docente/EstudiantesDocente.vue'),
    },
    {
      path: '/docente/avisos',
      name: 'avisos-docente',
      component: () => import('../modules/Docente/AvisosDocente.vue'),
    },
    {
      path: '/docente/conducta',
      name: 'conducta-docente',
      component: () => import('../modules/Docente/ConductaDocente.vue'),
    },
    {
      path: '/docente/reportes',
      name: 'reportes-docente',
      component: () => import('@/views/docente/ReportesView.vue'),
    },
    {
      path: '/docente/grados-secciones',
      name: 'grados-secciones-docente',
      component: () => import('../modules/Docente/GradosSeccionesDocente.vue'),
    },
    {
      path:'/Admin/dashboard',
      name:'dashboard-admin',
      component: () => import('../modules/Admin/Dashboard.vue'),
    },
{
      path:'/Admin/gestion-usuarios',
      name:'gestion-usuarios-admin',
      component: () => import('../modules/Admin/Tables/TablaUsuarios.vue'),
    },
    {
      path:'/Admin/estudiantes',
      name:'estudiantes-admin',
      component: () => import('@/views/admin/EstudianteView.vue'),
    },
    {
      path:'/Admin/matricula',
      name:'matricula-admin',
      component: () => import('@/views/admin/MatriculasView.vue'),
    },
    {
      path:'/Admin/profesores',
      name:'profesores-admin',
      component: () => import('../modules/Admin/Tables/TablaProfesor.vue'),
    },
    {
      path:'/Admin/asignaciones',
      name:'asignaciones-admin',
      component:()=> import('@/views/admin/AsignacionView.vue')
    },
    {
      path:'/Admin/reporte',
      name:'reporte-admin',
      component: () => import('@/views/admin/ReportesView.vue'),
    },
    {
      path:'/Admin/catalogos',
      name:'catalogos-admin',
      component: () => import('../modules/Admin/GestionAdmin.vue'),
    },

  ],
})

export default router
