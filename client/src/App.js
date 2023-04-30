import { useEffect , useState} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
}
from 'react-router-dom'

import Home from "./scenes/home/Home"
import ItemDetails from "./scenes/itemDetails/ItemDetails";
import Checkout from "./scenes/checkout/Checkout";
import Confirmation from "./scenes/checkout/Confirmation";
import Navbar from "./scenes/global/Navbar";
import FoodCart from "./scenes/global/FoodCart";
import Footer from "./scenes/global/Footer";
import SignUp from "./scenes/global/SignUp";
import Login from "./scenes/global/Login";
import Profile from "./scenes/global/Profile";
import CheckOutStripe from "./scenes/checkout/CheckOutStripe";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51MzBCeHMeLOzkmO2oquNeE2qRlVVPRv7qkZlN9OckRbm1gPUnPOUM50f2HSlcCGS66lLwMiqoIBgQWvR6WCgNxBY00WW1shy8y")

const ScrollToTop = () => {
  const {pathname} = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {

  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    fetch("http://localhost:5555/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };


  function addToState(cartObj){
    setCartItems(prevCartItems => [...prevCartItems, cartObj])
  }

  useEffect(() => {
    fetch("/check_session")
    .then((response) => {
      if (response.ok) {
          response.json().then((user) =>
          setUser(user));
          // console.log(user))
      }
  });

  }, [])

  useEffect(()=> {
    fetch('http://localhost:5555/orders')
    .then(r => r.json())
    .then(data => setCartItems(data))
  }, [])

  const totalCount = cartItems.filter(order => order.user?.id === user?.id).reduce((total, item) => {
    return total + item.item_count
  }, 0)

  function handleLogin(user) {
    setUser(user);
  }

  function handleLogout() {
      setUser(null);
  }

  function removeItem(doomedId) {
    const newList = cartItems
    .filter(order => order.user?.id === user?.id)
    .filter(cartObj => {
      return cartObj.id !== doomedId
    })
    setCartItems(newList)
  }

  function countItemCount (cartObj){
    const itemCounted = [...cartItems].map(itemObj => {
      if(itemObj.id === cartObj.id){
        return cartObj
      }else{
        return itemObj
      }
    })
    setCartItems(itemCounted)
  }


  return (
    <div>
      <BrowserRouter>
        <Navbar
        user={user} setUser={setUser} onLogout={handleLogout}
         totalCount={totalCount}
        //  count={count} setCount={setCount}
        />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home user={user} addToState={addToState}/>} />
          <Route path="items/:itemId" element={<ItemDetails cartItems={cartItems} user={user} addToState={addToState}/>} />
          <Route path="checkout" element={<Checkout cartItems={cartItems} user={user}/>} />
          <Route path="checkout/success" element={<Confirmation />} />
          <Route path="/login" element={<Login handleLogin={handleLogin}/>} />
          <Route path="/signup" element={<SignUp user={user} setUser={setUser}/>} />
          <Route path='/profile' element={<Profile />} />
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
        <FoodCart setCartItems={setCartItems}
        cartItems={cartItems} totalCount={totalCount}
        user={user} removeItem={removeItem} countItemCount={countItemCount}
        />

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
