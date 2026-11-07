<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient :id="gid" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style="stop-color: var(--gold-light)" />
        <stop offset="0.55" style="stop-color: var(--gold)" />
        <stop offset="1" style="stop-color: var(--gold-dark)" />
      </linearGradient>
    </defs>

    <!-- Three pointed leaf-shaped petals around the centre, 120° apart -->
    <g :fill="`url(#${gid})`">
      <path
        v-for="angle in [0, 120, 240]"
        :key="angle"
        :transform="`rotate(${angle} 50 56)`"
        d="M50 6 C58 16 71 23 70 36 C69 46 60 50 52 47 L50 52 L48 47 C40 50 31 46 30 36 C29 23 42 16 50 6 Z"
      />
    </g>

    <!-- Petal veins -->
    <g :stroke="`url(#${gid})`" stroke-width="1.2" fill="none" opacity="0.55" style="mix-blend-mode: multiply">
      <path v-for="angle in [0, 120, 240]" :key="angle" :transform="`rotate(${angle} 50 56)`" d="M50 14 V44" />
    </g>

    <!-- Seed centre -->
    <circle cx="50" cy="56" r="9" style="fill: var(--gold-dark)" />
    <circle cx="50" cy="56" r="5.5" :fill="`url(#${gid})`" />
  </svg>
</template>

<script setup lang="ts">
/** Original stylised three-petal flower ornament in theme gold. */
withDefaults(defineProps<{ size?: number | string }>(), { size: 24 })
const gid = `kf-${useId()}`
</script>
