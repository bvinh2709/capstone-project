import React, {useState} from 'react'
import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import styled from '@emotion/styled'
import {shades} from "../../theme"

import {
    increaseCount,
    decreaseCount,
    setIsCartOpen,
} from "../../state"

import { useNavigate } from 'react-router-dom'

const FlexBox = styled(Box)`
    display: flex
    justify-content: space-between
    align-items: center
`

function FoodCart({order, totalCount, user, totalPrice, cartItems, removeItem, count, setCount, addToState, setCartItems}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [itemCount, setItemCount] = useState(order.item_count)
    // const cart = useSelector((state) => state.cart.cart)
    const isCartOpen = useSelector((state) => state.cart.isCartOpen)

    function handleDelete() {
        removeItem(order.id)
        fetch(`orders/${order.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
        });
    }

    function plusQuantity() {
        dispatch(increaseCount({id: order.id}))
        const newCount = itemCount + 1;

        fetch(`orders/${order.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_count: newCount })
        })
          .then(r => r.json())
          .then(data => {
            setCount(newCount);
            setItemCount(newCount)
          });
      }

    function minusQuantity() {
        dispatch(decreaseCount({id: order.id}))
        if (order.item_count > 1) {
            const newCount = itemCount - 1;
            fetch(`orders/${order.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_count: newCount })
            })
            .then(r => r.json())
            .then(data => {
                setCount(newCount);
                setItemCount(newCount)
            });
        }
        else if (order.item_count === 1) {
            removeItem(order.id)
            fetch(`orders/${order.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
            });
        }
      }


    function handleClearCart() {
        fetch(`/clearcart`)
        setCartItems([])
    }

  return (
    <Box
        display={isCartOpen ? "block" : "none"}
        backgroundColor="rgba(0, 0, 0, 0.4)"
        position="fixed"
        zIndex={10}
        width="100%"
        height="100%"
        left="0"
        top="0"
        overflow="auto"
    >
        {/* {MODAL} */}
        <Box
            position="fixed"
            right="0"
            bottom="0"
            width="max(400px, 30%)"
            height="100%"
            backgroundColor="white"
        >
            <Box padding="30px" overflow="auto" height="100%">
                {/* HEADER */}
                <Box mb="15px" display="flex" justifyContent= "space-between" alignItems="center">
                    {user ? (
                    <Typography variant="h3">your order ({totalCount})</Typography>
                    ) : (
                        <Typography variant="h3">your order (0)</Typography>
                    )}
                    <IconButton onClick={()=>dispatch(setIsCartOpen({}))}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                {/* Cart List */}
                {user ? (
                <Box>
                    {cartItems
                    .filter(order => order.user?.id === user?.id)
                    .map((order) => (
                        <Box key={order.item.id}>
                            <FlexBox p="15px 0" display="flex" justifyContent= "space-between" alignItems="center">
                                <Box flex="1 1 40%">
                                    <img
                                    alt={order.item.name}
                                    width="123px"
                                    height="164px"
                                    src={order.item.image} />
                                </Box>
                                <Box flex="1 1 60%">
                                    <FlexBox mb="5px" display="flex" justifyContent= "space-between" alignItems="center">
                                        <Typography fontWeight="bold">
                                            {order.item.name}
                                        </Typography>
                                        <IconButton onClick={()=> handleDelete(order.id)}>
                                        {/* <IconButton> */}
                                            <CloseIcon />
                                        </IconButton>
                                    </FlexBox>
                                    <Typography>{order.item.description}</Typography>
                                    <FlexBox m="15px 0" display="flex" justifyContent= "space-between" alignItems="center">
                                        <Box display="flex" alignItems="center" border={`1.5px solid ${shades.neutral[500]}`}>
                                            <IconButton
                                                onClick={()=>minusQuantity(order.id)}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography>{order.item_count}</Typography>
                                            <IconButton
                                                onClick={()=>plusQuantity(order.id)}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                        {/* PRICE */}
                                        <Typography fontWeight="bold">
                                            {order.item_count} X ${order.item.price}
                                        </Typography>
                                    </FlexBox>
                                </Box>
                            </FlexBox>
                            <Divider />
                        </Box>
                    ))}
                </Box>
                ) : (
                    <Box> Your cart is empty. <IconButton onClick={()=> navigate('/login')}>Sign in</IconButton> to see your cart! </Box>
                )
}
                {/* ACTIONS */}
                <Box m="20px 0">
                    <FlexBox m="20px 0" display="flex" justifyContent= "space-between" alignItems="center">
                        <Typography fontWeight="bold">SUBTOTAL</Typography>
                        {user ? (
                            <Typography fontWeight="bold">${totalPrice}</Typography>
                        ) : (
                            <Typography fontWeight="bold">$0</Typography>
                        )
                    }
                    </FlexBox>
                    <Button
                    sx={{
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: 0,
                        minWidth: '100%',
                        padding: "20px 40px",
                        margin: "20px 0",
                    }}
                    onClick={handleClearCart}
                    >
                        CLEAR CART
                    </Button>
                    <Button
                    sx={{
                        backgroundColor: shades.primary[400],
                        color: "white",
                        borderRadius: 0,
                        minWidth: '100%',
                        padding: "20px 40px",
                        margin: "0",
                    }}
                    onClick={()=> {
                        navigate('/checkout')
                        dispatch(setIsCartOpen({}))
                    }}
                    >
                        CHECKOUT
                    </Button>

                </Box>
            </Box>
        </Box>
    </Box>
  )
}

export default FoodCart
