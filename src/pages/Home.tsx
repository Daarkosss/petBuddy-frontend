import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Header } from "../components/Header";
import { getCookie } from 'typescript-cookie';
import store from '../store/RootStore';

const Home = () => {
  const [message, setMessage] = useState<string>('Loading...');

  
  useEffect(() => {
    const getXsrfTokenAndGetHomeInfo = async () => {
      try {
        await api.getXsrfToken()
        
        let xsrf = getCookie("XSRF-TOKEN")!
        store.setXsrfToken(xsrf)
        console.log("xsrf token: " + getCookie("XSRF-TOKEN")!)

        const response = await api.getTestMessage();
        setMessage(response);

      } catch(error) {
        console.log(error)
      }
    }
    getXsrfTokenAndGetHomeInfo();
  }, [])  

  
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