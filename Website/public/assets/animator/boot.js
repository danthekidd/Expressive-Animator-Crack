!(async function () {
    async function injectSerial() {

        await (async function() {
            var dir = await navigator.storage.getDirectory();
            var fileHandle = await dir.getFileHandle('sn', {
                create: true
            });
            var file = await fileHandle.getFile();
            var writable = await fileHandle.createWritable();
            await writable.write("FAKESERIAL");
            await writable.close();
        })();

        var inf = await navigator.userAgentData.getHighEntropyValues(["architecture", "bitness"]);

        var data = {
            "customer": "Cracked",
            "email": "Cracked",
            "serial": "FAKESERIAL",
            "app": "animator",
            "browser": inf.brands.filter((t => !t.brand.toLowerCase().endsWith("brand") && t.brand !== "Chromium"))[0].brand,
            "platform": inf.platform,
            "architecture": inf.architecture,
            "bitness": inf.bitness
        }

        var dir = await navigator.storage.getDirectory();
        var fileHandle = await dir.getFileHandle('lk', {
            create: true
        });
        var writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify([btoa(JSON.stringify(data)), btoa("this is where the RSA public key WOULD go")]));
        await writable.close();
    }

    await injectSerial();


    (() => {
        let e = localStorage.getItem("theme");
        e || ((e = "auto"), localStorage.setItem("theme", e)),
            document.documentElement.style.setProperty("--theme", e),
            "auto" === e &&
                (e = matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"),
            document
                .querySelector('meta[name="theme-color"]')
                .setAttribute("content", "dark" === e ? "#1D1D1D" : "#FFF");
        let r = location.hash;
        r &&
            (history.replaceState(null, null, "/"),
            r.startsWith("#token=") &&
                (window.tb577cf43048be7e2c293bc10ab6aa96874cb55f95323aee6 =
                    r.substring(7)));
    })();
    const e = document.getElementById("expr-overlay");
    if (e.hasAttribute("error")) return;
    const r = (function () {
        {
            if (
                /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(
                    navigator.userAgent || ""
                )
            )
                return 1;
            if ("brave" in navigator) return 2;
            const e = navigator.userAgentData;
            if (!e) return 2;
            if (e.mobile) return 1;
            let r = null,
                t = 0;
            for (t = 0; t < e.brands.length; t++)
                if ("Chromium" === e.brands[t].brand) {
                    r = parseFloat(e.brands[t].version);
                    break;
                }
            if (!r || Number.isNaN(r)) return 2;
            if (r < 117) return 3;
        }
        return WebGL2RenderingContext
            ? document
                  .createElement("canvas")
                  .getContext("webgl2", { stencil: !0 })
                ? 0
                : 5
            : 4;
    })();
    if (0 === r) return void import("./app.js");
    e.setAttribute("error", "");
    const t = e.querySelector("[data-text-placeholder]");
    let o,
        a = !1;
    switch (r) {
        case 1:
            o = "This app can't run on mobile devices.";
            break;
        case 3:
            (o =
                "Your browser is outdated. To run the app you must update your browser to the latest version."),
                (a = !0);
            break;
        case 2:
            (o =
                "Your browser is not supported. Use a Chromium based browser such as Google Chrome, Microsoft Edge, or Opera."),
                (a = !0);
            break;
        case 5:
            (o =
                "WebGL2 is supported by this browser, but is disabled or unavailable. Try updating your video drivers or manually enable WebGL2."),
                (a = !0);
            break;
        case 4:
            (o = "WebGL2 is not supported by this browser."), (a = !0);
            break;
        default:
            (o = "Unknown error."), (a = !0);
    }
    a
        ? (t.innerHTML =
              o +
              '<br><a href="https://expressive.app/account/downloads/">Download the app</a>')
        : (t.innerText = o);
    const n = new Map([
        [1, "mobile-browser"],
        [2, "other-browser"],
        [3, "outdated-browser"],
        [4, "no-webgl"],
        [5, "disabled-webgl"],
    ]);
    plausible("BrowserUnsupported", {
        props: {
            app_name: "animator",
            app_version: "2024.1.1",
            unsupported_reason: n.get(r),
        },
    });
})();
