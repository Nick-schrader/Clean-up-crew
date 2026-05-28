import Phaser from "phaser";
import Item from "./Item";
import { Itemconfig } from "./itemconfig.js";

export default class ItemDisplay extends Phaser.GameObjects.Container {

    static pickedType = null;
    static currentItem = null;

    constructor(scene, x, y, item) {
        super(scene, x, y);
        this.item = item;
        this.scene.add.existing(this);
        this.createDisplay();
    }

    createDisplay() {
        // Verwijder huidig weergegeven item
        if (ItemDisplay.currentItem) {
            ItemDisplay.currentItem.destroy();
            ItemDisplay.currentItem = null;
        }

        // Kies een willekeurig item uit de items die de speler heeft opgepakt
        const pickedItems = Object.entries(Itemconfig).filter(([type, data]) => Number(localStorage.getItem(data.key)) >= 1).map(([type]) => type);

        // Geen items om weer te geven
        let pickedType = null;

        // Kies een willekeurig item uit de opgepakte items
        if (pickedItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * pickedItems.length);
            pickedType = pickedItems[randomIndex];
        }

        // Geen items om weer te geven
        if (!pickedType) {
            ItemDisplay.pickedType = null;
            return;
        }

        // Sla het gekozen type op
        ItemDisplay.pickedType = pickedType;

        // Maakt het weergegeven item aan
        this.item = new Item(this.scene, 512, 254, null, null, true).setScale(0.3).setVisible(true);
        this.item.type = pickedType;
        this.item.setTexture(pickedType);

        this.item.body.setAllowGravity(false);
        this.item.setImmovable(true);
        this.item.body.setVelocity(0, 0);

        ItemDisplay.currentItem = this.item;
    }

    refreshDisplay() {
        // Vernieuw het weergegeven item
        this.createDisplay();
    }
}