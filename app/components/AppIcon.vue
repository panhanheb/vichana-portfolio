<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="def.fill ? 'currentColor' : 'none'"
    :stroke="def.fill ? 'none' : 'currentColor'"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, i) in def.paths" :key="i" :d="d" />
  </svg>
</template>

<script setup lang="ts">
type IconDef = { paths: string[]; fill?: boolean }

const ICONS: Record<string, IconDef> = {
  'arrow-right': { paths: ['M5 12h14', 'M13 6l6 6-6 6'] },
  'arrow-up': { paths: ['M12 19V5', 'M6 11l6-6 6 6'] },
  'arrow-up-right': { paths: ['M7 17L17 7', 'M8 7h9v9'] },
  download: { paths: ['M12 3v12', 'M7 10l5 5 5-5', 'M5 21h14'] },
  mail: { paths: ['M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z', 'M3 7l9 6 9-6'] },
  'map-pin': { paths: ['M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z', 'M12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z'] },
  clock: { paths: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M12 7v5l3 2'] },
  sun: { paths: ['M12 16a4 4 0 100-8 4 4 0 000 8z', 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'] },
  moon: { paths: ['M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z'] },
  menu: { paths: ['M4 7h16', 'M4 12h16', 'M4 17h16'] },
  close: { paths: ['M6 6l12 12', 'M18 6L6 18'] },
  send: { paths: ['M22 2L11 13', 'M22 2l-7 20-4-9-9-4 20-7z'] },
  sparkles: { paths: ['M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z', 'M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z'] },
  check: { paths: ['M5 12.5l4.5 4.5L19 7.5'] },
  'check-circle': { paths: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M8 12.5l2.5 2.5L16 9.5'] },
  alert: { paths: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M12 8v5', 'M12 16h.01'] },
  external: { paths: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5'] },
  award: { paths: ['M12 15a6 6 0 100-12 6 6 0 000 12z', 'M8.5 13.5L7 22l5-3 5 3-1.5-8.5'] },
  graduation: { paths: ['M22 9L12 4 2 9l10 5 10-5z', 'M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5'] },
  code: { paths: ['M8 7l-5 5 5 5', 'M16 7l5 5-5 5'] },
  layers: { paths: ['M12 3l9 5-9 5-9-5 9-5z', 'M3 13l9 5 9-5'] },
  gauge: { paths: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M12 12l4-4'] },
  accessibility: { paths: ['M12 6.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', 'M5 9l7 1.5L19 9', 'M12 10.5V15l-3 6', 'M12 15l3 6'] },
  github: {
    fill: true,
    paths: ['M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3'],
  },
  linkedin: {
    fill: true,
    paths: ['M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z'],
  },
  instagram: { paths: ['M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z', 'M12 16a4 4 0 100-8 4 4 0 000 8z', 'M17.5 6.5h.01'] },
  tiktok: {
    fill: true,
    paths: ['M19.6 6.7a4.8 4.8 0 01-3.8-4.3V2h-3.4v13.7a2.9 2.9 0 01-5.2 1.7 2.9 2.9 0 013.2-4.5V9a6.3 6.3 0 00-5.4 10.7 6.3 6.3 0 0010.8-4.4V8.4a8.2 8.2 0 004.8 1.6V6.6a4.9 4.9 0 01-1-.1z'],
  },
}

const props = withDefaults(defineProps<{ name: string; size?: number | string }>(), { size: 18 })
const def = computed<IconDef>(() => ICONS[props.name] ?? { paths: [] })
</script>
