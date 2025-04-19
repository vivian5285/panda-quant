import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 确保 sounds 目录存在
const soundsDir = path.join(__dirname, '../public/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// 安装必要的依赖
try {
  execSync('npm install tone --save-dev');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}

// 创建音效生成脚本
const generateSounds = `
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Tone from 'tone';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 创建合成器
const synth = new Tone.Synth().toDestination();

// 生成音效的函数
async function generateSound(fileName, note, duration, volume) {
  return new Promise((resolve) => {
    const buffer = new Tone.Buffer();
    const recorder = new Tone.Recorder();
    synth.connect(recorder);
    
    synth.volume.value = volume;
    synth.triggerAttackRelease(note, duration);
    
    setTimeout(async () => {
      const recording = await recorder.stop();
      const arrayBuffer = await recording.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(path.join(__dirname, '../public/sounds', fileName), buffer);
      resolve();
    }, duration * 1000 + 100);
  });
}

// 生成所有音效
async function generateAllSounds() {
  await generateSound('happy.mp3', 'C5', 0.2, -10); // 欢快的"叮"声
  await generateSound('very-happy.mp3', 'C6', 0.3, -8); // 更欢快的"叮叮"声
  await generateSound('satisfied.mp3', 'G4', 0.2, -12); // 满意的"嗯"声
  await generateSound('neutral.mp3', 'E4', 0.2, -15); // 中性的"嗯"声
  await generateSound('dissatisfied.mp3', 'C3', 0.3, -10); // 不满的"哼"声
  await generateSound('very-dissatisfied.mp3', 'C2', 0.4, -8); // 非常不满的"哼"声
  console.log('All sounds generated successfully!');
}

generateAllSounds();
`;

// 保存脚本
fs.writeFileSync(path.join(__dirname, 'generate-sounds.mjs'), generateSounds);

// 运行脚本
try {
  execSync('node scripts/generate-sounds.mjs', { stdio: 'inherit' });
  console.log('Sound generation completed successfully!');
} catch (error) {
  console.error('Error generating sounds:', error);
  process.exit(1);
} 