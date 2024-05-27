<script setup>
import { defineComponent } from "vue";
import WordHighlighter from "vue-word-highlighter";
import { ref } from 'vue';
var props = defineProps({
  input: Object
})
let taken = props.input.taken;
let dagen = props.input.dagen;
let bewoners = props.input.bewoners;
const lijst = ref(props.input.lijst)
const show = ref("opties")
window.onbeforeunload = function () {
  if (lastSave !== getSave()) {
    return 'Wijzigingen zijn *niet* opgeslagen!';
  }
};


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
  for (let bewoner = 0; bewoner < A.length; bewoner++) {
    for (let dag = 0; dag < B.length; dag++) {
      for (let taak = 0; taak < C.length; taak++) {
        temp.push(A[bewoner] + '$' + B[dag] + '$' + C[taak])
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
  for (let i = 0; i < list.length; i++) {
    toggle((list[i]), state)
  }
}

function checkForDropdown(list) {
  let temp1 = []
  for (let i = 0; i < list.length; i++) {
    let temp = getArray(list[i])
    if (dagTaakDropdown.value[temp.dag + '$' + temp.taak] == false) { temp1.push(list[i]) }
  }
  return temp1
}
function onlyChecked(list) {
  let temp = [];
  for (let i = 0; i < list.length; i++) {
    if (lijst.value[list[i]] == true) {
      temp.push(list[i])
    }
    if (getArray(list[i]).bewoner == 'niet') {
      if (lijst.value.niet[list[i]] == true) { temp.push(list[i]) }
    }
  }
  return temp

}

function onlyChosen(list) {
  let temp = [];
  for (let i = 0; i < list.length; i++) {
    let temp2 = getArray(list[i])
    if (choise.value['true$' + temp2.dag + '$' + temp2.taak] == temp2.bewoner) { temp.push(temp2.bewoner + '$' + temp2.dag + '$' + temp2.taak) }
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

function getName(id) {
  let temp = []
  for (let i = 0; i < id.length; i++) {
    temp.push(choise.value[id[i]])
  }
  return temp
}


function getAll(list, option) {
  let temp = []
  for (let i = 0; i < list.length; i++) { temp.push(getArray(list[i])[option]) }
  return temp
}
function saveToFile() {
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

const search = ref();

function chosenOneLijst(bewoners, dagen, taken) {
  let temp = {}
  for (let dag = 0; dag < dagen.length; dag++) {
    for (let taak = 0; taak < taken.length; taak++) {
      temp[true + '$' + dagen[dag] + '$' + taken[taak]] = undefined
    }
  }
  return temp
}
let choiseListTemp = chosenOneLijst(true, dagen, taken)
const choise = ref(choiseListTemp)

function randomGen() {
  choise.value = []
  let invulLijst = []
  for (let taak = 0; taak < taken.length; taak++) {
    for (let dag = 0; dag < dagen.length; dag++) {
      invulLijst.push({
        taak: taken[taak],
        dag: dagen[dag],
        opties: getAll(onlyChecked(listAll(true, dagen[dag], taken[taak])), 'bewoner').sort(function (a, b) { if (a.size == b.size) { return 0.5 - Math.random() } else { return a.size - b.size } }),
        size: getAll(onlyChecked(listAll(true, dagen[dag], taken[taak])), 'bewoner').length
      })
    }
  }
  invulLijst.sort(function (a, b) { if (a.size == b.size) { return 0.5 - Math.random() } else { return a.size - b.size } }); //random
  for (let i = 0; i < invulLijst.length; i++) {
    let ii = 0
    for (ii = 0; ii < invulLijst[i].size + 1; ii++) {
      choise.value['true$' + invulLijst[i].dag + '$' + invulLijst[i].taak] = invulLijst[i].opties[ii]
      if (onlyChosen(onlyChecked(listAll(invulLijst[i].opties[ii], invulLijst[i].dag, true))).length == 1 && onlyChosen(onlyChecked(listAll(invulLijst[i].opties[ii], true, invulLijst[i].taak))).length == 1) { break }

    }
  }
  let leeg = []
  let disabledLijst = onlyChecked(listAll('niet', true, true))
  for (let i = 0; i < invulLijst.length; i++) {
    if (choise.value['true$' + invulLijst[i].dag + '$' + invulLijst[i].taak] == undefined) { leeg.push('true$' + invulLijst[i].dag + '$' + invulLijst[i].taak) }
  }
  let maxBewoners = []
  for (let i = 0; i < bewoners.length; i++) {
    let temp = onlyChecked(listAll(bewoners[i], true, true))
    if (temp.length !== 0) {
      maxBewoners.push(temp)
    }
  }
  let maxDays = []
  for (let i = 0; i < dagen.length; i++) {
    let temp = onlyChecked(listAll(true, dagen[i], true))
    if (temp.length !== 0) {
      maxDays.push(temp)
    }
  }
  let maxTasks = []
  for (let i = 0; i < taken.length; i++) {
    let temp = onlyChecked(listAll(true, true, taken[i]))
    if (temp.length !== 0) {
      maxTasks.push(temp)
    }
  }
  // wanneer er meer taken dan bewoners zijn, dan gaat het niet goed
  // wanneer er meer dagen zijn dan bewoners, dan gaat het niet goed
  let maxEmpty = (((maxTasks.length * maxDays.length) - ((maxTasks.length * maxDays.length) / bewoners.length * maxBewoners.length))) - (leeg.length - disabledLijst.length)
  if (maxEmpty !== 0) { console.log("opnieuw proberen, takenrooster kan beter"); randomGen() }
  else { console.log("sucess, takenrooster goed") }
}


function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
}


function SelectByDropdownRun(day, task) {
  toggleAll(listAll(true, day, task), false)
  toggleAll(listAll(dagTaakDropdown.value[day + '$' + task], day, task), true)
}

function maakDagTaakDropdDown(dagen, taken) {
  let temp = {}
  for (let dag = 0; dag < dagen.length; dag++) {
    for (let taak = 0; taak < taken.length; taak++) {
      temp[dagen[dag] + '$' + taken[taak]] = false
    }
  }
  return temp
}


function fixSetup() {
  for (let dag = 0; dag < dagen.length; dag++) {
    for (let taak = 0; taak < taken.length; taak++) {
      if (onlyChecked(listAll(true, dagen[dag], taken[taak])).length == 1) {
        if (onlyChecked(listAll(true, dagen[dag], taken[taak])).length == 1) {
          dagTaakDropdown.value[dagen[dag] + '$' + taken[taak]] = getArray(onlyChecked(listAll(true, dagen[dag], taken[taak]))[0]).bewoner
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

</script>

<template>
  <div class="fixed bottom-1 left-1 w-full max-w-fit z-50 print:hidden join">
    <select class="text-balance max-w-36 print:max-w-full line-clamp-2 text-xs join-item select select-bordered "
      v-model="show">
      <option value="opties">Taken Opties</option>
      <option value="planner">Taken Lijst</option>
    </select>
    <input v-model="search" type="text" v-if="show == 'planner'" placeholder="Tekst highlighten"
      class="join-item input input-bordered w-full max-w-xs" />
    <button @click="saveToFile()" v-if="show == 'opties'"
      class="btn btn-neutral no-animation join-item select-bordered ">Exporteer
      opties</button>
    <button v-if="show == 'planner'" onclick="window.print()"
      class="btn btn-neutral no-animation join-item select-bordered ">Printen</button>

  </div>

  <div>
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

      <tbody v-if="show == 'opties'">
        <tr v-for="taak in taken ">
          <th
            class="text-mg text-wrap border border-content dark:border-neutral print:border-black print:border-2	 max-w-36">
            {{ taak.replace(/_/g, ' ') }}
          </th>
          <td v-for="dag in dagen" class="border border-content dark:border-neutral print:border-black print:border-2	">
            <div class="w-full space-y-1">
              <select v-if="lijst.niet['niet$' + dag + '$' + taak] == false" v-model="dagTaakDropdown[dag + '$' + taak]"
                @change="SelectByDropdownRun(dag, taak)" class="select select-primary w-full select-xs">
                <option :value=false>Meerdere keuzes</option>
                <option v-for="bewoner in bewoners" :value=bewoner>Forceer {{ bewoner.replace(/_/g, ' ') }}</option>
              </select>
              <select disabled v-if="lijst.niet['niet$' + dag + '$' + taak] == true"
                v-model="dagTaakDropdown[dag + '$' + taak]" @change="SelectByDropdownRun(dag, taak)"
                class="select select-primary w-full select-xs ">
                <option :value=false>Meerdere keuzes</option>
                <option v-for="bewoner in bewoners" :value=bewoner>Forceer {{ bewoner.replace(/_/g, ' ') }}</option>
              </select>
              <div
                v-if="onlyChecked(listAll(true, dag, taak)).length !== 1 || dagTaakDropdown[dag + '$' + taak] == false"
                class="columns-2 ">
                <fieldset v-for="bewoner in bewoners">
                  <input v-if="lijst.niet['niet$' + dag + '$' + taak] == false"
                    v-model="lijst[bewoner + '$' + dag + '$' + taak]" type="checkbox"
                    class="checkbox no-animation checkbox-xs checkbox-primary" :name="bewoner"
                    :id="bewoner + '$' + dag + '$' + taak">
                  <input v-if="lijst.niet['niet$' + dag + '$' + taak] == true" disabled indeterminate
                    v-model="lijst[bewoner + '$' + dag + '$' + taak]" type="checkbox"
                    class="checkbox no-animation checkbox-xs" :name="bewoner" :id="bewoner + '$' + dag + '$' + taak">
                  <label :for="bewoner + '$' + dag + '$' + taak">{{ bewoner.replace(/_/g, ' ') }}</label>
                </fieldset>
              </div>
              <div
                v-if="onlyChecked(listAll(true, dag, taak)).length !== 1 || dagTaakDropdown[dag + '$' + taak] == false"
                class="join grid grid-cols-2">
                <button
                  v-if="(onlyChecked(listAll(true, dag, taak)).length < bewoners.length) && (lijst.niet['niet$' + dag + '$' + taak] == false)"
                  @click="toggleAll(listAll(true, dag, taak), true)"
                  class="btn btn-neutral no-animation join-item btn-xs">Iedereen</button>
                <button v-else disabled
                  class="cursor-not-allowed	btn btn-neutral no-animation join-item btn-xs ">Iedereen</button>
                <button
                  v-if="(onlyChecked(listAll(true, dag, taak)).length > 0) && (lijst.niet['niet$' + dag + '$' + taak] == false)"
                  @click="toggleAll(listAll(true, dag, taak), false)"
                  class="btn btn-neutral no-animation join-item btn-xs	">Niemand</button>
                <button v-else disabled
                  class="cursor-not-allowed btn btn-neutral no-animation join-item btn-xs 		">Niemand</button>
              </div>
              <div class="join grid grid-cols-1">
                <button v-if="lijst.niet['niet$' + dag + '$' + taak] == false" @click="blokeren(dag, taak, true)"
                  class="btn btn-neutral no-animation join-item btn-xs">Taak uitzetten</button>
                <!-- <button v-else disabled class="btn btn-neutral no-animation join-item btn-xs">Blokeren</button> -->
                <button v-if="lijst.niet['niet$' + dag + '$' + taak] == true" @click="blokeren(dag, taak, false)"
                  class="btn btn-neutral no-animation join-item btn-xs">Taak aanzetten</button>
                <!-- <button v-else disabled class="btn btn-neutral no-animation join-item btn-xs">Deblokeren</button> -->
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-if="show == 'planner'">
        <WordHighlighter :query=search>
          <tr v-for="taak in taken ">
            <th
              class="text-mg text-wrap border border-content dark:border-neutral print:border-black print:border-2 max-w-36 print:max-w-full">
              {{ taak.replace(/_/g, ' ') }}
            </th>

            <td class="border border-content dark:border-neutral print:border-black print:border-2"
              v-for="dag in dagen">
              <d v-if="lijst.niet['niet$' + dag + '$' + taak] == true">✕</d>
              <!-- <d v-else-if="choise['true$' + dag + '$' + taak] == undefined">Begleiding</d> -->
              <d v-if="lijst.niet['niet$' + dag + '$' + taak] == false"> {{ choise['true' + '$' + dag + '$' + taak] }}
              </d>
            </td>
          </tr>
        </WordHighlighter>
      </tbody>
    </table>
    <div v-if="show == 'opties'" class="fixed  bottom-1 right-1  ">
      <div class="flex justify-end join		">
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
        <div class="w-full join-item ">
          <button class="btn btn-neutral no-animation w-full join-item select-bordered " @click="toggleAll(checkForDropdown(listAll(dropdown.bewoner, dropdown.dag, dropdown.taak)), true);
          ">Aanvinken</button>
        </div>
        <div class="w-full">
          <button class="btn btn-neutral no-animation w-full join-item select-bordered "
            @click="toggleAll(checkForDropdown(listAll(dropdown.bewoner, dropdown.dag, dropdown.taak)), false)">Uitvinken</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="show == 'planner'" class="overflow-x-auto">
    <div class="print:hidden fixed bottom-1 right-1 w-full max-w-fit z-50 ">
      <button @click="randomGen()" class="btn btn-neutral no-animation btn-outline btn-xl btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-max w-max" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
          <g id="SVGRepo_iconCarrier">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18 4L21 7M21 7L18 10M21 7H17C16.0707 7 15.606 7 15.2196 7.07686C13.6329 7.39249 12.3925 8.63288 12.0769 10.2196C12 10.606 12 11.0707 12 12C12 12.9293 12 13.394 11.9231 13.7804C11.6075 15.3671 10.3671 16.6075 8.78036 16.9231C8.39397 17 7.92931 17 7 17H3M18 20L21 17M21 17L18 14M21 17H17C16.0707 17 15.606 17 15.2196 16.9231C15.1457 16.9084 15.0724 16.8917 15 16.873M3 7H7C7.92931 7 8.39397 7 8.78036 7.07686C8.85435 7.09158 8.92758 7.1083 9 7.12698" />
          </g>
        </svg>
      </button>
    </div>

  </div>

  <div class="h-screen print:hidden"></div>
</template>