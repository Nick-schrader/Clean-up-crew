<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { EventBus } from './game/EventBus';
import { Achievements } from './game/scenes/Achievements';

const isOpen = ref(false);
const geld = ref(0);

// Upgrade data
const upgrades = ref([
  {
    id: 'belt2',
    title: 'Tweede Lopende Band',
    description: 'Ontgrendel een tweede lopende band om meer afval te verwerken.',
    cost: 75,
    storageKey: 'upgradebelt2',
    event: 'belt-upgrade-purchased',
    unlocked: false
  },
  {
    id: 'belt3',
    title: 'Derde Lopende Band',
    description: 'Ontgrendel een derde lopende band om meer afval te verwerken.',
    cost: 131,
    storageKey: 'upgradebelt3',
    event: 'belt-upgrade-purchased',
    unlocked: false
  },
  {
    id: 'belt4',
    title: 'Vierde Lopende Band',
    description: 'Ontgrendel een vierde lopende band om meer afval te verwerken.',
    cost: 229,
    storageKey: 'upgradebelt4',
    event: 'belt-upgrade-purchased',
    unlocked: false
  },
  {
    id: 'belt5',
    title: 'Vijfde Lopende Band',
    description: 'Ontgrendel een vijfde lopende band om meer afval te verwerken.',
    cost: 401,
    storageKey: 'upgradebelt5',
    event: 'belt-upgrade-purchased',
    unlocked: false
  },
  {
    id: 'belt6',
    title: 'Zesde Lopende Band',
    description: 'Ontgrendel een zesde lopende band om meer afval te verwerken.',
    cost: 703,
    storageKey: 'upgradebelt6',
    event: 'belt-upgrade-purchased',
    unlocked: false
  },
  {
    id: 'belt7',
    title: 'Zevende Lopende Band',
    description: 'Ontgrendel een zevende lopende band om meer afval te verwerken.',
    cost: 1230,
    storageKey: 'upgradebelt7',
    event: 'belt-upgrade-purchased',
    unlocked: false
  },
  {
    id: 'belt8',
    title: 'Achtste Lopende Band',
    description: 'Ontgrendel een achtste lopende band om meer afval te verwerken.',
    cost: 2154,
    storageKey: 'upgradebelt8',
    event: 'belt-upgrade-purchased',
    unlocked: false
  },
  {
    id: 'belt9',
    title: 'Negende Lopende Band',
    description: 'Ontgrendel een negende lopende band om meer afval te verwerken.',
    cost: 3769,
    storageKey: 'upgradebelt9',
    event: 'belt-upgrade-purchased',
    unlocked: false
  },
  {
    id: 'belt10',
    title: 'Tiende Lopende Band',
    description: 'Ontgrendel een tiende lopende band om meer afval te verwerken.',
    cost: 6597,
    storageKey: 'upgradebelt10',
    event: 'belt-upgrade-purchased',
    unlocked: false
  },
  {
    id: 'inventory-upgrade 1',
    title: 'Inventory uitbreiding 1',
    description: 'Vergroot je inventory om meer items tegelijk te kunnen dragen.',
    cost: 25,
    storageKey: 'maxAfval',
    event: 'inventory-upgrade-purchased',
    inventory: 10,
    unlocked: false,
  },
  {
    id: 'inventory-upgrade 2',
    title: 'Inventory uitbreiding 2',
    description: 'Vergroot je inventory om meer items tegelijk te kunnen dragen.',
    cost: 43,
    storageKey: 'maxAfval',
    event: 'inventory-upgrade-purchased',
    inventory: 20,
    unlocked: false,
  },
  {
    id: 'inventory-upgrade 3',
    title: 'Inventory uitbreiding 3',
    description: 'Vergroot je inventory om meer items tegelijk te kunnen dragen.',
    cost: 76,
    storageKey: 'maxAfval',
    event: 'inventory-upgrade-purchased',
    inventory: 50,
    unlocked: false,
  },
  {
    id: 'inventory-upgrade 4',
    title: 'Inventory uitbreiding 4',
    description: 'Vergroot je inventory om meer items tegelijk te kunnen dragen.',
    cost: 133,
    storageKey: 'maxAfval',
    event: 'inventory-upgrade-purchased',
    inventory: 100,
    unlocked: false,
  },
  {
    id: 'inventory-upgrade 5',
    title: 'Inventory uitbreiding 5',
    description: 'Vergroot je inventory om meer items tegelijk te kunnen dragen.',
    cost: 234,
    storageKey: 'maxAfval',
    event: 'inventory-upgrade-purchased',
    inventory: 200,
    unlocked: false,
  },
  {
    id: 'inventory-upgrade 6',
    title: 'Inventory uitbreiding 6',
    description: 'Vergroot je inventory om meer items tegelijk te kunnen dragen.',
    cost: 410,
    storageKey: 'maxAfval',
    event: 'inventory-upgrade-purchased',
    inventory: 300,
    unlocked: false,
  },
  {
    id: 'inventory-upgrade 7',
    title: 'Inventory uitbreiding 7',
    description: 'Vergroot je inventory om meer items tegelijk te kunnen dragen.',
    cost: 718,
    storageKey: 'maxAfval',
    event: 'inventory-upgrade-purchased',
    inventory: 500,
    unlocked: false,
  },
  {
    id: 'inventory-upgrade 8',
    title: 'Inventory uitbreiding 8',
    description: 'Vergroot je inventory om meer items tegelijk te kunnen dragen.',
    cost: 1256,
    storageKey: 'maxAfval',
    event: 'inventory-upgrade-purchased',
    inventory: 1000,
    unlocked: false,
  },
  {
    id: 'inventory-upgrade 9',
    title: 'Inventory uitbreiding 9',
    description: 'Vergroot je inventory om meer items tegelijk te kunnen dragen.',
    cost: 2199,
    storageKey: 'maxAfval',
    event: 'inventory-upgrade-purchased',
    inventory: 1500,
    unlocked: false,
  },
  {
    id: 'inventory-upgrade 10',
    title: 'Inventory uitbreiding 10',
    description: 'Vergroot je inventory om meer items tegelijk te kunnen dragen.',
    cost: 3848,
    storageKey: 'maxAfval',
    event: 'inventory-upgrade-purchased',
    inventory: 2000,
    unlocked: false,
  },
  {
    id: 'spawn-rate 1',
    title: 'Item Spawn Snelheid 1',
    description: 'Items spawnen sneller op de lopende banden.',
    cost: 100,
    storageKey: 'upgradespawnrate',
    event: 'spawn-rate-upgrade-purchased',
    snelheid: 4500,
    unlocked: false,
  },
  {
    id: 'spawn-rate 2',
    title: 'Item Spawn Snelheid 2',
    description: 'Items spawnen sneller op de lopende banden.',
    cost: 175,
    storageKey: 'upgradespawnrate',
    event: 'spawn-rate-upgrade-purchased',
    snelheid: 4000,
    unlocked: false,
  },
  {
    id: 'spawn-rate 3',
    title: 'Item Spawn Snelheid 3',
    description: 'Items spawnen sneller op de lopende banden.',
    cost: 306,
    storageKey: 'upgradespawnrate',
    event: 'spawn-rate-upgrade-purchased',
    snelheid: 3500,
    unlocked: false,
  },
  {
    id: 'spawn-rate 4',
    title: 'Item Spawn Snelheid 4',
    description: 'Items spawnen sneller op de lopende banden.',
    cost: 535,
    storageKey: 'upgradespawnrate',
    event: 'spawn-rate-upgrade-purchased',
    snelheid: 3000,
    unlocked: false,
  },
  {
    id: 'spawn-rate 5',
    title: 'Item Spawn Snelheid 5',
    description: 'Items spawnen sneller op de lopende banden.',
    cost: 937,
    storageKey: 'upgradespawnrate',
    event: 'spawn-rate-upgrade-purchased',
    snelheid: 2500,
    unlocked: false,
  },
  {
    id: 'spawn-rate 6',
    title: 'Item Spawn Snelheid 6',
    description: 'Items spawnen sneller op de lopende banden.',
    cost: 1641,
    storageKey: 'upgradespawnrate',
    event: 'spawn-rate-upgrade-purchased',
    snelheid: 2000,
    unlocked: false,
  },
  {
    id: 'spawn-rate 7',
    title: 'Item Spawn Snelheid 7',
    description: 'Items spawnen sneller op de lopende banden.',
    cost: 2872,
    storageKey: 'upgradespawnrate',
    event: 'spawn-rate-upgrade-purchased',
    snelheid: 1800,
    unlocked: false,
  },
  {
    id: 'spawn-rate 8',
    title: 'Item Spawn Snelheid 8',
    description: 'Items spawnen sneller op de lopende banden.',
    cost: 5026,
    storageKey: 'upgradespawnrate',
    event: 'spawn-rate-upgrade-purchased',
    snelheid: 1600,
    unlocked: false,
  },
  {
    id: 'spawn-rate 9',
    title: 'Item Spawn Snelheid 9',
    description: 'Items spawnen sneller op de lopende banden.',
    cost: 8796,
    storageKey: 'upgradespawnrate',
    event: 'spawn-rate-upgrade-purchased',
    snelheid: 1400,
    unlocked: false,
  },
  {
    id: 'spawn-rate 10',
    title: 'Item Spawn Snelheid 10',
    description: 'Items spawnen sneller op de lopende banden.',
    cost: 15393,
    storageKey: 'upgradespawnrate',
    event: 'spawn-rate-upgrade-purchased',
    snelheid: 1000,
    unlocked: false,
  },
  {
    id: 'pickup-upgrade 1',
    title: 'Meerdere Items Oppakken 1',
    description: 'Je kunt nu tot 2 items tegelijk oppakken.',
    cost: 100,
    storageKey: 'pickupLimit',
    event: 'pickup-upgrade-purchased',
    pickupLimit: 2,
    unlocked: false
  },
  {
    id: 'pickup-upgrade 2',
    title: 'Meerdere Items Oppakken 2',
    description: 'Je kunt nu tot 4 items tegelijk oppakken.',
    cost: 400,
    storageKey: 'pickupLimit',
    event: 'pickup-upgrade-purchased',
    pickupLimit: 4,
    unlocked: false
  },
  {
    id: 'pickup-upgrade 3',
    title: 'Meerdere Items Oppakken 3',
    description: 'Je kunt nu tot 6 items tegelijk oppakken.',
    cost: 1000,
    storageKey: 'pickupLimit',
    event: 'pickup-upgrade-purchased',
    pickupLimit: 6,
    unlocked: false
  },
  {
    id: 'pickup-upgrade 4',
    title: 'Meerdere Items Oppakken 4',
    description: 'Je kunt nu tot 8 items tegelijk oppakken.',
    cost: 2500,
    storageKey: 'pickupLimit',
    event: 'pickup-upgrade-purchased',
    pickupLimit: 8,
    unlocked: false
  },
  {
    id: 'pickup-upgrade 5',
    title: 'Meerdere Items Oppakken 5',
    description: 'Je kunt nu tot 10 items tegelijk oppakken.',
    cost: 5000,
    storageKey: 'pickupLimit',
    event: 'pickup-upgrade-purchased',
    pickupLimit: 10,
    unlocked: false
  },
  {
    id: 'recycle-upgrade 1',
    title: 'Scheiden upgrade 1',
    description: 'Je kunt nu tot 2 items tegelijk scheiden.',
    cost: 100,
    storageKey: 'recycleLimit',
    event: 'recycle-upgrade-purchased',
    recycleLimit: 2,
    unlocked: false
  },
  {
    id: 'recycle-upgrade 2',
    title: 'Scheiden upgrade 2',
    description: 'Je kunt nu tot 4 items tegelijk scheiden.',
    cost: 400,
    storageKey: 'recycleLimit',
    event: 'recycle-upgrade-purchased',
    recycleLimit: 4,
    unlocked: false
  },
  {
    id: 'recycle-upgrade 3',
    title: 'Scheiden upgrade 3',
    description: 'Je kunt nu tot 6 items tegelijk scheiden.',
    cost: 1000,
    storageKey: 'recycleLimit',
    event: 'recycle-upgrade-purchased',
    recycleLimit: 6,
    unlocked: false
  },
  {
    id: 'recycle-upgrade 4',
    title: 'Scheiden upgrade 4',
    description: 'Je kunt nu tot 8 items tegelijk scheiden.',
    cost: 2500,
    storageKey: 'recycleLimit',
    event: 'recycle-upgrade-purchased',
    recycleLimit: 8,
    unlocked: false
  },
  {
    id: 'recycle-upgrade 5',
    title: 'Scheiden upgrade 5',
    description: 'Je kunt nu tot 10 items tegelijk scheiden.',
    cost: 5000,
    storageKey: 'recycleLimit',
    event: 'recycle-upgrade-purchased',
    recycleLimit: 10,
    unlocked: false
  },
]);

