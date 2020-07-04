<script>
  import { onMount } from 'svelte';

  let mounted = false;

  onMount(() => {
    setTimeout(() => {
      mounted = true;
    }, 200);
  });
</script>

<style>
  .background {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .background .dark {
    transform: translateY(-48px);
  }

  .background .light {
    transform: translateY(48px);
  }

  .background.mounted img {
    transform: translateY(0);
    opacity: 1;
  }

  img {
    position: absolute;
    opacity: 0;
    transition: all 600ms;
  }

  @media screen and (max-width: 359px) {
    img {
      width: 360px;
    }

    .light {
      left: 96px;
      top: 464px;
    }

    .dark {
      left: 160px;
      top: 380px;
    }
  }

  @media screen and (min-width: 360px) and (max-width: 575px) {
    img {
      width: 100%;
    }

    .light {
      top: 452px;
      left: 0;
    }

    .dark {
      top: 364px;
      left: 64px;
    }
  }

  @media screen and (min-width: 576px) and (max-width: 767px) {
    img {
      width: 480px;
    }

    .dark {
      top: 64px;
      right: -210px;
    }

    .light {
      top: 176px;
      right: -124px;
    }
  }

  @media screen and (min-width: 768px) {
    img {
      height: 600px;
    }

    .dark {
      top: 0;
      left: calc(50% + 114px);
    }

    .light {
      left: 50%;
      top: 272px;
    }
  }
</style>

<div class="background" class:mounted>
  <img class="light" src="/images/light.png" alt="light" />
  <img class="dark" src="/images/dark.png" alt="dark" />
</div>
