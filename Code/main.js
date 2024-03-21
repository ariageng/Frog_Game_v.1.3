import "./style.css";
import { setupGameMachine } from "./gameMachine.js";
// import { setupFrogMachine } from "./frogMachine.js";

document.querySelector("#app").innerHTML = `
  <div>
    <div id="narrator-bubble"></div>
    <div id="chatting-bubbles">
      <span id="frog-bubble"></span>
      <span id="character-bubble"></span>
    </div>
    <div id="characters">
      <span id="frog-span">
        <img id="frog-image" class="character" src="src/frog_normal.gif" alt="frog is taking a nap">
      </span>
    </div>
    <div id="contextContainer"></div>
    <div class="card">
      <div id="start-button"></div>
      <div id="talk-button"></div>
    </div>
    <div id="buttons"></div>
    <div id="teachmore-button"></div>
  </div>
`;

setupGameMachine(document.querySelector("#start-button"));