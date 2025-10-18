import React, { useState } from 'react';

export default function ProductQty({ initial = 1, min = 0 }) {
  const [qty, setQty] = useState(initial);
  return (
    <div className="product-qty">
      <button type="button" className="quantity-left-minus" onClick={() => setQty(qty > min ? qty - 1 : qty)}>-</button>
      <input type="text" id="quantity" value={qty} readOnly />
      <button type="button" className="quantity-right-plus" onClick={() => setQty(qty + 1)}>+</button>
    </div>
  );
}
