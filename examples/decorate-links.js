addEventListener("load", async () => {
    function generateUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async function computeFingerprint() {
        const data = {
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowOuterWidth: window.outerWidth,
            windowOuterHeight: window.outerHeight,
            windowInnerWidth: window.innerWidth,
            windowInnerHeight: window.innerHeight,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezoneOffset: new Date().getTimezoneOffset(),
            colorDepth: screen.colorDepth
        };

        const dataStr = JSON.stringify(data);

        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(dataStr);

        const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);

        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        return { fingerprint: hashHex, details: data };
    }

    const navigationStrategies = [
        {
            name: "window-open",
            handler: url => window.open(url)
        },
        {
            name: "location-href",
            handler: url => window.location.href = url
        },
        {
            name: "click-anchor",
            handler: url => {
                let newLink = document.createElement("a");
                newLink.href = url;
                document.body.appendChild(newLink);
                newLink.click();
                newLink.remove();
            }
        },
        {
            name: "window-location",
            handler: url => window.location = url
        },
        {
            name: "location-assign",
            handler: url => window.location.assign(url)
        },
        {
            name: "document-location",
            handler: url => document.location = url
        },
    ];

    const {fingerprint, details} = await computeFingerprint();
    let index = 0;
    for (const link of [...document.querySelectorAll("a")]) {
        if (!link.hasAttribute("href"))
            continue;

        const linkURL = URL.parse(link.getAttribute("href"));
        link.setAttribute("href", "javascript:0");
        link.addEventListener("click", () => {
            const { name, handler } = navigationStrategies[index++ % navigationStrategies.length];
            linkURL.searchParams.set("nvsrc", name);
            linkURL.searchParams.set("userfp", fingerprint);
            linkURL.searchParams.set("clkid", generateUUID());
            linkURL.searchParams.set("cmp", "github");
            handler(linkURL.href);
        });
    }
});
