import React from 'react'
import './Payment.css';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link, useNavigate } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';
import { CardElement, useElements } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import instance from './axios';
import { db } from './firebase';
//import { PaymentIntent } from '@stripe/stripe-js';

function Payment(){
    const [{ basket, user }, dispatch] = useStateValue();

    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);

    const [succeeded, setSucceeded]= useState(false);
    const [processing, setProcessing]= useState("");
    const [clientSecret, setClientSecret] = useState("");

    useEffect(()=>{
        // Generate the special stripe secret which allows us to change a customer
        const getClientSecret = async ()=>{
            const response = await instance({
                method: 'post',
                // Stripe expects the total in a currencies subunits
                url:`/payments/create?total=${getBasketTotal(basket)*100}`,

            })
            setClientSecret(response.data.clientSecret);
        }

        getClientSecret();
    }, [basket])
    
    console.log('the secret is >>>',clientSecret);
    console.log('USERS',user);
   
    const navigate= useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret,{
            payment_method:{
                card: elements?.getElement(CardElement)
            }
        }).then(({paymentIntent})=>{
            db.collection('users')
            .doc(user?.uid)
            .collection('orders')
            .doc(paymentIntent.id)
            .set({
                basket:basket,
                amount:paymentIntent.amount,
                created: paymentIntent.created
            })
           
            setSucceeded(true);
            setError(null);
            setProcessing(false);
            
            dispatch({
                type:'EMPTY_BASKET'
            });

            navigate('/orders');
        })
    }

    const handleChange = e => {
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    }

    return (
        <div className='payment'>
            <div className='payment_container'>
                <h1>
                    Checkout {
                        <Link to='/checkout'>({basket?.length} items)</Link>
                    }
                </h1>
                <div className='payment_section'>
                    <div className='payment_title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className='payment_address'>
                        <p>{user?.email}</p>
                        <p>Mohalla Katoratal, Kashipur</p>
                        <p>Uttarakhand</p>
                    </div>
                </div>

                <div className='payment_section'>
                    <div className='payment_title'>
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className='payment_items'>
                        {basket.map(item => (
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </div>

                <div className='payment_section'>
                    <div className='payment_title'>
                        <h3>Payment Method</h3>
                    </div>

                    <div className='payment_details'>
                        <form onSubmit={handleSubmit} >
                            <CardElement onChange={handleChange} />

                            <div className='payment_priceContainer'>
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <>
                                            <h3>
                                               Order Total:{value}  
                                            </h3>
                                        </>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)} // Part of the homework
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded }>
                                    <span>{processing ? <p>Processing</p>: "Buy now" }</span>
                                </button>
                            </div>
                            {error && <div>{error}</div>}
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Payment