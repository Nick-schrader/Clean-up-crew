import { Scene } from 'phaser';
import createPauzeUI from '../extra/pausemenuComponents.js';
import SkinMenu from './SkinMenu.js';

export class Pause extends Scene {
    constructor() {
        super('Pause');
    }

    // Accept a scene instance (e.g. `this`) and optionally the key of the scene to launch
    static pause(sceneInstance, otherScene = 'Pause') {
        if (!sceneInstance || !sceneInstance.scene) return;
        sceneInstance.scene.pause();

        if (otherScene !== '') {
            sceneInstance.scene.launch(otherScene); // set this otherScene on top of all others
        }
    }

    static unpause(sceneInstance, gameSceneKey = 'Game') {
        if (!sceneInstance || !sceneInstance.scene) return;
        sceneInstance.scene.resume(gameSceneKey);
        sceneInstance.scene.stop();

        // console.log('unpause')
    }

    create() {
        createPauzeUI(this, { buttons: {
            Terug: {
                title: 'Terug',
                method: () => Pause.unpause(this, 'Game')
            },
            Settings: {
                title: 'Settings',
                method: () => Pause.pause(this, 'Settings')
            },
            Achievements: {
                title: 'Achievements',
                method: () => Pause.pause(this, 'Achievements')
            },
            Upgrades: {
                title: 'Upgrades',
                method: () => Pause.pause(this.game, 'Upgrades')
            }
        }})
    }

    update() {
        this.input.keyboard.on('keydown-ESC', () => {
            Pause.unpause(this, 'Game')
        });
    }

}

export default Pause;