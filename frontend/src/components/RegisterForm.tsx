import { Button } from '@components/shared/Button';
import { LabeledInput } from '@components/shared/LabeledInput';

export function RegisterForm() {
  return (
    <div>
      <h1>Register</h1>
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
      <Button variant="primary">Register</Button>
    </div>
  );
}

// import { useUser } from '@hooks';

// type RegisterUser = {
//   email: string;
//   firstName: string;
//   lastName: string;
//   password: string;
// };

// type inputError = string | null;

// export function RegisterForm() {
//   const [registerUser, setRegisterUser] = useState<RegisterUser>({
//     email: '',
//     firstName: '',
//     lastName: '',
//     password: '',
//   });
//   const [emailError, setEmailError] = useState<inputError>(null);
//   const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
//   const { useRegister } = useUser();
//   const { mutate, data, isSuccess } = useRegister();

//   function validateEmail(email: RegisterUser['email']) {
//     // Hämtade regex från https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript
//     const emailRegex =
//       /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//     if (!emailRegex.test(email)) {
//       setEmailError('Please enter a valid email address.');
//       return;
//     }
//     setEmailError(null);
//   }

//   function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const email = e.target.value;
//     setRegisterUser({ ...registerUser, email });
//     if (hasSubmitted) {
//       validateEmail(email);
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setHasSubmitted(true);
//     mutate(registerUser);
//   }

//   function readyToSubmit() {
//     return (
//       !emailError &&
//       registerUser.email.length > 0 &&
//       registerUser.password.length >= 4 &&
//       registerUser.firstName.length > 0 &&
//       registerUser.lastName.length > 0
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
//         value={registerUser.email}
//         onChange={handleEmailChange}
//         placeholder="Enter your email address"
//       />
//       {emailError && hasSubmitted && <p>{emailError}</p>}
//       <LabeledInput
//         label={'Password'}
//         type="password"
//         value={registerUser.password}
//         minLength={4}
//         onChange={(e) =>
//           setRegisterUser({ ...registerUser, password: e.target.value })
//         }
//         title="Password must be at least 12 characters long."
//         placeholder="12 characters or more"
//       />
//       <LabeledInput
//         label={'First Name'}
//         type="text"
//         value={registerUser.firstName}
//         minLength={1}
//         onChange={(e) =>
//           setRegisterUser({ ...registerUser, firstName: e.target.value })
//         }
//         placeholder="First name"
//       />
//       <LabeledInput
//         label={'Last Name'}
//         type="text"
//         value={registerUser.lastName}
//         minLength={1}
//         onChange={(e) =>
//           setRegisterUser({ ...registerUser, lastName: e.target.value })
//         }
//         placeholder="Last name"
//       />
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

// export default RegisterForm;
