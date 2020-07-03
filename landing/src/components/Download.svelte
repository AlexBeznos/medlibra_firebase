<script>
  import { localization } from '../localization';
</script>

<style>
  svg,
  img {
    opacity: 1;
  }

  h1 {
    padding-bottom: 64px;
  }

  h3 {
    padding-bottom: 32px;
  }

  .container {
    display: flex;
    flex-direction: column;
  }

  .download-buttons {
    display: flex;
  }

  .download-buttons a {
    width: 196px;
  }

  .download-buttons a:not(:nth-last-child(1)) {
    margin-right: 32px;
  }

  .download-buttons a {
    padding: 20px 0;
    padding-left: 16px;
    position: relative;
    border: none;
    outline: 0;
    background: transparent;
    width: 196px;
    display: flex;
    text-decoration: none;
    box-sizing: border-box;
  }

  .download-buttons a .border {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .download-buttons a .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .download-buttons a .text-content {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .text-accent {
    text-align: center;
    width: 100%;
  }

  @media screen and (max-width: 359px) {
    .download-buttons {
      flex-direction: column;
    }

    .download-buttons a:nth-child(1) {
      margin-bottom: 26px;
    }
  }

  @media screen and (max-width: 767px) {
    h1 {
      max-width: 328px;
      padding-bottom: 32px;
    }

    .download-buttons a {
      width: 156px;
    }

    .container {
      height: 572px;
      padding-top: 32px;
    }
  }

  @media screen and (max-width: 767px) {
    h1 {
      max-width: 328px;
    }
  }

  @media screen and (min-width: 1280px) {
    h1 {
      max-width: 876px;
    }
  }

  @media screen and (min-width: 768px) and (max-width: 1279px) {
    h1 {
      max-width: 650px;
    }

    .container {
      height: 656px;
      justify-content: center;
    }
  }

  @media screen and (min-width: 1280px) {
    .container {
      height: 704px;
      justify-content: center;
    }
  }

  @media screen and (min-width: 768px) {
    h1 {
      padding-bottom: 64px;
    }
  }
</style>

<div class="path container" id="download">
  <h1 class="text-primary">
    {$localization.download.title}
    <br />
    <br />
    {$localization.download.titleDescription}
  </h1>

  <h3 class="text-secondary">{$localization.download.downloadFree}</h3>

  <div class="download-buttons">
    <a href="/">
      <div class="border">
        <svg width="100%" height="100%">
          <defs>
            <linearGradient
              id="gradient-appstore"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%">
              <stop offset="0%" stop-color="#1AC6FB" />
              <stop offset="100%" stop-color="#1C72F0" />
            </linearGradient>
          </defs>
          <rect
            x="1"
            y="1"
            rx="16"
            ry="16"
            width="calc(100% - 2px)"
            fill="rgba(254, 251, 246, 0.05)"
            height="calc(100% - 2px)"
            stroke="url(#gradient-appstore)"
            stroke-width="2" />
        </svg>
      </div>

      <div class="content">
        <img src="/images/appstore.svg" alt="app store" />
        <div class="text-content">
          <span class="text-accent text-primary">AppStore</span>
        </div>
      </div>
    </a>

    <a href="/">
      <div class="border">
        <svg width="100%" height="100%">
          <defs>
            <linearGradient
              id="gradient-playmarket"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%">
              <stop offset="0%" stop-color="#00E0FF" />
              <stop offset="33%" stop-color="#00F085" />
              <stop offset="66%" stop-color="#FFE300" />
              <stop offset="100%" stop-color="#FF4E54" />
            </linearGradient>
          </defs>
          <rect
            x="1"
            y="1"
            rx="16"
            ry="16"
            width="calc(100% - 2px)"
            fill="rgba(254, 251, 246, 0.05)"
            height="calc(100% - 2px)"
            stroke="url(#gradient-playmarket)"
            stroke-width="2" />
        </svg>
      </div>

      <div class="content">
        <img src="/images/playstore.svg" alt="play market" />
        <div class="text-content">
          <span class="text-accent text-primary">PlayMarket</span>
        </div>
      </div>
    </a>
  </div>
</div>
