<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

async function close() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div v-if="offlineReady || needRefresh" class="toast toast-end ">
    <div v-if="offlineReady" role="alert" class="alert ">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Klaar voor offline gebruik</span>
      <div>
        <button @click="close" class="btn btn-sm btn-primary">Sluiten</button>
      </div>
    </div>
    <div v-if="needRefresh" role="alert" class="alert ">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>Update Beschikbaar</span>
      <div>
        <button @click="close" class="btn btn-sm">Negeren</button>
        <button @click="updateServiceWorker()" class="btn btn-sm btn-primary">Opniew laden</button>
      </div>
    </div>
  </div>
</template>