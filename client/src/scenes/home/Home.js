import React from 'react'
// import MainCarousel from "./MainCarousel"
import FoodMenu from "./FoodMenu";

function Home({count, setCount, user, addToState, totalCount}) {
  return (
    <div>
      {/* <MainCarousel /> */}
      <FoodMenu user={user} addToState={addToState} count={count} setCount={setCount} totalCount={totalCount}/>
    </div>
  )
}

export default Home
