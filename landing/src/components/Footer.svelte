<script>
  import { localization } from '../localization';
</script>

<style>
  img {
    opacity: 1;
  }

  footer {
    background: #1a1d1d;
  }

  .contact-container {
    padding: 56px 0;
    display: flex;
    justify-content: center;
  }

  .contact {
    width: 260px;
    height: 64px;
    border-radius: 16px;
    border: 2px solid #fefbf6;
    background: rgba(254, 251, 246, 0.05);
    outline: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    text-decoration: none;
    box-sizing: border-box;
  }

  .contact span {
    font-family: IBM Plex Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.005em;
  }

  .copyright {
    padding-bottom: 16px;
    text-align: center;
  }
</style>

<footer class="path" id="contact">
  <div class="contact-container">
    <a class="contact" href="mailto:medlibra@gmail.com">
      <span class="text-primary">{$localization.contactUs}</span>
      <img src="/images/mail.svg" alt="mail" />
    </a>
  </div>
  <div class="copyright text-secondary">{$localization.copyright}</div>
</footer>
