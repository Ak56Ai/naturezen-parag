import React from 'react';
import Hero from '../components/Hero';
import NewArrivals from '../components/sections/NewArrivals';
import BestInAyurveda from '../components/sections/BestInAyurveda';
import HundredYearsRecipe from '../components/sections/HundredYearsRecipe';
import BestInClass from '../components/sections/BestInClass';
import TopSellers from '../components/sections/TopSellers';
import DiscountedProducts from '../components/sections/DiscountedProducts';
import MobileAppPromo from '../components/sections/MobileAppPromo';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <NewArrivals />
      <BestInAyurveda />
      <HundredYearsRecipe />
      <BestInClass />
      <TopSellers />
      <DiscountedProducts />
      <MobileAppPromo />
    </div>
  );
};

export default HomePage;