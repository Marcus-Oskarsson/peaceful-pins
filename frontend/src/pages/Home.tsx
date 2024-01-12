import { useNavigate } from "react-router-dom";

import { Button } from "@components/shared/Button";
import { useAuthCheck } from '@services/authenticationService'

import './Home.scss';
import background from '@assets/map-mobile.jpeg';

export function Home() {
  const { data } = useAuthCheck();
  const isLoggedIn = data?.success;
  const navigate = useNavigate();

  function handleClick() {
    if (isLoggedIn) {
      navigate('/write');
    } else {
      navigate('/login');
    }
  }

  return (
    <div className="home" style={{ backgroundImage:`url(${background})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center center' }}>
      <h1 className="title">Peaceful Pins</h1>
      <p className="intro-text">
        <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0v-3a1 1 0 0 0-1-1m0-3a1 1 0 1 0 1 1a1 1 0 0 0-1-1m0-6A10 10 0 0 0 2 12a9.89 9.89 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20m0 18H5.41l.93-.93a1 1 0 0 0 .3-.71a1 1 0 0 0-.3-.7A8 8 0 1 1 12 20"></path></svg></span>
        Peaceful Pins is a social media platform that allows you to share your thoughts and feelings with the world. The catch? You can only see posts that are within 200 meters of you.
      </p> 
      <Button onClick={handleClick} className="action-btn" >
        Get started
      </Button>
    </div>
  );
}
