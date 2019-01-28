let start = new Date();
chrome.runtime.sendMessage("get enabled, counter, names and colors", function(response) {
    let enabled = response[0];
    if (enabled) {
        chrome.runtime.sendMessage({
            subject: 'soldout.css'
        });
        let div = document.createElement("div");
        div.setAttribute('class', 'whatItDoes');
        div.setAttribute("id", "whatItDoes");
        document.getElementsByTagName('body')[0].appendChild(div);
        let counter = parseInt(response[1]);
        let nameArray = response[2][counter - 1];
        let colorArray = response[3][counter - 1];
        if (nameArray != null) {
            search();
        } else {
            div.innerHTML = "Add items to search";
        }

        function search() {
            try {
                div.innerHTML = "Search item " + counter;
                let founded = false;
                let hiperlink;
                let allArticles = document.querySelectorAll("div.inner-article");
                for (let i = 0; i < allArticles.length; i++) {
                    hiperlink = allArticles[i].childNodes[0].href;
                    let nameText = allArticles[i].childNodes[1].textContent;
                    let colorText = allArticles[i].childNodes[2].textContent;
                    if (containsAll(nameText, nameArray) && containsOne(colorText, colorArray)) {
                        div.innerHTML = nameText + " " + colorText + " founded";
                        founded = true;
                        chrome.runtime.sendMessage({
                            from: 'colorFounded',
                            value: true
                        });
                        break;
                    }
                }
                if (!founded) {
                    for (let i = 0; i < allArticles.length; i++) {
                        hiperlink = allArticles[i].childNodes[0].href;
                        let nameText = allArticles[i].childNodes[1].textContent;
                        if (containsAll(nameText, nameArray)) {
                            div.innerHTML = nameText + " founded";
                            founded = true;
                            chrome.runtime.sendMessage({
                                from: 'colorFounded',
                                value: false
                            });
                            break;
                        }
                    }
                }
                if (founded) {
                    chrome.runtime.sendMessage({
                        from: 'started',
                        value: true
                    });
                    chrome.runtime.sendMessage({
                        from: 'time',
                        subject: 'set',
                        value: getTimeToString(start) + "  -  Started" //time when start searching and not when is founded
                    });
                    let now = new Date();
                    chrome.runtime.sendMessage({
                        from: 'time',
                        subject: 'set',
                        value: getTimeToString() + "  -  Item " + counter + " founded"
                    });
                    if (counter == 1) {
                        chrome.runtime.sendMessage({
                            from: 'autoRefresh',
                            subject: 'set',
                            value: false
                        });
                    }
                    window.open(hiperlink, '_self');
                } else {
                    div.innerHTML = "Item " + counter + " not founded";
                    if (counter == 1) {
                        chrome.runtime.sendMessage("get autoRefresh", function(response) {
                            let autoRefresh = response;
                            if (!autoRefresh) {
                                chrome.runtime.sendMessage({
                                    from: 'autoRefresh',
                                    subject: 'confirm'
                                });
                            } else {
                                div.innerHTML = "Refresh";
                                document.querySelectorAll("a.current")[0].click();
                            }
                        });
                    }
                }
            } catch (err) {
                div.innerHTML = "SupremeBot can't find items in sections \"all\" and \"new\".<br>Go to the section where the first item on the list will be.";
            }
        }

        function containsAll(str, subStrs) {
            for (let i = 0; i < subStrs.length; i++) {
                if (toCleanString(str).indexOf(toCleanString(subStrs[i])) == -1) {
                    return false;
                }
            }
            return true;
        }

        function containsOne(str, subStrs) {
            for (let i = 0; i < subStrs.length; i++) {
                if (toCleanString(str).indexOf(toCleanString(subStrs[i])) != -1) {
                    return true;
                }
            }
            return false;
        }

        function toCleanString(str) {
            return str.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
        }
		
		function getTimeToString(time) {
			if(time == null) {
				time = new Date();
			}
			let strHours = "" + time.getHours();
			let strMinutes = "" + time.getMinutes();
			let strSeconds = "" + time.getSeconds();
			let strMilliseconds = "" + time.getMilliseconds();
			let path = "00"
			let pathMill = "000";
			return path.substring(0, path.length - strHours.length) + strHours + ":" 
			+ path.substring(0, path.length - strMinutes.length) + strMinutes + ":" 
			+ path.substring(0, path.length - strSeconds.length) + strSeconds + "."
			+ pathMill.substring(0, pathMill.length - strMilliseconds.length) + strMilliseconds;
		}
    }
});