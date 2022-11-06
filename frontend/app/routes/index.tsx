import type {
  LoaderFunction,
} from "@remix-run/node";
import type { User } from '~/utils/auth0.server';
import { authenticator } from '~/utils/auth0.server';
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  return { user };
};

export default function Index() {
  const data = useLoaderData<{ user: User }>();

  return (
    <div>
      {data.user && (
        <>
          <form action="logout" method="post">
            <button>Logout</button>
          </form>
          <h1>{data.user.email}</h1>
          <h1>{data.user.displayName}</h1>
        </>
      )}
      <h1>Welcome to Remix</h1>
    </div>
  );
}
