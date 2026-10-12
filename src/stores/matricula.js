import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from '@/services/api'; // Importamos tu instancia de Axios configurada
import { matriculaService } from "@/services/matriculaService"; // Mantenemos este por si tienes otras lógicas separadas

export const useMatriculaStore = defineStore("matricula", () => {
  // --- ESTADOS DE CONTROL Y NAVEGACIÓN ---
  const cargando = ref(false);
  const erroresValidacion = ref(null);
  const estadoMatricula = ref("pendiente");
  const pestañaActiva = ref("dato");

  const tipoMatricula = ref("");
  const pasoAntiguo = ref("busqueda");
  const pasoNuevo = ref("busqueda");

  const estudianteSeleccionado = ref(null);

  // --- ESTADOS DE ESTUDIANTE ---
  const estudiante = ref({
    nombres: "",
    NIE: "",
  });
  const fotoEstudiante = ref(null);
  const fotoPreview = ref("");
  const certificadoEstudiante = ref(null);

  // --- ESTADOS DE ENCARGADO ---
  const encargado = ref({
    nombres: "",
    dui: "",
    telefono: "",
    parentescoId: "",
  });
  const encargadoSeleccionado = ref(null);
  const encargadoManual = ref(false);
  const encargadoConfirmado = ref(false);

  // --- ESTADOS DE SALUD ---
  const salud = ref({
    enfermedades: [],
    discapacidades: [],
    medicamentos: [],
  });

  // --- ESTADOS ACADÉMICOS ---
  const gradoSelected = ref("");
  const turnoSelected = ref("");
  const repiteGrado = ref("");

  // --- CATÁLOGOS (Conectados a Laravel) ---
  const parentescos = ref([
      { id: 'Padre', nombre: 'Padre' },
      { id: 'Madre', nombre: 'Madre' },
      { id: 'Tío(a)', nombre: 'Tío(a)' },
      { id: 'Otro', nombre: 'Otro' }
  ]);
  const grados = ref([]);
  const especialidades = ref([]); // Agregado para EspecialidadController
  const discapacidades = ref([]); // Agregado para DiscapacidadController
  
  // Estos los dejamos fijos temporalmente hasta que crees sus controladores en Laravel
  const turnos = ref([{ id: 'matutino', nombre: 'Matutino' }, { id: 'vespertino', nombre: 'Vespertino' }]);
  const enfermedades = ref([{ id: 1, nombre: 'Ninguna' }, { id: 2, nombre: 'Asma' }]);
  const medicamentos = ref([]);
  
  const estudiantesBuscados = ref([]);

  // --- COMPUTADOS ---
  const esNuevoIngreso = computed(() => tipoMatricula.value === "nuevo");
  const esAntiguoIngreso = computed(() => tipoMatricula.value === "antiguo");

  const encargadosDisponibles = computed(() => {
    if (!estudianteSeleccionado.value) return [];
    const lista = [];
    if (estudianteSeleccionado.value.padre) {
      lista.push({ ...estudianteSeleccionado.value.padre, rol: "Padre" });
    }
    if (estudianteSeleccionado.value.madre) {
      lista.push({ ...estudianteSeleccionado.value.madre, rol: "Madre" });
    }
    return lista;
  });

  // Modificado para usar el array real de especialidades
  const especialidadSelected = computed(() => {
    const gradoEncontrado = grados.value.find((g) => g.id === gradoSelected.value);
    if (!gradoEncontrado) return "";
    return gradoEncontrado.especialidad || gradoEncontrado.nivel || "";
  });

  const labelTipoMatricula = computed(() =>
    tipoMatricula.value === "antiguo" ? "Antiguo Ingreso" : "Nuevo Ingreso"
  );

  // --- PETICIONES MEDIANTE EL SERVICIO API ---

  // 1. Cargar catálogos desde los Controladores de Laravel
  const cargarCatalogos = async () => {
    try {
      cargando.value = true;
      // Consultamos múltiples endpoints en paralelo para mayor velocidad
      const [resGrados, resEspecialidades, resDiscapacidades] = await Promise.all([
        api.get('/grados'),
        api.get('/especialidades'),
        api.get('/discapacidades')
      ]);

      // Mapeamos los datos según la respuesta de Laravel
      grados.value = resGrados.data.grados || [];
      especialidades.value = resEspecialidades.data.especialidades || [];
      discapacidades.value = resDiscapacidades.data.discapacidades || [];
      
    } catch (error) {
      console.error("Error al obtener catálogos iniciales:", error);
    } finally {
      cargando.value = false;
    }
  };

  // 2. Buscar estudiante antiguo por NIE en MatriculaController
  const buscarEstudiante = async (termino) => {
    try {
      cargando.value = true;
      estudiantesBuscados.value = [];
      
      const response = await api.post('/matriculas/buscar-nie', { nie: termino });
      
      if (response.data.estudiante) {
        estudiantesBuscados.value = [response.data.estudiante];
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Si Laravel retorna 404, dejamos el arreglo vacío para mostrar "No encontrado"
        estudiantesBuscados.value = [];
      } else {
        console.error("Error al buscar estudiante:", error);
      }
    } finally {
      cargando.value = false;
    }
  };

  // 3. Procesar y enviar todo el formulario de matrícula
  const enviarMatriculaBackend = async () => {
    cargando.value = true;
    erroresValidacion.value = null;

    try {
      const formData = new FormData();

      formData.append("tipo_matricula", tipoMatricula.value);
      formData.append("grado_id", gradoSelected.value);
      formData.append("turno_id", turnoSelected.value);
      formData.append("repite_grado", repiteGrado.value);

      formData.append("estudiante_nombres", estudiante.value.nombres);
      formData.append("estudiante_nie", estudiante.value.NIE);
      
      if (estudianteSeleccionado.value) {
        formData.append("estudiante_id", estudianteSeleccionado.value.id);
      }

      if (fotoEstudiante.value) {
        formData.append("foto", fotoEstudiante.value);
      }
      if (certificadoEstudiante.value) {
        formData.append("certificado", certificadoEstudiante.value);
      }

      const datosEncargado = obtenerDatosEncargadoEnvio();
      formData.append("encargado_nuevo", datosEncargado.esNuevo);
      if (datosEncargado.esNuevo) {
        formData.append("encargado_nombres", datosEncargado.datos.nombres);
        formData.append("encargado_dui", datosEncargado.datos.dui);
        formData.append("encargado_telefono", datosEncargado.datos.telefono);
        formData.append("encargado_parentesco_id", datosEncargado.datos.parentescoId);
      } else {
        formData.append("encargado_id", datosEncargado.id);
      }

      formData.append("enfermedades", JSON.stringify(salud.value.enfermedades));
      formData.append("discapacidades", JSON.stringify(salud.value.discapacidades));
      formData.append("medicamentos", JSON.stringify(salud.value.medicamentos));

      const response = await matriculaService.enviarMatricula(formData);

      console.log("Matrícula guardada exitosamente:", response.data);
      return { exito: true, data: response.data };

    } catch (error) {
      if (error.response && error.response.status === 422) {
        erroresValidacion.value = error.response.data.errors;
      } else {
        console.error("Error al procesar la matrícula:", error);
      }
      return { exito: false, error };
    } finally {
      cargando.value = false;
    }
  };

  // --- ACCIONES LOCALES DE INTERFAZ ---
  const seleccionarTipoMatricula = (tipo) => {
    tipoMatricula.value = tipo;
    pestañaActiva.value = "dato";
    pasoAntiguo.value = "busqueda";
    pasoNuevo.value = "busqueda";
    
    // Al seleccionar el tipo, cargamos los catálogos automáticamente
    cargarCatalogos();
    
    if (tipo === "nuevo") {
      estudiante.value = { nombres: "", NIE: "" };
      fotoPreview.value = "";
      fotoEstudiante.value = null;
      certificadoEstudiante.value = null;
      encargado.value = { nombres: "", dui: "", telefono: "", parentescoId: "" };
      encargadoSeleccionado.value = null;
      encargadoManual.value = false;
      encargadoConfirmado.value = false;
      
      salud.value = { enfermedades: [], discapacidades: [], medicamentos: [] };
      
      gradoSelected.value = "";
      turnoSelected.value = "";
      repiteGrado.value = "";
    }
  };

  const seleccionarEstudiante = (estudianteObj) => {
    const clon = JSON.parse(JSON.stringify(estudianteObj));
    estudianteSeleccionado.value = clon;
    
    estudiante.value = {
      nombres: clon.nombres || "",
      NIE: clon.nie || "", // Cambiado a minúscula para coincidir con el backend
    };

    pasoAntiguo.value = "formulario";
  };

  const seleccionarFotoEstudiante = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    fotoEstudiante.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      fotoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const seleccionarCertificado = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    certificadoEstudiante.value = file;
  };

  const resetearTodo = () => {
    tipoMatricula.value = "";
    pasoAntiguo.value = "busqueda";
    pasoNuevo.value = "busqueda";
    estudianteSeleccionado.value = null;
    estudiantesBuscados.value = []; 
    estudiante.value = { nombres: "", NIE: "" };
    fotoEstudiante.value = null;
    fotoPreview.value = "";
    certificadoEstudiante.value = null;
    encargado.value = { nombres: "", dui: "", telefono: "", parentescoId: "" };
    encargadoSeleccionado.value = null;
    encargadoManual.value = false;
    encargadoConfirmado.value = false;
    
    salud.value = { enfermedades: [], discapacidades: [], medicamentos: [] };
    
    gradoSelected.value = "";
    turnoSelected.value = "";
    repiteGrado.value = "";
    pestañaActiva.value = "dato";
    erroresValidacion.value = null;
  };

  // --- ACCIONES DE ENCARGADO ---
  const seleccionarEncargado = (enc) => {
    encargadoSeleccionado.value = structuredClone(enc);
    encargado.value = {
      nombres: enc.nombre || "",
      dui: enc.dui || "",
      telefono: enc.telefono || "",
      parentescoId: enc.rol === "Padre" ? 2 : enc.rol === "Madre" ? 1 : "",
    };
    encargadoManual.value = false;
    encargadoConfirmado.value = false;
  };

  const agregarOtroEncargado = () => {
    encargadoSeleccionado.value = null;
    encargado.value = { nombres: "", dui: "", telefono: "", parentescoId: "" };
    encargadoManual.value = true;
    encargadoConfirmado.value = false;
  };

  const confirmarNuevoEncargado = () => {
    if (!encargado.value.nombres || !encargado.value.dui) {
      alert("Por favor, llena al menos el nombre completo y el DUI.");
      return;
    }
    encargadoConfirmado.value = true;
  };

  const resetFormularioEncargado = () => {
    encargadoConfirmado.value = false;
    encargado.value = { nombres: "", dui: "", telefono: "", parentescoId: "" };
  };

  const cancelarEncargadoManual = () => {
    encargadoManual.value = false;
    resetFormularioEncargado();
  };

  const obtenerDatosEncargadoEnvio = () => {
    if (encargadoManual.value) {
      return {
        esNuevo: true,
        datos: { ...encargado.value },
      };
    }
    return {
      esNuevo: false,
      id: encargadoSeleccionado.value ? encargadoSeleccionado.value.id : null,
    };
  };

  return {
    // Estados
    cargando,
    erroresValidacion,
    estadoMatricula,
    pestañaActiva,
    tipoMatricula,
    pasoAntiguo,
    pasoNuevo,
    estudianteSeleccionado,
    estudiante,
    fotoEstudiante,
    fotoPreview,
    certificadoEstudiante,
    encargado,
    encargadoSeleccionado,
    encargadoManual,
    encargadoConfirmado,
    salud,
    gradoSelected,
    turnoSelected,
    repiteGrado,
    parentescos,
    grados,
    especialidades,
    turnos,
    enfermedades,
    discapacidades,
    medicamentos,
    estudiantesBuscados,
    // Computados
    esNuevoIngreso,
    esAntiguoIngreso,
    encargadosDisponibles,
    especialidadSelected,
    labelTipoMatricula,
    // Métodos API
    cargarCatalogos,
    buscarEstudiante,
    enviarMatriculaBackend,
    // Métodos Locales
    seleccionarTipoMatricula,
    seleccionarEstudiante,
    seleccionarEncargado,
    agregarOtroEncargado,
    confirmarNuevoEncargado,
    resetFormularioEncargado,
    cancelarEncargadoManual,
    obtenerDatosEncargadoEnvio,
    resetearTodo,
    seleccionarFotoEstudiante,
    seleccionarCertificado,
  };
});