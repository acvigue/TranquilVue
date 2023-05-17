<template>
  <div class="relative">
    <canvas class="absolute w-full h-full" ref="canvasElement" width="800" height="800"></canvas>
    <div class="absolute w-full h-full z-10">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, watch } from 'vue'
import { type Track } from '../stores/files'
import webcenter from '../plugins/webcenter'
import * as d3 from 'd3'
import { useToast } from 'vue-toast-notification'

interface TrackPreviewProps {
  lineColor: string
  track: Track
}

const props = defineProps<TrackPreviewProps>()

// The important part: the name of the variable needs to be equal to the ref's name of the canvas element in the template
const canvasElement: Ref<HTMLCanvasElement | undefined> = ref()
const context: Ref<CanvasRenderingContext2D | undefined> = ref()

let trackData: [number, number][] = []
let trackID = ''

onMounted(async () => {
  context.value = canvasElement.value?.getContext('2d') || undefined
  await render()
})

const toast = useToast()

async function getTrackData() {
  const trackDataResponse = await webcenter
    .get(`/tracks/${props.track.track_id}/download`)
    .catch((e) => {
      toast.error('Track preview generation failed :(')
      return { data: '' }
    })

  const trackDataRaw = trackDataResponse.data
  const uninterpData: [number, number][] = []
  for (const track of trackDataRaw.split('\n') as string) {
    if (track.charAt(0) === '#') {
      continue
    }
    const trackVerts = track.split(' ')
    const theta = parseFloat(trackVerts[0])
    const rho = parseFloat(trackVerts[1])
    uninterpData.push([theta, rho])
  }

  trackData.push(uninterpData[0])
  var last_point = uninterpData[0]
  for (const point of uninterpData) {
    var diff = Math.abs(last_point[0] - point[0])
    if (diff > 0.1) {
      var steps = Math.ceil(diff / 0.1)
      for (var i = 1; i < steps - 1; i++) {
        const newCoord: [number, number] = [
          last_point[0] + ((point[0] - last_point[0]) * i) / steps,
          last_point[1] + ((point[1] - last_point[1]) * i) / steps
        ]
        trackData.push(newCoord)
      }
    }
    trackData.push(point)
    last_point = point
  }
}

async function render() {
  if (!context.value || props.track == undefined) {
    return
  }

  if (trackID != props.track.id) {
    trackData = []
    await getTrackData()
    trackID = props.track.id
  }

  context.value.strokeStyle = props.lineColor
  context.value.lineWidth = 2

  let dim = Math.min(canvasElement.value?.width ?? 0, canvasElement.value?.height ?? 0)

  context.value.resetTransform()
  context.value.clearRect(0, 0, dim, dim)
  context.value.beginPath()

  let lineRadial = d3
    .lineRadial()
    .angle((d) => d[0])
    .radius((d) => d[1] * (dim / 2))
    .curve(d3.curveBasis)
    .context(context.value)

  context.value.translate(dim / 2, dim / 2)
  lineRadial(trackData)
  context.value.stroke()
}

watch(props, async () => {
  await render()
})
</script>
