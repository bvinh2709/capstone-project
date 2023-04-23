import React from 'react'
import { Box, Typography} from '@mui/material'
import { shades } from '../../theme'

function Footer() {

    // const {
    //     palette: {neutral},
    // } = useTheme()

  return (
    <Box mt="70px" p="40px 0" backgroundColor={shades.primary[500]}>
        <Box
            width="80%"
            margin="auto"
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            rowGap="30px"
            columnGap="clamp(20px, 30px, 40px)"
        >
            <Box width="clamp(20%, 30%, 40%)">
                <Typography
                variant="h4"
                fontWeight="bold"
                mb="30px"
                textAlign="center"
                color={shades.neutral[500]}
                >
                    THE FLAT BURGER
                </Typography>
                <Typography textAlign="center" color={shades.neutral[500]}>
                    Welcome to The Flat Burger, where simplicity meets flavor! Our burger joint is known for
                    its unique twist on the classic American favorite - the humble burger. Located in a
                    cozy corner of town, The Flat Burger is a local gem that has been serving up
                    mouthwatering burgers since 1985.
                </Typography>

                <Typography textAlign="center" color={shades.neutral[500]}>
                    At The Flat Burger, we take pride in providing friendly and attentive service, making sure that every
                    guest leaves with a satisfied smile. Whether you're a local looking for your next burger
                    fix or a traveler seeking a taste of authentic American cuisine,
                    The Flat Burger is the place to be. So come on down and experience the joy of biting into a
                    deliciously satisfying burger that's anything but flat!
                </Typography>
            </Box>
            <Box textAlign="center" color={shades.neutral[500]}>
                <Typography variant="h4" fontWeight="bold" mb="30px">
                    About Us
                </Typography>
                {/* <img src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YWJvdXQlMjB1c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" alt="about us" width="25%"/> */}
                <Typography mb="30px">Careers</Typography>
                <Typography mb="30px">Our Stores</Typography>
                <Typography mb="30px">Terms & Policy</Typography>
            </Box>
            <Box textAlign="center" color={shades.neutral[500]}>
                <Typography variant="h4" fontWeight="bold" mb="30px">
                    Customer Care
                </Typography>
                {/* <img src="https://images.unsplash.com/photo-1553775282-20af80779df7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3VzdG9tZXIlMjBjYXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="about us" width="25%"/> */}
                <Typography mb="30px">Help Center</Typography>
                <Typography mb="30px">Track Your Order</Typography>
                <Typography mb="30px">Return & Refund</Typography>
            </Box>

            <Box width="clamp(20%, 25%, 30%)" textAlign="center" color={shades.neutral[500]}>
                <Typography variant="h4" fontWeight="bold" mb="30px">
                    Contact Us
                </Typography>
                {/* <img src="https://images.unsplash.com/photo-1586769852044-692d6e3703f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbnRhY3QlMjB1c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" alt="about us" width="25%"/> */}
                <Typography mb="30px">6181 Old Dobbin Ln Ste 200, Columbia, MD 21045</Typography>
                <Typography mb="30px">Email: theflatburger@placeaburger.com</Typography>
                <Typography mb="30px">(444)555-9999</Typography>
            </Box>
        </Box>
    </Box>
  )
}

export default Footer
