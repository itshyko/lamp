const builder = require('electron-builder')
const nodeFetch = import('node-fetch');
const fs = require("fs");
const png2icons = require('png2icons');
const Jimp = require('jimp');
const { preductname } = require('./package.json')

class Index {
    async build() {
        builder.build({
            config: {
                generateUpdatesFilesForAllChannels: false,
                appId: preductname,
                productName: preductname,
                artifactName: "${productName}-${os}-${arch}.${ext}",
                files: ["**/*", "package.json", "icon.png"],
                directories: { "output": "dist" },
                compression: 'maximum',
                asar: true,
                publish: [{
                    provider: "github",
                    releaseType: 'release',
                }],
                win: {
                    icon: "./icon.ico",
                    target: [{
                        target: "nsis",
                        arch: ["x64"]
                    }],
                },
                nsis: {
                    oneClick: true,
                    allowToChangeInstallationDirectory: false,
                    createDesktopShortcut: true,
                    runAfterFinish: true
                },
                mac: {
                    icon: "./icon.icns",
                    category: "public.app-category.utilities",
                    target: [{
                        target: "dmg",
                        arch: ["x64", "arm64"]
                    }]
                },
                linux: {
                    icon: "./src/assets/images/icon.png",
                    target: [{
                        target: "AppImage",
                        arch: ["x64"]
                    }, {
                        target: "tar.gz",
                        arch: ["x64"]
                    }]
                }
            }
        }).then(() => {
            console.log('le build est terminé')
        }).catch(err => {
            console.error('Error during build!', err)
        })
    }

    async iconSet(url) {
        let Buffer = await nodeFetch(url)
        if (Buffer.status == 200) {
            Buffer = await Buffer.buffer()
            const image = await Jimp.read(Buffer);
            Buffer = await image.resize(256, 256).getBufferAsync(Jimp.MIME_PNG)
            fs.writeFileSync("icon.icns", png2icons.createICNS(Buffer, png2icons.BILINEAR, 0));
            fs.writeFileSync("icon.ico", png2icons.createICO(Buffer, png2icons.HERMITE, 0, false));
            fs.writeFileSync("icon.png", Buffer);
        } else {
            console.log('connection error')
        }
    }
}

process.argv.forEach(val => {
    if (val.startsWith('--icon')) {
        return new Index().iconSet(val.split('=')[1])
    } else if (val.startsWith('--build')) {
        new Index().build()
    }
});