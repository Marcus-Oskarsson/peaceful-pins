import { LoginForm } from '@components/LoginForm';
import './Login.scss';
import { Link } from 'react-router-dom';

export function Login() {
  return (
    <div className='login'>
      <h1 className='title'>Login</h1>
      <LoginForm />
      
      <p className='tooltip'>
        Don't have an account? 
        <Link to="/register">
          <span className='link'> Register a new account</span>
        </Link>
      </p>
    </div>
  );
}
