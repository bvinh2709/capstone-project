import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_stripe_public_key');

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/create-checkout-session');
      const { checkout_session_url } = response.data;
      setCheckoutUrl(checkout_session_url);
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: checkout_session_url
      });
      if (result.error) {
        setError(result.error.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {checkoutUrl ? (
        <p>Redirecting to Stripe checkout...</p>
      ) : (
        <button onClick={handleCheckout} disabled={loading}>
          {loading ? 'Loading...' : 'Proceed to Checkout'}
        </button>
      )}
    </div>
  );
};

export default CheckoutPage;
