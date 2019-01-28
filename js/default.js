chrome.runtime.sendMessage("get enabled", function(response) {
    let enabled = response;
    if (enabled) {
        let div = document.createElement("div");
        div.setAttribute('class', 'whatItDoes');
        div.setAttribute("id", "whatItDoes");
        document.getElementsByTagName('body')[0].appendChild(div);
        div.innerHTML = "Bot enabled";
    }
});