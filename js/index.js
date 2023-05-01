import keys from './keys.js';

const alredyDownKeys = new Set();
const dobleDownKeys = [
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'AltLeft',
  'AltRight',
  'ControlRight',
];

const CURSOR = '_';
let positionCursor = 0;
let textForTextArea = '';
let language = localStorage.getItem('language') || 'RU';
let isShifted = false;
let isCapsLocked = false;

function setLanguage() {
  localStorage.setItem('language', language);
}

function getStartPage() {
  const body = document.querySelector('.body');
  const mainContainer = document.createElement('div');
  mainContainer.innerHTML = `<textarea class="textarea"></textarea>
  <div class="container-language"><div class="language">${language}</div><div class="change-language">Shift + Alt</div></div>
  <div class="keyboard"></div>`;
  mainContainer.classList.add('container-keyboard');
  body.prepend(mainContainer);
}

function addKeys(lang) {
  const keyboard = document.querySelector('.keyboard');
  const countLine = 5;
  for (let i = 1; i <= countLine; i += 1) {
    const line = document.createElement('div');
    line.classList.add('line');
    keyboard.append(line);
    Object.keys(keys).forEach((key) => {
      if (keys[key].line === i) {
        const keyElement = document.createElement('div');
        keyElement.dataset.key = key;
        if (lang === 'EN') {
          keyElement.textContent = keys[key].en;
        } else {
          keyElement.textContent = keys[key].ru;
        }
        keyElement.classList.add('key');
        if (keys[key].additionClasses.length > 0) {
          keys[key].additionClasses.forEach((c) => {
            keyElement.classList.add(`${c}`);
          });
        }
        line.append(keyElement);
      }
    });
  }
}

function addCursor() {
  const textArea = document.querySelector('.textarea');
  textForTextArea += CURSOR;
  textArea.value = textForTextArea;
}

function changeLanguage(lang) {
  const elementsKeys = document.querySelectorAll('.key');
  const elementLanguage = document.querySelector('.language');
  if (lang === 'EN') {
    for (let i = 0; i < elementsKeys.length; i += 1) {
      elementsKeys[i].textContent = keys[elementsKeys[i].dataset.key].ru;
    }
    language = 'RU';
    elementLanguage.textContent = 'RU';
  } else {
    for (let i = 0; i < elementsKeys.length; i += 1) {
      elementsKeys[i].textContent = keys[elementsKeys[i].dataset.key].en;
    }
    language = 'EN';
    elementLanguage.textContent = 'EN';
  }
  setLanguage();
}

function addSymbol(symbol) {
  const textArea = document.querySelector('.textarea');
  textForTextArea =
    textForTextArea.slice(0, positionCursor) +
    symbol +
    CURSOR +
    textForTextArea.slice(positionCursor + 1);
  textArea.value = textForTextArea;
  positionCursor += 1;
}

function deleteSymbolWithBackspace() {
  if (textForTextArea.length === 1) {
    return;
  }
  const textArea = document.querySelector('.textarea');
  textForTextArea =
    textForTextArea.slice(0, positionCursor - 1) +
    CURSOR +
    textForTextArea.slice(positionCursor + 1);
  textArea.value = textForTextArea;
  positionCursor -= 1;
}

function deleteSymbolWithDelete() {
  if (textForTextArea.length === 1) {
    return;
  }
  const textArea = document.querySelector('.textarea');
  textForTextArea =
    textForTextArea.slice(0, positionCursor) + CURSOR + textForTextArea.slice(positionCursor + 2);
  textArea.value = textForTextArea;
}

getStartPage();
addKeys(language);
addCursor();

document.addEventListener('mousedown', (event) => {
  if (!event.target.classList.contains('key')) {
    return;
  }

  const eventCode = event.target.dataset.key;
  downHandler(eventCode);
});

document.addEventListener('mouseup', (event) => {
  if (!event.target.classList.contains('key')) {
    return;
  }

  const eventCode = event.target.dataset.key;
  upHandler(eventCode);
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Tab') {
    event.preventDefault();
  }

  downHandler(event.code);
});

function downHandler(eventCode) {
  const elementsKeys = document.querySelectorAll('.key');
  elementsKeys.forEach((element) => {
    if (element.dataset.key === eventCode) {
      element.classList.add('down');
    }
  });

  if (dobleDownKeys.includes(eventCode)) {
    alredyDownKeys.add(eventCode);
  }

  if (eventCode === 'CapsLock') {
    isCapsLocked = !isCapsLocked;
    isShifted = isCapsLocked;
  }

  if (alredyDownKeys.has('ShiftLeft') || alredyDownKeys.has('ShiftRight')) {
    isShifted = !isCapsLocked;
  }

  rerender();

  if (isShifted) {
    if (keys[eventCode].shiftable) {
      addSymbol(keys[eventCode][`${language.toLowerCase()}Shift`]);
    } else if (keys[eventCode].isSymbol) {
      addSymbol(keys[eventCode][language.toLowerCase()].toUpperCase());
    }
  } else if (keys[eventCode].isSymbol) {
    addSymbol(keys[eventCode][language.toLowerCase()].toLowerCase());
  }

  if (eventCode === 'Space') {
    addSymbol(' ');
  }

  if (eventCode === 'Backspace') {
    deleteSymbolWithBackspace();
  }

  if (eventCode === 'Delete') {
    deleteSymbolWithDelete();
  }

  if (eventCode === 'Enter') {
    addSymbol('\n');
  }

  if (eventCode === 'Tab') {
    addSymbol('\t');
  }

  if (alredyDownKeys.has('AltLeft') || alredyDownKeys.has('AltRight')) {
    if (eventCode === 'ShiftLeft' || eventCode === 'ShiftRight') {
      changeLanguage(language);
    }
  }

  if (alredyDownKeys.has('ShiftLeft') || alredyDownKeys.has('ShiftRight')) {
    if (eventCode === 'AltLeft' || eventCode === 'AltRight') {
      changeLanguage(language);
    }
  }
}

document.addEventListener('keyup', (event) => {
  upHandler(event.code);
});

function upHandler(eventCode) {
  if (alredyDownKeys.has('ShiftLeft') && alredyDownKeys.has('ShiftRight') && isCapsLocked) {
    isShifted = true;
  } else if (alredyDownKeys.has('ShiftLeft') || alredyDownKeys.has('ShiftRight')) {
    isShifted = isCapsLocked;
  }

  rerender();
  alredyDownKeys.delete(eventCode);

  if (!isCapsLocked) {
    const capsLockKey = document.querySelector('[data-key="CapsLock"]');
    capsLockKey.classList.remove('down');
  }

  if (eventCode !== 'CapsLock') {
    const currentKey = document.querySelector(`[data-key="${eventCode}"]`);
    currentKey.classList.remove('down');
  }
}

function rerender() {
  const elementsKeys = document.querySelectorAll('.key');

  elementsKeys.forEach((element) => {
    const addString = isShifted ? 'Shift' : '';
    if (keys[element.dataset.key].shiftable) {
      const newElement = element;
      newElement.textContent = keys[element.dataset.key][`${language.toLowerCase()}${addString}`];
    }
  });
}
