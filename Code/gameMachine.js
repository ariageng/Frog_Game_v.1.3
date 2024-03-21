import { assign, createActor, setup } from "xstate";
import { speechstate } from "speechstate";
import { createBrowserInspector } from "@statelyai/inspect";
import { NLU_KEY,KEY } from "./azure.js";
import { grammar_prof } from "./grammar.js";

const inspector = createBrowserInspector();

//basic speech recognition
const azureCredentials = {
  endpoint:
    "https://northeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
  key: KEY,
};

//nlu speech recognition
const azureLanguageCredentials = {
  endpoint:
  "https://language-resource-tianyigeng.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-10-01-preview",
  key: NLU_KEY,
  deploymentName: "appointment",
  projectName: "appointment",

};

const settings = {
  azureLanguageCredentials: azureLanguageCredentials, /** global activation of NLU */
  azureCredentials: azureCredentials, 
  asrDefaultCompleteTimeout: 0,
  asrDefaultNoInputTimeout: 4000,
  locale: "en-US",
  ttsDefaultVoice: "en-US-AndrewNeural",
  //speechRecognitionEndpointId: "9a735a2d-1224-4398-baaa-9b0c80e1032e",
};

/* Grammar definition */
const grammar_professowl = grammar_prof



/* Helper functions */
function showNarratorText(targetText) {
  // Get the parent div with id "narrator-bubble"
  const narratorBubbleDiv = document.querySelector("#narrator-bubble");

  // Remove existing chat bubbles
  while (narratorBubbleDiv.firstChild) {
    narratorBubbleDiv.removeChild(narratorBubbleDiv.firstChild);
  }
  
  // Create a new div for the chat bubble
  const chatBubble = document.createElement("div")
  chatBubble.classList.add("narrator-bubble");
  
  // Add text to the chat bubble
  const textElement = document.createElement("p");
  textElement.textContent = targetText
  
  // Append the text element to the chat bubble
  chatBubble.appendChild(textElement)

  // Append the chat bubble to the parent div
  narratorBubbleDiv.appendChild(chatBubble);  

  // Ensure the narrator bubble is visible
  narratorBubbleDiv.style.display = "flex";
}

function showFrogText(targetText) {
  // Get the parent div with id "frog-bubble"
  const frogBubbleSpan = document.querySelector("#frog-bubble");

  // Remove existing chat bubbles
  while (frogBubbleSpan.firstChild) {
    frogBubbleSpan.removeChild(frogBubbleSpan.firstChild);
  }

  // Create a new span for the chat bubble
  const chatBubble = document.createElement("span")
  chatBubble.classList.add("chat-bubble");
  
  // Add text to the chat bubble
  const textElement = document.createElement("p");
  textElement.textContent = targetText
  
  // Append the text element to the chat bubble
  chatBubble.appendChild(textElement)

  // Append the chat bubble to the parent div
  frogBubbleSpan.appendChild(chatBubble);  
}

function hideFrogText() {
  const frogBubbleSpan = document.querySelector("#frog-bubble");
  if (frogBubbleSpan) {
    while (frogBubbleSpan.firstChild) {
      frogBubbleSpan.removeChild(frogBubbleSpan.firstChild);
    }
  }
}

function showCharacterText(targetText) {
  // Get the parent span with id "character-bubble"
  const characterBubbleSpan = document.querySelector("#character-bubble");

  // Remove existing chat bubbles
  while (characterBubbleSpan.firstChild) {
    characterBubbleSpan.removeChild(characterBubbleSpan.firstChild);
  }

  // Create a new span for the chat bubble
  const chatBubble = document.createElement("span")
  chatBubble.classList.add("chat-bubble");
  
  // Add text to the chat bubble
  const textElement = document.createElement("p");
  textElement.textContent = targetText
  
  // Append the text element to the chat bubble
  chatBubble.appendChild(textElement)

  // Append the chat bubble to the parent div
  characterBubbleSpan.appendChild(chatBubble);  
}

