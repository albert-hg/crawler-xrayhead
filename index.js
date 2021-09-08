const xrayheadURL = 'http://xrayhead.com/';
const nameIncludes = 'Atlas';

/* 
    if keep 'targets' an empty array '[]', the crawler will parse the name and link automatically, following below:

    var targets = [];

    or you can set the name and link manually for the crawler, like:

    var targets = [{"name":"Atlas-Ankle","link":"http://xrayhead.com/XXXXXXXX"}];
*/
var targets = [];

var webdriver = require('selenium-webdriver');
var driver

const fs = require('fs'); 
const fsp = fs.promises;

const waitInSeconds = async (second) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, second * 1000);
    });
}

const openCrawlerWeb = async (_url) => {
    let chromeCapabilities = webdriver.Capabilities.chrome();
    let chromeOptions = {
        'args': ['--start-maximized']
    };
    chromeCapabilities.set('goog:chromeOptions', chromeOptions);
    let _driver = await new webdriver.Builder().forBrowser("chrome").withCapabilities(chromeCapabilities).build();
    driver = _driver;
    setDriverURL(_url);
}

const setDriverURL = async (_url) => {
    driver.get(_url);
}

const getTargetUrlAndProjectName = async () => {
    let tagA = await driver.findElements(webdriver.withTagName('a'));
    let filteredTagA = []
    await (async () => {
        for (webElement of tagA) {
            let _name = await webElement.getAttribute('innerText');
            _name = (_name + '').replace(/: /g, '-')
            if (_name.includes(nameIncludes)) {
                let _link = await webElement.getAttribute('onclick');
                _link = (_link + '').match(new RegExp(/\('(.*\.php.*)','/))[1];
                filteredTagA.push({
                    name: _name,
                    link: xrayheadURL + _link
                });
            }
        }
    })();
    return filteredTagA;
}

const getIntoTargetAndSaveScreenhot = async (_target) => {
    await setDriverURL(_target.link);
    await waitInSeconds(10);
    let _mes = ['sag', 'cor', 'ax'];
    for (_me of _mes) {
        await changeme(_me);
        await processAutoWheelAndScreenshotFromFirstToLast(_target, _me);
    }
}

const processAutoWheelAndScreenshotFromFirstToLast = async (_target, _me) => {
    await scrollWheelToTop();
    let _preImgPath = undefined;
    let _nowImgPath = await getNowImageSrcPath();
    let _index = 0;
    while (_preImgPath != _nowImgPath) {
        await takeScreenshot(driver, `output/${_target.name}/${_me}`, `/${++_index}.png`);
        console.log('file path: ' + `output/${_target.name}/${_me}/${_index}.png`);
        await scrollDown();
        await waitInSeconds(0.5);
        _preImgPath = _nowImgPath;
        _nowImgPath = await getNowImageSrcPath();
    }
}

const getNowImageSrcPath = async () => {
    let _imageWebElement = await driver.findElement(webdriver.By.id('imaged'));
    let _imageSrc = await _imageWebElement.getAttribute('src');
    return _imageSrc;
}

const scrollWheelToTop = async () => {
    let _nowImgPath = await getNowImageSrcPath();
    await scrollUp();
    let _nxtImgPath = await getNowImageSrcPath();
    if (_nowImgPath == _nxtImgPath) {
        console.log('now has scrolled on the top, starting taking screenshot.')
        return;
    } else {
        await waitInSeconds(0.1);
        await scrollWheelToTop();
    }
}

const scrollUp = async () => {
    await wheel(-1);
}

const scrollDown = async () => {
    await wheel(1);
}

const wheel = async (_detail) => {
    await driver.executeScript('wheel({detail: ' + _detail + '})');
    await waitInSeconds(1);
}

const changeme = async (_me) => {
    await driver.executeScript('changeme(\''+ _me + '\')');
    await waitInSeconds(2);
}

const takeScreenshot = async (_driver, _folder, _filename) => {
    if (!fs.existsSync(_folder)){
        fs.mkdirSync(_folder, { recursive: true });
    }
    let _image = await _driver.takeScreenshot()
    await fsp.writeFile(_folder + '/' + _filename, _image, 'base64')
}

const consoleMsg = (_msg) => {
    console.log('--------------------------------------------');
    console.log(_msg)
}

(async () => {
    await openCrawlerWeb(xrayheadURL);
    await waitInSeconds(3);
    if (targets.length == 0) {
        targets = await getTargetUrlAndProjectName();
    }
    consoleMsg('here is the download list: \n' + JSON.stringify(targets));
    for (target of targets) {
        consoleMsg('now is preparing to download: ' + JSON.stringify(target));
        await waitInSeconds(1);
        await getIntoTargetAndSaveScreenhot(target);
    }
    await driver.quit();
})()
