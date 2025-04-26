// resetTime.js - Reset WSL2 time to match Windows host
const { execSync } = require('child_process');

try {
  console.log('Resetting WSL2 time to match Windows host time...');
  
  // First, sync the hardware clock from the system
  execSync('sudo hwclock --hctosys', { stdio: 'inherit' });
  
  // For WSL2, we can also try to sync from the Windows host directly
  try {
    console.log('Attempting to sync with Windows host time...');
    execSync('sudo hwclock --systz', { stdio: 'inherit' });
  } catch (e) {
    console.log('Alternative sync method not available, continuing with standard reset');
  }
  
  // Display current times to confirm
  console.log('New system time:');
  execSync('date', { stdio: 'inherit' });
  console.log('Hardware clock time:');
  execSync('sudo hwclock', { stdio: 'inherit' });
  
  console.log('Time reset successfully');
} catch (error) {
  console.error('Error resetting time:', error.message);
  process.exit(1);
}