import React, {useState} from 'react'
import { Box, Button, Stepper, Step, StepLabel } from '@mui/material'
import {Formik} from "formik"
import * as yup from "yup"
import { shades } from '../../theme'
import Shipping from "./Shipping"
import Payment from "./Payment"
import { loadStripe } from "@stripe/stripe-js"
import { useNavigate } from 'react-router'

const stripePromise = loadStripe(
  "pk_test_51MzBCeHMeLOzkmO2oquNeE2qRlVVPRv7qkZlN9OckRbm1gPUnPOUM50f2HSlcCGS66lLwMiqoIBgQWvR6WCgNxBY00WW1shy8y"
)

const initialValues = {
  billingAddress: {
    firstName: "",
    lastName: "",
    country: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
  },
  shippingAddress: {
    isSameAddress: true,
    firstName: "",
    lastName: "",
    country: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
  },
  email: "",
  phoneNumber: "",
}

const checkoutSchema = [
  yup.object().shape({
    billingAddress: yup.object().shape({
      firstName: yup.string().required('Please enter your first name'),
      lastName: yup.string().required('Please enter your last name'),
      country: yup.string().required('Please verify the country that you are currently from'),
      street1: yup.string().required('Street address cannot be empty'),
      street2: yup.string(),
      city: yup.string().required('City cannot be empty'),
      state: yup.string().required('State cannot be empty'),
      zipCode: yup.string().required('Zip code cannot be empty'),
    }),
    shippingAddress: yup.object().shape({
      isSameAddress: yup.boolean(),
      firstName: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required('Please enter your first name')}),
      lastName: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required('Please enter your last name')}),
      country: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required('Please verify the country that you are currently from')}),
      street1: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required('Street address cannot be empty')}),
      street2: yup.string(),
      city: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required('City cannot be empty')}),
      state: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required('State cannot be empty')}),
      zipCode: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required('Zip code cannot be empty')}),
    }),
  }),
  yup.object().shape({
    email: yup.string().required('required'),
    phoneNumber: yup.string().required('required')
  })
]

function Checkout({cartItems, user}) {

  const [activeStep, setActiveStep] = useState(0)
  const isFirstStep = activeStep === 0
  const isSecondStep = activeStep === 1
  const navigate = useNavigate()
  const handleFormSubmit = async (values, actions) => {
    setActiveStep(activeStep + 1)

    if (isFirstStep && values.shippingAddress.isSameAddress) {
      actions.setFieldValue("ShippingAddress", {
        ...values.billingAddress,
        isSameAddress: true,
      })
    }

    if (isSecondStep) {
      makePayment(values)
    }

    actions.setTouched({})
  }

  async function makePayment(values) {
    const stripe = await stripePromise
    const requestBody = {
      userName: [values.firstName, values.lastName].join(' '),
      email: values.email,
      products: cartItems.map(( {id, count }) => ({
        id,
        count,
      }))
    }

    const response = await fetch('/orders', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    })
    const session = await response.json()
    await stripe.redirectToCheckout({
      sessionId: session['user_id'],
    })
  }

  return (
    <Box width="80%" m="100px auto">
      <Stepper activeStep={activeStep} sx={{ m: "20px 0"}}>
        <Step>
          <StepLabel>Billing</StepLabel>
        </Step>
        <Step>
          <StepLabel>Payment</StepLabel>
        </Step>
      </Stepper>
      <Box>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema[activeStep]}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              {isFirstStep && (
                <Shipping
                values={values}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                />
              )}
              {isSecondStep && (
                <Payment
                values={values}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                />
              )}
              <Box display="flex" justifyContent="space-between" gap="50px">
                {!isFirstStep && (
                  <Button
                    width='100%'
                    color="primary"
                    varian="contained"
                    sx={{
                      backgroundColor: shades.primary[200],
                      boxShadow: "none",
                      color: "white",
                      borderRadius: 0,
                      padding: "15px 40px"
                    }}
                    onClick={()=> setActiveStep(activeStep - 1)}
                  >
                    Back
                  </Button>
                )}
                {!isSecondStep ? (
                <Button
                    fullWidth
                    type="submit"
                    color="primary"
                    varian="contained"
                    sx={{
                      backgroundColor: shades.primary[400],
                      boxShadow: "none",
                      color: "white",
                      borderRadius: 0,
                      padding: "15px 40px"
                    }}
                    // onClick={()=> setActiveStep(activeStep - 1)}
                  >
                    Next
                    </Button>

                ) : (

                  <form

                  action="/create-checkout-session" method="POST"
                  >
                  <Button
                    // onClick={()=>navigate('/checkout/success')}
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{
                      backgroundColor: shades.primary[400],
                      boxShadow: "none",
                      color: "white",
                      borderRadius: 0,
                      padding: "15px 40px"
                    }}
                  >
                    Place Order
                    </Button>
                  </form>

                )
              }
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  )
}

export default Checkout
