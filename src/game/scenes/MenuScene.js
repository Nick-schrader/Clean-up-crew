import { EventBus } from '../EventBus';
import { Pause } from './Pause.js';
import { showMenu } from '../extra/menuAnimation.js';
import { createButton } from '../extra/buttonFactory.js';
import { tutorialUI } from '../extra/tutorialComponents.js';
import { Settings } from './Settings.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {}

    create() {
        this.settings = Settings.getSettings();
        const bgContainer = this.add.container(0, 0);

        // Achtergrond
        const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'cover');
        const overlay = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0x000000, 0.5).setOrigin(0.5);

        bg.setDepth(-10);
        overlay.setDepth(-9);
        bgContainer.add([bg, overlay]);

        // Logo
        this.add.image(200, 150, 'logo');

        // Geluid
        this.mainMusic = this.sound.add('main-menu-music', {
            loop: true,
            volume: this.settings.soundOn ? this.settings.volume / 30 : 0
        });
        this.mainMusic.play();

        // Menu-container
        const menuContainer = this.add.container(0, 0);

        // Knoppen
        const startBtn = createButton(this, "Start");
        const tutBtn = createButton(this, "Tutorial");
        const shopBtn = createButton(this, "Shop");
        const upgradeBtn = createButton(this, "Upgrades");
        const achBtn = createButton(this, "Achievements");
        const setBtn = createButton(this, "Settings");
        const credBtn = createButton(this, "Credits");

        startBtn.on('pointerdown', () =>  {
            this.mainMusic.pause();
            this.scene.start('Game');
        });

        shopBtn.on('pointerdown', () => {
            this.scene.launch('SkinMenu');  
            this.scene.pause();            
        });

        credBtn.on('pointerdown', () => {
            this.scene.launch('Credits');  
            this.scene.pause();              
        });


        upgradeBtn.on('pointerdown', () => {
            // Open the Vue Upgrade menu by dispatching a window event
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('open-upgrade-menu'));
            }
        });

        achBtn.on('pointerdown', () => Pause.pause(this, 'Achievements'));
        setBtn.on('pointerdown', () => Pause.pause(this, 'Settings'));

        tutBtn.on('pointerdown', () => {
            const menu = tutorialUI(this);
            showMenu(this, menu);
        });

        const buttons = [startBtn, tutBtn, shopBtn, upgradeBtn, achBtn, setBtn, credBtn];

        let y = 0;
        const spacing = 20;
        buttons.forEach(btn => {
            btn.y = y;
            menuContainer.add(btn);
            y += btn.height + spacing;
        });

        menuContainer.setPosition(215, 300);

        EventBus.emit('current-scene-ready', this);

        this.events.on('resume', () => {
            if (this.mainMusic.isPaused) this.mainMusic.resume();
            this.mainMusic.volume = Settings.getSettings()['soundOn'] ? Settings.getSettings()['volume'] / 30 : 0;
        });

    }
}