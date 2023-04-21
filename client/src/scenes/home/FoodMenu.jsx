import React, {useEffect, useState} from 'react'
import { Box, Typography, Tabs, Tab, useMediaQuery } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import Food from "../../components/Food"
import { setItems } from '../../state'

function FoodMenu() {

    const dispatch = useDispatch()
    const [value, setValue] = useState("all")
    const items = useSelector((state) => state.cart.items)
    const isNonMobile = useMediaQuery('(min-width:600px)')

    const [itemArray, setItemArray] = useState([])

    useEffect(() => {

        fetch('http://localhost:5555/items')
            .then(r => r.json())
            .then(setItemArray)
    }, [])

    const handleChange =  (event, newValue) => {
        setValue(newValue)
    }


    const topRated = itemArray.filter(
        (item) => item.category === "Top Rated"
    )

    const newItem = itemArray.filter(
        (item) => item.category === "New Dish"
    )

    const bestItem = itemArray.filter(
        (item) => item.category === "Best Sellers"
    )

  return (
    <Box width="80%" margin="80px auto">
        <Typography variant="h3" textAlign="">
            Our Featured <b>Burgers</b>
        </Typography>
        <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ sx: { display: isNonMobile ? "block" : "none"}}}
        sx= {{
            m: "25px",
            "& .MuiTabs-flexContainer": {
                flexWrap: "wrap"
            }
        }}
        >
            <Tab label="ALL" value="all" />
            <Tab label="NEW ITEMS" value="newItem" />
            <Tab label="BEST ITEMS" value="bestItem" />
            <Tab label="TOP RATED" value="topRated" />
        </Tabs>
        <Box
        margin="0 auto"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
        >
            {value === "all" && itemArray.map((item) => (
                <Food key={item.id} image={item.image} name={item.name} description={item.description}
                inStock={item.in_stock} price={item.price} id={item.id} category={item.category}/>))}
            {value === "newItem" && newItem.map((item) => (
                <Food key={item.id} image={item.image} name={item.name} description={item.description}
                inStock={item.in_stock} price={item.price} id={item.id} category={item.category}/>))}
            {value === "bestItem" && bestItem.map((item) => (
                <Food key={item.id} image={item.image} name={item.name} description={item.description}
                inStock={item.in_stock} price={item.price} id={item.id} category={item.category}/>))}
            {value === "topRated" && topRated.map((item) => (
                <Food key={item.id} image={item.image} name={item.name} description={item.description}
                inStock={item.in_stock} price={item.price} id={item.id} category={item.category}/>))}
        </Box>
    </Box>
  )
}

export default FoodMenu
