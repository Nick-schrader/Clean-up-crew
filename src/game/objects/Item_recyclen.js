import Phaser from "phaser";
import ItemDisplay from "./Item_display";
import { Itemconfig } from "./itemconfig.js";
import { Achievements } from "../scenes/Achievements.js";   
import { Settings } from '../scenes/Settings';

export default class Item_recyclen extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player, id, textureKey) {
        super(scene, x, y, textureKey);

        this.settings = Settings.getSettings();

        this.scene = scene;
        this.player = player;
        this.id = id;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);

        // Fix: gebruik direct Phaser KeyCodes ipv Settings.getPhaserKey
        this.InteractKey = scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes[this.settings.controls.recycle.toUpperCase()]
        );
        this.InteractKeyAlt = scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes[this.settings.controls.recycleAlt.toUpperCase()]
        );

        // Overlap check
        scene.physics.add.overlap(this.player, this, () => {
            if (Phaser.Input.Keyboard.JustDown(this.InteractKey) || Phaser.Input.Keyboard.JustDown(this.InteractKeyAlt)) {
                this.handleRecycle();
            }
        });
    }

    deleteCurrentItem() {
        // Verwijder huidig item uit display
        ItemDisplay.currentItem.destroy();
        ItemDisplay.currentItem = null;
        ItemDisplay.pickedType = null;
    }

    handleRecycle() {
        // Haal het type van het geselecteerde item op
        const type = ItemDisplay.pickedType;

        if (!type) return;

        // Haal item data op
        const itemData = Itemconfig[type];
        if (!itemData) return;

        // Hoeveel items heeft de speler van dit type?
        let amount = Number(localStorage.getItem(itemData.key));

        if (amount <= 0) return;

        // Hoeveel items mag de speler maximaal in één keer recyclen?
        const recycleLimit = Number(localStorage.getItem("recycleLimit")) || 1;

        // Hoeveel gaan we recyclen?
        const amountToRecycle = Math.min(amount, recycleLimit);

        let geld = Number(localStorage.getItem("Geld")) || 0;
        let delta = 0;

        // Check of het de juiste bak is
        const isCorrect = this.id === itemData.correctBin;

        // Bereken geld
        if (isCorrect) {
            geld += itemData.valueCorrect * amountToRecycle;
            console.log(`✅ Recycled ${amountToRecycle}x ${type} into ${this.id}`);

            localStorage.setItem('totaalGoed', !!localStorage.getItem('totaalGoed') ? Number(localStorage.getItem('totaalGoed')) + 1 : 1 );
            const totaalGoed = Number(localStorage.getItem('totaalGoed')) || 0;
            localStorage.setItem('goedCombo', !!localStorage.getItem('goedCombo') ? Number(localStorage.getItem('goedCombo')) + 1 : 1);
            const goedCombo = Number(localStorage.getItem('goedCombo')) || 0;

            if (!Achievements.getAchievements()['tienGoed']['unlocked'] && totaalGoed >= 10) 
                Achievements.giveAchievement('tienGoed'); 
            else if (!Achievements.getAchievements()['honderdGoed']['unlocked'] && totaalGoed >= 100)
                Achievements.giveAchievement('honderdGoed');
            else if (!Achievements.getAchievements()['vijfhonderdGoed']['unlocked'] && totaalGoed >= 500)
                Achievements.giveAchievement('vijfhonderdGoed');
            else if (!Achievements.getAchievements()['duizendvijfhonderdGoed']['unlocked'] && totaalGoed >= 1500)
                Achievements.giveAchievement('duizendvijfhonderdGoed');
            if (!Achievements.getAchievements()['comboKing']['unlocked'] && goedCombo >= 20) {
                Achievements.giveAchievement('comboKing');  
            }

            console.log(Achievements.getAchievements()['tienGoed'], totaalGoed);
            
        } else {
            geld -= itemData.valueWrong * amountToRecycle;
            console.log(`❌ Wrong container! Recycled ${amountToRecycle}x ${type} into ${this.id}`);

            localStorage.setItem('totaalFout', !!localStorage.getItem('totaalFout') ? Number(localStorage.getItem('totaalFout')) + 1 : 1 )
            localStorage.setItem('goedCombo', 0)

            if (!Achievements.getAchievements()['honderdSlecht']['unlocked'] && localStorage.getItem('totaalFout') >= 100 ) {
                Achievements.giveAchievement('honderdSlecht');
            }
        }

        // Opslaan geld
        localStorage.setItem("Geld", geld);

        // Verminder aantal items van dat type
        localStorage.setItem(itemData.key, amount - amountToRecycle);

        if (isCorrect) {
            this.scene.sound.add('purchase-succes', {loop: false, volume: this.settings.soundOn ? this.settings.volume / 30 : 0 }).play();
            delta = itemData.valueCorrect * amountToRecycle;
            geld += delta;
        } else {
            this.scene.sound.add('buzzer', {loop: false, volume: this.settings.soundOn ? this.settings.volume / 30 : 0 }).play();
            delta = -(itemData.valueWrong * amountToRecycle);
            geld += delta;
        }

        // Pas ook totalPickedItems aan
        const totalPicked = Number(localStorage.getItem("totalPickedItems")) || 0;
        localStorage.setItem("totalPickedItems", totalPicked - amountToRecycle);

        // Update UI
        window.dispatchEvent(new CustomEvent('geld-delta', { detail: delta }));
        window.dispatchEvent(new Event('geld-updated'));
        window.dispatchEvent(new Event('afval-updated'));

        // Verwijder visuele weergave
        this.deleteCurrentItem();

        // Laat nieuw item zien
        const display = this.scene.children.list.find(obj => obj instanceof ItemDisplay);
        if (display) display.refreshDisplay();
    }
}
    