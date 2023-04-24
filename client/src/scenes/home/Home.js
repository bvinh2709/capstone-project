import React from 'react'
import MainCarousel from "./MainCarousel"
import FoodMenu from "./FoodMenu";

function Home({user, addToState}) {
  return (
    <div>
      <MainCarousel />
      <FoodMenu user={user} addToState={addToState}/>
    </div>
  )
}

export default Home
