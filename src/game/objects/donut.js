import Phaser from "phaser";
import Player from '../objects/Player';

export default class Donut {
    constructor(scene) {
        this.scene = scene;
        this.spawned = false;
        this.timer = false;

        // Rennen animatie
        if (!scene.anims.exists('rennen')) {
            scene.anims.create({  
                key: 'rennen',
                frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 35 }),
                frameRate: 22,
                repeat: -1
            });
        }

        // Donut animatie
        if (!scene.anims.exists('donut-roll')) {
            scene.anims.create({
                key: 'donut-roll',
                frames: scene.anims.generateFrameNumbers('donut', { start: 0, end: 35 }),
                frameRate: 22,
                repeat: -1
            });
        }

    }

    addEvents() {
        // Timer voor elke 60 seconden
        this.scene.time.addEvent({
            delay: 60000,
            loop: true,
            callback: () => {
                this.timer = true;
            }
        });
    }

    update() {
        // Spawn donut en speler als timer afgaat
        if (this.timer === true) {
            this.spawn();
            this.spawned = true;
            this.timer = false;
        }
    }

    spawn() {
        // Spawnt een speler die rent met een donut
        this.player2 = new Player(this.scene, 210, 1160, null)
            .setScale(0.3)
            .setGravityY(0)
            .setVelocityX(100)
            .setDepth(0);

        // Speel de rennen animatie af
        this.player2.anims.play('rennen', true);

        // Spawnt de donut
        this.donut = this.scene.physics.add.sprite(283, 1183, 'donut')
            .setScale(0.12)
            .setVelocityX(100)
            .setDepth(0)
            .setGravityY(0);

        // Speel de donut rol animatie af
        this.donut.anims.play('donut-roll', true);

        // Verwijder de speler en donut na 4 seconden
        this.scene.time.addEvent({
            delay: 4000,
            callback: () => {
                this.donut.destroy();
                if (this.donut) this.donut.destroy();
                this.scene.time.delayedCall(1000, () => {
                    this.player2.destroy();
                });
            }
        });
    }
}
