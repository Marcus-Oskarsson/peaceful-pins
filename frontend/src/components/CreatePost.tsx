import { Formik, Form, Field, FieldInputProps } from 'formik';
import { LabeledInput } from './shared/LabeledInput';
import { Button } from './shared/Button';
import { Loading } from './shared/Loading';

import { useAddPost } from '@services/messageService';

import { newPost } from '@types';

import './CreatePost.scss';
import { usePositionContext } from '@contexts/PositionContext';

// TODO måste lyfta ut state till context / parent eller nån session-storage
// Just nu försvinner det om man stänger modalen

export function CreatePost() {
  const newMessage = useAddPost();
  const positionContext = usePositionContext();

  function handleSubmit(values: newPost) {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('visibility', values.visibility);
    if (values.image) {
      formData.append('image', values.image);
    }
    formData.append(
      'coordinates',
      JSON.stringify({
        latitude: positionContext!.latitude,
        longitude: positionContext!.longitude,
      }),
    );
    newMessage.mutate(formData, {
      onSuccess: () => {
        // TODO Make fancy animation
      },
    });
  }

  console.log('positionContext', positionContext);

  if (!positionContext?.latitude || !positionContext?.longitude) {
    if (positionContext?.error) {
      return <div>{positionContext?.error}</div>;
    }
    return <div>Loading...</div>;
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
        <div className="create-post">
          <Form className="create-post-form">
            <Field
              as={LabeledInput}
              label="Title"
              className="create-post-input"
              type="title"
              name="title"
              data-test="title-input"
            />
            <Field
              as="textarea"
              className="create-post-message"
              name="content"
              id="content"
              placeholder="Content"
              required
              data-test="content-input"
              rows={5}
            />
            <div className="create-post-privacy">
              <label htmlFor="friends">Friends</label>
              <Field
                type="radio"
                name="visibility"
                id="friends"
                value="friends"
              />
              <label htmlFor="public">Public</label>
              <Field
                type="radio"
                name="visibility"
                id="public"
                value="public"
              />
            </div>
            <Field name="image" className="create-post-upload">
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
        </div>
      )}
    </Formik>
  );
}
