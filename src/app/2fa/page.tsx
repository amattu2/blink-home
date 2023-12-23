"use client";

import { Button, Form, Input, Layout, notification } from "antd";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { verifyLoginPin } from "@/api/actions";
import lang from "../../lang/en";

type FormFields = {
  pin: number;
};

const Login: FC = () => {
  const router = useRouter();

  const [api, contextHolder] = notification.useNotification();
  const [, setAccount] = useLocalStorage<Account>("account", {} as Account);

  const onFinish = async ({ pin }: FormFields) => {
    console.log(pin);
  };

  return (
    <Layout style={{ height: "100%" }}>
      {contextHolder}
      <Layout.Content>
        <Form<FormFields>
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FormFields>
            label="Pin"
            name="pin"
            rules={[{ required: true, message: lang.form.INVALID_PIN }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button type="text" htmlType="button">
              Resend
            </Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </Layout>
  );
};

export default Login;
