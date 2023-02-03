const initialState = {
  loading: false,
  cartItems: [],
};

export const rootReduceer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;

    case "addToCart":
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );

      console.log(itemIndex);
      if (itemIndex >= 0) {
        return {
          ...state,
          cartItems: [
            ...(state.cartItems[itemIndex].quantity += 1),
            action.payload,
          ],
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      }

    case "updateCart":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "deleteFromCart":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item._id !== action.payload._id
        ),
      };

    case "showLoading": {
      return {
        ...state,
        loading: true,
      };
    }

    case "hideLoading": {
      return {
        ...state,
        loading: false,
      };
    }

    case "emptyCart": {
      return initialState;
    }
  }
};
