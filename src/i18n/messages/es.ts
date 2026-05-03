import { Copy } from "../types";

export const es: Copy = {
  languageLabel: "Idioma",
  languageOptions: {
    en: "English",
    zh: "中文",
    es: "Español",
    ja: "日本語"
  },
  heroBadge: "Asistente semanal para tu bebé",
  heroTitle: "Una app de crianza más tranquila para madres y padres primerizos.",
  heroCopy:
    "Convierte la logística del bebé en un solo flujo móvil con prioridades por edad, planificación semanal, preparación para salidas y coordinación entre cuidadores.",
  tabLabels: {
    today: "Hoy",
    planner: "Plan",
    outings: "Salidas",
    family: "Familia"
  },
  screenEyebrows: {
    today: "Foco diario",
    planner: "Ritmo semanal",
    outings: "Preparación para salir",
    family: "Coordinación"
  },
  updateButton: "Buscar actualizaciones",
  updateStatus: {
    idle: "Busca contenido más nuevo en compilaciones listas para producción.",
    checking: "Buscando actualizaciones...",
    downloading: "Actualización encontrada. Descargando...",
    applying: "Aplicando actualización...",
    unavailableDev: "Las actualizaciones internas no están disponibles en modo desarrollo.",
    unavailableConfig: "Esta compilación aún no está configurada para OTA.",
    upToDate: "Ya tienes la versión más reciente.",
    failed: "La comprobación falló. Inténtalo de nuevo."
  },
  appMode: {
    mockTitle: "Modo demo activo",
    mockBody: "La app usa un repositorio local mock con la misma estructura que el backend previsto. Aun así, puedes guardar datos clave en este dispositivo.",
    remoteTitle: "Modo backend activo",
    remoteBody: "La app está conectada a un backend configurado."
  },
  auth: {
    title: "Acceso a la cuenta",
    sendMagicLink: "Enviar magic link"
  },
  agent: {
    title: "Sugerencias del agente",
    refresh: "Volver a ejecutar",
    accept: "Aceptar",
    ignore: "Ignorar",
    notRelevant: "No aplica",
    showReason: "¿Por qué?",
    hideReason: "Ocultar motivo",
    reasonTitle: "Motivo",
    sourceTitle: "Señales",
    noRecommendations: "El agente necesita un poco más de contexto para producir buenas sugerencias.",
    memoryHint: "El agente aprende de lo que aceptas, ignoras o haces después.",
    plannerHint: "Estas notas del plan dependen de lo que el agente ha aprendido de tu rutina reciente.",
    outingHint: "Esta sugerencia usa el escenario actual y tus patrones recientes con éxito.",
    familyHint: "Las sugerencias familiares mejorarán a medida que el agente vea quién suele encargarse de cada tarea."
  },
  profile: {
    title: "Perfil del bebé",
    emptyTitle: "Empieza con un perfil",
    emptyBody: "Crea el perfil una vez y el resto de la app podrá derivar guía por etapa, planificación y sugerencias para salidas.",
    languageTitle: "Primero, elige tu idioma",
    languageHint: "Antes de elegir el país, confirma el idioma para que toda la experiencia use el texto correcto.",
    locationTitle: "Ahora confirma tu zona",
    locationHint: "Seguimos con un flujo guiado: país, región y calle antes del resto del perfil.",
    locationContinue: "Continuar al perfil",
    country: "País",
    region: "Región / distrito",
    street: "Calle / barrio",
    name: "Nombre del bebé",
    birthDate: "Fecha de nacimiento (AAAA-MM-DD)",
    feedingMode: "Tipo de alimentación",
    notes: "Notas",
    save: "Guardar perfil",
    edit: "Editar perfil",
    feedingModes: {
      breast: "Lactancia",
      formula: "Fórmula",
      mixed: "Mixta",
      solids: "Ya empezó sólidos"
    }
  },
  today: {
    title: "Lo importante ahora",
    empty: "Añade una cita o tarea familiar para generar una vista de Hoy más útil."
  },
  planner: {
    title: "Plan de esta semana",
    appointmentsTitle: "Citas",
    remindersTitle: "Recordatorios",
    nextActionTitle: "Siguiente mejor acción",
    appointmentFormTitle: "Añadir cita",
    reminderFormTitle: "Añadir recordatorio",
    appointmentFields: {
      title: "Título de la cita",
      startsAt: "Empieza a las (AAAA-MM-DDTHH:MM)",
      location: "Ubicación",
      notes: "Notas"
    },
    reminderFields: {
      title: "Título del recordatorio",
      dueAt: "Para cuándo (AAAA-MM-DDTHH:MM)"
    },
    saveAppointment: "Guardar cita",
    saveReminder: "Guardar recordatorio"
  },
  outings: {
    title: "Lista de salida contextual",
    helper: "Elige un escenario para generar una lista, marca lo preparado o añade artículos personalizados.",
    scenarioLabel: "Escenario",
    scenarios: {
      clinic: "Visita a la clínica",
      park: "Paseo por el parque",
      grocery: "Compra rápida",
      familyVisit: "Visita familiar"
    },
    addItem: "Añadir elemento",
    checklistPlaceholder: "Elemento personalizado"
  },
  family: {
    title: "Trabajo compartido",
    empty: "Aún no hay tareas compartidas. Añade una para coordinar mejor.",
    formTitle: "Añadir tarea familiar",
    assignee: "Responsable",
    task: "Tarea",
    dueAt: "Para cuándo (AAAA-MM-DDTHH:MM)",
    save: "Guardar tarea"
  },
  vaccinations: {
    title: "Centros de vacunación cercanos",
    eyebrow: "Cerca de tu calle",
    helper: "Centros sugeridos a poca distancia a pie o en transporte corto, ordenados por proximidad.",
    emptyAddress: "Añade tu calle en Perfil para ver centros de vacunación cercanos.",
    distanceLabel: "Distancia",
    hoursLabel: "Horario",
    sampleBadge: "Datos de muestra"
  },
  generic: {
    loading: "Cargando...",
    errorPrefix: "Algo salió mal",
    retry: "Reintentar",
    saveSucceeded: "Guardado.",
    saveFailed: "Error al guardar.",
    emailPlaceholder: "Correo para magic link",
    magicLinkUnavailable: "El magic link solo está disponible cuando el backend está configurado."
  }
};
