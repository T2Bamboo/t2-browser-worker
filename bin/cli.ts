#!/usr/bin/env node

import { installBrowser } from '../src/install.js';

const command = process.argv[2];

if (command === 'install') {
    installBrowser().catch(err => console.error('❌ Lỗi:', err));
} else {
    console.log('❌ Invalid command. Use: yarn browser-worker install');
}
