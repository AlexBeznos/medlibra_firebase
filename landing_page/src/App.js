import React, { Suspense } from 'react';
import './App.css'
import Landing from "./pages/Landing";
import 'bootstrap/dist/css/bootstrap.min.css';

const Loader = () => (
  <div className="App loader">
    <h1 className="loader-text">Loading...</h1>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="background">
        <Landing/>
      </div>
    </Suspense>
  );
}