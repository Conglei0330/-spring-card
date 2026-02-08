import Head from 'next/head';
import LoginPage from '@/components/LoginPage';

export default function LoginPageRoute() {
  return (
    <>
      <Head>
        <title>手机号登录 - 策马新春</title>
        <meta name="description" content="输入手机号即可登录，享受AI智能祝福服务" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <LoginPage />
    </>
  );
}
