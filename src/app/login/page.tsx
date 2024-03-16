"use client";

import { Button, Form, Input, Layout, notification } from "antd";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/api/actions";
import lang from "@/lang/en";

export const runtime = "edge";

type FormFields = {
  email: string;
  password: string;
};

const Login: FC = () => {
  const router = useRouter();

  const [api, contextHolder] = notification.useNotification();

  const onFinish = async ({ email, password }: FormFields) => {
    const loginExtras: Partial<LoginApiBody> = {
      client_type: "android",
      device_identifier: window.navigator.userAgent?.split(" ")?.[0],
      os_version: "v1.0.0",
    };

    const r = await login(email, password, loginExtras);
    if (r.status === "error") {
      api.error({ message: "Oops!", description: r.message });
      return;
    }

    if (r.two_factor_auth) {
      router.push("/2fa");
    } else {
      router.push("/dashboard");
    }
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
            label="Email"
            name="email"
            rules={[{ required: true, message: lang.form.INVALID_EMAIL }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: lang.form.INVALID_PASSWORD }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </Layout>
  );
};

export default Login;
