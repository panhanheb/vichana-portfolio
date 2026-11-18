<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled || menuOpen }">
    <div class="container nav__inner">
      <a href="#home" class="nav__brand" :aria-label="`${profile.name} — home`" @click="menuOpen = false">
        <span class="nav__mark" aria-hidden="true">{{ profile.initials }}</span>
        <span class="nav__name">{{ profile.name }}</span>
      </a>

      <nav class="nav__links" aria-label="Primary">
        <a
          v-for="link in navLinks"
          :key="link.id"
          :href="`#${link.id}`"
          class="nav__link"
          :class="{ 'is-active': active === link.id }"
          :aria-current="active === link.id ? 'true' : undefined"
        >{{ link.label }}</a>
      </nav>

      <div class="nav__actions">
        <button
          class="icon-btn nav__icon"
          :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggle"
        >
          <ClientOnly>
            <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="17" />
            <template #fallback><AppIcon name="moon" :size="17" /></template>
          </ClientOnly>
        </button>
        <a v-if="profile.cv" :href="profile.cv" download class="btn btn--primary btn--sm nav__cta">
          <AppIcon name="download" :size="15" /> Résumé
        </a>
        <a v-else href="#contact" class="btn btn--primary btn--sm nav__cta">Get in touch</a>
        <button
          class="icon-btn nav__icon nav__toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="18" />
        </button>
      </div>
    </div>

    <Transition name="menu">
      <nav v-if="menuOpen" id="mobile-menu" class="nav__mobile" aria-label="Mobile">
        <div class="container">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="`#${link.id}`"
            class="nav__mobile-link"
            :class="{ 'is-active': active === link.id }"
            @click="menuOpen = false"
          >
            {{ link.label }}
            <AppIcon name="arrow-right" :size="16" />
          </a>
          <a v-if="profile.cv" :href="profile.cv" download class="btn btn--primary btn--block" @click="menuOpen = false">Download résumé</a>
          <a v-else href="#contact" class="btn btn--primary btn--block" @click="menuOpen = false">Get in touch</a>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { navLinks, profile } from '#shared/portfolio'

const { theme, init, toggle } = useTheme()
const active = useActiveSection(navLinks.map(l => l.id))
const scrolled = ref(false)
const menuOpen = ref(false)

const onScroll = () => { scrolled.value = window.scrollY > 8 }
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') menuOpen.value = false }
const onResize = () => { if (window.innerWidth > 900) menuOpen.value = false }

onMounted(() => {
  init()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 1000;
  border-bottom: 1px solid transparent;
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

.nav--scrolled {
  background: var(--nav-bg);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom-color: var(--border);
}

.nav__inner {
  height: var(--nav-height);
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: -0.01em;
  color: var(--text);
}

.nav__mark {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--text);
  color: var(--bg);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}

.nav__links {
  display: flex;
  gap: 2px;
  margin-left: auto;
}

.nav__link {
  padding: 7px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.nav__link:hover { color: var(--text); }
.nav__link.is-active { color: var(--text); background: var(--surface-hover); }

.nav__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav__icon { width: 36px; height: 36px; }
.nav__toggle { display: none; }

.nav__mobile {
  border-top: 1px solid var(--border);
  background: var(--bg);
  box-shadow: var(--shadow-md);
  padding: 8px 0 20px;
}

.nav__mobile .container { display: flex; flex-direction: column; }

.nav__mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
}

.nav__mobile-link :deep(svg) { color: var(--text-muted); }
.nav__mobile-link.is-active { color: var(--text); }
.nav__mobile .btn { margin-top: 16px; }

.menu-enter-active, .menu-leave-active { transition: opacity 160ms var(--ease), transform 160ms var(--ease); }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 900px) {
  .nav__links, .nav__cta { display: none; }
  .nav__actions { margin-left: auto; }
  .nav__toggle { display: inline-flex; }
}

@media (max-width: 380px) {
  .nav__name { display: none; }
}
</style>
