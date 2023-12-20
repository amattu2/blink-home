"use client";

import { Button, Form, Input, Layout } from "antd";
import { FC } from "react";
import { useLocalStorage } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";
import lang from "../../lang/en";
import { login } from "@/api/actions";

type FormFields = {
  email: string;
  password: string;
};

const Login: FC = () => {
  const [uniqueId, setUniqueId] = useLocalStorage<string>("unique_Id", "");
  const [account, setAccount] = useLocalStorage<Account>("account", {} as Account);

  const onFinish = async ({ email, password }: FormFields) => {
    const newUniqueId = uuidv4();
    if (!uniqueId) {
      setUniqueId(newUniqueId);
    }

    const loginExtras: Partial<LoginBody> = {
      unique_Id: uniqueId || newUniqueId,
      client_type: "android",
      client_name: "TODO: pull from env",
      device_identifier: window.navigator.userAgent?.split(" ")?.[0],
      os_version: "v1.0.0",
      reauth: !!uniqueId,
    };

    const r = await login(email, password, loginExtras);
    console.log(r);
    if (r.status === "error") {
      // TODO: show error message
      console.warn(r);
      return;
    }

    setAccount(r.data.account);
    if (r.data?.account?.client_verification_required) {
      // TODO: redirect to verification page
    } else {
      // TODO: redirect to home page
    }
  };

  return (
    <Layout style={{ height: "100%" }}>
      <Layout.Content>
        <Form<FormFields>
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
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
