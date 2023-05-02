import React from 'react'
import { Box, Typography } from '@mui/material'
function Profile({user}) {
  return (
    <Box width="80%" m="100px auto" mt='10%' mb='10%'>
      <Box align='center'>
        <Typography variant='h2' fontWeight='bold'>Hello, burgers lover!</Typography>
      </Box>
      <Typography variant='h3' mt='3%'>Your Infomation</Typography>
      <Typography variant='h4' m='10px'>Name: {user && user.first_name} {user && user.last_name}</Typography>
      <Typography variant='h4' m='10px'>Email: {user && user.email}</Typography>
      <Typography variant='h4' m='10px'>Birthday: {user && user.dob}</Typography>
      <Typography variant='h4' m='10px'>Point: {user && user.points}</Typography>
    </Box>
  )
}

export default Profile
