import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Player from '../objects/Player';
import Item_recyclen from '../objects/Item_recyclen';
import Item_display from '../objects/Item_display';
import Snow from '../objects/snow';
import Kerstboom from '../objects/kerstboom';
import { Settings } from './Settings.js';

export class Recyclen extends Scene
{

    constructor ()
    {
        super('Recyclen');
    }

    create ()
    {
        this.settings = Settings.getSettings();

        // Achtergrond
        this.add.image(512, 384, 'background2').setScale(0.8);  

        const selectedSkin = localStorage.getItem('selectedSkin') || 'player2';

        // Kerst thema als skin 6 of 7 geselecteerd is
        if (selectedSkin === 'player6' || selectedSkin === 'player7') {
            this.christmasSound = this.sound.add('christmas', {
                loop: true,
                volume: this.settings.soundOn ? this.settings.volume / 30 : 0
            });
            this.christmasSound.play();
            this.add.image(512, 384, 'background3').setScale(0.8);  
            this.snow = new Snow(this, 250, 1024, 768);
            this.kerstboom = new Kerstboom(this, 50, 580);
        }
    
        // Geluid
        this.birdMusic = this.sound.add('bird', {
            loop: true, 
            volume: this.settings.soundOn ? this.settings.volume / 30 : 0
        });
        this.birdMusic.play();

        // Grond waar speler op loopt wordt aangeroepen
        const ground = this.physics.add.staticGroup();
        ground.create(512, 808, 'ground').setScale(35, 2).refreshBody().setVisible(false);
        
        // Speler
        this.player = new Player(this, 360, 630, selectedSkin).setDepth(2);
        this.player.create();
        this.physics.add.collider(this.player, this.ground);

        EventBus.on('skinSelected', (skinKey) => {
        if (this.scene.isActive() && this.player) {
        this.player.updateSkin(skinKey);
        }
        });

        // De 3 afval bakken worden aangeroepen
        this.OpenContainer1 = new Item_recyclen(this, 210, 600, this.player, 'Plastic', 'Open_container_Plastic').setScale(0.35);
        this.OpenContainer2 = new Item_recyclen(this, 510, 600, this.player, 'Paper', 'Open_container_Papier').setScale(0.35);
        this.OpenContainer3 = new Item_recyclen(this, 810, 600, this.player, 'GFT', 'Open_container_GFT').setScale(0.35);

        // Candy cane afbeelding als kerst thema
        if (selectedSkin === 'player6' || selectedSkin === 'player7') {
            this.add.image(930, 560, 'candyCane').setScale(0.5).setFlipX(true);
        }
    
        // Item die opgepakt is wordt weergegeven
        this.ItemDisplay = new Item_display(this, 512, 384, this.OpenContainer1.item).setScale(0.5);

        // Collider tussen speler en grond
        this.physics.add.collider(this.player, ground);

        EventBus.emit('current-scene-ready', this);
    }

    // Update speler en sneeuw
    update() {
      if (this.player) {
        this.player.update();
      }
      if (this.snow) {
        this.snow.update();
      }
    }

    // Verander naar de 'MainMenu' scene
    changeScene ()
    {
        // Stopt het achtergrond geluid
        this.birdMusic.stop();
        if (this.christmasSound) {
            this.christmasSound.stop();
        }
        // Verander naar de 'Game' scene
        this.scene.start('Game');
    }

    changeScenePauze() {
        // Stopt het achtergrond geluid
        this.birdMusic.stop();
        if (this.christmasSound) {
            this.christmasSound.stop();
        }
        // Verander naar de 'MenuScene' scene
        this.scene.start('MenuScene');
    }
}