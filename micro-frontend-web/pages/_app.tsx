// pages/_app.tsx
import { Container } from "react-bootstrap";
import { Provider } from "../context"; // Đường dẫn chính xác đến provider của bạn
import { ToastProvider } from "react-toast-notifications";
import { AppProps } from "next/app";
import TopHeading from "../components/shared/TopHeading"; // Đường dẫn chính xác đến component
import "bootstrap/dist/css/bootstrap.min.css"; // CSS Bootstrap
import "../styles/globals.css"; // CSS toàn cục
import Footer from "../components/shared/Footer"; // Đường dẫn chính xác đến footer

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <ToastProvider>
        <Container>
          <TopHeading />
          <Component {...pageProps} />
          <Footer />
        </Container>
      </ToastProvider>
    </Provider>
  );
}

export default MyApp;
