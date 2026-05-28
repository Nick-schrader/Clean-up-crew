import Phaser from 'phaser';
import { Settings } from '../scenes/Settings';
import getPhaserKey from '../extra/keyboardMap';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey) {
    super(scene, x, y, textureKey);

    this.settings = Settings.getSettings();
    this.textureKey = textureKey;
    this.wasOnGround = false;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setGravityY(1000);
    this.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();

    // Load controls from settings
    try {
      const controls = this.settings.controls || {};
      this.keys = {};

      const makeKey = (val) => {
        if (!val) return null;
        const code = getPhaserKey(val);
        if (code == null) return null;
        return scene.input.keyboard.addKey(code);
      };

      this.keys.left = makeKey(controls.left);
      this.keys.leftAlt = makeKey(controls.leftAlt);
      this.keys.right = makeKey(controls.right);
      this.keys.rightAlt = makeKey(controls.rightAlt);
      this.keys.up = makeKey(controls.up);
      this.keys.upAlt = makeKey(controls.upAlt);
      this.keys.down = makeKey(controls.down);
      this.keys.downAlt = makeKey(controls.downAlt);
    } catch (e) {
      this.keys = {};
    }

    // Loop geluid
    this.walkSound = scene.sound.add('walking-sound', {
      loop: true,
      volume: this.settings.soundOn ? this.settings.volume / 30 : 0
    });

    // Animatie per skin aanmaken/afspelen
    this.createWalkAnimation(scene, textureKey);
    this.isDefaultPlayer = textureKey === 'player' || textureKey === 'player6';
 
  }

  // Animatie per skin aanmaken/afspelen
  createWalkAnimation(scene, key) {
    const animKey = 'walk_' + key;
    if (!scene.anims.exists(animKey)) {
      scene.anims.create({
        key: animKey,
        frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 35 }),
        frameRate: 12,
        repeat: -1
      });
    }
    this.currentAnimKey = animKey;
  }

  create() {
    // Pas scale en positie aan bij bepaalde skins
    if (this.textureKey === 'alex' || this.textureKey === 'player7') {
      this.setScale(0.8);
      this.y -= 30;
    } else {
      this.setScale(0.6);
    }
  }

  updateSkin(newKey) {
    // Update skin texture and properties
    if (!newKey || this.textureKey === newKey) return;

    // Update texture
    this.textureKey = newKey;
    this.setTexture(newKey);

    // Pas scale en positie aan
    if (newKey === 'alex') {
      this.setScale(0.8);
      this.y -= 30;
    } else {
      this.setScale(0.6);
    }

    // Pas scale en positie aan voor player7
    if (newKey === 'player7') {
      this.setScale(0.8);
      this.y -= 30;
    } else {
      this.setScale(0.6);
    }

    this.player7 = this.physics.add.sprite(100, 100, 'player7');

    // Hitbox aanpassen
    this.player7.body.setSize(80, 180);
    this.player7.body.setOffset(80, 120);


    // Animatie per skin aanmaken/afspelen
    this.createWalkAnimation(this.scene, newKey);
    if (this.anims) {
      this.anims.play(this.currentAnimKey, true);
    }

    this.isDefaultPlayer = newKey === 'player' || newKey === 'player6';
  }

  update() {
    // Functie om te checken of een actie toets ingedrukt is
    const isActionDown = (primary, alt, cursorProp) => {
      const k1 = this.keys && this.keys[primary];
      const k2 = this.keys && this.keys[alt];
      if (k1 && k1.isDown) return true;
      if (k2 && k2.isDown) return true;
      if (this.cursors && cursorProp && this.cursors[cursorProp] && this.cursors[cursorProp].isDown) return true;
      return false;
    };

    // Beweging links/rechts
    if (isActionDown('left', 'leftAlt', 'left')) {
      this.setVelocityX(-160);
      if (!this.anims.isPlaying || this.anims.currentAnim.key !== this.currentAnimKey) {
        this.anims.play(this.currentAnimKey, true);
        if (!this.walkSound.isPlaying) this.walkSound.play();
      }
      this.flipX = true;
    } else if (isActionDown('right', 'rightAlt', 'right')) {
      this.setVelocityX(160);
      if (!this.anims.isPlaying || this.anims.currentAnim.key !== this.currentAnimKey) {
        this.anims.play(this.currentAnimKey, true);
        if (!this.walkSound.isPlaying) this.walkSound.play();
      }
      this.flipX = false;
    } else {
      this.setVelocityX(0);
      this.anims.stop();
      this.setFrame(0);
      if (this.walkSound.isPlaying) this.walkSound.stop();
    }

    // Springen
    const jumpDown = (() => {
      if (this.keys && this.keys.up && this.keys.up.isDown) return true;
      if (this.keys && this.keys.upAlt && this.keys.upAlt.isDown) return true;
      if (this.cursors && this.cursors.space && this.cursors.space.isDown) return true;
      if (this.cursors && this.cursors.up && this.cursors.up.isDown) return true;
      return false;
    })();

    // Springen
    if (jumpDown && this.body.blocked.down) {
      this.setVelocityY(-600);
    }

    // Sneller naar beneden gaan bij indrukken down toets
    const downHeld = (() => {
      if (this.keys && this.keys.down && this.keys.down.isDown) return true;
      if (this.keys && this.keys.downAlt && this.keys.downAlt.isDown) return true;
      if (this.cursors && this.cursors.down && this.cursors.down.isDown) return true;
      return false;
    })();

    // Sneller naar beneden gaan
    if (downHeld && !this.body.blocked.down && this.isDefaultPlayer) {
      this.setGravityY(4000);
      this.setVelocityY(Math.max(this.body.velocity.y, 400));
    } else {
      this.setGravityY(1000);
    }

    // Special effect bij landing
    if (this.isDefaultPlayer && this.body.blocked.down && !this.wasOnGround && (this.cursors.down.isDown || this.keys.down.isDown)) {
      this.scene.sound.play('aardbeving-sound', { volume: this.settings.soundOn ? this.settings.volume / 30 : 0 });
      this.scene.cameras.main.shake(300, 0.02);
    }

    // Update wasOnGround status
    this.wasOnGround = this.body.blocked.down;
  }
}
