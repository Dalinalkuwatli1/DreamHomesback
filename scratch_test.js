const { exec } = require('child_process');

const passwords = ['', 'root', '12345678', '1234', 'password', 'appserv'];

const run = (index) => {
  if (index >= passwords.length) return;
  const pw = passwords[index];
  const passArg = pw ? `-p${pw}` : '';
  const cmd = `"D:\\Virgo\\VirgoOffline1447\\MariaDB\\bin\\mysql.exe" --host=127.0.0.1 --port=3306 -u root ${passArg} -e "SHOW DATABASES;"`;
  
  exec(cmd, (error, stdout, stderr) => {
    console.log(`\n--- Testing MariaDB password: "${pw}" ---`);
    if (stdout) console.log('STDOUT:', stdout.trim());
    if (stderr) console.log('STDERR:', stderr.trim());
    if (error) console.log('CODE:', error.code);
    else console.log('SUCCESS!');
    
    run(index + 1);
  });
};

run(0);
