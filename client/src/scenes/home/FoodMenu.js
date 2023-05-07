import React, {useEffect, useState} from 'react'
import { Box, Typography, Tabs, Tab, useMediaQuery } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import Food from "../../components/Food"
import { setItems } from '../../state'

function FoodMenu({user, addToState, countItemCount, cartItems}) {

    const dispatch = useDispatch()
    const [value, setValue] = useState("all")
    const items = useSelector((state) => state.cart.items)
    const isNonMobile = useMediaQuery('(min-width:600px)')


    async function getItems() {
        const items = await fetch(
            "/items",
            {method: "GET"}
        )

        const itemsJson = await items.json()
        dispatch(setItems(itemsJson))
    }

    useEffect(() => {
        getItems()
    }, [])

    const handleChange =  (event, newValue) => {
        setValue(newValue)
    }


    const topRated = items.filter(
        (item) => item.category === "Top Rated"
    )

    const newItem = items.filter(
        (item) => item.category === "New Dish"
    )

    const bestItem = items.filter(
        (item) => item.category === "Best Sellers"
    )

  return (
    <Box width="80%" margin="80px auto">
        <Typography variant="h3" textAlign="center">
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
            {value === "all" && items.map((item) => (
                <Food key={item.id} item={item} user={user} addToState={addToState}
                countItemCount={countItemCount} cartItems={cartItems}/>))}
            {value === "newItem" && newItem.map((item) => (
                <Food key={item.id} item={item} user={user} addToState={addToState}
                countItemCount={countItemCount} cartItems={cartItems}/>))}
            {value === "bestItem" && bestItem.map((item) => (
                <Food key={item.id} item={item} user={user} addToState={addToState}
                countItemCount={countItemCount} cartItems={cartItems}/>))}
            {value === "topRated" && topRated.map((item) => (
                <Food key={item.id} item={item} user={user} addToState={addToState}
                countItemCount={countItemCount} cartItems={cartItems}/>))}
        </Box>
    </Box>
  )
}

export default FoodMenu
