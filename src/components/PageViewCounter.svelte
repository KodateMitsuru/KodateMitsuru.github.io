<script lang="ts">
import { onMount } from 'svelte'

let pageViews = 0

// execute this function after the component mounts
onMount(async () => {
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
})
</script>
{#if pageViews > 0}

  Seen 👀 by {pageViews} human(s)

{/if}