onMounted(() => {
  geld.value = parseInt(localStorage.getItem('Geld')) || 0;
  
  // Laad unlock status van alle upgrades en initialiseer zichtbaarheid per groep
  const getGroup = (upgrade) => {
    if (upgrade.id.startsWith('belt')) return 'belt';
    if (upgrade.id.startsWith('spawn-rate')) return 'spawn-rate';
    if (upgrade.id.startsWith('inventory')) return 'inventory';
    if (upgrade.id.startsWith('pickup-upgrade')) return 'pickup-upgrade';
    if (upgrade.id.startsWith('recycle-upgrade')) return 'recycle-upgrade';
    return upgrade.id;
  };

  const groups = {};
  upgrades.value.forEach((upgrade, idx) => {
    // Detect unlocked: spawn-rate upgrades store snelheid, belts store 1
    if (upgrade.storageKey === 'upgradespawnrate' && upgrade.snelheid !== undefined) {
      const currentSpawnRate = parseInt(localStorage.getItem(upgrade.storageKey)) || 5000; // standaard 5000
    upgrade.unlocked = currentSpawnRate <= upgrade.snelheid;
    } else if (upgrade.storageKey === 'maxAfval' && upgrade.inventory !== undefined) {
      const currentMaxAfval = parseInt(localStorage.getItem(upgrade.storageKey)) || 5; // standaard 5
      upgrade.unlocked = upgrade.inventory <= currentMaxAfval;
    } else if (upgrade.storageKey === 'pickupLimit' && upgrade.pickupLimit !== undefined) {
      const currentPickupLimit = parseInt(localStorage.getItem(upgrade.storageKey)) || 1; // standaard 1
      upgrade.unlocked = upgrade.pickupLimit <= currentPickupLimit;
    } else if (upgrade.storageKey === 'recycleLimit' && upgrade.recycleLimit !== undefined) {
      const currentRecycleLimit = parseInt(localStorage.getItem(upgrade.storageKey)) || 1; // standaard 1
      upgrade.unlocked = upgrade.recycleLimit <= currentRecycleLimit;
    } else {
      upgrade.unlocked = parseInt(localStorage.getItem(upgrade.storageKey)) === 1;
    }

    if (upgrade.visible === undefined) upgrade.visible = false;

    const g = getGroup(upgrade);
    if (!groups[g]) groups[g] = [];
    groups[g].push({ idx, upgrade });
  });

  // Per groep: bepaal welke upgrade zichtbaar moet zijn
  Object.values(groups).forEach(list => {
    // Zoek de hoogste unlocked upgrade in deze groep
    let lastUnlockedIndex = -1;
    for (let i = 0; i < list.length; i++) {
      if (list[i].upgrade.unlocked) {
        lastUnlockedIndex = i;
      }
    }

    // Alleen de volgende na de laatst unlocked mag zichtbaar zijn
    if (lastUnlockedIndex < list.length - 1) {
      list[lastUnlockedIndex + 1].upgrade.visible = true;
    }
  });

  const achievements = Achievements.getAchievements();

  const hasAnyUpgrade = upgrades.value.some(u => !!u.unlocked);

  if (!achievements['eersteUpgrade'].unlocked && hasAnyUpgrade) {
    Achievements.giveAchievement('eersteUpgrade');
  }
  else {
    const groupNames = Object.keys(groups);
    const lastUnlockedPerGroup = {};
    groupNames.forEach(gName => {
      const list = groups[gName];
      if (!list || list.length === 0) {
        lastUnlockedPerGroup[gName] = false;
      } else {
        const last = list[list.length - 1];
        lastUnlockedPerGroup[gName] = !!(last && last.upgrade && last.upgrade.unlocked);
      }
    });

    const anyFull = Object.values(lastUnlockedPerGroup).some(v => v);
    if (!achievements['volleUpgradeBar'].unlocked && anyFull) {
      Achievements.giveAchievement('volleUpgradeBar');
    }
    else {
      const relevant = ['belt', 'spawn-rate', 'inventory', 'pickup-upgrade', 'recycle-upgrade'];
      const allFull = relevant.every(g => !!lastUnlockedPerGroup[g]);
      if (!achievements['alleVolleUpgradeBars'].unlocked && allFull) {
        Achievements.giveAchievement('alleVolleUpgradeBars');
      }

        if (!!lastUnlockedPerGroup['belt'] && !achievements['beltBarCompleet'].unlocked) {
          Achievements.giveAchievement('beltBarCompleet'); 
        }
        if (!!lastUnlockedPerGroup['spawn-rate'] && !achievements['spawnRateBarCompleet'].unlocked) {
          Achievements.giveAchievement('spawnRateBarCompleet'); 
        }
        if (!!lastUnlockedPerGroup['inventory'] && !achievements['inventoryBarCompleet'].unlocked) {
          Achievements.giveAchievement('inventoryBarCompleet'); 

      const specialistGroups = ['belt', 'spawn-rate', 'inventory', 'pickup-upgrade', 'recycle-upgrade'];
      const hasUpgradeInEachGroup = specialistGroups.every(g => {
        const list = groups[g];
        return list && list.some(item => item.upgrade.unlocked);
      });
      if (!achievements['upgradeSpecialist'].unlocked && hasUpgradeInEachGroup) {
        Achievements.giveAchievement('upgradeSpecialist');
      }

      const totalUpgradesUnlocked = upgrades.value.filter(u => u.unlocked).length;
      if (!achievements['upgradeVerslaafd'].unlocked && totalUpgradesUnlocked >= 10) {
        Achievements.giveAchievement('upgradeVerslaafd');
      }
        }
        if (!!lastUnlockedPerGroup['pickup-upgrade'] && !achievements['pickupBarCompleet'].unlocked) {
          Achievements.giveAchievement('pickupBarCompleet');
        }
        if (!!lastUnlockedPerGroup['recycle-upgrade'] && !achievements['recycleBarCompleet'].unlocked) {
          Achievements.giveAchievement('recycleBarCompleet');
        }
    }
  }
  
  window.addEventListener('geld-updated', () => {
    geld.value = parseInt(localStorage.getItem('Geld')) || 0;
    // Achievement: Geldbaas
    if (!Achievements.getAchievements()['geldbaas'].unlocked && geld.value >= 10000) {
      Achievements.giveAchievement('geldbaas');
    }
  });
  
  // Listen for external open requests (from Phaser scenes)
  const handleOpenRequest = () => {
    openUpgradeMenu();
  };
  window.addEventListener('open-upgrade-menu', handleOpenRequest);
});

