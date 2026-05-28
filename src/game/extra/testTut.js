import { loadMont } from "./fontloader";
import { createButton } from "./buttonFactory";
import { hideMenu } from "./menuAnimation";

loadMont().then(() => {
    console.log("Font Loaded");
});

export function tutorialUI(scene) {
    // Tutorial teksten met keycap placeholders.
    const pages = [
        "Welkom bij de tutorial!",
        "Gebruik [key-a] en [key-d] of de pijltjestoetsen om te bewegen.",
        "Om te springen gebruik je [key-w] of [key-space]",
        "Om afval op te rapen gebruik je [key-e]. Om te sorteren gebruik je [key-r].",
        "Je kan deze instellingen altijd aanpassen in de settings.",
        "Veel plezier met spelen!"
    ];

    let currentPage = 0;
    
    // Center de container.
    const container = scene.add.container(scene.scale.width / 2, scene.scale.height / 2);

    const bg = scene.add.rectangle(0, 0, 450, 350, 0x222222).setOrigin(0.5);

    // Laad text gebasseerd op de pagina.
    const text = scene.add.text(0, -40, pages[currentPage], {
        fontFamily: 'Montserrat',
        fontSize: "22px",
        color: "#fff",
        align: "center",
        wordWrap: { width: 200 }
    }).setOrigin(0.5);

    const backBtn = createButton(scene, "Back", 100);
    backBtn.x = -80;
    backBtn.y = 70

    const nextBtn = createButton(scene, "Continue", 100);
    nextBtn.x = 80;
    nextBtn.y = 70;

    const closeBtn = createButton(scene, "X", 80);
    closeBtn.x = 170;
    closeBtn.y = -130;

    const textContainer = scene.add.container(0, -40);
    

    function updatePage() {
        const pageText = pages[currentPage]; // Update de text
        // Remove text 
        text.setText(pageText.text);

        renderInlineText(scene, textContainer, pageText); 

        // Wanneer de gebruiker op de eerste en/of laatste pagina is, update the knoppen zodat ze iets donkerder zijn.
        backBtn.setAlpha(currentPage === 0 ? 0.5 : 1);
        nextBtn.setAlpha(currentPage === pages.length - 1 ? 0.5 : 1);
    }

    backBtn.on("pointerdown", () => {
        if (currentPage > 0) {
            currentPage--;
            updatePage();
        }
    });

    nextBtn.on("pointerdown", () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updatePage();
        }
    });

    closeBtn.on("pointerdown", () => {
        hideMenu(scene, container);
    });

    container.add([bg, text, backBtn, nextBtn, closeBtn]);
    container.add(textContainer);
    updatePage();

    return container;
}

function renderInlineText(scene, container, rawText, yPos = 0) {

    const wrapWidth = 300;
    const spacing = 6;
    const lineHeight = 40;

    // clear previous inline elements
    container.removeAll(true);

    const parts = rawText.split(/(\[[^\]]+\])/); // Split the pagina en placeholder text.

    let currentLine = [];
    let currentLineWidth = 0;
    let xCursor = 0;
    const lines = [];

    let x = 0;

    parts.forEach(part => {
        if (part === "") return;

        // Check voor een placeholder match. (Bijvoorbeeld [key-s])
        const match = part.match(/^\[(.+)\]$/);

        
        if (match) {
            // It's an icon placeholder
            const key = match[1];
            const icon = scene.add.image(x, yPos, key).setScale(0.5).setOrigin(0, 0.5).setVisible(false); // Laad icon in

            const width = icon.displayWidth;

            if (currentLine.length > 0 && (currentLineWidth + width) > wrapWidth) {
                lines.push({ items: currentLine, lineWidth: currentLineWidth });
                currentLine = [];
                currentLineWidth = 0;
                xCursor = 0;
            }

            currentLine.push({ obj: icon, width, x: xCursor });
            currentLineWidth += width + spacing; 
            xCursor += width + spacing;

            // container.add(icon);

            // x += icon.width * icon.scaleX + 6; // spacing
        } else {
            const measured = scene.make.text({
                x: 0,
                y: 0,
                text: part,
                style: {
                    fontFamily: "Montserrat",
                    fontSize: "22px",
                    color: "#fff"
                },
                add: false
            });

            const width = measured.width;

            if (currentLine.length > 0 && (currentLineWidth + width) > wrapWidth) {
                lines.push({ items: currentLine, lineWidth: currentLineWidth });
                currentLine = [];
                currentLineWidth = 0;
                xCursor = 0;
            }

            const textObj = scene.add.text(0, 0, part, {
                fontFamily: "Montserrat",
                fontSize: "22px",
                color: "#fff"
            }).setOrigin(0, 0.5).setVisible(false);

            currentLine.push({ obj: textObj, width, x: xCursor });
            currentLineWidth += width + spacing;
            xCursor += width + spacing;

            
            // const text = scene.add.text(x, yPos, part, {
            //     fontFamily: "Montserrat",
            //     fontSize: "22px",
            //     color: "#fff"
            // });
            // text.setOrigin(0, 0.5);
            // container.add(text);
            // x += text.width;

            // if (x + text.width > wrapWidth) {
            //     x = 0
            //     yPos += lineHeight;
            // }
        }
    });

    if (currentLine.length > 0) {
        lines.push({ items: currentLine, lineWidth: currentLineWidth });
    }

    lines.forEach((line, lineIndex) => {
        const lineWidth = Math.max(0, line.lineWidth - spacing);

        const startX = -lineWidth / 2;

        line.items.forEach(item => {
            const obj = item.obj;
            const localX = startX + item.x;
            const localY = yPos + lineIndex * lineHeight;

            obj.x = localX
            obj.y = localY;

            if (obj.setOrigin) obj.setOrigin(0, 0.5);
            if (obj.setVisible) obj.setVisible(true);

            container.add(obj);
        })
    })

    // Center align
    // container.x = -x / 2;
}