import { Navigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { useLogin } from '@services/authenticationService';
import { useUserContext } from '@contexts/UserContext';

import { Button } from '@components/shared/Button';
import { LabeledInput } from '@components/shared/LabeledInput';
import { Loading } from '@components/shared/Loading';

import './LoginForm.scss';
import { AxiosError } from 'axios';
import { useEffect } from 'react';

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
  const { setUser } = useUserContext();

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
      },
    });
  }

  useEffect(() => {
    if (loginUser.isSuccess && setUser) {
      setUser(loginUser.data.data.user);
    }
  }, [loginUser.isSuccess, setUser, loginUser.data]);

  if (loginUser.isSuccess) {
    return <Navigate to="/profile" replace={true} />;
  }

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="login-form">
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
          <Button
            className="btn-login"
            data-test="login-button"
            variant="primary"
            type="submit"
            size="small"
          >
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
          {loginUser.isPending && <Loading />}
        </Form>
      )}
    </Formik>
  );
}
