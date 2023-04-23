import React from "react";
import {useNavigate} from 'react-router-dom'
import { Box, Typography, Button, TextField, IconButton} from "@mui/material";
import {useFormik} from "formik"
import * as yup from "yup"
import { ConstructionOutlined, LunchDiningOutlined} from "@mui/icons-material";
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

function SignUp({ setUser }) {
    const navigate = useNavigate()

    const formSchema = yup.object().shape({
        email: yup
        .string()
        .email("Invalid email")
        .required('required'),
        password: yup
        .string()
        .required('required')
        .min(10, 'Password must be 10 characters long')
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase letter')
        .matches(/[A-Z]/, 'Password requires an uppercase letter')
        .matches(/[^\w]/, 'Password requires a symbol'),
        password_confirmation: yup
        .string()
        .required('required')
        .oneOf([yup.ref('password'), null], 'Must match "password" field value'),
        first_name: yup
        .string()
        .required('required'),
        last_name: yup
        .string()
        .required('required'),
        dob: yup
        .date()
        .max(new Date(Date.now() - 567648000000), "You must be at least 18 years")
        .required('required')
    })

    const formik = useFormik({
        initialValues: {
        email: "",
        password: "",
        password_confirmation: "",
        first_name: "",
        last_name: "",
        dob: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((r) => {
                if (r.ok) {
                    r.json().then((user) => console.log(user));
                }
            });
            navigate('/login')
        },
    });

    // const [show, setShow] = useState(false)

    // const handleShow = () => {
    //     setShow(!show)
    // }

  return (
    <Box mt="5%" >
        <form onSubmit={formik.handleSubmit}>
            <Box display="flex" flexDirection={"column"}
            maxWidth="400px" alignItems="center"
            justifyContent={"center"} margin="auto"
            marginTop={5} padding={3}
            borderRadius={5} boxShadow={"5px 5px 10px #ccc"}
            sx={{
                ":hover": {
                    boxShadow: "20px 20px 40px #ccc"
                },
            }}
            >
                <Typography variant="h2" padding={3} textAlign={"center"} fontWeight={"bold"}>
                    Sign Up
                </Typography>
                <TextField
                    margin="normal"
                    variant="standard"
                    placeholder="Email Address"
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="off"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />

                <Typography sx={{color: "red"}}>{formik.errors.email}</Typography>

                <TextField
                    margin="normal"
                    variant="standard"
                    placeholder="Password"
                    type={"password"}
                    id="password"
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    // endAdornment={
                    //     <InputAdornment position="end">
                    //       <IconButton
                    //         aria-label="toggle password visibility"
                    //         onClick={handleShow}
                    //       >
                    //         {show ? <VisibilityOff /> : <Visibility />}
                    //       </IconButton>
                    //     </InputAdornment>
                    // }
                />
                <Typography sx={{color: "red"}}>{formik.errors.password}</Typography>

                <TextField
                    margin="normal"
                    variant="standard"
                    placeholder="Password Confirmation"
                    type="password"
                    id="password_confirmation"
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                />
                <Typography sx={{color: "red"}}>{formik.errors.password_confirmation}</Typography>

                <TextField
                    margin="normal"
                    variant="standard"
                    placeholder="First Name"
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                />
                <Typography sx={{color: "red"}}>{formik.errors.first_name}</Typography>

                <TextField
                    margin="normal"
                    variant="standard"
                    placeholder="Last Name"
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                />
                <Typography sx={{color: "red"}}>{formik.errors.last_name}</Typography>

                <TextField
                    margin="normal"
                    variant="standard"
                    placeholder="Date of Birth"
                    type="date"
                    name="dob"
                    id="dob"
                    value={formik.values.dob}
                    onChange={formik.handleChange}
                />
                <Typography sx={{color: "red"}}>{formik.errors.dob}</Typography>

                <Button
                sx={{ marginTop: 3, borderRadius: 3}}
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    <IconButton
                    sx={{ '&:hover': {color: "yellow", transition: "1s", textDecoration: ""}, color:"white"}}
                    >
                        <LunchDiningOutlined />
                        Flat Burger In
                    </IconButton>
                </Button>

            </Box>

        </form>
    </Box>
  )
}

export default SignUp
