import React from 'react'
// import MainCarousel from "./MainCarousel"
import FoodMenu from "./FoodMenu";

function Home({user, addToState, countItemCount, cartItems}) {
  return (
    <div>
      {/* <MainCarousel /> */}
      <FoodMenu addToState={addToState} user={user}
      countItemCount={countItemCount} cartItems={cartItems}/>
    </div>
  )
}

export default Home
