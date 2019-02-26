chrome.runtime.sendMessage("get enabled, started, counter, itemsCount, sites and itemsInBag", function (response) {
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
            let itemsCount = parseInt(response[3]);
            let sites = response[4];
            let itemsInBag = response[5];
            chrome.runtime.sendMessage({
                from: 'counter',
                subject: 'increment'
            });
            if (counter < itemsCount) {
                div.innerHTML = "Next";
                window.open(sites[counter], '_self');
            } else if (counter == itemsCount) {
                if (itemsInBag > 0) {
                    div.innerHTML = "Checkout";
                    chrome.runtime.sendMessage({
                        from: 'javascript allowed',
                        value: true
                    });
                    window.open('https://www.supremenewyork.com/checkout', '_self');

                } else {
                    div.innerHTML = "The bag is empty";
                    chrome.runtime.sendMessage({
                        from: 'reset'
                    });
                }
            }
        }
    }
});