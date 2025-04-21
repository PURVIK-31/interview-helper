#!/usr/bin/env node

console.log('📋 Checking deployment readiness...');

// Check for required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'FIREBASE_ADMIN_PRIVATE_KEY',
  'NEXT_PUBLIC_GEMINI_API_KEY'
];

// Attempt to load .env.local
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  console.warn('⚠️  Could not load dotenv, continuing anyway...');
}

const missing = [];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missing.push(envVar);
  }
}

if (missing.length > 0) {
  console.warn('⚠️  Missing environment variables:\n  - ' + missing.join('\n  - '));
  console.warn('❗ You will need to set these in your deployment environment');
} else {
  console.log('✅ All required environment variables are set');
}

// Check for the simplified Vapi endpoint
const fs = require('fs');
const path = require('path');

if (fs.existsSync(path.join(process.cwd(), 'app/api/vapi/generate/route.ts'))) {
  console.log('✅ Vapi endpoint is ready at /api/vapi/generate');
} else {
  console.error('❌ Vapi endpoint is missing at /api/vapi/generate');
  process.exit(1);
}

// Check for vercel.json
if (fs.existsSync(path.join(process.cwd(), 'vercel.json'))) {
  console.log('✅ Vercel configuration is present');
} else {
  console.warn('⚠️  vercel.json is missing - consider adding it for better deployment control');
}

console.log('✅ Deployment check completed');
console.log('📌 Remember to set all environment variables in your deployment platform');
console.log('🚀 Ready for deployment!'); 