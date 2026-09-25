import { createRouter, createWebHistory } from 'vue-router'
import { getModuleBySlug } from '../data/modules'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/:track(system-design|system-architecture|systems-thinking|devops-observability|source-control)',
      name: 'track-home',
      component: () => import('../views/TrackHomeView.vue'),
      props: true,
    },
    {
      path: '/:track(system-design|system-architecture|systems-thinking|devops-observability|source-control)/module/:slug',
      name: 'module',
      component: () => import('../views/ModuleView.vue'),
      props: (route) => ({ slug: route.params.slug }),
      beforeEnter: (to) => {
        const mod = getModuleBySlug(to.params.slug as string)
        if (mod && mod.track !== to.params.track) {
          return { name: 'module', params: { track: mod.track, slug: mod.slug }, replace: true }
        }
        return true
      },
    },
    {
      path: '/review',
      name: 'review',
      component: () => import('../views/ReviewView.vue'),
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router
