import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import asar from '@electron/asar';
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function terminate() {
    rl.question(chalk.redBright('Press Enter to quit...'), () => {
        rl.close();
        process.exit();
    });
}

function hashAsarFile(filePath) {
    try {
        const data = fs.readFileSync(filePath);
        const hash = crypto.createHash('sha256')
            .update(data)
            .digest('hex');
        return hash;
    } catch (err) {
        console.error(chalk.redBright(`Error reading ASAR file: ${err.message}`));
    }
}

function findMainFolder() {
    const userPath = process.env.HOME || process.env.USERPROFILE;
    const baseFolder = path.join(userPath, 'AppData', 'Local', 'expressive-animator');

    if (!fs.existsSync(baseFolder)) {
        console.log(chalk.redBright(`Could not find expressive-animator folder at '${baseFolder}'.`));
        terminate();
        return null;
    }

    // Get the first folder that starts with "app"
    const folders = fs.readdirSync(baseFolder).filter(folder => folder.startsWith('app'));

    if (folders.length === 0) {
        console.log(chalk.redBright('No folder found starting with "app".'));
        terminate();
        return null;
    }

    // Return the first found folder
    return path.join(baseFolder, folders[0]);
}

function copyPatchesToExtracted(extractedPath, hash) {
    const patchDir = path.join(import.meta.dirname, 'patches', hash);  

    if (!fs.existsSync(patchDir)) {
        console.log(chalk.redBright(`No patches found for hash '${hash}'.`));
        return;
    }

    const patchFiles = fs.readdirSync(patchDir);

    patchFiles.forEach(file => {
        const sourcePath = path.join(patchDir, file);
        const destinationPath = path.join(extractedPath, file);

        try {
            const stats = fs.statSync(sourcePath);

            if (stats.isDirectory()) {
                copyDirectory(sourcePath, destinationPath);
            } else {
                fs.copyFileSync(sourcePath, destinationPath);
                console.log(chalk.greenBright(`Copied '${file}' to '${destinationPath}' directory.`));
            }
        } catch (err) {
            console.error(chalk.redBright(`Error copying '${file}': ${err.message}`));
        }
    });
}

function copyDirectory(srcDir, destDir) {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const items = fs.readdirSync(srcDir);

    items.forEach(item => {
        const sourcePath = path.join(srcDir, item);
        const destinationPath = path.join(destDir, item);
        const stats = fs.statSync(sourcePath);

        if (stats.isDirectory()) {
            copyDirectory(sourcePath, destinationPath);
        } else {
            fs.copyFileSync(sourcePath, destinationPath);
            console.log(chalk.greenBright(`Copied '${item}' to '${destinationPath}'.`));
        }
    });
}

function replaceHashInExecutable(exeFilePath, oldHash, newHash) {
    try {
        // Read the executable as binary data
        const exeData = fs.readFileSync(exeFilePath);
        
        // Convert to string (UTF-8) to search for the old hash
        let exeStr = exeData.toString('utf8');
        
        // Replace old hash with new hash
        exeStr = exeStr.replace(oldHash, newHash);
        
        // Write back the modified data to the executable
        fs.writeFileSync(exeFilePath, Buffer.from(exeStr, 'utf8'));

        console.log(chalk.greenBright(`Replaced old hash with new hash in '${exeFilePath}'.`));
    } catch (err) {
        console.error(chalk.redBright(`Error replacing hash in executable: ${err.message}`));
    }
}

fs.readFile('title.txt', 'utf8', async (err, content) => {
    if (err) {
        console.error(chalk.redBright('Error reading title.txt'));
        terminate();
        return;
    }

    console.log(chalk.blueBright(content));

    const mainFolder = findMainFolder();
    if (!mainFolder) return;

    const exeFilePath = path.join(mainFolder, 'Expressive Animator.exe');
    const appAsarPath = path.join(mainFolder, 'resources', 'app.asar');
    const patchedAsarPath = path.join(mainFolder, 'resources', 'app-patched.asar');

    if (!fs.existsSync(exeFilePath)) {
        console.log(chalk.redBright('Could not find Expressive Animator.exe.'));
        terminate();
        return;
    }

    if (!fs.existsSync(appAsarPath)) {
        console.log(chalk.redBright('Could not find app.asar.'));
        terminate();
        return;
    }

    // Step 1: Extract and hash the original app.asar file
    const originalHash = hashAsarFile(appAsarPath);
    console.log(chalk.greenBright(`Original app.asar hash: ${originalHash}`));

    // Step 2: Extract the app.asar and apply patches
    const extractPath = path.join(path.dirname(appAsarPath), 'extracted');
    if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath);
    }

    asar.extractAll(appAsarPath, extractPath);
    console.log(chalk.greenBright(`Extracted app.asar to '${extractPath}'.`));

    // Apply patches
    copyPatchesToExtracted(extractPath, originalHash);

    // Step 3: Repack the modified app-patched.asar
    try {
        await asar.createPackage(extractPath, patchedAsarPath);
        console.log(chalk.greenBright(`Successfully repacked the ASAR file to '${patchedAsarPath}'.`));
    } catch (err) {
        console.error(chalk.redBright('Error repacking ASAR file:', err.message));
    }

    // Step 4: Calculate the new hash for the modified app-patched.asar
    const newHash = hashAsarFile(patchedAsarPath);
    console.log(chalk.greenBright(`Modified app-patched.asar hash: ${newHash}`));

    // Step 5: Replace the old hash in the executable with the new hash
    replaceHashInExecutable(exeFilePath, originalHash, newHash);

    // Clean up
    fs.rmSync(extractPath, { recursive: true, force: true });
    console.log(chalk.greenBright(`Deleted extracted folder: '${extractPath}'.`));

    terminate();
});
