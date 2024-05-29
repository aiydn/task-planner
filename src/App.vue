<script setup>
let version = '2.2.1'
import { ref } from 'vue';
import planner from './components/Planner.vue'
import reloadPrompt from './components/ReloadPrompt.vue'

function maakLijst(bewoners, dagen, taken) {
  let temp = {}
  temp.niet = {}
  for (const dag of dagen) {
    for (const taak of taken) {
      for (const bewoner of bewoners) {
        temp[bewoner + '$' + dag + '$' + taak] = false
        temp.niet['niet$' + dag + '$' + taak] = false
      }
    }
  }
  return temp
}
function load(files) {
  fileName = files[0].name
  fileName = fileName.substring(0, fileName.length - 5);
  let reader = new FileReader();
  reader.onload = logFile;
  reader.readAsText(files[0]);
}
let tasks = [
  "taak1",
  "taak2",
  "taak3",
  "taak4",
  "taak5",
  "taak6"
]
let days = [
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zondag"
]
let people = [
  "bewoner1",
  "bewoner2",
  "bewoner3",
  "bewoner4",
  "bewoner5",
  "bewoner6"

]
function goToEdit() {
  input.value.taken = Object.assign([], input.value.taken).join('\n').replace(/_/g, ' ');
  input.value.dagen = Object.assign([], input.value.dagen).join('\n').replace(/_/g, ' ');
  input.value.bewoners = Object.assign([], input.value.bewoners).join('\n').replace(/_/g, ' ');
  inputEdit.value = true
}
function finishEdit() {
  input.value.taken = Object.assign([], (input.value.taken.replace(/ /g, "_").split('\n')));
  input.value.dagen = Object.assign([], (input.value.dagen.replace(/ /g, "_").split('\n')));
  input.value.bewoners = Object.assign([], (input.value.bewoners.replace(/ /g, "_").split('\n')));
  input.value.lijst = updateLijst(input.value.lijst, maakLijst(input.value.bewoners, input.value.dagen, input.value.taken));
  input.value.lijst.niet = updateLijst(input.value.lijst.niet, maakLijst(input.value.bewoners, input.value.dagen, input.value.taken).niet)
  show.value = true;
}
const input = ref({
  taken: tasks,
  dagen: days,
  bewoners: people,
  lijst: maakLijst(people, days, tasks)
})

function updateLijst(adding, result) {
  if (adding !== undefined) {
    for (const property in adding) {
      if (property == 'niet') { }
      if (result[property] !== undefined) { result[property] = adding[property] }
    }
  };
  return result;
}

function logFile(event) {
  let str = event.target.result;
  let json = JSON.parse(str);
  json.lijst = updateLijst(json.lijst, maakLijst(json.bewoners, json.dagen, json.taken))
  json.lijst.niet = updateLijst(json.lijst.niet, maakLijst(json.bewoners, json.dagen, json.taken).niet)
  input.value = json;
  goToEdit()
}

const show = ref(false)
const inputEdit = ref(false)


var fileName = new Date().toLocaleDateString()

</script>

<template>

  <reloadPrompt />
  <div v-if="!show" class="flex h-screen">
    <div v-if="!inputEdit" class="m-auto w-2/3">
      <h1 class="text-3xl text-center">Taken Rooster Planner</h1>
      <div class="divider"></div>
      <div class="flex w-full">
        <label class="form-control w-1/2">
          <div class="label">
            <span class="label-text ">Upload een bestand</span>
          </div>
          <input @change="load($refs.fileInput.files)" ref="fileInput" accept=".json" type="file"
            class="file-input border-2 border-neutral w-full" />
        </label>
        <div class="divider divider-horizontal"></div>
        <label class="form-control w-1/2">
          <div class="label">
            <span class="label-text">Maak een nieuw bestand</span>
          </div>
          <button class="btn btn-neutral border-2 border-neutral no-animation  " @click="goToEdit()">Nieuw
            bestand</button>
        </label>
      </div>

    </div>
    <div v-if="inputEdit" class="grow flex flex-col">
      <div class="grow w-11/12 grid grid-cols-3 gap-4 mx-auto">
        <label class="form-control">
          <div class="label">
            <span class="label-text">Bewoners</span>
          </div>
          <textarea v-model="input.bewoners" class="textarea textarea-bordered h-full w-full"></textarea>
        </label>
        <label class="form-control">
          <div class="label">
            <span class="label-text">Dagen</span>
          </div>
          <textarea v-model="input.dagen" class="textarea textarea-bordered h-full w-full"></textarea>
        </label>
        <label class="form-control">
          <div class="label">
            <span class="label-text">Taken</span>
          </div>
          <textarea v-model="input.taken" class="textarea textarea-bordered h-full w-full"></textarea>
        </label>
      </div>
      <div class="flex w-screen">
        <button v-if="!show" class="btn btn-neutral no-animation w-11/12	mx-auto my-4"
          @click="finishEdit()">Doorgaan</button>
      </div>
    </div>
  </div>
  <footer v-if="!show && !inputEdit" class="footer items-center p-4 bg-neutral text-neutral-content">
    <aside class="items-center grid-flow-col">
      <div class="avatar">
        <div class="w-10 rounded-full">
          <img src="https://gravatar.com/avatar/34fd758a01e67f3ebf2da9a98eb12c4a3425020279dfeacc0890a5b32b6d51a2?s=200">
        </div>
      </div>
      <p>Gemaakt door A.S. © {{ new Date().getFullYear() }} - Versie {{ version }}</p>
    </aside>
    <nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
      <a href="https://github.com/aiydn/task-planner"><svg width="24" height="24" viewBox="0 0 20 20" version="1.1"
          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="fill-current">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <defs> </defs>
            <g id="Page-1" stroke="none" stroke-width="1">
              <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)">
                <g id="icons" transform="translate(56.000000, 160.000000)">
                  <path
                    d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399">
                  </path>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </a>
    </nav>
  </footer>
  <planner v-if="show" :input="input" />
</template>