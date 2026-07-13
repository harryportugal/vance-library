import { useState, useMemo, useEffect } from 'react';
import { 
  Paintbrush, 
  Smartphone, 
  Shield, 
  Wind, 
  Gauge, 
  Box, 
  FileCode, 
  Database, 
  Eye, 
  Braces, 
  Languages, 
  CreditCard,
  Copy, 
  Check, 
  Search,
  X
} from 'lucide-react';

type Language = 'pt' | 'en' | 'es';

interface PromptItem {
  id: string;
  category: 'design' | 'dev' | 'animation' | 'security' | 'performance' | 'webgl';
  tags: string[];
  title: Record<Language, string>;
  description: Record<Language, string>;
  content: Record<Language, string>;
}

const PROMPTS_DATA: PromptItem[] = [
  {
    id: 'figma-to-code',
    category: 'design',
    tags: ['UI/UX', 'Figma', 'HTML/CSS', 'Pixel-Perfect'],
    title: {
      pt: 'Figma para Código (Alta Fidelidade)',
      en: 'Figma to Code (Pixel-Perfect)',
      es: 'Figma a Código (Alta Fidelidad)'
    },
    description: {
      pt: 'Converte layouts ou prints do Figma em código semântico, limpo e extremamente fiel.',
      en: 'Translates Figma design references or screenshots into clean, semantic, and highly faithful code.',
      es: 'Traduce referencias de diseño de Figma o capturas de pantalla en código semántico, limpio y altamente fiel.'
    },
    content: {
      pt: `Atue como um Engenheiro Frontend Sênior e Especialista em UI/UX. Sua tarefa é implementar a página/componente mostrada na imagem anexada com fidelidade absoluta de pixel (pixel-perfect fidelity).

Diretrizes de Implementação Detalhadas:
1. ESTRUTURA E SEMÂNTICA HTML:
   - Use elementos HTML5 semânticos apropriados (header, nav, main, section, article, footer, etc.).
   - Garanta hierarquia de títulos adequada (apenas um H1 por página, seguindo ordenação até H6).
2. LAYOUT E ESPAÇAMENTOS (CSS/Tailwind):
   - Utilize sistemas modernos de layout (CSS Grid para estruturas principais bidimensionais, Flexbox para layouts unidimensionais).
   - Meça e aplique precisamente os espaçamentos (paddings, margins, gaps) e alinhamentos conforme a referência de design.
   - Configure variáveis CSS de cores (hex/rgb/hsl), fontes, tamanhos e cantos arredondados (border-radius) para manter a integridade visual.
3. TIPOGRAFIA E IMAGENS:
   - Identifique e carregue as fontes exatas (Google Fonts ou customizadas), aplicando pesos de fonte (font-weight), altura de linha (line-height) e espaçamento de letras (letter-spacing) precisos.
   - Otimize todos os elementos gráficos e ícones utilizando SVGs inline sempre que possível.
4. RESPONSIVIDADE E TRANSIÇÕES:
   - Garanta responsividade fluida para resoluções Mobile, Tablet, Laptops, Desktops e Ultrawide.
   - Adicione transições e animações de micro-interações suaves (hover, active, focus) nos elementos interativos.

Forneça o código completo da implementação de forma limpa, modular e pronta para produção.`,
      en: `Act as a Senior Frontend Engineer and UI/UX Specialist. Your task is to implement the page/component shown in the attached image with absolute pixel-perfect fidelity.

Detailed Implementation Guidelines:
1. HTML STRUCTURE & SEMANTICS:
   - Use appropriate semantic HTML5 elements (header, nav, main, section, article, footer, etc.).
   - Ensure proper heading hierarchy (only one H1 per page, ordered correctly down to H6).
2. LAYOUT & SPACING (CSS/Tailwind):
   - Utilize modern layout systems (CSS Grid for main 2D layouts, Flexbox for 1D alignments).
   - Measure and apply precise spacing (paddings, margins, gaps) and alignments matching the design reference.
   - Set up CSS variables for colors (hex/rgb/hsl), fonts, sizing tokens, and border radii to maintain visual consistency.
3. TYPOGRAPHY & ASSETS:
   - Identify and import exact font families (Google Fonts or custom), applying precise weights, line-heights, and letter-spacings.
   - Optimize all graphic assets and icons using inline SVGs wherever possible.
4. RESPONSIVENESS & MICRO-INTERACTIONS:
   - Ensure smooth fluid layouts adapting to Mobile, Tablet, Laptop, Desktop, and Ultrawide resolutions.
   - Add elegant transitions and micro-interaction animations (hover, active, focus) to all interactive elements.

Provide the complete code structure, clean, modular, and ready for production.`,
      es: `Actúa como un Ingeniero Frontend Senior y Especialista en UI/UX. Tu tarea es implementar la página/componente que se muestra en la imagen adjunta con fidelidad pixel-perfect absoluta.

Directrices de Implementación Detalhadas:
1. ESTRUCTURA Y SEMÁNTICA HTML:
   - Usa elementos HTML5 semánticos apropiados (header, nav, main, section, article, footer, etc.).
   - Garantiza una jerarquía de títulos adecuada (un solo H1 por página, ordenado hasta H6).
2. MAQUETACIÓN Y ESPACIADO (CSS/Tailwind):
   - Utiliza sistemas de diseño modernos (CSS Grid para estructuras bidimensionales, Flexbox para alineaciones unidimensionales).
   - Mide y aplica con precisión los espaciados (padding, margin, gap) y alineaciones del diseño de referencia.
   - Configura variables CSS de colores (hex/rgb/hsl), fuentes, tamaños y radios de borde para mantener la consistencia visual.
3. TIPOGRAFÍA E IMÁGENES:
   - Identifica y carga las familias tipográficas exactas (Google Fonts o personalizadas), aplicando pesos, alturas de línea y espaciados de letras precisos.
   - Optimiza todos los recursos gráficos e iconos utilizando SVGs en línea siempre que sea posible.
4. RESPONSIVIDAD Y TRANSICIONES:
   - Garantiza adaptabilidad fluida para resoluciones móviles, tabletas, ordenadores portátiles, de escritorio y pantallas ultraanchas.
   - Agrega transiciones elegantes y microinteracciones (hover, active, focus) a todos los elementos interactivos.

Proporciona el código de implementación completo, estructurado, limpio y listo para producción.`
    }
  },
  {
    id: 'responsiveness',
    category: 'performance',
    tags: ['CSS', 'Responsividade', 'Mobile-First', 'Media-Queries'],
    title: {
      pt: 'Responsividade Ultra-Adaptável',
      en: 'Ultra-Adaptive Responsiveness',
      es: 'Responsividad Ultra-Adaptable'
    },
    description: {
      pt: 'Adapta um site ou componente para funcionar perfeitamente em mobile, tablet, desktop e telas ultrawide.',
      en: 'Adapts a site or component to work flawlessly on mobile, tablet, desktop, and ultrawide screens.',
      es: 'Adapta un sitio o componente para funcionar perfectamente en dispositivos móviles, tabletas, ordenadores y pantallas ultraanchas.'
    },
    content: {
      pt: `Atue como um Especialista em Responsividade Frontend. Analise o código do componente/página fornecido e adapte-o para ser totalmente responsivo em todas as resoluções de tela.

Diretrizes de Ajuste:
1. DESIGN MOBILE-FIRST:
   - Reestruture as classes de layout para iniciar a partir de dispositivos móveis (telas pequenas) e escalar progressivamente para telas maiores.
   - Evite vazamento (overflow) horizontal em qualquer resolução.
   - Use breakpoints padrão (640px, 768px, 1024px, 1280px, 1536px).
2. ELEMENTOS DE INTERAÇÃO E TOQUE:
   - Otimize menus de navegação, tabelas de dados, formulários e botões para toque (target de clique de no mínimo 44x44px em telas pequenas).
   - Substitua tabelas densas por listas sanfonadas (accordions) ou cartões expansíveis em resoluções mobile.
3. IMAGENS E MÍDIAS FLUIDAS:
   - Certifique-se de que imagens e vídeos sejam fluidos (max-width: 100%, height: auto) e que usem srcsets ou carregamento preguiçoso (lazy loading).
4. UNIDADES RELATIVAS:
   - Priorize o uso de rem, em, %, vh, vw em vez de valores fixos em px para tamanhos de fonte, espaçamentos e contêineres.

Forneça os códigos de estilo (Tailwind ou CSS modular) revisados com explicações das alterações efetuadas.`,
      en: `Act as a Frontend Responsiveness Specialist. Analyze the provided component/page code and adapt it to be fully responsive across all screen resolutions.

Adjustment Guidelines:
1. MOBILE-FIRST PARADIGM:
   - Restructure layout classes starting from mobile devices (small screens) and scale up progressively.
   - Prevent horizontal overflow at any width.
   - Use standard breakpoints (640px, 768px, 1024px, 1280px, 1536px).
2. INTERACTION & TOUCH TARGETS:
   - Optimize navigation menus, data tables, forms, and buttons for touch (minimum tap target of 44x44px on small screens).
   - Swap dense tables for accordion lists or expandable cards in mobile layouts.
3. FLUID IMAGES & MEDIA:
   - Ensure images and video wrappers are fluid (max-width: 100%, height: auto) and leverage lazy loading and modern image ratios.
4. RELATIVE UNITS:
   - Prefer relative units (rem, em, %, vh, vw) over fixed pixel dimensions for spacing, typography, and container sizes.

Provide the refactored CSS/Tailwind rules with explanations highlighting the structural changes.`,
      es: `Actúa como un Especialista en Responsividad Frontend. Analiza el código del componente/página provisto y adáptalo para que sea completamente responsivo en todas las resoluciones de pantalla.

Directrices de Ajuste:
1. PARADIGMA MOBILE-FIRST:
   - Reestructura las clases de diseño comenzando desde dispositivos móviles (pantallas pequeñas) y escala progresivamente.
   - Evita el desbordamiento (overflow) horizontal en cualquier resolución.
   - Utiliza breakpoints estándar (640px, 768px, 1024px, 1280px, 1536px).
2. ELEMENTOS DE INTERACCIÓN Y TOQUE:
   - Optimiza menús de navegación, tablas de datos, formularios y botones para toques (objetivos de toque mínimos de 44x44px en pantallas pequeñas).
   - Sustituye tablas densas por listas acordión o tarjetas expandibles en layouts móviles.
3. IMÁGENES Y MEDIOS FLUIDOS:
   - Asegúrate de que las imágenes y vídeos sean fluidos (max-width: 100%, height: auto) y utilicen lazy loading.
4. UNIDADES RELATIVAS:
   - Prioriza el uso de rem, em, %, vh, vw en lugar de dimensiones de píxeles fijos para espaciados, tipografía y contenedores.

Proporciona el código CSS o Tailwind refactorizado junto con explicaciones de los cambios estructurales.`
    }
  },
  {
    id: 'saas-security',
    category: 'security',
    tags: ['Segurança', 'SaaS', 'API', 'OWASP'],
    title: {
      pt: 'Segurança & Blindagem SaaS',
      en: 'SaaS Security & Hardening',
      es: 'Seguridad y Blindaje para SaaS'
    },
    description: {
      pt: 'Implementa proteção contra SQLi, XSS, CSRF, configura cabeçalhos seguros e limitações de requisições.',
      en: 'Implements protection against SQLi, XSS, CSRF, configures secure headers and rate limiting.',
      es: 'Implementa protección contra SQLi, XSS, CSRF, configura cabeceras seguras y limitación de peticiones.'
    },
    content: {
      pt: `Atue como um Engenheiro de Segurança de Software Sênior. Analise o código backend/API fornecido e aplique práticas rigorosas de segurança SaaS para mitigar riscos e blindar a aplicação contra ataques.

Requisitos de Segurança:
1. VALIDAÇÃO E HIGIENIZAÇÃO (INPUT SANITIZATION):
   - Valide e higienize todas as entradas de dados (corpo da requisição, query strings, parâmetros de URL) contra SQL Injection (SQLi), NoSQL Injection e Cross-Site Scripting (XSS).
   - Use bibliotecas robustas de validação (ex: Zod, Joi, Validator.js).
2. PROTEÇÃO DE SESSÃO E AUTENTICAÇÃO:
   - Configure tokens de sessão/JWT em cookies HttpOnly, Secure e SameSite (Lax ou Strict) para evitar roubo de tokens via XSS ou falsificação via CSRF.
3. CABEÇALHOS DE SEGURANÇA (HTTP HEADERS):
   - Adicione middlewares (ex: Helmet no Express/Node) para configurar cabeçalhos de segurança essenciais: Content-Security-Policy (CSP), HSTS, X-Frame-Options, X-Content-Type-Options e Referrer-Policy.
4. LIMITAÇÃO DE REQUISIÇÕES (RATE LIMITING):
   - Implemente rate limiters por IP ou chave de API nas rotas sensíveis (login, registro, redefinição de senha, rotas pagas) para mitigar força bruta e ataques DDoS.
5. TRATAMENTO DE ERROS SEGURO:
   - Evite vazar logs internos, stack traces ou detalhes do banco de dados na resposta das APIs. Use tratamento genérico de erros internos no cliente.

Forneça os trechos de código backend com as correções aplicadas e justifique as melhorias introduzidas.`,
      en: `Act as a Senior Software Security Engineer. Analyze the provided backend/API code and implement strict SaaS security practices to mitigate risks and harden the application against threats.

Security Requirements:
1. INPUT VALIDATION & SANITIZATION:
   - Validate and sanitize all user inputs (request body, query parameters, URL segments) against SQL Injection (SQLi), NoSQL Injection, and Cross-Site Scripting (XSS).
   - Leverage schema validation engines (e.g., Zod, Joi, Validator.js).
2. SECURE SESSION & COOKIES:
   - Store session identifiers/JWT tokens in HttpOnly, Secure, and SameSite (Lax or Strict) cookies to prevent token leakage via XSS and CSRF-based requests.
3. HTTP SECURITY HEADERS:
   - Configure security headers using Helmet (or equivalent middleware) including Content-Security-Policy (CSP), HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.
4. RATE LIMITING & DDoS MITIGATION:
   - Set up API rate limiting keyed by IP or user identifier for sensitive routes (login, registration, payment portals, and authentication endpoints).
5. SECURE ERROR HANDLING:
   - Prevent internal server logs, database queries, and system stack traces from leaking to client responses.

Provide corrected backend modules and highlight the security fixes implemented.`,
      es: `Actúa como un Ingeniero de Seguridad de Software Senior. Analiza el código de backend/API proporcionado y aplica prácticas estrictas de seguridad SaaS para blindar la aplicación contra posibles amenazas.

Requisitos de Seguridad:
1. VALIDACIÓN Y SANITIZACIÓN DE ENTRADAS:
   - Valida y sanitiza todos los datos de entrada (cuerpo de petición, parámetros query y URL) contra inyección SQL (SQLi), NoSQL y Cross-Site Scripting (XSS).
   - Utiliza motores de validación estructurada (ej: Zod, Joi, Validator.js).
2. COOKIES DE SESIÓN SEGURAS:
   - Almacena identificadores de sesión o tokens JWT en cookies con atributos HttpOnly, Secure y SameSite (Lax o Strict) para evitar robo de sesiones y CSRF.
3. CABECERAS DE SEGURIDAD HTTP:
   - Configura middlewares de cabecera como Helmet para inyectar Content-Security-Policy (CSP), HSTS, X-Frame-Options y X-Content-Type-Options.
4. LIMITACIÓN DE VELOCIDAD (RATE LIMITING):
   - Implementa limitadores de tasa por IP en rutas sensibles (login, registro y pasarelas de pago) para mitigar fuerza bruta y ataques de denegación de servicio.
5. MANEJO DE ERRORES SEGURO:
   - Asegúrate de capturar excepciones de forma genérica para no exponer detalles de base de datos ni stack traces internos en el cliente.

Proporciona los módulos backend corregidos y explica las protecciones aplicadas.`
    }
  },
  {
    id: 'framer-gsap-animations',
    category: 'animation',
    tags: ['Animações', 'Framer Motion', 'GSAP', 'Física', '60fps'],
    title: {
      pt: 'Animações com Framer Motion e GSAP',
      en: 'Framer Motion & GSAP Animations',
      es: 'Animaciones con Framer Motion y GSAP'
    },
    description: {
      pt: 'Integra efeitos visuais fluidos, transições de páginas, e micro-interações de 60fps ativadas pelo scroll.',
      en: 'Integrates fluid visual effects, page transitions, and 60fps scroll-triggered micro-interactions.',
      es: 'Integra efectos visuales fluidos, transiciones de páginas y microinteracciones de 60fps activadas por desplazamiento.'
    },
    content: {
      pt: `Atue como um Desenvolvedor Creative Frontend especialista em animações e física de interface. Sua tarefa é integrar animações de alta performance e fluidas usando Framer Motion e GSAP.

Diretrizes de Desenvolvimento:
1. INSTALAÇÃO E CONFIGURAÇÃO:
   - Verifique e instale as bibliotecas corretas (\`framer-motion\`, \`gsap\`, \`@gsap/react\`).
2. PERFORMANCE E ACELERAÇÃO GPU:
   - Force aceleração por hardware animando apenas propriedades que não forçam repaints no navegador (como transform: translate3d/scale/rotate e opacity).
   - Garanta 60 FPS estáveis sem prejudicar as métricas de Cumulative Layout Shift (CLS) ou Interaction to Next Paint (INP).
3. GATILHOS E SCROLLTRIGGER:
   - Configure transições suaves ligadas ao scroll com GSAP ScrollTrigger, definindo pontos de início/fim (start/end) e suavidade (scrub) adequados.
   - Use hooks de React apropriados (useGSAP, useScroll) garantindo a destruição (cleanup) das instâncias para evitar vazamentos de memória (memory leaks).
4. CURVAS DE VELOCIDADE (EASING):
   - Evite easings lineares robóticos. Use curvas bezier premium (ex: power4.out, cubic-bezier) para reproduzir movimentos naturais com física realística.

Forneça os códigos de componentes React configurados, explicando a integração no ecossistema da aplicação.`,
      en: `Act as a Creative Frontend Developer specializing in interface physics and rich animation. Your task is to integrate high-performance animations using Framer Motion and GSAP.

Development Guidelines:
1. DEPENDENCIES & SETUP:
   - Use the correct library versions (\`framer-motion\`, \`gsap\`, \`@gsap/react\`).
2. GPU ACCELERATION & PERFORMANCE:
   - Offload animation to the GPU by animating composite-only CSS properties (transforms: translate3d/scale/rotate, and opacity).
   - Keep interactions locked at 60 FPS while keeping Core Web Vitals (CLS and INP) low.
3. SCROLL-DRIVEN TRIGGERS:
   - Bind smooth transitions to page scroll using GSAP ScrollTrigger, defining precise bounds (start/end) and interpolation (scrub).
   - Use React lifecycle hooks (useGSAP, useScroll) and properly dispose of animation instances on unmount to avoid memory leaks.
4. TIMING & CUSTOM EASING:
   - Avoid generic linear easing. Use advanced bezier curves (e.g., power4.out, custom cubic curves) to render organic interface movements.

Provide the completed React component markup and explain how to wire the animations into the application.`,
      es: `Actúa como un Desarrollador Frontend Creativo experto en animaciones e interacciones. Tu tarea es integrar animaciones de alto rendimiento y físicas fluidas utilizando Framer Motion y GSAP.

Directrices de Desarrollo:
1. PREPARACIÓN Y DEPENDENCIAS:
   - Instala las dependencias necesarias (\`framer-motion\`, \`gsap\`, \`@gsap/react\`).
2. RENDIMIENTO Y ACELERACIÓN DE GPU:
   - Dirige la carga al motor de composición del navegador animando propiedades que no causen repaints (transforms y opacity).
   - Garantiza interacciones a 60 FPS, cuidando que el Cumulative Layout Shift (CLS) no aumente.
3. GATILLOS ASOCIADOS AL SCROLL (ScrollTrigger):
   - Enlaza transiciones ricas al desplazamiento de la página usando GSAP ScrollTrigger con scrub configurado para una física fluida.
   - Utiliza hooks de ciclo de vida (useGSAP) garantizando la limpieza (cleanup) de timelines al desmontar el componente.
4. CURVAS DE TRANSICIÓN (Easing):
   - Evita transiciones lineales robóticas. Usa curvas de flexión orgánica (ej: power4.out, bezier personalizadas) para emular la gravedad real.

Proporciona el código de componentes en React completamente listos y las directrices para integrarlos.`
    }
  },
  {
    id: 'perf-optimization',
    category: 'performance',
    tags: ['Performance', 'Lighthouse', 'Vitals', 'GPU'],
    title: {
      pt: 'Otimização de Performance Extrema',
      en: 'Extreme Performance Optimization',
      es: 'Optimización de Rendimiento Extremo'
    },
    description: {
      pt: 'Reduz pacotes, otimiza imagens/fontes de forma preguiçosa e impulsiona métricas do Lighthouse.',
      en: 'Splits bundles, lazy-loads images/fonts, and boosts Lighthouse scoring.',
      es: 'Divide paquetes, carga imágenes/fuentes de forma diferida y mejora las puntuaciones de Lighthouse.'
    },
    content: {
      pt: `Atue como um Engenheiro de Performance Web Sênior. Analise o código do projeto fornecido e aplique otimizações profundas para obter notas de 95+ no Google Lighthouse e otimizar métricas críticas de renderização (LCP, FID/INP, CLS).

Áreas de Otimização:
1. IMAGENS E MÍDIAS INTELIGENTES:
   - Implemente carregamento preguiçoso (lazy loading) e decodificação assíncrona (decoding="async").
   - Converta mídias para formatos modernos (AVIF, WebP) com srcsets definidos e tamanhos (widths/heights) explícitos para eliminar Layout Shifts.
2. DIVISÃO DE CÓDIGO (CODE SPLITTING):
   - Divida pacotes pesados através de importações dinâmicas (React.lazy ou dynamic do Next.js).
   - Identifique e remova dependências redundantes (ex: importar lodash inteiro vs apenas as funções usadas).
3. OTIMIZAÇÃO DE FONTES E CSS:
   - Configure o carregamento de fontes personalizadas com font-display: swap e pré-carregue (preload) arquivos de fontes WOFF2 críticos.
   - Remova CSS não utilizado e utilize CSS inline crítico para acelerar a Primeira Pintura Útil (FCP).
4. CACHING E EXECUÇÃO DE SCRIPTS:
   - Mova scripts não essenciais para carregamento assíncrono (defer/async) ou execute-os em segundo plano utilizando web workers.

Forneça os ajustes de código e as configurações de build correspondentes (Webpack, Vite, Next.js).`,
      en: `Act as a Senior Web Performance Engineer. Analyze the provided project codebase and apply deep optimizations to reach 95+ scores on Google Lighthouse, specifically targeting LCP, INP, and CLS.

Focus Areas:
1. SMART MEDIA OPTIMIZATION:
   - Enforce lazy loading and asynchronous decoding (decoding="async").
   - Convert images to AVIF/WebP formats using responsive srcsets and explicit width/height dimensions to eliminate layout shifts.
2. DYNAMIC CODE SPLITTING:
   - Refactor heavy dependencies using code splitting patterns (React.lazy or dynamic imports in Next.js).
   - Bundle-check and eliminate duplicate or oversized packages (e.g., using lodash-es instead of the monolithic lodash).
3. FONT & CSS RENDER-BLOCKING ELIMINATION:
   - Adjust custom fonts to use font-display: swap and declare preload links for critical WOFF2 font files.
   - Clean unused CSS rules and inline critical paths to optimize First Contentful Paint (FCP).
4. SCRIPTS DEFERRING & EXECUTION:
   - Defer non-critical third-party scripts and offload computationally heavy JavaScript tasks to Web Workers.

Provide the refactored source code alongside build tool configurations (Vite, Webpack, or Next.js configurations).`,
      es: `Actúa como un Ingeniero de Rendimiento Web Senior. Analiza el código del proyecto y aplica optimizaciones profundas para alcanzar una puntuación de 95+ en Google Lighthouse y mejorar LCP, INP y CLS.

Áreas de Optimización:
1. OPTIMIZACIÓN INTELIGENTE DE MEDIOS:
   - Implementa carga diferida (lazy loading) y decodificación asíncrona (decoding="async").
   - Convierte recursos a formatos modernos (AVIF, WebP) con srcsets y dimensiones explícitas para eliminar variaciones de layout.
2. DIVISIÓN DE CÓDIGO (CODE SPLITTING):
   - Divide paquetes masivos utilizando técnicas de importación dinámica (React.lazy o dynamic).
   - Elimina dependencias redundantes y optimiza las importaciones parciales de librerías.
3. RUTA CRÍTICA DE CSS Y FUENTES:
   - Configura font-display: swap para las fuentes personalizadas y precarga (preload) archivos WOFF2 críticos.
   - Elimina CSS no utilizado y extrae el CSS de la ruta crítica para acelerar el First Contentful Paint (FCP).
4. APLAZAMIENTO DE SCRIPTS:
   - Aplaza scripts que no sean críticos (defer/async) y delega tareas pesadas fuera del hilo principal usando Web Workers.

Proporciona los fragmentos de código optimizados y los archivos de configuración de compilación (Vite, Webpack o Next.js).`
    }
  },
  {
    id: 'webgl-3d-scenes',
    category: 'webgl',
    tags: ['WebGL', 'Three.js', 'React Three Fiber', 'Shaders'],
    title: {
      pt: 'Cenas 3D & WebGL Premium',
      en: 'Premium 3D & WebGL Scenes',
      es: 'Escenas 3D y WebGL Premium'
    },
    description: {
      pt: 'Criação de cenas interativas, shaders customizados e sistemas de partículas de baixo consumo e alto impacto.',
      en: 'Creation of interactive scenes, custom shaders, and low-overhead, high-impact particle systems.',
      es: 'Creación de escenas interactivas, shaders personalizados y sistemas de partículas de bajo consumo y alto impacto.'
    },
    content: {
      pt: `Atue como um Desenvolvedor WebGL e Three.js Sênior. Forneça o código para um componente interativo 3D de alta performance utilizando Three.js puro ou React Three Fiber (R3F).

Diretrizes da Cena:
1. OTIMIZAÇÃO DE RENDERING E DRAW CALLS:
   - Agrupe geometrias semelhantes usando BufferGeometry e meshes instanciadas (InstancedMesh) para minimizar draw calls.
   - Implemente frustum culling de forma adequada.
2. SHADERS PERSONALIZADOS (VERTEX & FRAGMENT):
   - Escreva shaders GLSL customizados otimizados para efeitos dinâmicos (como distorção de ondas, gradientes interativos, campos de ruído ou partículas).
   - Passe dados dinâmicos da thread de CPU para GPU usando uniforms e attributes de forma otimizada.
3. CICLO DE VIDA E LIMPEZA DE MEMÓRIA:
   - Descarte (dispose) manualmente todas as geometrias, materiais, texturas e render targets quando o componente React for desmontado para evitar vazamentos de memória (GPU memory leaks).
4. CONTROLE DE FPS E TAXA DE ATUALIZAÇÃO:
   - Calcule deltas de tempo na função RequestAnimationFrame (ou useFrame do R3F) para manter a velocidade do movimento independente do refresh rate do monitor do usuário.

Forneça o código limpo, comentado em detalhes e pronto para rodar.`,
      en: `Act as a Senior WebGL and Three.js Developer. Provide code for an interactive 3D component (in React Three Fiber / Drei if it is a React project, or pure Three.js if it is Vanilla).

Guidelines:
1. SCENE SETUP & STRUCTURE:
   - Create a clean scene with realistic lighting (ambient, directional, point lights) and well-positioned camera.
   - Configure the renderer with antialiasing and responsive aspect ratio handling on window resizing.
2. MATERIALS & SHADERS:
   - Develop rich materials (MeshPhysicalMaterial, MeshStandardMaterial) or custom Shaders (Vertex and Fragment Shaders) for special effects such as water, distortions, portals, or particles.
3. INTERACTIVITY:
   - Add smooth mouse/touch controls (orbit controls or Raycaster manipulation to detect clicks/hovers on 3D objects).
4. PERFORMANCE & OPTIMIZATION:
   - Avoid memory leaks by cleaning up geometries, textures, and materials when the component is unmounted.
   - Optimize the render loop (requestAnimationFrame) limiting unnecessary updates.`,
      es: `Actúa como un Desarrollador WebGL y Three.js Senior. Proporciona el código para un componente 3D interactivo (en React Three Fiber / Drei si es un proyecto de React, o Three.js puro si es Vanilla).

Directrices:
1. CONFIGURACIÓN Y ESTRUCTURA DE LA ESCENA:
   - Crea una escena limpia con iluminación realista (luces ambientales, direccionales, puntuales) y una cámara bien posicionada.
   - Configura el renderizador con antialiasing y manejo de relación de aspecto receptivo al cambiar el tamaño de la ventana.
2. MATERIALES Y SHADERS:
   - Desarrolla materiales ricos (MeshPhysicalMaterial, MeshStandardMaterial) o Shaders personalizados (Vertex y Fragment Shaders) para efectos especiales como agua, distorsiones, portales o partículas.
3. INTERACTIVIDAD:
   - Agrega controles suaves de mouse/toque (orbit controls o manipulación de Raycaster para detectar clics/hovers en objetos 3D).
4. RENDIMIENTO Y OPTIMIZACIÓN:
   - Evita fugas de memoria limpiando geometrías, texturas y materiales cuando el componente se desmonte.
   - Optimiza el ciclo de renderizado (requestAnimationFrame) limitando actualizaciones innecesarias.`
    }
  },
  {
    id: 'clean-code',
    category: 'dev',
    tags: ['Refatoração', 'Clean Code', 'SOLID', 'DRY'],
    title: {
      pt: 'Refatoração & Clean Code',
      en: 'Refactoring & Clean Code',
      es: 'Refactorización y Clean Code'
    },
    description: {
      pt: 'Refatora trechos complexos, reduz acoplamento e melhora a legibilidade aplicando SOLID e DRY.',
      en: 'Refactors complex code, reduces coupling, and enhances readability applying SOLID and DRY.',
      es: 'Refactoriza código complejo, reduce el acoplamiento y mejora la legibilidad aplicando SOLID y DRY.'
    },
    content: {
      pt: `Atue como um Engenheiro de Software Sênior especialista em Clean Code e Refatoração de Sistemas. Analise o código fornecido e refatore-o para torná-lo mais legível, manutenível e performático.

Diretrizes de Refatoração:
1. PRINCÍPIOS SOLID E DRY:
   - Aplique o Princípio da Responsabilidade Única (SRP), separando lógicas complexas em funções ou componentes menores.
   - Elimine código duplicado (DRY) através de abstrações genéricas ou utilitários reutilizáveis.
2. LEGIBILIDADE E NOMENCLATURA:
   - Renomeie variáveis, funções e classes para nomes altamente descritivos e autoexplicativos.
   - Simplifique condicionais aninhadas (nested ifs) utilizando cláusulas de guarda (guard clauses) ou early returns.
3. EFICIÊNCIA:
   - Substitua loops ineficientes por iterações otimizadas (map, filter, reduce).
   - Otimize a complexidade de tempo e espaço onde aplicável.

Forneça a versão refatorada completa com explicações claras sobre o porquê de cada modificação.`,
      en: `Act as a Senior Software Engineer specializing in Clean Code and Refactoring. Analyze the provided code and refactor it to be more readable, maintainable, and performant.

Refactoring Guidelines:
1. SOLID & DRY PRINCIPLES:
   - Apply the Single Responsibility Principle (SRP) by extracting complex logic into smaller, focused functions or components.
   - Eliminate duplicated code (DRY) through generic helper functions or reusable utility modules.
2. READABILITY & NAMING:
   - Rename variables, functions, and classes to be highly descriptive and self-explanatory.
   - Simplify nested conditionals using guard clauses or early returns.
3. EFFICIENCY:
   - Replace inefficient loops with optimized array iteration methods (map, filter, reduce).
   - Optimize time and space complexity where relevant.

Provide the complete refactored code alongside clear explanations for each modification.`,
      es: `Actúa como un Ingeniero de Software Senior especialista en Clean Code y Refactorización. Analiza el código provisto y refactorízalo para que sea más legible, mantenible y eficiente.

Directrices de Refactorización:
1. PRINCIPIOS SOLID Y DRY:
   - Aplica el Principio de Responsabilidad Única (SRP), dividiendo la lógica compleja en funciones o componentes más pequeños.
   - Elimina la duplicación de código (DRY) a través de abstracciones genéricas o utilidades reutilizables.
2. LEGIBILIDAD Y NOMENCLATURA:
   - Renombra variables, funciones y clases con nombres altamente descriptivos y autoexplicativos.
   - Simplifica los condicionales anidados utilizando cláusulas de guarda (guard clauses) o retornos tempranos (early returns).
3. EFICIENCIA:
   - Reemplaza bucles ineficientes por iteraciones optimizadas (map, filter, reduce).
   - Optimiza la complejidad temporal y espacial cuando sea aplicable.

Proporciona la versión refactorizada completa con explicaciones claras sobre el porqué de cada modificación.`
    }
  },
  {
    id: 'db-optimization',
    category: 'dev',
    tags: ['Database', 'SQL', 'Prisma', 'Indexação'],
    title: {
      pt: 'Otimização de Query & DB',
      en: 'Query & DB Optimization',
      es: 'Optimización de Consultas y BD'
    },
    description: {
      pt: 'Refina consultas e relacionamentos complexos, reduzindo latência no banco de dados com SQL ou ORMs.',
      en: 'Refines complex queries and relations, reducing database latency via SQL or ORMs.',
      es: 'Refina consultas y relaciones complejas, reduciendo la latencia de la base de datos con SQL u ORM.'
    },
    content: {
      pt: `Atue como um Especialista em Banco de Dados e Engenheiro Backend. Analise as tabelas e consultas fornecidas e otimize-as para acelerar o tempo de resposta e diminuir o consumo de recursos.

Diretrizes:
1. OTIMIZAÇÃO DE CONSULTAS:
   - Elimine subconsultas desnecessárias ou junções (JOINs) redundantes.
   - Evite o problema clássico de N+1 consultas usando carregamento antecipado (eager loading) adequado no seu ORM (ex: Prisma, TypeORM, Sequelize).
2. INDEXAÇÃO INTELIGENTE:
   - Proponha índices adequados para colunas frequentemente filtradas (WHERE) ou ordenadas (ORDER BY).
3. ESTRUTURA E TRANSAÇÕES:
   - Sugira normalização ou desnormalização pontual dependendo do volume de leitura/escrita.
   - Certifique-se de que operações em lote usem transações para garantir consistência (ACID).

Forneça as queries SQL ou códigos do ORM otimizados com a explicação técnica do ganho de performance.`,
      en: `Act as a Database Specialist and Backend Engineer. Analyze the tables and queries provided and optimize them to reduce latency and resource utilization.

Guidelines:
1. QUERY OPTIMIZATION:
   - Eliminate unnecessary subqueries or redundant JOIN operations.
   - Prevent the classic N+1 query issue by using proper eager loading in your ORM (e.g., Prisma, TypeORM, Sequelize).
2. SMART INDEXING:
   - Propose appropriate indexes for frequently filtered (WHERE) or sorted (ORDER BY) columns.
3. SCHEMA & TRANSACTIONS:
   - Suggest normalization or strategic denormalization depending on read/write profiles.
   - Ensure bulk database modifications use transactions to enforce consistency (ACID).

Provide the optimized SQL queries or ORM code alongside a technical explanation of the performance improvements.`,
      es: `Actúa como un Especialista en Bases de Datos e Ingeniero Backend. Analiza las tablas y consultas proporcionadas y optimízalas para acelerar el tiempo de respuesta y reducir el consumo de recursos.

Directrices:
1. OPTIMIZACIÓN DE CONSULTAS:
   - Elimina subconsultas innecesarias o uniones (JOINs) redundantes.
   - Evita el clásico problema de las consultas N+1 utilizando una carga ansiosa (eager loading) adecuada en tu ORM (ej: Prisma, TypeORM, Sequelize).
2. INDEXACIÓN INTELIGENTE:
   - Propón índices adecuados para columnas que se filtran (WHERE) o se ordenan (ORDER BY) con frecuencia.
3. ESTRUCTURA Y TRANSACCIONES:
   - Sugiere normalización o desnormalización estratégica según el volumen de lectura/escritura.
   - Asegúrate de que las operaciones por lotes utilicen transacciones para garantizar la consistência (ACID).

Proporciona las consultas SQL o los códigos ORM optimizados con una explicación técnica del beneficio de rendimiento.`
    }
  },
  {
    id: 'accessibility',
    category: 'design',
    tags: ['Acessibilidade', 'WCAG', 'ARIA', 'A11y'],
    title: {
      pt: 'Acessibilidade Web (WCAG/ARIA)',
      en: 'Web Accessibility (WCAG/ARIA)',
      es: 'Accesibilidad Web (WCAG/ARIA)'
    },
    description: {
      pt: 'Ajusta componentes frontend para conformidade WCAG, garantindo suporte a leitores de tela e teclado.',
      en: 'Adapts frontend components for WCAG compliance, ensuring screen reader and keyboard support.',
      es: 'Ajusta los componentes frontend para cumplir con WCAG, garantizando el soporte para lectores de pantalla y teclado.'
    },
    content: {
      pt: `Atue como um Especialista em Acessibilidade Web (WCAG 2.2 e WAI-ARIA). Analise o componente frontend fornecido e reestruture-o para que seja perfeitamente acessível a todos os usuários.

Requisitos de Acessibilidade:
1. SEMÂNTICA HTML:
   - Garanta que todos os elementos interativos tenham tags semânticas adequadas (button para ações, a para navegação).
2. SUPORTE A LEITORES DE TELA (ARIA):
   - Adicione atributos ARIA apropriados (aria-label, aria-expanded, aria-live, aria-describedby) para descrever estados e elementos visuais abstratos.
   - Forneça textos alternativos claros para imagens e mídias visuais.
3. NAVEGAÇÃO POR TECLADO:
   - Certifique-se de que todos os controles possam ser focados (tabindex) e acionados usando apenas o teclado (Enter/Espaço/Setas).
   - Implemente armadilha de foco (focus trap) para componentes modais e menus suspensos.
4. CONTRASTE E VISUAL:
   - Certifique-se de que os estados de foco (focus-visible outline) sejam bem contrastados e visíveis.

Forneça o código frontend totalmente higienizado e em conformidade.`,
      en: `Act as a Web Accessibility Specialist (WCAG 2.2 & WAI-ARIA). Analyze the provided frontend component and restructure it to be fully accessible to all users.

Accessibility Requirements:
1. HTML SEMANTICS:
   - Ensure all interactive elements use correct semantic tags (e.g., button for actions, a for navigation links).
2. SCREEN READER SUPPORT (ARIA):
   - Add proper ARIA attributes (aria-label, aria-expanded, aria-live, aria-describedby) to describe states and abstract visual controls.
   - Provide descriptive alternative text for all images and visual media.
3. KEYBOARD NAVIGATION:
   - Ensure all interactive controls can receive focus (tabindex) and be triggered using only the keyboard (Enter, Space, or arrow keys).
   - Implement focus trapping for modal dialogs and overlay menus.
4. CONTRAST & FOCUS INDICATORS:
   - Ensure keyboard focus indicators (focus-visible outlines) are distinct and high-contrast.

Provide the fully sanitized and compliant frontend markup and styles.`,
      es: `Actúa como un Especialista en Accesibilidad Web (WCAG 2.2 y WAI-ARIA). Analiza el componente frontend provisto y reestructúralo para que sea perfectamente accesible para todos los usuarios.

Requisitos de Accesibilidad:
1. SEMÁNTICA HTML:
   - Garantiza que todos los elementos interactivos tengan etiquetas semánticas adecuadas (button para acciones, a para navegación).
2. SOPORTE PARA LECTORES DE PANTALLA (ARIA):
   - Agrega atributos ARIA apropiados (aria-label, aria-expanded, aria-live, aria-describedby) para describir estados y elementos visuales abstractos.
   - Proporciona textos alternativos claros para imágenes y medios visuales.
3. NAVEGACIÓN POR TECLADO:
   - Asegúrate de que todos los controles puedan recibir foco (tabindex) y activarse utilizando únicamente el teclado (Enter/Espacio/Flechas).
   - Implementa trampa de foco (focus trap) para componentes modales y menús desplegables.
4. CONTRASTE E INDICADORES VISUALES:
   - Asegúrate de que los estados de foco (focus-visible outline) tengan suficiente contraste y sean claramente visibles.

Proporciona el código frontend completamente higienizado y conforme.`
    }
  },
  {
    id: 'api-mock',
    category: 'dev',
    tags: ['API', 'JSON', 'Mocking', 'Backend'],
    title: {
      pt: 'Gerador de Mocks de API',
      en: 'API Mock Generator',
      es: 'Generador de Mocks de API'
    },
    description: {
      pt: 'Cria estruturas JSON complexas, realistas e documentadas para simular chamadas de API no frontend.',
      en: 'Creates complex, realistic, and documented JSON structures to mock API calls in the frontend.',
      es: 'Crea estructuras JSON complejas, realistas y documentadas para simular llamadas de API en el frontend.'
    },
    content: {
      pt: `Atue como um Engenheiro Backend. Gere dados fictícios de alta fidelidade em formato JSON estruturado para simular respostas reais de nossa API REST ou GraphQL.

Diretrizes:
1. REALISMO DE DADOS:
   - Use nomes, datas, endereços e valores numéricos realistas e variados.
   - Simule relacionamentos de dados complexos (ex: autor com múltiplos posts, cada um com comentários e tags).
2. PAGINAÇÃO E META-DADOS:
   - Inclua estruturas de metadados padrão nas respostas (ex: total_items, page, per_page, total_pages, links).
3. CASOS DE ERRO:
   - Além do caso de sucesso (200 OK), monte estruturas de mock para erros comuns (ex: 400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity) seguindo o padrão RFC 7807 (Problem Details).

Forneça as estruturas JSON prontas e, se aplicável, o script de simulação em Node/Express ou JSON-Server.`,
      en: `Act as a Backend Engineer. Generate high-fidelity mockup data in structured JSON format to simulate real responses from our REST or GraphQL API.

Guidelines:
1. DATA REALISM:
   - Use names, dates, addresses, and numerical values that are realistic and varied.
   - Simulate complex data relationships (e.g., an author with multiple posts, each containing comments and tags).
2. PAGINATION & METADATA:
   - Include standard metadata structures in the response envelope (e.g., total_items, page, per_page, total_pages, navigation links).
3. ERROR SCENARIOS:
   - In addition to success states (200 OK), construct mock envelopes for common errors (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity) adhering to the RFC 7807 (Problem Details) specification.

Provide the ready-to-use JSON structures and, if relevant, mock server scripts (Node/Express or JSON-Server).`,
      es: `Actúa como un Ingeniero Backend. Genera datos ficticios de alta fidelidad en formato JSON estructurado para simular respuestas reales de nuestra API REST o GraphQL.

Directrices:
1. REALISMO DE DATOS:
   - Utiliza nombres, fechas, direcciones y valores numéricos realistas y variados.
   - Simula relaciones de datos complejas (ej: autor con múltiples publicaciones, cada una con comentarios y etiquetas).
2. PAGINACIÓN Y METADATOS:
   - Incluye estructuras de metadatos estándar en las respuestas (ej: total_items, page, per_page, total_pages, enlaces).
3. CASOS DE ERROR:
   - Además del caso de éxito (200 OK), diseña estructuras de mock para errores comunes (ej: 400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity) siguiendo el estándar RFC 7807 (Problem Details).

Proporciona las estructuras JSON listas y, si aplica, el script de simulación en Node/Express o JSON-Server.`
    }
  },
  {
    id: 'i18n-structure',
    category: 'dev',
    tags: ['i18n', 'Tradução', 'Frontend', 'Modular'],
    title: {
      pt: 'Estruturação i18n',
      en: 'i18n Structuring',
      es: 'Estructuración i18n'
    },
    description: {
      pt: 'Extrai textos literais para arquivos de tradução estruturados e modulares em aplicações frontend.',
      en: 'Extracts literal strings into structured and modular translation dictionary structures for frontend apps.',
      es: 'Extrae textos literales en archivos de traducción estructurados y modulares en aplicaciones frontend.'
    },
    content: {
      pt: `Atue como um Arquiteto Frontend especialista em internacionalização (i18n). Analise o componente ou página fornecida, extraia todas as strings fixas e monte a estrutura de tradução modular.

Requisitos de Internacionalização:
1. ESTRUTURA DO DICIONÁRIO:
   - Organize as chaves por escopo ou componente (ex: header.title, buttons.submit, errors.timeout).
   - Crie dicionários consistentes para múltiplos idiomas (ex: pt, en, es).
2. ABSTRAÇÃO DO CÓDIGO:
   - Substitua o texto estático no código por funções do hook de tradução (ex: t('chave.filho') do react-i18next).
3. DINÂMICA E PARÂMETROS:
   - Trate strings com valores dinâmicos ou interpolações usando variáveis de substituição de forma segura.
   - Implemente suporte para plurais e gênero se necessário.

Forneça os dicionários JSON resultantes e o código do componente adaptado.`,
      en: `Act as a Frontend Architect specializing in internationalization (i18n). Analyze the provided component or page, extract all hardcoded strings, and design a modular translation structure.

Requirements:
1. DICTIONARY STRUCTURE:
   - Organize translation keys logically by scope or component namespaces (e.g., header.title, buttons.submit, errors.timeout).
   - Create identical, matching translation tables for multiple languages (e.g., pt, en, es).
2. CODE REFACTORING:
   - Replace literal strings in the code with translation hook calls (e.g., t('key.child') from react-i18next).
3. PLURALIZATION & INTERPOLATION:
   - Handle dynamic string values safely using interpolation parameters.
   - Implement pluralization and gender variants where appropriate.

Provide the JSON dictionaries and the rewritten component code.`,
      es: `Actúa como un Arquitecto Frontend especialista en internacionalización (i18n). Analiza el componente o página provisto, extrae todas las cadenas de texto fijas y diseña la estructura de traducción modular.

Requisitos de Internacionalización:
1. ESTRUTURA DEL DICCIONARIO:
   - Organiza las claves por ámbito o espacios de nombres del componente (ej: header.title, buttons.submit, errors.timeout).
   - Crea diccionarios idénticos y consistentes para múltiples idiomas (ej: pt, en, es).
2. ABSTRACCIÓN DEL CÓDIGO:
   - Reemplaza el texto estático en el código por llamadas a funciones del hook de traducción (ej: t('clave.hijo') de react-i18next).
3. DINÁMICA E INTERPOLACIÓN:
   - Maneja cadenas de texto con valores dinámicos o interpolaciones utilizando parámetros de forma segura.
   - Implementa soporte para plurales y variantes de género si es necesario.

Proporciona los diccionarios JSON resultantes y el código del componente adaptado.`
    }
  },
  {
    id: 'payment-integration',
    category: 'security',
    tags: ['Financeiro', 'Asaas', 'Stripe', 'Webhooks'],
    title: {
      pt: 'Integração Asaas & Stripe',
      en: 'Asaas & Stripe Integration',
      es: 'Integración Asaas y Stripe'
    },
    description: {
      pt: 'Estrutura fluxos de cobrança, tratamento de webhooks e transações financeiras recorrentes de forma segura.',
      en: 'Structures billing flows, webhook handling, and secure recurring financial transactions.',
      es: 'Estructura flujos de cobro, manejo de webhooks y transacciones financieras recurrentes de forma segura.'
    },
    content: {
      pt: `Atue como um Desenvolvedor Backend Sênior especialista em integrações financeiras (Asaas / Stripe). Sua tarefa é implementar de forma segura o fluxo de pagamentos, assinaturas e recepção de webhooks.

Diretrizes de Implementação:
1. FLUXO DE PAGAMENTO:
   - Estruture a criação de clientes, emissão de cobranças (cartão de crédito, pix, boleto) e assinaturas recorrentes via chamadas de API seguras.
2. VALIDAÇÃO DE WEBHOOKS:
   - Valide rigorosamente a assinatura digital dos webhooks recebidos da plataforma de pagamento para garantir a autenticidade da origem.
3. IDEMPOTÊNCIA E RETENTATIVAS:
   - Trate o processamento de eventos do webhook de forma idempotente para evitar duplicações em caso de envios duplicados.
   - Implemente filas de mensageria ou logs estruturados para lidar com falhas de processamento temporárias.

Forneça os handlers backend das rotas e webhooks com tratamento completo de segurança e erros.`,
      en: `Act as a Senior Backend Developer specializing in payment integrations (Asaas / Stripe). Your task is to securely implement billing flows, subscription endpoints, and webhook handlers.

Guidelines:
1. CHECKOUT & SUBSCRIPTION FLOWS:
   - Structure customer creation, charge generation (credit card, pix, boleto), and recurring billing via secure API requests.
   - Safely store customer and token identifiers without storing raw payment data.
2. WEBHOOK SIGNATURE VERIFICATION:
   - Strictly validate digital signatures of webhooks sent by the payment provider to ensure authenticity.
3. IDEMPOTENCY & FAULT TOLERANCE:
   - Implement idempotent event processing to prevent duplicate operations (e.g., double crediting account).
   - Use retry mechanisms or job queues for temporary webhook handling failures.

Provide the backend routes and webhook event handlers with comprehensive safety mechanisms.`,
      es: `Actúa como un Desarrollador Backend Senior especialista en integraciones financieras (Asaas / Stripe). Tu tarea es implementar de forma segura el flujo de pagos, suscripciones y recepción de webhooks.

Directrices de Implementación:
1. FLUJO DE PAGO:
   - Estructura la creación de clientes, emisión de cobros (tarjeta de crédito, pix, boleto) y suscripciones recurrentes a través de llamadas de API seguras.
2. VALIDACIÓN DE WEBHOOKS:
   - Valida rigurosamente la firma digital de los webhooks recibidos de la plataforma de pago para garantizar la autenticidad del origen.
3. IDEMPOTENCIA Y RETENTATIVAS:
   - Maneja el procesamiento de eventos del webhook de forma idempotente para evitar duplicaciones en caso de envíos duplicados.
   - Implementa colas de mensajería o registros estructurados para manejar fallas temporales de procesamiento.

Proporciona los handlers backend de las rotas y webhooks con un tratamiento completo de seguridad y errores.`
    }
  },
  {
    id: 'webgl-blur-grain',
    category: 'webgl',
    tags: ['WebGL', 'Shaders', 'Post-Processing', 'Grain'],
    title: {
      pt: 'WebGL Progressive Blur & Grain',
      en: 'WebGL Progressive Blur & Grain',
      es: 'WebGL Progressive Blur y Grain'
    },
    description: {
      pt: 'Implementa filtros de desfoque progressivo e efeito de granulado de ruído (noise grain) em WebGL.',
      en: 'Implements progressive blur filters and noise grain effects on WebGL canvas.',
      es: 'Implementa filtros de desenfoque progresivo y efectos de granulado de ruido en WebGL.'
    },
    content: {
      pt: `Atue como um Desenvolvedor de Shaders WebGL Sênior. Sua tarefa é criar um efeito premium de desfoque progressivo (progressive blur) acoplado a um filtro de ruído analógico (noise grain) usando fragment shaders GLSL.

Diretrizes de Shaders:
1. PROGRESSIVE MIPMAP BLUR:
   - Implemente um efeito de blur progressivo de alta fidelidade (como bokeh ou gaussian acumulativo) que responda à posição do cursor do usuário ou à rolagem da página.
2. FILTRO DE RUÍDO (GRAIN NOISE):
   - Adicione uma camada de ruído dinâmico (film grain) no fragment shader gerando valores pseudo-aleatórios com base nas coordenadas de textura (UVs) e uma variável de tempo (uniform float uTime) para simular grãos em movimento.
3. COMPOSIÇÃO E MISTURA (BLENDING):
   - Combine o desfoque com a imagem original ou com o fundo, garantindo que o efeito seja performático e não derrube o frame rate.

Forneça os códigos GLSL dos shaders (Vertex e Fragment) e o script de inicialização do canvas WebGL.`,
      en: `Act as a Senior WebGL Shader Developer. Your task is to implement a high-fidelity progressive blur combined with a dynamic analog noise grain filter using GLSL fragment shaders.

Shader Guidelines:
1. PROGRESSIVE BLUR SYSTEM:
   - Build a progressive blur effect (such as an accumulative Gaussian or bokeh blur pass) that scales interactively based on cursor position or page scroll offsets.
2. FILM GRAIN NOISE PASS:
   - Inject a dynamic film grain overlay inside the fragment shader, generating pseudo-random noise derived from texture coordinate UVs and a uniform time variable (uniform float uTime).
3. PERFORMANCE & COMPOSITING:
   - Blend the blur and grain outputs over the background texture, keeping pipeline overhead low and maintaining 60fps.

Provide the completed GLSL Vertex/Fragment shaders and the WebGL canvas wrapper script.`,
      es: `Actúa como un Desarrollador de Shaders WebGL Senior. Tu tarea es implementar un efecto de desenfoque progresivo premium acoplado a un filtro de grano analógico dinámico usando fragment shaders en GLSL.

Directrices de Shaders:
1. DESENFOQUE PROGRESIVO:
   - Implementa un pase de desenfoque progresivo de alta calidad que escale de forma interactiva con el movimiento del ratón o el scroll.
2. CAPA DE GRANO DE PELÍCULA (FILM GRAIN):
   - Genera ruido dinámico pseudoaleatorio en el shader basado en coordenadas UV y un parámetro de tiempo (uTime).
3. RENDIMIENTO DE COMPOSICIÓN:
   - Mezcla los pases de desenfoque y grano sin sobrecargar la GPU.

Proporciona los fragmentos GLSL de shaders y el código JavaScript/TypeScript de inicialización de WebGL.`
    }
  },
  {
    id: 'svg-text-path-scroll',
    category: 'animation',
    tags: ['SVG', 'GSAP', 'ScrollTrigger', 'Tipografia'],
    title: {
      pt: 'Tipografia SVG em Caminho Dinâmico',
      en: 'Dynamic SVG Text Path Animation',
      es: 'Animación de Tipografía SVG en Caminos'
    },
    description: {
      pt: 'Anima textos seguindo caminhos SVG curvos acionados pelo movimento do scroll da página.',
      en: 'Animates text elements along curved SVG paths triggered by page scroll offsets.',
      es: 'Anima textos a lo largo de caminos curvos en SVG impulsados por el desplazamiento de la página.'
    },
    content: {
      pt: `Atue como um Desenvolvedor Creative Frontend. Crie um componente de tipografia expressiva que deforma e desloca textos ao longo de caminhos curvos (<textPath> dentro de elementos <svg>), controlados pelo scroll com GSAP ScrollTrigger.

Diretrizes Visuais:
1. CONFIGURAÇÃO DO VETOR SVG:
   - Defina caminhos de vetor suaves (<path>) com ids explícitos dentro de <defs> e vincule os elementos <textPath> correspondentes.
2. MAPEAMENTO DE SCROLL (GSAP):
   - Vincule o atributo "startOffset" do elemento <textPath> ao scroll usando o plugin ScrollTrigger com interpolação física suave (scrub: 1.5).
3. DESIGN RESPONSIVO:
   - Garanta que o SVG escale corretamente usando viewBox e larguras relativas, impedindo que o texto saia dos limites visíveis nas telas menores.

Forneça os códigos de marcação SVG e o script GSAP de animação integrados em um componente React.`,
      en: `Act as a Creative Frontend Developer. Implement an expressive typographic component that wraps and animates text along custom bezier curves (<textPath> within an <svg> wrapper) synchronized with scroll positions using GSAP ScrollTrigger.

Implementation Guidelines:
1. SVG PATH DESIGN:
   - Formulate clean SVG vector paths (<path>) with unique IDs inside a <defs> block, linking them to structural <textPath> tags.
2. SCROLL INTEGRATION:
   - Drive the "startOffset" attribute of the <textPath> dynamically from page scroll metrics using GSAP ScrollTrigger configured with ease interpolation (scrub: 1.5).
3. VIEWBOX RESPONSIVENESS:
   - Ensure the vector container is fully responsive using scalable viewBox attributes.

Provide the complete SVG structure and GSAP initialization scripts in a React module.`,
      es: `Actúa como un Desarrollador Frontend Creativo. Crea un componente tipográfico interactivo que desplace y curve texto a lo largo de trazos vectoriales (<textPath> dentro de <svg>) sincronizados con el scroll mediante GSAP ScrollTrigger.

Directrices de Implementación:
1. DISEÑO DE TRAZADO SVG:
   - Define vectores suaves (<path>) con IDs estructurados dentro de etiquetas <defs> para enlazar la propiedad <textPath>.
2. ANIMACIÓN CON SCROLL:
   - Vincula el atributo "startOffset" del elemento <textPath> al desplazamiento del scroll con GSAP ScrollTrigger (scrub: 1.5).
3. RESPONSIVIDAD VECTORIAL:
   - Emplea viewBox escalables para evitar que las tipografías queden ocultas en dispositivos pequeños.

Proporciona el código de marcado del componente en React y la configuración de ScrollTrigger.`
    }
  },
  {
    id: 'state-management-zustand',
    category: 'dev',
    tags: ['Zustand', 'React', 'State', 'Sync'],
    title: {
      pt: 'Sincronização de Estado com Zustand',
      en: 'Zustand State Sync',
      es: 'Sincronización de Estado con Zustand'
    },
    description: {
      pt: 'Estrutura stores reativos locais no Zustand com persistência automática e sincronia em tempo real.',
      en: 'Structures local reactive Zustand stores with auto-persistence and real-time syncing.',
      es: 'Estructura almacenes reactivos en Zustand con persistencia y sincronización en tiempo real.'
    },
    content: {
      pt: `Atue como um Arquiteto Frontend Sênior. Implemente um sistema de gerenciamento de estado global reativo para nossa aplicação utilizando Zustand.

Diretrizes da Store:
1. ARQUITETURA EM DOSES (SLICES):
   - Estruture a store dividindo estados e ações em fatias modulares (slices) focadas para manter a base de código escalável.
2. PERSISTÊNCIA AUTOMÁTICA:
   - Configure o middleware "persist" do Zustand para salvar automaticamente subconjuntos do estado no localStorage ou sessionStorage, cuidando da hidratação segura no SSR.
3. DEVTOOLS E MIDLEWARES:
   - Conecte a ferramenta de depuração Redux DevTools através do middleware "devtools".
4. SINCRONIA EM TEMPO REAL:
   - Implemente conexões reativas para sincronizar atualizações de estado com conexões externas (como WebSockets ou Server-Sent Events).

Forneça os códigos de definição das stores e demonstre como injetar e ler esses dados em componentes React.`,
      en: `Act as a Senior Frontend Architect. Design and implement a robust, lightweight global state store module using Zustand.

Store Guidelines:
1. STATE SLICING:
   - Structure the store architecture using separate modular slices to split distinct domains.
2. COOKIE/LOCAL STORAGE PERSISTENCE:
   - Setup Zustand "persist" middleware to automatically save state selections to local storage, handling React SSR hydration warnings.
3. DEVTOOLS MIDDLEWARE INTEGRATION:
   - Wrap the store with "devtools" middleware to expose state mutations within Redux DevTools.
4. LIVE DATA SYNCHRONIZATION:
   - Implement hooks to push and pull state mutations through active websocket channels.

Provide the TypeScript store definitions and show how to access and dispatch actions inside React nodes.`,
      es: `Actúa como un Arquitecto Frontend Senior. Diseña e implementa una arquitectura de tienda de estado global reactiva utilizando Zustand.

Directrices del Almacén:
1. MODULARIDAD POR SLICES:
   - Divide los estados y acciones en fatias modulares separadas para mantener la base de código mantenible.
2. PERSISTENCIA EN ALMACENAMIENTO LOCAL:
   - Configura el middleware de persistencia para guardar fragmentos de la tienda en localStorage, gestionando la hidratación segura en entornos SSR.
3. MIDDLEWARE DE DEVTOOLS:
   - Integra la utilidad de desarrollo "devtools" para auditar las mutaciones de la tienda desde el inspector de Redux.
4. SINCRONIZACIÓN EN TIEMPO REAL:
   - Implementa canalizaciones para sincronizar estados con conexiones WebSockets remotas.

Proporciona las definiciones en TypeScript del almacén y ejemplos de inyección en componentes React.`
    }
  },
  {
    id: 'auth-rbac-middleware',
    category: 'security',
    tags: ['Auth', 'RBAC', 'Middleware', 'Cookies'],
    title: {
      pt: 'Autenticação & Middleware RBAC',
      en: 'Authentication & RBAC Middleware',
      es: 'Autenticación y Middleware RBAC'
    },
    description: {
      pt: 'Implementa controle de sessões, renovação de tokens (refresh) e proteção de rotas por níveis de acesso.',
      en: 'Implements session management, token refresh mechanisms, and role-based route shielding.',
      es: 'Implementa control de sesiones, renovación de tokens y protección de rutas según roles de acceso.'
    },
    content: {
      pt: `Atue como um Engenheiro Backend Sênior especialista em Segurança da Informação. Sua tarefa é estruturar um middleware de autenticação robusto e controle de acesso baseado em cargos (RBAC) para proteger rotas sensíveis de nossa aplicação.

Requisitos de Controle de Acesso:
1. CICLO DE VIDA DO TOKEN DE SESSÃO:
   - Implemente um fluxo seguro de tokens JWT separados em Access Tokens de curta duração e Refresh Tokens persistidos com segurança.
2. MIDDLEWARE DE PROTEÇÃO DE ROTAS:
   - Crie interceptores de rotas para extrair, decodificar e validar a integridade dos tokens nas requisições.
3. CONTROLE BASEADO EM CARGOS (RBAC):
   - Valide se o cargo do usuário possui as permissões necessárias para acessar a rota (ex: [ADMIN, EDITOR, MEMBER]).
4. TRATAMENTO DE ACESSO NEGADO:
   - Em caso de falha de validação ou permissão insuficiente, responda com status HTTP corretos (401 Unauthorized ou 403 Forbidden).

Forneça os códigos do middleware backend e a estrutura de dados das regras de permissão.`,
      en: `Act as a Senior Backend Security Engineer. Your task is to design a secure authentication workflow and Role-Based Access Control (RBAC) middleware to shield sensitive application API endpoints.

Access Control Requirements:
1. SESSION TOKEN LIFECYCLE:
   - Design a secure dual-token authentication scheme utilizing short-lived Access Tokens and secure Refresh Tokens.
2. ROUTE SHIELDING MIDDLEWARE:
   - Write gateway middleware to extract, decode, and verify digital signatures of request tokens.
3. ROLE-BASED AUTHORIZATION MATRIX (RBAC):
   - Authenticate request routes against an access matrix mapping roles (e.g., ADMIN, EDITOR, MEMBER) to specific actions.
4. UNAUTHORIZED FLOW HANDLING:
   - Handle invalid tokens and missing permissions gracefully returning correct status codes (401 Unauthorized / 403 Forbidden).

Provide the backend route middleware module and the authorization matrix schema.`,
      es: `Actúa como un Ingeniero de Seguridad Backend Senior. Tu tarea es estructurar un flujo de autenticación seguro y un middleware de control de acceso basado en roles (RBAC) para proteger rutas críticas de API.

Requisitos de Control de Acceso:
1. CICLO DE VIDA DE TOKENS:
   - Diseña un flujo seguro que divida la sesión en Access Tokens de vida corta y Refresh Tokens robustos.
2. MIDDLEWARE DE PROTECCIÓN DE RUTAS:
   - Escribe un filtro de middleware para interceptar cabeceras HTTP, extraer y validar la firma de los tokens.
3. MATRIZ DE AUTORIZACIÓN POR ROLES (RBAC):
   - Compara las autorizaciones del payload del token contra la lista de accesos requerida (ej: ADMIN, EDITOR, MEMBER).
4. RESPUESTAS DE ACCESO DENEGADO:
   - Intercepta fallas de privilegios respondiendo con los códigos correctos (401 o 403).

Proporciona el código de middleware backend y la estructura de la matriz de permisos.`
    }
  },
  {
    id: 'css-fluid-typography',
    category: 'design',
    tags: ['Design', 'CSS-Clamp', 'Grid', 'Modern-CSS'],
    title: {
      pt: 'Tipografia Fluida & Layouts Modernos',
      en: 'Fluid Typography & Modern Layouts',
      es: 'Tipografía Fluida y Diseños Modernos'
    },
    description: {
      pt: 'Gera regras de fontes adaptáveis com clamp(), uso de container queries e subgrid para layouts flexíveis.',
      en: 'Generates adaptive fonts using clamp(), container queries, and subgrid for flexible layouts.',
      es: 'Genera reglas de fuentes adaptables usando clamp(), consultas de contenedor y subgrid para diseños flexibles.'
    },
    content: {
      pt: `Atue como um Especialista em CSS Moderno. Sua tarefa é criar um sistema tipográfico responsivo e fluido sem media queries redundantes, combinado com estruturas de layout usando CSS Container Queries e CSS Subgrid.

Diretrizes de Layout e Estilo:
1. TIPOGRAFIA FLUIDA COM CLAMP:
   - Defina fontes e espaçamentos (paddings/margins) usando a função clamp() (ex: clamp(1.5rem, 2vw + 1rem, 3rem)), calculando taxas de crescimento fluido ideais para mobile e desktop.
2. CONTAINER QUERIES:
   - Crie componentes independentes de viewport, que se adaptam baseados no tamanho do contêiner pai (@container) em vez da tela do dispositivo (@media).
3. SUBGRID:
   - Alinhe layouts de cartões multinível (alinhamento perfeito de títulos, descrições e botões) utilizando grid-template-rows: subgrid.

Forneça as regras de estilo e marcação CSS.`,
      en: `Act as a Modern CSS Specialist. Your task is to design a responsive and fluid typographic scale without relying on redundant media queries, combined with layouts that leverage CSS Container Queries and CSS Subgrid.

Guidelines:
1. FLUID TYPOGRAPHY WITH CLAMP:
   - Construct font sizes and spacing (margins/paddings) using the clamp() function (e.g., clamp(1.5rem, 2vw + 1rem, 3rem)). Configure proper minimum, growth, and maximum bounds.
2. CONTAINER QUERIES (@container):
   - Design components that adjust dynamically based on their parent container width rather than viewport boundaries.
3. SUBGRID ALIGNMENT:
   - Align multi-card dynamic text cards (ensuring titles, descriptions, and action blocks align horizontally) using grid-template-rows: subgrid.

Provide clean HTML markup and CSS declarations.`,
      es: `Actúa como un Especialista en CSS Moderno. Tu tarea es diseñar una escala tipográfica fluida y responsiva sin depender de media queries redundantes, combinada con layouts que utilicen Container Queries y CSS Subgrid.

Directrices:
1. TIPOGRAFÍA FLUIDA CON CLAMP:
   - Define tamaños de fuente y márgenes utilizando la función clamp() (ej: clamp(1.5rem, 2vw + 1rem, 3rem)), calculando límites de escala fluidos.
2. CONTAINER QUERIES:
   - Crea componentes desacoplados del viewport que se adapten al contenedor padre (@container).
3. SUBGRID:
   - Alinea filas internas de tarjetas dinámicas con grid-template-rows: subgrid.

Proporciona las clases de CSS y maquetación de ejemplo.`
    }
  },
  {
    id: 'optimistic-ui-updates',
    category: 'dev',
    tags: ['React', 'State', 'Optimistic-UI', 'UX'],
    title: {
      pt: 'Atualizações Otimistas de UI',
      en: 'Optimistic UI Updates',
      es: 'Actualizaciones Optimistas de Interfaz'
    },
    description: {
      pt: 'Estrutura mutações que atualizam a interface instantaneamente com fluxo de rollback em caso de falha.',
      en: 'Structures mutations that update the UI instantly with a rollback flow in case of failure.',
      es: 'Estructura mutaciones que actualizan la interfaz instantáneamente con flujo de reversión en caso de fallo.'
    },
    content: {
      pt: `Atue como um Engenheiro Frontend Sênior. Sua tarefa é implementar um fluxo de mutação de dados com atualização otimista da UI (Optimistic UI Update) utilizando React e gerenciamento de estado (ou React Query/Zustand).

Diretrizes de Implementação:
1. FLUXO IMEDIATO (OPTIMISTIC PHASE):
   - Atualize o estado local da aplicação imediatamente assim que a ação do usuário for disparada, simulando sucesso instantâneo (ex: curtir postagem, adicionar comentário).
2. CHAMADA API E RETENTATIVAS:
   - Dispare a requisição HTTP em segundo plano.
3. TRATAMENTO DE ERRO E ROLLBACK:
   - Caso a requisição falhe, implemente o rollback automático revertendo o estado local para o valor anterior exato e exiba uma notificação toast não invasiva para o usuário.

Forneça o código do componente e da mutation com os devidos callbacks de erro.`,
      en: `Act as a Senior Frontend Engineer. Your task is to implement a robust data mutation flow with Optimistic UI updates utilizing React (e.g., React hooks, Zustand, or TanStack Query).

Guidelines:
1. OPTIMISTIC UPDATE STAGE:
   - Mutate local state immediately on user action to simulate instant success response (e.g., liking a post, changing task categories).
2. ASYNC BACKEND DISPATCH:
   - Fire the HTTP request in the background.
3. ROLLBACK & FAULT RECOVERY:
   - If the request errors out, trigger an atomic rollback to revert local state to the original snapshots and raise non-blocking notifications.

Provide the complete React module, handling state recovery and error states cleanly.`,
      es: `Actúa como un Ingeniero Frontend Senior. Tu tarea es implementar un flujo de mutación de datos con actualizaciones optimistas en la interfaz utilizando React y librerías de estado.

Directrices de Implementación:
1. ACTUALIZACIÓN OPTIMISTA INMEDIATA:
   - Modifica el estado local inmediatamente tras el clic del usuario para emular una respuesta rápida.
2. PETICIÓN EN SEGUNDO PLANO:
   - Lanza la consulta HTTP de mutación en segundo plano.
3. REVERSIÓN DE ESTADO (ROLLBACK):
   - En caso de error de red o de servidor, revierte el estado al valor capturado en el snapshot inicial y muestra un toast de error.

Proporciona el código de React con los hooks de mutación y reversión.`
    }
  },
  {
    id: 'custom-webgl-cursor',
    category: 'webgl',
    tags: ['WebGL', 'Three.js', 'Cursor', 'Física'],
    title: {
      pt: 'Cursor WebGL Interativo',
      en: 'Interactive WebGL Cursor',
      es: 'Cursor WebGL Interactivo'
    },
    description: {
      pt: 'Implementa um rastro de cursor personalizado em canvas WebGL com física de mola e partículas.',
      en: 'Implements a custom cursor trail on WebGL canvas with spring physics and particles.',
      es: 'Implementa un rastro de cursor personalizado en canvas WebGL con física de resorte y partículas.'
    },
    content: {
      pt: `Atue como um Desenvolvedor WebGL e Creative Frontend. Crie um efeito premium de cursor interativo (custom trailing cursor) em um canvas WebGL utilizando partículas ou distorção de malha com física de mola.

Diretrizes da Cópia:
1. RASTREAMENTO E INÉRCIA:
   - Rastreie a posição do mouse e aplique interpolação linear (LERP) ou física de mola para criar um atraso de movimento suave (inertia).
2. SISTEMA DE PARTÍCULAS (GPU):
   - Desenhe um fluxo de partículas que nascem na posição do cursor, enfraquecem (fade out) com o tempo e se espalham de forma orgânica.
3. DRAW CALLS E PERFORMANCE:
   - Utilize instanciamento ou BufferGeometry dinâmico para garantir taxa de atualização de 60fps estáveis.

Forneça os fragmentos de código e os shaders necessários.`,
      en: `Act as a WebGL and Creative Frontend Developer. Create an interactive custom trailing cursor effect rendered on a WebGL canvas using dynamic particle systems or mesh warping.

Guidelines:
1. CURSOR INERTIA & SPRING PHYSICS:
   - Track pointer coordinates and apply spring formulas or linear interpolation (LERP) to create fluid cursor trailing dynamics.
2. ACCELERATED GPU PARTICLES:
   - Spawn particles at pointer coordinates, scaling them down and fading them out based on lifetime parameters inside the fragment shader.
3. GPU RENDERING EFFICIENCY:
   - Leverage dynamic attribute updates or InstancedMesh to keep GPU draw calls low.

Provide the complete Canvas component and the GLSL shaders.`,
      es: `Actúa como un Desarrollador WebGL y Frontend Creativo. Diseña un cursor interactivo personalizado sobre un canvas de WebGL utilizando sistemas de partículas con física de resorte.

Directrices:
1. INERCIA Y FÍSICA DE RESORTES:
   - Captura las coordenadas del puntero y aplica LERP o ecuaciones de resorte para lograr suavidad en el rastro.
2. SISTEMA DE PARTÍCULAS EN GPU:
   - Genera partículas que decrecen en opacidad y escala según su ciclo de vida dentro del fragment shader.
3. RENDERIZADO EFICIENTE:
   - Emplea BufferGeometry dinámico para sostener tasas de 60 FPS estables.

Proporciona el componente listo para integrar y los fragmentos GLSL.`
    }
  },
  {
    id: 'security-rate-limiter-redis',
    category: 'security',
    tags: ['Segurança', 'Redis', 'Rate-Limiting', 'API'],
    title: {
      pt: 'Limitador de Taxa com Redis',
      en: 'Rate Limiter with Redis',
      es: 'Limitador de Tasa con Redis'
    },
    description: {
      pt: 'Implementa proteção avançada de taxa por IP com Redis, mitigando ataques de força bruta em APIs.',
      en: 'Implements advanced IP-based rate limiting using Redis, mitigating API brute-force attacks.',
      es: 'Implementa protección avanzada de tasa por IP con Redis, mitigando ataques de fuerza bruta en APIs.'
    },
    content: {
      pt: `Atue como um Arquiteto de Backend e Engenheiro de Segurança. Sua tarefa é implementar um limitador de taxa distribuído (Rate Limiter) usando Redis e Node.js/Express (ou similar) para proteger endpoints sensíveis.

Diretrizes de Implementação:
1. ALGORITMO SLIDING WINDOW COUNTER:
   - Use o algoritmo Sliding Window Counter para contagem precisa de requisições por janela de tempo por IP ou ID de usuário.
2. TRANSAÇÕES ATÔMICAS NO REDIS:
   - Use operações atômicas (MULTI/EXEC ou scripts Lua) no Redis para evitar condições de corrida (race conditions) durante a validação.
3. CABEÇALHOS HTTP COMPATÍVEIS:
   - Retorne os cabeçalhos de limite de requisições padrão (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset) e o código de status HTTP 429 Too Many Requests apropriado.

Forneça o middleware backend com tratamento de erros.`,
      en: `Act as a Backend Architect and Security Engineer. Your task is to build a distributed Rate Limiter utilizing Redis and Node/Express to protect critical API paths against scraping and brute-force.

Guidelines:
1. SLIDING WINDOW ALGORITHM:
   - Implement the sliding window counter algorithm for precise request limits relative to IP address blocks or token hashes.
2. ATOMIC REDIS EXECUTIONS:
   - Package query evaluations using multi/exec transactions or atomic Lua scripts to prevent concurrent request race conditions.
3. STANDARD HTTP HEADERS:
   - Return standard headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset) and return HTTP 429 Too Many Requests if boundaries are crossed.

Provide the Express middleware module and the Redis script details.`,
      es: `Actúa como un Arquitecto de Backend e Ingeniero de Seguridad. Tu tarea es implementar un limitador de tasa distribuido (Rate Limiter) usando Redis y Node/Express para blindar endpoints críticos.

Directrices de Implementación:
1. ALGORITMO SLIDING WINDOW:
   - Emplea un contador de ventana deslizante para limitar peticiones asociadas a una IP o clave de API.
2. OPERACIONES ATÓMICAS EN REDIS:
   - Agrupa transacciones con scripts de Lua o pipelines multi/exec para evitar condiciones de carrera.
3. CABECERAS HTTP ESTÁNDAR:
   - Inyecta cabeceras de cuota de consumo (X-RateLimit-*) y responde con el código de error HTTP 429 si el cliente excede los límites.

Proporciona el middleware en Node.js/Express.`
    }
  }
];

