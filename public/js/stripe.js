/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// const stripe = Stripe(process.env.STRIPE_PUBLICKEY)
const stripe = Stripe('pk_test_Bika5pWBGJfW2m86KOhdlB3H00E5ymyeKH');

export const bookTour = async tourId => {
    try {
        // 1) Getting checkout session from the server / API
        const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
        // console.log('SESSION', session)

        // 2) Creating the checkout form and Charging the credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (err) {
        // showAlert('error', err.response.data.message)
        showAlert('error', err);
    }
}

