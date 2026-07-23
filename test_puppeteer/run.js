const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const logs = [];
    const errors = [];
    page.on('console', msg => logs.push(`[CONSOLE ${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => errors.push(`[PAGEERROR] ${err.message}`));
    page.on('requestfailed', req => errors.push(`[REQFAILED] ${req.url()} - ${req.failure()?.errorText}`));

    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

    await page.type('input[type="email"]', 'admin@docu.ai');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for either the dashboard url or some error
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(e => logs.push('waitfornav timeout'));
    await new Promise(r => setTimeout(r, 2000));

    console.log("URL is:", page.url());
    console.log("Errors:");
    console.log(errors.join('\n'));
    console.log("Console Logs length:", logs.length);
    console.log("Console Logs:", logs.slice(-10).join('\n'));

    await browser.close();
})();
