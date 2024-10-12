import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import ChatBox from "../components/ChatBox";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>(t("loading"));

  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [shouldStartChat, setShouldStartChat] = useState<boolean>(false);

  useEffect(() => {
    if (!store.user.profile?.selected_profile) {
      navigate("/profile-selection");
    } else {
      handleGetMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetMessage = async () => {
    try {
      const response = await api.getTestMessage();
      setMessage(response);
    } catch (error) {
      setMessage("Failed to fetch message");
    }
  };

  return (
    <div>
      <Header />
      <div className="home-container">
        <h1>
          {t("home.title")} {message}
        </h1>
        <Button variant="outline-dark" onClick={handleGetMessage}>
          {t("home.requestMessage")}
        </Button>
        <Button variant="outline-dark" onClick={() => api.getXsrfToken()}>
          {t("home.fetchToken")}
        </Button>
        <Button variant="dark" onClick={() => navigate("/caretaker/form")}>
          {t("home.changeCaretakerForm")}
        </Button>
        <Button variant="dark" onClick={() => navigate("/caretaker/search")}>
          {t("home.searchCaretakers")}
        </Button>
        <h3>Testowy chat. Wpisz adres email adresata:</h3>
        <input
          type="text"
          value={recipientEmail}
          onChange={(event) => setRecipientEmail(event.target.value)}
        />
        <button onClick={() => setShouldStartChat(true)}>
          Rozpocznij chat
        </button>
        {shouldStartChat && <ChatBox recipientEmail={recipientEmail} />}
      </div>
    </div>
  );
};

export default Home;
