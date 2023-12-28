"use client";

import { Button, Form, Input, Layout, Select, notification } from "antd";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCountries, register } from "@/api/actions";
import lang from "@/lang/en";

type FormFields = {
  email: string;
  password: string;
  password_confirm: string;
  country: string;
};

const Register: FC = () => {
  const router = useRouter();

  const [api, contextHolder] = notification.useNotification();
  const [countries, setCountries] = useState<string[]>([]);

  const onFinish = async ({
    email,
    password,
    password_confirm,
    country,
  }: FormFields) => {
    const loginExtras: Partial<RegisterApiBody> = {
      client_type: "android",
      device_identifier: window.navigator.userAgent?.split(" ")?.[0],
      os_version: "v1.0.0",
    };

    const r = await register(
      email,
      password,
      password_confirm,
      country,
      loginExtras,
    );
    if (r.status === "error") {
      api.error({ message: "Oops!", description: r.message });
      return;
    }

    router.push("/2fa");
  };

  useEffect(() => {
    (async () => {
      const { countries } = await getCountries();
      setCountries(countries);
    })();
  }, []);

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
            rules={[
              { type: "email", message: lang.form.INVALID_EMAIL },
              { required: true, message: lang.form.INVALID_EMAIL },
            ]}
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

          <Form.Item
            label="Confirm Password"
            name="password_confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: lang.form.INVALID_PASSWORD },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The new password that you entered does not match!",
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: lang.form.INVALID_COUNTRY }]}
            initialValue="US"
          >
            <Select
              options={countries.map((country) => ({
                key: country,
                value: country,
              }))}
            />
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

export default Register;
