<script setup lang="ts">
import useTableStatus from '@/stores/tableStatus';

const tableStatus = useTableStatus();
</script>

<template>
  <div class="mx-[5vw] mt-[5vw] flex flex-col gap-4">
    <div v-if="tableStatus.status == 'playing'">y</div>
    <div v-else>Idle</div>
  </div>
</template>
