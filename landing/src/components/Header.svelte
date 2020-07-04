<script>
  import Arrow from '../icons/Arrow.svg';
  import { setLocale, localization } from '../localization';

  export let currentObservedItem;

  $: menuItems = [
    { link: '#download', title: $localization.menu.download },
    { link: '#advantages', title: $localization.menu.advantages },
    { link: '#features', title: $localization.menu.features },
    { link: '#contact', title: $localization.menu.contact },
  ];
</script>

<style>
  img {
    opacity: 1;
  }

  header {
    top: 0;
    z-index: 2;
    position: sticky;
    background: #1a1d1d;
    padding: 12px 0;
    font-size: 20px;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    /* width: 100%; */
  }

  .segment {
    display: flex;
    align-items: center;
    width: 50%;
  }

  @media screen and (max-width: 575px) {
    header {
      padding-top: 8px;
    }

    .logo {
      height: 48px;
    }

    .segment {
      width: 100%;
    }

    .main {
      margin-bottom: 12px;
    }
  }

  @media screen and (max-width: 1023px) {
    header {
      font-size: 16px;
    }

    .main {
      justify-content: space-between;
    }

    .menu :global(a[href='/#features']),
    .menu :global(a[href='/ru#features']) {
      display: none;
    }
  }

  @media screen and (min-width: 1024px) {
    .menu {
      flex: 1;
      max-width: 652px;
    }

    .segment {
      width: auto;
    }

    .container {
      justify-content: space-between;
    }
  }

  @media screen and (min-width: 768px) {
    .menu {
      box-sizing: border-box;
      padding-left: 32px;
    }
  }

  .menu a {
    transition: color 150ms;
  }

  .menu a.active {
    color: #fefbf6;
  }

  .home {
    display: flex;
  }

  .language {
    display: flex;
    padding-bottom: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 44px;
    outline: 0;
    position: relative;
  }

  @media screen and (min-width: 576px) and (max-width: 1023px) {
    .logo {
      height: 48px;
    }

    .segment {
      justify-content: flex-start;
    }

    .language {
      margin-left: 16px;
    }
  }

  .language span {
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    margin-right: 5px;
  }

  .language :global(svg) {
    transition: transform 150ms;
  }

  .language:focus :global(svg) {
    transform: rotate(180deg) translateY(-4px);
    transform-origin: center center;
  }

  .language:not(:focus) .language-select {
    pointer-events: none;
  }

  .language:not(:focus) .language-overlay {
    display: none;
  }

  .language .language-overlay {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    outline: 0;
  }

  .language-select {
    position: absolute;
    top: 100%;
    right: 0;
    transition: all 150ms;
    transform: translateY(-8px);
    opacity: 0;
    background: #1a1d1d;
    border: 2px solid #731dd8;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 8px;
    padding-right: 20px;
  }

  .language-select a,
  .language-select a:active {
    color: rgba(254, 251, 246, 0.35);
    text-decoration: none;
    text-transform: none;
  }

  .language-select > a:not(:nth-last-child(1)) {
    text-decoration: none;
    text-transform: none;
    padding-bottom: 8px;
  }

  .language-select > a.active {
    color: rgba(254, 251, 246, 0.65);
  }

  .language:focus .language-select {
    opacity: 1;
    transform: translateY(0);
  }

  .menu {
    display: flex;
    justify-content: space-between;
  }

  .menu a {
    font-weight: 500;
    text-decoration: none;
    letter-spacing: 0.0025em;
    line-height: 24px;
  }
</style>

<header>
  <div class="container">
    <div class="segment main">
      <a class="home" href="/">
        <img class="logo" src="/images/Logo.svg" alt="medlibra" />
      </a>

      <div class="language text-secondary" href="/" tabindex="0">
        <div class="language-overlay" tabindex="0" />
        <span>{$localization.currentLanguage}</span>
        <Arrow />
        <div class="language-select" tabindex="0">
          {#each $localization.languages as language}
            <a
              class:active={language.name.startsWith($localization.currentLanguage)}
              on:mousedown={e => e.preventDefault()}
              href={language.key}>
              {language.name}
            </a>
          {/each}
        </div>
      </div>
    </div>

    <div class="segment menu">
      {#each menuItems as item}
        <a
          class="text-inactive"
          class:active={item.link === `#${currentObservedItem}`}
          href={`${$localization.languages.find(i =>
              i.name.startsWith($localization.currentLanguage),
            ).key}${item.link}`}>
          {item.title}
        </a>
      {/each}
    </div>
  </div>
</header>
