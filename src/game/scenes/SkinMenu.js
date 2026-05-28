import { EventBus } from '../EventBus.js';
import { Achievements } from './Achievements'


export default class SkinMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'SkinMenu' });
        this.currentIndex = 0;
    }

    create() {
        // Overlay dimming
        this.overlay = this.add.rectangle(
        0, 0,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.6
    ).setOrigin(0);

    const width = 580;
    const height = 640;
    const radius = 30; // Ronde hoeken menu
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    // Schaduw achter menu
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(this.centerX - width / 2 + 6, this.centerY - height / 2 + 6, width, height, radius);

    // Menu box met nieuwe achtergrondkleur #74c279
    this.menuBox = this.add.graphics();
    this.menuBox.fillStyle(0x74c279, 0.95);
    this.menuBox.fillRoundedRect(this.centerX - width / 2, this.centerY - height / 2, width, height, radius);

    // Donkergroen rand rond menu
    this.menuBox.lineStyle(3, 0x0a2d0b);
    this.menuBox.strokeRoundedRect(this.centerX - width / 2, this.centerY - height / 2, width, height, radius);

    this.initData();
    this.createUI();
}


    initData() {
        this.skins = [
            { key: 'player2', unlocked: true, name: "Green Guy", cost: 0 },
            { key: 'alex', unlocked: false, name: "Alex", cost: 500 },
            { key: 'player5', unlocked: false, name: "Afval monster", cost: 1500 },
            { key: 'player4', unlocked: false, name: "Blue Buddy", cost: 2500 },
            { key: 'player7', unlocked: false, name: "Sneeuwman", cost: 3500 },
            { key: 'player6', unlocked: false, name: "Milan Kerst", cost: 4000 },
            { key: 'player', unlocked: false, name: "Milan", cost: 5000 }
        ];

        this.skins.forEach(skin => {
            const unlocked = localStorage.getItem(`skin-${skin.key}`);
            if (unlocked === '1') skin.unlocked = true;
        });

        const savedSkin = localStorage.getItem('selectedSkin') || 'player2';
        this.currentIndex = this.skins.findIndex(s => s.key === savedSkin);
        if (this.currentIndex === -1) this.currentIndex = 0;

        this.geld = parseInt(localStorage.getItem('Geld')) || 0;
        // Achievement: Geldbaas
        if (window.Achievements && !window.Achievements.getAchievements()['geldbaas'].unlocked && this.geld >= 10000) {
            window.Achievements.giveAchievement('geldbaas');
        }
    }

    createUI() {
        this.title = this.add.text(this.centerX, this.centerY - 250, 'KIES JE SKIN', {
            fontFamily: 'HanaleiFill',
            fontSize: 50,
            color: '#e0ffdc'
        }).setOrigin(0.5);

        this.geldText = this.add.text(this.centerX, this.centerY - 200, `Geld: ${this.geld}`, {
            fontFamily: 'Montserrat',
            fontSize: 28,
            color: '#ffff00'
        }).setOrigin(0.5);

        this.createCharacter();
        this.createNavigationButtons();
        this.createSelectButton();
        this.createCloseButton();
    }

    createCharacter() {
        if (this.playerSprite) this.playerSprite.destroy();
        if (this.lockIcon) this.lockIcon.destroy();
        if (this.skinNameText) this.skinNameText.destroy();
        if (this.costText) this.costText.destroy();

        const current = this.skins[this.currentIndex];

        this.playerSprite = this.add.sprite(this.centerX, this.centerY - 50, current.key)
            .setOrigin(0.5)
            .setScale(1);

        if (!current.unlocked) {
            this.playerSprite.setTint(0x444444);

        this.lockIcon = this.add.text(
        this.centerX,
        this.centerY - 50,
        "🔒",
        {
            fontFamily: "Arial, sans-serif",
            fontSize: "50px",
            color: "#ff3333"
            }
        ).setOrigin(0.5);
        }

        let text = current.name;
        const selectedSkin = localStorage.getItem('selectedSkin');

        this.skinNameText = this.add.text(this.centerX, this.centerY + 107, text, {
            fontFamily: 'Montserrat',
            fontSize: 30,
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    createNavigationButtons() {
        this.leftBtn = this.createRoundedButton(
            this.centerX - 200, this.centerY - 50, "<",
            () => {
                this.currentIndex = (this.currentIndex - 1 + this.skins.length) % this.skins.length;
                this.refreshUI();
            },
            90, 65
        );

        this.rightBtn = this.createRoundedButton(
            this.centerX + 200, this.centerY - 50, ">",
            () => {
                this.currentIndex = (this.currentIndex + 1) % this.skins.length;
                this.refreshUI();
            },
            90, 65
        );
    }

    createRoundedButton(x, y, text, callback, width = 110, height = 70) {
        const radius = 12;
        const container = this.add.container(x, y)
            .setSize(width, height)
            .setInteractive({ useHandCursor: true });

        // Shadow
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.35);
        shadow.fillRoundedRect(-width / 2 + 3, -height / 2 + 3, width, height, radius);
        container.add(shadow);

        // Button background kleur #0d4411
        const bg = this.add.graphics();
        bg.fillStyle(0x0d4411, 1);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
        container.add(bg);

        const label = this.add.text(0, 0, text, {
            fontFamily: 'Montserrat',
            fontSize: 40,
            color: "#ffffff"
        }).setOrigin(0.5);
        container.add(label);

        container.on('pointerdown', callback);

        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0x145a14, 1); // lichter groen bij hover
            bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
            this.tweens.add({ targets: container, scale: 1.08, duration: 120 });
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0x0d4411, 1);
            bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
            this.tweens.add({ targets: container, scale: 1.0, duration: 120 });
        });

        return container;
    }

    createSelectButton() {
        this.selectBtn = this.createRoundedButton(
            this.centerX,
            this.centerY + 180,
            "",
            () => this.selectSkin(),
            260, 80
        );
        this.updateSelectButton();
    }

    updateSelectButton() {
        const current = this.skins[this.currentIndex];
        const selectedSkin = localStorage.getItem('selectedSkin');
        const label = this.selectBtn.list[2];

        if (selectedSkin === current.key) {
            label.setText("EQUIPPED");
        } else if (current.unlocked) {
            label.setText("SELECTEER");
        } else {
            label.setText(`KOOP (${current.cost})`);
        }
    }

    selectSkin() {
        const current = this.skins[this.currentIndex];
        console.log(current);


        if (!current.unlocked) {
            // ik ga ervan uit dat dit het koop stuk is (Dion)
            if (this.geld >= current.cost) {
                this.geld -= current.cost;
                localStorage.setItem('Geld', this.geld);
                current.unlocked = true;
                localStorage.setItem(`skin-${current.key}`, "1");
                if (!Achievements.getAchievements()['eersteSkin']['unlocked']) {
                    Achievements.giveAchievement('eersteSkin');
                } 
                if (!Achievements.getAchievements()['milan']['unlocked'] && current.name === 'Milan') {
                    Achievements.giveAchievement('milan');
                }
                
            } else {
                this.showMessage(`Je komt ${current.cost - this.geld} tekort!`);
                return;
            }
        }

        localStorage.setItem('selectedSkin', current.key);
        EventBus.emit('skinSelected', current.key);
        this.refreshUI();
    }

    createCloseButton() {
        this.closeBtn = this.createRoundedButton(
        this.centerX + 240,
        this.centerY - 270,
        "✕",
        () => {
            if (this.scene.isActive('MenuScene')) {
                this.scene.resume('MenuScene');
            } else {
                this.scene.start('MenuScene');
            }
                this.scene.stop(); // Sluit SkinMenu
        },
        50, 50
    );

        const bg = this.closeBtn.list[1];
        const label = this.closeBtn.list[2];

        label.setFontSize(32);

        // Rode kleur close button
        bg.clear();
        bg.fillStyle(0xb02a2a, 1);
        bg.fillRoundedRect(-25, -25, 50, 50, 12);

        // Hover effect voor close button
        this.closeBtn.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0xd64545, 1);
            bg.fillRoundedRect(-25, -25, 50, 50, 12);
            this.tweens.add({ targets: this.closeBtn, scale: 1.08, duration: 120 });
        });

        this.closeBtn.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0xb02a2a, 1);
            bg.fillRoundedRect(-25, -25, 50, 50, 12);
            this.tweens.add({ targets: this.closeBtn, scale: 1.0, duration: 120 });
        });
    }

    refreshUI() {
        this.geldText.setText(`Geld: ${this.geld}`);
        this.createCharacter();
        this.updateSelectButton();
    }

    showMessage(text) {
        const msg = this.add.text(this.centerX, this.centerY + 240, text, {
            fontFamily: 'Montserrat',
            fontSize: 22,
            color: '#ff5555'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: msg,
            alpha: { from: 1, to: 0 },
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }
}
