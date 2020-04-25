import React from 'react';
import './Landing.css'
import { useTranslation } from 'react-i18next';
import Header from "../components/Header/Header";
import Title from "../components/Title/Title";
import Strengths from "../components/Strengths/Strengths";
import Description from "../components/Description/Description";
import Footer from "../components/Footer/Footer";
import Onboarding from "../components/Onboarding/Onboarding";

function Landing() {
  const { t, i18n } = useTranslation();

  return (
      <div className="background-images">
        <Header />
        <div className="container">
          <Title />
          <Strengths />
          <Description />
          <Onboarding />
        </div>
        <Footer />
      </div>
  );
}

export default Landing;
