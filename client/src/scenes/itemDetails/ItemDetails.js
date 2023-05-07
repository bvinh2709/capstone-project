import React, {useState, useEffect} from 'react'
import { IconButton, Box, Typography, Button, Tabs, Tab,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack,
} from '@mui/material'
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { shades } from '../../theme'
import { useParams } from 'react-router-dom'

function ItemDetails({user, addToState, cartItems, setCartItems, countItemCount}) {
  const { itemId } = useParams()
  const [value, setValue] = useState("description")
  const [count, setCount] = useState(1)
  const [item, setItem] = useState(null)
  const [isOpen, setIsOpen] = useState(false);
  const [modalUsers, setModalUsers] = useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  async function getItem() {
    const item = await fetch(
      `/items/${itemId}`,
      {method: 'GET'}
    )
    const itemJson = await item.json()
    setItem(itemJson)
  }

  const itemIdInCartItem = cartItems.map((item) => {return item.item_id})

  const handleClose = () => {
    setIsOpen(false);
  };

  function handleAddToCart(e) {
    e.preventDefault()
    fetch('/orders', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            item_count: count,
            user_id: user?.id,
            item_id: itemId
        }),
    })

    .then((r) => {
      if (r.ok) {
        r.json().then((newObj) => {
          addToState(newObj)
            setIsOpen(true)
            fetch(`/items/${itemId}`)
            .then(r=>r.json())
            .then(data => {
                setModalUsers(data.users)
            })
        })
      } else {
        alert('POST didnt work')
      }
    })
}

function plusQuantity(id, item_count) {
  const newCount = item_count + count
  fetch(`/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_count: newCount})
  })
      .then(r => r.json())
      .then(data => {
          countItemCount(data)
      })

  }

  useEffect(() => {
    getItem()
  }, [])


const itemUsers = [...new Set(modalUsers.filter(modalUser => modalUser.first_name !== user?.first_name).map(user => user.first_name))]

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
            onClick={(itemIdInCartItem.includes(item?.id))
              ? () => plusQuantity(cartItems[cartItems.length - 1].id, cartItems[cartItems.length - 1].item_count)
              : handleAddToCart
            }

            >
              ADD TO CART
            </Button>
          </Box>
          <Box m="20px 0 5px 0" display="flex">

            <Typography>CATERGORIES: {item?.category} </Typography>
          </Box>
        </Box>
      </Box>
      <Box m="20px 0">
        <Tabs value={value} onChange={handleChange}>
            <Tab label="DESCRIPTION" value="description" />

        </Tabs>
      </Box>
      <Box display="flex" flexWrap="wrap" gap="15px">
        {value === "description" && (
          <div>{item?.description}</div>
        )}
      </Box>

      <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>Great choice!</DialogTitle>
          <DialogContent>
          {itemUsers.length > 0 && (
              itemUsers.map((name) => (
                  <DialogContentText>
                      {name} is ordering the same thing
                  </DialogContentText>
              ))
          )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
              <Stack direction="row" spacing={2}>
                  <Button onClick={handleClose} variant="contained" autoFocus>
                  OK! Great!!
                  </Button>
              </Stack>
          </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ItemDetails