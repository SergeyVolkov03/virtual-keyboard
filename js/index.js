import { keys } from "./keys.js";
const alredyDownKeys = new Set();
const dobleDownKeys = [
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "AltLeft",
  "AltRight",
  "ControlRight",
];

const CURSOR = "_";
let positionCursor = 0;
let textForTextArea = "";
let language = localStorage.getItem('language') || 'RU';

function setLanguage() {
  localStorage.setItem('language', language)
}

function getStartPage() {
  const body = document.querySelector(".body");
  const mainContainer = document.createElement("div");
  mainContainer.innerHTML = `<textarea class="textarea" disabled></textarea>
  <div class="container-language"><div class="language">${language}</div><div class="change-language">Shift + Alt</div></div>
  <div class="keyboard"></div>`;
  mainContainer.classList.add("container-keyboard");
  body.prepend(mainContainer);
}

function addKeys(lang) {
  const keyboard = document.querySelector(".keyboard");
  const countLine = 5;
  for (let i = 1; i <= countLine; i++) {
    let line = document.createElement("div");
    line.classList.add("line");
    keyboard.append(line);
    for (let key in keys) {
      if (keys[key].line === i) {
        let keyElement = document.createElement("div");
        keyElement.dataset.key = key;
        if (lang === "EN") {
          keyElement.textContent = keys[key].en;
        } else {
          keyElement.textContent = keys[key].ru;
        }
        keyElement.classList.add("key");
        if (keys[key].additionClasses.length > 0) {
          for (let i of keys[key].additionClasses) {
            keyElement.classList.add(`${i}`);
          }
        }
        line.append(keyElement);
      }
    }
  }
}

function addCursor() {
  const textArea = document.querySelector(".textarea");
  textForTextArea += CURSOR;
  textArea.value = textForTextArea;
}

function changeLanguage(lang) {
  const elementsKeys = document.querySelectorAll(".key");
  const elementLanguage = document.querySelector(".language");
  if (lang === "EN") {
    for (let i = 0; i < elementsKeys.length; i++) {
      elementsKeys[i].textContent = keys[elementsKeys[i].dataset.key].ru;
    }
    language = "RU";
    elementLanguage.textContent = "RU";
  } else {
    for (let i = 0; i < elementsKeys.length; i++) {
      elementsKeys[i].textContent = keys[elementsKeys[i].dataset.key].en;
    }
    language = "EN";
    elementLanguage.textContent = "EN";
  }
  setLanguage()
}

function addSymbol(symbol) {
  const textArea = document.querySelector(".textarea");
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
  const textArea = document.querySelector(".textarea");
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
  const textArea = document.querySelector(".textarea");
  textForTextArea =
    textForTextArea.slice(0, positionCursor) +
    CURSOR +
    textForTextArea.slice(positionCursor + 2);
  textArea.value = textForTextArea;
}

getStartPage();
addKeys(language);
addCursor();

document.addEventListener("keydown", (event) => {
  const elementsKeys = document.querySelectorAll(".key");
  elementsKeys.forEach((element) => {
    if (element.dataset.key === event.code) {
      element.classList.add("down");
    }
  });

  if (dobleDownKeys.includes(event.code)) {
    alredyDownKeys.add(event.code);
  }

  if (alredyDownKeys.has("ShiftLeft") || alredyDownKeys.has("ShiftRight")) {
    elementsKeys.forEach((element) => {
      if (keys[element.dataset.key].shiftable) {
        if (language === "EN") {
          element.textContent = keys[element.dataset.key].enShift;
        } else {
          element.textContent = keys[element.dataset.key].ruShift;
        }
      }
    });
    if (event.code === "AltLeft" || event.code === "AltRight") {
      changeLanguage(language);
    } else if (keys[event.code].shiftable) {
      if (language === "EN") {
        addSymbol(keys[event.code].enShift);
      } else {
        addSymbol(keys[event.code].ruShift);
      }
    } else if (keys[event.code].isSymbol) {
      if (language === "EN") {
        addSymbol(keys[event.code].en.toUpperCase());
      } else {
        addSymbol(keys[event.code].ru.toUpperCase());
      }
    }
  } else if (keys[event.code].isSymbol) {
    if (language === "EN") {
      addSymbol(keys[event.code].en.toLowerCase());
    } else {
      addSymbol(keys[event.code].ru.toLowerCase());
    }
  }

  if (event.code === "Space") {
    addSymbol(" ");
  }

  if (event.code === "Backspace") {
    deleteSymbolWithBackspace();
  }

  if (event.code === "Delete") {
    deleteSymbolWithDelete();
  }

  if (event.code === "CapsLock") {
    if (alredyDownKeys.has("CapsLock")) {
      elementsKeys.forEach((element) => {
        if (element.dataset.key === event.code) {
          element.classList.remove("down");
        }
      });
      alredyDownKeys.delete(event.code);
    } else alredyDownKeys.add(event.code);
  }

  if (alredyDownKeys.has("AltLeft") || alredyDownKeys.has("AltRight")) {
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      changeLanguage(language);
    }
  }
});

document.addEventListener("keyup", (event) => {
  const elementsKeys = document.querySelectorAll(".key");
  if (event.code !== "CapsLock") {
    elementsKeys.forEach((element) => {
      if (element.dataset.key === event.code) {
        element.classList.remove("down");
      }
    });
  }

  if (alredyDownKeys.has("ShiftLeft") || alredyDownKeys.has("ShiftRight")) {
    elementsKeys.forEach((element) => {
      if (keys[element.dataset.key].shiftable) {
        if (language === "EN") {
          element.textContent = keys[element.dataset.key].en;
        } else {
          element.textContent = keys[element.dataset.key].ru;
        }
      }
    });
    alredyDownKeys.delete(event.code);
  } else if (alredyDownKeys.has("CapsLock")) {
    return;
  } else {
    alredyDownKeys.delete(event.code);
  }
});