onBeforeUnmount(() => {
  window.removeEventListener('open-upgrade-menu', handleOpenRequest);
});

const openUpgradeMenu = () => {
  isOpen.value = true;
};

const closeUpgradeMenu = () => {
  isOpen.value = false;
};

const toggleUpgradeMenu = () => {
  isOpen.value = !isOpen.value;
};

const buyUpgrade = (upgrade) => {
  if (upgrade.unlocked) return;

  if (geld.value >= upgrade.cost) {
    const newGeld = geld.value - upgrade.cost;
    localStorage.setItem('Geld', newGeld);

    // Zet de juiste key op 1
    if (upgrade.storageKey === 'upgradespawnrate') {
      localStorage.setItem(upgrade.storageKey, upgrade.snelheid);
      window.dispatchEvent(new Event('geld-updated'));
    } else if (upgrade.storageKey === 'maxAfval') {
      localStorage.setItem(upgrade.storageKey, upgrade.inventory);
      window.dispatchEvent(new Event('geld-updated'));
      window.dispatchEvent(new Event('max-afval-updated'));
    } else if (upgrade.storageKey === 'pickupLimit') {
      localStorage.setItem(upgrade.storageKey, upgrade.pickupLimit);
      window.dispatchEvent(new Event('geld-updated'));
    }  else if (upgrade.storageKey === 'recycleLimit') {
      localStorage.setItem(upgrade.storageKey, upgrade.recycleLimit);
      window.dispatchEvent(new Event('geld-updated'));
    } else {
      localStorage.setItem(upgrade.storageKey, 1);
      window.dispatchEvent(new Event('geld-updated'));
    }

    geld.value = newGeld;
    upgrade.unlocked = true;

    EventBus.emit(upgrade.event);
    window.dispatchEvent(new Event('geld-updated'));

    // Maak de volgende upgrade in deze groep zichtbaar (indien aanwezig)
    const getGroup = (u) => {
      if (u.id.startsWith('belt')) return 'belt';
      if (u.id.startsWith('spawn-rate')) return 'spawn-rate';
      if (u.id.startsWith('inventory')) return 'inventory';
      if (u.id.startsWith('pickup-upgrade')) return 'pickup-upgrade';
      if (u.id.startsWith('recycle-upgrade')) return 'recycle-upgrade';
      return u.id;
    };

    const groupName = getGroup(upgrade);
    const group = upgrades.value.filter(u => getGroup(u) === groupName);

    const currentIndex = group.findIndex(u => u === upgrade);
    if (currentIndex !== -1 && currentIndex < group.length - 1) {
      group[currentIndex + 1].visible = true;
    }

  } else {
    alert(`Je hebt niet genoeg geld! Je hebt ${upgrade.cost - geld.value} meer geld nodig.`);
  }
};

