import React, { useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css'

const PaymentForm = () => {
  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: 123,
    name: '',
    focus: '123',
  });

  let user = JSON.parse(localStorage.getItem("user"));

//   const handleInputChange = (evt) => {
//     const { name, value } = evt.target;
    
//     setState((prev) => ({ ...prev, [name]: value }));
//   }

//   const handleInputFocus = (evt) => {
//     setState((prev) => ({ ...prev, focus: evt.target.name }));
//   }


  return (
    <div >
      <Cards
        number={user._id}
        expiry="12/24"
        cvc={user.balance}
        name={user.name.toUpperCase()}
        focused={state.focus}
      />
    </div>
  );
}

export default PaymentForm;