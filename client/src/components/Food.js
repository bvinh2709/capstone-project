import React, {useState} from 'react'
import {
    IconButton, Box, Typography, useTheme, Button, Stack,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material'
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { shades } from '../theme'
import { useNavigate } from 'react-router-dom'

function Food({item, width, user, addToState, countItemCount, cartItems}) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalUsers, setModalUsers] = useState([])
    const [count, setCount] = useState(1)
    const [isHovered, setIsHovered] = useState(false)
    const navigate = useNavigate()

    const handleClose = () => {
        setIsOpen(false);
      };

    const {
        palette: { neutral },
    } = useTheme()

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
                item_id: item.id
            }),
        })
        .then((r) => {
          if (r.ok) {
            r.json().then( newObj => {
                addToState(newObj)
                setIsOpen(true)
                fetch(`/items/${item.id}`)
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
    const itemIdInCartItem = cartItems.map((item) => {return item.item_id})
    const itemUsers = [...new Set(modalUsers.filter(modalUser => modalUser.first_name !== user?.first_name).map(modalUser => modalUser.first_name))]

    return (
        <Box width={width}>
            <Box
                position="relative"
                onMouseOver={()=> setIsHovered(true)}
                onMouseOut={()=> setIsHovered(false)}
            >
                <img
                src={item.image} alt={item.name}
                width="100%" height="400px"
                onClick={()=> navigate(`/items/${item.id}`)}
                style={{ cursor: 'pointer', objectFit: "cover",
                backgroundAttachment: "fixed"}}
                />
                <Box
                    display={isHovered ? "block" : "none"}
                    // display="block"
                    positon="absolute"
                    bottom="10%"
                    left='0'
                    width="100%"
                    padding="0 5%"

                >
                    <Box display="flex" justifyContent="space-between" >
                        {/* Amount */}
                        <Box
                        display="flex"
                        alignItems="center"
                        backgroundColor={shades.neutral[100]}
                        borderRadius="3px"

                        >
                            <IconButton
                                onClick={()=>setCount(Math.max(count - 1, 1))}
                            >
                                <RemoveIcon />
                            </IconButton>
                            <Typography color={shades.primary[300]}>{count}</Typography>
                            <IconButton
                                onClick={()=>setCount(count + 1)}
                            >
                                <AddIcon />
                            </IconButton>
                        </Box>
                        {/* BUTTON */}
                        <Button
                        type="submit"
                        onClick={(itemIdInCartItem.includes(item?.id))
                            ? () => plusQuantity(cartItems[cartItems.length - 1].id, cartItems[cartItems.length - 1].item_count)
                            : handleAddToCart
                          }
                        sx={{ backgroundColor: shades.primary[300], color: "white"}}
                        >
                        Add to Cart
                        </Button>

                    </Box>
                    </Box>

                </Box>
                <Box>
                    <Typography variant="subtitle2" color={neutral.dark}>{item.category}</Typography>
                    <Typography>{item.name}</Typography>
                    <Typography fontWeight="bold">${item.price}</Typography>
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

export default Food
