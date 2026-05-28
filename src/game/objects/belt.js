// objects/belt.js
import Phaser from "phaser";

export default class Belt {
    constructor(scene, x, y, direction) {
        this.scene = scene;
        this.speed = 80; // pixels per seconde
        this.itemsOnBelt = new Set(); // bijhouden wie op de band ligt
        this.belt = null;
        this.beltSprite = null;
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    create() {
        const beltGroup = this.scene.physics.add.staticGroup();

        // Maak de lopende band aan
        this.belt = beltGroup.create(this.x, this.y, 'ground')
            .setScale(0.4, 0.5)
            .refreshBody()
            .setVisible(false);

        // Sla de beltGroup op in de belt instantie
        this.beltGroup = beltGroup;

        return beltGroup;
    }

    // Wordt aangeroepen als een item de lopende band raakt
    addItem(item) {
        this.itemsOnBelt.add(item);
    }

    // Wordt aangeroepen als item van de lopende band af gaat
    removeItem(item) {
        this.itemsOnBelt.delete(item);
    }

    // Wordt elke frame vanuit scene.update() aangeroepen
    update() {
      if (!this.belt) return;

      // Loop door alle items in de scene
      for (const item of this.scene.items) {
        if (!item.body) continue;

        // Controleer of het item op de lopende band ligt
        const itemRect = item.getBounds();
        const beltRect = this.belt.getBounds();
        const intersects = Phaser.Geom.Intersects.RectangleToRectangle(itemRect, beltRect);

        // Beweeg het item mee met de lopende band
        if (intersects && (item.body.blocked.down || item.body.touching.down)) {
          if (this.direction === 'right') {
            item.setVelocityX(this.speed);
          } else if (this.direction === 'left') {
            item.setVelocityX(-this.speed);
          }
        }
      }

      // Speler mee laten bewegen
      const playerRect = this.scene.player.getBounds();
      const beltRect = this.belt.getBounds();
      const intersectsPlayer = Phaser.Geom.Intersects.RectangleToRectangle(playerRect, beltRect);

      // Beweeg de speler mee met de lopende band
      if (intersectsPlayer && this.scene.player.body.blocked.down) {
        if (this.direction === 'right') {
          this.scene.player.setVelocityX(this.scene.player.body.velocity.x + this.speed);
        } else if (this.direction === 'left') {
          this.scene.player.setVelocityX(this.scene.player.body.velocity.x - this.speed);
        }
      }
    }
}