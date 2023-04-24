import { useDispatch} from "react-redux"
import { Badge, Box, IconButton, Menu, MenuItem, Button} from "@mui/material"
import {
  PersonOutline,
  FastfoodOutlined,
  SearchOutlined,
  LunchDiningOutlined,
  RestaurantMenuOutlined,
  LocalBarOutlined,
  LogoutOutlined,
  PermIdentityOutlined,
  SettingsOutlined
} from '@mui/icons-material'

import { useNavigate } from "react-router-dom"
// import {shades} from "../../theme"
import { setIsCartOpen } from "../../state"
import {useState, useEffect} from 'react'

function Navbar({user, setUser, onLogout, totalCount}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [badgeCount, setBadgeCount] = useState(0)
  // const cart = useSelector((state) => state.cart.cart)
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(()=>{
    setBadgeCount(totalCount)
  }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  function handleLogout() {
    onLogout()
    navigate('/login')
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      height="60px"
      backgroundColor="rgba(0,0,0,0.95)"
      color="black"
      position="fixed"
      top="0"
      left="0"
      zIndex="1"
    >
      <Box
        width="80%"
        margin="auto"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          onClick={() => navigate('/')}
          sx={{ '&:hover': { cursor: "pointer", color: "yellow", transition: "3s", zoom: "1.5" }}}
          color="white"
        >
            <Box>
                <LunchDiningOutlined />
                <RestaurantMenuOutlined />
                <LocalBarOutlined />
            </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          columnGap="20px"
          zIndex='2'
        >
            <IconButton sx={{ color: 'white' }}>
                <SearchOutlined />
                Find
            </IconButton>
            {user ? (
              <div>
                <IconButton
                  sx={{ color: 'white' }}
                  // onClick={ handleLogout }
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                    Welcome, {user?.first_name}
                    {/* <LogoutOutlined />
                    LogOut */}
                </IconButton>
                <Menu

                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  // PaperProps={{
                  //   style: {
                  //     backgroundColor: 'black',

                  //   },
                  // }}
                >
                  <MenuItem onClick={handleClose} sx={{ color: 'white' }}>
                    <Button >
                      Profile
                      <PermIdentityOutlined />
                    </Button>
                  </MenuItem>
                  <MenuItem onClick={handleClose} sx={{ color: 'white' }}>
                  <Button>
                      Settings
                      <SettingsOutlined />
                    </Button>
                  </MenuItem>
                  <MenuItem onClick={handleClose} sx={{ color: 'white' }}>
                    <Button onClick={handleLogout}>
                      LogOut
                      <LogoutOutlined />
                    </Button>
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <IconButton sx={{ color: 'white' }} onClick={()=> navigate('/login')}>
                  <PersonOutline />
                  LogIn
              </IconButton>
            )}
            {user ? (
              <Badge
                  badgeContent={badgeCount}
                  color="secondary"
                  invisible={badgeCount === 0}
                  sx={{
                  "& .MuiBadge-badge": {
                      right: 5,
                      top: 5,
                      padding: " 0 4px",
                      height: "14px",
                      minWidth: "13px",
                  },
                  }}
              >
              <IconButton
                onClick={() => dispatch(setIsCartOpen({}))}
                sx={{ color: 'white' }}
              >
                <FastfoodOutlined />
                Order
              </IconButton>
              </Badge>
            ) : (
              <Badge
                  badgeContent={badgeCount}
                  color="secondary"
                  invisible={badgeCount === 0}
                  sx={{
                  "& .MuiBadge-badge": {
                      right: 5,
                      top: 5,
                      padding: " 0 4px",
                      height: "14px",
                      minWidth: "13px",
                  },
                  }}
              >
              <IconButton
                onClick={() => dispatch(setIsCartOpen({}))}
                sx={{ color: 'white' }}
              >
                <FastfoodOutlined />
                Order
              </IconButton>
              </Badge>
            )
          }
            {/* <IconButton sx={{ color: 'white' }}>
                <MenuOutlined />
                Menu
            </IconButton> */}
        </Box>
      </Box>
    </Box>
  )
}

export default Navbar
