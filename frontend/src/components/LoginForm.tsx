import { Button } from '@components/shared/Button';
import { LabeledInput } from '@components/shared/LabeledInput';

export function LoginForm() {
  return (
    <div>
      <h1>Login</h1>
      <LabeledInput
        label="Email"
        type="email"
        autoComplete="true"
        placeholder="Enter your email address"
      />
      <LabeledInput
        label="Password"
        type="password"
        minLength={4}
        title="Password must be at least 12 characters long."
        placeholder="12 characters or more"
      />
      <Button variant="primary">Login</Button>
    </div>
  );
}

// import { useUser } from '@hooks';

// type LoginUser = {
//   email: string;
//   password: string;
// };

// type inputError = {
//   email?: string | null;
//   password?: string | null;
// };

// export function LoginForm() {
//   const [loginUser, setLoginUser] = useState<LoginUser>({
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState<inputError>({
//     email: null,
//     password: null,
//   });
//   const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
//   const { useLogin } = useUser();
//   const { mutate, data, isSuccess } = useLogin();

//   function validateEmail(email: LoginUser['email']) {
//     // Hämtade regex från https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript
//     const emailRegex =
//       /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//     if (!emailRegex.test(email)) {
//       setErrors({ ...errors, email: 'Please enter a valid email address.' });
//       return;
//     }
//     setErrors({ ...errors, email: null });
//   }

//   function validatePassword(password: LoginUser['password']) {
//     if (password.length < 4) {
//       setErrors({
//         ...errors,
//         password: 'Password must be at least 12 characters long.',
//       });
//       return;
//     }
//     setErrors({ ...errors, password: null });
//   }

//   function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const email = e.target.value;
//     setLoginUser({ ...loginUser, email });
//     if (hasSubmitted) {
//       validateEmail(email);
//     }
//   }

//   function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const password = e.target.value;
//     setLoginUser({ ...loginUser, password });
//     if (hasSubmitted) {
//       validatePassword(password);
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setHasSubmitted(true);
//     mutate(loginUser);
//   }

//   function readyToSubmit() {
//     return (
//       !(errors.email || errors.password) &&
//       loginUser.email.length > 0 &&
//       loginUser.password.length >= 4
//     );
//   }

//   if (isSuccess) {
//     console.log(data);
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <LabeledInput
//         label={'Email'}
//         type="email"
//         autoComplete="true"
//         value={loginUser.email}
//         onChange={handleEmailChange}
//         placeholder="Enter your email address"
//       />
//       {errors.email && hasSubmitted && <p>{errors.email}</p>}
//       <LabeledInput
//         label={'Password'}
//         type="password"
//         value={loginUser.password}
//         minLength={4}
//         onChange={handlePasswordChange}
//         title="Password must be at least 12 characters long."
//         placeholder="12 characters or more"
//       />
//       {errors.password && hasSubmitted && <p>{errors.password}</p>}
//       <Button
//         {...(readyToSubmit()
//           ? { variant: 'primary' }
//           : { variant: 'disabled', disabled: true })}
//       >
//         Login
//       </Button>
//     </form>
//   );
// };
