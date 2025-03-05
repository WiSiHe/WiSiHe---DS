<script lang="ts">
  import { cn } from '@wisihe/utils'
  import {
    IconBrush,
    IconPackages,
    IconVideo,
    IconMail,
    IconBox
  } from '@tabler/icons-svelte'
  import { navigating, page } from '$app/stores'
  import { onMount } from 'svelte'

  export let item: {
    label: string
    href: string
  }

  const { label = '' } = item

  let url: string | null
  $: if ($navigating) {
    url = $page.route.id
  }

  onMount(() => {
    url = $page.route.id
  })

  const Icons = {
    Paintings: IconBrush,
    Projects: IconPackages,
    Videos: IconVideo,
    Contact: IconMail,
    '3D': IconBox
  }[label]

  $: pathName = $page.url.pathname
  $: isActive = pathName?.includes(item.href)
</script>

<a
  href={item.href}
  class={cn(
    'transition-all rounded flex gap-2 px-4 py-2 hover:bg-primary hover:text-white active:bg-primary',
    isActive &&
      'underline decoration-primary text-white decoration-2 bg-primary',
    url === item.href
      ? 'underline decoration-primary text-white decoration-2 bg-primary'
      : ''
  )}
>
  <svelte:component this={Icons} />
  {item.label}
</a>
