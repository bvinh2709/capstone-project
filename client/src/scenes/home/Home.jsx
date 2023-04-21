import React from 'react'
import MainCarousel from "./MainCarousel"
import FoodMenu from "./FoodMenu";

function Home() {
  return (
    <div className="home">
      <MainCarousel />
      <FoodMenu />
    </div>
  )
}

export default Home
