import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Auth from "./components/Auth";
import Layout from "./components/Layout";
import Notification from "./Notification";
import { uiActions } from "./store/ui-slice";
let isFirstRender = true;

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false;
      return;
    }
    const sendRequest = async () => {
      dispatch(
        uiActions.showNotification({
          open: true,
          message: "Send Request",
          type: "warning",
        })
      );
      const res = await fetch(
        "https://redux-http-cb951-default-rtdb.firebaseio.com/cartItems.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );
      const data = await res.json();
      dispatch(
        uiActions.showNotification({
          message: "Sent Request To Database Successfully",
          open: true,
          type: "success",
        })
      );
    };
    sendRequest().catch((err) => {
      dispatch(
        uiActions.showNotification({
          open: true,
          message: "Sending message Failed",
          type: "error",
        })
      );
    });
  }, [cart]);
  return (
    <div className="App">
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}
      {!isLoggedIn && <Auth />}
      {isLoggedIn && <Layout />}
    </div>
  );
}

export default App;
