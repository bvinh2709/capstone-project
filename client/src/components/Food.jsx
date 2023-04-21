import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, Box, Typography, useTheme, Button } from '@mui/material'
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { shades } from '../theme'
import { addToCart } from '../state'
import { useNavigate } from 'react-router-dom'

function Food({id, image, name, description, inStock, price, category}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [count, setCount] = useState(1)
    const [isHovered, setIsHovered] = useState(false)
    const {
        palette: { neutral },
    } = useTheme()

    return (
        <Box>
            <Box
                position="relative"
                onMouseOver={()=> setIsHovered(true)}
                onMouseLeave={()=> setIsHovered(false)}
            >
                <img
                src={image} alt={name}
                width="400px" height="400px"
                onClick={()=> navigate(`/items/${id}`)}
                style={{ cursor: 'pointer'}}
                />
                <Box
                    display={isHovered ? "block" : "none"}
                    positon="absolute"
                    bottom="10%"
                    left='0'
                    width="100%"
                    padding="0 5%"
                >
                    <Box display="flex" justifyContent="space-between">
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
                        // onClick={()=>dispatch(addToCart({ item: {...item, count}}))}
                        onClick={()=>dispatch(addToCart({ item: {count}}))}
                        sx={{ backgroundColor: shades.primary[300], color: "white"}}
                        >
                        Add to Cart
                        </Button>
                    </Box>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color={neutral.dark}>{category}</Typography>
                    <Typography>{name}</Typography>
                    <Typography fontWeight="bold">${price}</Typography>
                </Box>
        </Box>
    )
}

export default Food
