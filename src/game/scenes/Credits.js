import { EventBus } from '../EventBus.js';
import { showMenu, hideMenu } from '../extra/menuAnimation.js'; 

export default class Credits extends Phaser.Scene {
    constructor() {
        super({ key: 'Credits' });
    }

    create() {
        this.menuScene = this.scene.get('MenuScene');
        if (this.menuScene.mainMusic.isPlaying) this.menuScene.mainMusic.pause();

        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;

        // Overlay dimming
        this.overlay = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.6
        ).setOrigin(0);

        const width = 600;
        const height = 700;
        const radius = 30;

        // Menu container, start buiten het scherm
        this.menuContainer = this.add.container(this.centerX, this.cameras.main.height + height / 2);

        // Shadow achter menu
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.4);
        shadow.fillRoundedRect(-width / 2 + 6, -height / 2 + 6, width, height, radius);
        this.menuContainer.add(shadow);

        // Menu box
        this.menuBox = this.add.graphics();
        this.menuBox.fillStyle(0x74c279, 0.95);
        this.menuBox.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
        this.menuBox.lineStyle(3, 0x0a2d0b);
        this.menuBox.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
        this.menuContainer.add(this.menuBox);

        // Voeg UI en knop toe aan container
        this.createUI(this.menuContainer);
        this.createCloseButton(this.menuContainer);

        // Toon animatie
        showMenu(this, this.menuContainer);
    }

    createUI(container) {
        // Titel
        const title = this.add.text(0, -300, 'CREDITS', {
            fontFamily: 'HanaleiFill',
            fontSize: 64,
            color: '#e0ffdc'
        }).setOrigin(0.5);
        container.add(title);

        const teamMembers = [
            { name: "Julian Huis in 't Veld", github: "https://github.com/JulianHV" },
            { name: "Nick Schrader", github: "https://github.com/Nick-schrader" },
            { name: "Thijs van Waveren", github: "https://github.com/TVW23" },
            { name: "Dion Gieman", github: "https://diongierman.nl" }
        ];

        const subtitle = this.add.text(0, -180, 'Gemaakt door:', {
            fontFamily: 'Montserrat',
            fontSize: 28,
            color: '#ffffff'
        }).setOrigin(0.5);
        container.add(subtitle);

        let startY = -100;
        teamMembers.forEach((member, i) => {
            const txt = this.add.text(0, startY + i * 45, member.name, {
                fontFamily: 'Montserrat',
                fontSize: 26,
                color: '#f0f0f0'
            }).setOrigin(0.5)
              .setInteractive({ useHandCursor: true });

            txt.on('pointerup', () => window.open(member.github, "_blank"));
            txt.on('pointerover', () => txt.setColor("#d2ffd2"));
            txt.on('pointerout', () => txt.setColor("#f0f0f0"));

            container.add(txt);
        });

        const footer1 = this.add.text(0, 200, 'Schoolproject 2025', {
            fontFamily: 'Montserrat',
            fontSize: 24,
            color: '#d0ffd6',
            align: 'center'
        }).setOrigin(0.5);
        container.add(footer1);

        const footer2 = this.add.text(0, 250, 'Copyright © 2025 Clean-up crew.', {
            fontFamily: 'Montserrat',
            fontSize: 24,
            color: '#d0ffd6',
            align: 'center'
        }).setOrigin(0.5);
        container.add(footer2);
    }

    createRoundedButton(x, y, text, callback, width = 110, height = 70) {
        const radius = 12;
        const container = this.add.container(x, y)
            .setSize(width, height)
            .setInteractive({ useHandCursor: true });

        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.35);
        shadow.fillRoundedRect(-width / 2 + 3, -height / 2 + 3, width, height, radius);
        container.add(shadow);

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
            bg.fillStyle(0x145a14, 1);
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

    createCloseButton(container) {
        const btn = this.createRoundedButton(
            240,
            -300,
            "✕",
            () => {
                // Pas scene switch toe nadat animatie klaar is
                hideMenu(this, container, () => {
                    if (this.scene.isActive('MenuScene')) this.scene.resume('MenuScene');
                    else this.scene.start('MenuScene');
                });
            },
            50, 50
        );

        const bg = btn.list[1];
        const label = btn.list[2];

        label.setFontSize(32);
        bg.clear();
        bg.fillStyle(0xb02a2a, 1);
        bg.fillRoundedRect(-25, -25, 50, 50, 12);

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

        container.add(btn);
    }
}
