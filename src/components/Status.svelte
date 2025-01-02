<script lang="ts">
    import I18nKey from '@i18n/i18nKey'
    import { i18n } from '@i18n/translation'
    import { onMount, onDestroy } from 'svelte'
    
    let statu = $state("-1")
    const refreshInterval = 10000
    
    async function updatePageViews() {
      if (import.meta.env.DEV) {
        statu = "0"
        console.log('DEV mode, status set to 0')
      } else {
        try {

          const response = await fetch(
          "https://api.kodatemitsuru.com/api/status",
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
    
          if (!response.ok) {
            statu = "0"
          } else {
            const { status } = await response.json()
            statu = status
            
          }
        } catch (error) {
          console.error('Error fetching status:', error)
            statu = "0"
        }
      }
    }
    
    onMount(() => {
        updatePageViews()
        const intervalId = setInterval(updatePageViews, refreshInterval)

        onDestroy(() => {
            clearInterval(intervalId)
        })
    })

</script>
{#if statu === "1"}
  {i18n(I18nKey.status)}: {i18n(I18nKey.status1)}
{:else if statu === "0"}
  {i18n(I18nKey.status)}: {i18n(I18nKey.status0)}
{:else}
  {i18n(I18nKey.status)}: {statu}
{/if}
    