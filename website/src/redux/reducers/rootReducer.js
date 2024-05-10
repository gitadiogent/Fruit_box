import { combineReducers } from "redux";

import cartReducer from "./cartReducer";
import wishlistReducer from "./wishlistReducer";
import shopReducers from "./shopReducers";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  cartReducer,
  wishlistReducer,
  shopReducers,
  userReducer
});

export default rootReducer;
