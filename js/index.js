// document.addEventListener("keydown", (event) => {
//   console.log(event.key, event.code);
// });

// const textArea = document.querySelector(".textarea");
// textArea.value = "ghadfva";
import { keys } from "./keys.js";

function getStartPage() {
  const body = document.querySelector(".body");
  const mainContainer = document.createElement("div");
  mainContainer.innerHTML = `<textarea class="textarea" disabled></textarea>
  <div class="keyboard"></div>`;
  mainContainer.classList.add("container-keyboard");
  body.prepend(mainContainer);
}

function addKeys() {
  const keyboard = document.querySelector(".keyboard");
  const countLine = 5;
  for (let i = 1; i <= countLine; i++) {
    let line = document.createElement("div");
    line.classList.add("line");
    keyboard.append(line);
    for (let key in keys) {
      if (keys[key].line === i) {
        let keyElement = document.createElement("div");
        keyElement.textContent = keys[key].en;
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

getStartPage();
addKeys();
