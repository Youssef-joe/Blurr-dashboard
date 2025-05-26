const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting database setup...');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from .env.example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created');
} else {
  console.log('ℹ️ .env file already exists');
}

// Install dependencies if node_modules doesn't exist
if (!fs.existsSync(path.join(__dirname, '../node_modules'))) {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} else {
  console.log('ℹ️ Dependencies already installed');
}

// Generate Prisma client
console.log('🔨 Generating Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit' });
console.log('✅ Prisma client generated');

// Apply database migrations
console.log('🔄 Applying database migrations...');
try {
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('✅ Database migrations applied');
} catch (error) {
  console.error('❌ Error applying migrations:', error);
  process.exit(1);
}

console.log('✨ Database setup completed successfully!');
console.log('\n🚀 Start the development server with:');
console.log('   npm run dev');
