import { loadMont, loadHan } from './fontloader.js';

let canScroll = true;

loadMont().then(() => {
    console.log("Mont loaded");
});

loadHan().then(() => {
    console.log("Han loaded");
});

const FONTS = {
    title: { font: '42px HanaleiFill', color: '#D5D5D5' },
    label: { font: '22px Montserrat', color: '#D5D5D5', fontStyle: 'bold' },
    value: { font: '20px Montserrat', color: '#0F0F0F' }
};

//
// Background helpers
//
function drawRoundedRect(scene, { x, y, w, h, radius = 12, color = 0xD5D5D5, alpha = 1 }) {
    const g = scene.add.graphics();
    g.fillStyle(color, alpha);
    g.fillRoundedRect(x, y, w, h, radius);
    return g;
}

export function createPanel(scene, { x, y, width = 600, height = 500, title = 'SETTINGS', exitFunc = () => {} } = {}) {
    const g = scene.add.graphics();
    g.fillStyle(0x74C279, 1);
    g.fillRoundedRect(x, y, width, height, 12);

    scene.add.text(x + 30, y + 24, title, FONTS.title);

    return { x, y, width, height};
}

export function createRowBackground(scene, x, y, w, h) {
    return drawRoundedRect(scene, { x, y, w, h, radius: 10, color: 0x375C3A });
}

//
// Toggle Row (On/Off)
//
export function createToggleRow(scene, x, y, w, h, label, currentValue, onToggle) {
    const container = scene.add.container(0, 0);
    const bg = createRowBackground(scene, x, y, w, h);
    const labelText = scene.add.text(x + 20, y + h / 2, label, FONTS.label).setOrigin(0, 0.5);
    const btnH = 56;
    const btnW = 76;
    const btnX = x + w - btnW - 20;
    const btnY = y + (h - btnH) / 2;
    const btnBg = drawRoundedRect(scene, { x: btnX, y: btnY, w: btnW, h: btnH, radius: btnH / 8 });
    const txt = scene.add
        .text(btnX + btnW / 2, btnY + btnH / 2, currentValue ? 'Aan' : 'Uit', FONTS.value)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
    txt.on('pointerup', () => {
        currentValue = !currentValue;
        txt.setText(currentValue ? 'Aan' : 'Uit');
        onToggle?.(currentValue);
    });
    container.add([bg, labelText, btnBg, txt]);
    return container;
}

//
// Value Row (e.g., Volume %)
//
export function createValueRow(scene, x, y, w, h, label, value, onChange) {
    const container = scene.add.container(0, 0);
    const bg = createRowBackground(scene, x, y, w, h);
    const labelText = scene.add.text(x + 20, y + h / 2, label, FONTS.label).setOrigin(0, 0.5);
    const btnH = 56;
    const btnW = 76;
    const btnX = x + w - btnW - 20;
    const btnY = y + (h - btnH) / 2;
    const btnBg = drawRoundedRect(scene, { x: btnX, y: btnY, w: btnW, h: btnH });
    const current = value ?? 70;
    const txt = scene.add
        .text(btnX + btnW / 2, btnY + btnH / 2, `${current}%`, FONTS.value)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
    txt.on('pointerup', () => {
        const input = window.prompt('Set value (0–100)', String(value ?? 70));
        if (input === null) return;
        const n = parseInt(input, 10);
        if (!Number.isNaN(n) && n >= 0 && n <= 100) {
            txt.setText(`${n}%`);
            onChange?.(n);
        } else {
            window.alert('Enter a number between 0 and 100');
        }
    });
    container.add([bg, labelText, btnBg, txt]);
    return container;
}

// Slider Row (Phaser only, refactored)
function createSliderBar(scene, x, y, w, h) {
    const bar = scene.add.graphics();
    bar.fillStyle(0xD5D5D5, 1);
    bar.fillRoundedRect(x, y - h / 2, w, h, h / 2);
    return bar;
}

function createSliderKnob(scene, x, y, r, value, min, max, sliderW, sliderX) {
    const knobX = sliderX + ((value - min) / (max - min)) * sliderW;
    const knob = scene.add.graphics();
    knob.fillStyle(0x74C279, 1);
    knob.fillCircle(knobX, y, r);
    knob.setInteractive(new Phaser.Geom.Circle(knobX, y, r), Phaser.Geom.Circle.Contains);
    return knob;
}

function updateSliderKnob(knob, x, y, r) {
    knob.clear();
    knob.fillStyle(0x74C279, 1);
    knob.fillCircle(x, y, r);
}

function createSliderValue(scene, x, y, w, h, value, min, max, knob, sliderX, sliderY, sliderW, knobR, onChange) {
    const valueBg = drawRoundedRect(scene, { x, y: y - h / 2, w, h });
    const valueText = scene.add.text(x + w / 2, y, `${value}`, FONTS.value)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
    valueText.on('pointerup', () => {
        const input = window.prompt(`Set value (${min}–${max})`, String(value));
        if (input === null) return;
        const n = parseInt(input, 10);
        if (!Number.isNaN(n) && n >= min && n <= max) {
            valueText.setText(`${n}`);
            // Move knob to correct position
            let px = sliderX + ((n - min) / (max - min)) * sliderW;
            updateSliderKnob(knob, px, sliderY, knobR);
            onChange?.(n);
        } else {
            window.alert(`Enter a number between ${min} and ${max}`);
        }
    });
    return { valueBg, valueText };
}

