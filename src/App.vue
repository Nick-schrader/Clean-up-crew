<script setup>
import Phaser from 'phaser';
import { ref, toRaw, onMounted, onBeforeUnmount, nextTick } from 'vue';
import PhaserGame from './PhaserGame.vue';
import UpgradeMenu from './UpgradeMenu.vue';
import Item_recyclen from './game/objects/Item_recyclen';

// The sprite can only be moved in the MainMenu Scene
const canMoveSprite = ref();
const activeSceneKey = ref();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();
const spritePosition = ref({ x: 0, y: 0 });

const changeScene = () => {

    const scene = toRaw(phaserRef.value.scene);

    if (scene)
    {
        //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
        scene.changeScene();
    }

}

const changeScenePauze = () => {

    const scene = toRaw(phaserRef.value.scene);

    if (scene)
    {
        //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
        scene.changeScenePauze();
    }

}

const moveSprite = () => {

    const scene = toRaw(phaserRef.value.scene);

    if (scene)
    {
        //  Call the `moveLogo` method in the `MainMenu` Scene and capture the sprite position
        scene.moveLogo(({ x, y }) => {

            spritePosition.value = { x, y };

        });
    }

}

const geld = ref(0);
const afval = ref(0);
const max_afval = ref(0);
const upgradeMenuRef = ref(null);
const geldDelta = ref(0);
let geldDeltaTimeout = null;

onMounted(async () => {
  geld.value = parseInt(localStorage.getItem('Geld')) || 0;
  afval.value = parseInt(localStorage.getItem('totalPickedItems')) || 0;
  max_afval.value = parseInt(localStorage.getItem('maxAfval')) || 0;

  window.addEventListener('geld-updated', () => {
        geld.value = parseInt(localStorage.getItem('Geld')) || 0;
        // Achievement: Geldbaas
        if (window.Achievements && !window.Achievements.getAchievements()['geldbaas'].unlocked && geld.value >= 10000) {
            window.Achievements.giveAchievement('geldbaas');
        }
  });

  window.addEventListener('afval-updated', () => {
    afval.value = parseInt(localStorage.getItem('totalPickedItems')) || 0;
  });

  window.addEventListener('max-afval-updated', () => {
    max_afval.value = parseInt(localStorage.getItem('maxAfval')) || 0;
  });

  window.addEventListener('geld-delta', (e) => {
    geldDelta.value = e.detail;

    // Oude timeout annuleren
    if (geldDeltaTimeout) {
      clearTimeout(geldDeltaTimeout);
    }

    // Nieuwe timeout starten
    geldDeltaTimeout = setTimeout(() => {
      geldDelta.value = 0;
      geldDeltaTimeout = null;
    }, 1500);
  });

  // Dynamische UI-positionering op basis van canvas
  const updateUIPosition = () => {
    const canvas = document.querySelector('canvas');
    const ui = document.querySelector('.ui');
    const button2 = document.querySelector('.button2');
    const button3 = document.querySelector('.button3');

    if (canvas) {
      const rect = canvas.getBoundingClientRect();

      // Positioneer UI-elementen relatief aan canvas
      if (ui) {
        ui.style.position = 'absolute';
        //ui.style.left = `${rect.left + 25}px`;
        //ui.style.top = `${rect.top + 5}px`;
      }

      if (button2) {
        button2.style.position = 'absolute';
        //button2.style.left = `${rect.left + 470}px`;
        //button2.style.top = `${rect.top + 60}px`;
      }

      if (button3) {
        button3.style.position = 'absolute';
        //button3.style.left = `${rect.left + 664.2}px`;
        //button3.style.top = `${rect.top + 140}px`;
      }
    }
  };

    await nextTick();

  // Initiale positionering en bij resize
  updateUIPosition();
  window.addEventListener('resize', updateUIPosition);

    // Open upgrade menu when Tab is pressed (only during gameplay scenes)
        const handleKeyDown = (e) => {
            // Use the Tab key to toggle the upgrades menu
            if (e.key === 'Tab') {
                // Prevent the browser from moving focus
                e.preventDefault();

                // Only toggle when in Game or Recyclen scenes (match visible UI)
                if (activeSceneKey.value === 'Game' || activeSceneKey.value === 'Recyclen') {
                    // call the exposed toggle method if available
                    if (upgradeMenuRef.value?.toggleUpgradeMenu) {
                        upgradeMenuRef.value.toggleUpgradeMenu();
                    } else if (upgradeMenuRef.value?.openUpgradeMenu) {
                        // fallback: open if no toggle available
                        upgradeMenuRef.value.openUpgradeMenu();
                    }
                }
            }
        };

    window.addEventListener('keydown', handleKeyDown);

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', updateUIPosition);
    });

});

