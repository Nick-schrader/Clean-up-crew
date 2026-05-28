export default class UpgradeManager {
    constructor(scene) {
        this.scene = scene;
    }

    // Controleer of een belt unlocked is
    isBeltUnlocked(index) {
        const upgrade = localStorage.getItem(`upgradebelt${index}`);
        return Number(upgrade) === 1;
    }

    // Past de staat van een belt toe (zichtbaar/onzichtbaar)
    applyBeltState(belt, beltGroup, spawnItemCallback, unlocked) {
        if (unlocked) {
            if (typeof spawnItemCallback === "function") {
                spawnItemCallback();
            }
        } else {
            beltGroup.setVisible(false);
            belt.belt.setVisible(false);
            belt.enabled = false;
        }
    }
}
