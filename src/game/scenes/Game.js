import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Player from '../objects/Player';
import Item from '../objects/Item';
import Belt from '../objects/belt';
import Item_oprapen from '../objects/Item_oprapen';
import Donut from '../objects/donut';
import { Settings } from './Settings';
import { Achievements } from './Achievements';
import UpgradeManager from './UpgradeManager';
import BeltConfig from '../objects/beltconfig';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.items = [];
        this.spawnTimers = {};
        this.belts = {};
        this.beltGroups = {};
        this.beltImages = {};
        this.beltConfigs = new BeltConfig().beltConfigs;
        this.itemOpraper = null;
    }

    // Zorgt dat er een timer wordt gestart voor het spawnen van items op een bepaalde lopende band
    spawnItemTimer(key, x, y, beltGroup, belt, ground) {
        if (this.spawnTimers[key]) {
            this.spawnTimers[key].remove(false);
        }

        this.spawnTimers[key] = this.time.addEvent({
            delay: this.spawnDelay,
            loop: true,
            // Items worden gespawned op de lopende band
            callback: () => {
                const newItem = new Item(this, x, y, beltGroup, belt).setSize(700, 700).setDepth(2);
                this.items.push(newItem);
                this.physics.add.collider(newItem, ground);

                if (this.itemOpraper) this.itemOpraper.trackItem(newItem);
            }
        });

        return this.spawnTimers[key];
    }

    create() {
        this.settings = Settings.getSettings();
        this.achievements = Achievements.getAchievements();

        // Achtergrond geluid
        this.industrialSound = this.sound.add('industrial-sound', {
            loop: true,
            volume: this.settings.soundOn ? this.settings.volume / 30 : 0
        });
        this.industrialSound.play();

        // Achtergrond afbeelding
        this.add.image(512, 740, 'background').setScale(1.1);

        // Camera en wereld grenzen instellen
        this.cameras.main.setBounds(0, 0, 1024, 1536);
        this.physics.world.setBounds(0, 0, 1024, 1536);

        // Scrollen met muiswiel
        this.input.on('wheel', (_pointer, _gameObjects, _deltaX, deltaY) => {
            const cam = this.cameras.main;
            cam.scrollY += deltaY * 0.5;
            cam.scrollY = Phaser.Math.Clamp(cam.scrollY, 0, cam.bounds.height - cam.height);
        });

        // Beginpositie camera
        this.cameras.main.scrollY = 768;

        // Spawn snelheid voor items op lopende banden
        this.spawnDelay = parseInt(localStorage.getItem('upgradespawnrate')) || 5000;

        // Grond waar speler op loopt wordt aangeroepen
        this.ground = this.physics.add.staticGroup();
        this.ground.create(512, 1540, 'ground').setScale(0.8, 1).refreshBody().setVisible(false);

        // Donut object aanmaken
        this.donut = new Donut(this);
        this.donut.addEvents();

        // Player aanmaken met skin uit localStorage
        const selectedSkin = localStorage.getItem('selectedSkin') || 'player2';
        this.player = new Player(this, 812, 1410, selectedSkin).setDepth(2);
        this.player.create();
        this.physics.add.collider(this.player, this.ground);

        EventBus.on('skinSelected', (skinKey) => {
        if (this.scene.isActive() && this.player) {
        this.player.updateSkin(skinKey);
        }
        });

        this.itemOpraper = new Item_oprapen(this, this.player);

        // De lopende banden activeren op basis van upgrades
        this.activateBelt(1);
        const upgradeManager = new UpgradeManager(this);
        for (let i = 2; i <= 10; i++) {
            if (upgradeManager.isBeltUnlocked(i)) this.activateBelt(i);
        }

        // Luister naar spawn rate upgrade events
        EventBus.on('spawn-rate-upgrade-purchased', () => {
            this.updateSpawnRate(parseInt(localStorage.getItem('upgradespawnrate')));
        });

        // Luister naar lopende band unlock events
        EventBus.on('belt-upgrade-purchased', () => {
            for (let i = 2; i <= 10; i++) {
                if (upgradeManager.isBeltUnlocked(i)) this.activateBelt(i);
            }
        });

        EventBus.emit('current-scene-ready', this);
    }

    // Update spawn snelheid voor items op lopende banden
    updateSpawnRate(newDelay) {
        this.spawnDelay = newDelay;

        // Verwijder bestaande timers
        for (const key in this.spawnTimers) {
            if (this.spawnTimers[key]) {
                this.spawnTimers[key].remove(false);
                delete this.spawnTimers[key];
            }
        }

        // Start nieuwe timers met de nieuwe spawn snelheid
        for (let i = 1; i <= 10; i++) {
            const cfg = this.beltConfigs[i];
            if (!cfg) continue;
            const belt = this.belts[i];
            if (belt) {
                const group = this.beltGroups[i];
                this.spawnItemTimer(cfg.key, cfg.spawnX, cfg.spawnY, group, belt, this.ground);
            }
        }
    }

    // Activeer een lopende band op basis van index
    activateBelt(i) {
        const cfg = this.beltConfigs[i];
        if (!cfg) return;

        const belt = new Belt(this, cfg.beltX, cfg.beltY, cfg.dir);
        const group = belt.create();
        this.belts[i] = belt;
        this.beltGroups[i] = group;
        this.physics.add.collider(this.player, group);
        this.spawnItemTimer(cfg.key, cfg.spawnX, cfg.spawnY, group, belt, this.ground);

        // Voeg de lopende band afbeelding toe
        this.beltImages[i] = this.add.image(cfg.imgX, cfg.imgY, 'conveyor-belt').setScale(1, 0.8).setDepth(1);
        this.add.image(cfg.imgX, cfg.imgY, 'conveyor-belt').setScale(1, 0.8).setDepth(1);
    }

    update() {
        // Update speler en lopende banden
        if (this.player) this.player.update();
        for (let i = 1; i <= 10; i++) {
            if (this.belts[i]) this.belts[i].update();
        }
        // Update donut en item opraper
        if (this.donut) this.donut.update();
        if (this.itemOpraper) this.itemOpraper.update();
    }

    changeScene() {
        // Stopt het achtergrond geluid
        this.industrialSound.stop();
        // Verander naar de 'Recyclen' scene
        this.scene.start('Recyclen');
    }

    changeScenePauze() {
        // Stopt het achtergrond geluid
        this.industrialSound.pause();
        // Verander naar de 'MenuScene' scene
        this.scene.start('MenuScene');
    }
}
