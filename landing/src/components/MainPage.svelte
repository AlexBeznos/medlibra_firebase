<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import Background from './Background.svelte';
  import Download from './Download.svelte';
  import Advantages from './Advantages.svelte';
  import Features from './Features.svelte';
  import Footer from './Footer.svelte';
  import { setLocale } from '../localization';

  export let lang;

  setLocale(lang);

  let currentObservedItem = null;

  function observe() {
    const observedItems = new Map();

    function callback(entries) {
      for (const entry of entries) {
        observedItems.set(
          entry.target.getAttribute('id'),
          entry.isIntersecting,
        );
      }

      const next = [...observedItems.entries()].reverse().find(([_, i]) => i);

      if (next && next[0]) {
        currentObservedItem = next[0];
      }
    }

    const io = new IntersectionObserver(callback, {
      threshold: 0.2,
    });

    const nodes = document.querySelectorAll('.path');
    for (const node of [...nodes]) {
      observedItems.set(node.getAttribute('id'), false);
      io.observe(node);
    }
  }

  onMount(() => {
    observe();
  });
</script>

<style>
  :global(svg) {
    opacity: 1;
  }

  main {
    z-index: 1;
    position: relative;
  }
</style>

<Background />
<Header {currentObservedItem} />

<main>
  <Download />
  <Advantages />
  <Features />
</main>

<Footer />
