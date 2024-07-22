import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Header } from "../components/Header";

const Home = () => {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await api.getTestMessage();
        setMessage(response);
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
      </div>
    </div>
  )
}

export default Home;