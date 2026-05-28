import { Scene } from 'phaser';
import { Pause } from './Pause';
import createAchievementsUI from '../extra/achievementsComponents.js';
import achievementsDefault from '../../../achievementsDefault.json';
import { showAchievement } from '../extra/AchievementToast.js';    

export class Achievements extends Scene {
    constructor() {
        super('Achievements');
    }

    // Rounded button utility (copied from Settings.js)
    createRoundedButton(x, y, text, callback, width = 70, height = 70) {
        const radius = 12;
        const container = this.add.container(x, y)
            .setSize(width, height)
            .setInteractive({ useHandCursor: true });

        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.35);
        shadow.fillRoundedRect(-width / 2 + 3, -height / 2 + 3, width, height, radius);
        container.add(shadow);

        const bg = this.add.graphics();
        bg.fillStyle(0xb02a2a, 1);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
        container.add(bg);

        const label = this.add.text(0, 0, text, {
            fontFamily: 'Montserrat',
            fontSize: 32,
            color: "#ffffff"
        }).setOrigin(0.5);
        container.add(label);

        container.on('pointerdown', callback);

        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0xd64545, 1);
            bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
            this.tweens.add({ targets: container, scale: 1.08, duration: 120 });
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0xb02a2a, 1);
            bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
            this.tweens.add({ targets: container, scale: 1.0, duration: 120 });
        });

        return container;
    }

    // Close button for panel (same style as Settings)
    createCloseButton(panelX, panelY) {
        const x = panelX + 600 - 40;
        const y = panelY + 40;

        const btn = this.createRoundedButton(x, y, "✕", () => {
            this.scene.stop();
            this.scene.resume('MenuScene');
        }, 50, 50);

        // Hover effect and color as in Settings
        const bg = btn.list[1];
        const label = btn.list[2];
        label.setFontSize(32);

        btn.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0xd64545, 1);
            bg.fillRoundedRect(-25, -25, 50, 50, 12);
            this.tweens.add({ targets: btn, scale: 1.08, duration: 120 });
        });

        btn.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0xb02a2a, 1);
            bg.fillRoundedRect(-25, -25, 50, 50, 12);
            this.tweens.add({ targets: btn, scale: 1.0, duration: 120 });
        });
    }

    static save(data) {
        try {
            localStorage.setItem('achievements', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save achievements to localStorage', e);
        }
    }

    // sets achievement true en geeft melding met melding manager en geeft geld
    static giveAchievement(name) {
        const msg = name + 'unlocked!';

        let currentScene = null;
        try {
            if (typeof window !== 'undefined' && window.GAME && window.GAME.scene && window.GAME.scene.getScenes) {
                const scenes = window.GAME.scene.getScenes(true);
                if (Array.isArray(scenes) && scenes.length) currentScene = scenes[scenes.length - 1];
            }
        } catch (e) {
            // ignore — showAchievement will handle missing scene
        }

        showAchievement(currentScene, Achievements.getAchievements()[name]?.iconName, msg);
        Achievements.setAchievement(name, true);
        try {
            const creds = Number(Achievements.getAchievements()[name]?.creds || 0);
            const current = Number(localStorage.getItem('Geld')) || 0;
            localStorage.setItem('Geld', String(current + creds));
            // Achievement: Geldbaas
            if (window.Achievements && !window.Achievements.getAchievements()['geldbaas'].unlocked && (current + creds) >= 10000) {
                window.Achievements.giveAchievement('geldbaas');
            }
        } catch (e) {
            console.warn('Failed to update Geld for achievement', name, e);
        }
    }

    // sets achievement true of false
    static setAchievement(name, unlocked) {
        const achievements = Achievements.getAchievements();

        if (!achievements || typeof achievements !== 'object') {
            console.warn('No achievements available to update');
            return;
        }

        if (!achievements[name]) {
            // If the achievement doesn't exist in saved/default list, create a minimal entry
            achievements[name] = { title: name, desc: '', unlocked: false };
        }

        achievements[name].unlocked = unlocked;

        try {
            localStorage.setItem('achievements', JSON.stringify(achievements));
        } catch (e) {
            console.warn('Failed to save achievements to localStorage', e);
        }
    }

    // haal alle achievements op, of de default als er geen zijn
    static getAchievements() {

        let achievements;

        try {
            const raw = localStorage.getItem('achievements');

            if (raw) {
                const parsed = JSON.parse(raw);
                achievements = Object.assign({}, achievementsDefault, parsed);
            } else {
                achievements = JSON.parse(JSON.stringify(achievementsDefault));
            }

            this.save(achievements)
        } catch (e) {
            console.warn('Failed to parse saved achievements, using defaults.', e);
            achievements = JSON.parse(JSON.stringify(achievementsDefault));
        }

        return achievements;
    }

    // reset alle achievements, puur voor debuggen
    static resetAchievements() {
        try {
            localStorage.removeItem('achievements');
        } catch (e) {
            console.warn('Failed to remove achievements from localStorage', e);
        }
    }

    create() {
        this.scene.bringToTop();    
        // Achievements.resetAchievements(); // ALLEEN VOOR DEBUGGEN, VERWIJDEREN IN PRODUCTIE
        const achievements = Achievements.getAchievements();

        // Use the same panel dimensions as achievementsComponents.js
        const panelWidth = 700;
        const panelHeight = 500;
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const panelX = centerX - panelWidth / 2;
        const panelY = centerY - panelHeight / 2;

        const borderThickness = 3; // dikte van de rand
        const borderColor = 0x0a2d0b; // donker groen
        const border = this.add.graphics();
        border.lineStyle(borderThickness, borderColor, 1);
        border.strokeRoundedRect(panelX - borderThickness / 2, panelY - borderThickness / 2, panelWidth + borderThickness, panelHeight + borderThickness, 16);

        
        createAchievementsUI(this, { achievements });

        // Add close button to achievements panel (top-right corner)
        this.createCloseButton(panelX + 90, panelY);
    }

    update() {
        this.input.keyboard.on('keydown-ESC', () => {
            Pause.unpause(this, 'MenuScene');
        }); 
    }
}
