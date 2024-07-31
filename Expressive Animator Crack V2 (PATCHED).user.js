// ==UserScript==
// @name         Expressive Animator Crack V2 (PATCHED)
// @version      2.0.0
// @description  Expressive Animator for free.
// @author       danthekidd
// @match        https://animator.expressive.app/*
// @icon         https://animator.expressive.app/favicon.png
// @grant        none
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1287532
// @downloadURL https://github.com/danthekidd/Expressive-Animator-Crack/raw/main/Expressive%20Animator%20Crack.user.js
// ==/UserScript==

(function() {
    'use strict';
    function toBase64 (buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    setTimeout(async function () {
        await (async function() {
            var dir = await navigator.storage.getDirectory();
            var fileHandle = await dir.getFileHandle('sn', {create: true});
            var file = await fileHandle.getFile();
            var writable = await fileHandle.createWritable();
            await writable.write("FAKESERIAL");
            await writable.close();
        })();

        var inf = await navigator.userAgentData.getHighEntropyValues(["architecture","bitness"]);

        var data = {
          "customer": "Cracked",
          "email": "Cracked",
          "serial": "FAKESERIAL",
          "app": "animator",
          "browser": inf.brands.filter((t=>!t.brand.toLowerCase().endsWith("brand") && t.brand !== "Chromium"))[0].brand,
          "platform": inf.platform,
          "architecture": inf.architecture,
          "bitness": inf.bitness
        }

        var gpo = Object.getPrototypeOf;

        Object.getPrototypeOf = function(o) {
            var proto = gpo(o);
            if (proto.hasOwnProperty("verify") && !o.hooked) {
                Object.defineProperty(o, 'verify', {
                    value: (a, b, c, d) => { if ( toBase64(d) == btoa(JSON.stringify(data)) ) { return true; } else { return false; } },
                    writable: false,
                });
                Object.defineProperty(o, 'hooked', {
                    value: true,
                    writable: false,
                });
                return o
            }
            return proto
        }

        var dir = await navigator.storage.getDirectory();
        var fileHandle = await dir.getFileHandle('lk', {create: true});
        var writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify([btoa(JSON.stringify(data)), btoa("this is where the RSA public key WOULD go")]));
        await writable.close();
    }, 0)
})();
