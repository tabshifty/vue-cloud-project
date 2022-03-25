const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const store = require('./database')
let session = store.openSession();

const Record = require('./models/western');

function fetchThreadFromDatabase() {
    return session.query({ collection: `Threads` }).whereEquals('is_crawled', false).all()
}

(async() => {
    const list = await fetchThreadFromDatabase();
    let length = list.length - 1;
    const browser = await puppeteer.launch({
        executablePath: 'C:/Program Files/Google/Chrome/Application/Chrome.exe',
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://proxyrarbg.org');
    schedule.scheduleJob("*/3 * * * *", async function() {
        if (length < 0) {
            process.exit(-1)
        }
        session = store.openSession();
        const lista = list[length];
        const record = new Record();
        await page.goto(`https://proxyrarbg.org${lista.uri}`);
        const magnet = await page.$eval('td.lista a[href*=magnet]', a => {
            return a.getAttribute('href')
        })
        const [poster, title] = await page.$eval('td.lista img[alt*="."]', img => {
            return [img.getAttribute('src'), img.getAttribute('alt')]
        })
        const description = await page.$eval('#description img', img => {
            return img.getAttribute('src')
        })
        const names = await page.$$eval('td.lista span', spans => spans.map(span => span.innerText))
        record.title = title
        record.magnet = magnet
        record.actor = names
        record.imgUrls.push(...[poster, description])
        console.log(record)
        lista.is_crawled = true;
        length--;

        await session.store(record, 'records/western')
        await session.saveChanges()
        await session.dispose()
    })

})()