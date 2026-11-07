<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled || menuOpen }">
    <div class="container nav__inner">
      <a href="#home" class="nav__brand" :aria-label="`${profile.name} — home`" @click="menuOpen = false">
        Port<span class="nav__brand-accent">folio</span>
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
          class="icon-btn"
          :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggle"
        >
          <ClientOnly>
            <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" />
            <template #fallback><AppIcon name="moon" /></template>
          </ClientOnly>
        </button>
        <a v-if="profile.cv" :href="profile.cv" download class="btn btn--accent-2 btn--sm nav__cta">
          Download CV <AppIcon name="download" :size="15" />
        </a>
        <a v-else href="#contact" class="btn btn--accent-2 btn--sm nav__cta">Hire Me</a>
        <button
          class="icon-btn nav__toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" />
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
          >{{ link.label }}</a>
          <a v-if="profile.cv" :href="profile.cv" download class="btn btn--accent-2 btn--block" @click="menuOpen = false">Download CV</a>
          <a v-else href="#contact" class="btn btn--accent-2 btn--block" @click="menuOpen = false">Hire Me</a>
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
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom-color: var(--border);
}

.nav__inner {
  height: var(--nav-height);
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav__brand {
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.02em;
  color: var(--text);
}

.nav__brand-accent { color: var(--accent); }

.nav__links {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.nav__link {
  position: relative;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.nav__link:hover { color: var(--text); background: var(--surface-hover); }
.nav__link.is-active { color: var(--text); }
.nav__link.is-active::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 2px;
  height: 2px;
  border-radius: 2px;
  background: var(--accent);
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav__toggle { display: none; }

.nav__mobile {
  border-top: 1px solid var(--border);
  background: var(--bg);
  box-shadow: var(--shadow-md);
  padding: 8px 0 20px;
}

.nav__mobile .container { display: flex; flex-direction: column; }

.nav__mobile-link {
  padding: 14px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
}

.nav__mobile-link.is-active { color: var(--accent); }
.nav__mobile .btn { margin-top: 16px; }

.menu-enter-active, .menu-leave-active { transition: opacity 180ms var(--ease), transform 180ms var(--ease); }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 900px) {
  .nav__links, .nav__cta { display: none; }
  .nav__actions { margin-left: auto; }
  .nav__toggle { display: inline-flex; }
}

</style>
