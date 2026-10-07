/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
/* eslint-disable no-console */
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const envFilePath = path.join(process.cwd(), 'public', '__env.js');

const env = {
  BASE_API_URL: process.env.BASE_API_URL,
};

if (!env.BASE_API_URL) {
  console.error('\x1b[31m Ошибка: BASE_API_URL не установлен \x1b[0m');
  process.exit(1);
}

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const data = 'window.env = ' + JSON.stringify(env, null, 2);
fs.writeFileSync(envFilePath, data);

console.log('\x1b[32m✓ Переменные записаны в', envFilePath, '\x1b[0m');
