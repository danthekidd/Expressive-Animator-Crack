(async function () {
    const startTime = performance.now();
    
    const FILE_CACHE = "animator-1718281115095-9257";
    const bootjsUrl = "https://animator.expressive.app/assets/animator/boot.js";
    const appjsUrl = "https://animator.expressive.app/assets/animator/app.js";
    
    const cache = await caches.open(FILE_CACHE);

    async function poisonCache(url, callbackFn) {
        if (cache.match(url)) cache.delete(url);

        const response = await fetch(url);
        
        const responseClone = response.clone();
        const responseText = await responseClone.text();

        const modifiedText = callbackFn(responseText);

        const modifiedResponse = new Response(modifiedText, {
            headers: response.headers
        });

        await cache.put(url, modifiedResponse);

        console.log(`SUCCESSFULLY POISONED ${url}`);

        return modifiedResponse;
    }

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

    await Promise.all([
        poisonCache(bootjsUrl, (x) => `(${injectLicense.toString()})()\n${x}`),
        poisonCache(appjsUrl, (x) => x.replace(/!await Ht\[n\(q\._0xfd7603,0,q\._0x582b02,q\._0x4713c0,q\._0x484246\)\]\(be,a\)/g, 'false'))
    ]);

    const endTime = performance.now();
    const timeInSeconds = (endTime - startTime) / 1000;

    console.log(`%cSUCCESSFULLY CRACKED IN ${timeInSeconds.toFixed(2)} SECONDS`, 'color: lightgreen; font-weight: bold;');
})();