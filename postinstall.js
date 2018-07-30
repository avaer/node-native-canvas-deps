const path = require('path');
const fs = require('fs');
const os = require('os');
const unzipper = require('unzipper');
const rimraf = require('rimraf');

['lib.zip', 'lib2.zip'].map(lib => {
  const rs = fs.createReadStream(path.join(__dirname, lib));
  rs.on('open', () => {
    const ws = rs.pipe(unzipper.Extract({
      path: __dirname,
    }));
    ws.on('close', () => {
      rimraf(path.join(__dirname, lib), err => {
        if (err) {
          throw err;
        }
      });
      const platform = os.platform();
      switch (platform) {
        case 'win32': {
          ['macos', 'linux', 'android', 'ios'].forEach(p => {
            rimraf(path.join(__dirname, 'lib', p), err => {
              if (err) {
                throw err;
              }
            });
          });
          rimraf(path.join(__dirname, 'lib2'), err => {
            if (err) {
              throw err;
            }
          });
          break;
        }
        case 'darwin': {
          ['windows', 'linux', 'android', 'ios'].forEach(p => {
            rimraf(path.join(__dirname, 'lib', p), err => {
              if (err) {
                throw err;
              }
            });
          });
          rimraf(path.join(__dirname, 'lib2'), err => {
            if (err) {
              throw err;
            }
          });
          break;
        }
        case 'linux': {
          if (process.arch === 'x64') {
            ['windows', 'macos', 'android', 'ios'].forEach(p => {
              rimraf(path.join(__dirname, 'lib', p), err => {
                if (err) {
                  throw err;
                }
              });
            });
            rimraf(path.join(__dirname, 'lib2'), err => {
              if (err) {
                throw err;
              }
            });
          } else {
            rimraf(path.join(__dirname, 'lib'), err => {
              if (err) {
                throw err;
              }
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
