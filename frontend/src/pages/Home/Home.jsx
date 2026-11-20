import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import PromoBanner from '../../components/PromoBanner/PromoBanner';
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs';
import Testimonials from '../../components/Testimonials/Testimonials';
import AppDownload from '../../components/AppDownload/AppDownload';

const Home = () => {
  const [category, setCategory] = useState('All');

  return (
    <main className="home-page-container">
      <Header />
      <PromoBanner />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} setCategory={setCategory} />
      <WhyChooseUs />
      <Testimonials />
      <AppDownload />
    </main>
  );
};

export default Home;
