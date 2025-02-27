"use client";

import { Button, Form, Input, Layout, notification } from "antd";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyLoginPin, resendLoginPin } from "@/api/actions";
import lang from "@/lang/en";
import withAuth from "@/hocs/withAuth";

type FormFields = {
  pin: number;
};

const TwoFactor: FC = () => {
  const router = useRouter();

  const [api, contextHolder] = notification.useNotification();
  const [sendingPin, setSendingPin] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const onFinish = async ({ pin }: FormFields) => {
    setLoggingIn(true);

    const r = await verifyLoginPin(pin);
    if (r.status === "error") {
      api.error({ message: "Oops!", description: r.message });
      return;
    }

    router.push("/dashboard");
  };

  const resendPin = async () => {
    setSendingPin(true);
    const r = await resendLoginPin();
    setSendingPin(false);

    if (r.status === "error") {
      api.error({ message: "Oops!", description: r.message });
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
