# Expressive Animator Crack

There are three methods you can use:
- [Method 1: WCP (Web Cache Poisoning)](#method-1-wcp-web-cache-poisoning)
- [Method 2: Userscript](#method-2-userscript)
- [Method 3: Website](#method-3-website)

## Method 1: WCP (Web Cache Poisoning)
### Instructions
1. Copy the code from the [WCP script](https://raw.githubusercontent.com/danthekidd/Expressive-Animator-Crack/main/WCP/Expressive%20Animator%20Crack.js)
2. Open DevTools (`Ctrl + Shift + I` or `Cmd + Option + I`) on Expressive Animator
3. Navigate to the Console tab
4. Paste the code and run
5. Refresh the page

> NOTE: Pasting in the console is by default not allowed. If you cannot paste, type out "allow pasting" in the console and press Enter.

### How It Works
The script will inject fake request cache to respond with a modified boot.js and app.js. The boot.js script is modified to inject a fake license and app.js is modified to bypass RSA signature verification.

### Pros
- Only needed to be ran once (unless website data clears)
- No other tools are needed

### Cons
- Will not last when website is deleted and must be ran again
- DevTools required

---

## Method 2: Userscript
### Instructions
1. Install a Userscript manager (I recommend [ViolentMonkey](https://violentmonkey.github.io/))
2. Open the [Userscript](https://github.com/danthekidd/Expressive-Animator-Crack/raw/main/Userscript/Expressive%20Animator%20Crack.user.js) and install when prompted

### How It Works
The script uses a mutation observer to modify boot.js before it loads to inject the fake license and to not import/run app.js. A modified app.js with bypassed RSA signature verification is then ran via a script element.

### Pros
- Works as long as the Userscript is enabled

### Cons
- No website cache for faster loading
- Userscript manager required
- Sometimes will not work on page load and will need a refresh

---

## Method 3: Website
### Instructions
1. Just visit the [website](https://expressive-animator-cracked.web.app/) for a cracked version

> You can also deploy it from the Website folder in this repo with Google Firebase

### How It Works
The website is cloned and rehosted on Google Firebase with a modified boot.js and app.js. The boot.js script is modified to inject a fake license and app.js is modified to bypass RSA signature verification.

### Pros
- Very simple
- Works out-of-the-box
- Will not be patched when other methods are

### Cons
- Errors may occur that would not on the official website
- May be behind in updates
