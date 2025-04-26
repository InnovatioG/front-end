// setTime.js - Temporarily modify WSL system time only
const { execSync } = require('child_process');


console.log('NOTE: run npm run setTime -- 1 months to set any time offset');
// Get the time parameter from command line arguments
const timeParam = process.argv.slice(2).join(' ') || '6 months';

try {
  // Set the system time forward without touching Windows or hardware clock
  const dateCommand = `sudo date -s "$(date -d "$(date) + ${timeParam}" "+%Y-%m-%d %H:%M:%S")"`;
  console.log(`Setting WSL system time forward by: ${timeParam}`);
  execSync(dateCommand, { shell: '/bin/bash', stdio: 'inherit' });
  
  // Display new time
  console.log('New WSL system time:');
  execSync('date', { stdio: 'inherit' });

//    // Update the hardware clock from the system time
//    console.log('Updating hardware clock...');
//    execSync('sudo hwclock --systohc', { stdio: 'inherit' });
  
  console.log('New hardware clock time:');
  execSync('sudo hwclock', { stdio: 'inherit' });

  console.log('WSL time adjusted successfully. Use npm run resetTime to sync back with Windows time.');
} catch (error) {
  console.error('Error adjusting time:', error.message);
  process.exit(1);
}

