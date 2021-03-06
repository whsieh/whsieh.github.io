IDENTIFIER_TYPE_PREFIX = "clipboard-item/";

function appendConsole(sectionID, message) {
    const textarea = document.querySelector(`section#${sectionID} > textarea.console`);
    console.assert(textarea);
    if (textarea)
        textarea.value += (message + "\n");
}

function clearConsole(sectionID) {
    const textarea = document.querySelector(`section#${sectionID} > textarea.console`);
    console.assert(textarea);
    if (textarea)
        textarea.value = "";
}

function createItemPill(identifier) {
    const span = document.createElement("span");
    span.textContent = identifier;
    span.draggable = true;
    span.classList.add("item");
    span.addEventListener("dragstart", event => event.dataTransfer.setData(IDENTIFIER_TYPE_PREFIX + identifier, "true"));
    span.addEventListener("click", event => revealItem(identifier, event.pageX, event.pageY));
    const item = getItem(identifier);
    if (item)
        span.setAttribute("title", `${item.types.length} type(s)`);
    return span;
}

function makeTableRow(cellContents) {
    const row = document.createElement("tr");
    cellContents.forEach(innerHTML => {
        const data = document.createElement("td");
        if (innerHTML instanceof Promise) {
            innerHTML.then(markup => data.innerHTML = markup);
            data.innerHTML = "…";
        } else
            data.innerHTML = innerHTML;
        row.appendChild(data);
    });
    return row;
}

async function revealItem(identifier, x, y) {
    const item = getItem(identifier);
    if (!item)
        return;

    const tableContainer = document.querySelector(".table-container");
    const tableBody = tableContainer.querySelector("tbody");
    tableBody.querySelectorAll("tr").forEach(tr => {
        if (!tr.querySelector("th#output-header"))
            tr.remove();
    });
    item.types.forEach(async type => {
        let blob = null;
        try {
            blob = await item.getType(type);
        } catch (error) { }

        const promise = new Promise(resolve => {
            if (!blob) {
                resolve("<span style='color: red;'>No Data</span>");
                return;
            }

            if (type.startsWith("image")) {
                resolve(`<img style="max-height: 100px;" src="${URL.createObjectURL(blob)}"></img>`);
                return;
            }

            const reader = new FileReader;
            reader.onload = () => {
                if (type === "text/uri-list")
                    resolve(`<a href="${reader.result}">${reader.result}</a>`);
                else
                    resolve(reader.result);
            };
            reader.readAsText(blob);
        });
        tableBody.appendChild(makeTableRow(["", type, blob ? humanReadableFileSize(blob.size) : 0, promise]));
    });

    if (!item.types.length)
        tableBody.appendChild(makeTableRow(["", "No data", "-", "-"]));

    tableContainer.style.visibility = "hidden";
    tableContainer.style.display = "block";
    tableContainer.querySelector(".item-identifier").textContent = identifier;

    await new Promise(requestAnimationFrame);

    tableContainer.style.left = `${Math.min(x, innerWidth - tableContainer.offsetWidth)}px`;
    tableContainer.style.top = `${Math.max(0, y - tableContainer.offsetHeight)}px`;
    tableContainer.style.visibility = "";
}

(function() {
    const section = document.querySelector("section#clipboardReadText");
    const button = section.querySelector("button.action");
    const clear = section.querySelector("button.clear");
    const input = section.querySelector("input");
    button.addEventListener("click", async () => {
        const startTime = Date.now();
        appendConsole("clipboardReadText", "Reading text from clipboard.");
        navigator.clipboard.readText().then(text => {
            appendConsole("clipboardReadText", `✅ Done reading text from clipboard (${Date.now() - startTime} ms).`);
            input.value = text;
        }, () => {
            appendConsole("clipboardReadText", `❌ Failed to read text from clipboard (${Date.now() - startTime} ms).`);
            input.value = "";
        });
    });
    clear.addEventListener("click", () => {
        clearConsole("clipboardReadText");
        input.value = "";
    });
})();

