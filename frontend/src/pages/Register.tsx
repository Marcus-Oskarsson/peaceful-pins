import { RegisterForm } from '@components/RegisterForm';
import './Register.scss';
import { Link } from 'react-router-dom';

export function Register() {
  return (
    <div className="register">
      <h1>Register a new account</h1>
      <RegisterForm />
      <p className="tooltip">
        Already a member?
        <Link to="/login">
          <span className="link"> Sign in here</span>
        </Link>
      </p>
    </div>
  );
}

export default Register;
