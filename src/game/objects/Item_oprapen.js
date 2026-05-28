import Phaser from "phaser";
import { Settings } from "../scenes/Settings";
import { Itemconfig } from "./itemconfig.js";

export default class Item_oprapen {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.settings = Settings.getSettings();

    // Fix voor de interactieknoppen zonder Settings.getPhaserKey
    this.interactKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes[this.settings.controls.pickup.toUpperCase()]
    );
    this.interactKeyAlt = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes[this.settings.controls.pickupAlt.toUpperCase()]
    );

    this.overlappingItems = [];
  }

  trackItem(item) {
    // Houd bij wanneer de speler overlapt met een item
    this.scene.physics.add.overlap(this.player, item, (player, itm) => {
      if (!this.overlappingItems.includes(itm)) {
        this.overlappingItems.push(itm);
      }
    });
  }

  update() {
    // Controleer of de interactieknop is ingedrukt
    if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.interactKeyAlt)) {
      const maxAfval = parseInt(localStorage.getItem('maxAfval')) || 5;
      let totalPicked = parseInt(localStorage.getItem('totalPickedItems')) || 0;
      const pickupLimit = parseInt(localStorage.getItem('pickupLimit')) || 1;

      let pickedCount = 0;

      // Probeer items op te pakken
      for (const itm of [...this.overlappingItems]) {
        if (pickedCount >= pickupLimit || totalPicked >= maxAfval) break;

        // Haal item data op
        const itemData = Itemconfig[itm.type];
        if (itemData && itm.active) {
          itm.destroy();
          localStorage.setItem(itemData.key, parseInt(localStorage.getItem(itemData.key)) + 1);
          totalPicked++;
          localStorage.setItem('totalPickedItems', totalPicked);
          window.dispatchEvent(new Event('afval-updated'));
          pickedCount++;
        }
      }

      // verwijder opgepakte items uit de lijst
      this.overlappingItems = this.overlappingItems.filter(itm => itm.active);
    }
  }
}