(function() {
    const section = document.querySelector("section#clipboardWriteText");
    const button = section.querySelector("button.action");
    const clear = section.querySelector("button.clear");
    const input = section.querySelector("input");
    button.addEventListener("click", async () => {
        const startTime = Date.now();
        appendConsole("clipboardWriteText", "Writing text to clipboard.");
        navigator.clipboard.writeText(input.value).then(() => {
            appendConsole("clipboardWriteText", `✅ Done writing text to clipboard (${Date.now() - startTime} ms).`);
        }, () => {
            appendConsole("clipboardWriteText", `❌ Failed to write text to clipboard (${Date.now() - startTime} ms).`);
        });
    });
    clear.addEventListener("click", () => {
        clearConsole("clipboardWriteText");
        input.value = "";
    });
})();

(function() {
    const section = document.querySelector("section#clipboardItemFactory");
    const button = section.querySelector("button.action");
    const clear = section.querySelector("button.clear");
    const shelf = section.querySelector("div.item-shelf");
    const noBlobImage = section.querySelector("#blobImageCheck0");
    const blobImage1 = section.querySelector("#blobImageCheck1");
    const blobImage2 = section.querySelector("#blobImageCheck2");
    const blobImage3 = section.querySelector("#blobImageCheck3");
    const brokenBlobImage = section.querySelector("#brokenBlobImageCheck");
    const blobHTML = section.querySelector("#blobHTMLCheck");
    const blobText = section.querySelector("#blobTextCheck");
    const customType = section.querySelector("#customType");
    const customData = section.querySelector("#customData");
    const customCheck = section.querySelector("#customCheck");
    const url = section.querySelector("#urlCheck");

    section.querySelector("label[for='blobImageCheck1'] > span > img").src = `data:image/png;base64,${base64ImageData1()}==`;
    section.querySelector("label[for='blobImageCheck2'] > span > img").src = `data:image/png;base64,${base64ImageData2()}==`;
    section.querySelector("label[for='blobImageCheck3'] > span > img").src = `data:image/png;base64,${base64ImageData3()}==`;

    button.addEventListener("click", () => {
        const identifier = nextIdentifier();
        const data = {};
        if (blobImage1.checked)
            data["image/png"] = createImageBlob1();
        if (blobImage2.checked)
            data["image/png"] = createImageBlob2();
        if (blobImage3.checked)
            data["image/png"] = createImageBlob3();
        if (brokenBlobImage.checked)
            data["image/png"] = createImageBlob("VGhpc0lzTm90R29pbmdUb0RlY29kZUFzQVZhbGlkUE5Hwq9cXyjjg4QpXy/Crw");
        if (blobHTMLCheck1.checked)
            data["text/html"] = createHTMLBlob();
        if (blobHTMLCheck2.checked)
            data["text/html"] = createHTMLBlob("<span style='color: orange;'>今日は晴れています</span>");
        if (blobHTMLCheck3.checked)
            data["text/html"] = createHTMLBlob(`<span onclick='doThing()'>Nothing else to see here.</span><div style='display: none;'>Especially not this: ${base64ImageData1()}</div><!-- Or this: ${base64ImageData2()} --><script>console.log('Or this: ${base64ImageData3()}')</script>`);
        if (blobText.checked)
            data["text/plain"] = createTextBlob();
        if (url.checked)
            data["text/uri-list"] = "https://webkit.org/";
        if (customCheck.checked && customType.value.length && customData.value.length)
            data[customType.value] = customData.value;

        const promiseWrappedData = {};
        for (const [type, blobOrString] of Object.entries(data))
            promiseWrappedData[type] = wrapInPromise(blobOrString);

        let item;
        try {
            item = new ClipboardItem(promiseWrappedData);
        } catch (exception) {
            // Try creating the item by just passing in the data. This was the previous incarnation of the async
            // clipboard API.
            for (const key of Object.keys(data)) {
                if (typeof data[key] === "string")
                    data[key] = createTextBlob(data[key]);
            }
            item = new ClipboardItem(data);
        }
        setItem(identifier, item);
        shelf.appendChild(createItemPill(identifier));
    });

    customCheck.addEventListener("change", () => {
        customType.disabled = !customCheck.checked;
        customData.disabled = !customCheck.checked;
    });

    clear.addEventListener("click", () => {
        Array.from(shelf.childNodes).forEach(node => node.remove());
        [customType, customData].forEach(field => field.disabled = true);
        [customCheck, blobText, url].forEach(checkbox => checkbox.checked = false);
        [blobHTMLCheck0, noBlobImage].forEach(radio => radio.checked = true);
        customType.value = "text/custom";
        customData.value = "hello world";
    });
})();

