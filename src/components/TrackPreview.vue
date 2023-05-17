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
import * as d3 from 'd3';

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

async function getTrackData() {
  const trackDataResponse = await webcenter.get(`/tracks/${props.track.track_id}/download`)
  const trackDataRaw = trackDataResponse.data
  for (const track of trackDataRaw.split('\n') as string) {
    if (track.charAt(0) === '#') {
      continue
    }
    const trackVerts = track.split(' ')
    const theta = parseFloat(trackVerts[0])
    const rho = parseFloat(trackVerts[1])
    trackData.push([theta, rho])
  }
}

async function render() {
  if (!context.value || !props.track.id) {
    return
  }

  if (trackID != props.track.id) {
    trackData = []
    await getTrackData()
    trackID = props.track.id
  }

  context.value.strokeStyle = props.lineColor
  context.value.lineWidth = 2

  let dim = Math.min(canvasElement.value?.width ?? 0, canvasElement.value?.height ?? 0);

  context.value.resetTransform()
  context.value.clearRect(0, 0, dim, dim);
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

/*
watch(props.trackProgress, (nv, ov) => {
    render();
})

watch(props.showBall, (nv, ov) => {
    render();
})
*/
/*
let r = 200;

// Event Listeners

const dim = Math.min(innerHeight, innerWidth);

// Implementation
function init() {
  particles = [];

  canvas.width = dim;
  canvas.height = dim;

  c.fillStyle = '#555';
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.strokeStyle = `#bbb`;
  c.lineWidth = 2;

  let lines = thr.split('\n');

  c.beginPath();
  let data = [];
  for (const [i, line] of lines.entries()) {
    const theta = line.split(' ')[0];
    const rho = line.split(' ')[1];
    if (i < 2500) {
      data.push([theta, rho]);
    }
  }

  c.stroke();

  let lineRadial = d3
    .lineRadial()
    .angle((d) => d[0])
    .radius((d) => d[1] * (dim / 2))
    //.curve(d3.curveBasis)
    .context(c);

  c.translate(dim / 2, dim / 2);
  lineRadial(data);
  c.stroke();
}
*/
</script>
