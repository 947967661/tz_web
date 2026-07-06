const assert = require('assert');
const fs = require('fs');
const path = require('path');

const appVue = fs.readFileSync(path.join(__dirname, '../src/App.vue'), 'utf8');
const authCardVue = fs.readFileSync(path.join(__dirname, '../src/components/AuthCard.vue'), 'utf8');

assert(
	/height:\s*calc\(64px\s*\+\s*env\(safe-area-inset-bottom\)\)/.test(appVue),
	'footer should reserve safe-area height for mobile browser bottom bars'
);

assert(
	/padding-bottom:\s*calc\(80px\s*\+\s*env\(safe-area-inset-bottom\)\)/.test(appVue),
	'page content should leave space for the safe-area footer'
);

assert(
	/class="verify-img"/.test(authCardVue),
	'captcha images should use the shared verify-img class'
);

assert(
	/\.verify-img\s*\{[\s\S]*width:\s*96px;[\s\S]*object-fit:\s*contain;[\s\S]*flex-shrink:\s*0;/m.test(authCardVue),
	'captcha image should have stable width and contain scaling'
);

console.log('mobile compatibility styles test passed');
