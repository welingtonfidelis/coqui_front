import Router from 'next/router'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Form } from 'antd';
import { Input, InputTextArea } from '../../components/input';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { ButtonPrimary } from '../../components/button';
import { 
    userStartLoginLoading, userStopLoginLoading 
  } from '../../store/user/actions';
import { UserReducerInterface } from '../../store/user/model';
import { postService } from '../../services/apiRequest';

export default function ResetPassword() {
  const [errorMessage, setErrorMessage] = useState('');

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: { user: UserReducerInterface }) => state.user);

  useEffect(() => {
    if(userInfo.email && userInfo.email) {
      form.setFieldsValue({
        name: userInfo.name,
        email: userInfo.email
      });
    }
  }, []);

  const handleResetPassword = async (values: any) => {
    dispatch(userStartLoginLoading());

    const { ok } = await postService({
      url: '/contact/first-contact',
      values,
      errorMessage: {
        title: 'Falha!',
        message: 'Houve um erro ao enviar sua mensagem. Por favor, revise os dados inseridos e tente novamente.'
      },
      successMessage: {
        title: 'Sucesso!',
        message: 'Sua mensagem foi enviada para nós. Em breve entraremos em contato.'
      },
      validationToken: false
    })

    dispatch(userStopLoginLoading());

    if(!ok) {
      setErrorMessage('Erro ao enviar mensagem');

      return;
    }

    Router.back();
  }

  return (
    <div id="contact-page">
      <main>
        <img src="/assets/images/logo_transparent.png" alt="Logo" />

        <strong>
          Que bom que quer conversar conosco.
          <br />
          Por favor, preencha os dados abaixo e entraremos em contato o mais breve possível.
        </strong>

        <Form
          onFinish={handleResetPassword}
          form={form}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Insira seu nome" }]}
          >
            <Input
              placeholder="Nome"
              suffix={<UserOutlined />}
              allowClear
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Insira seu email" }]}
          >
            <Input
              placeholder="Email"
              suffix={<MailOutlined />}
              type="email"
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="message"
            rules={[{ required: true, message: "Insira sua mensagem" }]}
          >
            <InputTextArea
              placeholder="Mensagem"
              allowClear
            />
          </Form.Item>

          <div className="reset-password-error-message">
            <span>{errorMessage}</span>
          </div>

          <ButtonPrimary
            htmlType="submit"
            loading={userInfo.loadingLogin}
          >
            Enviar
            </ButtonPrimary>
        </Form>

        <a onClick={() => Router.back()}>
          Voltar para o {userInfo.email ? 'sistema' : 'login'}
        </a>
      </main>
    </div>
  )
}
