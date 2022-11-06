import type {
  LoaderFunction,
} from "@remix-run/node";
import type { User } from '~/utils/auth0.server';
import { authenticator } from '~/utils/auth0.server';
import { useLoaderData } from "@remix-run/react";
import { urqlClient } from '~/utils/graphql';
import gql from "graphql-tag";

const postsQuery = gql`
query {
  posts {
    id
    title
  }
}
`;

type Post = {
  id: string;
  title: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const graphqlClient = await urqlClient((user as User).accessToken);
  const result = await graphqlClient.query(postsQuery, {}).toPromise();
  const posts = result.data.posts;
  console.log("result", result.data.posts);

  return { user, posts };
};

export default function Index() {
  const data = useLoaderData<{ user: User, posts: Post[] }>();


  return (
    <div>
      {data.user && (
        <>
          <form action="logout" method="post">
            <button>Logout</button>
          </form>
          <h1>{data.user.email}</h1>
          <h1>{data.user.displayName}</h1>
          <div>
            {data.posts.map((post) => (
              <div key={post.id}>
                <p>{post.title}</p>
              </div>))}
          </div>
        </>
      )}
      <h1>Welcome to Remix</h1>
    </div>
  );
}
