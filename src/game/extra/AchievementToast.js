import { loadMont } from './fontloader.js';
import { Settings } from '../scenes/Settings.js';
 
loadMont().then(() => {
    console.log("Font Loaded");
});
 
function _resolveScene(scene) {
    // If a proper Phaser scene was passed, use it
    if (scene && scene.scale && scene.add) return scene;
 
    // Try to fall back to the currently active scene on the global GAME object
    if (typeof window !== 'undefined' && window.GAME && window.GAME.scene) {
        try {
            const activeScenes = window.GAME.scene.getScenes(true);
            if (Array.isArray(activeScenes) && activeScenes.length) return activeScenes[activeScenes.length - 1];
            if (Array.isArray(window.GAME.scene.scenes) && window.GAME.scene.scenes.length) return window.GAME.scene.scenes[0];
        } catch (e) {
            // ignore and fallthrough
        }
    }
 
    return null;
}
 
export function showAchievement(scene, iconKey, title) {
    const settings = Settings.getSettings();
 
    const resolved = _resolveScene(scene);
    if (!resolved) {
        // Can't show an achievement without a Phaser scene — fail gracefully.
        console.warn('showAchievement: no active Phaser scene available to display toast.');
        return;
    }
 
    scene = resolved;
 
    const width = 350;
    const height = 80;
    const padding = 15;
 
    scene.sound.add('achievement-sound', {
        volume: settings.soundOn ? settings.volume / 1 : 0
    }).play();
 
    // defensive: ensure scene.scale exists
    const startX = (scene.scale && scene.scale.width ? scene.scale.width : 1024) + width;
    const startY = 40;
 
    const finalX = (scene.scale && scene.scale.width ? scene.scale.width : 1024) - width - 20;
 
    const toast = scene.add.container(startX, startY);
 
    const toastBG = scene.add.rectangle(0, 0, width, height, 0x282828, 1).setOrigin(0).setStrokeStyle(5, 0x595959);
 
    const header = scene.add.text(80, 10, "Advancement made!", {
        fontSize: "20px",
        color: "#D5DC41",
        fontStyle: "bold"
    });
 
    const toastTxt = scene.add.text(80, 40, title, {
        fontFamily: 'Montserrat',
        fontSize: '20px',
        color: '#AFAFAF',
        fontStyle: "bold"
    });
 
    const safeIconKey = iconKey || 'default';
    let icon;
    try {
        icon = scene.add.image(40, 40, safeIconKey).setScale(0.7).setOrigin(0.5);
    } catch (e) {
        // if the texture is missing, fallback to a plain rectangle so the toast still appears
        console.warn('showAchievement: failed to add icon for key', safeIconKey, e);
        icon = scene.add.rectangle(40, 40, 40, 40, 0x999999).setOrigin(0.5);
    }
 
    toast.add([toastBG, header, toastTxt, icon]);
 
    scene.tweens.add({
        targets: toast,
        x: finalX,
        duration: 600,
        ease: 'Sine.easeOut',
        onComplete: () => {
            scene.time.delayedCall(5000, () => {
                scene.tweens.add({
                    targets: toast,
                    x: startX,
                    duration: 500,
                    ease: 'Sine.easeIn',
                    onComplete: () => toast.destroy()
                });
            });
        }
 
    });
}