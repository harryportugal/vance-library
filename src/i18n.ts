export type Language = 'pt' | 'en' | 'es';

export const translations = {
  pt: {
    // Sidebar nav
    home: 'Home',
    components: 'Componentes',
    newest: 'Mais Recentes',
    bestOfWeek: 'Melhores da Semana',
    favorites: 'Favoritos',
    categories: 'Categorias',
    search: 'Buscar',
    publish: '+ Publicar',
    hideSidebar: 'Ocultar Menu',
    showSidebar: 'Exibir Menu',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Escuro',

    // Header
    headerComponents: 'Componentes',

    // Category titles
    categoryTitleAll: 'Componentes',
    categoryTitleNewest: 'Mais Recentes',
    categoryTitleWeek: 'Melhores da Semana',
    categoryTitleFavorites: 'Favoritos',

    // Home hero
    heroHeadline1: 'Instale',
    heroHeadline2: 'efeitos visuais',
    heroHeadline3: 'usando',
    heroHeadline4: 'IA',
    heroDescription: (brand: any) => [
      'O ',
      brand,
      ' disponibiliza componentes interativos WebGL, GSAP e SVG com prompts otimizados. Copie o prompt, envie para seu agente (Claude, Cursor, Copilot) e ele fará o download, a extração e a integração do efeito no seu projeto.',
    ],
    heroCTA: 'Navegar Componentes',

    // Feature cards
    feature1Title: 'Copiar Prompts',
    feature1Desc: 'Não baixe ou extraia arquivos manualmente. O prompt do agente cuida de todo o processo de download e descompactação.',
    feature2Title: 'Stack Moderno',
    feature2Desc: 'Componentes focados em WebGL, Canvas, GSAP e SVG. Estilos puros, modulares e compatíveis com qualquer projeto.',
    feature3Title: 'Alta Performance',
    feature3Desc: 'Visualização em tempo real extremamente rápida, com reprodução em hover e baixo consumo de banda.',

    // Metrics footer
    activeComponents: 'Componentes Ativos',
    indexedFiles: 'Arquivos Indexados',

    // Component grid
    viewAll: 'Ver todos',
    loadMoreCategories: 'Carregar Mais Categorias',
    loadMoreComponents: 'Carregar Mais Componentes',
    showing: 'Exibindo',
    of: 'de',
    items: 'itens',
    loadingComponents: 'Carregando componentes...',

    // Empty states
    noFavoritesTitle: 'Nenhum favorito ainda',
    noFavoritesDesc: 'Clique no ícone de coração em qualquer card para salvá-lo aqui.',
    noComponentsTitle: 'Nenhum componente encontrado',
    noComponentsDesc: 'Ajuste os parâmetros de busca ou os filtros de categoria.',

    // Cards
    noPreview: 'Sem pré-visualização',
    addToFavorites: 'Adicionar aos Favoritos',
    removeFromFavorites: 'Remover dos Favoritos',
    favorited: 'Favoritado',
    favorite: 'Favoritar',

    // Modal
    agentPromptLabel: 'Prompt para o Agente',
    copied: 'Prompt Copiado!',
    copyPrompt: 'Copiar Prompt',
    noVideoPreview: 'Sem pré-visualização de vídeo',
    close: 'Fechar',

    // Agent prompt template
    agentPrompt: (title: string, zipUrl: string, category: string, fileListText: string) =>
      `Por favor, baixe o arquivo ZIP do componente de animação visual "${title}" a partir do link abaixo:\n${zipUrl}\n\nExtraia o conteúdo e implemente o efeito visual "${title}" (Categoria: ${category}) no meu projeto atual.\n\nA estrutura de arquivos contida no ZIP do componente é:\n${fileListText}\n\nInstruções adicionais para você (Agente de IA):\n1. Baixe o ZIP e extraia os arquivos de código.\n2. Analise os scripts, dependências e importações (como GSAP, Three.js, Canvas, etc.).\n3. Instale as dependências npm necessárias no meu projeto (se aplicável).\n4. Adapte, crie os arquivos necessários e integre o efeito ao meu projeto de forma limpa e modular.`,
  },

  en: {
    home: 'Home',
    components: 'Components',
    newest: 'Newest',
    bestOfWeek: 'Best of the Week',
    favorites: 'Favorites',
    categories: 'Categories',
    search: 'Search',
    publish: '+ Publish',
    hideSidebar: 'Hide Sidebar',
    showSidebar: 'Show Sidebar',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',

    headerComponents: 'Components',

    categoryTitleAll: 'Components',
    categoryTitleNewest: 'Newest',
    categoryTitleWeek: 'Best of the Week',
    categoryTitleFavorites: 'Favorites',

    heroHeadline1: 'Install',
    heroHeadline2: 'visual effects',
    heroHeadline3: 'using',
    heroHeadline4: 'AI',
    heroDescription: (brand: any) => [
      brand,
      ' provides interactive WebGL, GSAP, and SVG components with optimized prompts. Copy the prompt, send it to your agent (Claude, Cursor, Copilot) and it will download, extract, and integrate the effect into your project.',
    ],
    heroCTA: 'Browse Components',

    feature1Title: 'Copy Prompts',
    feature1Desc: 'No manual downloading or file extraction. The agent prompt handles the entire download and extraction process.',
    feature2Title: 'Modern Stack',
    feature2Desc: 'Components focused on WebGL, Canvas, GSAP, and SVG. Pure, modular styles compatible with any project.',
    feature3Title: 'Instant Performance',
    feature3Desc: 'Blazing-fast real-time preview with hover playback and low bandwidth usage.',

    activeComponents: 'Active Components',
    indexedFiles: 'Indexed Files',

    viewAll: 'View all',
    loadMoreCategories: 'Load More Categories',
    loadMoreComponents: 'Load More Components',
    showing: 'Showing',
    of: 'of',
    items: 'items',
    loadingComponents: 'Loading components...',

    noFavoritesTitle: 'No favorites yet',
    noFavoritesDesc: 'Click the heart icon on any component card to save it here.',
    noComponentsTitle: 'No components found',
    noComponentsDesc: 'Adjust your search parameters or category selectors.',

    noPreview: 'No preview',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    favorited: 'Favorited',
    favorite: 'Favorite',

    agentPromptLabel: 'Agent Prompt',
    copied: 'Prompt Copied!',
    copyPrompt: 'Copy Prompt',
    noVideoPreview: 'No video preview',
    close: 'Close',

    agentPrompt: (title: string, zipUrl: string, category: string, fileListText: string) =>
      `Please download the ZIP file of the visual animation component "${title}" from the link below:\n${zipUrl}\n\nExtract the contents and implement the visual effect "${title}" (Category: ${category}) in my current project.\n\nThe file structure inside the component ZIP is:\n${fileListText}\n\nAdditional instructions for you (AI Agent):\n1. Download the ZIP and extract the code files.\n2. Analyze the scripts, dependencies, and imports (like GSAP, Three.js, Canvas, etc.).\n3. Install any required npm dependencies in my project (if applicable).\n4. Adapt, create the necessary files and integrate the effect into my project cleanly and modularly.`,
  },

  es: {
    home: 'Inicio',
    components: 'Componentes',
    newest: 'Más Recientes',
    bestOfWeek: 'Mejores de la Semana',
    favorites: 'Favoritos',
    categories: 'Categorías',
    search: 'Buscar',
    publish: '+ Publicar',
    hideSidebar: 'Ocultar Menú',
    showSidebar: 'Mostrar Menú',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',

    headerComponents: 'Componentes',

    categoryTitleAll: 'Componentes',
    categoryTitleNewest: 'Más Recientes',
    categoryTitleWeek: 'Mejores de la Semana',
    categoryTitleFavorites: 'Favoritos',

    heroHeadline1: 'Instala',
    heroHeadline2: 'efectos visuales',
    heroHeadline3: 'usando',
    heroHeadline4: 'IA',
    heroDescription: (brand: any) => [
      brand,
      ' proporciona componentes interactivos de WebGL, GSAP y SVG con prompts optimizados. Copia el prompt, envíalo a tu agente (Claude, Cursor, Copilot) y él descargará, extraerá e integrará el efecto en tu proyecto.',
    ],
    heroCTA: 'Explorar Componentes',

    feature1Title: 'Copiar Prompts',
    feature1Desc: 'Sin descargas ni extracciones manuales. El prompt del agente se encarga de todo el proceso de descarga y descompresión.',
    feature2Title: 'Stack Moderno',
    feature2Desc: 'Componentes enfocados en WebGL, Canvas, GSAP y SVG. Estilos puros, modulares y compatibles con cualquier proyecto.',
    feature3Title: 'Alto Rendimiento',
    feature3Desc: 'Previsualización en tiempo real ultrarrápida, con reproducción al pasar el cursor y bajo consumo de ancho de banda.',

    activeComponents: 'Componentes Activos',
    indexedFiles: 'Archivos Indexados',

    viewAll: 'Ver todos',
    loadMoreCategories: 'Cargar Más Categorías',
    loadMoreComponents: 'Cargar Más Componentes',
    showing: 'Mostrando',
    of: 'de',
    items: 'elementos',
    loadingComponents: 'Cargando componentes...',

    noFavoritesTitle: 'Aún no hay favoritos',
    noFavoritesDesc: 'Haz clic en el ícono de corazón de cualquier tarjeta para guardarlo aquí.',
    noComponentsTitle: 'No se encontraron componentes',
    noComponentsDesc: 'Ajusta los parámetros de búsqueda o los filtros de categoría.',

    noPreview: 'Sin previsualización',
    addToFavorites: 'Agregar a Favoritos',
    removeFromFavorites: 'Quitar de Favoritos',
    favorited: 'Guardado',
    favorite: 'Guardar',

    agentPromptLabel: 'Prompt del Agente',
    copied: '¡Prompt Copiado!',
    copyPrompt: 'Copiar Prompt',
    noVideoPreview: 'Sin vista previa de video',
    close: 'Cerrar',

    agentPrompt: (title: string, zipUrl: string, category: string, fileListText: string) =>
      `Por favor, descarga el archivo ZIP del componente de animación visual "${title}" desde el enlace de abajo:\n${zipUrl}\n\nExtrae el contenido e implementa el efecto visual "${title}" (Categoría: ${category}) en mi proyecto actual.\n\nLa estructura de archivos del ZIP del componente es:\n${fileListText}\n\nInstrucciones adicionales para ti (Agente de IA):\n1. Descarga el ZIP y extrae los archivos de código.\n2. Analiza los scripts, dependencias e importaciones (como GSAP, Three.js, Canvas, etc.).\n3. Instala las dependencias npm necesarias en mi proyecto (si aplica).\n4. Adapta, crea los archivos necesarios e integra el efecto en mi proyecto de forma limpia y modular.`,
  },
} as const;

export type T = typeof translations.pt;
