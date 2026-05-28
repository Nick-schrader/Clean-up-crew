import { Scene } from 'phaser';
import { Pause } from './Pause';
import getPhaserKey from '../extra/keyboardMap';
import {
    createPanel,
    createToggleRow,
    createValueRow,
    createControlRow,
    setupListScrolling,
    createSliderRow
} from '../extra/settingsComponents.js';
import settingsDefault from '../../../settingsDefault.json';

export class Settings extends Scene {
    constructor() {
        super('Settings');
    }

    static getSettings() {
        let settings;

        try {
            const raw = localStorage.getItem('settings');

            if (raw) {
                const parsed = JSON.parse(raw);
                settings = Object.assign({}, settingsDefault, parsed);
                settings.controls = Object.assign({}, settingsDefault.controls, parsed.controls || {});
            } else {
                settings = JSON.parse(JSON.stringify(settingsDefault));
            }

            Settings.save(settings);

        } catch (e) {
            console.warn('Failed to parse saved settings, using defaults.', e);
            settings = JSON.parse(JSON.stringify(settingsDefault));
        }

        return settings;
    }

    static save(data) {
        try {
            localStorage.setItem('settings', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save settings', e);
        }
    }

    create() {
        this.scene.bringToTop();

        const menuScene = this.scene.get('MenuScene');

        const { width, height } = this.scale;
        const panelWidth = 600;
        const panelHeight = 500;
        const panelX = (width - panelWidth) / 2;
        const panelY = 75;

        // Donkergroene rand rondom panel
        const borderThickness = 3; // dikte van de rand
        const borderColor = 0x0a2d0b; // donker groen
        const border = this.add.graphics();
        border.lineStyle(borderThickness, borderColor, 1);
        border.strokeRoundedRect(panelX - borderThickness / 2, panelY - borderThickness / 2, panelWidth + borderThickness, panelHeight + borderThickness, 16);

        // Panel maken
        createPanel(this, {
            x: panelX,
            y: panelY,
            width: panelWidth,
            height: panelHeight,
            title: 'SETTINGS',
            exitFunc: () => {
                Settings.save(this.settingsData);
                Pause.unpause(this, 'MenuScene');
            }
        });

        // Close button plaatsen
        this.createCloseButton(panelX, panelY);

        // Settings ophalen
        this.settingsData = Settings.getSettings();

        const rowHeight = 70;
        const rowSpacing = 15;
        const rowWidth = panelWidth - 60;
        const rowX = panelX + (panelWidth - rowWidth) / 2;
        const startListYOffset = 100;

        // Scrollable list
        const listGroup = this.add.container(0, 0);
        const listMask = this.add.rectangle(
            panelX + 30, panelY + startListYOffset,
            panelWidth - 60, panelHeight - startListYOffset - 30,
            0x000000, 0
        ).setOrigin(0, 0);

        // Toggles
        const toggles = [
            { key: 'soundOn', label: 'Geluid', type: 'toggle' },
            { key: 'volume', label: 'Volume', type: 'value' }
        ];

        let yPos = 0;
        toggles.forEach((t, i) => {
            const y = yPos + i * (rowHeight + rowSpacing);

            if (t.type === 'toggle') {
                listGroup.add(
                    createToggleRow(this, rowX, y + (panelY + startListYOffset),
                        rowWidth, rowHeight, t.label,
                        !!this.settingsData[t.key],
                        (v) => this.settingsData[t.key] = v)
                );
            } else {
                listGroup.add(
                    createValueRow(this, rowX, y + (panelY + startListYOffset),
                        rowWidth, rowHeight, t.label,
                        this.settingsData.volume,
                        (v) => this.settingsData.volume = v)
                );
            }
        });

        // Volume slider row
        yPos += rowHeight + rowSpacing;
        listGroup.add(
            createSliderRow(
                this,
                rowX,
                yPos + (panelY + startListYOffset),
                rowWidth,
                rowHeight,
                'Volume',
                this.settingsData.volume,
                (v) => {
                    this.settingsData.volume = v;
                    menuScene.mainMusic.volume = this.settingsData.soundOn ? v / 30 : 0;
                },
                0, 100
            )
        );

        yPos += rowHeight + rowSpacing;

        // Keyboard controls
        const controlOrder = [
            ['up', 'Omhoog'], ['upAlt', 'Omhoog (Alt)'],
            ['down', 'Omlaag'], ['downAlt', 'Omlaag (Alt)'],
            ['left', 'Links'], ['leftAlt', 'Links (Alt)'],
            ['right', 'Rechts'], ['rightAlt', 'Rechts (Alt)'],
            ['pickup', 'Oprapen'], ['pickupAlt', 'Oprapen (Alt)'],
            ['recycle', 'Recycle'], ['recycleAlt', 'Recycle (Alt)']
        ];

        this.controlTexts = {};

        controlOrder.forEach((entry, idx) => {
            const key = entry[0];
            const label = entry[1];
            const y = yPos + idx * (rowHeight + rowSpacing);
            const current = (this.settingsData.controls && this.settingsData.controls[key]) || '';

            this.controlTexts[key] = createControlRow(
                this, rowX, y + (panelY + startListYOffset),
                rowWidth, rowHeight, label, current,
                (storeVal) => {
                    if (!this.settingsData.controls) this.settingsData.controls = {};
                    this.settingsData.controls[key] = storeVal;
                }
            );

            listGroup.add(this.controlTexts[key]);
        });

        const contentHeight = yPos + controlOrder.length * (rowHeight + rowSpacing) + 60;
        setupListScrolling(this, {
            listGroup,
            maskShape: listMask,
            contentHeight,
            viewHeight: panelHeight - startListYOffset - 30,
            listY: panelY + startListYOffset
        });

        // Snel sluiten met ESC
        this.input.keyboard.on('keydown-ESC', () => {
            Settings.save(this.settingsData);
            menuScene.mainMusic.volume = Settings.getSettings()['soundOn'] ? Settings.getSettings()['volume'] / 30 : 0;
            Pause.unpause(this, 'MenuScene');
        });
    }

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

    // Close button op panel (zelfde stijl als Credits)
    createCloseButton(panelX, panelY) {
        const x = panelX + 600 - 40;
        const y = panelY + 40;

        const btn = this.createRoundedButton(x, y, "✕", () => {
            Settings.save(this.settingsData);
            Pause.unpause(this, 'MenuScene');
        }, 50, 50); // zelfde grootte als in Credits

        // Hover effect en kleur zoals in Credits
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
}
