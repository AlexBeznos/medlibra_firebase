import React from 'react';
import './Title.css'
import AppStoreIcon from './assets/app-store.svg';
import PlayMarketIcon from './assets/play-market.svg';
import { useTranslation } from 'react-i18next';

const Title = () => {
  const { t } = useTranslation();

  const downloadIphoneButton = () => {
    return (
      <div className="download-btn btn-iphone">
        <img src={AppStoreIcon} alt="download-android" className="btn-icon" />
        <h5 className="btn-text">AppStore</h5>
      </div>
    )
  };

  const downloadAndroidButton = () => {
    return (
      <div className="download-btn btn-android">
        <img src={PlayMarketIcon} alt="download-android" className="btn-icon" />
        <h5 className="btn-text">PlayMarket</h5>
      </div>
    )
  };

  return (
      <div className="title">
        <div className="title-block">
          <h1 className="title-text">Medlibra</h1>
          <br/>
          <br/>
          <h1 className="title-text" dangerouslySetInnerHTML={{__html: t('title.title')}}></h1>
          <br/>
          <br/>
          <h3 className="title-text download-text">{t('title.downloadText')}</h3>
          <br/>
          <div className="row">
            <div className="col-12 col-sm-5 col-md-4 col-lg-3">
              { downloadIphoneButton() }
            </div>
            <div className="col-12 col-sm-5 col-md-4 col-lg-3">
              { downloadAndroidButton() }
            </div>
          </div>
        </div>
      </div>
  );
};

export default Title;
