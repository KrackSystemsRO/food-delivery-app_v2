import { useCart } from "../context/CartContext";

const ProductCard = ({
  product,
  restaurantId,
}: {
  product: any;
  restaurantId: string;
}) => {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      item: {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
      restaurantId,
    });
  };

  return (
    <div className="p-4 border rounded-xl">
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      <button
        onClick={addToCart}
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
};
