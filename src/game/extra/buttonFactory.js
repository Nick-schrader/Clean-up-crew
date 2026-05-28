export function createButton(scene, label, width = 220, padding = 12) {
    
    const btn = scene.add.container(0, 0);

    // Voeg de text toe 
    const text = scene.add.text(0, 0, label, {
        fontSize: '28px',
        color: '#ffffff'
    }).setOrigin(0.5);

    const buttonBG = scene.add.graphics();

    const normalColor = 0x375C3A;
    const hoverColor = 0x4A7A4D;

    const drawBG = (color) => {
        buttonBG.clear();
        buttonBG.fillStyle(color, 1); // Fill the background with 
        buttonBG.fillRoundedRect(
            -width / 2,
            -text.height / 2 - padding / 2,
            width,
            text.height + padding,
            12
        );
    };

    drawBG(normalColor);

    // const btn = scene.add.container(0, 0, [buttonBG, text]);

    btn.add([buttonBG, text])

    btn.setSize(width, text.height + padding);
    btn.setInteractive();
    btn.on("pointerover", () => {
        drawBG(hoverColor);
    });
    btn.on("pointerout", () => {
        drawBG(normalColor);
    });
    
    return btn;
}