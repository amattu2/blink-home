"use client";

import { Button, Form, Input, Layout, notification } from "antd";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyLoginPin, resendLoginPin } from "@/api/actions";
import lang from "@/lang/en";
import withAuth, { AuthProps, AuthState } from "@/hocs/withAuth";
import { STORAGE_KEYS } from "@/config/STORAGE_KEYS";
import { useLocalStorage } from "usehooks-ts";

type FormFields = {
  pin: number;
};

const TwoFactor: FC<AuthProps> = ({ account, token }) => {
  const router = useRouter();

  const [api, contextHolder] = notification.useNotification();
  const [sendingPin, setSendingPin] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [, setLoginState] = useLocalStorage<AuthState>(
    STORAGE_KEYS.LOGIN_STATE,
    "LOGGED_OUT",
  );

  const onFinish = async ({ pin }: FormFields) => {
    setLoggingIn(true);
    const r = await verifyLoginPin(pin, account, token);
    if (r.status === "error") {
      api.error({ message: "Oops!", description: r.message });
      return;
    }

    setLoggingIn(false);
    setLoginState("LOGGED_IN");
    router.push("/dashboard");
  };

  const resendPin = async () => {
    setSendingPin(true);
    await resendLoginPin(account, token);
    setSendingPin(false);
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
            <Button type="primary" htmlType="submit" loading={loggingIn}>
              Submit
            </Button>
            <Button
              type="text"
              htmlType="button"
              loading={sendingPin}
              onClick={resendPin}
            >
              Resend
            </Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </Layout>
  );
};

export default withAuth(TwoFactor, ["TWO_FACTOR"]);
