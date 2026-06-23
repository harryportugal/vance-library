const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMPONENTS_DIR = path.join(__dirname, 'public', 'components');

function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (err) {
      console.error(`    [Error deleting] ${dirPath}:`, err.message);
    }
  }
}

function cleanExtractedFolder(extractedPath) {
  if (!fs.existsSync(extractedPath)) return;
  
  const list = fs.readdirSync(extractedPath);
  list.forEach(file => {
    const filePath = path.join(extractedPath, file);
    let stat;
    try {
      stat = fs.lstatSync(filePath);
    } catch (e) {
      return;
    }
    
    if (stat.isDirectory()) {
      if (['node_modules', 'dist', 'build', '.next', '.git', '.github', '.vscode', '.cache'].includes(file.toLowerCase())) {
        console.log(`    Deleting folder: ${file}`);
        deleteFolderRecursive(filePath);
      } else {
        cleanExtractedFolder(filePath);
      }
    } else {
      if (file.endsWith('.log') || file === '.DS_Store' || file === 'Thumbs.db') {
        console.log(`    Deleting file: ${file}`);
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
      }
    }
  });
}

function optimizeVideo(videoPath) {
  if (!fs.existsSync(videoPath)) return;
  
  const tempPath = videoPath.replace('.mp4', '_temp_opt.mp4');
  console.log(`    Optimizing video: ${path.basename(videoPath)}...`);
  
  try {
    // Compress video: limit to 4s, scale to 480px, 20fps, CRF 30, no audio
    execSync(`ffmpeg -y -i "${videoPath}" -t 4 -vf "scale=480:-2" -c:v libx264 -crf 30 -r 20 -an "${tempPath}"`, { stdio: 'ignore' });
    
    if (fs.existsSync(tempPath)) {
      const origSize = fs.statSync(videoPath).size;
      const optSize = fs.statSync(tempPath).size;
      
      if (optSize < origSize) {
        fs.unlinkSync(videoPath);
        fs.renameSync(tempPath, videoPath);
        console.log(`    Saved: ${((origSize - optSize) / 1024 / 1024).toFixed(2)} MB (${((optSize / origSize) * 100).toFixed(1)}% of original)`);
      } else {
        fs.unlinkSync(tempPath);
        console.log(`    Keeping original (already optimized or smaller)`);
      }
    }
  } catch (err) {
    console.error(`    [Error optimizing video]`, err.message);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (e) {}
    }
  }
}

function rezipFolder(extractedPath, zipPath) {
  if (!fs.existsSync(extractedPath)) return;
  console.log(`    Re-zipping cleaned files into ${path.basename(zipPath)}...`);
  
  try {
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    // Zip using native tar
    execSync(`tar -acf "${zipPath}" -C "${extractedPath}" .`, { stdio: 'ignore' });
    console.log(`    Successfully re-zipped code.zip`);
  } catch (err) {
    console.error(`    [Error zipping]`, err.message);
  }
}

function processComponent(compPath) {
  const previewPath = path.join(compPath, 'preview.mp4');
  const zipPath = path.join(compPath, 'code.zip');
  const extractedPath = path.join(compPath, 'extracted');
  
  // 1. Optimize video
  if (fs.existsSync(previewPath)) {
    optimizeVideo(previewPath);
  }
  
  // 2. Clean extracted files
  if (fs.existsSync(extractedPath)) {
    cleanExtractedFolder(extractedPath);
  }
  
  // 3. Re-zip
  if (fs.existsSync(extractedPath)) {
    rezipFolder(extractedPath, zipPath);
  }
}

function main() {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error('Components directory not found!');
    return;
  }
  
  const categories = fs.readdirSync(COMPONENTS_DIR);
  let totalProcessed = 0;
  
  categories.forEach(category => {
    const catPath = path.join(COMPONENTS_DIR, category);
    if (!fs.statSync(catPath).isDirectory()) return;
    
    console.log(`\nCategory: ${category}`);
    const components = fs.readdirSync(catPath);
    
    components.forEach(compDir => {
      const compPath = path.join(catPath, compDir);
      if (!fs.statSync(compPath).isDirectory()) return;
      
      console.log(`  Processing Component #${compDir}...`);
      processComponent(compPath);
      totalProcessed++;
    });
  });
  
  console.log(`\nFinished! Processed ${totalProcessed} components.`);
}

main();
