// Miscellaneous utility functions.
let stringByInsertingStringAtIndex = (stringToInsert, index, fullString) => fullString.substring(0, index) + stringToInsert + fullString.substring(index);
let lower = (s) => s ? s.toLowerCase() : null;

function load() {
    editor.addEventListener("beforeinput", handleBeforeInput);
    editor.focus();
}

function handleBeforeInput(event) {
    var shouldPreventDefault = false;
    if (event.inputType === "formatBold") {
        surroundSelectionWithString("**")
        shouldPreventDefault = true;
    }

    if (event.inputType === "formatItalic") {
        surroundSelectionWithString("*");
        shouldPreventDefault = true;
    }

    if (event.inputType === "formatUnderline") {
        surroundSelectionWithString("__");
        shouldPreventDefault = true;
    }

    if (event.inputType === "insertFromPaste" || event.inputType == "insertFromDrop") {
        let htmlText = event.dataTransfer.getData("text/html");
        let surroundingText = "";
        if (shouldHTMLTextBeBolded(htmlText))
            surroundingText = "**";
        else if (shouldHTMLTextBeItalicized(htmlText))
            surroundingText = "*";
        else if (shouldHTMLTextBeUnderlined(htmlText))
            surroundingText = "__";
        insertTextAtSelection(`${surroundingText}${event.dataTransfer.getData("text/plain")}${surroundingText}`, event.inputType == "insertFromDrop");
        shouldPreventDefault = true;
    }

    if (shouldPreventDefault) {
        flashMessage(`Intercepted "${event.inputType}"`);
        event.preventDefault();
    }
}

function flashMessage(message) {
    let div = document.createElement("div");
    let code = document.createElement("code");
    code.textContent = message;
    div.appendChild(code);
    div.classList.add("flash");
    div.addEventListener("transitionend", function() {
        div.remove();
    });
    setTimeout(function() {
        div.classList.add("flash-begin");
    }, 100);

    editor.appendChild(div);
}

function shouldHTMLTextBeBolded(html) {
    let div = document.createElement("div");
    div.innerHTML = html;
    // For now, mark the entire text as bold only if all parts of it are bold.
    for (var i = 0; i < div.childElementCount; i++) {
        let child = div.children[i];
        if (lower(child.style.fontWeight) !== "bold" && lower(getComputedStyle(child).fontWeight) !== "bold" && lower(child.tagName) !== "b") {
            if (!child.childElementCount || !shouldHTMLTextBeBolded(child.innerHTML))
                return false;
        }
    }
    return !!div.childElementCount;
}

function shouldHTMLTextBeItalicized(html) {
    let div = document.createElement("div");
    div.innerHTML = html;
    // For now, mark the entire text as bold only if all parts of it are bold.
    for (var i = 0; i < div.childElementCount; i++) {
        let child = div.children[i];
        if (lower(child.tagName) !== "i") {
            if (!child.childElementCount || !shouldHTMLTextBeItalicized(child.innerHTML))
                return false;
        }
    }
    return !!div.childElementCount;
}

function shouldHTMLTextBeUnderlined(html) {
    let div = document.createElement("div");
    div.innerHTML = html;
    // For now, mark the entire text as bold only if all parts of it are bold.
    for (var i = 0; i < div.childElementCount; i++) {
        let child = div.children[i];
        if (lower(child.tagName) !== "u" && lower(child.style.textDecoration) !== "underline") {
            if (!child.childElementCount || !shouldHTMLTextBeUnderlined(child.innerHTML))
                    return false;
        }
    }
    return !!div.childElementCount;
}

function insertTextAtSelection(s, selectAll) {
    let currentRange = getSelection().getRangeAt(0);
    getSelection().deleteFromDocument();
    let range = getSelection().getRangeAt(0);
    let textNode = document.createTextNode(s);
    range.insertNode(textNode);

    getSelection().removeAllRanges();
    let newRange = document.createRange();
    if (selectAll)
        newRange.setStart(textNode, 0);
    else
        newRange.setStart(textNode, s.length);
    newRange.setEnd(textNode, s.length);
    getSelection().addRange(newRange);
}

function surroundSelectionWithString(s) {
    let currentRange = getSelection().getRangeAt(0)
        , start = currentRange.startContainer
        , end = currentRange.endContainer
        , startOffset = currentRange.startOffset
        , endOffset = currentRange.endOffset;

    // First, insert the style decorators around the selected text.
    end.textContent = stringByInsertingStringAtIndex(s, endOffset, end.textContent);
    start.textContent = stringByInsertingStringAtIndex(s, startOffset, start.textContent);

    // Then, reset the selection to the the contents of the surrounded text.
    getSelection().removeAllRanges();
    let newRange = document.createRange();
    newRange.setStart(start, startOffset + s.length);
    newRange.setEnd(end, endOffset + (start == end ? s.length : 0));
    getSelection().addRange(newRange);
}
