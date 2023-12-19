import { useRef, useState } from 'react';
// import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'usehooks-ts';

import { CreatePostModal } from '@components/CreatePostModal';
import { Button } from '@components/shared/Button';

export function Profile() {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function closeModal() {
    setIsOpen(false);
  }

  useOnClickOutside(ref, closeModal);

  return (
    <div ref={ref}>
      <h1>Profile</h1>
      <Button onClick={() => setIsOpen(true)}>Create Post</Button>
      <div>
        {/* {isOpen && createPortal(<CreatePostModal closeModal={closeModal} />, document.body)} */}
        {isOpen && <CreatePostModal closeModal={closeModal} />}
      </div>
    </div>
  );
}
