<template>
  <div class="relative">
    <div
      :class="{ hidden: isLoaded }"
      class="absolute w-full h-full flex justify-center items-center"
    >
      <svg
        aria-hidden="true"
        class="inline w-10 h-10 text-gray-600 animate-spin fill-gray-300"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
    <canvas
      :class="{ hidden: !isLoaded }"
      class="absolute w-full h-full"
      ref="canvasElement"
      width="600"
      height="600"
    ></canvas>
    <div class="absolute w-full h-full z-10">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { type Pattern } from '../stores/files'
import tranquilapi from '../plugins/tranquilapi'
import { lineRadial, curveBasis } from 'd3'
import { useToast } from 'vue-toast-notification'

interface PatternPreviewProps {
  lineColor: string
  pattern: Pattern
}

const props = defineProps<PatternPreviewProps>()
const toast = useToast()

// The important part: the name of the variable needs to be equal to the ref's name of the canvas element in the template
const canvasElement: Ref<HTMLCanvasElement | undefined> = ref()
const context: Ref<CanvasRenderingContext2D | undefined> = ref()
const isLoaded = ref(false)

let patternData: [number, number][] = []
let patternID = ''

onMounted(async () => {
  context.value = canvasElement.value?.getContext('2d') || undefined
  await render()
})

onBeforeUnmount(async () => {
  if (!context.value || !canvasElement.value) {
    return
  }

  let dim = Math.min(canvasElement.value?.width ?? 0, canvasElement.value?.height ?? 0)

  context.value.resetTransform()
  context.value.clearRect(0, 0, dim, dim)
  context.value.beginPath()

  canvasElement.value.width = 0
  canvasElement.value.height = 0
  canvasElement.value.remove()
})

async function getPatternData() {
  let patternDataResponse
  try {
    patternDataResponse = await tranquilapi.get(`/patterns/${props.pattern.uuid}/data`)
  } catch (e) {
    throw new Error(`Pattern preview generation failed for ${props.pattern.name}`)
  }

  const patternDataRaw = patternDataResponse.data
  const uninterpolatedData: [number, number][] = []
  for (const patternDataLine of (patternDataRaw as string).split('\n')) {
    if (patternDataLine.charAt(0) === '#') {
      continue
    }

    const patternCoordinates = patternDataLine.split(' ')
    const theta = parseFloat(patternCoordinates[0])
    const rho = parseFloat(patternCoordinates[1])
    uninterpolatedData.push([theta, rho])
  }

  patternData.push(uninterpolatedData[0])
  let previousPoint = uninterpolatedData[0]
  for (const uninterpolatedPoint of uninterpolatedData) {
    var diff = Math.abs(previousPoint[0] - uninterpolatedPoint[0])
    if (diff > 0.2) {
      var steps = Math.ceil(diff / 0.2)
      for (const i of Array(steps)
        .fill(0)
        .map((_, i) => i + 1)) {
        const newPoint: [number, number] = [
          previousPoint[0] + ((uninterpolatedPoint[0] - previousPoint[0]) * i) / steps,
          previousPoint[1] + ((uninterpolatedPoint[1] - previousPoint[1]) * i) / steps
        ]
        patternData.push(newPoint)
      }
    }

    patternData.push(uninterpolatedPoint)
    previousPoint = uninterpolatedPoint
  }
}

async function render() {
  if (!context.value || props.pattern == undefined || props.pattern.uuid === undefined) {
    return
  }

  if (patternID != props.pattern.uuid) {
    patternData = []
    try {
      await getPatternData()
    } catch (e) {
      isLoaded.value = true
      toast.error(`Pattern preview generation failed for ${props.pattern.name}`)
      return
    }
    patternID = props.pattern.uuid
  }

  context.value.strokeStyle = props.lineColor
  context.value.lineWidth = 0.75

  let dim = Math.min(canvasElement.value?.width ?? 0, canvasElement.value?.height ?? 0)

  context.value.resetTransform()
  context.value.clearRect(0, 0, dim, dim)
  context.value.beginPath()

  let drawFunc = lineRadial()
    .angle((dataPt) => dataPt[0])
    .radius((dataPt) => dataPt[1] * (dim / 2))
    .curve(curveBasis)
    .context(context.value)

  context.value.translate(dim / 2, dim / 2)
  drawFunc(patternData)
  context.value.stroke()

  isLoaded.value = true
}

watch(props, async () => {
  await render()
})
</script>
