import React from 'react'
// import MainCarousel from "./MainCarousel"
import FoodMenu from "./FoodMenu";

function Home({user}) {
  return (
    <div>
      {/* <MainCarousel /> */}
      <FoodMenu user={user}/>
    </div>
  )
}

export default Home
