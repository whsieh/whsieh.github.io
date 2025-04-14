addEventListener("load", async () => {
    function generateUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async function getAudioFingerprint() {
        return new Promise((resolve, reject) => {
            try {
                const offlineContext = new OfflineAudioContext(1, 44100, 44100);

                const oscillator = offlineContext.createOscillator();
                oscillator.type = "triangle";
                oscillator.frequency.value = 10000; // 10kHz tone

                const compressor = offlineContext.createDynamicsCompressor();
                compressor.threshold.value = -50;
                compressor.knee.value = 40;
                compressor.ratio.value = 12;
                compressor.attack.value = 0;
                compressor.release.value = 0.25;

                oscillator.connect(compressor);
                compressor.connect(offlineContext.destination);

                oscillator.start(0);

                offlineContext.startRendering().then(renderedBuffer => {
                    const channelData = renderedBuffer.getChannelData(0);
                    let audioSignature = "";
                    for (let i = 0; i < 200; i++) {
                        audioSignature += Math.abs(channelData[i]).toString();
                    }
                    resolve(audioSignature);
                }).catch(err => reject(err));
            } catch (e) {
                reject(e);
            }
        });
    }

    function getCanvasFingerprint() {
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 50;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);

        ctx.fillStyle = "#069";
        ctx.font = "14px 'Arial'";
        ctx.fillText("Hello, world!", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Hello, world!", 4, 17);

        return canvas.toDataURL();
    }

    function getWebGLFingerprint() {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return null;

        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            return {
                vendor,
                renderer
            };
        }
        return null;
    }

    async function computeFingerprint() {
        const details = {
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowOuterHeight: window.outerHeight,
            windowInnerHeight: window.innerHeight,
            userAgent: navigator.userAgent,
            plugins: [...navigator.plugins].map(plugin => plugin.name),
            hardwareConcurrency: navigator.hardwareConcurrency,
            speechSynthesisVoices: speechSynthesis.getVoices().map(voice => voice.voiceURI),
            language: navigator.language,
            timezoneOffset: new Date().getTimezoneOffset(),
            colorDepth: screen.colorDepth,
            audioFingerprint: null,
            canvasFingerprint: null,
            webglFingerprint: null
        };

        try {
            details.audioFingerprint = await getAudioFingerprint();
        } catch (e) {
            details.audioFingerprint = "N/A";
        }
        details.canvasFingerprint = getCanvasFingerprint();
        details.webglFingerprint = getWebGLFingerprint();

        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(details));
        const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const fingerprint = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        return { fingerprint, details };
    }

    const navigationStrategies = [
        {
            name: "window_open",
            handler: url => window.open(url)
        },
        {
            name: "location_href",
            handler: url => window.location.href = url
        },
        {
            name: "click_anchor",
            handler: url => {
                let newLink = document.createElement("a");
                newLink.href = url;
                newLink.click();
            }
        },
        {
            name: "window_location",
            handler: url => window.location = url
        },
        {
            name: "location_assign",
            handler: url => window.location.assign(url)
        },
        {
            name: "document_location",
            handler: url => document.location = url
        },
    ];

    const {fingerprint, details} = await computeFingerprint();
    let index = 0;
    for (const link of [...document.querySelectorAll("a")]) {
        if (!link.hasAttribute("href"))
            continue;

        const { name, handler } = navigationStrategies[index++ % navigationStrategies.length];
        const linkURL = URL.parse(link.getAttribute("href"));
        link.setAttribute("href", "javascript:0");
        link.setAttribute("title", `${linkURL.origin} - ${name}`);
        link.addEventListener("click", () => {
            linkURL.searchParams.set("nvsrc", name);
            linkURL.searchParams.set("userfpvers", 1);
            linkURL.searchParams.set("userfp", fingerprint);
            linkURL.searchParams.set("clkid", generateUUID());
            linkURL.searchParams.set("cmp", "github");
            handler(linkURL.href);
        });
    }

    console.log(`Got fingerprint: ${fingerprint}`);
    let paragraph = document.createElement("p");
    paragraph.innerHTML = `<code>${fingerprint}</code>`;
    document.body.appendChild(paragraph);
});
