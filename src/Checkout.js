import React from 'react'
import './Checkout.css';
import CurrencyFormat from 'react-currency-format';
import Subtotal from './Subtotal';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';

function Checkout() {
  const [{basket, user},dispatch]= useStateValue();
  return (
    <div className='checkout'>
        <div className='checkout_left'>
            <img className="checkout_ad" src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"/>
            <div className='checkout_title'>
              <h3>Hello, {user?.email}</h3>
                <h1>Your basket is here</h1>
                {basket.map(item=>(
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
        <div className='checkout_right'>
            <Subtotal/>
        </div>
    </div>
  )
}

export default Checkout