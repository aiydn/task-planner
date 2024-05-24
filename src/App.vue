<script setup>
import { ref } from 'vue';
import planner from './components/Planner.vue'
import reloadPrompt from './components/ReloadPrompt.vue'


function maakLijst(bewoners, dagen, taken) {
  let temp = {}
  temp.niet = {}
  for (let dag = 0; dag < dagen.length; dag++) {
    for (let taak = 0; taak < taken.length; taak++) {
      for (let bewoner = 0; bewoner < bewoners.length; bewoner++) {
        temp[bewoners[bewoner] + '$' + dagen[dag] + '$' + taken[taak]] = false
        temp.niet['niet$' + dagen[dag] + '$' + taken[taak]] = false
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
  "taak4"
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
  "bewoner5"
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
            class="file-input file-input-bordered w-full" />
        </label>
        <div class="divider divider-horizontal"></div>
        <label class="form-control w-1/2">
          <div class="label">
            <span class="label-text">Maak een nieuw bestand</span>
          </div>
          <button class="btn no-animation  " @click="goToEdit()">Nieuw bestand</button>
        </label>
      </div>

    </div>
    <div v-if="inputEdit" class="grow flex flex-col">
      <div class="h-5/6 w-11/12 grid grid-cols-3 gap-4 mx-auto">
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
        <button v-if="!show" class="btn no-animation w-11/12	mx-auto my-4" @click="finishEdit()">Doorgaan</button>
      </div>
    </div>
  </div>
  <planner v-if="show" :input="input" />
</template>