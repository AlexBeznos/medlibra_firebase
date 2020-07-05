<script>
  import { localization } from '../localization';
  import { fade, fly } from 'svelte/transition';
  let isOpen = false;
  let error = null;
  let success = true;
  let value = '';
  let lockSubmit = false;

  const url =
    'https://europe-west1-medtest-26363.cloudfunctions.net/subscriptions';

  function registerEscapeClose(e) {
    document.addEventListener('keydown', e => {
      if (e.keyCode === 27) close();
    });
  }

  export function open() {
    registerEscapeClose();
    success = false;
    isOpen = true;
  }

  async function onSubmit() {
    if (lockSubmit) return;
    lockSubmit = true;
    setTimeout(() => (lockSubmit = false), 1000);

    try {
      const formData = new FormData();
      const { status } = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ email: value }),
      });
      if (status >= 400) throw new Error('Invalid');
      value = '';
      success = true;
      setTimeout(close, 2000);
    } catch (ex) {
      error = $localization.subscribe.error;
    }
  }

  function close() {
    isOpen = false;
    document.removeEventListener('keydown', registerEscapeClose);
  }

  function container(node) {
    // document.body.appendChild(node);
  }
</script>

<style>
  .modalContainer {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(26, 29, 29, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .modal {
    background: #1a1d1d;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    max-width: calc(100% - 64px);
    width: 652px;
    padding: 32px;
    padding-bottom: 16px;
    box-sizing: border-box;
    position: relative;
  }

  .title {
    font-weight: 500;
    font-size: 48px;
    line-height: 72px;
    letter-spacing: 0.0025em;
    color: #fefbf6;
    padding-bottom: 16px;
  }

  .description {
    color: rgba(254, 251, 246, 0.65);
    padding-bottom: 24px;
  }

  .buttonContainer {
    display: flex;
    justify-content: center;
  }

  input::placeholder {
    color: rgba(26, 29, 29, 0.35);
  }

  input {
    background: #ede7de;
    border-radius: 8px;
    width: 100px;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: 0.0025em;
    outline: 0;
    border: none;
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }

  button {
    background: linear-gradient(90deg, #731dd8 0%, #5b17ab 100%);
    border-radius: 16px;
    padding: 12px 40px;
    outline: 0;
    border: 0;
    letter-spacing: 0.005em;
    color: rgba(254, 251, 246, 1);
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    margin-top: 40px;
  }

  .error {
    font-size: 24px;
    line-height: 32px;
    letter-spacing: 0.0025em;
    color: #eb403c;
  }

  .close {
    position: absolute;
    right: 4px;
    top: -4px;
    width: 16px;
    height: 16px;
    opacity: 1;
    cursor: pointer;
  }
</style>

{#if isOpen}
  <div
    class="modalContainer"
    use:container
    transition:fade={{ duration: 120 }}
    on:click={close}>

    <form
      on:submit|preventDefault={onSubmit}
      class="modal"
      in:fly={{ y: -100, duration: 200 }}
      on:click|stopPropagation>
      <div class="title">
        {success ? $localization.subscribe.successTitle : $localization.subscribe.title}
      </div>
      <p class="description">
        {success ? $localization.subscribe.successDescription : $localization.subscribe.description}
      </p>
      {#if !success}
        <input
          bind:value
          on:input={() => (error = null)}
          placeholder={$localization.subscribe.yourEmail} />
      {/if}

      {#if error}
        <div class="error">{error}</div>
      {/if}

      {#if !success}
        <div class="buttonContainer">
          <button type="submit">{$localization.subscribe.submit}</button>
        </div>
      {/if}

      <img
        class="close"
        alt="close"
        src="/images/close.svg"
        width="16px"
        height="16px"
        on:click={close} />
    </form>
  </div>
{/if}
