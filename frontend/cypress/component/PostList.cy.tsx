import { PostList } from '../../src/components/PostList'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../src/utils/queryClient';
import { LockedPost, UnlockedPost } from '../../src/types';
import { PositionProvider } from '../../src/contexts/PositionContext';

const posts: (LockedPost | UnlockedPost)[] = [
  {
    id: 1,
    title: 'Unlocked Post',
    author: 'Author 1',
    authorid: 1,
    comments: [],
    createdat: new Date().toISOString(),
    image: 'https://example.com/image1.jpg',
    content: 'This is an unlocked post.',
    isunlocked: true,
    location: { x: 1, y: 1 },
  },
  {
    id: 2,
    title: 'Locked Post',
    author: 'Author 2',
    authorid: 2,
    location: { x: 1, y: 1 },
    isunlocked: false,
    createdat: new Date().toISOString(),
  },
];

describe('PostList', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'watchPosition').callsFake((callback) => {
        return callback({
          coords: {
            latitude: 1,
            longitude: 1,
            accuracy: 1,
          }
        });
      });
    });
    
    cy.mount(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <PositionProvider>
          <PostList posts={posts}/>
          </PositionProvider>
        </QueryClientProvider>
      </BrowserRouter>
    )
  })
  it('renders unlocked and locked posts', () => {
    cy.contains('Unlocked Post');
    cy.contains('Author 1');
    cy.contains('This is an unlocked post.');

    cy.contains('Locked Post');
    cy.contains('Author 2');
  });

  it('renders distance for locked posts', () => {
    cy.contains('Distance: 0m');
  });
});