export function createSliderRow(scene, x, y, w, h, label, value, onChange, min = 0, max = 100) {
    const container = scene.add.container(0, 0);
    const bg = createRowBackground(scene, x, y, w, h);
    const labelText = scene.add.text(x + 20, y + h / 2, label, FONTS.label).setOrigin(0, 0.5);
    const btnH = 56;
    const btnW = 76;
    const sliderW = w - 300;
    const sliderH = 8;
    const sliderX = x + w - btnW - 40 - sliderW;
    const sliderY = y + h / 2;
    const bar = createSliderBar(scene, sliderX, sliderY, sliderW, sliderH);
    const knobR = 16;
    let knobValue = value ?? min;
    const knob = createSliderKnob(scene, sliderX, sliderY, knobR, knobValue, min, max, sliderW, sliderX);
  
    const valueX = sliderX + sliderW + 20;
    const valueY = sliderY;
    const { valueBg, valueText } = createSliderValue(scene, valueX, valueY, btnW, btnH, knobValue, min, max, knob, sliderX, sliderY, sliderW, knobR, (n) => {
        knobValue = n;
        onChange?.(n);
    });
    // Drag logic
    knob.on('pointerdown', (pointer) => {
        canScroll = false;
        scene.input.on('pointermove', moveHandler);
        scene.input.on('pointerup', upHandler);
        function moveHandler(movePointer) {
            let px = Phaser.Math.Clamp(movePointer.x, sliderX, sliderX + sliderW);
            updateSliderKnob(knob, px, sliderY, knobR);
            // Calculate value
            const newValue = Math.round(min + ((px - sliderX) / sliderW) * (max - min));
            valueText.setText(`${newValue}`);
            knobValue = newValue;
            onChange?.(newValue);
        }
        function upHandler() {
            scene.input.off('pointermove', moveHandler);
            scene.input.off('pointerup', upHandler);
            canScroll = true;
        }
    });
    container.add([bg, labelText, bar, knob, valueBg, valueText]);
    return container;
}

//
// Control Row (key remapping)
//
export function createControlRow(scene, x, y, w, h, keyName, currentBinding, onRemap) {
    const container = scene.add.container(0, 0);
    const bg = createRowBackground(scene, x, y, w, h);
    const labelText = scene.add.text(x + 20, y + h / 2, keyName, FONTS.label).setOrigin(0, 0.5);
    const kh = 56;
    const kw = 76;
    const kx = x + w - kw - 20;
    const ky = y + (h - kh) / 2;
    const btnBg = drawRoundedRect(scene, { x: kx, y: ky, w: kw, h: kh });
    const display = currentBinding ? currentBinding.toUpperCase() : 'None';
    const val = scene.add
        .text(kx + kw / 2, ky + kh / 2, display, FONTS.value)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
    val.on('pointerup', () => {
        const previous = currentBinding || '';
        val.setText('Press any key...');
        val.setStyle({ backgroundColor: '#dddddd' });
        const isModifier = (k) => ['Shift', 'Control', 'Alt', 'Meta'].includes(k);
        const cleanup = (timeoutEvent) => {
            scene.input.keyboard.off('keydown', keyHandler);
            scene.input.off('pointerdown', cancel);
            timeoutEvent?.remove(false);
            val.setStyle({ backgroundColor: null });
        };
        const updateText = (k) =>
            val.setText(k ? k.toUpperCase() : 'None');
        const cancel = () => {
            updateText(previous);
            cleanup(timeoutEvent);
        };
        const keyHandler = (event) => {
            const key = event.key;
            if (!key) return;
            if (key === 'Escape') return cancel();
            if (isModifier(key)) return;
            let mapped = '';
            if (key === ' ') mapped = 'space';
            else if (key.startsWith('Arrow')) mapped = key.replace('Arrow', '').toLowerCase();
            else mapped = key.toLowerCase();
            onRemap?.(mapped);
            updateText(mapped);
            cleanup(timeoutEvent);
        };
        const timeoutEvent = scene.time.delayedCall(8000, cancel);
        scene.input.keyboard.on('keydown', keyHandler);
        scene.input.on('pointerdown', cancel);
    });
    container.add([bg, labelText, btnBg, val]);
    return container;
}

//
// Scrolling
//

