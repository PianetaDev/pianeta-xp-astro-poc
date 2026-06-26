import { ref } from 'vue'
import { $fetch, useRoute } from '~/lib/nuxt-shims'

type SubmitState = 'idle' | 'loading' | 'success' | 'error' | 'already'

export function useNewsletter() {
  const state = ref<SubmitState>('idle')
  const errorMsg = ref('')
  const route = useRoute()

  const submit = async (email: string, consentMarketing: boolean) => {
    state.value = 'loading'
    errorMsg.value = ''
    try {
      const utm = {
        utm_source: route.query.utm_source as string | undefined,
        utm_medium: route.query.utm_medium as string | undefined,
        utm_campaign: route.query.utm_campaign as string | undefined,
        utm_content: route.query.utm_content as string | undefined,
      }
      const res = await $fetch<{ status: string }>('/api/newsletter/subscribe', {
        method: 'POST',
        body: { email, sourcePage: route.path, utm, consentMarketing },
      })
      if (res.status === 'already-subscribed') state.value = 'already'
      else state.value = 'success'
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'newsletter_signup')
      }
    } catch (e: any) {
      state.value = 'error'
      errorMsg.value = e?.message || 'errore'
    }
  }

  return { state, errorMsg, submit }
}
