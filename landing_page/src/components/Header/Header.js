import React from 'react';
import './Header.css'
import Logo from "./assets/logo.svg";
import IconSwitch from "./assets/icon-switch.svg";
import {useTranslation} from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = lng => {
    console.log(lng)
    i18n.changeLanguage(lng);
  };

  const getCurrentLng = () => i18n.language || window.localStorage.i18nextLng;

  return (
    <div className="header">
      <div className="container">
        <div className="logo-row row justify-content-between">
          <div className="col-5 col-sm-4">
            <img src={Logo} className="logo" alt="logo" />
          </div>
          <div className="col-2 col-sm-1">
            <select className="lang-picker" onChange={(e) => changeLanguage(e.target.value)} value={getCurrentLng()}>
              <option value="ua" active>укр</option>
              <option value="ru">рос</option>
            </select>
          </div>
          <div className="col-5 col-sm-7 d-none d-md-block">
            <nav className="navbar navbar-expand-sm">
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
          <div className="col">
              <a className="nav-link header-link" href="#">{t('header.download')}</a>
          </div>
          <div className="col">
              <a className="nav-link header-link" href="#strenghts">{t('header.advantages')}</a>
          </div>
          <div className="col">
              <a className="nav-link header-link" href="#contact-us">{t('header.contacts')}</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
