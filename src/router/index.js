import { createRouter, createWebHistory } from "vue-router";

// Layouts
import AdminLayout from "../layouts/AdminLayout.vue";
import ClienteLayout from "../layouts/ClienteLayout.vue";

// Vistas principales
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

// Cliente
import DashboardCliente from "../views/cliente/DashboardCliente.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // =========================================================
    // PÚBLICAS
    // =========================================================

    {
      path: "/",
      name: "home",
      component: HomeView,
    },

    {
      path: "/login",
      name: "login",
      component: Login,
    },

    {
      path: "/register",
      name: "register",
      component: Register,
    },

    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },

    // =========================================================
    // CLIENTE
    // =========================================================

    {
      path: "/cliente",
      component: ClienteLayout,
      children: [
        {
          path: "dashboard",
          name: "dashboard-cliente",
          component: DashboardCliente,
        },

        {
          path: "perfil",
          name: "perfil-cliente",
          component: () => import("../views/cliente/PerfilCliente.vue"),
        },

        {
          path: "registro",
          name: "registro-cliente",
          component: () => import("../views/cliente/ListaClienteView.vue"),
        },

        {
          path: "matricula",
          name: "matricula-cliente",
          component: () => import("../views/cliente/GestionEstudiante.vue"),
        },

        {
          path: "matriculas",
          name: "matriculas-cliente",
          component: () => import("../views/cliente/MatriculaView.vue"),
        },

        {
          path: "boleta",
          name: "boleta-cliente",
          component: () => import("../views/cliente/BoletaCliente.vue"),
        },

        {
          path: "asignaturas",
          name: "asignaturas-cliente",
          component: () => import("../views/cliente/AsignaturasCliente.vue"),
        },
      ],
    },

    // =========================================================
    // DOCENTE
    // =========================================================

    {
      path: "/docente",
      component: () => import("../layouts/DocenteLayout.vue"),
      children: [
        {
          path: "dashboard",
          name: "dashboard-docente",
          component: () => import("../modules/Docente/DashboardDocente.vue"),
        },

        {
          path: "perfil",
          name: "perfil-docente",
          component: () => import("../modules/Docente/PerfilDocente.vue"),
        },

        {
          path: "asignaturas",
          name: "asignaturas-docente",
          component: () => import("../modules/Docente/AsignaturasDocente.vue"),
        },

        {
          path: "notas",
          name: "notas-docente",
          component: () => import("../modules/Docente/NotasDocente.vue"),
        },

        {
          path: "estudiantes",
          name: "estudiantes-docente",
          component: () => import("../modules/Docente/EstudiantesDocente.vue"),
        },

        {
          path: "conducta",
          name: "conducta-docente",
          component: () => import("../modules/Docente/ConductaDocente.vue"),
        },

        {
          path: "reportes",
          name: "reportes-docente",
          component: () => import("../views/docente/ReportesView.vue"),
        },

        {
          path: "grados-secciones",
          name: "grados-secciones-docente",
          component: () => import("../modules/Docente/GradosSeccionesDocente.vue"),
        },
      ],
    },

    // =========================================================
    // ADMINISTRADOR
    // =========================================================

    {
      path: "/admin",
      component: AdminLayout,

      children: [
        {
          path: "dashboard",
          name: "dashboard-admin",
          component: () => import("../modules/Admin/Dashboard.vue"),
        },

        {
          path: "gestion-usuarios",
          name: "gestion-usuarios-admin",
          component: () => import("../modules/Admin/Tables/TablaUsuarios.vue"),
        },

        {
          path: "estudiantes",
          name: "estudiantes-admin",
          component: () => import("../views/admin/EstudianteView.vue"),
        },

        {
          path: "matricula",
          name: "matricula-admin",
          component: () => import("../views/admin/MatriculasView.vue"),
        },

        {
          path: "profesores",
          name: "profesores-admin",
          component: () => import("../views/admin/ProfesorView.vue"),
        },

        {
          path: "asignaciones",
          name: "asignaciones-admin",
          component: () => import("../views/admin/AsignacionView.vue"),
        },

        {
          path: "reporte",
          name: "reporte-admin",
          component: () => import("../views/admin/ReportesView.vue"),
        },
        {
          path: "constancia",
          name: "constancia-admin",
          component: () => import("../modules/Admin/Forms/constancias/egresadoPDF.vue"),
        },

        {
          path: "catalogos",
          name: "catalogos-admin",
          component: () => import("../modules/Admin/GestionAdmin.vue"),
        },
      ],
    },
  ],
});

export default router;
