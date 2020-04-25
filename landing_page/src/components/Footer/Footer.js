import React from 'react';
import './Footer.css';
import WriteToDevelopers from './write-to-developers.svg';
import {useTranslation} from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
      <footer className="footer page-footer">
        <div className="footer-copyright text-center title-text card-text">
          <a href="mailto:name@email.com">
            <img className="footer-action" id="contact-us" src={WriteToDevelopers} alt="write" />
          </a>
          <div className="footer-action footer-text">© Medlibra 2020. {t('footer.rightsReserved')}</div>
        </div>
      </footer>
  );
};

export default Footer;
