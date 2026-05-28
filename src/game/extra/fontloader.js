export function loadMont() {
    const style = document.createElement("style");
    style.innerHTML = `
    @font-face {
        font-family: "Montserrat";
        src: url("./assets/fonts/Montserrat-VariableFont_wght.ttf") format("truetype");
    }
    `;
    document.head.appendChild(style);

    return document.fonts.load("16px Montserrat");
}

export function loadHan() {
    const style = document.createElement("style");
    style.innerHTML = `
    @font-face {
        font-family: "HanaleiFill";
        src: url("./assets/fonts/HanaleiFill-Regular.ttf") format("truetype");
    }
    `;
    document.head.appendChild(style);

    return document.fonts.load("16px HanaleiFill");
}