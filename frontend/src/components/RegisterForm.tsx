import { Navigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { useRegister } from '@services/authenticationService';

import { Button } from '@components/shared/Button';
import { LabeledInput } from '@components/shared/LabeledInput';
import { Loading } from '@components/shared/Loading';

import './RegisterForm.scss';
import { AxiosError } from 'axios';
import { NewUser } from '@types';

// interface Values {
//   firstname: string;
//   lastname: string;
//   email: string;
//   password: string;
// }

type CustomResponseError = {
  response: AxiosError & {
    data: {
      error: string;
    };
  };
};

export function RegisterForm() {
  const registerUser = useRegister();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  function handleSubmit(newUser: NewUser) {
    registerUser.mutate(newUser, {
      onSuccess: () => {
        // TODO Make fancy animation
      },
    });
  }

  if (registerUser.isSuccess) {
    console.log('registerUser.isSuccess');
    return <Navigate to="/profile" replace={true} />;
  }

  return (
    <Formik
      initialValues={{ email: '', password: '', firstName: '', lastName: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className='register-form'>
          <Field
            as={LabeledInput}
            label="Firstname"
            type="text"
            name="firstName"
            autoComplete="true"
            data-test="firstname-input"
          />
          {errors.firstName && touched.firstName && (
            <p data-test="error-message" className="input-error">
              {errors.firstName}
            </p>
          )}
          <Field
            as={LabeledInput}
            label="Lastname"
            type="text"
            name="lastName"
            autoComplete="true"
            data-test="lastname-input"
          />
          {errors.lastName && touched.lastName && (
            <p data-test="error-message" className="input-error">
              {errors.lastName}
            </p>
          )}
          <Field
            as={LabeledInput}
            label="Email"
            type="email"
            name="email"
            autoComplete="true"
            data-test="email-input"
          />
          {errors.email && touched.email && (
            <p data-test="error-message" className="input-error">
              {errors.email}
            </p>
          )}
          <Field
            as={LabeledInput}
            label="Password"
            type="password"
            name="password"
            data-test="password-input"
          />
          {errors.password && touched.password && (
            <p data-test="error-message" className="input-error">
              {errors.password}
            </p>
          )}
          <Button data-test="register-button" variant="primary" type="submit">
            Register
          </Button>
          {registerUser.isError && (
            <p data-test="error-message">
              {
                (registerUser.error as unknown as CustomResponseError).response
                  .data.error
              }
            </p>
          )}
          {registerUser.isPending && <Loading />}
        </Form>
      )}
    </Formik>
  );
}
