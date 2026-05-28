import Phaser from "phaser";
import { Itemconfig } from "./itemconfig.js";

export default class Item extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, beltGroup, belt, isDisplayItem = false) {

        const afval = Item.loadItem();
        super(scene, x, y, afval);
        this.type = afval;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(true);
        this.body.setImmovable(false);
        this.body.moves = true;

        this.setScale(0.1);
        this.setBounce(0.2);
        this.setGravityY(300);
        this.setCollideWorldBounds(true);

        this.isDisplayItem = isDisplayItem;
        this.belt = belt;

        // Meld item aan de belt wanneer contact gemaakt wordt
        scene.physics.add.collider(this, beltGroup, (item, beltBody) => {
            if (this.belt) {
                this.belt.addItem(this);
            }
        });

        // Zorg dat wanneer item destroyed wordt, het uit belt verwijderd wordt
        this.on('destroy', () => {
            if (this.belt) {
                this.belt.removeItem(this);
            }
        });

        // Verwijder items na 20 seconden
        if (!this.isDisplayItem) {
            this.scene.time.addEvent({
                delay: 20000,
                callback: () => {
                    this.destroy();
                }
            });
        }

        this.onBelt = false;
        this.extraSpeed = 0;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    
        // Simuleer "wrijving" op grond
        const isOnGround = this.body.blocked.down || this.body.touching.down;
        const isOnBelt = this.scene.belt?.itemsOnBelt?.has(this);
    
        if (isOnGround && !isOnBelt) {
            // De item langzaam vertragen
            this.body.velocity.x *= 0.5;
        
            // Als de snelheid bijna nul is, stop de item volledig
            if (Math.abs(this.body.velocity.x) < 5) {
                this.body.velocity.x = 0;
            }
        }
    }

    // Kiest een willekeurig item
    static loadItem() {
        const categories = {
            Plastic: [],
            Paper: [],
            GFT: []
        };

        for (const [type, data] of Object.entries(Itemconfig)) {
            categories[data.correctBin].push(type);
        }

        const categoryNames = Object.keys(categories);
        const categoryIndex = Phaser.Math.Between(0, categoryNames.length - 1);
        const chosenCategory = categoryNames[categoryIndex];

        const items = categories[chosenCategory];
        const itemIndex = Phaser.Math.Between(0, items.length - 1);
        return items[itemIndex];
    }
}
