<template>
  <main id="main">
    <HeroSection />
    <TechScroller />
    <AboutSection />
    <SkillsSection />
    <ProjectsSection />
    <CredentialsSection />
    <ContactSection />

    <ClientOnly>
      <AiChat />
    </ClientOnly>

    <Transition name="fade">
      <button v-if="showBackToTop" class="back-to-top icon-btn" aria-label="Back to top" @click="scrollToTop">
        <AppIcon name="arrow-up" />
      </button>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { profile } from '#shared/portfolio'

const title = `${profile.name} — ${profile.role}`
const description = profile.summary

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: profile.siteUrl,
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
})

useHead({
  link: [{ rel: 'canonical', href: profile.siteUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name,
        jobTitle: profile.role,
        email: `mailto:${profile.email}`,
        address: { '@type': 'PostalAddress', addressLocality: profile.location },
        url: profile.siteUrl,
      }),
    },
  ],
})

const showBackToTop = ref(false)
const onScroll = () => { showBackToTop.value = window.scrollY > 800 }
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 84px; /* sits above the AI chat button */
  z-index: 900;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: var(--shadow-md);
}

.fade-enter-active, .fade-leave-active { transition: opacity 200ms, transform 200ms; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }

@media (max-width: 480px) {
  .back-to-top { right: 16px; bottom: 72px; }
}
</style>
