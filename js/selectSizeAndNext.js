chrome.runtime.sendMessage("get enabled, started, counter, sizes, itemsCount and colorFounded", function (response) {
    let enabled = response[0];
    if (enabled) {
        let div = document.createElement("div");
        div.setAttribute('class', 'whatItDoes');
        div.setAttribute("id", "whatItDoes");
        document.getElementsByTagName('body')[0].appendChild(div);
        let started = response[1];
        if (!started) {
            div.innerHTML = "Bot enabled";
        } else {
            let counter = parseInt(response[2]);
            let itemsCount;
            let size = response[3][counter - 1];
            div.innerHTML = "Search size";

            if (size == null) {
                div.innerHTML = "Add items to search";
            } else {
                let sizeFounded = false;
                let sizeCombo = document.getElementById('size');
                let addRemoveButtonsFirstElement = document.getElementById('add-remove-buttons').childNodes[0];

                if (toCleanString(addRemoveButtonsFirstElement.textContent) == "sold out") {
                    div.innerHTML = "Sold out";
                    sizeFounded = false;
                } else if (sizeCombo.type == "hidden") {
                    div.innerHTML = "Without size";
                    sizeFounded = true;
                } else if (toCleanString(addRemoveButtonsFirstElement.value) == "add to basket") {
                    div.innerHTML = "There are some sizes";
                    for (let i = 0; i < sizeCombo.options.length; i++) {
                        let string = sizeCombo.options[i].text;
                        if (toCleanString(string) == toCleanString(size) || toCleanString(size) == "") {
                            div.innerHTML = "Size selected";
                            sizeCombo.selectedIndex = i;
                            sizeFounded = true;
                            let now = new Date();
                            chrome.runtime.sendMessage({
                                from: 'time',
                                subject: 'set',
                                value: getTimeToString() + "  -  Size selected"
                            });
                            break;
                        }
                    }
                }
                itemsCount = parseInt(response[4]);
                let colorFounded = response[5];
                if (!colorFounded) {
                    if (itemsCount != 1) {
                        div.innerHTML = "Color not founded";
                        window.open("http://www.supremenewyork.com/shop", '_self');
                    } else {
                        div.innerHTML = "Color not founded." + "<br>" + "Select the color, the size and press ENTER";
                        window.onkeyup = function (e) {
                            let key = e.keyCode ? e.keyCode : e.which;
                            if (key == 13) {
                                addToBasket();
                            }
                        }
                    }
                } else if (!sizeFounded) {
                    if (itemsCount != 1) {
                        div.innerHTML = "Size not founded";
                        window.open("http://www.supremenewyork.com/shop", '_self');
                    } else {
                        div.innerHTML = "Size not founded." + "<br>" + "Select the size and press ENTER";
                        window.onkeyup = function (e) {
                            let key = e.keyCode ? e.keyCode : e.which;
                            if (key == 13) {
                                addToBasket();
                            }
                        }
                    }
                } else {
                    addToBasket();
                }
            }

            function addToBasket() {
                if (counter <= itemsCount) {
                    div.innerHTML = "Add to basket";
                    chrome.runtime.sendMessage({
                        from: 'itemsInBag',
                        subject: 'increment'
                    });
                    let now = new Date();
                    chrome.runtime.sendMessage({
                        from: 'time',
                        subject: 'set',
                        value: getTimeToString() + "  -  Add to basket"
                    });
                    document.querySelectorAll("input.button")[0].click(); //add to basket
                }
            }

            function toCleanString(str) {
                return str.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
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
        }
    }
});