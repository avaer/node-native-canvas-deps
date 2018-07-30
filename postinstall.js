const path = require('path');
const fs = require('fs');
const os = require('os');
const unzipper = require('unzipper');
const rimraf = require('rimraf');

['lib', 'lib2'].map(lib => {
  const rs = fs.createReadStream(path.join(__dirname, lib + '.zip'));
  rs.on('open', () => {
    const ws = rs.pipe(unzipper.Extract({
      path: __dirname,
    }));
    ws.on('close', () => {
      rimraf(path.join(__dirname, lib + '.zip'), err => {
        if (err) {
          throw err;
        }
      });
      const platform = os.platform();
      switch (platform) {
        case 'win32': {
          ['macos', 'linux', 'android', 'ios', 'arm64'].forEach(p => {
            rimraf(path.join(__dirname, lib, p), err => {
              if (err) {
                throw err;
              }
            });
          });
          break;
        }
        case 'darwin': {
          ['windows', 'linux', 'android', 'ios', 'arm64'].forEach(p => {
            rimraf(path.join(__dirname, lib, p), err => {
              if (err) {
                throw err;
              }
            });
          });
          break;
        }
        case 'linux': {
          if (process.arch === 'x64') {
            ['windows', 'macos', 'android', 'ios', 'arm64'].forEach(p => {
              rimraf(path.join(__dirname, lib, p), err => {
                if (err) {
                  throw err;
                }
              });
            });
          } else if (process.arch === 'arm64') {
            ['windows', 'macos', 'linux', 'android', 'ios'].forEach(p => {
              rimraf(path.join(__dirname, lib, p), err => {
                if (err) {
                  throw err;
                }
              });
            });
          }
          break;
        }
        default: throw new Error('unknown platform: ' + platform);
      }
    });
  });
  rs.on('error', err => {
    if (err.code === 'ENOENT') {
      process.exit(0);
    } else {
      throw err;
    }
  });
});

process.on('uncaughtException', err => {
  console.warn(err.stack);
});
