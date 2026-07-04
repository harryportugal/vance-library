const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, 'public', 'components-registry.json');
const COMPONENTS_DIR = path.join(__dirname, 'public', 'components');

if (!fs.existsSync(REGISTRY_PATH)) {
  console.error('Registry file not found!');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

// Determine API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!GEMINI_API_KEY && !ANTHROPIC_API_KEY && !OPENAI_API_KEY) {
  console.error('\n[Error] No API Key found in environment variables!');
  console.error('Please set one of the following:');
  console.error('  - GEMINI_API_KEY');
  console.error('  - ANTHROPIC_API_KEY');
  console.error('  - OPENAI_API_KEY\n');
  process.exit(1);
}

// Function to call LLM using native fetch
async function callLLM(prompt) {
  if (ANTHROPIC_API_KEY) {
    console.log('  Calling Claude (Anthropic)...');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Anthropic API error: ${res.status} - ${errText}`);
    }
    const data = await res.json();
    return data.content[0].text;
  }

  if (OPENAI_API_KEY) {
    console.log('  Calling GPT-4o (OpenAI)...');
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error: ${res.status} - ${errText}`);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  }

  if (GEMINI_API_KEY) {
    console.log('  Calling Gemini...');
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1
        }
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error: ${res.status} - ${errText}`);
    }
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  }
}

// Recursively find files in a directory (ignoring heavy/useless directories)
function getSourceFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'build' && file !== 'out' && file !== '.next') {
        results = results.concat(getSourceFiles(filePath));
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx', '.css', '.html'].includes(ext) && file !== 'package-lock.json' && file !== 'next-env.d.ts') {
        results.push(filePath);
      }
    }
  }
  return results;
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

async function run() {
  console.log('=== Vance Library AI DOM Restorer ===');
  let restored = 0;

  for (const comp of registry) {
    const compFolder = path.join(COMPONENTS_DIR, comp.category, comp.id);
    const extractedDir = path.join(compFolder, 'extracted');
    
    if (!fs.existsSync(extractedDir)) continue;

    // Check if original index.html exists
    const origIndex = findOriginalIndexHtml(extractedDir);
    if (origIndex) {
      // Already has a real index.html, skip
      continue;
    }

    console.log(`\nRestoring DOM for: ${comp.category} #${comp.id} (${comp.title})`);

    // Read all source files to build context
    const sourceFiles = getSourceFiles(extractedDir);
    let filesContext = '';
    
    for (const file of sourceFiles) {
      const relPath = path.relative(extractedDir, file).replace(/\\/g, '/');
      // Skip files that are inside the mock files directory (which we created in previous runs)
      if (relPath.startsWith('files/')) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      filesContext += `\n--- FILE: ${relPath} ---\n${content}\n`;
    }

    if (!filesContext.trim()) {
      console.log('  No source files found in extracted/ folder. Skipping.');
      continue;
    }

    const prompt = `You are a Senior Frontend Engineer. Your task is to inspect the source code of a premium web animation component (mostly utilizing GSAP, Three.js, or CSS transitions) and generate a single, fully-functioning, and beautiful 'index.html' file that runs the animation inside an iframe.

Below are the source files of the component:
${filesContext}

Instructions:
1. Examine the JavaScript (or React components, or Next.js pages) and CSS to understand the required DOM elements (divs, canvas, wrapper IDs, special classes, text elements).
2. Rewrite the logic to run in plain vanilla JavaScript if the original source is written in React/Next.js/TypeScript.
3. Keep the styling beautiful. If there is a stylesheet provided, you can inline the CSS inside a <style> tag.
4. Inline the rewritten JavaScript inside a <script> tag at the bottom of the body.
5. Reference standard public CDNs for common libraries if they are imported/used (e.g. GSAP, ScrollTrigger, Three.js, etc.).
6. Output ONLY the code of the 'index.html' file wrapped in a markdown \`\`\`html ... \`\`\` code block. Do not write any explanations or text outside the block.`;

    try {
      const llmOutput = await callLLM(prompt);
      
      // Extract html content from code block
      const match = llmOutput.match(/```html([\s\S]*?)```/i);
      let htmlCode = match ? match[1].trim() : llmOutput.trim();

      // Ensure directory files/ exists
      const destDir = path.join(extractedDir, 'files');
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const destFile = path.join(destDir, 'index.html');
      fs.writeFileSync(destFile, htmlCode, 'utf8');
      
      // Write empty styles/scripts so other steps don't fail
      fs.writeFileSync(path.join(destDir, 'style.css'), '/* Styles inlined in index.html */', 'utf8');
      fs.writeFileSync(path.join(destDir, 'script.js'), '// Scripts inlined in index.html', 'utf8');

      console.log(`  [Success] Saved restored index.html to ${destFile}`);
      restored++;
    } catch (err) {
      console.error(`  [Error] Failed to generate DOM:`, err.message);
    }
  }

  console.log(`\n=== Finished! Restored ${restored} components. ===`);
}

run();
