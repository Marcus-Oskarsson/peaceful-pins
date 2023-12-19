import { Formik, Form, Field } from 'formik';
import { LabeledInput } from './shared/LabeledInput';
import { Button } from './shared/Button';
import { Loading } from './shared/Loading';

import { useAddPost } from '@services/messageService';

import { newPost } from '@types';

// TODO måste lyfta ut state till context / parent eller nån session-storage
// Just nu försvinner det om man stänger modalen

import React, { createContext, useContext, useEffect, useState } from 'react';
import { use } from 'chai';

// // Skapa en ny Context
// const FormValuesContext = createContext(null);

// // Skapa en Provider-komponent
// export function FormValuesProvider({ children }) {
//   const [formValues, setFormValues] = useState({
//     title: '',
//     content: '',
//     visibility: 'friends',
//     image: null,
//   });

//   return (
//     <FormValuesContext.Provider value={{ formValues, setFormValues }}>
//       {children}
//     </FormValuesContext.Provider>
//   );
// }

// // Skapa en anpassad hook för att använda formvärdena
// export function useFormValues() {
//   return useContext(FormValuesContext);
// }

// -----------------------------

// import { useFormValues } from './FormValuesContext';

// function MyForm() {
//   const { formValues, setFormValues } = useFormValues();

//   return (
//     <Formik
//       initialValues={formValues}
//       onSubmit={(values) => {
//         // Uppdatera formValues i Context när formuläret skickas
//         setFormValues(values);
//         // ...
//       }}
//     >
//       {/* ... */}
//     </Formik>
//   );
// }

interface CreatePostModalProps {
  closeModal: () => void;
}

export function CreatePostModal({ closeModal }: CreatePostModalProps) {
  const newMessage = useAddPost();
  const [location, setLocation] = useState({});

  // get geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  console.log(location);
  // plot location on map
  

  // TODO add geolocation to post

  function handleSubmit(values: newPost) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("visibility", values.visibility);
    if (values.image) {
      formData.append("image", values.image);
    }
    newMessage.mutate(formData, {
      onSuccess: () => {
        // TODO Make fancy animation
      },
    });
  }

  return (
    <Formik
      initialValues={{
        title: '',
        content: '',
        visibility: 'friends',
        image: null,
      }}
      onSubmit={handleSubmit}
    >
      {() => (
        // {({ errors, touched }) => (
        <>
          <button onClick={closeModal}>Close</button>
          <Form className="login-form">
            <Field
              as={LabeledInput}
              label="Title"
              type="title"
              name="title"
              data-test="title-input"
            />
            {/* <Field
            as={LabeledInput}
            label="Content"
            type="content"
            name="content"
            required
            data-test="content-input"
          /> */}
          <Field
            as="textarea"
            name="content"
            id="content"
            placeholder="Content"
            required
            data-test="content-input"
            rows={5}
          >
          </Field>
            {/* <Field>
            <label htmlFor="isPublic"></label> */}
            {/* TODO make custom toggler */}
            {/* <input type="checkbox" id="isPublic" name="isPublic" /> */}
            {/* </Field> */}
            {/* <Field
              name="image"
              id="image"
              render={({ field }: { field: FieldInputProps<unknown> }) => (
                <input
                  type="file"
                  onChange={(event) => {
                    if (!event.currentTarget.files) {
                      return;
                    }
                    const file = event.currentTarget.files[0];
                    const reader = new FileReader();

                    reader.onload = () => {
                      field.onChange({
                        target: { name: field.name, value: file },
                      });
                    };

                    reader.readAsDataURL(file);
                  }}
                />
              )}
            >
              <label htmlFor="image">Add image to message</label>
            </Field> */}
            <Field name="image">{({field, form, meta}) => (
              <input
                type="file"
                onChange={(event) => {
                  if (!event.currentTarget.files) {
                    return;
                  }
                  const file = event.currentTarget.files[0];
                  const reader = new FileReader();

                  reader.onload = () => {
                    field.onChange({
                      target: { name: field.name, value: file },
                    });
                  };

                  reader.readAsDataURL(file);
                }}
              />
            )}
            </Field>
            <Button
              className="btn-login"
              data-test="login-button"
              variant="success"
              type="submit"
              size="small"
            >
              Send
            </Button>
            {newMessage.isPending && <Loading />}
          </Form>
        </>
      )}
    </Formik>
  );
}
