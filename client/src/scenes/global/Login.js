import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import { Box, Typography, Button, TextField, IconButton } from "@mui/material";

function Login({handleLogin}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [show, setShow] = useState(false)
    // const [isOpen, setIsOpen] = useState(false);
    // const handleShow = () => {
    //     setShow(!show)
    //   }
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }).then((r) => {
            if (r.ok) {
                r.json().then((user) => {
                    console.log(user)
                    handleLogin(user) })

                navigate('/')
            }
            // else {
            //     toggleModal()
            // }
        });
    }

  return (
    <Box mt="8%">
        <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection={"column"}
            maxWidth="400px" alignItems="center"
            justifyContent={"center"} margin="auto"
            marginTop={5} padding={3}
            borderRadius={5} boxShadow={"5px 5px 10px #ccc"}
            sx={{
                ":hover": {
                    boxShadow: "10px 10px 20px #ccc"
                },
            }}
            >
                <Typography variant="h2" padding={3} textAlign={"center"} fontWeight={"bold"}>
                    Log In
                </Typography>
                <TextField
                    margin="normal"
                    variant="outlined"
                    placeholder="Email"
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="normal"
                    variant="outlined"
                    placeholder="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                sx={{ marginTop: 3, borderRadius: 3}}
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    <IconButton

                    sx={{ '&:hover': {color: "yellow", transition: "1s", textDecoration: ""}, color:"white"}}
                    >Flat Burger In</IconButton>
                </Button>
                <Button
                    sx={{ marginTop: 3, borderRadius: 3}}
                    onClick={()=> navigate('/signup')}

                >
                    <Typography color={"blue"}>Sign Up</Typography>
                </Button>
            </Box>

        </form>
    </Box>
  )
}

export default Login
