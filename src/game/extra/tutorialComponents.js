import { loadMont } from "./fontloader";
import { hideMenu } from "./menuAnimation";

loadMont().then(() => console.log("Font Loaded"));

export function tutorialUI(scene) {

    const pages = [
        "Welkom bij de tutorial!",
        "Gebruik [key-a] en [key-d] of de pijltjestoetsen om te bewegen.",
        "Je kan met [key-tab] de shop in game openen.",
        "Om te springen gebruik je [key-w] of [key-space]",
        "Om afval op te rapen en te recyclen gebruik je [key-e].",
        "Je kan deze instellingen altijd aanpassen in de settings.",
        "Veel plezier met spelen!"
    ];

    let currentPage = 0;
    const container = scene.add.container(scene.scale.width / 2, scene.scale.height / 2);

    // Achtergrond + border zoals Credits
    const bg = scene.add.graphics();
    bg.fillStyle(0x74c279);
    bg.fillRoundedRect(-395, -275, 790, 550, 20);
    bg.lineStyle(3, 0x0a2d0b);
    bg.strokeRoundedRect(-395, -275, 790, 550, 20);

    const videoPages = [0,1,2,3,4,5,6];
    const videos = [
        scene.add.video(0, -100, 'tutorial-start'),
        scene.add.video(0, -100, 'tutorial-lopen'),
        scene.add.video(0, -100, 'tutorial-upgrades'),
        scene.add.video(0, -100, 'tutorial-video'),
        scene.add.video(0, -100, 'tutorial-scheiden'),
        scene.add.video(0, -100, 'tutorial-settings'),
        scene.add.video(0, -100, 'tutorial-start'),
    ];

    const textContainer = scene.add.container(0, 100);

    function createRoundedButton(x, y, labelTxt, callback, width = 150, height = 70, isClose = false) {

        const radius = 12;
        const btn = scene.add.container(x, y)
            .setSize(width, height)
            .setInteractive({ useHandCursor: true });

        const shadow = scene.add.graphics();
        shadow.fillStyle(0x000000, 0.35);
        shadow.fillRoundedRect(-width / 2 + 3, -height / 2 + 3, width, height, radius);
        btn.add(shadow);

        const bg = scene.add.graphics();
        btn.add(bg);

        const label = scene.add.text(0, 0, labelTxt, {
            fontFamily: 'Montserrat',
            fontSize: isClose ? 32 : 34,
            color: "#ffffff"
        }).setOrigin(0.5);
        btn.add(label);

        function draw(normal = true) {
            bg.clear();
            if (isClose) {
                bg.fillStyle(normal ? 0xb02a2a : 0xd64545, 1);
                bg.fillRoundedRect(-25, -25, 50, 50, 12);
            } else {
                bg.fillStyle(normal ? 0x0d4411 : 0x145a14, 1);
                bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
            }
        }
        draw(true);

        btn.on("pointerdown", callback);
        btn.on("pointerover", () => {
            draw(false);
            scene.tweens.add({ targets: btn, scale: 1.08, duration: 120 });
        });
        btn.on("pointerout", () => {
            draw(true);
            scene.tweens.add({ targets: btn, scale: 1.0, duration: 120 });
        });

        return btn;
    }

    const backBtn = createRoundedButton(-150, 200, "Back", () => {
        if (currentPage > 0) {
            currentPage--;
            updatePage();
        }
    });

    const nextBtn = createRoundedButton(150, 200, "Next", () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updatePage();
        }
    });

    const closeBtn = createRoundedButton(330, -230, "✕", () => {
        hideMenu(scene, container);
    }, 50, 50, true);

    function updatePage() {
        renderInlineText(scene, textContainer, pages[currentPage]);

        videos.forEach(v => {
            v.setVisible(false);
            if (v.isPlaying()) v.stop();
        });

        const vid = videos[videoPages[currentPage]];
        vid.setScale(0.2).setOrigin(0.5).setDepth(10).setVisible(true);
        if (!vid.isPlaying()) vid.play(true);

        backBtn.setAlpha(currentPage === 0 ? 0.4 : 1);
        nextBtn.setAlpha(currentPage === pages.length - 1 ? 0.4 : 1);
    }

    container.add([bg, ...videos, backBtn, nextBtn, closeBtn, textContainer]);
    updatePage();
    return container;
}

function renderInlineText(scene, container, rawText, yPos = 0) {
    container.removeAll(true);
    const parts = rawText.split(/(\[[^\]]+\])/);
    let x = 0;

    parts.forEach(part => {
        const match = part.match(/^\[(.+)\]$/);
        if (match) {
            const icon = scene.add.image(x, yPos, match[1]).setScale(0.8);
            icon.setOrigin(0, 0.5);
            container.add(icon);
            x += icon.width * icon.scaleX + 6;
        } else {
            const txt = scene.add.text(x, yPos, part, {
                fontFamily: "Montserrat",
                fontSize: "22px",
                color: "#fff"
            }).setOrigin(0, 0.5);
            container.add(txt);
            x += txt.width;
        }
    });

    container.x = -x / 2;
}
