import React, {useState, useEffect} from 'react'
import { IconButton, Box, Typography, Button, Tabs, Tab } from '@mui/material'
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { shades } from '../../theme'
import { useParams } from 'react-router-dom'
// import Food from '../../components/Food'

function ItemDetails({user, addToState, cartItems}) {
  const { itemId } = useParams()
  const [value, setValue] = useState("description")
  const [count, setCount] = useState(1)
  const [item, setItem] = useState(null)
  // const [items, setItems] = useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  async function getItem() {
    const item = await fetch(
      `http://localhost:5555/items/${itemId}`,
      {method: 'GET'}
    )
    const itemJson = await item.json()
    setItem(itemJson)
  }

//   async function getItems() {
//     const items = await fetch(
//         "http://localhost:5555/items",
//         {method: "GET"}
//     )

//     const itemsJson = await items.json()
//     setItems(itemsJson)
// }

//   const index = Math.floor(Math.random() * (items.length - 2))

  const something = [...cartItems].map((item) => item.item_id)
  console.log(something)


  useEffect(() => {
    getItem()
    // getItems()
  }, [])

  function handleAddToCart(e) {
    e.preventDefault()
    console.log('added to cart')
    fetch('/orders', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            item_count: count,
            user_id: user?.id,
            item_id: item.id
        }),
    })
    .then((r) => {
      if (r.ok) {
        r.json().then( newObj => {
          console.log(newObj)
          addToState(newObj)

        })
      } else {
        alert('POST didnt work')
      }
    })
}
// if (response.ok) {
//   response.json().then((user) =>
//   setUser(user));
  // function handleAddSameItem() {
  //   setCount(count + 1)
  // }

  return (
    <Box width="80%" m="80px auto">
      <Box display="flex" flexWrap="wrap" columnGap="40px">
        <Box flex="1 1 40%" mb="40px">
          <img
            alt={item?.name}
            width="100%"
            height="100%"
            src={item?.image}
            style={{ objectFit: "contain" }}
          />
        </Box>
        <Box flex="1 1 50%" mb="40px">
          <Box display="flex" justifyContent="space-between">
            <Box>Home/Item</Box>
            <Box>Prev Next</Box>
          </Box>
          <Box m="65px 0 25px 0">
            <Typography variant="h3" fontWeight="bold">{item?.name}</Typography>
            <Typography >${item?.price}</Typography>
            <Typography sx={{ mt: '20px' }}>{item?.description}</Typography>
          </Box>
          <Box display="flex" alignItems="center" minHeight="50px">
            <Box display="flex" alignItems="center"
            border={`1.5px solid ${shades.neutral[300]}`}
            mr="20px"
            p="2px 5px"
            >
              <IconButton
                onClick={()=> setCount(Math.max(count - 1, 1))}
              >
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ p: "0 5px" }}>{count}</Typography>
              <IconButton
                onClick={()=> setCount(count + 1)}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Button
            sx={{
              backgroundColor: "#222222",
              color: "white",
              borderRadius: 0,
              minWidth: "150px",
              padding: "10px 40px"
            }}
            onClick={handleAddToCart}

            >
              ADD TO CART
            </Button>
          </Box>
          <Box m="20px 0 5px 0" display="flex">
            {/* <Box >
              <FavoriteBorderOutlinedIcon />
              <Typography sx={{ ml: "5px" }}>SAVE FOR LATER</Typography>
            </Box> */}
            <Typography>CATERGORIES: {item?.category} </Typography>
          </Box>
        </Box>
      </Box>
      <Box m="20px 0">
        <Tabs value={value} onChange={handleChange}>
            <Tab label="DESCRIPTION" value="description" />
            {/* <Tab label="REVIEWS" value="reviews" /> */}
        </Tabs>
      </Box>
      <Box display="flex" flexWrap="wrap" gap="15px">
        {value === "description" && (
          <div>{item?.description}</div>
        )}
      </Box>
      {/* <Box mt="50px" width="100%">
        <Typography variant="h3" fontWeight="bold">
          Related Items
        </Typography>
        <Box
          maxWidth="100%"
          mt="20px"
          display="flex"
          flexWrap="wrap"
          columnGap="1.33%"
          justifyContent="space-between"
        >
          {items.slice(index, index + 3).map((item) => (
            <Food key={item.id} item={item} user={user} addToState={addToState}/>
          ))}
        </Box>
      </Box> */}
    </Box>
  )
}

export default ItemDetails