import React from 'react'
// import MainCarousel from "./MainCarousel"
import FoodMenu from "./FoodMenu";

function Home({user, addToState}) {
  return (
    <div>
      {/* <MainCarousel /> */}
      <FoodMenu addToState={addToState} user={user}/>
    </div>
  )
}

export default Home
