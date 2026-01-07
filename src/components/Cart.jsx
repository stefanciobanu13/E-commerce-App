import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();

  const handleCheckout = () => {
    alert(`Checkout successful! Total: $${getTotal().toFixed(2)}`);
    clearCart();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl text-gray-500 mb-4">Your cart is empty</p>
          <p className="text-gray-400">Start adding some items to your cart!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center border-2 border-cyan-100 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover mr-4 rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                  <p className="text-cyan-600 font-semibold">${item.price}</p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-md">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-red-400 text-white rounded font-bold hover:bg-red-500 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 font-bold text-gray-700 min-w-[40px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-green-400 text-white rounded font-bold hover:bg-green-500 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="ml-6 font-bold text-gray-800 min-w-[80px] text-right">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-gradient-to-r from-cyan-100 to-blue-100 p-6 rounded-xl shadow-lg border-2 border-cyan-200">
            <div className="text-right">
              <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text mb-4">Total: ${getTotal().toFixed(2)}</p>
              <button
                onClick={handleCheckout}
                className="bg-gradient-to-r from-green-400 to-green-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                ✓ Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;