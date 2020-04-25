import React from 'react';
import './Description.css';
import Library from './assets/library.svg';
import Storage from './assets/storage.svg';
import Archive from './assets/archive.svg';
import Theme from './assets/theme.svg';
import Charts from './assets/charts.svg';
import {useTranslation} from "react-i18next";

function Description() {
  const { t } = useTranslation();
  const content = t('description.content', { returnObjects: true });
  const images = [ Library, Storage, Archive, Theme, Charts ];

  const card = (title, body, image, index) => {
    const isRowEven = index % 2 === 0;
    const imagePosition = isRowEven ? 1 : 2;
    const textPosition = isRowEven ? 2 : 1;
    return(
      <div>
        <div className="row">
          { cardImage(image, imagePosition) }
          { cardText(title, body, textPosition) }
        </div>
        { index + 1 !== content.length ? splitter() : '' }
      </div>
    )
  };

  const cardText = (title, body, position) => {
    return(
        <div className={`col-12 col-sm-6 order-md-${position}`}>
          <h2 className="title-text card-title">{title}</h2>
          <p className="card-text">{body}</p>
        </div>
    )
  };

  const cardImage = (image, position) => {
    return(
        <div className={`col-12 col-sm-6 image-container order-md-${position}`}>
          <img src={image} alt="img" width="330" />
        </div>
    )
  };

  const splitter = () => {
    return(
        <div className="splitter"></div>
    )
  };

  return (
      <div className="description">
        { content.map((item, index) => card(item.title, item.body, images[index], index)) }
      </div>
  );
}

export default Description;