function hideCharacterText() {
  const characterBubbleSpan = document.querySelector("#character-bubble");
  if (characterBubbleSpan) {
    while (characterBubbleSpan.firstChild) {
      characterBubbleSpan.removeChild(characterBubbleSpan.firstChild);
    }
  }
}

function frogSpeak() {
  const frogImage = document.getElementById("frog-image");

  // Replace existing gif
  if (frogImage) {
    frogImage.src = "src/frog_talking.gif";
  }
}

function frogWaiting() {
  const frogImage = document.getElementById("frog-image");

  // Replace existing gif
  if (frogImage) {
    frogImage.src = "src/frog_normal.gif";
  }
}

function frogWithBurger() {
  const frogImage = document.getElementById("frog-image");

  // Replace existing gif
  if (frogImage) {
    frogImage.src = "src/frog_with_burger.gif";
  }
}

function showCatshier() {
  // Get the parent div with id "characters"
  const characterDiv = document.getElementById("characters");

  const newCharacter = document.createElement("span");
  newCharacter.setAttribute("id", "catshier-span")
  
  // Create an image element
  const newImage = document.createElement("img");
  newImage.classList.add("character");
  newImage.src = "src/catshier.gif";
  newImage.alt = "Catshier";

  // Append the image to the newly created span
  newCharacter.appendChild(newImage);

  // Append the chat bubble to the parent div
  characterDiv.appendChild(newCharacter);  
}

function hideNarratorText() {
  // Get the parent div with id "narrator-bubble"
  const narratorBubbleDiv = document.querySelector("#narrator-bubble");

  // Remove all child elements of the narrator bubble
  while (narratorBubbleDiv.firstChild) {
    narratorBubbleDiv.removeChild(narratorBubbleDiv.firstChild);
  }

  // Hide the narrator bubble
  narratorBubbleDiv.style.display = "none";
}

function hideCatshier() {
  // Get the parent div with id "characters"
  const characterDiv = document.getElementById("characters");

  // Get the character element
  const characterSpan = characterDiv.querySelector("#catshier-span");

  // Remove the character element if it exists
  if (characterSpan) {
    characterSpan.remove();
  }
}


function generateRepromptFormulation(repromptCounter) {
  switch (repromptCounter) {
    case 1:
      return `Frog is waiting for you to say something.`;
    case 2:
      return `Sorry, are you still there?`;
    case 3:
      return `Frog is listening, please say something.`;
  }
}

