const fs = require('fs');
const path = require('path');

// ==========================================
// 1. CONFIGURAÇÃO (Detecta chaves automaticamente)
// ==========================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''; // ou insira 'sk-...' aqui se preferir hardcoded

const COMPONENTS_DIR = path.join(__dirname, 'public', 'components');
const APP_TSX_PATH = path.join(__dirname, 'src', 'App.tsx');
const REGISTRY_PATH = path.join(__dirname, 'public', 'components-registry.json');

const hasKey = GEMINI_API_KEY || ANTHROPIC_API_KEY || (OPENAI_API_KEY && OPENAI_API_KEY !== 'sk-sua-chave-aqui');

if (!hasKey) {
  console.error('\n[Error] Nenhuma chave de API encontrada!');
  console.error('Por favor, defina uma das variáveis de ambiente:');
  console.error('  - GEMINI_API_KEY');
  console.error('  - ANTHROPIC_API_KEY');
  console.error('  - OPENAI_API_KEY\n');
  process.exit(1);
}

// ==========================================
// 2. CORREÇÃO ROBUSTA DO REACT (App.tsx)
// ==========================================
console.log('🤖 1/3: Consertando chaves duplicadas no React...');
if (fs.existsSync(APP_TSX_PATH)) {
  let appCode = fs.readFileSync(APP_TSX_PATH, 'utf8');
  // Substitui chaves simples por chaves scoped por categoria + ID para evitar duplicatas globais
  let replaced = false;
  
  if (appCode.includes('key={`new-${comp.id}`}') || appCode.includes('key={`box-${comp.id}`}') || appCode.includes('key={`single-${comp.id}`}')) {
    appCode = appCode
      .replace(/key=\{\`new-\$\{comp\.id\}\`\}/g, 'key={`new-${comp.category}-${comp.id}`}')
      .replace(/key=\{\`box-\$\{comp\.id\}\`\}/g, 'key={`box-${comp.category}-${comp.id}`}')
      .replace(/key=\{\`single-\$\{comp\.id\}\`\}/g, 'key={`single-${comp.category}-${comp.id}`}');
    fs.writeFileSync(APP_TSX_PATH, appCode, 'utf8');
    console.log('✅ App.tsx corrigido com chaves seguras scoped.');
  } else {
    console.log('⚡ App.tsx já está com chaves corrigidas.');
  }
}

// ==========================================
// 3. FUNÇÕES AUXILIARES DE VARREDURA
// ==========================================
function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        getFilesRecursively(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Find if index.html already exists (excluding build artifacts/mocks)
function findOriginalIndexHtml(dir) {
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist' && f !== 'build' && f !== 'out' && f !== 'files') {
        const found = findOriginalIndexHtml(full);
        if (found) return found;
      }
    } else if (f.toLowerCase() === 'index.html') {
      return full;
    }
  }
  return null;
}

// ==========================================
// 4. LLM API CALL NATIVA (Sem SDKs)
// ==========================================
async function generateHtmlWithAI(jsContent, cssContent) {
  const prompt = `Você é um engenheiro front-end senior. Retorne APENAS o código HTML do arquivo 'index.html' válido.
Não inclua nenhuma explicação, introdução ou bloco markdown. Retorne apenas o código HTML puro de ponta a ponta.

Reconstrua o DOM exato que o JS abaixo espera manipular (canvas, divs, wrapper IDs, classes, etc.).
No <head> inclua: <link rel="stylesheet" href="./style.css">
No final do <body> inclua: <script type="module" src="./script.js"></script>

JS: ${jsContent.substring(0, 4000)}
CSS: ${cssContent.substring(0, 2000)}`;

  if (ANTHROPIC_API_KEY) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    let text = data.content[0].text;
    return text.replace(/```html/g, '').replace(/```/g, '').trim();
  }

  if (OPENAI_API_KEY && OPENAI_API_KEY !== 'sk-sua-chave-aqui') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1
      })
    });
    const data = await res.json();
    let text = data.choices[0].message.content;
    return text.replace(/```html/g, '').replace(/```/g, '').trim();
  }

  if (GEMINI_API_KEY) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      })
    });
    const data = await res.json();
    let text = data.candidates[0].content.parts[0].text;
    return text.replace(/```html/g, '').replace(/```/g, '').trim();
  }
}

// ==========================================
// 5. MOTOR PRINCIPAL (Limpeza e Geração)
// ==========================================
async function runGodMode() {
  console.log('🤖 2/3: Varrendo componentes e limpando imports em script.js...');
  const allFiles = getFilesRecursively(COMPONENTS_DIR);
  
  const jsFiles = allFiles.filter(f => f.endsWith('script.js'));
  
  let jsFixedCount = 0;
  
  // Limpa imports locais de pacotes NPM
  for (const jsPath of jsFiles) {
    let jsCode = fs.readFileSync(jsPath, 'utf8');
    const badImports = /import\s+.*?from\s+['"](?:gsap|three|lenis|ScrollTrigger|ScrollToPlugin|CustomEase|Flip|Observer)['"];?/gi;
    const badSimpleImports = /import\s+['"](?:gsap|three|lenis|ScrollTrigger|ScrollToPlugin|CustomEase|Flip|Observer)['"];?/gi;
    
    if (badImports.test(jsCode) || badSimpleImports.test(jsCode)) {
      jsCode = jsCode.replace(badImports, '// Import removido na automação').replace(badSimpleImports, '// Import removido');
      fs.writeFileSync(jsPath, jsCode, 'utf8');
      jsFixedCount++;
    }
  }
  console.log(`✅ ${jsFixedCount} arquivos script.js limpos.`);

  console.log('🤖 3/3: Acionando IA para recriar os index.html faltantes...');
  let htmlGeneratedCount = 0;

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

  for (const comp of registry) {
    const compFolder = path.join(COMPONENTS_DIR, comp.category, comp.id);
    const extractedDir = path.join(compFolder, 'extracted');
    
    if (!fs.existsSync(extractedDir)) continue;
    
    const origIndex = findOriginalIndexHtml(extractedDir);
    
    // Se não tiver index.html original ou se for o mock da versão anterior
    let needsAi = false;
    let targetHtmlPath = path.join(extractedDir, 'files', 'index.html');
    
    if (!origIndex) {
      needsAi = true;
    } else {
      const htmlCode = fs.readFileSync(origIndex, 'utf8');
      if (htmlCode.includes('Scroll Kinetic Showcases')) {
        needsAi = true;
        targetHtmlPath = origIndex;
      }
    }

    if (needsAi) {
      console.log(`⏳ Gerando DOM para: ${comp.category} #${comp.id} (${comp.title})...`);
      
      const jsPath = path.join(extractedDir, 'files', 'script.js');
      const cssPath = path.join(extractedDir, 'files', 'style.css');
      
      if (!fs.existsSync(jsPath)) {
        // Encontra qualquer js no diretório extraído que não seja do mock
        const jsFiles = getFilesRecursively(extractedDir).filter(f => f.endsWith('.js') && !f.includes('/files/'));
        if (jsFiles.length > 0) {
          fs.mkdirSync(path.dirname(jsPath), { recursive: true });
          fs.copyFileSync(jsFiles[0], jsPath);
        }
      }
      
      if (!fs.existsSync(cssPath)) {
        const cssFiles = getFilesRecursively(extractedDir).filter(f => f.endsWith('.css') && !f.includes('/files/'));
        if (cssFiles.length > 0) {
          fs.mkdirSync(path.dirname(cssPath), { recursive: true });
          fs.copyFileSync(cssFiles[0], cssPath);
        }
      }

      if (fs.existsSync(jsPath)) {
        try {
          const jsCode = fs.readFileSync(jsPath, 'utf8');
          const cssCode = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
          
          const newHtml = await generateHtmlWithAI(jsCode, cssCode);
          
          fs.mkdirSync(path.dirname(targetHtmlPath), { recursive: true });
          fs.writeFileSync(targetHtmlPath, newHtml, 'utf8');
          
          // Cria estilos/scripts fictícios se não existirem
          if (!fs.existsSync(cssPath)) fs.writeFileSync(cssPath, '/* Inlined */', 'utf8');
          if (!fs.existsSync(jsPath)) fs.writeFileSync(jsPath, '// Inlined', 'utf8');
          
          htmlGeneratedCount++;
        } catch (error) {
          console.error(`❌ Erro na IA para ${comp.category} #${comp.id}:`, error.message);
        }
      } else {
        console.log(`  [Pular] Sem código-fonte localizável para ${comp.category} #${comp.id}`);
      }
    }
  }

  console.log(`\n🎉 OPERAÇÃO CONCLUÍDA COM SUCESSO!`);
  console.log(`- ${htmlGeneratedCount} arquivos index.html gerados com IA.`);
  console.log(`- Rode 'node build-components.cjs' e teste no localhost.`);
}

// ==========================================
// EXECUÇÃO
// ==========================================
runGodMode();
