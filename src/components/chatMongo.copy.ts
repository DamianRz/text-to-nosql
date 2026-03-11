import type { CopyDictionary, Language } from "./chatMongo.types";

export const copyByLanguage: Record<Language, CopyDictionary> = {
  es: {
    title: "Natural Language to MongoDB",
    subtitle: "Panel de consultas MongoDB con revision visible antes de ejecutar.",
    sidebarDemosTitle: "Ejemplos guiados",
    sidebarSettingsTitle: "Estado actual",
    instructionTitle: "1. Describe lo que quieres hacer",
    instructionHelper: "Escribe una peticion simple. Primero generamos la consulta y despues decides si quieres ejecutarla.",
    logsTitle: "Actividad reciente",
    historyEmpty: "Todavia no hay actividad. Carga un ejemplo o escribe una instruccion para empezar.",
    presentationHint: "Arrastra horizontalmente o usa los breadcrumbs para moverte entre secciones.",
    previewModeLabel: "Vista",
    previewHostedLabel: "Hosted",
    previewLocalLabel: "Local",
    projectSlideLabel: "Proyecto",
    demoSlideLabel: "Demo",
    workspaceSlideLabel: "Operacion",
    aboutTitle: "Que hace este sistema",
    aboutBody:
      "Recibe una orden en texto, arma la operacion MongoDB, muestra la query final y permite ejecutar solo cuando la revisas.",
    aboutItems: [
      "Pipeline de intencion: detecta accion, coleccion, filtros y rango temporal.",
      "Compatibilidad legacy: parseo absoluto/relativo de fechas y normalizacion temporal.",
      "Salida auditable: operacion estructurada + expresion equivalente en Mongo Shell.",
      "Ejecucion segura: nada se envia a MongoDB hasta que el usuario confirma."
    ],
    llmTitle: "Uso de LLM en enfoque controlado",
    llmBody:
      "El motor principal es deterministico. El LLM se usa solo para ambiguedades o lenguaje libre complejo, con tres modos de control.",
    llmItems: [
      "Modo off: solo reglas locales y parser temporal/condicional.",
      "Modo fallback: activa LLM cuando la confianza del parser es baja o no hay operacion valida.",
      "Modo force: obliga resolucion por LLM para demos y casos semanticos ambiguos.",
      "Todas las salidas LLM se validan y se transforman a esquema Mongo permitido."
    ],
    hostedTitle: "Preview hosteada",
    hostedBody:
      "Cuando esta web esta publicada, el objetivo principal es explicar para que sirve el proyecto y como llevarlo a tu maquina para trabajar con un LLM local y una base simulada orientada a demos.",
    localReadyTitle: "Entorno local",
    localReadyBody:
      "En local el proyecto expone el flujo completo: parseo, fallback LLM, base simulada en sesion y seleccion del modelo disponible en Ollama.",
    localOptionsTitle: "Opciones locales",
    localModelLabel: "Modelo local",
    localModelsLoading: "Buscando modelos locales...",
    localModelsEmpty: "No se encontraron modelos locales. Usa el script de setup o ejecuta ollama pull.",
    localModelsError: "No se pudieron leer los modelos locales desde Ollama.",
    hostedDemoNotice: "En vista hosted la demo se presenta como producto. Cambia a vista local para ejecutar sobre la base simulada.",
    hostedWorkspaceNotice:
      "Para probar todas las funciones, ejecuta el proyecto localmente y sigue las instrucciones del README.",
    localModeTag: "Modo local activo",
    hostedModeTag: "Modo hosted activo",
    localOnlyTitle: "Disponible al ejecutar localmente",
    localSimulationNotice:
      "La ejecucion en esta vista local usa una base de datos simulada guardada en la sesion del navegador. El foco del proyecto es probar el flujo con LLM sin depender de una instancia Mongo real.",
    localSimulationTag: "Base simulada en sesion",
    databaseViewerTitle: "Base local simulada",
    databaseViewerOutcomeTitle: "Asi quedan tus datos",
    databaseViewerDescription: "Explora las colecciones disponibles para la demo local.",
    databaseViewerOutcomeDescription: "Despues de ejecutar, esta vista muestra la coleccion afectada para que el cambio sea facil de revisar.",
    databaseCollectionsTitle: "Colecciones",
    databaseRecordsTitle: "Registros",
    databaseEmptyState: "No hay colecciones disponibles en la base simulada.",
    databaseEmptyCollection: "La coleccion seleccionada no tiene documentos.",
    diagramTitle: "Diagrama del flujo",
    diagramBody: "Desde la orden en chat hasta la respuesta final de MongoDB.",
    flowSteps: [
      {
        id: "input",
        icon: "input",
        title: "Entrada",
        detail: "Usuario escribe la instruccion."
      },
      {
        id: "intent",
        icon: "intent",
        title: "Intent Engine",
        detail: "Normaliza texto y detecta accion, coleccion, filtros y temporal."
      },
      {
        id: "llm",
        icon: "llm",
        title: "LLM opcional",
        detail: "Fallback para ambiguedad puntual si esta habilitado."
      },
      {
        id: "query",
        icon: "query",
        title: "Mongo Query",
        detail: "Genera operacion y vista Mongo Shell."
      },
      {
        id: "mongo",
        icon: "mongo",
        title: "Ejecucion DB",
        detail: "Se ejecuta solo con confirmacion del usuario."
      },
      {
        id: "result",
        icon: "result",
        title: "Resultado",
        detail: "La respuesta vuelve al chat y panel de salida."
      }
    ],
    languageLabel: "Idioma",
    languageSpanish: "Espanol",
    languageEnglish: "Ingles",
    demoTitle: "Demos guiadas",
    demoDescription:
      "Selecciona una demo, cargala en el editor o ejecutala para recorrer el flujo completo de interpretacion, query y resultado.",
    demoProcessTitle: "Proceso de esta demo",
    demoModeDeterministic: "Modo: deterministico",
    demoModeLlm: "Modo: LLM",
    resolverTitle: "Resolucion actual",
    resolverDeterministic: "Resolver deterministico",
    resolverLlm: "Resolver LLM",
    demoLoadButton: "Cargar en editor",
    demoRunButton: "Ejecutar demo",
    demoLoadedMessage: "Demo cargada en el editor.",
    chatTitle: "Flujo guiado",
    workspaceDescription: "Una sola ruta clara: escribir, revisar, ejecutar y comprobar el resultado.",
    selectedDemoTitle: "Ejemplo seleccionado",
    selectedDemoHelper: "Puedes cargarlo al editor o ejecutarlo completo para ver el flujo entero.",
    statusTitle: "Estado del flujo",
    statusReady: "Listo para revisar",
    statusWaiting: "Esperando instruccion",
    reviewHelper: "La consulta siempre se muestra antes de cualquier ejecucion.",
    reviewSummaryEmpty: "Cuando generes una consulta, aqui veras un resumen en lenguaje simple.",
    safeExecutionHint: "Esta accion no modifica datos. Puedes revisarla y ejecutarla cuando quieras.",
    destructiveExecutionHint: "Esta accion modifica datos. Revisa la coleccion y el filtro antes de confirmar.",
    initialMessage: "Escribe una instruccion. Ejemplo: mostrar en transactions donde category = comida",
    placeholder: 'ej: mostrar los usuarios activos o agrega en transactions { "category": "food", "amount": 120 }',
    generateButton: "Generar consulta",
    generatingButton: "Generando consulta...",
    executeButton: "Ejecutar consulta",
    executingButton: "Ejecutando consulta...",
    generatedQueryTitle: "2. Revisa la consulta generada",
    noGeneratedQuery: "Sin consulta generada todavia.",
    resultTitle: "3. Resultado",
    noResult: "Sin resultados todavia.",
    genericGenerationError: "No se pudo generar la consulta Mongo.",
    genericExecutionError: "Error al ejecutar en MongoDB.",
    queryReadyLabel: "Consulta lista para ejecutar:"
  },
  en: {
    title: "Natural Language to MongoDB",
    subtitle: "Minimal MongoDB workspace with a visible review step before execution.",
    sidebarDemosTitle: "Guided examples",
    sidebarSettingsTitle: "Current status",
    instructionTitle: "1. Describe what you want to do",
    instructionHelper: "Write a simple request. We generate the query first, then you decide whether to run it.",
    logsTitle: "Recent activity",
    historyEmpty: "No activity yet. Load an example or write an instruction to get started.",
    presentationHint: "Drag horizontally or use the breadcrumbs to move between sections.",
    previewModeLabel: "View",
    previewHostedLabel: "Hosted",
    previewLocalLabel: "Local",
    projectSlideLabel: "Project",
    demoSlideLabel: "Demo",
    workspaceSlideLabel: "Console",
    aboutTitle: "What this system does",
    aboutBody:
      "It accepts a text command, builds a MongoDB operation, displays the final query, and runs only after review.",
    aboutItems: [
      "Intent pipeline detects action, collection, filters, and temporal range.",
      "Legacy-compatible temporal parsing for absolute and relative date expressions.",
      "Auditable output: structured operation plus Mongo Shell equivalent.",
      "Safe execution: nothing is sent to MongoDB until explicit confirmation."
    ],
    llmTitle: "LLM usage with controlled scope",
    llmBody:
      "The core engine stays deterministic. LLM is used only for ambiguity or complex free-form language, with explicit control modes.",
    llmItems: [
      "Off mode: local rules and deterministic parser only.",
      "Fallback mode: calls LLM when confidence is low or no valid operation is detected.",
      "Force mode: always resolves via LLM for demo and semantic-heavy cases.",
      "Every LLM output is validated and constrained to allowed Mongo schema."
    ],
    hostedTitle: "Hosted preview",
    hostedBody:
      "When this website is deployed, its main job is to explain the project and show how to download it so users can run a local LLM with a simulated database focused on demos.",
    localReadyTitle: "Local environment",
    localReadyBody:
      "Locally, the project exposes the full path: parser, LLM fallback, session-based simulated database, and local model selection from Ollama.",
    localOptionsTitle: "Local options",
    localModelLabel: "Local model",
    localModelsLoading: "Loading local models...",
    localModelsEmpty: "No local models found. Run the setup script or execute ollama pull first.",
    localModelsError: "Could not read local models from Ollama.",
    hostedDemoNotice: "Hosted view presents the product. Switch to local view to execute against the simulated database.",
    hostedWorkspaceNotice: "To try every feature, run the project locally and follow the README instructions.",
    localModeTag: "Local mode active",
    hostedModeTag: "Hosted mode active",
    localOnlyTitle: "Available when running locally",
    localSimulationNotice:
      "Execution in this local view uses a simulated database stored in the browser session. The main focus is validating the LLM workflow without requiring a real Mongo instance.",
    localSimulationTag: "Session simulated DB",
    databaseViewerTitle: "Local simulated database",
    databaseViewerOutcomeTitle: "How your data looks after running",
    databaseViewerDescription: "Browse the demo collections available in the local experience.",
    databaseViewerOutcomeDescription: "After execution, this view focuses the affected collection so the change is easier to understand.",
    databaseCollectionsTitle: "Collections",
    databaseRecordsTitle: "Records",
    databaseEmptyState: "No collections are available in the simulated database.",
    databaseEmptyCollection: "The selected collection has no documents.",
    diagramTitle: "System flow diagram",
    diagramBody: "From chat instruction to final MongoDB output.",
    flowSteps: [
      {
        id: "input",
        icon: "input",
        title: "Input",
        detail: "User writes an instruction."
      },
      {
        id: "intent",
        icon: "intent",
        title: "Intent Engine",
        detail: "Normalizes text and detects action, collection, filters, and temporal range."
      },
      {
        id: "llm",
        icon: "llm",
        title: "Optional LLM",
        detail: "Fallback for specific ambiguity when enabled."
      },
      {
        id: "query",
        icon: "query",
        title: "Mongo Query",
        detail: "Builds operation and Mongo Shell output."
      },
      {
        id: "mongo",
        icon: "mongo",
        title: "DB Execution",
        detail: "Runs only after user confirmation."
      },
      {
        id: "result",
        icon: "result",
        title: "Result",
        detail: "Response is returned to chat and output panel."
      }
    ],
    languageLabel: "Language",
    languageSpanish: "Spanish",
    languageEnglish: "English",
    demoTitle: "Guided demos",
    demoDescription:
      "Pick a demo, load it into the editor, or run it to traverse the full interpretation, query, and execution pipeline.",
    demoProcessTitle: "Process for this demo",
    demoModeDeterministic: "Mode: deterministic",
    demoModeLlm: "Mode: LLM",
    resolverTitle: "Current resolver",
    resolverDeterministic: "Deterministic resolver",
    resolverLlm: "LLM resolver",
    demoLoadButton: "Load into editor",
    demoRunButton: "Run demo",
    demoLoadedMessage: "Demo loaded into editor.",
    chatTitle: "Guided workflow",
    workspaceDescription: "One clear path: write, review, execute, and verify the outcome.",
    selectedDemoTitle: "Selected example",
    selectedDemoHelper: "You can load it into the editor or run the full path to see the complete flow.",
    statusTitle: "Workflow status",
    statusReady: "Ready for review",
    statusWaiting: "Waiting for instruction",
    reviewHelper: "The generated query always stays visible before any execution.",
    reviewSummaryEmpty: "Once a query is generated, a plain-language summary appears here.",
    safeExecutionHint: "This action does not modify data. Review it and run it when ready.",
    destructiveExecutionHint: "This action changes data. Review the collection and filter before confirming.",
    initialMessage: 'Write an instruction. Example: show in transactions where category = "food"',
    placeholder: 'eg: show active users or insert in transactions { "category": "food", "amount": 120 }',
    generateButton: "Generate query",
    generatingButton: "Generating query...",
    executeButton: "Run query",
    executingButton: "Running query...",
    generatedQueryTitle: "2. Review the generated query",
    noGeneratedQuery: "No generated query yet.",
    resultTitle: "3. Result",
    noResult: "No results yet.",
    genericGenerationError: "Could not generate Mongo query.",
    genericExecutionError: "Error running operation on MongoDB.",
    queryReadyLabel: "Query ready to run:"
  }
};
