<script lang="ts">
import I18nKey from '@i18n/i18nKey'
import { i18n } from '@i18n/translation'
import { onMount } from 'svelte'
let pageViews = $state(-1)
const dec = $state(i18n(I18nKey.readCount))
const { url } = $props();

async function updatePageViews() {
  if (import.meta.env.DEV) {
    pageViews = 114514
    console.log('DEV mode, pageViews set to 114514')
  }
  else if (url){
    
    const encodedPath = encodeURIComponent(url)
    console.log(encodedPath)
    try {
      // fetch the data for the current page
      const response = await fetch(
        `https://api.kodatemitsuru.com/api/pageViews?path=${encodedPath}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      // Gracefully handle the error scenario.
      if (!response.ok) {
        pageViews = 0
      } else {
        const { count } = await response.json()
        // Optimistically, show the new page view count
        pageViews = Number(count)
      }

    } catch (err) {
      pageViews = 0
    }
  }
  else {
    const encodedPath = encodeURIComponent(decodeURIComponent((window.location.pathname)))
    console.log(encodedPath)
    try {
      // fetch the data for the current page
      const response = await fetch(
        `https://api.kodatemitsuru.com/api/pageViews?path=${encodedPath}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      // Gracefully handle the error scenario.
      // Default to "1" as the current user is seeing the page
      if (!response.ok) {
        pageViews = 1
      } else {
        const { count } = await response.json()
        // Optimistically, show the new page view count
        pageViews = Number(count) + 1
      }

    } catch (err) {
      // Default to "1" as the current user is seeing the page
      pageViews = 1
    }
    try {
      // update the page view count
      await fetch('https://api.kodatemitsuru.com/api/pageViews', {
              method: 'PUT',
              referrerPolicy: 'same-origin',
              body: JSON.stringify({
                  path: decodeURIComponent(window.location.pathname),
              }),
              headers: {
                  'Content-Type': 'application/json',
              }
          });
    } catch (err) {
      // ignore the error
    }
  }
}

onMount(async () => {

  await updatePageViews()
})
</script>


{#if pageViews === -1}
  Loading...
{:else}
  {pageViews} {dec}
{/if}


