<script>
  import { localization } from '../localization';
</script>

<style>
  h1 {
    padding: 32px 0;
  }

  .row {
    white-space: pre-line;
    display: flex;
  }

  .split {
    width: 32px;
    height: 32px;
  }

  .row p {
    flex: 1;
  }

  .container {
    padding-bottom: 32px;
  }

  @media screen and (max-width: 1279px) {
    .row {
      flex-direction: column;
    }
  }

  @media screen and (min-width: 1024px) {
    h1 {
      padding: 72px 0;
    }
  }

  @media screen and (min-width: 1024px) and (max-width: 1279px) {
    .container {
      padding-bottom: 56px;
    }
  }

  @media screen and (min-width: 1280px) and (max-width: 1919px) {
    .container {
      padding-bottom: 72px;
    }
  }

  @media screen and (min-width: 1920px) {
    .container {
      padding-bottom: 104px;
    }
  }
</style>

<div class="path container" id="features">
  <h1 class="text-primary">{$localization.features.title}</h1>

  <div class="row text-secondary">
    <p>{$localization.features.content[0]}</p>
    <div class="split" />
    <p>{$localization.features.content[1]}</p>
  </div>

  <h1 class="text-primary">{$localization.features.testBaseTitle}</h1>

  <div class="row text-secondary">
    <p>{$localization.features.testBaseContent[0]}</p>
    <div class="split" />
    <p>{$localization.features.testBaseContent[1]}</p>
  </div>
</div>
