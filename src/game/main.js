import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { MenuScene } from './scenes/MenuScene';
import { Recyclen } from './scenes/Recyclen';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Settings } from './scenes/Settings';
import { Achievements } from './scenes/Achievements';
import { Pause } from './scenes/Pause';
import SkinMenu from './scenes/SkinMenu';
import Credits from './scenes/Credits';


// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [
        Boot,
        Preloader,
        Game,
        Recyclen,
        Settings,
        Achievements,
        MenuScene,
        Pause,
        SkinMenu,
        Credits,
    ]
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });
}

export default StartGame;
