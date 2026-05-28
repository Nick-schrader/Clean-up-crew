import Phaser from 'phaser';

// Compact canonical -> Phaser.KeyCodes property name map
export const WORD_MAP = {
  "a":"A","b":"B","c":"C","d":"D","e":"E","f":"F","g":"G","h":"H","i":"I","j":"J","k":"K","l":"L","m":"M",
  "n":"N","o":"O","p":"P","q":"Q","r":"R","s":"S","t":"T","u":"U","v":"V","w":"W","x":"X","y":"Y","z":"Z",
  "0":"ZERO","1":"ONE","2":"TWO","3":"THREE","4":"FOUR","5":"FIVE","6":"SIX","7":"SEVEN","8":"EIGHT","9":"NINE",
  "space":"SPACE"," ":"SPACE",
  "up":"UP","down":"DOWN","left":"LEFT","right":"RIGHT",
  "arrowup":"UP","arrowdown":"DOWN","arrowleft":"LEFT","arrowright":"RIGHT",
  "enter":"ENTER","return":"ENTER",
  "esc":"ESC","escape":"ESC",
  "tab":"TAB","backspace":"BACKSPACE","delete":"DELETE","del":"DELETE","insert":"INSERT",
  "home":"HOME","end":"END","pageup":"PAGE_UP","pagedown":"PAGE_DOWN",
  "shift":"SHIFT","ctrl":"CTRL","control":"CTRL","alt":"ALT","meta":"META",
  "f1":"F1","f2":"F2","f3":"F3","f4":"F4","f5":"F5","f6":"F6","f7":"F7","f8":"F8","f9":"F9","f10":"F10","f11":"F11","f12":"F12",
  "comma":"COMMA","period":"PERIOD","dot":"PERIOD","semicolon":"SEMICOLON","quote":"QUOTE","slash":"SLASH","backslash":"BACKSLASH",
  "open_bracket":"OPEN_BRACKET","close_bracket":"CLOSE_BRACKET","minus":"MINUS","equals":"EQUALS","tilde":"TILDE","grave":"TILDE"
};

// Normalize a raw input (string or KeyboardEvent.key) to the canonical form used in WORD_MAP
export function normalizeKeyString(raw) {
  if (raw == null) return null;
  let s = String(raw);
  // event.key may be 'ArrowUp' or ' ' for space
  if (s === ' ') return 'space';
  if (s.toLowerCase().startsWith('arrow')) {
    return s.replace(/Arrow/i, '').toLowerCase();
  }
  // some browsers may say 'Spacebar' in old implementations
  if (s.toLowerCase() === 'spacebar') return 'space';
  return s.toLowerCase();
}

// Primary helper: convert a canonical string (or loose string) into a Phaser numeric key code
// Usage: const code = getPhaserKey('e'); // returns numeric code for E
export function getPhaserKey(name) {
  if (name == null) return null;
  const canonical = normalizeKeyString(name);
  if (!canonical) return null;

  // Look up mapping (WORD_MAP uses canonical lowercased keys)
  const phaserProp = WORD_MAP[canonical] || (canonical.length === 1 ? canonical.toUpperCase() : null);
  if (!phaserProp) {
    // final fallbacks for common forms
    if (canonical === 'up') return Phaser.Input.Keyboard.KeyCodes.UP;
    if (canonical === 'down') return Phaser.Input.Keyboard.KeyCodes.DOWN;
    if (canonical === 'left') return Phaser.Input.Keyboard.KeyCodes.LEFT;
    if (canonical === 'right') return Phaser.Input.Keyboard.KeyCodes.RIGHT;
    if (canonical === 'space') return Phaser.Input.Keyboard.KeyCodes.SPACE;
    return null;
  }

  const code = Phaser.Input.Keyboard.KeyCodes[phaserProp];
  return typeof code === 'number' ? code : null;
}

// Convenience: add a Phaser Key object to a scene using a stored canonical string
export function addKeyFor(scene, name) {
  if (!scene || !scene.input || !scene.input.keyboard) return null;
  const code = getPhaserKey(name);
  if (code == null) return null;
  return scene.input.keyboard.addKey(code);
}

export default getPhaserKey;
