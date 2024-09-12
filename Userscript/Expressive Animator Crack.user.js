// ==UserScript==
// @name         Expressive Animator Crack V3
// @version      3.1.0
// @description  Expressive Animator for free.
// @author       danthekidd
// @match        https://animator.expressive.app/*
// @icon         https://animator.expressive.app/favicon.png
// @grant        none
// @run-at       document-start
// @license MIT
// @namespace https://github.com/danthekidd/
// @downloadURL https://github.com/danthekidd/Expressive-Animator-Crack/raw/main/Userscript/Expressive%20Animator%20Crack.user.js
// ==/UserScript==

(function() {
    'use strict';

    async function clearCache() {
        var cache = await caches.open("animator-1718281115095-9257")
        var cacheKeys = await cache.keys()

        await Promise.all(
            cacheKeys.map(request => cache.delete(request))
        )
    }

    setTimeout(clearCache,100)

    async function injectLicense() {

        await (async function() {
            var dir = await navigator.storage.getDirectory();
            var fileHandle = await dir.getFileHandle('sn', {
                create: true
            });
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

    new MutationObserver(async (mutations, observer) => {
        let oldScript = mutations
            .flatMap(e => [...e.addedNodes])
            .filter(e => e.tagName == 'SCRIPT')
            .find(e => e.src.match(/boot.js/))

        if (oldScript) {
            observer.disconnect()
            oldScript.remove()

            let text = await fetch(oldScript.src).then(e => e.text())
                .then(e => e.replace(/.\/app.js/g, ""))

            let newScript = document.createElement('script')
            newScript.type = 'module'
            newScript.textContent = text
            document.querySelector('head').appendChild(newScript)

            fetch("https://animator.expressive.app/assets/animator/app.js")
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(scriptContent => {
                    injectLicense().then(function() {
                        const modifiedContent = scriptContent
                            .replace(
                                /!await Ht\[n\(q\._0xfd7603,0,q\._0x582b02,q\._0x4713c0,q\._0x484246\)\]\(be,a\)/g,
                                'false'
                            )
                            .replace(
                                /skia\.wasm/g,
                                'assets/animator/skia.wasm'
                            );

                        const scriptElement = document.createElement('script');
                        scriptElement.textContent = modifiedContent;
                        scriptElement.type = 'module'

                        document.body.appendChild(scriptElement);

                        console.log('Modified script executed.');
                    })

                })
                .catch(error => {
                    console.error('Failed to fetch or modify the script:', error);
                });
        }
    }).observe(document, {
        childList: true,
        subtree: true,
    })
})();