// Scrollable settings list (not camera)
export function setupListScrolling(scene, opts = {}) {
    const { listGroup, maskShape, contentHeight = 0, viewHeight = 400, listY = 0} = opts;
    let scrollY = 0;
    const maxScroll = 990;
    const minScroll = 170;

    // Mask for the group
    listGroup.setMask(maskShape.createGeometryMask());

    function setListY(y) {
        // Clamp scrollY zodat je niet verder naar boven kunt scrollen dan de startpositie (0)
        scrollY = Math.max(minScroll, Math.min(y, maxScroll));
        listGroup.y = listY - scrollY;
    }

    scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
        setListY(scrollY + deltaY);
    });

    let isDragging = false; let dragStartY = 100; let startScrollY = 0;
    scene.input.on('pointerdown', (pointer) => {
        if (pointer.rightButtonDown && pointer.rightButtonDown()) return;
        if (pointer.x < maskShape.x || pointer.x > maskShape.x + maskShape.width || pointer.y < maskShape.y || pointer.y > maskShape.y + maskShape.height) return;
        isDragging = true; dragStartY = pointer.y; startScrollY = scrollY;
    });
    scene.input.on('pointerup', () => { isDragging = false; });
    scene.input.on('pointermove', (pointer) => {
        if (!isDragging || !canScroll) return;
        const dy = pointer.y - dragStartY;
        setListY(startScrollY - dy);
    });

    scene.input.keyboard.on('keydown-UP', () => { setListY(scrollY - 40); });
    scene.input.keyboard.on('keydown-DOWN', () => { setListY(scrollY + 40); });

    return { setListY, maxScroll };
}

//
// High-level Composed Settings UI
//
export function createSettingsUI(scene, opts = {}) {
    const {
        settings = scene.constructor.getSettings?.() ?? {},
        panel = { width: 600, height: 500 },
        panelX = (width - panel.width) / 2,
        panelY = (height - panel.height) / 2,
        rowHeight = 70,
        rowSpacing = 15,
        rowWidth = panel.width - 60,
        rowX = panelX + (panel.width - rowWidth) / 2,
        startListYOffset = 100,
        exitFunc = () => {}
    } = opts;
    const { width, height } = scene.scale;
    createPanel(scene, { x: panelX, y: panelY, exitFunc, ...panel });

    // Scrollable List Group
    const listGroup = scene.add.container(0, 0);
    const listMask = scene.add.rectangle(panelX + 30, panelY + startListYOffset, panel.width - 60, panel.height - startListYOffset - 30, 0x000000, 0);
    listMask.setOrigin(0, 0);

    // Toggle rows -----------------------------------------------------------
    const configRows = [
        { key: 'kleurenblind', label: 'Kleurenblind modus', type: 'toggle' },
        { key: 'soundOn', label: 'Geluid', type: 'toggle' },
        { key: 'volume', label: 'Volume', type: 'slider' }
    ];

    let yPos = 0;
    configRows.forEach((row, i) => {
        const y = yPos + i * (rowHeight + rowSpacing);
        if (row.type === 'toggle') {
            listGroup.add(
                createToggleRow(
                    scene, rowX, y + (panelY + startListYOffset), rowWidth, rowHeight,
                    row.label,
                    Boolean(settings[row.key]),
                    (v) => settings[row.key] = v
                )
            );
        } else if (row.type === 'slider') {
            listGroup.add(
                createSliderRow(
                    scene, rowX, y + (panelY + startListYOffset), rowWidth, rowHeight,
                    row.label,
                    settings.volume ?? 70,
                    (v) => settings.volume = v,
                    0, 100
                )
            );
        }
    });

    // Control rows ----------------------------------------------------------
    yPos += configRows.length * (rowHeight + rowSpacing) + 20;

    const controlLabels = [
        ['up', 'Omhoog'], ['upAlt', 'Omhoog (Alt)'],
        ['down', 'Omlaag'], ['downAlt', 'Omlaag (Alt)'],
        ['left', 'Links'], ['leftAlt', 'Links (Alt)'],
        ['right', 'Rechts'], ['rightAlt', 'Rechts (Alt)'],
        ['pickup', 'Oprapen'], ['pickupAlt', 'Oprapen (Alt)'],
        ['recycle', 'Recycle'], ['recycleAlt', 'Recycle (Alt)']
    ];

    const controlTexts = {};

    controlLabels.forEach(([key, label], i) => {
        const y = yPos + i * (rowHeight + rowSpacing);
        const current = settings.controls?.[key] ?? '';
        controlTexts[key] = createControlRow(
            scene, rowX, y + (panelY + startListYOffset), rowWidth, rowHeight,
            label,
            current,
            (mapped) => {
                settings.controls ||= {};
                settings.controls[key] = mapped;
            }
        );
        listGroup.add(controlTexts[key]);
    });

    // Masked scroll area
    const contentHeight = yPos + controlLabels.length * (rowHeight + rowSpacing) + 60;
    setupListScrolling(scene, {
        listGroup,
        maskShape: listMask,
        contentHeight,
        viewHeight: panel.height - startListYOffset - 30,
        listY: panelY + startListYOffset
    });

    // Close & Save ----------------------------------------------------------
    scene.input.keyboard.on('keydown-ESC', () => {
        exitMenu(scene);
    });

    return { settingsData: settings, controlTexts };
}

export default createSettingsUI;
