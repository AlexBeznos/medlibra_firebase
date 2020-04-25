import React, { useState, useEffect, useRef } from 'react';
import './Header.css'
import Logo from "./assets/logo.svg";
import IconSwitch from "./assets/icon-switch.svg";
import {useTranslation} from "react-i18next";

const Header = () => {
  const [hideLangPicker, setHideLangPicker] = useState(true);
  const { t, i18n } = useTranslation();
  const langPicker = useRef(null);
  const langPickerDropdown = useRef(null);

  useEffect(() => {
    window.addEventListener('mousedown', toggleLangPickerVisibility, false);

    return () => window.removeEventListener('mousedown', toggleLangPickerVisibility, false)
  }, []);

  const toggleLangPickerVisibility = (e) => {
    if(langPickerDropdown.current.contains(e.target)) return;

    if(langPicker.current.contains(e.target)) {
      setHideLangPicker(prevState => !prevState);
    } else {
      setHideLangPicker(true);
    }
  };

  const changeLanguage = lng => {
    if(lng) i18n.changeLanguage(lng);
    setHideLangPicker(true);
  };

  const getCurrentLng = () => {
    const lang = i18n.language || window.localStorage.i18nextLng;
    let text;
    switch (lang) {
      case 'ua':
        text = 'укр';
        break;
      case 'ru':
        text = 'рус';
        break;
    }
    // TODO: refactor from hardcode languages to iterating over existing
    return text;
  };

  return (
    <div className="header">
      <div className="container">
        <div className="logo-row row justify-content-between">
          <div className="col-5 col-sm-4">
            <img src={Logo} className="logo" alt="logo" />
          </div>
          <div className="col-3 col-sm-1">
            <div className="lang-picker" ref={langPicker}>
              <div className="lang-picker__text">{getCurrentLng()}</div>
              <img src={IconSwitch} alt="change-language" className="btn-icon" />
            </div>
            <div className="lang-picker__dropdown" hidden={hideLangPicker} ref={langPickerDropdown}>
              <div className="lang-picker__text" onClick={() => changeLanguage('ua')}>Українська</div>
              <div className="lang-picker__text" onClick={() => changeLanguage('ru')}>Російська</div>
            </div>
          </div>
          <div className="col-sm-6 d-none d-md-block">
            <nav className="navbar navbar-expand-sm navigation">
              <div className="navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link header-link" href="#">{t('header.download')}</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link header-link" href="#strenghts">{t('header.advantages')}</a>
                  </li>
                  <li className="nav-item d-none d-lg-block">
                    <a className="nav-link header-link" href="#onboarding">{t('header.onboarding')}</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link header-link" href="#contact-us">{t('header.contacts')}</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>

        <div className="row d-flex d-md-none">
          <div className="col navlink-col">
              <a className="header-link" href="#">{t('header.download')}</a>
          </div>
          <div className="col navlink-col">
              <a className="header-link" href="#strenghts">{t('header.advantages')}</a>
          </div>
          <div className="col navlink-col">
              <a className="header-link" href="#contact-us">{t('header.contacts')}</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
