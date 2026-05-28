import Phaser from "phaser";

export default class Item_localstorage {
    initStorage() {
        const defaults = {
            pickedPaper: 0,
            pickedPlasticBottle: 0,
            pickedRottonApple1: 0,
            pickedRottonApple2: 0,
            pickedRottonApple3: 0,
            pickedNatteDoos: 0,
            pickedKapoteNatteDoos: 0,
            pickedLaptopDoos: 0,
            pickedBlikje: 0,
            pickedVerkreukeldBlikje: 0,
            pickedGekreukeldFlesje: 0,
            pickedRottedBanana: 0,
            pickedBanaan: 0,
            pickedBeschimmeldeBanaan: 0,
            pickedBroodjeBal: 0,
            pickedBeschimmeldBroodjeBal: 0,
            pickedStrawberry: 0,
            pickedSlaBoos: 0,
            pickedKaas: 0,
            pickedBrood: 0,
            pickedSmoothieCup: 0,
            pickedShampoBottle: 0,
            pickedPlasticFolie: 0,
            pickedGepletteShampoFlesje: 0,
            pickedChipsZak: 0,
            pickedNewsPapier: 0,
            pickedPaperBag: 0,
            pickedPaperKapoteBag: 0,
            pickedPizzaDoos: 0,
            Geld: 0,
            maxAfval: 5,
            totalPickedItems: 0,
            upgradebelt2: 0,
            upgradebelt3: 0,
            upgradebelt4: 0,
            upgradebelt5: 0,
            upgradebelt6: 0,
            upgradebelt7: 0,
            upgradebelt8: 0,
            upgradebelt9: 0,
            upgradebelt10: 0,
            upgradespawnrate: 5000,
            pickupLimit: 1,
            recycleLimit: 1,
        };  

        for (const [key, value] of Object.entries(defaults)) {
          if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, value);
          }
        }
    }
}