interface PromptsViewProps {
  lang: Language;
}

export default function PromptsView({ lang }: PromptsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePrompt, setActivePrompt] = useState<PromptItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (activePrompt) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [activePrompt]);

  // Category labels based on language
  const categories = useMemo(() => [
    { value: 'All', label: { pt: 'Todos os Prompts', en: 'All Prompts', es: 'Todos los Prompts' }[lang] },
    { value: 'design', label: { pt: 'Design & Figma', en: 'Design & Figma', es: 'Diseño y Figma' }[lang] },
    { value: 'dev', label: { pt: 'Código & Dev', en: 'Code & Dev', es: 'Código y Dev' }[lang] },
    { value: 'animation', label: { pt: 'Animações', en: 'Animations', es: 'Animaciones' }[lang] },
    { value: 'security', label: { pt: 'Segurança SaaS', en: 'SaaS Security', es: 'Seguridad SaaS' }[lang] },
    { value: 'performance', label: { pt: 'Performance', en: 'Performance', es: 'Rendimiento' }[lang] },
    { value: 'webgl', label: { pt: '3D & WebGL', en: '3D & WebGL', es: '3D y WebGL' }[lang] },
  ], [lang]);

  const filteredPrompts = useMemo(() => {
    return PROMPTS_DATA.filter((prompt) => {
      const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = 
        prompt.title[lang].toLowerCase().includes(lowerSearch) ||
        prompt.description[lang].toLowerCase().includes(lowerSearch) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(lowerSearch));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, lang]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getCategoryIcon = (category: string, id: string, size = 32, strokeWidth = 1) => {
    if (id === 'responsiveness') {
      return <Smartphone size={size} strokeWidth={strokeWidth} />;
    }
    switch (category) {
      case 'design': 
        if (id === 'accessibility') return <Eye size={size} strokeWidth={strokeWidth} />;
        return <Paintbrush size={size} strokeWidth={strokeWidth} />;
      case 'dev': 
        if (id === 'clean-code') return <FileCode size={size} strokeWidth={strokeWidth} />;
        if (id === 'db-optimization') return <Database size={size} strokeWidth={strokeWidth} />;
        if (id === 'api-mock') return <Braces size={size} strokeWidth={strokeWidth} />;
        if (id === 'i18n-structure') return <Languages size={size} strokeWidth={strokeWidth} />;
        return <Braces size={size} strokeWidth={strokeWidth} />;
      case 'animation': return <Wind size={size} strokeWidth={strokeWidth} />;
      case 'security': 
        if (id === 'payment-integration') return <CreditCard size={size} strokeWidth={strokeWidth} />;
        return <Shield size={size} strokeWidth={strokeWidth} />;
      case 'performance': return <Gauge size={size} strokeWidth={strokeWidth} />;
      case 'webgl': return <Box size={size} strokeWidth={strokeWidth} />;
      default: return <Braces size={size} strokeWidth={strokeWidth} />;
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* 1. Header Section */}
      <div className="flex flex-col items-center text-center gap-4 pt-4 max-w-2xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-normal text-white tracking-tight leading-tight select-none">
          {lang === 'pt' ? (
            <>Canivete Suíço de <span className="text-zinc-650 font-medium">Prompts</span></>
          ) : lang === 'es' ? (
            <>Navaja Suiza de <span className="text-zinc-650 font-medium">Prompts</span></>
          ) : (
            <>Swiss Army Knife of <span className="text-zinc-650 font-medium">Prompts</span></>
          )}
        </h1>
        <p className="text-xs text-zinc-400 max-w-lg leading-relaxed select-none">
          {lang === 'pt' && 'Prompts otimizados e ultra completos estruturados para você enviar aos seus agentes de IA (Claude, Cursor, Copilot) junto com layouts ou escopos do seu projeto.'}
          {lang === 'en' && 'Highly-detailed and optimized system prompts ready for you to send to your AI agents (Claude, Cursor, Copilot) along with screenshots or code scopes.'}
          {lang === 'es' && 'Prompts altamente detallados y optimizados listos para enviar a tus agentes de IA (Claude, Cursor, Copilot) junto con capturas de pantalla o alcances de código.'}
        </p>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col items-center gap-5 w-full">
        {/* Local Search input - Exact Match with Vance Search Bar style */}
        <div className="flex items-center gap-3 px-4 bg-[#141416] rounded-full h-10 w-full max-w-[320px] transition-all border border-transparent focus-within:bg-[#18181a] focus-within:border-zinc-800/40">
          <Search size={15} strokeWidth={2.5} className="text-white shrink-0" />
          <input 
            type="text" 
            placeholder={
              lang === 'pt' ? 'Pesquisar prompts...' : 
              lang === 'es' ? 'Buscar prompts...' : 'Search prompts...'
            }
            className="bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-500 w-full font-normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-zinc-500 hover:text-white cursor-pointer shrink-0">
              <span className="text-[10px]">✕</span>
            </button>
          )}
        </div>

        {/* Category Selector Menu - Matches exact hero selector pills */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto gap-2 w-full scrollbar-hide py-1 px-4 select-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={`prompt-cat-pill-${cat.value}`}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-full cursor-pointer transition-all border-none hero-category-pill ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Grid of Prompts - exact visual layout grid matches component library grid */}
      <div className="max-w-5xl mx-auto px-1">
        {filteredPrompts.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-zinc-550 gap-2 p-8 text-center bg-transparent">
            <h3 className="font-semibold text-sm text-zinc-400">
              {lang === 'pt' ? 'Nenhum prompt encontrado' : lang === 'es' ? 'No se encontraron prompts' : 'No prompts found'}
            </h3>
            <p className="text-xs text-zinc-500">
              {lang === 'pt' ? 'Ajuste os parâmetros de busca ou filtre por outra categoria.' : 'Adjust search terms or try another category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:gap-x-3 gap-y-6 md:gap-y-8 mt-1">
            {filteredPrompts.map((item, idx) => {
              const isCopied = copiedId === item.id;
              const promptText = item.content[lang];

              return (
                <div 
                  key={item.id}
                  className="group flex flex-col relative w-full hero-component-card transition-all duration-300"
                  style={{ animationDelay: `${idx * 25}ms` }}
                >
                  {/* 1. Visual Box (Monochromatic, clean design matching ComponentCard aspect-[16/12] layout) */}
                  <div 
                    onClick={() => setActivePrompt(item)}
                    className="w-full aspect-[16/12] bg-[#161619] rounded-2xl cursor-pointer flex items-center justify-center relative overflow-hidden group-hover:bg-[#1b1b1f] transition-all duration-300 border border-zinc-900/10"
                  >
                    {/* Mini Code Editor Window */}
                    <div className="w-[88%] h-[82%] bg-[#0e0e10] border border-zinc-900/60 rounded-xl relative overflow-hidden flex flex-col p-4 shadow-[0_10px_35px_rgba(0,0,0,0.6)] group-hover:border-zinc-800/80 transition-all duration-300">
                      {/* Window Header */}
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-2.5 select-none shrink-0">
                        {/* Three Window Dots (subtle monochromatic) */}
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-850"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-850"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-850"></span>
                        </div>
                        {/* File Tab Name with category icon */}
                        <div className="text-[10px] font-mono text-zinc-650 flex items-center gap-1.5 font-medium">
                          <span className="text-zinc-650 group-hover:text-zinc-450 transition-colors duration-300">
                            {getCategoryIcon(item.category, item.id, 11, 1.5)}
                          </span>
                          <span>{item.id}.prompt</span>
                        </div>
                      </div>

                      {/* Code Content Snippet */}
                      <div className="text-[9px] font-mono text-zinc-550 group-hover:text-zinc-450 transition-colors duration-300 leading-[1.65] text-left select-none whitespace-pre-wrap overflow-hidden flex-1 relative">
                        {promptText}
                        
                        {/* Smooth bottom fade-out scrim */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0e0e10] to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* 2. Info Footer - exact matches ComponentCard footer style */}
                  <div className="flex items-end justify-between mt-4 px-2 w-full relative">
                    <div 
                      onClick={() => setActivePrompt(item)}
                      className="flex flex-col min-w-0 select-none cursor-pointer"
                    >
                      <span className="text-[15px] font-semibold text-white tracking-tight">
                        {item.title[lang]}
                      </span>
                      <span className="text-[12px] text-zinc-550 mt-1.5 font-medium block truncate max-w-[280px] md:max-w-[360px]">
                        {item.description[lang]}
                      </span>
                    </div>

                    {/* Action buttons fluttuando in hover */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto shrink-0">
                      {/* Toggle Preview Button (Opens Modal) */}
                      <button
                        onClick={() => setActivePrompt(item)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all border-none bg-zinc-900/80 text-white hover:bg-zinc-800"
                        title={lang === 'pt' ? 'Visualizar Prompt' : 'View Prompt'}
                      >
                        <Eye size={13} />
                      </button>

                      {/* Copy Prompt Button */}
                      <button
                        onClick={() => handleCopy(item.id, promptText)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all border-none ${
                          isCopied
                            ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                            : 'bg-zinc-900/80 text-white hover:bg-zinc-800'
                        }`}
                        title="Copy Prompt"
                      >
                        {isCopied ? <Check size={12} className="stroke-[3]" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Prompt Modal Dialog Overlay (Ultra-minimalist code viewer modal) */}
      {activePrompt && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivePrompt(null)}
        >
          <div 
            data-lenis-prevent
            className="w-full max-w-2xl bg-[#0b0b0d] border border-zinc-900 rounded-[24px] p-6 md:p-8 flex flex-col gap-5 shadow-[0_32px_80px_rgba(0,0,0,0.95)] animate-modal-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-white tracking-tight">
                {activePrompt.title[lang]}
              </h4>
              <button 
                onClick={() => setActivePrompt(null)}
                className="w-8 h-8 rounded-full bg-[#141416] hover:bg-zinc-800 text-zinc-450 hover:text-white flex items-center justify-center transition-all cursor-pointer border-none"
                title="Fechar"
              >
                <X size={14} />
              </button>
            </div>

            {/* Clean, minimalist code container */}
            <div className="flex flex-col bg-[#070709] border border-zinc-900 rounded-2xl overflow-hidden flex-1 min-h-[250px] max-h-[440px]">
              <div className="flex items-center px-5 py-3 bg-[#040405] text-[10px] font-mono text-zinc-450 select-none border-b border-zinc-900">
                <span className="font-semibold">{activePrompt.id}.prompt</span>
              </div>
              
              <div 
                data-lenis-prevent
                className="relative p-5 overflow-y-auto text-xs text-zinc-450 font-mono whitespace-pre-wrap leading-relaxed select-text shadow-inner flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700"
              >
                {activePrompt.content[lang]}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => handleCopy(activePrompt.id, activePrompt.content[lang])}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                  copiedId === activePrompt.id
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                    : 'bg-white text-black hover:bg-zinc-200 border-transparent shadow-sm'
                }`}
              >
                {copiedId === activePrompt.id ? (
                  <>
                    <Check size={12} className="stroke-[3]" />
                    <span>{lang === 'pt' ? 'Copiado!' : lang === 'es' ? '¡Copiado!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>{lang === 'pt' ? 'Copiar Prompt' : lang === 'es' ? 'Copiar Prompt' : 'Copy Prompt'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
