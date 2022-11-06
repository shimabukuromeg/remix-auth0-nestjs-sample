import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import { createCookieSessionStorage } from '@remix-run/node';
import {
  AUTH0_CALLBACK_URL,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_DOMAIN,
  SECRETS,
} from '~/constants/index.server';

export type User = {
  email: string;
  displayName: string;
  accessToken: string;
};

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_remix_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [SECRETS],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const authenticator = new Authenticator(sessionStorage);

const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: AUTH0_CALLBACK_URL,
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    domain: AUTH0_DOMAIN,
  },
  async (data) => {
    console.log("data", data);

    // profileにAuth0のプロフィール情報が返ってきます
    console.log(data.profile);
    //
    // 返ってきた情報を利用してDBへ書き込むなどの処理
    // 加工するなどの処理を入れる
    //
    // 今回はユーザーのEmail/displayName/access_tokenを返す関数を返すのみ
    return {
      email: data.profile.emails[0].value,
      displayName: data.profile.displayName,
      accessToken: data.accessToken,
    };
  },
);

authenticator.use(auth0Strategy);

export const { getSession, commitSession, destroySession } = sessionStorage;