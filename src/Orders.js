import React from 'react';
import './Orders.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { db } from './firebase';
import { useStateValue } from './StateProvider';
import Order from './Order';
import { onSnapshot, collection, orderBy, docs, query } from "@firebase/firestore";

function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      async function getData() {
        const subColRef = collection(db, "users", user?.uid, "orders");
        const temp = await onSnapshot(query(subColRef,orderBy("created","desc")), (snapshot) => (
          setOrders(snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          })))
        ))
        console.log("Orders state",orders);
      }
      getData();
    } else {
      setOrders([]);
    }
  }, [user])

  return (
    <div className='orders'>
      <h1>Your Orders</h1>
      <div className='orders_order'>
        {orders?.map(temp => {
         return  <Order order={temp} />
        })}
      </div>
    </div>
  )
}

export default Orders;







// db.collection('users').doc(user?.uid).collection('orders').orderby('created', 'desc').onSnapshot(snapshot => (
      //     setOrders(snapshot.docs.map(doc => ({
      //       id: doc.id,
      //       data: doc.data()
      //     })
      //     ))
      //   ))
      // function compareData(a,b){
      //   return a.created- b.created;
      // }




      //   console.log(">>>>>>", subColRef,)
      //   const temp2 = await getDocs(subColRef);
      //  console.log(temp2);
      //  const qSnap = getDocs(subColRef);
      //  console.log("QSNAP", qSnap)
      //   console.log(qSnap.docs.map(d => ({id: d.id, d.data()})))
      //   var data = [];
      //   temp2.forEach(doc=>{
      //     data.push(doc.data())
      //   })

      //   console.log(data);