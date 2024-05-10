import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "../redux/store";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "react-scroll-to-top";

import "../styles/styles.scss";
import Loading from "../components/Other/Loading";
import withReduxStore from "../common/with-redux-store";
import "react-multi-carousel/lib/styles.css";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { darkPrimaryColor, primaryColor } from "../../config";

const App = ({ Component, pageProps, reduxStore }) => {
  // PLEASE REMOVE CONSOLE.LOG WHEN YOU ARE IN DEVELOPMENT
  console.log = () => {};
  // PLEASE REMOVE CONSOLE.LOG WHEN YOU ARE IN DEVELOPMENT

  const theme = createTheme({
    palette: {
      primary: {
        main: primaryColor,
        dark: darkPrimaryColor,
      },
    },
  });

  return (
    <Provider store={reduxStore}>
      <ThemeProvider theme={theme}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <Component {...pageProps} />
          <ToastContainer position="bottom-left" autoClose={3000} />
          <ScrollToTop
            smooth
            component={<i className="fal fa-arrow-to-top" />}
            style={{
              backgroundColor: "#f7f5f4",
              borderRadius: "999px",
              height: "50px",
              width: "50px",
            }}
          />
        </PersistGate>
      </ThemeProvider>
    </Provider>
  );
};

export default withReduxStore(App);