defineExpose({
  openUpgradeMenu,
  closeUpgradeMenu, 
  toggleUpgradeMenu,
  isOpen
});
</script>

<template>
  <div>
    <!-- Modal Overlay -->
    <div v-if="isOpen" class="modal-overlay" @click="closeUpgradeMenu"></div>

    <!-- Modal Container -->
    <div v-if="isOpen" class="upgrade-modal">
      <div class="modal-header">
        <h1>Upgrades</h1>
        <button class="close-btn" @click="closeUpgradeMenu">✕</button>
      </div>

      <div class="modal-content">
        <!-- Upgrade Cards Loop -->
        <div v-for="upgrade in upgrades.filter(u => u.visible || u.unlocked)" :key="upgrade.id" class="upgrade-card">
          <div class="upgrade-info">
            <h2>{{ upgrade.title }}</h2>
            <p class="upgrade-description">{{ upgrade.description }}</p>
            <div class="upgrade-stats">
              <p><strong>Kosten:</strong> {{ upgrade.cost }} geld</p>
            </div>
          </div>

          <div class="upgrade-action">
            <p class="current-geld">Je hebt: <strong>{{ geld }}</strong> geld</p>
            <button 
              v-if="!upgrade.unlocked"
              @click="buyUpgrade(upgrade)"
              :disabled="geld < upgrade.cost"
              class="buy-btn"
              :class="{ disabled: geld < upgrade.cost }"
            >
              Kopen
            </button>
            <button v-else class="buy-btn purchased" disabled>
              Gekocht ✓
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Button to open menu -->
  <!-- <button @click="toggleUpgradeMenu" class="button4">Upgrades</button> -->
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1999;
}

