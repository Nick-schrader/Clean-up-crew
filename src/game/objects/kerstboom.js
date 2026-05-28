export default class Kerstboom {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, 'kerstboom');
        this.createAnimation();
        this.sprite.play('kerstboom_idle');
    }

    createAnimation() {
        this.scene.anims.create({
            key: 'kerstboom_idle',
            frames: this.scene.anims.generateFrameNumbers('kerstboom', { start: 0, end: 35 }),
            frameRate: 6,
            repeat: -1
        });
    }
}