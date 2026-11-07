<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient :id="`${gid}-a`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style="stop-color: var(--gold-light)" />
        <stop offset="0.6" style="stop-color: var(--gold)" />
        <stop offset="1" style="stop-color: var(--gold-dark)" />
      </linearGradient>
      <radialGradient :id="`${gid}-c`" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" style="stop-color: var(--gold-light)" />
        <stop offset="1" style="stop-color: var(--gold)" />
      </radialGradient>
    </defs>

    <!-- Back petals on the diagonals (darker, smaller) -->
    <path
      v-for="a in [45, 135, 225, 315]"
      :key="`b${a}`"
      :transform="`rotate(${a} 50 50)`"
      d="M50 13 C57 22 61 31 59 39 C57 45 52 49 50 50 C48 49 43 45 41 39 C39 31 43 22 50 13 Z"
      style="fill: var(--gold-dark)"
    />

    <!-- Main petals: up / right / down / left -->
    <g v-for="a in [0, 90, 180, 270]" :key="`m${a}`" :transform="`rotate(${a} 50 50)`">
      <path
        d="M50 2 C60 13 70 21 69 33 C68 42 59 46 50 50 C41 46 32 42 31 33 C30 21 40 13 50 2 Z"
        :fill="`url(#${gid}-a)`"
      />
      <!-- inner leaf -->
      <path d="M50 15 C55 22 57 29 50 38 C43 29 45 22 50 15 Z" style="fill: var(--gold-light)" opacity="0.65" />
      <!-- kbach curls on both sides -->
      <path d="M36 27 c-4 0 -5 5 -1 5.5 c2 0.2 3 -1.5 2 -2.6" fill="none" style="stroke: var(--gold-light)" stroke-width="1.6" stroke-linecap="round" opacity="0.9" />
      <path d="M64 27 c4 0 5 5 1 5.5 c-2 0.2 -3 -1.5 -2 -2.6" fill="none" style="stroke: var(--gold-light)" stroke-width="1.6" stroke-linecap="round" opacity="0.9" />
    </g>

    <!-- Centre: ring + domed button -->
    <circle cx="50" cy="50" r="13" style="fill: var(--gold-dark)" />
    <circle cx="50" cy="50" r="10.5" :fill="`url(#${gid}-c)`" />
    <circle cx="46.5" cy="46.5" r="3" style="fill: var(--gold-light)" opacity="0.7" />
  </svg>
</template>

<script setup lang="ts">
/** Original four-petal Khmer (kbach) style flower ornament in theme gold. */
withDefaults(defineProps<{ size?: number | string }>(), { size: 24 })
const gid = `kb-${useId()}`
</script>
