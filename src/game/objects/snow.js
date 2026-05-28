export default class Snow {
    constructor(scene, amount = 250, areaWidth = 1024, areaHeight = 768) {
        this.scene = scene;
        this.areaWidth = areaWidth;
        this.areaHeight = areaHeight;

        this.flakes = [];

        for (let i = 0; i < amount; i++) {
            const flake = this.createFlake();
            this.flakes.push(flake);
        }
    }

    createFlake() {
        const g = this.scene.add.graphics();
        g.fillStyle(0xffffff, 1);
        g.fillCircle(0, 0, Phaser.Math.Between(2, 6));

        const f = this.scene.add.container(
            Phaser.Math.Between(0, this.areaWidth),
            Phaser.Math.Between(0, this.areaHeight),
            [g]
        );

        f.drift = Phaser.Math.FloatBetween(-0.3, 0.3);
        f.speed = Phaser.Math.FloatBetween(0.5, 2);
        f.alpha = Phaser.Math.FloatBetween(0.3, 1);
        f.scale = Phaser.Math.FloatBetween(0.4, 1);

        return f;
    }

    update() {
        for (const f of this.flakes) {
            f.x += f.drift;
            f.y += f.speed;

            // Reset wanneer onderaan
            if (f.y > this.areaHeight) {
                f.y = -10;
                f.x = Phaser.Math.Between(0, this.areaWidth);
            }
        }
    }
}