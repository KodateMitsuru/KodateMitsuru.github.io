<script lang="ts">
    import I18nKey from '@i18n/i18nKey'
    import { i18n } from '@i18n/translation'
    import { onMount, onDestroy } from 'svelte'
    
    let statu = $state("-1")
    let prevstatu = $state("-1")
    let difftime = $state(new Date(0))
    let year = $state(0)
    let months = $state(0)
    let days = $state(0)
    let hours = $state(0)
    let minutes = $state(0)
    let seconds = $state(0)

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
            const { status, prevstatus, prevtime } = await response.json()
            statu = status
            if (status === "0") {
              prevstatu = prevstatus
              difftime = new Date(prevtime)
              year = difftime.getFullYear() - 1970
              months = difftime.getUTCMonth()
              days = difftime.getUTCDate() - 1
              hours = difftime.getUTCHours()
              minutes = difftime.getUTCMinutes()
              seconds = difftime.getUTCSeconds()
            }
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
{#if statu === "-1"}
  {i18n(I18nKey.status)}: {i18n(I18nKey.status1)}
{:else if statu === "0"}
  {i18n(I18nKey.status)}: {i18n(I18nKey.status0)} <br>
  {i18n(I18nKey.prevstatus)}: {prevstatu} <br>
  {i18n(I18nKey.difftime)}: 
  {#if year > 0}{year} {i18n(I18nKey.year)} {/if}
  {#if months > 0}{months} {i18n(I18nKey.month)} {/if}
  {#if days > 0}{days} {i18n(I18nKey.day)} {/if}
  {#if hours > 0}{hours} {i18n(I18nKey.hour)} {/if}
  {#if minutes > 0}{minutes} {i18n(I18nKey.minute)} {/if}
  {#if seconds > 0}{seconds} {i18n(I18nKey.second)} {/if}
{:else}
  {i18n(I18nKey.status)}: {statu}
{/if}
    