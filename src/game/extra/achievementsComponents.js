import { loadMont, loadHan } from './fontloader.js';
import { Pause } from '../scenes/Pause.js';

loadMont().then(() => {
    console.log("Mont Loaded");
});

loadHan().then(() => {
    console.log("Han Loaded");
});

let totalHeight = 0;

export function createPanel(scene, opts = {}) {
    const { centerX, centerY, x, y, width = 700, height = 500, fillColor = 0x74C279, strokeColor = 0xa5a9ad, strokeWidth = 0 } = opts;

    // prefer center coordinates if provided
    const cx = typeof centerX === 'number' ? centerX : (x + width / 2);
    const cy = typeof centerY === 'number' ? centerY : (y + height / 2);

    // Use a rounded rectangle constructed with Graphics for more control
    const g = scene.add.graphics();
    g.fillStyle(fillColor);
    g.fillRoundedRect(cx - width / 2, cy - height / 2, width, height, 8);
    g.lineStyle(strokeWidth, strokeColor, 1);
    g.strokeRoundedRect(cx - width / 2, cy - height / 2, width, height, 8);

    return { x: cx - width / 2, y: cy - height / 2, width, height };
}

export function createTitle(scene, opts = {}) {
    const { x, y, text = 'ACHIEVEMENTS', fontFamily = 'Hanaleifill', fontSize = '48px', color = '#ffffff' } = opts;
    return scene.add.text(x, y - 20, text, { fontFamily, fontSize, color });
}

export function createAchievementRow(scene, opts = {}) {
    const { x, y, width = 620, height = 80, unlocked = false, title = 'Achievement title', desc = '', iconName = '', rowColorUnlocked = 0x96E49B, rowColorLocked = 0x375C3A, strokeUnlocked = 0x74C279, strokeLocked = 0x2A8F6D, iconRadius = 30 } = opts;

    const rowX = x + width / 2; // center x for rectangle

    const rowColor = unlocked ? rowColorUnlocked : rowColorLocked;
    const stroke = unlocked ? strokeUnlocked : strokeLocked;

    const rect = scene.add.rectangle(rowX, y, width, height, rowColor, 1);
    rect.setStrokeStyle(1, stroke);

    // Icon circle on left
    const iconX = x + 40;
    const iconY = y;
    const icon = scene.add.image(iconX, iconY, iconName);
    icon.setDisplaySize(iconRadius * 2, iconRadius * 2);
    icon.setOrigin(0.5);
    if (!unlocked) {
        icon.setTint(0xb0b0b0);
    }

    // Title and description texts
    const titleText = scene.add.text(iconX + 55, y - 24, title, { font: 'bold 22px Montserrat', color: '#ffffff' });
    const descText = scene.add.text(iconX + 55, y + 4, desc, { font: 'bold 18px Montserrat', color: '#efefef' });

    // Lock emoji for locked achievements
    let lockText = null;
    if (!unlocked) {
    lockText = scene.add.text(x + width - 40, y - 1, '🔒', { font: '32px Montserrat', color: '#64686d' });
        lockText.setOrigin(0.5);
    }

    return { rect, icon, titleText, descText, lockText };
}


// Scrollable achievement list (not camera)
export function setupListScrolling(scene, opts = {}) {
    const { listGroup, maskShape, contentHeight = 0, viewHeight = 400, listY = 0 } = opts;
    let scrollY = 0;
    const minScroll = 190;
    const maxScroll = totalHeight + minScroll;
    // Mask for the group
    listGroup.setMask(maskShape.createGeometryMask());

    function setListY(y) {
        scrollY = Math.max(minScroll, Math.min(y, maxScroll));
        listGroup.y = listY - scrollY;
    }

    scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
        setListY(scrollY + deltaY);
    });

    let isDragging = false; let dragStartY = 0; let startScrollY = 0;
    scene.input.on('pointerdown', (pointer) => {
        if (pointer.rightButtonDown && pointer.rightButtonDown()) return;
        if (pointer.x < maskShape.x || pointer.x > maskShape.x + maskShape.width || pointer.y < maskShape.y || pointer.y > maskShape.y + maskShape.height) return;
        isDragging = true; dragStartY = pointer.y; startScrollY = scrollY;
    });
    scene.input.on('pointerup', () => { isDragging = false; });
    scene.input.on('pointermove', (pointer) => {
        if (!isDragging) return;
        const dy = pointer.y - dragStartY;
        setListY(startScrollY - dy);
    });

    scene.input.keyboard.on('keydown-UP', () => { setListY(scrollY - 40); });
    scene.input.keyboard.on('keydown-DOWN', () => { setListY(scrollY + 40); });

    return { setListY, maxScroll };
}

export function createAchievementsUI(scene, opts = {}) {
    const { 
        panelWidth = 700, 
        panelHeight = 500, 
        titleYOffset = 40, 
        startListYOffset = 100, 
        achievements = {} 
    } = opts;

    const centerX = scene.cameras.main.width / 2;
    const centerY = scene.cameras.main.height / 2;

    // Panel
    const panelPos = createPanel(scene, { centerX, centerY, width: panelWidth, height: panelHeight });

    // Sticky Title
    createTitle(scene, { x: panelPos.x + 32, y: panelPos.y + titleYOffset });

    // Scrollable List Group
    const listGroup = scene.add.container(0, 0);
    const listMask = scene.add.rectangle(panelPos.x + 40, panelPos.y + startListYOffset, panelWidth - 80, panelHeight - startListYOffset - 40, 0x000000, 0);
    listMask.setOrigin(0, 0);

    const rowWidth = panelWidth - 80;
    const rowHeight = 80;
    const sorted = Object.values(achievements || {}).sort((a, b) => (b.unlocked === true) - (a.unlocked === true));
    const filtered = sorted.filter(ach => !ach.secret || ach.unlocked)

    filtered.forEach((ach, idx) => {
        const rowY = panelPos.y + startListYOffset + idx * (rowHeight + 10);
        const icon = (!!ach.secretIcon && !ach.unlocked) ? 'secret' : (ach.iconName ?? "default");
        const desc = (!!ach.secretIcon && !ach.unlocked) ? ach.lockedDesc : ach.desc
        totalHeight += rowHeight;
        const row = createAchievementRow(scene, { x: panelPos.x + 40, y: rowY, width: rowWidth, height: rowHeight, unlocked: !!ach.unlocked, title: ach.title, desc: desc, iconName: icon });
        listGroup.add([row.rect, row.icon, row.titleText, row.descText]);
        if (row.lockText) listGroup.add(row.lockText);
    });
    totalHeight -= rowHeight * 2; 

    // Masked scroll area
    const contentHeight = filtered.length * (rowHeight + 10);
    const scroll = setupListScrolling(scene, {
        listGroup,
        maskShape: listMask,
        contentHeight,
        viewHeight: panelHeight - startListYOffset - 40,
        listY: panelPos.y + startListYOffset
    });
    // Zet de start scrollpositie, bijvoorbeeld op 200 pixels:
    scroll.setListY(200);

    return { panelPos };
}

export default createAchievementsUI;
