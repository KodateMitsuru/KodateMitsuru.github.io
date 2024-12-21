<script lang="ts">
import { onMount } from 'svelte'
let pageViews = $state(0)

async function fetchPageViews() {
  const encodedPath = encodeURIComponent(window.location.pathname)

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
}

onMount(async () => {
  await fetchPageViews()
})
</script>


{#if pageViews === 0}
  <p>Loading...</p>
{:else}
  <p>Seen 👀 by {pageViews} human(s)</p>
{/if}

