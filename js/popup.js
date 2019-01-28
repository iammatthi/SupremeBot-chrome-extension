chrome.runtime.sendMessage("get isActive", function(response) {
    if (response) {
        let typesList = [
            ["jackets", "Jackets"],
            ["shirts", "Shirts"],
            ["tops_sweaters", "Tops/sweaters"],
            ["sweatshirts", "Sweatshirts"],
            ["pants", "Pants"],
            ["shorts", "Shorts"],
            ["t-shirts", "T-shirts"],
            ["hats", "Hats"],
            ["bags", "Bags"],
            ["accessories", "Accessories"],
            ["shoes", "Shoes"],
            ["skate", "Skate"]
        ];
        let sizesList = [
            [], //default (created below) 
            [ //jackets
                ["small", "Small"],
                ["medium", "Medium"],
                ["large", "Large"],
                ["xlarge", "XLarge"]
            ],
            [ //shirts
                ["small", "Small"],
                ["medium", "Medium"],
                ["large", "Large"],
                ["xlarge", "XLarge"]
            ],
            [ //tops/sweaters
                ["small", "Small"],
                ["medium", "Medium"],
                ["large", "Large"],
                ["xlarge", "XLarge"]
            ],
            [ //sweatshirts
                ["small", "Small"],
                ["medium", "Medium"],
                ["large", "Large"],
                ["xlarge", "XLarge"]
            ],
            [ //pants
                ["small", "Small"],
                ["medium", "Medium"],
                ["large", "Large"],
                ["xlarge", "XLarge"],
                ["30", "30"],
                ["32", "32"],
                ["34", "34"]
            ],
            [ //shorts
                ["small", "Small"],
                ["medium", "Medium"],
                ["large", "Large"],
                ["xlarge", "XLarge"]
            ],
            [ //t-shirts
                ["small", "Small"],
                ["medium", "Medium"],
                ["large", "Large"],
                ["xlarge", "XLarge"]
            ],
            [ //hats
                ["7 1/4", "7 1/4"],
                ["7 3/8", "7 3/8"],
                ["7 1/2", "7 1/2"],
                ["7 5/8", "7 5/8"],
                ["7 3/4", "7 3/4"],
                ["8", "8"]
            ],
            [ //bags
                []
            ],
            [ //accessories
                ["small", "Small"],
                ["medium", "Medium"],
                ["large", "Large"],
                ["xlarge", "XLarge"],
                ["S/M", "S/M (belt)"],
                ["L/XL", "L/XL (belt)"],
            ],
            [ //shoes
                ["8", "8"],
                ["8.5", "8.5"],
                ["9", "9"],
                ["9.5", "9.5"],
                ["10", "10"],
                ["10.5", "10.5"],
                ["11", "11"],
                ["11.5", "11.5"],
                ["12", "12"],
                ["13", "13"],
            ],
            [ //skate
                []
            ]
        ];

        chrome.runtime.sendMessage("get itemsCount, names, colors, types, sizes, delay and enabled", function(response) {
            createMain();
            let itemsCount = parseInt(response[0]);
            for (let i = 0; i < itemsCount; i++) {
                createNewItem();
            }
            let names = response[1];
            let colors = response[2];
            let types = response[3];
            let sizes = response[4];
            let delay = response[5];
            let enabled = response[6];
            let inputNames = document.querySelectorAll("input.name");
            let inputColors = document.querySelectorAll("input.color");
            let selectTypes = document.querySelectorAll("select.type");
            let selectSizes = document.querySelectorAll("select.size");
            let labelSize = document.querySelectorAll("label.size");

            for (let i = 0; i < itemsCount; i++) {
                inputNames[i].value = names[i];
                inputColors[i].value = colors[i];
                setSelectedValue(selectTypes[i], types[i]);
                sizesSelect(selectTypes[i], selectSizes[i], labelSize[i]);
                setSelectedValue(selectSizes[i], sizes[i]);
            }
            let inputDelay = document.querySelectorAll("input.delay")[0];
            inputDelay.value = delay;

            let inputCheckbox = document.querySelectorAll("input.checkboxEnabledDisabled")[0];
            inputCheckbox.checked = enabled;
            let event = new Event('change');
            inputCheckbox.dispatchEvent(event);

            document.getElementById("add").onclick = function() {
                createNewItem();
            }

            document.getElementById("save").onclick = function() {
                /******* names *******/
                let names = document.querySelectorAll("input.name");
                let result = [];
                let allEntered = true;
                for (let i = 0; i < names.length; i++) {
                    if (names[i].value == "" && allEntered) {
                        allEntered = false;
                    }
                    result.push(names[i].value);
                }
                names = result;
                /********************/

                /******* colors *******/
                let colors = document.querySelectorAll("input.color");
                result = [];
                for (let i = 0; i < colors.length; i++) {
                    if (colors[i].value == "" && allEntered) {
                        allEntered = false;
                    }
                    result.push(colors[i].value);
                }
                colors = result;
                /*********************/

                /******* types *******/
                let types = document.querySelectorAll("select.type");
                result = [];
                for (let i = 0; i < types.length; i++) {
                    if (types[i].value == "" && allEntered) {
                        allEntered = false;
                        result.push("");
                    } else {
                        result.push(types[i].value);
                    }
                }
                types = result;
                /********************/

                /******* sizes *******/
                let sizes = document.querySelectorAll("select.size");
                result = [];
                for (let i = 0; i < sizes.length; i++) {
                    result.push(sizes[i].value);
                }
                sizes = result;
                /********************/

                /******* delay *******/
                let delay = document.querySelectorAll("input.delay")[0].value;
                /********************/

                /******* send to background *******/
                chrome.runtime.sendMessage({
                    msg: "save",
                    save: allEntered,
                    value: [names, colors, types, sizes, delay]
                }, function(response) {
                    if (response) {
                        document.getElementById("result").textContent = "Saved";
                        setTimeout(function() {
                            document.getElementById("result").textContent = "";
                        }, 2000);
                    }
                });
                /*********************************/

            }
        });

        function createMain() {
            /*********  main  *********/
            let mainDiv = document.createElement("div");
            mainDiv.id = "mainDiv";
            document.body.appendChild(mainDiv);
            /*************************/

            /*********  add  *********/
            let btnAdd = document.createElement("button");
            btnAdd.id = "add";
            btnAdd.innerHTML = "Add new item";
            btnAdd.onmouseover = function() {
                btnAdd.style.cursor = "pointer";
            }
            document.body.appendChild(btnAdd);
            /*************************/

            /*********  br  *********/
            let br = document.createElement("br");
            document.body.appendChild(br);
            br = document.createElement("br");
            document.body.appendChild(br);
            /*************************/

            /*********  delay  *********/
            let label = document.createElement("label");
            label.className = "marginTop";
            let span = document.createElement("span");
            span.textContent = "Delay: ";
            let input = document.createElement("input");
            input.className = "delay";
            input.type = "number";
            input.step = "100";
            input.min = "0";
            input.onkeydown = function() {
                return false;
            };
            input.onmouseover = function() {
                input.style.cursor = "default";
            }
            label.appendChild(span);
            label.appendChild(input);
            document.body.appendChild(label);
            /*************************/

            /*********  save  *********/
            let btnSave = document.createElement("button");
            btnSave.id = "save";
            btnSave.innerHTML = "Save";
            btnSave.onmouseover = function() {
                btnSave.style.cursor = "pointer";
            }
            document.body.appendChild(btnSave);
            /*************************/

            /*********  result  *********/
            let spanResult = document.createElement("span");
            spanResult.id = "result";
            spanResult.style.color = "green";
            document.body.appendChild(spanResult);
            /*************************/

            /*********  enabled/disabled checkbox  *********/
            label = document.createElement("label");
            label.className = "marginTop checkbox";
            let checkboxEnabledDisabled = document.createElement('input');
            checkboxEnabledDisabled.id = "checkboxEnabledDisabled"
            checkboxEnabledDisabled.type = "checkbox";
            checkboxEnabledDisabled.name = "checkboxEnabledDisabled";
            checkboxEnabledDisabled.className = "checkboxEnabledDisabled";
            checkboxEnabledDisabled.onchange = function() {
                let span = document.getElementById("spanEnabledDisabled");
                chrome.runtime.sendMessage({
                    from: 'enabled',
                    value: checkboxEnabledDisabled.checked
                });

                if (checkboxEnabledDisabled.checked) {
                    span.textContent = "Enabled";
                } else {
                    span.textContent = "Disabled";
                }
            };
            checkboxEnabledDisabled.onmouseover = function() {
                checkboxEnabledDisabled.style.cursor = "pointer";
            }
            let spanEnabledDisabled = document.createElement("span");
            spanEnabledDisabled.id = "spanEnabledDisabled";
            spanEnabledDisabled.className = "spanEnabledDisabled";

            label.appendChild(checkboxEnabledDisabled);
            label.appendChild(spanEnabledDisabled);

            document.body.appendChild(label);
            /**********************************************/

        }

        function createNewItem() {
            /*********  newItem  *********/
            let newItem = document.createElement("div");
            newItem.id = "newItem";
            /*******************************/


            /*********  close  *********/
            let div = document.createElement("div");
            div.innerHTML = "x";
            div.className = "close";
            div.onmouseover = function() {
                div.style.cursor = "pointer";
            }
            div.onclick = function() {
                document.getElementById("mainDiv").removeChild(newItem);
            }
            newItem.appendChild(div);
            /*************************/

            /*********  name  *********/
            let label = document.createElement("label");
            label.className = "nameLabel";
            let span = document.createElement("span");
            span.textContent = "Name: ";
            let input = document.createElement("input");
            input.className = "name";
            input.type = "text";
            input.value = "";
            label.appendChild(span);
            label.appendChild(input);
            newItem.appendChild(label);
            /*************************/

            /*********  color  *********/
            label = document.createElement("label");
            label.className = "marginTop";
            span = document.createElement("span");
            span.textContent = "Color: ";
            input = document.createElement("input");
            input.className = "color";
            input.type = "text";
            input.value = "";
            label.appendChild(span);
            label.appendChild(input);
            newItem.appendChild(label);
            /*************************/

            /*********  type  *********/
            label = document.createElement("label");
            label.className = "marginTop";
            span = document.createElement("span");
            span.textContent = "Type: ";
            let selType = document.createElement('select');
            selType.id = "type";
            selType.onchange = function() {
                sizesSelect(selType, selSize, labelSize);
            }
            selType.className = "type";
            let opt = document.createElement('option');
            opt.innerHTML = "-- Select an option --";
            opt.value = "";
            opt.selected = "selected";
            opt.disabled = "disabled";
            selType.appendChild(opt);
            for (i = 0; i < typesList.length; i++) {
                let opt = document.createElement('option');
                opt.value = typesList[i][0];
                opt.innerHTML = typesList[i][1];
                selType.appendChild(opt);
            }
            selType.onmouseover = function() {
                selType.style.cursor = "pointer";
            }
            label.appendChild(span);
            label.appendChild(selType);
            newItem.appendChild(label);
            /**************************/

            /*********  size  *********/
            labelSize = document.createElement("label");
            labelSize.className = "marginTop size";
            span = document.createElement("span");
            span.textContent = "Size: ";
            let selSize = document.createElement('select');
            selSize.className = "size";
            labelSize.style.display = "none";
            opt = document.createElement('option');
            opt.innerHTML = "-- Any size --";
            opt.value = "";
            opt.selected = "selected";
            selSize.appendChild(opt);
            selSize.onmouseover = function() {
                selSize.style.cursor = "pointer";
            }
            labelSize.appendChild(span);
            labelSize.appendChild(selSize);
            newItem.appendChild(labelSize);
            /**************************/

            /*********  line  *********/
            let hr = document.createElement("hr");
            newItem.appendChild(hr);
            /**************************/

            document.getElementById("mainDiv").appendChild(newItem);
        }

        function setSelectedValue(selectObj, valueToSet) {
            for (let i = 0; i < selectObj.options.length; i++) {
                if (selectObj.options[i].value == valueToSet) {
                    selectObj.options[i].selected = true;
                    return;
                }
            }
        }

        function removeAll(sel) {
            while (sel.options.length != 1) {
                sel.remove(1);
            }
            sel.selectedIndex = 0;
        }

        function sizesSelect(selType, selSize, labelSize) {
            let typeSelectedIndex = selType.selectedIndex;
            removeAll(selSize);
            for (i = 0; i < sizesList[typeSelectedIndex].length; i++) {
                if (sizesList[typeSelectedIndex][i].length > 0) {
                    let opt = document.createElement('option');
                    opt.value = sizesList[typeSelectedIndex][i][0];
                    opt.innerHTML = sizesList[typeSelectedIndex][i][1];
                    selSize.appendChild(opt);
                }
            }
            if (typeSelectedIndex > 0) {
                labelSize.style.display = "block";
            }
        }
    } else {
        window.close();
    }
});