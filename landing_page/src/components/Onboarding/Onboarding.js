import React from 'react';
import './Onboarding.css'
import {useTranslation} from "react-i18next";

function Onboarding() {
  const { t } = useTranslation();
  const content = t('onboard', { returnObjects: true });

  const thesesCard = (text) => {
    return(
      <p className="onboarding-content-text">– {text}</p>
    )
  };

  const descriptionCard = (item, index) => {
    return(
      <div>
        <p className="onboarding-content-text">{index+1}) {item.title}</p>
        { item.descriptions.map((desc) => descriptionParagraph(desc)) }
      </div>
    )
  };

  const descriptionParagraph = (text) => {
    return(
      <p className="onboarding-content-text">– {text}</p>
    )
  };

  return (
    <div className="onboarding" id="onboarding">
      <h1 className="onboarding-title-text">{content.howItWorks.title}</h1>

      <p className="onboarding-content-text">{content.howItWorks.textFirst}</p>
      <p className="onboarding-content-text">{content.howItWorks.textSecond}</p>
      <p className="onboarding-content-text">{content.howItWorks.textThird}</p>
      { content.howItWorks.theses.map((item, index) => thesesCard(item)) }
      <p className="onboarding-content-text">{content.howItWorks.forStudents}</p>

      <h2 className="onboarding-title-text">{content.bases.title}</h2>
      <div className="row">
        <div className="col-12 col-lg-6">
          <p className="onboarding-content-text">{content.bases.creationReason}</p>
          <p className="onboarding-content-text">{content.bases.whyThisApp}</p>
          <p className="onboarding-content-text">{content.bases.socialFeatures}</p>
          <p className="onboarding-content-text">{content.bases.comfort}</p>
          <p className="onboarding-content-text">{content.bases.designFeatures}</p>
        </div>
        <div className="col-12 col-lg-6">
          <p className="onboarding-content-text">{content.bases.attention}</p>
          <p className="onboarding-content-text">{content.bases.preDescription}</p>
          { content.bases.basesDescription.map((item, index) => descriptionCard(item, index)) }
        </div>
      </div>
    </div>
  );
}

export default Onboarding;