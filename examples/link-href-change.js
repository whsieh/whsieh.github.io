"use strict";

setTimeout(function() {
    const link = document.createElement("a");
    link.href = `https://webkit.org/?sid=${Math.random().toFixed(16).substr(2)}`;
    link.textContent = "Link to webkit.org";
    document.body.appendChild(link);
}, 0);