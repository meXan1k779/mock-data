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

// Прототип работает на моковом бэкенде (mocks/backend) — BASE_API_URL больше
// не обязателен, поэтому без него только предупреждаем.
if (!env.BASE_API_URL) {
  console.warn('\x1b[33m BASE_API_URL не установлен — не используется в прототипе \x1b[0m');
}

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const data = 'window.env = ' + JSON.stringify(env, null, 2);
fs.writeFileSync(envFilePath, data);

console.log('\x1b[32m✓ Переменные записаны в', envFilePath, '\x1b[0m');
