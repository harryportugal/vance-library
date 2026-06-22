const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_DIR = path.join(__dirname, '300 Awwwards components', 'Awwwards Pack');
const OUTPUT_DIR = path.join(__dirname, 'public', 'components');
const REGISTRY_FILE = path.join(__dirname, 'public', 'components-registry.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function normalizeCategoryName(dirName) {
  // e.g. "+10 Background Animations" -> "Background Animations"
  // e.g. "+22  3D Animation" -> "3D Animation"
  return dirName.replace(/^\+\d+\s*/, '').trim();
}

function getFilesRecursively(dir, rootDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Ignore heavy or metadata folders
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.github') {
        results = results.concat(getFilesRecursively(filePath, rootDir));
      }
    } else {
      // Ignore OS junk files
      if (file !== '.DS_Store' && !file.startsWith('._') && file !== 'Thumbs.db') {
        const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
        results.push(relativePath);
      }
    }
  });
  return results;
}

function extractZip(zipPath, targetDir) {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir, { recursive: true });
  
  // Use native tar on Windows to extract zip
  try {
    execSync(`tar -xf "${zipPath}" -C "${targetDir}"`, { stdio: 'ignore' });
    return true;
  } catch (err) {
    console.error(`Failed to extract ${zipPath}:`, err.message);
    return false;
  }
}

