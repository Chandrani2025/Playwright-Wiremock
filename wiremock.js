const { spawn } = require('child_process');
const path = require('path');

let wiremockProcess;

async function startWireMock(port = 8080) {
  return new Promise((resolve, reject) => {
    const jarPath = path.join(__dirname, 'wiremock-jre8-standalone-2.35.0.jar');
    const rootDir = __dirname;

    wiremockProcess = spawn('java', [
      '-jar',
      jarPath,
      '--port',
      port,
      '--root-dir',
      rootDir
    ]);

    let resolved = false;

    wiremockProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[WireMock] ${output}`);

      // ✅ Wait until WireMock says it's running
      if (!resolved && output.includes(`port: ${port}`)) {
        resolved = true;
        resolve();
      }
    });

    wiremockProcess.stderr.on('data', (data) => {
      console.error(`[WireMock STDERR] ${data}`);
    });

    wiremockProcess.on('error', (error) => {
      if (!resolved) {
        resolved = true;
        reject(error);
      }
    });

    wiremockProcess.on('exit', (code) => {
      if (!resolved && code !== 0) {
        resolved = true;
        reject(new Error(`WireMock exited with code ${code}`));
      }
    });
  });
}

async function stopWireMock() {
  return new Promise((resolve) => {
    if (wiremockProcess) {
      wiremockProcess.kill('SIGINT');
      wiremockProcess.on('close', resolve);
    } else {
      resolve();
    }
  });
}

module.exports = { startWireMock, stopWireMock };
