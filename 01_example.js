const { chromium } = require('playwright');
const { default: expect_2 } = require('expect');


const CONFIG = {
    baseUrl: 'https://google.com',
    companyName: 'Byndyusoft',
    citeURL: 'https://byndyusoft.com/',
    phoneNumber: '8 800 775-15-21', // not used because contats section doesn't contain any phone numbers
    mailBox: 'sales@byndyusoft.com'
  };

(async() => {
    const browser = await chromium.launch({ headless: false, slowMo: 50 })
    const context = await browser.newContext()
    const page = await context.newPage({timeout: 60000})
	
    // go to Google
    await page.goto(CONFIG.baseUrl)
    
    // type "Byndyusoft"
    await page.type('input[type="text"]', CONFIG.companyName)
    
    // get to results
    await Promise.all([
        page.waitForNavigation(),
        page.press('input[type="text"]', 'Enter')
    ])

    // get to result contains Byndyusoft URL (awaiting for complete loading)
    await Promise.all([
        page.waitForNavigation(),
        page.click(`a[href="${CONFIG.citeURL}"]`)
    ])  

    // check if header logo contains "Byndyusoft" text
    const logoText = await page.$eval('.header__logo', el => el.innerText)
    expect_2(logoText).toBe(CONFIG.companyName)

    // scroll to the bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // click on the yellow button
    await page.click('section >> span')

    // check if popup contains Byndyusoft email
    const email = await page.$eval('.popup-callback__footer-contacts', el => el.innerText)
    expect_2(email).toMatch(CONFIG.mailBox)

    // close modal window
    await page.click('.popup-callback__button-close')
    
    // close browser instance
    await browser.close()

})()
