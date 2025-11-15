import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  increaseQuantity,
  decreaseQuantity,
  removeItem,
} from '@/redux/features/cartSlice'; // Adjust the path as necessary
import { Plus, Minus, Trash2, ArrowUpRight } from 'lucide-react';

function CartRow({ item, isLast }) {
  const dispatch = useDispatch();

  // Calculate Subtotal for the item
  const itemSubtotal = (item.price * item.quantity).toFixed(2);

  // Handlers for Redux actions
  const handleIncrease = (id) => dispatch(increaseQuantity(id));
  const handleDecrease = (id) => dispatch(decreaseQuantity(id));
  const handleRemove = (id) => dispatch(removeItem(id));

  return (
    <div
      className={`grid grid-cols-5 items-center py-4 text-sm text-gray-700 ${
        !isLast ? 'border-b border-gray-200' : ''
      }`}
    >
      {/* Product (Column 1) */}
      <div className="col-span-1 flex items-center pr-2">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.title}
          className="h-16 w-16 rounded-md object-cover mr-4"
        />
        <span className="font-medium text-gray-800">{item.title}</span>
      </div>

      {/* Price (Column 2) */}
      <div className="col-span-1 text-center font-medium">${item.price.toFixed(2)}</div>

      {/* Quantity (Column 3) */}
      <div className="col-span-1 flex justify-center">
        <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
          <button
            onClick={() => handleDecrease(item.id)}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="font-medium">{item.quantity}</span>
          <button
            onClick={() => handleIncrease(item.id)}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Subtotal (Column 4) */}
      <div className="col-span-1 text-center font-bold text-gray-900">${itemSubtotal}</div>

      {/* Actions (Column 5) */}
      <div className="col-span-1 flex justify-center">
        <button
          onClick={() => handleRemove(item.id)}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          title="Remove Item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}


export function CartPage() {
  const { cartItems } = useSelector((state:any) => state.cart);

  // Calculate the total subtotal for the entire cart
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalAmount = cartSubtotal.toFixed(2); // Assuming Total = Subtotal for simplicity
  const accentColor = 'bg-supperagent';

  const EmptyCart = (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-gray-500 mb-6 text-lg">You Cart is Empty</p>
      <RouterNavLink
        to="/courses"
        className="flex items-center space-x-2 border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded-md"
      >
        <span>Explore Products!</span>
        <ArrowUpRight size={16} />
      </RouterNavLink>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* === Left Side: Cart Items Table === */}
        <div className="w-full lg:w-2/3">
          
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 py-3 px-4 text-sm font-semibold  rounded-t-lg bg-supperagent text-white"
          >
            <div className="col-span-1">Product</div>
            <div className="col-span-1 text-center">Price</div>
            <div className="col-span-1 text-center">Quantity</div>
            <div className="col-span-1 text-center">Subtotal</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>
          
          {/* Cart Content */}
          <div className="bg-white shadow-md rounded-b-lg p-4">
            {cartItems.length === 0 ? (
              EmptyCart
            ) : (
              <div>
                {cartItems.map((item, index) => (
  <CartRow
    key={item.id}
    item={item}
    isLast={index === cartItems.length - 1}
  />
))}

              </div>
            )}
          </div>
        </div>

        {/* === Right Side: Cart Total Summary === */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 shadow-xl rounded-lg border border-gray-200 sticky top-4">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Cart Total</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-600">Sub Total</span>
                <span className="font-semibold text-gray-800">${totalAmount}</span>
              </div>
              
              <div className="flex justify-between pt-1">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-gray-900">${totalAmount}</span>
              </div>
            </div>

            <RouterNavLink
              to="#"
              className={`mt-8 w-full block text-center rounded-md ${accentColor} px-6 py-3 text-lg font-medium text-white hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
            >
              <span>Proceed to Checkout</span>
              <ArrowUpRight size={20} />
            </RouterNavLink>
          </div>
        </div>
        
      </div>
    </div>
  );
}