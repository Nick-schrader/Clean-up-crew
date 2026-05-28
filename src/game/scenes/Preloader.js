import { Scene } from 'phaser';
import Item_localstorage from '../objects/item_localstorage';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        console.log('Loading assets from assets folder...');

        this.load.setPath('assets');

        // Main menu assets
        this.load.image('logo', 'logo.svg');
        this.load.image('settings', 'settings-button.png');
        this.load.image('achievements', 'achievements.png');

        // Tutorial assets
        this.load.svg('key-a', 'tutorial/key-cap-a.svg', { width: 64, height: 64});
        this.load.svg('key-d', 'tutorial/key-cap-d.svg', { width: 64, height: 64});
        this.load.svg('key-e', 'tutorial/key-cap-e.svg', { width: 64, height: 64});
        this.load.svg('key-r', 'tutorial/key-cap-r.svg', { width: 64, height: 64});
        this.load.svg('key-s', 'tutorial/key-cap-s.svg', { width: 64, height: 64});
        this.load.svg('key-w', 'tutorial/key-cap-w.svg', { width: 64, height: 64});
        this.load.svg('key-space', 'tutorial/key-cap-space.svg', { width: 64, height: 64});
        this.load.svg('key-tab', 'tutorial/key-cap-tab.svg', { width: 64, height: 64});
        this.load.svg('key-esc', 'tutorial/key-cap-esc.svg', { width: 64, height: 64 });

        // Achievement icons
        this.load.svg('default', 'achievements/default.svg', { width: 64, height: 64});
        this.load.svg('+10', 'achievements/tienGoed.svg', { width: 64, height: 64});
        this.load.svg('getting-better', 'achievements/getting-better.svg', { width: 64, height: 64});
        this.load.svg('a-new-look', 'achievements/a-new-look.svg', { width: 64, height: 64});
        this.load.svg('fully-upgraded', 'achievements/fully-upgraded.svg', { width: 64, height: 64});
        this.load.svg('pro-garbage-man', 'achievements/pro-garbage-man.svg', { width: 64, height: 64});
        this.load.svg('who-is-this', 'achievements/who-is-this.svg', { width: 64, height: 64});
        this.load.svg('secret', 'achievements/secret.svg', { width: 64, height: 64});
        this.load.svg('100-goed', 'achievements/100-goed.svg', { width: 64, height: 64});
        this.load.svg('500-goed', 'achievements/500-goed.svg', { width: 64, height: 64});
        this.load.svg('1500-goed', 'achievements/1500-goed.svg', { width: 64, height: 64});
        this.load.svg('100-slecht', 'achievements/100-slecht.svg', { width: 64, height: 64});
        this.load.svg('recycle-held', 'achievements/recycle-held.svg', { width: 64, height: 64});
        this.load.svg('geld-baas', 'achievements/geld-baas.svg', { width: 80, height: 80});
        this.load.svg('oppak-pro', 'achievements/oppak-professional.svg', { width: 64, height: 64});
        this.load.svg('inv-koning', 'achievements/inventory-koning.svg', { width: 64, height: 64});
        this.load.svg('combo-king', 'achievements/combo-king.svg', { width: 64, height: 64});


        // Kerst items
        this.load.image('candyCane', 'candyCane.webp');

        // Achtergrond afbeeldingen
        this.load.image('background', 'bg.png');
        this.load.image('background2', 'bg2.png');
        this.load.image('background3', 'bg3.png');
        this.load.image('cover', 'cover-art.png');

        // Grond en lopende band
        this.load.image('conveyor-belt', 'conveyor-belt.png');
        this.load.image('ground', 'grond-groen.png');

        // Recycle containers
        this.load.image('Open_container_GFT', 'Open_container_GFT.png');
        this.load.image('Open_container_Papier', 'Open_container_Papier.png');
        this.load.image('Open_container_Plastic', 'Open_container_Plastic.png');

        // Geld logo
        this.load.image('geld-logo', 'Geld.png');

        // Items
        this.load.image('plastic-bottle', 'items/Plastic-bottle.webp');
        this.load.image('paper', 'items/Single-paper.webp');
        this.load.image('rotton-apple-1', 'items/Rotton-apple-1.webp');
        this.load.image('rotton-apple-2', 'items/Rotton-apple-2.webp');
        this.load.image('rotton-apple-3', 'items/Rotton-apple-3.webp');
        this.load.image('natte-doos', 'items/Natte-doos.png');
        this.load.image('laptop-doos', 'items/Laptop-doos.png');
        this.load.image('kapote-natte-doos', 'items/Kapote-natte-doos.png');
        this.load.image('rotted-banana', 'items/Rotted-banana.png');
        this.load.image('verkreukeld-blikje', 'items/Verkreukeld-blikje.png');
        this.load.image('gekreukeld-flesje', 'items/Gekreukeld-flesje.png');
        this.load.image('blikje', 'items/Blikje.png');
        this.load.image('banaan', 'items/Banaan.png');
        this.load.image('beschimmelde-banaan', 'items/Beschimmelde-banaan.png');
        this.load.image('broodje-bal', 'items/Broodje-bal.png');
        this.load.image('beschimmeld-broodje-bal', 'items/Beschimmelde-broodje-bal.png');
        this.load.image('strawberry', 'items/Strawberry.png');
        this.load.image('smoothie-cup', 'items/Smoothie-cup.png');
        this.load.image('sla-boos', 'items/Sla-boos.png');
        this.load.image('shampo-bottle', 'items/Shampo-bottle.png');
        this.load.image('plastic-folie', 'items/Plastic-folie.png');
        this.load.image('news-papier', 'items/News-papier.png');
        this.load.image('kaas', 'items/Kaas.png');
        this.load.image('geplette-shampo-flesje', 'items/Geplette-shampo-flesje.png');
        this.load.image('chips-zak', 'items/Chips-zak.png');
        this.load.image('brood', 'items/Brood.png');
        this.load.image('paper-bag', 'items/Paper-bag.png');
        this.load.image('paper-kapote-bag', 'items/Paper-kapote-bag.png');
        this.load.image('pizza-doos', 'items/Pizza-doos.png');

        // Spritesheets
        this.load.spritesheet('conveyor-belt2', "belt.png", { frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('donut', 'donut.png', { frameWidth: 272, frameHeight: 254 });
        this.load.spritesheet('player2', 'character2.png', { frameWidth: 254, frameHeight: 273 });
        this.load.spritesheet('player', 'character.png', { frameWidth: 202.7, frameHeight: 259 });
        this.load.spritesheet('alex', 'character3.png', { frameWidth: 202, frameHeight: 261 });
        // this.load.spritesheet('johnny', 'johnny2.png', { frameWidth: 327, frameHeight: 264 });
        this.load.spritesheet('player4', 'character4.png', { frameWidth: 174, frameHeight: 261 });
        this.load.spritesheet('player5', 'character5.png', { frameWidth: 274, frameHeight: 274 });
        this.load.spritesheet('player6', 'character6.png', { frameWidth: 350, frameHeight: 271 });
        this.load.spritesheet('player7', 'character7.png', { frameWidth: 131, frameHeight: 255 });
        this.load.spritesheet('kerstboom', 'kerstboom.png', { frameWidth: 206, frameHeight: 263 });

        // Fonts
        this.load.font('HanaleiFill', 'fonts/HanaleiFill-Regular.ttf', 'true');
        this.load.font('Montserrat', 'fonts/Montserrat-VariableFont_wght.ttf', 'true');
        this.load.font('MontserratItalic', 'fonts/Montserrat-Italic-VariableFont_wght.ttf', 'true');
      
        // Sound effects
        this.load.audio('bird', 'sound/bird-sound.mp3');
        this.load.audio('christmas', 'sound/christmas-music.mp3');
        this.load.audio('main-menu-music', 'sound/epic-strings.mp3');
        this.load.audio('industrial-sound', 'sound/industrial-ambience-67112.mp3');
        this.load.audio('aardbeving-sound', 'sound/rubble-crash-275691.mp3');
        this.load.audio('walking-sound', 'sound/walking-96582.mp3');
        this.load.audio('credit-muziek', 'sound/8-bit-heaven.mp3');
        this.load.audio('buzzer', 'sound/buzzer.mp3');
        this.load.audio('achievement-sound', 'sound/minecraft-villager.mp3');
        this.load.audio('purchase-succes', 'sound/purchase-success.mp3');

        // Tutorial videos
        this.load.video('tutorial-video', 'tutorialVideo.mp4', 'loadeddata', false, true);
        this.load.video('tutorial-lopen', 'tutorialLopen.mp4', 'loadeddata', false, true);
        this.load.video('tutorial-upgrades', 'tutorialUpgrades.mp4', 'loadeddata', false, true);
        this.load.video('tutorial-scheiden', 'tutorialScheiden.mp4', 'loadeddata', false, true);
        this.load.video('tutorial-settings', 'tutorialSettings.mp4', 'loadeddata', false, true);
        this.load.video('tutorial-start', 'tutorialStart.mp4', 'loadeddata', false, true);

        this.load.on('complete', () => {
            console.log('All assets loaded!');
            this.scene.start('MenuScene');
        });

    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.

        const item_in_laden = new Item_localstorage();
        item_in_laden.initStorage();

        window.dispatchEvent(new Event('max-afval-updated'));
    }
}