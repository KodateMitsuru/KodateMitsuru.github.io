<script lang="ts">
import I18nKey from '@i18n/i18nKey'
import { i18n } from '@i18n/translation'
import { onMount } from 'svelte'

let siteViews = 0

async function updatePageViews() {
  const footerCounter = document.getElementById('footer-counter')
  if (footerCounter) {
    footerCounter.innerHTML = "Loading..."
  }
  if (import.meta.env.DEV) {
    siteViews = 114514
    console.log('DEV mode, siteViews set to 114514')
  } else {
    try {
      // fetch the data for the current page
      const response = await fetch(
      "https://api.kodatemitsuru.com/api/siteViews",
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        siteViews = 1
      } else {
        const { count } = await response.json()
        siteViews = Number(count) + 1
      }
    } catch (error) {
      console.error('Error fetching site views:', error)
      siteViews = 1
    }
    if (!sessionStorage.getItem('isCounted')) {
      // 如果没有记录，则进行计数并存储记录
      sessionStorage.setItem('isCounted', 'true')
      await fetch("https://api.kodatemitsuru.com/api/siteViews", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
    }
  }
  if (footerCounter) {
    footerCounter.innerHTML = `${siteViews} ${i18n(I18nKey.sitesCount)}`
  }
}

onMount(() => {
  updatePageViews()
})
</script>
{#if siteViews === 0}
  Loading...
{:else}
  {siteViews} {i18n(I18nKey.sitesCount)}
{/if}
