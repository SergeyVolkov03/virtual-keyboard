// document.addEventListener("keydown", (event) => {
//   console.log(event.key, event.code);
// });

// const textArea = document.querySelector(".textarea");
// textArea.value = "ghadfva";
import { keys } from "./keys.js";
let language = localStorage.language;
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
        console.log(keys[key].additionClasses);
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

getStartPage();
addKeys(language);
