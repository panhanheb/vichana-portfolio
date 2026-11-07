/** Tracks which page section is currently in view (scroll-spy for the navbar). */
export function useActiveSection(ids: string[]) {
  const active = ref<string>('')
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const visible = new Map<string, number>()
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
          else visible.delete(entry.target.id)
        }
        // First section (in page order) that is currently visible wins.
        active.value = ids.find(id => visible.has(id)) ?? ''
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer!.observe(el)
    })
  })

  onBeforeUnmount(() => observer?.disconnect())

  return active
}
