import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from 'react-router-dom';
import { Header } from "../components/Header";
import { Button } from "react-bootstrap";

const Home = () => {
  const [message, setMessage] = useState<string>('Loading...');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        // const response = await api.getTestMessage();
        // setMessage(response);
      } catch (error) {
        setMessage('Failed to fetch message');
      }
    }

    fetchMessage();
  }, []);
  
  return (
    <div>
      <Header />
      <div className="home-container">
        <h1>Welcome home, message from backend: {message}</h1>
        <Button variant="outline-light" onClick={() => api.getTestMessage()}>Request message</Button>
        <Button variant="outline-info" onClick={() => api.getXsrfToken()}>Fetch xsrf token</Button>
        <Button variant="info" onClick={() => navigate('/caretaker/form')}>Change caretaker info</Button>
      </div>
    </div>
  )
}

export default Home;