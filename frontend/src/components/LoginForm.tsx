import { Navigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { useLogin } from '@services/authenticationService';

import { Button } from '@components/shared/Button';
import { LabeledInput } from '@components/shared/LabeledInput';
import { Loading } from '@components/shared/Loading';

import './LoginForm.scss';
import { AxiosError } from 'axios';

interface Values {
  email: string;
  password: string;
}

type CustomResponseError = {
  response: AxiosError & {
    data: {
      error: string;
    };
  };
};

export function LoginForm() {
  const loginUser = useLogin();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  function handleSubmit(values: Values) {
    loginUser.mutate(values, {
      onSuccess: () => {
        // TODO Make fancy animation
        return <Navigate to="/profile" />;
      },
    });
  }

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Field
            as={LabeledInput}
            label="Email"
            type="email"
            name="email"
            autoComplete="true"
            // placeholder="Enter your email address"
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
            // placeholder="Enter your password"
            data-test="password-input"
          />
          {errors.password && touched.password && (
            <p data-test="error-message" className="input-error">
              {errors.password}
            </p>
          )}
          <Button data-test="login-button" variant="primary" type="submit">
            Login
          </Button>
          {loginUser.isError && (
            <p data-test="error-message">
              {
                (loginUser.error as unknown as CustomResponseError).response
                  .data.error
              }
            </p>
          )}
          {loginUser.isPending || <Loading />}
        </Form>
      )}
    </Formik>
  );
}