function run() {
  console.log('Starting extraction and indexing of Awwwards components...');
  
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }
  
  const categories = fs.readdirSync(SOURCE_DIR).filter(file => {
    const fullPath = path.join(SOURCE_DIR, file);
    return fs.statSync(fullPath).isDirectory() && file.startsWith('+');
  });
  
  const registry = [];
  
  categories.forEach((catDir) => {
    const categoryName = normalizeCategoryName(catDir);
    const catSourcePath = path.join(SOURCE_DIR, catDir);
    console.log(`\nProcessing Category: ${categoryName} (${catDir})`);
    
    const componentDirs = fs.readdirSync(catSourcePath).filter(file => {
      const fullPath = path.join(catSourcePath, file);
      return fs.statSync(fullPath).isDirectory() && !isNaN(file);
    }).sort((a, b) => parseInt(a) - parseInt(b));
    
    componentDirs.forEach((compDir) => {
      const compSourcePath = path.join(catSourcePath, compDir);
      const outputCompPath = path.join(OUTPUT_DIR, categoryName, compDir);
      
      // Find code.zip and video files
      const filesInDir = fs.readdirSync(compSourcePath);
      const zipFile = filesInDir.find(f => f.toLowerCase() === 'code.zip');
      const videoFile = filesInDir.find(f => {
        const lower = f.toLowerCase();
        return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov') || lower.endsWith('.ogg');
      });
      
      if (!zipFile) {
        console.warn(`  [Warning] Component ${compDir} has no code.zip. Skipping.`);
        return;
      }
      
      const zipSourcePath = path.join(compSourcePath, zipFile);
      const videoSourcePath = videoFile ? path.join(compSourcePath, videoFile) : null;
      
      // Define target paths
      const destZipPath = path.join(outputCompPath, 'code.zip');
      const destMp4Path = path.join(outputCompPath, 'preview.mp4');
      const destJpgPath = path.join(outputCompPath, 'preview.jpg');
      const destGifPath = path.join(outputCompPath, 'preview.gif');
      const extractedPath = path.join(outputCompPath, 'extracted');
      
      const zipAlreadyExtracted = fs.existsSync(destZipPath) && fs.existsSync(extractedPath);
      const videoAlreadyProcessed = !videoSourcePath || (fs.existsSync(destMp4Path) && fs.existsSync(destJpgPath) && fs.existsSync(destGifPath));
      
      if (zipAlreadyExtracted && videoAlreadyProcessed) {
        // Skip extraction, copying and ffmpeg. Just read files and add to registry
        const allFiles = getFilesRecursively(extractedPath);
        registry.push({
          id: compDir,
          category: categoryName,
          title: `${categoryName} #${compDir}`,
          videoUrl: videoSourcePath ? `/components/${encodeURIComponent(categoryName)}/${compDir}/preview.mp4` : null,
          imageUrl: videoSourcePath ? `/components/${encodeURIComponent(categoryName)}/${compDir}/preview.jpg` : null,
          gifUrl: videoSourcePath ? `/components/${encodeURIComponent(categoryName)}/${compDir}/preview.gif` : null,
          zipUrl: `/components/${encodeURIComponent(categoryName)}/${compDir}/code.zip`,
          files: allFiles.map(filePath => ({
            name: path.basename(filePath),
            path: filePath,
            url: `/components/${encodeURIComponent(categoryName)}/${compDir}/extracted/${filePath}`
          }))
        });
        console.log(`  [Skipped - Already Processed] Component #${compDir}`);
        return;
      }
      
      // Ensure target folder exists
      fs.mkdirSync(outputCompPath, { recursive: true });
      
      // 1. Extract zip if needed
      if (!fs.existsSync(extractedPath) || !fs.existsSync(destZipPath)) {
        const success = extractZip(zipSourcePath, extractedPath);
        if (!success) {
          console.error(`  [Error] Failed to extract component ${compDir}`);
          return;
        }
      }
      
      // 2. Scan extracted files
      const allFiles = getFilesRecursively(extractedPath);
      
      // 3. Process video if exists
      let videoUrl = null;
      let imageUrl = null;
      let gifUrl = null;
      if (videoSourcePath) {
        if (!fs.existsSync(destMp4Path)) {
          if (videoSourcePath.toLowerCase().endsWith('.mp4')) {
            fs.copyFileSync(videoSourcePath, destMp4Path);
          } else {
            // Convert to MP4
            try {
              console.log(`    Converting ${videoFile} to MP4 for component #${compDir}...`);
              execSync(`ffmpeg -y -i "${videoSourcePath}" -c:v libx264 -pix_fmt yuv420p "${destMp4Path}"`, { stdio: 'ignore' });
            } catch (err) {
              console.error(`    [Error] Failed to convert video to mp4 for component #${compDir}:`, err.message);
              // Fallback: copy directly and rename it preview.mp4
              fs.copyFileSync(videoSourcePath, destMp4Path);
            }
          }
        }
        
        videoUrl = `/components/${encodeURIComponent(categoryName)}/${compDir}/preview.mp4`;
        
        // Generate JPG frame
        if (!fs.existsSync(destJpgPath)) {
          try {
            execSync(`ffmpeg -y -ss 0 -i "${destMp4Path}" -vframes 1 -q:v 2 "${destJpgPath}"`, { stdio: 'ignore' });
          } catch (err) {
            console.error(`  Failed to generate JPG preview for component #${compDir}:`, err.message);
          }
        }
        if (fs.existsSync(destJpgPath)) {
          imageUrl = `/components/${encodeURIComponent(categoryName)}/${compDir}/preview.jpg`;
        }
        
        // Generate GIF
        if (!fs.existsSync(destGifPath)) {
          try {
            execSync(`ffmpeg -y -i "${destMp4Path}" -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${destGifPath}"`, { stdio: 'ignore' });
          } catch (err) {
            console.error(`  Failed to generate GIF preview for component #${compDir}:`, err.message);
          }
        }
        if (fs.existsSync(destGifPath)) {
          gifUrl = `/components/${encodeURIComponent(categoryName)}/${compDir}/preview.gif`;
        }
      }
      
      // 4. Copy original zip
      if (!fs.existsSync(destZipPath)) {
        fs.copyFileSync(zipSourcePath, destZipPath);
      }
      const zipUrl = `/components/${encodeURIComponent(categoryName)}/${compDir}/code.zip`;
      
      // Add to registry
      registry.push({
        id: compDir,
        category: categoryName,
        title: `${categoryName} #${compDir}`,
        videoUrl: videoUrl,
        imageUrl: imageUrl,
        gifUrl: gifUrl,
        zipUrl: zipUrl,
        files: allFiles.map(filePath => ({
          name: path.basename(filePath),
          path: filePath,
          url: `/components/${encodeURIComponent(categoryName)}/${compDir}/extracted/${filePath}`
        }))
      });
      
      console.log(`  Processed Component #${compDir} - ${allFiles.length} files found.`);
    });
  });
  
  // Write registry JSON file
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
  console.log(`\nRegistry generated successfully at ${REGISTRY_FILE}`);
  console.log(`Total components indexed: ${registry.length}`);
}

run();
