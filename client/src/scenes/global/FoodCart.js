import React from 'react'
import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import styled from '@emotion/styled'
import {shades} from "../../theme"

import {
    removeFromCart,
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

function FoodCart({cartItems, totalCount, user}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const cart = useSelector((state) => state.cart.cart)
    const isCartOpen = useSelector((state) => state.cart.isCartOpen)

    const totalPrice = cartItems.reduce((total, item) => {
        return total + item.item_count * item.item.price
    }, 0)

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
                {cart.map((item) => (
                        <Box key={`${item.name}-${item.id}`}>
                            <FlexBox p="15px 0" display="flex" justifyContent= "space-between" alignItems="center">
                                <Box flex="1 1 40%">
                                    <img
                                    alt={item.name}
                                    width="123px"
                                    height="164px"
                                    src={item.image} />
                                </Box>
                                <Box flex="1 1 60%">
                                    <FlexBox mb="5px" display="flex" justifyContent= "space-between" alignItems="center">
                                        <Typography fontWeight="bold">
                                            {item.name}
                                        </Typography>
                                        <IconButton onClick={()=>dispatch(removeFromCart({ id: item.id}))}>
                                            <CloseIcon />
                                        </IconButton>
                                    </FlexBox>
                                    <Typography>{item.description}</Typography>
                                    <FlexBox m="15px 0" display="flex" justifyContent= "space-between" alignItems="center">
                                        <Box display="flex" alignItems="center" border={`1.5px solid ${shades.neutral[500]}`}>
                                            <IconButton
                                                onClick={()=>dispatch(decreaseCount({id: item.id}))}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography>{item.count}</Typography>
                                            <IconButton
                                                onClick={()=>dispatch(increaseCount({id: item.id}))}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                        {/* PRICE */}
                                        <Typography fontWeight="bold">
                                            ${item.price}
                                        </Typography>
                                    </FlexBox>
                                </Box>
                            </FlexBox>
                            <Divider />
                        </Box>
                    ))}
                </Box>
                ) : (
                    <Box> <IconButton onClick={()=> navigate('/login')}><Typography color={"blue"}>Sign In</Typography></IconButton> to see your Cart info</Box>
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
                    disabled="True"
                    sx={{
                        backgroundColor: 'grey',
                        color: shades.primary[500],
                        borderRadius: 0,
                        minWidth: '100%',
                        padding: "20px 40px",
                        margin: "20px 0",
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
