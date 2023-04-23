import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, Box, Typography, useTheme, Button } from '@mui/material'
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { shades } from '../theme'
import { addToCart } from '../state'
import { useNavigate } from 'react-router-dom'

function Food({item, width, user}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [count, setCount] = useState(1)
    const [isHovered, setIsHovered] = useState(false)
    const {
        palette: { neutral },
    } = useTheme()

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
                        onClick={handleAddToCart}
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
        </Box>
    )
}

export default Food
