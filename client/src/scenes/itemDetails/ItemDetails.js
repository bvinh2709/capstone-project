import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, Box, Typography, Button, Tabs, Tab } from '@mui/material'
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"
import { shades } from '../../theme'
import { addToCart } from '../../state'
import { useParams } from 'react-router-dom'
import Food from '../../components/Food'

function ItemDetails({user}) {

  const dispatch = useDispatch()
  const { itemId } = useParams()
  const [value, setValue] = useState("description")
  const [count, setCount] = useState(1)
  const [item, setItem] = useState(null)
  const [items, setItems] = useState([])

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

  async function getItems() {
    const items = await fetch(
        "http://localhost:5555/items",
        {method: "GET"}
    )

    const itemsJson = await items.json()
    setItems(itemsJson)
}

  const index = Math.floor(Math.random() * (items.length - 2))



  useEffect(() => {
    getItem()
    getItems()
  }, [itemId])

  function handleAddToCart() {
    dispatch(addToCart({ item: {...item, count}}))
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
    .then((r) => r.json())
    console.log(item.id)
    console.log(user.id)
}

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
          <Box>
            <Box m="20px 0 5px 0" display="flex">
              <FavoriteBorderOutlinedIcon />
              <Typography sx={{ ml: "5px" }}>SAVE FOR LATER</Typography>
            </Box>
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
      <Box mt="50px" width="100%">
        <Typography variant="h3" fontWeight="bold">
          Related Items
        </Typography>
        <Box
          mt="20px"
          display="flex"
          flexWrap="wrap"
          columnGap="1.33%"
          justifyContent="space-between"
        >
          {items.slice(index, index + 3).map((item) => (
            <Food key={item.id} item={item} user={user}/>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default ItemDetails