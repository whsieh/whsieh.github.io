addEventListener("load", () => {
    function generateUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
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

    let index = 0;
    for (const link of [...document.querySelectorAll("a")]) {
        if (!link.hasAttribute("href"))
            continue;

        const linkURL = URL.parse(link.getAttribute("href"));
        link.setAttribute("href", "javascript:0");
        link.addEventListener("click", () => {
            const { name, handler } = navigationStrategies[index++ % navigationStrategies.length];
            linkURL.searchParams.set("wh_navsrc", name);
            linkURL.searchParams.set("wh_clkid", generateUUID());
            linkURL.searchParams.set("wh_campaign", "github");
            handler(linkURL.href);
        });
    }
});
