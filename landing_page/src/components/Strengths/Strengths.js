import React from 'react';
import './Strengths.css'
import {useTranslation} from "react-i18next";

const Strengths = () => {
  const { t } = useTranslation();

  const card = (title, text) => {
    return(
        <div className="strengths-card card-border">
          <h2 className="strengths-card-title">{title}</h2>
          <p className="card-text" dangerouslySetInnerHTML={{__html: text}} />
        </div>
    )
  };

  return (
      <div className="row strengths" id="strenghts">
        <div className="col-6 col-sm-3">
          { card(5, t('strengths.testTypes')) }
        </div>
        <div className="col-6 col-sm-3">
          { card(20, t('strengths.specializations')) }
        </div>
        <div className="col-6 col-sm-3">
          { card('3 000', t('strengths.bases')) }
        </div>
        <div className="col-6 col-sm-3">
          { card('160 000', t('strengths.uniqQuestions')) }
        </div>
      </div>
  );
}

export default Strengths;