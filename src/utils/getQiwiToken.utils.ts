import { random } from 'user-agents';
import puppeteer from 'puppeteer-extra';
import { executablePath } from 'puppeteer';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

const getQiwiToken = async (
  userPhone: string,
  userPassword: string,
): Promise<string | null> => {
  puppeteer.use(stealthPlugin());

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--enable-automation',
      '--disable-dev-shm-usage',
      '--lang=ru',
      '--no-first-run',
      '--window-size=1366,768',
    ],
    headless: true,
    ignoreHTTPSErrors: true,
    executablePath: executablePath(),
    slowMo: 15,
    defaultViewport: {
      width: 1366,
      height: 768,
    },
  });

  try {
    const page = (await browser.pages())[0];

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    const pagesUserAgent = random().toString();

    await page.setUserAgent(pagesUserAgent);

    await page.goto(`https://qiwi.com/`, {
      waitUntil: ['domcontentloaded', 'load', 'networkidle2', 'networkidle0'],
      timeout: 60000,
    });

    await page.waitForSelector('button', {
      timeout: 30000,
      visible: true,
    });

    await page.evaluate(() => {
      document.querySelectorAll('button')[1].click();
    });

    await page.waitForSelector('input[name="username"]', {
      timeout: 30000,
      visible: true,
    });

    await page.waitForTimeout(2000);

    await page.type('input[name="username"]', userPhone.slice(1), {
      delay: 20,
    });

    await page.type('input[name="password"]', userPassword, {
      delay: 20,
    });

    await page.keyboard.press('Enter');

    await page.waitForTimeout(4000);

    let attempts = 0;
    let phone = null;

    while (true) {
      if (attempts > 30) break;

      const url = page.url();

      if (url.includes('main')) {
        try {
          phone = await page.evaluate(() => {
            return document
              .querySelectorAll('.account-info-number-43')[0]
              .innerHTML.replaceAll('&nbsp;', '')
              .replaceAll('‑', '')
              .replace('+', '');
          });
        } catch {
          try {
            phone = await page.evaluate(() => {
              return document
                .querySelectorAll('.account-info-number-41')[0]
                .innerHTML.replaceAll('&nbsp;', '')
                .replaceAll('‑', '')
                .replace('+', '');
            });
          } catch {}
        }

        if (phone) break;
      }

      attempts += 1;

      await page.waitForTimeout(1000);
    }

    if (!phone) {
      try {
        await browser.close();
      } catch {}

      return null;
    }

    const token = await page.evaluate(
      () => JSON.parse(window.localStorage['oauth-token-head'])['access_token'],
    );

    attempts = 0;

    let tokenTailWebQw = null;

    while (true) {
      if (attempts > 20) break;

      try {
        const cookies = await page.cookies();

        tokenTailWebQw = cookies.find(
          (cookie) => cookie.name === 'token-tail-web-qw',
        )?.value;
      } catch {}

      if (tokenTailWebQw) break;

      attempts += 1;

      await page.waitForTimeout(1000);
    }

    if (!tokenTailWebQw) {
      try {
        await browser.close();
      } catch {}

      return null;
    }

    try {
      await browser.close();
    } catch {}

    return `${token}${tokenTailWebQw}`;
  } catch (e) {
    console.log(e);
    try {
      await browser.close();
    } catch {}

    throw e;
  }
};

export default getQiwiToken;
