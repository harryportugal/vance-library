const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const REGISTRY_FILE = path.join(__dirname, 'public', 'components-registry.json');
const CONCURRENCY_LIMIT = 6; // Run up to 6 conversions in parallel

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function convertVideo(videoPath, gifPath, jpgPath) {
  // Extract first frame as JPG
  if (!fs.existsSync(jpgPath)) {
    try {
      // Extract frame at timestamp 0
      const cmdJpg = `ffmpeg -y -ss 0 -i "${videoPath}" -vframes 1 -q:v 2 "${jpgPath}"`;
      await runCommand(cmdJpg);
      console.log(`  [JPG] Created thumbnail: ${path.basename(path.dirname(videoPath))}/${path.basename(jpgPath)}`);
    } catch (err) {
      console.error(`  [JPG Error] Failed to create thumbnail for ${videoPath}:`, err.message);
    }
  }

  // Convert video to optimized GIF
  if (!fs.existsSync(gifPath)) {
    try {
      // Downscale to 320px width, limit fps to 10 to make it super light
      const cmdGif = `ffmpeg -y -i "${videoPath}" -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${gifPath}"`;
      await runCommand(cmdGif);
      console.log(`  [GIF] Created animation: ${path.basename(path.dirname(videoPath))}/${path.basename(gifPath)}`);
    } catch (err) {
      console.error(`  [GIF Error] Failed to create GIF for ${videoPath}:`, err.message);
    }
  }
}

async function run() {
  console.log('Starting preview optimization script...');

  if (!fs.existsSync(REGISTRY_FILE)) {
    console.error(`Registry file not found at ${REGISTRY_FILE}`);
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
  console.log(`Found ${registry.length} components in registry.`);

  const tasks = [];

  for (const comp of registry) {
    if (comp.videoUrl) {
      // Decode videoUrl path
      // videoUrl: /components/Background%20Animations/1/preview.mp4
      const relativePath = decodeURIComponent(comp.videoUrl);
      const videoPath = path.join(__dirname, 'public', relativePath);
      const outputDir = path.dirname(videoPath);

      if (fs.existsSync(videoPath)) {
        const gifPath = path.join(outputDir, 'preview.gif');
        const jpgPath = path.join(outputDir, 'preview.jpg');

        tasks.push({
          comp,
          videoPath,
          gifPath,
          jpgPath,
          gifUrl: comp.videoUrl.replace('preview.mp4', 'preview.gif'),
          imageUrl: comp.videoUrl.replace('preview.mp4', 'preview.jpg')
        });
      } else {
        console.warn(`  [Warning] Video file not found: ${videoPath}`);
      }
    }
  }

  console.log(`Queued ${tasks.length} videos for conversion. Processing with concurrency limit of ${CONCURRENCY_LIMIT}...`);

  // Run tasks with concurrency limit
  let activeCount = 0;
  let taskIndex = 0;
  let completedCount = 0;

  const runNext = async () => {
    if (taskIndex >= tasks.length) return;
    const task = tasks[taskIndex++];
    activeCount++;

    try {
      await convertVideo(task.videoPath, task.gifPath, task.jpgPath);
      task.comp.gifUrl = task.gifUrl;
      task.comp.imageUrl = task.imageUrl;
    } catch (err) {
      console.error(`Failed task for ${task.videoPath}:`, err);
    } finally {
      activeCount--;
      completedCount++;
      if (completedCount % 10 === 0 || completedCount === tasks.length) {
        console.log(`Progress: ${completedCount}/${tasks.length} completed.`);
      }
      await runNext();
    }
  };

  const pool = [];
  for (let i = 0; i < Math.min(CONCURRENCY_LIMIT, tasks.length); i++) {
    pool.push(runNext());
  }

  await Promise.all(pool);

  // Write updated registry back
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2), 'utf8');
  console.log(`\nSuccessfully updated registry file with imageUrl and gifUrl!`);
}

run().catch(err => {
  console.error('Fatal error in runner:', err);
});
