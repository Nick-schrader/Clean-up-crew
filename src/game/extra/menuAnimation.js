export function showMenu(scene, menu) {
    const targetY = scene.scale.height / 2;
    scene.tweens.add({
        targets: menu,
        y: targetY,
        duration: 500,
        ease: 'Sine.easeOut'
    });
}

export function hideMenu(scene, menu, onComplete) {
    scene.tweens.add({
        targets: menu,
        y: scene.scale.height + 400,
        duration: 400,
        ease: 'Sine.easeIn',
        onComplete: () => {
            menu.destroy();
            if (onComplete) onComplete();
        }
    });
}
