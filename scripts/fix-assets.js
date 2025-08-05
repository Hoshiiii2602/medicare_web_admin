import fs from 'fs';
import path from 'path';

const adminIndexPath = path.join('dist', 'admin', 'index.html');
const serviceWorkerPath = path.join('dist', 'admin', 'firebase-messaging-sw.js');

try {
  // Check if the admin index.html file exists
  if (!fs.existsSync(adminIndexPath)) {
    console.error('❌ Admin index.html file not found at:', adminIndexPath);
    process.exit(1);
  }

  // Read and fix the admin index.html file
  let content = fs.readFileSync(adminIndexPath, 'utf8');
  
  // Replace /admin/assets/ with ./assets/
  const originalContent = content;
  content = content.replace(/\/admin\/assets\//g, './assets/');
  
  // Check if any replacements were made
  if (content === originalContent) {
    console.log('ℹ️  No asset path replacements needed in index.html');
  } else {
    // Write the modified content back
    fs.writeFileSync(adminIndexPath, content, 'utf8');
    console.log('✅ Successfully fixed asset paths in admin/index.html');
  }

  // Check if the service worker file exists
  if (!fs.existsSync(serviceWorkerPath)) {
    console.error('❌ Service worker file not found at:', serviceWorkerPath);
    process.exit(1);
  }

  // Read and fix the service worker file
  let swContent = fs.readFileSync(serviceWorkerPath, 'utf8');
  
  // Replace /logo.svg with ./logo.svg
  const originalSwContent = swContent;
  swContent = swContent.replace(/\/logo\.svg/g, './logo.svg');
  
  // Check if any replacements were made
  if (swContent === originalSwContent) {
    console.log('ℹ️  No logo path replacements needed in service worker');
  } else {
    // Write the modified content back
    fs.writeFileSync(serviceWorkerPath, swContent, 'utf8');
    console.log('✅ Successfully fixed logo path in service worker');
  }
} catch (error) {
  console.error('❌ Error fixing asset paths:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
} 