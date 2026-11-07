<template>
  <div class="field" :class="{ 'field--error': error }">
    <div class="field__top">
      <label :for="id" class="field__label">{{ label }}</label>
      <span v-if="hint" class="field__hint">{{ hint }}</span>
    </div>
    <textarea
      v-if="multiline"
      :id="id"
      v-model="model"
      class="field__control field__control--area"
      rows="5"
      :name="id"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      @blur="$emit('blur')"
    ></textarea>
    <input
      v-else
      :id="id"
      v-model="model"
      class="field__control"
      :type="type"
      :name="id"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      @blur="$emit('blur')"
    />
    <p v-if="error" :id="`${id}-error`" class="field__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  label: string
  type?: string
  placeholder?: string
  autocomplete?: string
  multiline?: boolean
  maxlength?: number
  error?: string
  hint?: string
}>(), { type: 'text' })

defineEmits<{ blur: [] }>()
const model = defineModel<string>({ required: true })
</script>

<style scoped>
.field { display: flex; flex-direction: column; gap: 6px; }

.field__top { display: flex; justify-content: space-between; align-items: baseline; }
.field__label { font-size: 14px; font-weight: 500; color: var(--text); }
.field__hint { font-family: var(--font-mono); font-size: 11.5px; color: var(--text-muted); }

.field__control {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-size: 15px;
  outline: none;
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.field__control--area { height: auto; min-height: 140px; padding: 12px 14px; resize: vertical; line-height: 1.6; }
.field__control::placeholder { color: var(--text-muted); opacity: 0.8; }
.field__control:hover { border-color: var(--text-muted); }
.field__control:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--ring); }

.field--error .field__control { border-color: var(--danger); }
.field--error .field__control:focus { box-shadow: 0 0 0 3px color-mix(in srgb, var(--danger) 25%, transparent); }

.field__error { font-size: 13px; color: var(--danger); }
</style>
