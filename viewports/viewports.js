"use strict";

function updateOutputContainer() {
    const outputContainer = document.getElementById("output");
    if (!outputContainer)
        return;

    outputContainer.textContent = `scale = ${visualViewport.scale.toFixed(3)}\n`
        + `innerWidth = ${innerWidth}\n`
        + `screen = (${screen.width}, ${screen.height})`;
}

addEventListener("load", () => {
    updateOutputContainer();
    visualViewport.addEventListener("resize", updateOutputContainer);
    visualViewport.addEventListener("scroll", updateOutputContainer);
});