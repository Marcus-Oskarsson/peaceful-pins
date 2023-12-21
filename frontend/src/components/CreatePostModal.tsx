import { Formik, Form, Field, FieldInputProps } from 'formik';
import { LabeledInput } from './shared/LabeledInput';
import { Button } from './shared/Button';
import { Loading } from './shared/Loading';

import { useAddPost } from '@services/messageService';

import { newPost } from '@types';
import { useEffect, useState } from 'react';
import { number } from 'yup';

// TODO måste lyfta ut state till context / parent eller nån session-storage
// Just nu försvinner det om man stänger modalen

interface CreatePostModalProps {
  closeModal: () => void;
}

export function CreatePostModal({ closeModal }: CreatePostModalProps) {
  const newMessage = useAddPost();
  const [location, setLocation] = useState<{latitude: number, longitude: number}>({});

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
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('visibility', values.visibility);
    if (values.image) {
      formData.append('image', values.image);
    }
    formData.append('coordinates', JSON.stringify(location));
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
            <Field
              as="textarea"
              name="content"
              id="content"
              placeholder="Content"
              required
              data-test="content-input"
              rows={5}
            />
            <div>
                <label htmlFor="friends">Friends</label>
                <Field type="radio" name="visibility" id="friends" value="friends" />
                <label htmlFor="public">Public</label>
                <Field type="radio" name="visibility" id="public" value="public" />
            </div>
            <Field name="image">
              {({
                field,
              }: {
                field: FieldInputProps<{ image: File | null }>;
              }) => (
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