/* Game Machine */
const GameMachine = setup({
  actions: {
    //Wipes out old button (if any), shows new Start button
    ShowStartButton:({}) => {
      const element = document.querySelector("#start-button"); 
      element.style.display = "block";
      //remove old buttons if any
      const existingStartButton = element.querySelector("button");
      if (existingStartButton) {
        existingStartButton.remove();
      }
      //create new button
      const startButton = document.createElement("button");
      startButton.type = "button";
      startButton.innerHTML = "Start";
      startButton.addEventListener("click", () => {
            dmActor.send({type: "CLICK"});
            // Hide the button after it's clicked
            element.style.display = "none";
          });
      element.appendChild(startButton)
    },
    //Wipes out old button (if any), shows new Talk button and takes input
    ShowTalkButton: ({ context }) => {
      const element = document.querySelector("#talk-button"); 
      //remove old buttons if any
      const existingTalkButton = element.querySelector("button");
      if (existingTalkButton) {
        existingTalkButton.remove();
      }
      //create new button
      const talkButton = document.createElement("button");
      talkButton.type = "button";
      talkButton.innerHTML = "Talk";
      // Start listening when clicked 
      talkButton.addEventListener("click", () => {
          context.ssRef.send({
          type: "LISTEN",
          value:{ nlu:true, completeTimeout: 5}});
          // Show changed text 
          talkButton.innerHTML = "U are talking to Frog.."
          });
      element.appendChild(talkButton);
      element.style.display = "block";
    },
    HideTalkButton:({}) => {
      const element = document.querySelector("#talk-button"); 
      // Hide the Talk Button
      element.style.display = "none";
    },
    //Wipe out old texts, speak, and show new texts
    NarratorSpeak:({ context }, params) => {
      context.ssRef.send({
        type: "SPEAK",
        value: {
          utterance: params,
        },
      });
      showNarratorText(params);
    },
    ShowButton: ({ context }) => {
      const element = document.querySelector("#buttons"); 
      //remove old option buttons if any
      const existingButton = element.querySelector("button");
      if (existingButton) {
        existingButton.remove();
      }
      //generate option buttons
      const word_options = Object.keys(context.word);
      const sentence_options = Object.keys(context.sentence);
      for (const option of word_options) {
        const optionButton = document.createElement("button");
        optionButton.type = "button";
        optionButton.innerHTML = option;
        optionButton.addEventListener("click", () => {
          dmActor.send({type: "SELECT", value: option})
        });
        element.appendChild(optionButton)
      };
      for (const option of sentence_options) {
        const optionButton = document.createElement("button");
        optionButton.type = "button";
        optionButton.innerHTML = option;
        optionButton.addEventListener("click", () => {
          dmActor.send({type: "SELECT", value: option})
        });
        element.appendChild(optionButton)
      };
    },
    ShowTeachMoreButton: ({}) => {
      const element = document.querySelector("#teachmore-button"); 
      //remove old buttons if any
      const existingButton = element.querySelector("button");
      if (existingButton) {
        existingButton.remove();
      }
      //create new button
      const Button = document.createElement("button");
      Button.type = "button";
      Button.innerHTML = "Go back to teach more";
      element.appendChild(Button);
      element.style.display = "block";
      // Start listening when clicked 
      Button.addEventListener("click", () => {
        dmActor.send({type: "CLICK"})
          });
    },
    RemoveTeachMoreButton: ({}) =>{
      const element = document.querySelector("#teachmore-button"); 
      //remove old option buttons if any
      const existingButton = element.querySelector("button");
      if (existingButton) {
        existingButton.remove();
      }
    },
    RemoveButtons: ({}) => {
      const element = document.querySelector("#buttons"); 
      // Remove all button elements within the container
      const buttons = Array.from(element.querySelectorAll("button"));
      buttons.forEach(button => {
      button.remove();
    });
    },
    ShowFrogDict: ({ context }) =>{
      const contextElement = document.getElementById("contextContainer");
      const result = { word:{}, sentence:{}};
      // word: {hello:{topic: "greeting"}, hi:{..},..}
      for (const learntWord in context.word) {
        result.word[learntWord] = context.word[learntWord];
      }
      for (const learntSent in context.sentence) {
        result.sentence[learntSent] = context.sentence[learntSent];
      }

      // Check if the element exists
      if (contextElement) {
      // Clear previous content if any
        contextElement.innerHTML = "";
      
      // Create a new paragraph element
      const paragraph = document.createElement("p");
      
      // Set the inner text of the paragraph to the context content
      paragraph.textContent = "This is your Frog Dictionary: "+ JSON.stringify(result);

      // Append the paragraph to the context container element
      contextElement.appendChild(paragraph);
      contextElement.style.display = "block";
      }
    },
    HideResults: ({}) => {
      const resultsElement = document.getElementById("contextContainer");

      // Check if the element exists
      if (resultsElement) {
        // Hide the element
        resultsElement.style.display = "none";
      }
    },
    HandleNoInput: ({ context }) => {
      if (context.noInputCount <=3 ) {
        const repromptFormulation = generateRepromptFormulation(context.noInputCount);
        context.ssRef.send({
          type: "SPEAK",
          value: { utterance: repromptFormulation },});
        context.noInputCount += 1;
        showNarratorText(repromptFormulation);
      } else {
        hideNarratorText();
        dmActor.send({type: "STILL_Noinput"});;
      };
    },
        // FrogSpeak:({ context }, params) => {
    //   context.ssRef.send({
    //     type: "SPEAK",
    //     value: {
    //       utterance: params,
    //     },
    //   });
    //   showFrogText(params);
    // },
      // FrogLearn:({ context }, { data } ) =>  {
      //   const { wordOrSentence, newSentence, feature, content } = data;
      //   context[wordOrSentence][newSentence] = { [feature]: content};
      // },
  },
  guards: {
    actionOnce:  ({context}) => {
      if (context.action_counter === 0){
        context.action_counter +=1;
        return true; 
      }
      else{
        context.action_counter -=1;
        return false;
      }
    },
    isOfTopicFood: ({context}) => {
      const frogUtterance = context.input.toLowerCase(); // 'input' holds the frog's utterance
      const words = Object.keys(context.word);
      const sentences = Object.keys(context.sentence);

      // Check if frogUtterance is involved in any word with topic "food"
      for (const word of words) {
        if (word.includes(frogUtterance) && context.word[word].topic === "food") {
          return true;
        }
      }

      // Check if frogUtterance is involved in any sentence with topic "food"
      for (const sentence of sentences) {
        if (sentence.includes(frogUtterance) && context.sentence[sentence].topic === "food") {
          return true;
        }
      }

      return false;
    },
    isRightFood: ({context}) => {
      const frogUtterance = context.input; // 'input' holds the frog's utterance
      const rightFoodList = ["hamburger", "milkshake", "fries", "nuggets", "burger"];

      // Check if frogUtterance involves any of the right food
      for (const food of rightFoodList) {
        if (frogUtterance.includes(food)) {
          return true;
        }
      }

      return false;
    },
  },
}).createMachine({
  context: {
    /* For func actionOnce */
    action_counter:0,
    noInputCount:1,
    input: null,
    wordOrSentence: null,
    feature: null,
    content: null,
    word: {},
    sentence: {},
  },
  id: "Game",
  initial: "SpeechstateSpawn",
  states: {
    "SpeechstateSpawn": {
      entry: [
        assign({
          ssRef: ({ spawn }) => spawn(speechstate, { input: settings }),
        }),
        ({ context }) => context.ssRef.send({ type: "PREPARE" }),
      ],
      on: { ASRTTS_READY: "WaitToStart" },
    },
    //Click to running
    "WaitToStart": {
      entry: {type: "ShowStartButton"},
      on: {
        CLICK: "Running",
      },
    },
    "Running": {
      initial: "Main",
      on: {ASR_NOINPUT : ".NoInput", GameOver: "#Game.GameOver", },
      states:{
        //Any NoInput inside "Main" will lead to a NoInput Prompt
        NoInput : {
          entry: [{
            type: "HandleNoInput",
            },],
          on: { 
            SPEAK_COMPLETE: [
              {
              actions: [{type: "ShowTalkButton"}], 
              target:"Main"},
              {}
            ],
            STILL_Noinput:{
              target:"#Game.GameOver.NoInputEnding"
            }
          },
        },
        Main: {
          initial: "hist",
          states:{
            Idle:{},
            hist: { type: "history", history:"deep",target: "0_1_Greeting"},
            //stage_0: Greeting
            "0_1_Greeting": {
              initial: "GreetingIntro",
              states:{
                //Greeting Introducing Frog & Show Talk button 
                GreetingIntro: {
                  entry: [{type: "HideResults",}, {type:"NarratorSpeak", params:`In the wild expanse, you stumble upon Frog! Eager to broaden its horizons, Frog seeks to master the art of human language from you! Let's kick things off with a friendly greeting!`}, 
                  ], 
                  on: 
                    {SPEAK_COMPLETE: "ListenToGreeting"},
                },
                //Listen to the greeting, store the greeting sentence, hide the talk button
                ListenToGreeting: {
                  entry: [{type: "ShowTalkButton"}],
                  on: {
                    RECOGNISED: {
                      actions:[
                        assign({ input: ({event}) => event.value[0].utterance.toLowerCase() }),
                        ({ context }) => {
                          const wordOrSentence = "sentence";
                          const newSentence = context.input;
                          const feature = "topic";
                          const content = "greeting";
                          context[wordOrSentence][newSentence] = { [feature]: content};
                          // type: "FrogLearn",
                          // data: {
                          //   wordOrSentence: "sentence",
                          //   newSentence: context.input,
                          //   feature: "topic",
                          //   content: "greeting",
                          // },
                        },
                        ({context}) => console.log(context),
                      ],
                      target: "ConfirmGreeting",
                    },
                  },
                  exit: [{type: "HideTalkButton",}]
                },
                //Stores the "greeting" and judges it
                ConfirmGreeting: {
                  entry: [{type: "NarratorSpeak", params:`Well Said! Let's see if Frog picked it up.`},],
                  on: {
                    SPEAK_COMPLETE: {
                      actions: [
                        ({ context }) => {
                          const sentenceKeyWithGreeting = Object.keys(context.sentence).find(
                            key => context.sentence[key].topic === "greeting");
                            console.log("Sentence key with greeting:", sentenceKeyWithGreeting); 
                          const params = `Frog speaking: "${
                            sentenceKeyWithGreeting
                          }".`;
                          showFrogText(params);
                          frogSpeak();
                          context.ssRef.send({
                            type: "SPEAK",
                            value: {
                              utterance: params,
                            },
                          });
                          },
                      ],
                      target:"#Game.Running.Main.0_2_WordTeaching",
                    },
                  },
                },
            },
            },
            "0_2_WordTeaching": {
              initial: "WordIntro",
              states:{
                WordIntro:{
                  on: {
                    SPEAK_COMPLETE: {
                      actions:[ 
                        frogWaiting, 
                        hideFrogText,
                        {type:"NarratorSpeak", params:`Let's try teaching. How about a word on topic of food?`},
                      ],
                      target:"WordShowTalk",
                    },
                  },
                },
                WordShowTalk:{
                  on: {
                    SPEAK_COMPLETE: {
                      actions:[ 
                        {type: "ShowTalkButton"}
                      ],
                      target:"WordListen",
                    },
                  },
                },
                WordListen:{
                  on:{
                    RECOGNISED: {
                      actions:[
                        assign({ input: ({event}) => event.value[0].utterance.toLowerCase() }),
                        ({ context }) => {
                          const wordOrSentence = "word";
                          const newWord = context.input;
                          const feature = "topic";
                          const content = "food";
                          context[wordOrSentence][newWord] = { [feature]: content};
                        },
                        ({context}) => console.log(context),
                      ],
                      target:"WordConfirm",
                    },
                  },
                  exit: [{type: "HideTalkButton",}]
                },
                WordConfirm:{
                  entry: [{type: "NarratorSpeak", params:`Yummy! Let's see if Frog picked it up.`},],
                  on: {
                    SPEAK_COMPLETE: {
                      actions: [
                        ({ context }) => {
                            const wordKeyWithFood = context.input;
                            const params = `Frog speaking: "${
                              wordKeyWithFood
                            }".`;
                            showFrogText(params);
                            frogSpeak();
                            context.ssRef.send({
                              type: "SPEAK",
                              value: {
                                utterance: params,
                              },
                            });
                          },
                      ],
                      target:"#Game.Running.Main.0_3_ReadyForMeeting",
                    },
                  },
                }, 
              },
            },
            "0_3_ReadyForMeeting":{
              initial:"MeetIntro",
              states:{
                MeetIntro:{
                  on: {
                    SPEAK_COMPLETE: {
                      actions:[ 
                        frogWaiting, 
                        hideFrogText,
                        {type:"NarratorSpeak", params:`Well done! Now Frog wants to try the language it has picked up! Are we ready for this?`},
                      ],
                      target:"MeetDeciding",
                    },
                  },
                },
                MeetDeciding: {
                  on:{
                    SPEAK_COMPLETE: {
                      actions:[ 
                        {type: "ShowTalkButton"}
                      ],
                      target:"MeetDecided",
                    },
                  }
                },
                MeetDecided: {
                  on:{
                    RECOGNISED: [
                      {
                        guard: ({ event }) => 
                          {const recognizedUtterance = event.nluValue;
                            console.log(recognizedUtterance);
                          return ( recognizedUtterance.topIntent === 'positive response');
                          },
                        actions:[ {type: "HideTalkButton",},
                          {type:"NarratorSpeak", 
                          params:`Ok, Frog is ready to go.`}
                        ],
                        target:"#Game.Running.Main.0_4_Meeting",
                      },
                      {
                        guard: ({ event }) => 
                        {const recognizedUtterance = event.nluValue;
                          console.log(recognizedUtterance);
                        return ( recognizedUtterance.topIntent === 'negative response');
                        },
                      actions:[ {type: "HideTalkButton",},
                        {type:"NarratorSpeak", 
                          params:`I agree. Let's teach some more.`}
                      ],
                      target:"#Game.Running.Main.0_5_TeachMore",
                      },
                    ],
                  },
                }
              },
            },
            "0_4_Meeting":{
              initial:"MeetingIntro",
              states:{
                MeetingIntro:{
                  on:{
                    SPEAK_COMPLETE: {
                      actions: [showCatshier,{type: "NarratorSpeak", params:`Frog has met Catshier, Catshier works at Wax Burger.`}],
                      target:"CharacterSpeaking",
                    },
                  },
                },
                CharacterSpeaking:{
                  on: {
                    SPEAK_COMPLETE: {
                      actions: [ 
                      ({ context }) => {
                        const params = `Catshier speaking: "Hi, what can I do for you?"`;
                        showCharacterText(params);
                        context.ssRef.send({
                          type: "SPEAK",
                          value: {
                            utterance: params,
                          },
                        });
                      },
                      hideNarratorText,
                      ],
                      target:"ChooseSpeech",
                    },
                  },
                },
                ChooseSpeech:{
                  on:{
                    SPEAK_COMPLETE: {
                      actions:[ { type:"ShowButton"}, {type:"ShowTeachMoreButton",}],
                      target: "FrogSpeakToCharacter",
                    },
                  },
                },
                FrogSpeakToCharacter:{
                  on:{
                    SELECT: {
                      actions: [
                        ({ context,event }) => {
                          const params = `Frog speaking: "${event.value}"`;
                          showFrogText(params);
                          frogSpeak();
                          context.ssRef.send({
                            type: "SPEAK",
                            value: {
                              utterance: params
                            },
                          });
                          // Save the frog speech to "input"
                          context.input = event.value;
                        },
                        {type: "RemoveButtons"},
                        {type: "RemoveTeachMoreButton"},
                      ],
                      target: "WaitForCharacterResponse",
                    },
                    // Send to "Teach More" stage if "TeachMore" is CLICKed
                    CLICK: {
                      actions: [
                      {type:"NarratorSpeak", params:`Good idea. Let's teach more.`},
                      {type: "RemoveButtons"}, 
                      hideFrogText, 
                      hideCharacterText,
                      hideCatshier,
                      {type: "RemoveTeachMoreButton"}],
                      target: "#Game.Running.Main.0_5_TeachMore"
                    },
                  },
                },
                WaitForCharacterResponse:{
                  on:{
                    SPEAK_COMPLETE: [
                      {
                        guard: {type: "isRightFood"},
                        actions: [
                          ({ context }) => {
                            const params = `Catshier speaking: "Sure! Here is your order. Have a nice day!`;
                            showCharacterText(params);
                            frogWaiting();
                            context.ssRef.send({
                              type: "SPEAK",
                              value: {
                                utterance: params,
                              },
                            });
                          },
                        ],
                        target: "#Game.GameOver.StandardEnding",
                      },
                      {
                        guard: {type: "isOfTopicFood"},
                        actions: [
                          ({ context }) => {
                            const params = `Catshier speaking: "Sorry, we don't sell that here. We offer hamburger, milkshake, fries and fish nuggets.`;
                            showCharacterText(params);
                            frogWaiting();
                            context.ssRef.send({
                              type: "SPEAK",
                              value: {
                                utterance: params,
                              },
                            });
                          },
                        ],
                        target: "#Game.Running.Main.0_4_Meeting.ChooseSpeech",
                      },
                      { actions: [({ context }) => {
                          const params = `Catshier speaking: "So what do you want to order?"`;
                          showCharacterText(params);
                          frogWaiting();
                          context.ssRef.send({
                            type: "SPEAK",
                            value: {
                              utterance: params,
                            },
                          });
                        },
                        ],
                        target: "#Game.Running.Main.0_4_Meeting.ChooseSpeech",}
                    ],
                  },
                },
              },
            },
            "0_5_TeachMore":{
              initial: "Intro",
              states:{
                Intro:{
                  on: {
                    SPEAK_COMPLETE: {
                      actions:[
                        {type:"NarratorSpeak", params:`Are we learning a word?`},
                      ],
                      target:"wordOrSentenceDeciding",
                    },
                  },
                },
                wordOrSentenceDeciding:{
                  on:{
                    SPEAK_COMPLETE: {
                      actions:[ 
                        {type: "ShowTalkButton"}
                      ],
                      target:"wordOrSentenceDecided",
                    },
                  }
                },
                wordOrSentenceDecided:{
                  on:{
                    RECOGNISED: [
                      { //if learning a "word"; then ask for "topic" name (e.g. Food)
                        guard: ({ event }) => 
                          {const recognizedUtterance = event.nluValue;
                            console.log(recognizedUtterance);
                          return ( recognizedUtterance.topIntent === 'positive response');
                          },
                        actions:[ assign({ wordOrSentence: () => "word" }),
                        {type:"NarratorSpeak", params:`What topic is it?`},
                        {type: "HideTalkButton",},
                        ],
                        target:"topicDeciding",
                      },
                      { 
                        actions:[ assign({ wordOrSentence: () => "sentence" }),
                        {type:"NarratorSpeak", params:`What topic is it?`},
                        {type: "HideTalkButton",},
                        ],
                        target:"topicDeciding",
                      },
                    ],
                  },
                },
                topicDeciding:{
                  on:{
                    SPEAK_COMPLETE: {
                      actions:[ 
                        {type: "ShowTalkButton"}
                      ],
                      target:"topicDecided",
                    },
                  }
                },
                topicDecided:{
                  on:{
                    RECOGNISED: [
                      { //store the "topic" name (e.g. Food)
                        actions:[ assign({ content: ({ event }) => event.value[0].utterance.toLowerCase() },),
                          {type:"NarratorSpeak", params:`Now what is the word/sentence?`},
                          {type: "HideTalkButton",}
                        ],
                        target:"inputDeciding",
                      },
                    ],
                  },
                },
                inputDeciding:{
                  on:{
                    SPEAK_COMPLETE: {
                      actions:[ 
                        {type: "ShowTalkButton"}
                      ],
                      target:"inputDecided",
                    },
                  }
                },
                inputDecided:{
                  on:{
                    RECOGNISED: [
                      { //store the input (e.g. "ice cream")
                        actions:[ assign({ input: ({ event }) => event.value[0].utterance.toLowerCase()},),
                          {type: "NarratorSpeak", params:`Great! Let's see if Frog picked it up.`},
                          {type: "HideTalkButton",}],
                        target:"FrogRepeat",
                      },
                    ],
                  },
                },
                FrogRepeat:{
                  on: {
                    SPEAK_COMPLETE: {
                      actions: [
                        ({ context }) => {
                            const params = `Frog speaking: "${
                              context.input
                            }".`;
                            showFrogText(params);
                            frogSpeak();
                            context.ssRef.send({
                              type: "SPEAK",
                              value: {
                                utterance: params,
                              },
                            });
                          },
                      ],
                      target:"Confirm",
                    },
                  },
                }, 
                Confirm:{
                  on: {
                    SPEAK_COMPLETE: {
                      actions: [()=> {frogWaiting(); hideFrogText();},
                        {type: "NarratorSpeak", params:`Was it right?`},
                        {type: "ShowTalkButton"}
                      ],
                      target:"ResultOfConfirm",
                    },
                  },
                }, 
                ResultOfConfirm: {
                  on:{
                    RECOGNISED: [
                      { //if learning a "word"; then ask for "topic" name (e.g. Food)
                        guard: ({ event }) => 
                          {const recognizedUtterance = event.nluValue;
                            console.log(recognizedUtterance);
                          return ( recognizedUtterance.topIntent === 'positive response');
                          },
                        actions:[ 
                          ({ context }) => {
                          const wordOrSentence = context.wordOrSentence;
                          const input = context.input;
                          const feature = "topic";
                          const content = context.content;
                          context[wordOrSentence][input] = { [feature]: content};
                          },
                          {type: "NarratorSpeak", params:`Great!`},
                          {type: "HideTalkButton",}
                        ],
                        target:"#Game.Running.Main.0_3_ReadyForMeeting.MeetIntro",
                      },
                      { 
                        actions:[
                        {type:"NarratorSpeak", params:`I see. Let's do it again.`},
                        {type: "HideTalkButton",}
                        ],
                        target:"#Game.Running.Main.0_5_TeachMore",
                      },
                    ],
                  },
                },
              },
            },
          }
        }
      },
    },
    //stage_5: Showing results & End the game
    "GameOver": {
      initial: "StandardEnding",
      states:{
        StandardEnding: {
          on:{
            SPEAK_COMPLETE: {
              actions:[
                { type: "NarratorSpeak", params: `Game Over. You had great conversations with the Frog. Check out this nice Frog Dictionary you have generated!`,},
                () => { hideFrogText(), hideCharacterText(), hideCatshier(), frogWithBurger()},
              ],
              target:"ShowResults"
            },
          },
        },
        ShowResults:{
          on:{
            SPEAK_COMPLETE: {
              actions:[{type: "HideTalkButton",},
                { type: "ShowFrogDict" },
                { type: "ShowStartButton" },
                hideNarratorText,
              ],
              target:"WaitingForRestart",
            }
          }
        },
        WaitingForRestart:{
          on:{
            CLICK: {
              target:"#Game.Running.Main.0_1_Greeting"
            },
          },
        },
        NoInputEnding:{
          initial:"Ending",
          states:{
            Ending: {
              entry:[{type:"NarratorSpeak", params:`The Game is ended.`},{type: "HideTalkButton",},],
              on: {
                SPEAK_COMPLETE:{
                  actions:[{ type:"ShowStartButton" }],
                  target:"#Game.GameOver.WaitingForRestart",
                },
              }
            }
          }
        }
      },
    },
  },
});


/* Create StateMachine Actor */
const dmActor = createActor(GameMachine, {
  inspect: inspector.inspect,
}).start();


dmActor.subscribe((state) => {
  console.log ( state )
}); 

export function setupGameMachine(element) {
  /*
  dmActor.getSnapshot().context.ssRef.subscribe((snapshot) => {
    element.innerHTML = `${snapshot.value.AsrTtsManager.Ready}`;
  });
  */
}





