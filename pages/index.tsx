import Head from 'next/head'
import Router from 'next/router'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, InputPassword, InputTextArea } from '../components/input';
import { ButtonPrimary } from '../components/button';
import { UserOutlined } from '@ant-design/icons';
import { 
  userLogin, userLogout, userStartLoginLoading, userStopLoginLoading 
} from '../store/user/actions';
import { Form } from 'antd';
import { UserReducerInterface } from '../store/user/model';
import { postService } from '../services/apiRequest';

export default function Home() {
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const userInfo = useSelector((state: { user: UserReducerInterface }) => state.user);

  useEffect(() => {
    dispatch(userLogout());
  }, []);

  const handleLogin = async (values: any) => {
      // dispatch(userStartLoginLoading());

      // const { ok, data } = await postService({
      //   url: '/users/login',
      //   values,
      //   errorMessage: {
      //     title: 'Falha!',
      //     message: 'Houve um erro ao efetuar o login. Por favor, ' +
      //     'confirme se seu usuário e senha estão corretos.'
      //   },
      //   successMessage: {
      //     title: 'Sucesso!',
      //     message: 'Seja bem vindo(a)'
      //   },
      //   validationToken: false
      // })

      // dispatch(userStopLoginLoading());

      // if(!ok) {
      //   setErrorMessage('Usuário ou senha incorretos');

      //   return;
      // }

      const data = {
        token: '123123123', loadingLogin: false
      }
      dispatch(userLogin(data));
      Router.replace('/main');
  }

  return (
    <div id="login-page">
      <Head>
        <title>COQUI</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <img src="/assets/images/logo_transparent.png" alt="Logo" />

        <strong>
          Seja bem vindo(a).
          <br />
          Insira seus dados e vamos começar.
        </strong>

        <Form
          onFinish={handleLogin}
        >
          <Form.Item
            name="user"
            rules={[{ required: true, message: "Insira seu usário ou email" }]}
          >
            <Input
              placeholder="Usuário ou email"
              suffix={<UserOutlined />}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Insira sua senha" }]}
          >
            <InputPassword
              placeholder="Senha"
              allowClear
            />
          </Form.Item>

          <div className="login-error-message">
            <span>{errorMessage}</span>
          </div>

          <ButtonPrimary
            htmlType="submit"
            loading={userInfo.loadingLogin}
          >
            Entrar
            </ButtonPrimary>
        </Form>

        <a onClick={() => Router.push('/reset-password')}>Esqueci minha senha</a>

        <a onClick={() => Router.push('/contact')}>Não tem cadastro? Entre em contato conosto</a>
      </main>

      <footer>
        {/* <a
          href="welingtonfidelis.dev.br"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span>
            Welington Fidelis de Sousa
          </span>
        </a> */}
      </footer>
    </div>
  )
}
