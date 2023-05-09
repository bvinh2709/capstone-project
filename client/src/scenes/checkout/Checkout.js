import React, {useState} from 'react'
import { Box, Button, Stepper, Step, StepLabel } from '@mui/material'
import {Formik} from "formik"
import * as yup from "yup"
import { shades } from '../../theme'
import Shipping from "./Shipping"
import Payment from "./Payment"
// import { loadStripe } from "@stripe/stripe-js"

// import { useNavigate } from 'react-router'

// const stripePromise = loadStripe(
//   "pk_test_51MzBCeHMeLOzkmO2oquNeE2qRlVVPRv7qkZlN9OckRbm1gPUnPOUM50f2HSlcCGS66lLwMiqoIBgQWvR6WCgNxBY00WW1shy8y"
// )

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

function Checkout() {
  const [activeStep, setActiveStep] = useState(0)
  const isFirstStep = activeStep === 0
  const isSecondStep = activeStep === 1
  // const navigate = useNavigate()
  const handleFormSubmit = async (values, actions) => {
    setActiveStep(activeStep + 1)

    if (isFirstStep && values.shippingAddress.isSameAddress) {
      actions.setFieldValue("ShippingAddress", {
        ...values.billingAddress,
        isSameAddress: true,
      })
    }

    actions.setTouched({})
  }

  const handlePaymentResponse = (response) => {
    if (response.status === 'succeeded') {
      // Payment succeeded
      console.log('Payment succeeded');
      // Perform any additional actions, such as updating the order status on the frontend
      // You can redirect the user to a success page or show a success message
    } else if (response.status === 'failed') {
      // Payment failed
      console.log('Payment failed');
      // Handle the failed payment scenario
      // You can redirect the user to a failure page or show an error message
    } else {
      // Payment status unknown or other scenarios
      console.log('Payment status unknown');
      // Handle the unknown or other payment scenarios
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    // Simulate a payment response
    const paymentResponse = {
      status: 'succeeded', // Replace this with the actual payment status received from your backend
    };
    handlePaymentResponse(paymentResponse);
  };


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
                handlePaymentResponse={handlePaymentResponse}
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
                  >
                    Next
                    </Button>

                ) : (

                  <form
                  // onSubmit={handlePaymentSubmit}
                  action="/create-checkout-session"
                  method="POST"
                  headers="Content-Type"
                  >
                  <Button
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


