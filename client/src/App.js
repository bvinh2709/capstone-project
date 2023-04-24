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

  useEffect(() => {
    fetch("/check_session")
    .then((response) => {
      if (response.ok) {
          response.json().then((user) =>
          setUser(user));
          // console.log(user))
      }
  });
    fetch('/orders')
        .then(r => r.json())
        .then(data => setCartItems(data))
  }, [])

  const totalCount = cartItems.reduce((total, item) => {
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

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar user={user} setUser={setUser} onLogout={handleLogout} totalCount={totalCount}/>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home user={user}/>} />
          <Route path="items/:itemId" element={<ItemDetails user={user}/>} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="checkout/success" element={<Confirmation />} />
          <Route path="/login" element={<Login handleLogin={handleLogin}/>} />
          <Route path="/signup" element={<SignUp user={user} setUser={setUser}/>} />
          <Route path='/profile' element={<Profile />} />
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
        <FoodCart setCartItems={setCartItems} cartItems={cartItems} totalCount={totalCount} user={user} removeItem={removeItem}/>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
