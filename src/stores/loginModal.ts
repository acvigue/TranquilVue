import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('loginModal', () => {
  const open = ref(false)

  return {open}
})