(function() {
    const section = document.querySelector("section#clipboardWrite");
    const dropzone = section.querySelector(".dropzone");
    const button = section.querySelector("button.action");
    const clear = section.querySelector("button.clear");
    dropzone.addEventListener("drop", event => {
        event.preventDefault();
        dropzone.style.borderColor = "#DDD";

        if (!canHandleDrop(event))
            return;

        const identifiers = identifiersFromDataTransfer(event.dataTransfer);
        for (const identifier of identifiers) {
            const pill = createItemPill(identifier);
            dropzone.appendChild(pill);
        }
    });

    function identifiersFromDataTransfer(dataTransfer) {
        return dataTransfer.types.map(type => {
            if (!type.startsWith(IDENTIFIER_TYPE_PREFIX))
                return null;
            return type.substring(IDENTIFIER_TYPE_PREFIX.length);
        }).filter(identifier => identifier !== null);
    }

    function canHandleDrop(event) {
        const identifiers = currentIdentifiers();
        for (const identifier of identifiersFromDataTransfer(event.dataTransfer)) {
            if (!identifiers.includes(identifier))
                return true;
        }
        return false;
    }

    function currentIdentifiers() {
        const result = [];
        const itemIdentifiers = new Set;
        dropzone.querySelectorAll(".item").forEach(item => {
            const identifier = item.textContent;
            if (itemIdentifiers.has(identifier))
                return;

            if (!getItem(identifier))
                return;

            result.push(identifier);
            itemIdentifiers.add(identifier);
        });
        return result;
    }

    dropzone.addEventListener("dragenter", event => {
        if (!canHandleDrop(event)) {
            dropzone.style.borderColor = "#DDD";
            return;
        }
        dropzone.style.borderColor = "#8E8";
        event.dataTransfer.dropEffect = "copy";
        event.preventDefault();
    });

    dropzone.addEventListener("dragover", event => {
        if (!canHandleDrop(event)) {
            dropzone.style.borderColor = "#DDD";
            return;
        }
        event.dataTransfer.dropEffect = "copy";
        event.preventDefault();
    });

    dropzone.addEventListener("dragleave", event => dropzone.style.borderColor = "#DDD");

    button.addEventListener("click", () => {
        const items = currentIdentifiers().map(getItem).filter(item => item !== null);
        const startTime = Date.now();
        appendConsole("clipboardWrite", `Writing ${items.length} item(s) to the clipboard.`);
        navigator.clipboard.write(Array.from(items)).then(() => {
            appendConsole("clipboardWrite", `✅ Done writing ${items.length} item(s) (${Date.now() - startTime} ms).`);
        }, error => {
            appendConsole("clipboardWrite", `❌ Failed to write ${items.length} item(s) (${Date.now() - startTime} ms).`);
            appendConsole("clipboardWrite", `(${error.code}) ${error.message}`);
        });
    });

    clear.addEventListener("click", () => {
        Array.from(dropzone.childNodes).forEach(node => node.remove());
        clearConsole("clipboardWrite");
    });
})();

(function() {
    const section = document.querySelector("section#clipboardRead");
    const button = section.querySelector("button.action");
    const shelf = section.querySelector("div.item-shelf");
    const clear = section.querySelector("button.clear");

    button.addEventListener("click", () => {
        appendConsole("clipboardRead", `Reading items from the clipboard.`);
        const startTime = Date.now();
        navigator.clipboard.read().then(items => {
            appendConsole("clipboardRead", `✅ Read ${items.length} item(s) (${Date.now() - startTime} ms).`);
            for (const item of items) {
                const identifier = nextIdentifier();
                setItem(identifier, item);
                shelf.appendChild(createItemPill(identifier));
            }
        }, error => {
            appendConsole("clipboardRead", `❌ Failed to read items (${Date.now() - startTime} ms).`);
            appendConsole("clipboardRead", `(${error.code}) ${error.message}`);
        });
    });

    clear.addEventListener("click", () => {
        Array.from(shelf.childNodes).forEach(node => node.remove());
        clearConsole("clipboardRead");
    });
})();

(function() {
    const tableContainer = document.querySelector(".table-container");
    const closeButton = tableContainer.querySelector(".close-button");
    closeButton.addEventListener("click", () => tableContainer.style.display = "none");
})();

(function() {
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            document.querySelector(".table-container").style.display = "none";
            event.preventDefault();
        }
    });
})();
