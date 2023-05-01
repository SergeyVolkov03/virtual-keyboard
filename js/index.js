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
let language = localStorage.language;
let textForTextArea = "";
language = "RU";

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
}

function addSymbol(symbolEn, symbolRu) {
  const textArea = document.querySelector(".textarea");
  if (language === "EN") {
    textForTextArea =
      textForTextArea.slice(0, positionCursor) +
      symbolEn +
      CURSOR +
      textForTextArea.slice(positionCursor + 1);
    textArea.value = textForTextArea;
    positionCursor += 1;
  } else {
    textForTextArea =
      textForTextArea.slice(0, positionCursor) +
      symbolRu +
      CURSOR +
      textForTextArea.slice(positionCursor + 1);
    textArea.value = textForTextArea;
    positionCursor += 1;
  }
}

getStartPage();
addKeys(language);
addCursor();

document.addEventListener("keydown", (event) => {
  if (dobleDownKeys.includes(event.code)) {
    alredyDownKeys.add(event.code);
  }

  if (alredyDownKeys.has("ShiftLeft") || alredyDownKeys.has("ShiftRight")) {
    if (event.code === "AltLeft" || event.code === "AltRight") {
      changeLanguage(language);
    } else if (keys[event.code].shiftable) {
      addSymbol(keys[event.code].enShift, keys[event.code].ruShift);
    } else if (keys[event.code].isSymbol) {
      addSymbol(
        keys[event.code].en.toUpperCase(),
        keys[event.code].ru.toUpperCase()
      );
    }
  } else if (keys[event.code].isSymbol) {
    addSymbol(
      keys[event.code].en.toLowerCase(),
      keys[event.code].ru.toLowerCase()
    );
  }

  if (alredyDownKeys.has("AltLeft") || alredyDownKeys.has("AltRight")) {
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      changeLanguage(language);
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (alredyDownKeys.has(event.code)) {
    alredyDownKeys.delete(event.code);
  }
});
