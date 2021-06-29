import "intl";
import "intl/locale-data/jsonp/pt-BR";
import moment from "moment";

import "../styles/globals.css";
import "../styles/animation.css";
import "../styles/input.css";
import "../styles/button.css";
import "../styles/listItem.css";
import "../styles/modal.css";
import "../styles/login.css";
import "../styles/resetPassword.css";
import "../styles/changePassword.css";
import "../styles/contact.css";
import "../styles/main.css";
import "../styles/news.css";
import "../styles/chat.css";

import { storeWrapper } from "../store";
import { AuthProvider } from "../contexts/AuthContext";

moment.updateLocale("pt", {
  months: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
});

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default storeWrapper.withRedux(MyApp);
