<script>
  import { localization } from '../localization';

  function appear(node) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.classList.add('appear');
        io.unobserve(node);
      },
      {
        threshold: 0.2,
      },
    );

    io.observe(node);
  }
</script>

<style>
  /* overview */
  .overview {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .overview-wrapper {
    width: 100%;
    overflow: hidden;
  }

  .overview.container {
    padding: 0;
  }

  .overview h2,
  .overview h3 {
    white-space: pre-line;
    text-align: center;
  }

  .overview h2 {
    padding-bottom: 8px;
  }

  @media screen and (max-width: 767px) {
    .overview {
      height: 464px;
      align-items: center;
    }

    .overview .item {
      width: 50%;
    }
  }

  @media screen and (min-width: 767px) and (max-width: 1023px) {
    .overview {
      height: 344px;
      align-items: center;
    }

    .overview.container {
      /* max-width: 100%; */
      padding: 0 12px;
    }
  }

  @media screen and (min-width: 1024px) {
    .overview:before,
    .overview:after {
      content: '';
      position: absolute;
      width: 100%;
      left: -100%;
      height: 4px;
      margin-top: -2px;
      background: rgba(254, 251, 246, 0.15);
      border-radius: 2px;
      top: 50%;
    }

    .overview:before {
      left: -100%;
    }

    .overview:after {
      left: 100%;
    }

    .overview .item {
      background: rgba(254, 251, 246, 0.105);
      border: 4px solid rgba(254, 251, 246, 0.105);
      border-radius: 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  @media screen and (min-width: 1024px) and (max-width: 1279px) {
    .overview {
      height: 344px;
      align-items: center;
    }

    .overview .item {
      width: 196px;
      height: 200px;
    }
  }

  @media screen and (min-width: 1280px) and (max-width: 1919px) {
    .overview {
      height: 472px;
      align-items: center;
    }

    .overview .item {
      width: 256px;
      height: 256px;
    }
  }

  @media screen and (min-width: 1920px) {
    .overview {
      height: 472px;
      align-items: center;
    }

    .overview .item {
      width: 310px;
      height: 256px;
    }
  }

  /* infographics */
  .infographics {
    position: relative;
    display: flex;
    align-items: center;
  }

  .infographics img {
    transition: all 1.5s;
  }

  .infographics:not(:nth-last-child(1)):after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0 auto;
    width: 50%;
    border-radius: 2px;
    height: 4px;
    background: rgba(254, 251, 246, 0.15);
    margin-left: 25%;
  }

  .infographics:nth-child(2n) {
    flex-direction: row-reverse;
  }

  .infographics > * {
    width: 50%;
  }

  @media screen and (max-width: 359px) {
    .infographics h2 {
      padding-bottom: 8px;
    }
  }

  @media screen and (min-width: 360px) and (max-width: 1279px) {
    .infographics h2 {
      padding-bottom: 32px;
    }
  }

  @media screen and (max-width: 767px) {
    .infographics img {
      opacity: 0;
      transform: translateY(-64px);
    }

    .infographics :global(img.appear) {
      opacity: 1;
      transform: translateY(0);
    }

    .infographics {
      padding: 32px 0;
    }

    .infographics:nth-child(n) {
      flex-direction: column;
      align-items: center;
    }

    .infographics:nth-child(n) * {
      width: 100%;
    }

    .infographics img {
      margin-bottom: 32px;
    }
  }

  @media screen and (min-width: 768px) {
    .infographics img {
      transition: all 1s;
    }

    .infographics img {
      opacity: 0;
    }

    .infographics:nth-child(2n) img {
      transform: translateX(64px);
    }

    .infographics:nth-child(2n + 1) img {
      transform: translateX(-64px);
    }

    .infographics :global(img.appear) {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media screen and (min-width: 768px) and (max-width: 1279px) {
    .infographics {
      height: 352px;
    }

    h3 {
      font-size: 24px;
      line-height: 32px;
    }
  }

  @media screen and (min-width: 1280px) {
    .infographics {
      height: 448px;
    }

    .infographics h2 {
      padding-bottom: 40px;
    }

    h3 {
      font-size: 32px;
      line-height: 48px;
    }
  }
</style>

<div class="path" id="advantages">
  <div class="overview-wrapper">
    <div class="container overview">
      {#each $localization.advantages.overview as overview}
        <div class="item">
          <h2 class="text-primary">{overview.title}</h2>
          <h3 class="text-secondary">{overview.content}</h3>
        </div>
      {/each}
    </div>
  </div>

  <div class="container">
    {#each $localization.advantages.infographics as infographics, index}
      <div class="infographics">
        <img use:appear src="/images/illustration{index + 1}.svg" alt="img" />

        <div>
          <h2 class="text-primary">{infographics.title}</h2>
          <h3 class="text-secondary">{infographics.content}</h3>
        </div>
      </div>
    {/each}
  </div>
</div>
