const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });

async function runTests() {
  return new Promise((resolve, reject) => {
    const testProcess = spawn('node', ['test-auth.js'], {
      cwd: __dirname,
      env: { ...process.env, MONGODB_URI: process.env.MONGODB_URI }
    });

    testProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    testProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    testProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Tests failed with code ${code}`));
      }
    });
  });
}

runTests()
  .then(() => {
    console.log('All tests completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Tests failed:', error);
    process.exit(1);
  }); 