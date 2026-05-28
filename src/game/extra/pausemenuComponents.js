export function createPanel(scene, opts = {}) {
    const { centerX, centerY, x, y, width = 700, height = 500, fillColor = 0xbfc3c8, alpha = 0.95, strokeColor = 0xa5a9ad, strokeWidth = 2 } = opts;

    // prefer center coordinates if provided
    const cx = typeof centerX === 'number' ? centerX : (x + width / 2);
    const cy = typeof centerY === 'number' ? centerY : (y + height / 2);

    // Use a rounded rectangle constructed with Graphics for more control
    const g = scene.add.graphics();
    g.fillStyle(fillColor, alpha);
    g.fillRoundedRect(cx - width / 2, cy - height / 2, width, height, 8);
    g.lineStyle(strokeWidth, strokeColor, 1);
    g.strokeRoundedRect(cx - width / 2, cy - height / 2, width, height, 8);

    return { x: cx - width / 2, y: cy - height / 2, width, height };
}

export function createTitle(scene, opts = {}) {
    const { x, y, text = 'PAUZE', fontFamily = 'Luckiest Guy', fontSize = '48px', color = '#ffffff' } = opts;
    return scene.add.text(x, y, text, { fontFamily, fontSize, color });
}

export function setupScrolling(scene, opts = {}) {
    const { contentHeight = 0 } = opts;
    const { width, height } = scene.scale;
    const cam = scene.cameras.main;
    cam.setBounds(0, 0, width, Math.max(height, contentHeight));
    const maxScroll = Math.max(0, contentHeight - height);

    scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => { cam.scrollY = Math.max(0, Math.min(cam.scrollY + deltaY, maxScroll)); });

    let isDragging = false; let dragStartY = 0; let camStartY = 0;
    scene.input.on('pointerdown', (pointer) => { if (pointer.rightButtonDown && pointer.rightButtonDown()) return; isDragging = true; dragStartY = pointer.y; camStartY = cam.scrollY; });
    scene.input.on('pointerup', () => { isDragging = false; });
    scene.input.on('pointermove', (pointer) => { if (!isDragging) return; const dy = pointer.y - dragStartY; cam.scrollY = Math.max(0, Math.min(camStartY - dy, maxScroll)); });

    scene.input.keyboard.on('keydown-UP', () => { cam.scrollY = Math.max(0, cam.scrollY - 40); });
    scene.input.keyboard.on('keydown-DOWN', () => { cam.scrollY = Math.min(maxScroll, cam.scrollY + 40); });

    return { cam, maxScroll };
}

// PAS DIT AAN DION, ALLES HIERONDER

export function createPauzeRow(scene, opts = {}) {
    const { x, y, width = 620, height = 60, title = 'button', method = () => {} } = opts;

    const rowX = x + width / 2;

    const rowColor = 0xd5d9df;
    const stroke = 0xd9dfe5;

    const rect = scene.add.rectangle(rowX, y, width, height, rowColor, 1);
    rect.setStrokeStyle(1, stroke);

    rect.setInteractive({ useHandCursor: true });

    rect.on('pointerover', () => {
        rect.setFillStyle(0xcbd0d6);
    });
    rect.on('pointerout', () => {
        rect.setFillStyle(rowColor);
    });

    rect.on('pointerdown', (pointer) => {
        if (typeof method === 'function') {
            method(pointer, rect);
        }
    });

    const textX = rowX - width / 2 + 20;
    const titleText = scene.add.text(textX, y - 18, title, { fontFamily: 'Montserrat', fontSize: '22px', color: '#000000' });

    return { rect, titleText };
}

export function createPauzeUI(scene, opts = {}) {
    const { 
        panelWidth = 700, 
        panelHeight = 99999, 
        panelX, 
        panelY, 
        titleYOffset = 40, 
        startListYOffset = 150,
        buttons = {}
    } = opts;

    const centerX = scene.cameras.main.width / 2;
    const centerY = panelHeight / 2 + 100;

    const panelPos = createPanel(scene, { centerX, centerY, width: panelWidth, height: panelHeight });
    createTitle(scene, { x: panelPos.x + 32, y: panelPos.y + titleYOffset });

    const listStartY = panelPos.y + startListYOffset;
    const rowWidth = panelWidth - 80;
    const rowHeight = 60;

    const values = Object.values(buttons || {})

    values.forEach((butt, idx) => {
        const rowY = listStartY + idx * (rowHeight + 10);
        createPauzeRow(scene, { x: panelPos.x + 40, y: rowY, width: rowWidth, height: rowHeight, title: butt.title, method: butt.method });
    });

    const contentHeight = listStartY + values.length * (rowHeight + 10) + 40;
    setupScrolling(scene, { contentHeight });

    return { panelPos };
}

export default createPauzeUI;

