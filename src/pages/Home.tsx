import { useEffect, useState } from "react";
import { api } from "../api/api";

const Home = () => {

    const [message, setMessage] = useState<string>('Loading...');

    useEffect(() => {
        const fetchMessage = async () => {
            try {
              const response = await api.getTestMessage();
              console.log('response' + response)
              setMessage(response);
            } catch (error) {
              setMessage('Failed to fetch message');
            }
        }

        fetchMessage();

    }, []);


    return <div>Welcome home with {message}</div>
}

export default Home;