const addSprite = () => {

    const scene = toRaw(phaserRef.value.scene);

    if (scene)
    {
        //  Add a new sprite to the current scene at a random position
        const x = Phaser.Math.Between(64, scene.scale.width - 64);
        const y = Phaser.Math.Between(64, scene.scale.height - 64);

        //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
        const star = scene.add.sprite(x, y, 'star');

        //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
        //  You could, of course, do this from within the Phaser Scene code, but this is just an example
        //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
        scene.add.tween({
            targets: star,
            duration: 500 + Math.random() * 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });
    }

}

//  This event is emitted from the PhaserGame component:
const currentScene = (scene) => {
  const key = scene?.scene?.key || scene?.key;

  if (!key) return;

  canMoveSprite.value = key !== 'Game';
  activeSceneKey.value = key;

  console.log("Scene changed to:", key);
};
</script>

<template>
    <div class="game-wrapper">
        <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
        <div>
                <div class="ui">
                    <div v-if="activeSceneKey === 'Game' || activeSceneKey === 'Recyclen'">
                        <p>Geld</p>
                        </br>
                        <p class="ui_border"> <img class="img" src="/assets/Geld.png" alt="Geld Logo" />{{ geld }}</p>

                        <p v-if="geldDelta !== 0"
                           :key="geldDelta"   
                           class="geld-delta"
                           :class="{ positief: geldDelta > 0, negatief: geldDelta < 0 }">
                           {{ geldDelta > 0 ? '+' : '' }}{{ geldDelta }}
                        </p>

                        <p style="margin-top: 20px">Afval</p>
                        </br>
                        <p class="ui_border">{{ afval }}/{{ max_afval }}</p>

                        <div>
                            <button @click="changeScene" class="button2">Afval scheiden</button>
                        </div>
                        <div>
                            <button @click="changeScenePauze" class="button3">❚❚</button>
                        </div>
                    </div>
                </div>
                <UpgradeMenu ref="upgradeMenuRef" />
    </div>
        <!-- <div>
            <button :disabled="canMoveSprite" class="button" @click="moveSprite">Toggle Movement</button>
        </div> -->
        <!--<div class="spritePosition">Sprite Position:
            <pre>{{ spritePosition }}</pre>
        </div>-->
        <!--<div>
            <button class="button" @click="addSprite">Add New Sprite</button>
        </div>-->
    </div>
</template>

<style scoped>
.game-wrapper {
  position: relative;
  display: inline-block;
}

.ui {
    position: absolute;
    top: 120px;
    left: 25px;
    z-index: 1000;
    font-size: 24px;
    color: rgb(255, 255, 255);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;

    gap: 6px; /* minder ruimte tussen de children */
}

.ui p {
    margin: 2px; /* verwijder standaard paragraf-marges */
    line-height: 1;
}

.ui_border {
    border: 5px solid rgb(13, 68, 17);
    border-radius: 10px;
    width: 162px;
    height: 50px; /* optioneel kleiner maken */

    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    background-color: rgb(116,	194,	121);
}

.img {
    width: 25px;
    height: 25px;
    margin-right: 5px;
}

.button2 {
    position: absolute;
    top: 28px;
    left: 722px;
    z-index: 1000;
    padding: 10px 20px;
    font-size: 24px;
    color: rgb(255, 255, 255);
    border: 5px solid rgb(13, 68, 17);
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    background-color: rgb(116,	194,	121);
    width: 245px;
    height: 50px;
    align-content: center;
    text-align: center;
    align-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
}

.button3 {
    position: absolute;
    top: 124px;
    left: 917px;
    z-index: 1000;
    font-weight: bold;
    font-size: 24px;
    color: rgb(255, 255, 255);
    background-color: rgb(116,	194,	121);
    border: 5px solid rgb(13, 68, 17);
    border-radius: 10px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    outline: none;
    hover {
        background-color: lightgrey;
    }
}

.button2:hover, .button3:hover {
background-color: rgb(19, 109, 25);
}

.geld-delta {
  position: absolute;
  left: 180px;
  top: 38px;
  font-size: 30px;
  font-weight: bold;
  animation: fadeUp 2s ease forwards;
}

.geld-delta.positief { color: limegreen; }
.geld-delta.negatief { color: red; }

@keyframes fadeUp {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-30px); }
}
</style>