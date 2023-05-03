import React from 'react'
import { Box, Alert, AlertTitle } from '@mui/material'

function CheckoutFail() {
  return (
    <Box m="90px auto" width="80%" height="50vh">
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
            You have unsuccessfully placed an Order - {" "}
            <a href='/'><strong>Let's head back to the main session</strong></a>
      </Alert>
    </Box>
  )
}

export default CheckoutFail
