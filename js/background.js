let counter = 1;
let names = [];
let colors = [];
let types = [];
let sizes = [];
let defaultLink = "";
let delay = 3000; //default
let deadline;
let times = [];
let itemsInBag = 0;
let colorFounded = false;
let enabled = true;
let started = false;
let autoRefresh = false;
let processPaymentReload = false;

isActive().then(function (response) {
    if (response) {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request == "get enabled, started, counter, itemsCount, sites and itemsInBag") {
                sendResponse([enabled, started, counter, names.length, getSites(types), itemsInBag]);
            } else if (request == "get enabled, started, counter, sizes, itemsCount and colorFounded") {
                sendResponse([enabled, started, counter, sizes, names.length, colorFounded]);
            } else if (request == "get enabled, counter, names and colors") {
                sendResponse([enabled, counter, names, colors]);
            } else if (request == "get enabled, started, delay, process payment reload") {
                sendResponse([enabled, started, delay, processPaymentReload]);
            } else if (request == "get autoRefresh") {
                sendResponse(autoRefresh);
            } else if (request == "get enabled") {
                sendResponse(enabled);
            } else if (request == "get isActive") {
                isActive().then(function (response) {
                    sendResponse(response);
                });
                return true; //this will keep the message channel open to the other end until sendResponse is called
            } else if (request == "get itemsCount, names, colors, types, sizes, delay and enabled") {
                sendResponse([names.length, names, colors, types, sizes, delay, enabled]);
            } else if (request.msg == "save") {
                isActive().then(function (response) {
                    if (response) {
                        let resp = false;
                        if (request.save || (!request.save && confirm("There are fields not filled in, do you want to save anyway?"))) {
                            names = splitArray(request.value[0]);
                            colors = splitArray(request.value[1]);
                            types = request.value[2];
                            sizes = request.value[3];
                            delay = request.value[4];
                            resetvars();
                            resp = true;
                            let now = new Date();
                            console.log(getTimeToString() + "  -  Saved");
                        }
                        sendResponse(resp);
                    }
                });
                return true; //this will keep the message channel open to the other end until sendResponse is called
            } else if (request.from === 'colorFounded') {
                colorFounded = request.value;
            } else if (request.from === 'javascript allowed') {
                setJavascriptAllowed(request.value)
            } else if (request.from === 'process payment reload') {
                processPaymentReload = request.value;
            } else if ((request.from === 'counter') && (request.subject === 'increment')) {
                counter++;
            } else if (request.from === 'reset') {
                resetvars();
            } else if ((request.from === 'itemsInBag') && (request.subject === 'increment')) {
                itemsInBag++;
            } else if (request.from === 'started') {
                started = request.value;
            } else if ((request.from === 'autoRefresh') && (request.subject === 'set')) {
                autoRefresh = request.value;
            } else if ((request.from === 'autoRefresh') && (request.subject === 'confirm')) {
                autoRefresh = confirm("Do you want to start auto-refreshing the page?");
                if (autoRefresh) {
                    chrome.tabs.query({
                        active: true,
                        currentWindow: true
                    }, function (tabs) {
                        chrome.tabs.update(tabs[0].id, {
                            url: tabs[0].url
                        });
                    });
                    let now = new Date();
                    console.log(getTimeToString() + "  -  Start auto-refreshing");
                }
            } else if (request.from === 'enabled') {
                enabled = request.value;
                isActive().then(function (response) {
                    if (response) {
                        if (!enabled) {
                            resetvars();
                        }
                    }
                });
            } else if (request.subject === 'soldout.css') {
                chrome.tabs.insertCSS({
                    file: "./css/soldout.css"
                });
            } else if ((request.from === 'time') && (request.subject === 'set')) {
                times.push(request.value);
                console.log(request.value + "\n");
            }
        });
    }
});

function resetvars() {
    counter = 1;
    itemsInBag = 0;
    times = [];
    colorFounded = false;
    started = false;
    autoRefresh = false;
    processPaymentReload = false;
}

function getSites(types) {
    let result = [];
    for (let i = 0; i < types.length; i++) {
        result.push(defaultLink + types[i]);
    }
    return result;
}

function isActive() {
    let promise = new Promise(function (resolve, reject) {
        chrome.cookies.get({
            "url": 'https://www.supremenewyork.com/',
            "name": 'sbauthentication'
        }, function (cookie) {
            if (cookie !== null && cookie.value === "premiumuser") {
                deadline = 1735686000000; //01.01.2025 00:00:00
            } else {
                deadline = 1536836400000;
            }
            if (new Date().getTime() < deadline) {
                if (enabled) {
                    setJavascriptAllowed(false);
                } else {
                    setJavascriptAllowed(true);
                }
                resolve(true);
            } else {
                enabled = false;
                if (confirm("SupremeBot expired." + "\n" + "If you want to contact the SupremeBot developer to request a renewal, click OK.")) {
                    window.open('mailto:matthi.berchtold@gmail.com?subject=SupremeBot renewal&body=I want to renewal my bot.');
                }
                chrome.management.setEnabled(chrome.i18n.getMessage("@@extension_id"), false); //disable itself
                resolve(false);
            }
        });
    });
    return promise;
}

function setJavascriptAllowed(allowed) {
    console.log(allowed);
    if (allowed) {
        chrome.contentSettings['javascript'].set({
            primaryPattern: 'https://www.supremenewyork.com/*',
            setting: "allow"
        });
    } else {
        chrome.contentSettings['javascript'].set({
            primaryPattern: 'https://www.supremenewyork.com/*',
            setting: "block"
        });
    }
}

function splitArray(array) { //split when ","
    let result = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i].indexOf(",") == -1) {
            let a = [];
            a.push(array[i]);
            result.push(a);
        } else {
            result.push(array[i].split(','));
        }
    }
    return result;
}

function getTimeToString(time) {
    if (time == null) {
        time = new Date();
    }
    let strHours = "" + time.getHours();
    let strMinutes = "" + time.getMinutes();
    let strSeconds = "" + time.getSeconds();
    let strMilliseconds = "" + time.getMilliseconds();
    let path = "00"
    let pathMill = "000";
    return path.substring(0, path.length - strHours.length) + strHours + ":" +
        path.substring(0, path.length - strMinutes.length) + strMinutes + ":" +
        path.substring(0, path.length - strSeconds.length) + strSeconds + "." +
        pathMill.substring(0, pathMill.length - strMilliseconds.length) + strMilliseconds;
}