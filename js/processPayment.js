chrome.runtime.sendMessage("get enabled, started, delay, process payment reload", function(response) {
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
			let processPaymentReload = response[3];
			if (!processPaymentReload) {
				chrome.runtime.sendMessage({
					from: 'process payment reload',
					value: true
				});
				// location.reload(true);
			}
			// document.querySelectorAll("label.has-checkbox.terms")[0].click();
            let delay = parseInt(response[2]);
            div.innerHTML = (delay / 1000) + " " + (delay == 1000 ? "second" : "seconds") + " delay..";
			let now = new Date();
			chrome.runtime.sendMessage({
				from: 'time',
				subject: 'set',
				value: getTimeToString() + "  -  Delay started"
			});
            setTimeout(function() {
				now = new Date();
				chrome.runtime.sendMessage({
					from: 'time',
					subject: 'set',
					value: getTimeToString() + "  -  Delay finished"
				});
				div.innerHTML = "Accept terms and process the payment";
                // document.querySelectorAll("input.button.checkout")[0].click();
				document.querySelectorAll("input.button.checkout")[0].onclick = function() {
					div.innerHTML = "Process payment..";
					now = new Date();
					chrome.runtime.sendMessage({
						from: 'time',
						subject: 'set',
						value: getTimeToString() + "  -  Finish"
					});
					chrome.runtime.sendMessage({
						from: 'reset'
					});
					chrome.runtime.sendMessage({
						from: 'started',
						value: false
					});
				}
            }, delay);
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