.upgrade-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(116,	194,	121);
  border: 5px solid rgb(13, 68, 17);
  border-radius: 15px;
  z-index: 2000;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 3px solid rgb(13, 68, 17);
}

.modal-header h1 {
  margin: 0;
  color: rgb(255, 255, 255);
  font-size: 28px;
}

.close-btn {
  width: 50px;
  height: 50px;
  background-color: rgb(176, 42, 42);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 32px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .2s ease;
  box-shadow: 3px 3px 6px rgba(0,0,0,0.4);
}

.close-btn:hover {
  background-color: rgb(214, 69, 69);
  transform: translateY(-3px);
  box-shadow: 6px 6px 10px rgba(0,0,0,0.45);
}

.close-btn:active {
  transform: translateY(0);
  box-shadow: 3px 3px 6px rgba(0,0,0,0.35);
}

.modal-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.upgrade-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 3px solid rgb(13, 68, 17);
  border-radius: 10px;
  margin-bottom: 15px;
  gap: 20px;
}

.upgrade-info {
  flex: 1;
}

.upgrade-info h2 {
  margin: 0 0 10px 0;
  color: rgb(255, 255, 255);
  font-size: 20px;
}

.upgrade-description {
  color: rgb(255, 255, 255);
  margin: 0 0 15px 0;
  font-size: 14px;
}

.upgrade-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upgrade-stats p {
  margin: 0;
  color: rgb(255, 255, 255);
  font-size: 14px;
}

.unlocked {
  color: green;
  font-weight: bold;
}

.upgrade-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 150px;
}

.current-geld {
  margin: 0;
  color: rgb(255, 255, 255);
  font-weight: bold;
  font-size: 16px;
}

.buy-btn {
  padding: 10px 30px;
  font-size: 16px;
  color: white;
  background-color: #74c279;
  border: 3px solid #0d4411;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  width: 100%;
}

.buy-btn:hover:not(:disabled) {
  background-color: rgb(13, 68, 17);
  transform: scale(1.05);
}

.buy-btn.disabled {
  background-color: lightgrey;
  color: grey;
  cursor: not-allowed;
  opacity: 0.6;
}

.buy-btn.purchased {
  background-color: green;
  cursor: default;
}

.button4 {
  position: absolute;
  top: 340px;
  left: 1240px;
  z-index: 1000;
  padding: 10px 20px;
  font-size: 24px;
  color: grey;
  border: 5px solid grey;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  background-color: transparent;
  width: 245px;
  height: 46px;
  align-content: center;
  text-align: center;
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
}

.button4:hover {
  background-color: lightgrey;
}
</style>
