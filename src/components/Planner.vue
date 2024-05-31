<script setup>
import { ref } from 'vue';
var props = defineProps({
  input: Object
})
let taken = props.input.taken;
let dagen = props.input.dagen;
let bewoners = props.input.bewoners;
const progress = ref(0);
const lijst = ref(props.input.lijst)
const show = ref(false)
window.onbeforeunload = function () {
  if (lastSave !== getSave()) {
    return 'Wijzigingen zijn *niet* opgeslagen!';
  }
};
function randomGenCheck() {
  if (progress.value == 0) {
    if (lastGenSave !== getSave()) {
      randomGenTry()
    }
    else {
      show.value = true

    }
  }
}

function getNumberOfWeek() {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  return "Week " + Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

const dropdown = ref({
  bewoner: true,
  dag: true,
  taak: true,
  week: getNumberOfWeek(),
})

function generateWeeknumbers() {
  let temp = [];
  for (let i = 1; i <= 53; i++) {
    temp.push("Week " + i)
  }
  return temp
}
function listAll(a, b, c) {
  let temp = []
  let A = [] //bewoners
  let B = [] //dagen
  let C = [] //taken
  if (a == true) { A = bewoners }
  else if (a == 'realtrue') { A[1] = 'true' }
  else if (Array.isArray(a)) { A = a }
  else { A[0] = a }
  if (b == true | b == 'true') { B = dagen }
  else if (Array.isArray(b)) { B = b }
  else { B[0] = b }
  if (c == true | c == 'true') { C = taken }
  else if (Array.isArray(c)) { C = c }
  else { C[0] = c }
  for (const bewoner of A) {
    for (const dag of B) {
      for (const taak of C) {
        temp.push(bewoner + '$' + dag + '$' + taak)
      }
    }
  }
  return temp
}
function blokeren(dag, taak, state) {
  toggleAll(listAll(true, dag, taak), false)
  lijst.value.niet['niet$' + dag + '$' + taak] = state
  dagTaakDropdown.value[dag + '$' + taak] = false;
}


function toggle(id, state) {
  let temp = getArray(id)
  if (lijst.value.niet['niet$' + temp.dag + '$' + temp.taak] == false)
    lijst.value[id] = state
}
function toggleAll(list, state) {
  for (const item of list) {
    toggle((item), state)
  }
}

function checkForDropdown(list) {
  let temp1 = []
  for (const item of list) {
    let temp = getArray(item)
    if (dagTaakDropdown.value[temp.dag + '$' + temp.taak] == false) { temp1.push(item) }
  }
  return temp1
}
function onlyChecked(list) {
  let temp = [];
  for (const item of list) {
    if (lijst.value[item] == true) {
      temp.push(item)
    }
    if (getArray(item).bewoner == 'niet') {
      if (lijst.value.niet[item] == true) { temp.push(item) }
    }
  }
  return temp

}

function onlyChosen(list, variable) {
  let temp = [];
  for (const item of list) {
    let temp2 = getArray(item)
    if (variable['true$' + temp2.dag + '$' + temp2.taak] == temp2.bewoner) { temp.push(temp2.bewoner + '$' + temp2.dag + '$' + temp2.taak) }
  }
  return temp

}
function getArray(id) {
  let temp = id.split('$')
  return {
    bewoner: temp[0],
    dag: temp[1],
    taak: temp[2],
  }
}

function getAll(list, option) {
  let temp = []
  for (const item of list) { temp.push(getArray(item)[option]) }
  return temp
}
function saveToFile() {
  if (progress.value == 0) {
  if (lastSave !== getSave()) {
    lastSave = getSave()
    let temp = new Date()

    const filename = 'Takenlijst opties ' + temp.toLocaleString('nl-NL') + '.json';
    const jsonStr = getSave();

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
  else (window.alert('Geen wijzigingen in de opties gevonden, opslaan niet nodig'))
}
}
function chosenOneLijst(bewoners, dagen, taken) {
  let temp = {}
  for (const dag of dagen) {
    for (const taak of taken) {
      temp[true + '$' + dag + '$' + taak] = undefined
    }
  }
  return temp
}
let choiseListTemp = chosenOneLijst(true, dagen, taken)
const choise = ref(choiseListTemp)
const choiseEmpty = ref(choiseListTemp)
function randomGenTry() {
  if (progress.value == 0) {
    let max = 500
    lastGenSave = getSave()
    let temp = []
    setTimeout(() => {
      progress.value = 1
    }, 0);

    for (let i = 0; i < max; i++) {
      setTimeout(() => {
        if (i % 1 == 0) { progress.value = 100 / max * i }
        temp.push(randomGen())
      }, 0);

    }
    setTimeout(() => {
      show.value = true
      progress.value = 100
      temp.sort(function (a, b) { if (a.leeg == b.leeg) { return 0.5 - Math.random() } else { return a.leeg - b.leeg } })
      choise.value = temp[0].result
    }, 0);
    setTimeout(() => {
      progress.value = 0
    }, 0);
  }
}

function randomGen() {
  let tempChoise = []
  let invulLijst = []
  for (const taak of taken) {
    for (const dag of dagen) {
      invulLijst.push({
        taak: taak,
        dag: dag,
        opties: getAll(onlyChecked(listAll(true, dag, taak)), 'bewoner').sort(function (a, b) { if (a.size == b.size) { return 0.5 - Math.random() } else { return a.size - b.size } }),
        size: getAll(onlyChecked(listAll(true, dag, taak)), 'bewoner').length
      })
    }
  }
  invulLijst.sort(function (a, b) { if (a.size == b.size) { return 0.5 - Math.random() } else { return a.size - b.size } }); //random
  for (const invulItem of invulLijst) {
    for (let ii = 0; ii < invulItem.size + 1; ii++) {
      tempChoise['true$' + invulItem.dag + '$' + invulItem.taak] = invulItem.opties[ii]
      if (onlyChosen(onlyChecked(listAll(invulItem.opties[ii], invulItem.dag, true)), tempChoise).length == 1 && onlyChosen(onlyChecked(listAll(invulItem.opties[ii], true, invulItem.taak)), tempChoise).length == 1) { break }
    }
  }
  let leeg = []
  for (const invulItem of invulLijst) {
    if (tempChoise['true$' + invulItem.dag + '$' + invulItem.taak] == undefined) { leeg.push('true$' + invulItem.dag + '$' + invulItem.taak) }
  }
  return { result: tempChoise, leeg: leeg.length }
}

function SelectByDropdownRun(day, task) {
  toggleAll(listAll(true, day, task), false)
  toggleAll(listAll(dagTaakDropdown.value[day + '$' + task], day, task), true)
}

function maakDagTaakDropdDown(dagen, taken) {
  let temp = {}
  for (const dag of dagen) {
    for (const taak of taken) {
      temp[dag + '$' + taak] = false
    }
  }
  return temp
}

function fixSetup() {
  for (const dag of dagen) {
    for (const taak of taken) {
      if (onlyChecked(listAll(true, dag, taak)).length == 1) {
        if (onlyChecked(listAll(true, dag, taak)).length == 1) {
          dagTaakDropdown.value[dag + '$' + taak] = getArray(onlyChecked(listAll(true, dag, taak))[0]).bewoner
        }
      }
    }
  }
}
const dagTaakDropdown = ref(maakDagTaakDropdDown(props.input.dagen, props.input.taken))
if (onlyChecked(listAll(true, true, true)).length == 0) { toggleAll(listAll(true, true, true), true) }
fixSetup()
function getSave() {
  return JSON.stringify({
    taken: taken,
    dagen: dagen,
    bewoners: bewoners,
    lijst: lijst._rawValue
  })
}
let lastSave = getSave()
let lastGenSave = getSave()
function printer() {
  if (progress.value == 0) {
    if ((choise._rawValue == choiseEmpty._rawValue) || (lastGenSave !== getSave())) {
      randomGenTry(); setTimeout(function () { window.print() }, 1000);
      lastGenSave = getSave()    
    }
    else {
      show.value = true
      window.print()
    }
  }
}

function opties() {
  if (progress.value == 0) {
    show.value = false
  }
}

function showModal() {
  if (progress.value == 0) {
    show.value = false
    quickToggle.showModal()
  }
}

</script>

<template>
  <progress class="fixed z-50 progress bottom-0 progress-primary w-full" v-if="progress !== 0" :value="progress"
    max="100"></progress>
  <dialog id="quickToggle" class="modal">
    <div class="fixed bottom-3 left-3 ">
      <div class="flex justify-end join	">
        <div class="shrink join-item">
          <select class="text-balance max-w-36 print:max-w-full line-clamp-2	text-xs join-item select select-bordered "
            v-model="dropdown.bewoner">
            <option selected :value=true>Alle bewoners</option>
            <option v-for="bewoner in bewoners" :value=bewoner>{{ bewoner.replace(/_/g, ' ') }}</option>
          </select>
        </div>
        <div class="shrink join-item">
          <select class="text-balance max-w-36 print:max-w-full line-clamp-2 text-xs join-item select select-bordered"
            v-model="dropdown.dag">
            <option selected :value=true>Alle Dagen</option>
            <option v-for="dag in dagen" :value=dag>{{ dag.replace(/_/g, ' ') }}</option>
          </select>
        </div>
        <div class="shrink join-item">
          <select class="text-balance max-w-36 print:max-w-full line-clamp-2	text-xs join-item select select-bordered"
            v-model="dropdown.taak">
            <option selected :value=true>Alle Taken</option>
            <option v-for="taak in taken" :value=taak>{{ taak.replace(/_/g, ' ') }}</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end join">
        <div class="w-full ">
          <button class="btn btn-neutral no-animation w-full select-sm join-item select-bordered " @click="toggleAll(checkForDropdown(listAll(dropdown.bewoner, dropdown.dag, dropdown.taak)), true);
          ">Aanvinken</button>
        </div>
        <div class="w-full">
          <button class="btn btn-neutral no-animation w-full select-sm join-item select-bordered "
            @click="toggleAll(checkForDropdown(listAll(dropdown.bewoner, dropdown.dag, dropdown.taak)), false)">Uitvinken</button>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <div class="fixed bottom-3 left-3 w-full max-w-fit z-50 print:hidden join">
    <div class="tooltip" data-tip="Opties">
      <button @click="opties()" class="btn btn-circle join-item  select-bordered">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 60 60"
          stroke="currentColor">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                d="M14,28h32c7.72,0,14-6.28,14-14S53.72,0,46,0H14C6.28,0,0,6.28,0,14S6.28,28,14,28z M14,2h32c6.617,0,12,5.383,12,12 s-5.383,12-12,12H14C7.383,26,2,20.617,2,14S7.383,2,14,2z">
              </path>
              <path
                d="M51.4,33.086c-0.01-0.004-0.02-0.007-0.03-0.011C49.715,32.385,47.902,32,46,32H14c-1.902,0-3.715,0.385-5.37,1.075 c-0.01,0.004-0.02,0.007-0.03,0.011C3.554,35.203,0,40.193,0,46c0,7.72,6.28,14,14,14h32c1.902,0,3.715-0.385,5.37-1.075 c0.01-0.004,0.02-0.007,0.029-0.011C56.446,56.797,60,51.807,60,46C60,40.193,56.446,35.203,51.4,33.086z M56.883,40.976 C57.593,42.507,58,44.205,58,46s-0.407,3.493-1.117,5.024C56.389,51.084,56,51.489,56,52c0,0.159,0.045,0.304,0.111,0.437 c-0.42,0.658-0.901,1.271-1.437,1.833C54.495,54.106,54.262,54,54,54c-0.552,0-1,0.448-1,1c0,0.219,0.085,0.41,0.204,0.575 C51.195,57.09,48.705,58,46,58c0-0.552-0.448-1-1-1s-1,0.448-1,1h-4c0-0.552-0.448-1-1-1s-1,0.448-1,1h-4c0-0.552-0.448-1-1-1 s-1,0.448-1,1h-4c0-0.552-0.448-1-1-1s-1,0.448-1,1h-4c0-0.552-0.448-1-1-1s-1,0.448-1,1h-4c0-0.552-0.448-1-1-1s-1,0.448-1,1 c-2.705,0-5.195-0.91-7.204-2.425C6.915,55.41,7,55.219,7,55c0-0.552-0.448-1-1-1c-0.262,0-0.495,0.106-0.673,0.27 C3.271,52.115,2,49.206,2,46c0-1.795,0.407-3.493,1.117-5.024C3.611,40.916,4,40.511,4,40c0-0.159-0.045-0.304-0.111-0.437 c0.42-0.658,0.901-1.271,1.437-1.833C5.505,37.894,5.738,38,6,38c0.552,0,1-0.448,1-1c0-0.219-0.085-0.41-0.204-0.575 C8.805,34.91,11.295,34,14,34c0,0.552,0.448,1,1,1s1-0.448,1-1h4c0,0.552,0.448,1,1,1s1-0.448,1-1h4c0,0.552,0.448,1,1,1 s1-0.448,1-1h4c0,0.552,0.448,1,1,1s1-0.448,1-1h4c0,0.552,0.448,1,1,1s1-0.448,1-1h4c0,0.552,0.448,1,1,1s1-0.448,1-1 c2.705,0,5.195,0.91,7.204,2.425C53.085,36.59,53,36.781,53,37c0,0.552,0.448,1,1,1c0.262,0,0.495-0.106,0.673-0.27 c0.536,0.562,1.017,1.176,1.437,1.833C56.045,39.696,56,39.841,56,40C56,40.511,56.389,40.916,56.883,40.976z">
              </path>
              <path
                d="M46,24c5.514,0,10-4.486,10-10S51.514,4,46,4S36,8.486,36,14S40.486,24,46,24z M46,6c4.411,0,8,3.589,8,8s-3.589,8-8,8 s-8-3.589-8-8S41.589,6,46,6z">
              </path>
              <path
                d="M11.22,55.599C11.403,55.837,11.677,56,12,56c0.171,0,0.325-0.054,0.466-0.13C12.967,55.947,13.477,56,14,56 c1.099,0,2.154-0.185,3.144-0.514C17.316,55.788,17.628,56,18,56c0.552,0,1-0.448,1-1c0-0.112-0.03-0.214-0.063-0.315 c1.959-1.118,3.503-2.876,4.348-4.991C23.466,49.882,23.718,50,24,50c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1 c-0.075,0-0.141,0.027-0.211,0.043C23.926,47.383,24,46.7,24,46s-0.074-1.383-0.211-2.043C23.859,43.973,23.925,44,24,44 c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1c-0.282,0-0.534,0.118-0.716,0.306c-0.328-0.822-0.765-1.587-1.288-2.286 C21.996,40.013,22,40.007,22,40c0-0.496-0.368-0.89-0.842-0.968c-0.654-0.672-1.402-1.25-2.222-1.717C18.97,37.214,19,37.112,19,37 c0-0.552-0.448-1-1-1c-0.372,0-0.684,0.212-0.856,0.514C16.154,36.185,15.099,36,14,36c-0.523,0-1.033,0.053-1.534,0.13 C12.325,36.054,12.171,36,12,36c-0.323,0-0.597,0.163-0.78,0.401C7.056,37.61,4,41.452,4,46S7.056,54.39,11.22,55.599z M14,38 c4.411,0,8,3.589,8,8s-3.589,8-8,8s-8-3.589-8-8S9.589,38,14,38z">
              </path>
              <circle cx="24" cy="37" r="1"></circle>
              <circle cx="30" cy="37" r="1"></circle>
              <circle cx="36" cy="37" r="1"></circle>
              <circle cx="42" cy="37" r="1"></circle>
              <circle cx="48" cy="37" r="1"></circle>
              <circle cx="3" cy="46" r="1"></circle>
              <circle cx="27" cy="40" r="1"></circle>
              <circle cx="33" cy="40" r="1"></circle>
              <circle cx="27" cy="46" r="1"></circle>
              <circle cx="33" cy="46" r="1"></circle>
              <circle cx="30" cy="43" r="1"></circle>
              <circle cx="36" cy="43" r="1"></circle>
              <circle cx="30" cy="49" r="1"></circle>
              <circle cx="36" cy="49" r="1"></circle>
              <circle cx="39" cy="40" r="1"></circle>
              <circle cx="45" cy="40" r="1"></circle>
              <circle cx="39" cy="46" r="1"></circle>
              <circle cx="45" cy="46" r="1"></circle>
              <circle cx="42" cy="43" r="1"></circle>
              <circle cx="48" cy="43" r="1"></circle>
              <circle cx="42" cy="49" r="1"></circle>
              <circle cx="48" cy="49" r="1"></circle>
              <circle cx="51" cy="40" r="1"></circle>
              <circle cx="51" cy="46" r="1"></circle>
              <circle cx="57" cy="46" r="1"></circle>
              <circle cx="27" cy="52" r="1"></circle>
              <circle cx="33" cy="52" r="1"></circle>
              <circle cx="39" cy="52" r="1"></circle>
              <circle cx="45" cy="52" r="1"></circle>
              <circle cx="51" cy="52" r="1"></circle>
              <circle cx="54" cy="43" r="1"></circle>
              <circle cx="54" cy="49" r="1"></circle>
              <circle cx="24" cy="55" r="1"></circle>
              <circle cx="30" cy="55" r="1"></circle>
              <circle cx="36" cy="55" r="1"></circle>
              <circle cx="42" cy="55" r="1"></circle>
              <circle cx="48" cy="55" r="1"></circle>
            </g>
          </g>
        </svg>
      </button>
    </div>
    <div class="tooltip" data-tip="Bekijken">
      <button @click="randomGenCheck()" class="btn btn-circle join-item select-bordered">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 60 60"
          stroke="currentColor">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                d="M38.914,0H6.5v60h47V14.586L38.914,0z M39.5,3.414L50.086,14H39.5V3.414z M8.5,58V2h29v14h14v42H8.5z">
              </path>
              <path d="M16.5,17h9c0.552,0,1-0.447,1-1s-0.448-1-1-1h-9c-0.552,0-1,0.447-1,1S15.948,17,16.5,17z"></path>
              <path d="M33.5,37h-17c-0.552,0-1,0.447-1,1s0.448,1,1,1h17c0.552,0,1-0.447,1-1S34.052,37,33.5,37z">
              </path>
              <path d="M43.5,30h-7c-0.552,0-1,0.447-1,1s0.448,1,1,1h7c0.552,0,1-0.447,1-1S44.052,30,43.5,30z"></path>
              <path d="M16.5,25h5c0.552,0,1-0.447,1-1s-0.448-1-1-1h-5c-0.552,0-1,0.447-1,1S15.948,25,16.5,25z"></path>
              <path d="M31.5,25h7c0.552,0,1-0.447,1-1s-0.448-1-1-1h-7c-0.552,0-1,0.447-1,1S30.948,25,31.5,25z"></path>
              <path
                d="M25.5,24c0,0.26,0.11,0.52,0.29,0.71C25.98,24.89,26.24,25,26.5,25c0.26,0,0.52-0.11,0.71-0.29 c0.18-0.19,0.29-0.45,0.29-0.71c0-0.261-0.11-0.521-0.29-0.71c-0.37-0.37-1.04-0.37-1.42,0C25.61,23.479,25.5,23.739,25.5,24z">
              </path>
              <path d="M21.5,30c-0.552,0-1,0.447-1,1s0.448,1,1,1h10c0.552,0,1-0.447,1-1s-0.448-1-1-1H21.5z"></path>
              <path
                d="M16.5,32c0.26,0,0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71c0-0.261-0.11-0.521-0.29-0.71 c-0.37-0.37-1.05-0.37-1.42,0c-0.18,0.189-0.29,0.439-0.29,0.71c0,0.26,0.11,0.52,0.29,0.71C15.98,31.89,16.24,32,16.5,32z">
              </path>
              <path d="M43.5,44h-7c-0.552,0-1,0.447-1,1s0.448,1,1,1h7c0.552,0,1-0.447,1-1S44.052,44,43.5,44z"></path>
              <path d="M31.5,44h-10c-0.552,0-1,0.447-1,1s0.448,1,1,1h10c0.552,0,1-0.447,1-1S32.052,44,31.5,44z">
              </path>
              <path
                d="M15.79,44.29c-0.18,0.18-0.29,0.439-0.29,0.71c0,0.27,0.1,0.52,0.29,0.71C15.98,45.89,16.24,46,16.5,46 c0.27,0,0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71c0-0.271-0.11-0.521-0.29-0.7C16.84,43.92,16.17,43.92,15.79,44.29z">
              </path>
              <path
                d="M42.79,23.29c-0.18,0.189-0.29,0.449-0.29,0.71c0,0.26,0.11,0.52,0.29,0.71C42.98,24.89,43.24,25,43.5,25 c0.26,0,0.52-0.11,0.71-0.29c0.19-0.19,0.29-0.45,0.29-0.71c0-0.261-0.1-0.521-0.29-0.71C43.83,22.92,43.17,22.92,42.79,23.29z">
              </path>
              <path
                d="M39.21,38.71c0.18-0.19,0.29-0.45,0.29-0.71c0-0.261-0.11-0.521-0.29-0.71c-0.38-0.37-1.05-0.37-1.42,0 c-0.18,0.189-0.29,0.449-0.29,0.71c0,0.26,0.11,0.52,0.29,0.71C37.98,38.899,38.23,39,38.5,39S39.02,38.89,39.21,38.71z">
              </path>
              <path
                d="M42.79,37.29c-0.18,0.189-0.29,0.449-0.29,0.71c0,0.26,0.11,0.52,0.29,0.71C42.98,38.89,43.23,39,43.5,39 s0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71c0-0.261-0.11-0.521-0.29-0.71C43.84,36.92,43.16,36.92,42.79,37.29z">
              </path>
            </g>
          </g>
        </svg>
      </button>
    </div>
    <div class="tooltip" data-tip="Opslaan">
      <button @click="saveToFile()" class="btn btn-circle join-item  select-bordered">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 59 59"
          stroke="currentColor">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M20.187,28.313c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l9.979,9.979C28.938,39.895,29.192,40,29.458,40 c0.007,0,0.014-0.004,0.021-0.004c0.007,0,0.013,0.004,0.021,0.004c0.333,0,0.613-0.173,0.795-0.423l9.891-9.891 c0.391-0.391,0.391-1.023,0-1.414s-1.023-0.391-1.414,0L30.5,36.544V1c0-0.553-0.447-1-1-1s-1,0.447-1,1v35.628L20.187,28.313z">
              </path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M36.5,16c-0.553,0-1,0.447-1,1s0.447,1,1,1h13v39h-40V18h13c0.553,0,1-0.447,1-1s-0.447-1-1-1h-15v43h44V16H36.5z">
              </path>
            </g>
          </g>
        </svg>
      </button>
    </div>
    <div class="tooltip" data-tip="Printen">
      <button @click="printer()" class="btn btn-circle join-item  select-bordered">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 60 60"
          stroke="currentColor">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M50,32c2.757,0,5-2.243,5-5s-2.243-5-5-5s-5,2.243-5,5S47.243,32,50,32z M50,24c1.654,0,3,1.346,3,3s-1.346,3-3,3 s-3-1.346-3-3S48.346,24,50,24z">
              </path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M42,43H18c-0.553,0-1,0.447-1,1s0.447,1,1,1h24c0.553,0,1-0.447,1-1S42.553,43,42,43z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M42,48H18c-0.553,0-1,0.447-1,1s0.447,1,1,1h24c0.553,0,1-0.447,1-1S42.553,48,42,48z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M51,17V0H9v17H0v34h6v3h3v6h42v-6h3v-3h6V17H51z M11,2h38v15H11V2z M9,19h42h7v16H2V19H9z M8,52v-2v-1v-4 c0-0.553-0.447-1-1-1s-1,0.447-1,1v4H2V37h7v15H8z M49,58H11v-4V37h38v17V58z M54,49v-4c0-0.553-0.447-1-1-1s-1,0.447-1,1v4v1v2h-1 V37h7v12H54z">
              </path>
            </g>
          </g>
        </svg>
      </button>
    </div>
    <div class="tooltip" data-tip="Genereren">
      <button @click="randomGenTry()" class="btn btn-circle join-item  select-bordered">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 49.7 49.7">
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                d="M27,13.85h9v8.964l13.7-9.964L36,2.886v8.964h-9c-7.168,0-13,5.832-13,13c0,6.065-4.935,11-11,11H1c-0.553,0-1,0.447-1,1 s0.447,1,1,1h2c7.168,0,13-5.832,13-13C16,18.785,20.935,13.85,27,13.85z M38,6.814l8.3,6.036L38,18.886V6.814z">
              </path>
              <path
                d="M1,13.85h2c2.713,0,5.318,0.994,7.336,2.799c0.191,0.171,0.43,0.255,0.667,0.255c0.274,0,0.548-0.112,0.745-0.333 c0.368-0.412,0.333-1.044-0.078-1.412C9.285,13.025,6.206,11.85,3,11.85H1c-0.553,0-1,0.447-1,1S0.447,13.85,1,13.85z">
              </path>
              <path
                d="M36,35.85h-9c-2.685,0-5.27-0.976-7.278-2.748c-0.411-0.365-1.044-0.327-1.411,0.089c-0.365,0.414-0.326,1.046,0.089,1.411 c2.374,2.095,5.429,3.248,8.601,3.248h9v8.964l13.7-9.964L36,26.886V35.85z M38,30.814l8.3,6.036L38,42.886V30.814z">
              </path>
            </g>
          </g>
        </svg>
      </button>
    </div>
    <div class="tooltip" data-tip="Snelle opties">
      <button @click="showModal()" class="btn btn-circle join-item  select-bordered">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 60 60">
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                d="M31.634,37.989c1.041-0.081,1.99-0.612,2.606-1.459l9.363-12.944c0.287-0.397,0.244-0.945-0.104-1.293 c-0.348-0.347-0.896-0.39-1.293-0.104L29.26,31.555c-0.844,0.614-1.375,1.563-1.456,2.604s0.296,2.06,1.033,2.797 C29.508,37.628,30.413,38,31.354,38C31.447,38,31.54,37.996,31.634,37.989z M29.798,34.315c0.035-0.457,0.269-0.874,0.637-1.142 l7.897-5.713l-5.711,7.895c-0.27,0.371-0.687,0.604-1.144,0.64c-0.455,0.03-0.902-0.128-1.227-0.453 C29.928,35.219,29.762,34.771,29.798,34.315z">
              </path>
              <path
                d="M54.034,19.564c-0.01-0.021-0.01-0.043-0.021-0.064c-0.012-0.02-0.031-0.031-0.044-0.05 c-1.011-1.734-2.207-3.347-3.565-4.809l2.148-2.147l1.414,1.414l4.242-4.243l-4.242-4.242l-4.243,4.242l1.415,1.415l-2.148,2.147 c-1.462-1.358-3.074-2.555-4.809-3.566c-0.019-0.013-0.03-0.032-0.05-0.044c-0.021-0.012-0.043-0.011-0.064-0.022 c-3.093-1.782-6.568-2.969-10.273-3.404V5h1.5c1.379,0,2.5-1.121,2.5-2.5S36.672,0,35.293,0h-9c-1.379,0-2.5,1.121-2.5,2.5 s1.121,2.5,2.5,2.5h1.5v1.156c-1.08,0.115-2.158,0.291-3.224,0.535c-0.538,0.123-0.875,0.66-0.751,1.198 c0.123,0.538,0.66,0.876,1.198,0.751c0.92-0.211,1.849-0.37,2.78-0.477l1.073-0.083c0.328-0.025,0.63-0.043,0.924-0.057V10 c0,0.553,0.447,1,1,1s1-0.447,1-1V8.03c3.761,0.173,7.305,1.183,10.456,2.845l-0.986,1.707c-0.276,0.479-0.112,1.09,0.366,1.366 c0.157,0.091,0.329,0.134,0.499,0.134c0.346,0,0.682-0.179,0.867-0.5l0.983-1.703c3.129,1.985,5.787,4.643,7.772,7.772 l-1.703,0.983C49.57,20.91,49.406,21.521,49.683,22c0.186,0.321,0.521,0.5,0.867,0.5c0.17,0,0.342-0.043,0.499-0.134l1.707-0.986 c1.685,3.196,2.698,6.798,2.849,10.619H53.63c-0.553,0-1,0.447-1,1s0.447,1,1,1h1.975c-0.151,3.821-1.164,7.423-2.849,10.619 l-1.707-0.986c-0.478-0.276-1.09-0.114-1.366,0.366c-0.276,0.479-0.112,1.09,0.366,1.366l1.703,0.983 c-1.985,3.129-4.643,5.787-7.772,7.772l-0.983-1.703c-0.277-0.48-0.89-0.643-1.366-0.366c-0.479,0.276-0.643,0.888-0.366,1.366 l0.986,1.707c-3.151,1.662-6.695,2.672-10.456,2.845V56c0-0.553-0.447-1-1-1s-1,0.447-1,1v1.976 c-1.597-0.055-3.199-0.255-4.776-0.617c-0.538-0.129-1.075,0.213-1.198,0.751c-0.124,0.538,0.213,1.075,0.751,1.198 C26.568,59.768,28.607,60,30.63,60c0.049,0,0.096-0.003,0.145-0.004c0.007,0,0.012,0.004,0.018,0.004 c0.008,0,0.015-0.005,0.023-0.005c4.807-0.033,9.317-1.331,13.219-3.573c0.031-0.014,0.064-0.021,0.094-0.039 c0.02-0.012,0.031-0.031,0.05-0.044c4.039-2.354,7.414-5.725,9.773-9.761c0.019-0.027,0.043-0.048,0.06-0.078 c0.012-0.021,0.011-0.043,0.021-0.064C56.317,42.476,57.63,37.89,57.63,33S56.317,23.524,54.034,19.564z M53.965,8.251l1.414,1.414 l-1.414,1.415L52.55,9.665L53.965,8.251z M29.793,6.021V3h-3.5c-0.275,0-0.5-0.225-0.5-0.5s0.225-0.5,0.5-0.5h9 c0.275,0,0.5,0.225,0.5,0.5S35.568,3,35.293,3h-3.5v3.021C31.445,6.007,31.113,6,30.793,6c-0.028,0-0.06,0.002-0.088,0.002 C30.68,6.002,30.655,6,30.63,6c-0.164,0-0.328,0.011-0.492,0.014C30.022,6.017,29.913,6.016,29.793,6.021z">
              </path>
              <path d="M21.793,14h-5c-0.553,0-1,0.447-1,1s0.447,1,1,1h5c0.553,0,1-0.447,1-1S22.346,14,21.793,14z">
              </path>
              <path d="M21.793,21h-10c-0.553,0-1,0.447-1,1s0.447,1,1,1h10c0.553,0,1-0.447,1-1S22.346,21,21.793,21z">
              </path>
              <path d="M21.793,28h-15c-0.553,0-1,0.447-1,1s0.447,1,1,1h15c0.553,0,1-0.447,1-1S22.346,28,21.793,28z">
              </path>
              <path d="M21.793,35h-19c-0.553,0-1,0.447-1,1s0.447,1,1,1h19c0.553,0,1-0.447,1-1S22.346,35,21.793,35z">
              </path>
              <path d="M21.793,42h-13c-0.553,0-1,0.447-1,1s0.447,1,1,1h13c0.553,0,1-0.447,1-1S22.346,42,21.793,42z">
              </path>
              <path d="M21.793,49h-7c-0.553,0-1,0.447-1,1s0.447,1,1,1h7c0.553,0,1-0.447,1-1S22.346,49,21.793,49z">
              </path>
            </g>
          </g>
        </svg>
      </button>
    </div>




  </div>
  <div class="w-11/12 mx-auto print:w-full">

    <div :class="show ? 'hidden print:hidden' : 'print:hidden'">
      <table class="table table-xs table-auto	">
        <thead>
          <tr>
            <th class="border border-content dark:border-neutral print:border-black print:border-2	"><select
                class="print:hidden select select-bordered  select-xs" v-model="dropdown.week">
                <option v-for="week in generateWeeknumbers()" :value=week>{{ week }}</option>
              </select>
              <d class="hidden text-lg print:text-black print:block">{{ dropdown.week }}</d>
            </th>
            <th v-for="dag in dagen"
              class="text-lg print:text-black border border-content dark:border-neutral print:border-black print:border-2	 ">
              {{ dag.replace(/_/g, ' ') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="taak in taken ">
            <th
              class="text-mg text-wrap border border-content dark:border-neutral print:border-black print:border-2	 max-w-36">
              {{ taak.replace(/_/g, ' ') }}
            </th>
            <td v-for="dag in dagen"
              class="border border-content dark:border-neutral print:border-black print:border-2	">
              <div class="w-full space-y-1">
                <select v-if="lijst.niet['niet$' + dag + '$' + taak] == false"
                  v-model="dagTaakDropdown[dag + '$' + taak]" @change=" SelectByDropdownRun(dag, taak)"
                  class="select select-primary w-full select-xs">
                  <option :value=false>Meerdere keuzes</option>
                  <option v-for="bewoner in bewoners" :value=bewoner>Forceer {{ bewoner.replace(/_/g, ' ') }}</option>
                </select>
                <select disabled v-if="lijst.niet['niet$' + dag + '$' + taak] == true"
                  class="select select-primary w-full select-xs ">
                  <option>Taak staat uit</option>
                </select>
                <div
                  v-if="onlyChecked(listAll(true, dag, taak)).length !== 1 || dagTaakDropdown[dag + '$' + taak] == false"
                  class="columns-2 ">
                  <fieldset v-for="bewoner in bewoners">
                    <input  v-if="lijst.niet['niet$' + dag + '$' + taak] == false"
                      v-model="lijst[bewoner + '$' + dag + '$' + taak]" type="checkbox"
                      class="checkbox no-animation checkbox-xs checkbox-primary" :name="bewoner"
                      :id="bewoner + '$' + dag + '$' + taak">
                    <input  v-if="lijst.niet['niet$' + dag + '$' + taak] == true" disabled
                      indeterminate v-model="lijst[bewoner + '$' + dag + '$' + taak]" type="checkbox"
                      class="checkbox no-animation checkbox-xs" :name="bewoner" :id="bewoner + '$' + dag + '$' + taak">
                    <label :for="bewoner + '$' + dag + '$' + taak">{{ bewoner.replace(/_/g, ' ') }}</label>
                  </fieldset>
                </div>
                <div
                  v-if="onlyChecked(listAll(true, dag, taak)).length !== 1 || dagTaakDropdown[dag + '$' + taak] == false"
                  class="join grid grid-cols-2 w-full">

                  <div class="tooltip  tooltip-bottom"
                    v-if="(onlyChecked(listAll(true, dag, taak)).length < bewoners.length) && (lijst.niet['niet$' + dag + '$' + taak] == false)"
                    data-tip="Zet alle vakjes aan">
                    <button
                      v-if="(onlyChecked(listAll(true, dag, taak)).length < bewoners.length) && (lijst.niet['niet$' + dag + '$' + taak] == false)"
                      @click="toggleAll(listAll(true, dag, taak), true)"
                      class="btn btn-neutral no-animation btn-xs">Iedereen</button>
                  </div>

                  <div v-else-if="(lijst.niet['niet$' + dag + '$' + taak] == true)" class="tooltip  tooltip-bottom"
                    data-tip="Taak staat uit">
                    <button disabled class="cursor-not-allowed	btn btn-neutral no-animation btn-xs ">Iedereen</button>
                  </div>

                  <div v-else class="tooltip  tooltip-bottom" data-tip="Alle vakjes staan aan">
                    <button disabled class="cursor-not-allowed	btn btn-neutral no-animation btn-xs ">Iedereen</button>
                  </div>

                  <div
                    v-if="(onlyChecked(listAll(true, dag, taak)).length > 0) && (lijst.niet['niet$' + dag + '$' + taak] == false)"
                    class="tooltip  tooltip-bottom" data-tip="Zet alle vakjes uit">
                    <button @click="toggleAll(listAll(true, dag, taak), false)"
                      class="btn btn-neutral no-animation btn-xs	">Niemand
                    </button>
                  </div>

                  <div v-else-if="(lijst.niet['niet$' + dag + '$' + taak] == true)" class="tooltip  tooltip-bottom"
                    data-tip="Taak staat uit">
                    <button disabled class="cursor-not-allowed btn btn-neutral no-animation btn-xs 		">Niemand</button>
                  </div>

                  <div v-else class="tooltip  tooltip-bottom" data-tip="Alle vakjes staan uit">
                    <button disabled class="cursor-not-allowed btn btn-neutral no-animation btn-xs 		">Niemand</button>
                  </div>

                </div>
                <div class="join grid grid-cols-1">
                  <div class="tooltip tooltip-bottom	" data-tip="Zet een ✕ in de tabel voor deze taak">
                    <button v-if="lijst.niet['niet$' + dag + '$' + taak] == false" @click="blokeren(dag, taak, true)"
                      class="btn btn-neutral no-animation btn-xs">Taak uitzetten</button>
                  </div>
                  <!-- <button v-else disabled class="btn btn-neutral no-animation join-item btn-xs">Blokeren</button> -->
                  <div class="tooltip tooltip-bottom	" data-tip="Verwijder de ✕ uit de tabel voor deze taak">
                    <button v-if="lijst.niet['niet$' + dag + '$' + taak] == true" @click="blokeren(dag, taak, false)"
                      class="btn btn-neutral no-animation btn-xs">Taak aanzetten</button>
                  </div>
                  <!-- <button v-else disabled class="btn btn-neutral no-animation join-item btn-xs">Deblokeren</button> -->
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div :class="!show ? 'hidden print:h-screen print:flex' : ' print:h-screen print:flex'">
      <table class="table table-xs table-auto">
        <thead>
          <tr>
            <th class="border border-content dark:border-neutral print:border-black print:border-2	"><select
                class="print:hidden select select-bordered  select-xs" v-model="dropdown.week">
                <option v-for="week in generateWeeknumbers()" :value=week>{{ week }}</option>
              </select>
              <d class="hidden text-lg print:text-black print:block">{{ dropdown.week }}</d>
            </th>
            <th v-for="dag in dagen"
              class="text-lg print:text-black border border-content dark:border-neutral print:border-black print:border-2	 ">
              {{ dag.replace(/_/g, ' ') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="taak in taken ">
            <th
              class="text-mg text-wrap border border-content dark:border-neutral print:border-black print:border-2	 max-w-36 print:max-w-full">
              {{ taak.replace(/_/g, ' ') }}
            </th>

            <td class="border border-content dark:border-neutral print:border-black print:border-2"
              v-for="dag in dagen">
              <d v-if="lijst.niet['niet$' + dag + '$' + taak] == true">✕</d>
              <d v-else-if="dagTaakDropdown[dag + '$' + taak] !== false"> {{ dagTaakDropdown[dag + '$' + taak] }} </d>
              <d v-else-if="lijst.niet['niet$' + dag + '$' + taak] == false"> {{ choise['true' + '$' + dag + '$' + taak]
                }}
              </d>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="print:hidden">
      <button class="m-2 btn btn-xl invisible">
      </button>
    </div>
  </div>
</template>
