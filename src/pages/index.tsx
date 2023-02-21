import { powerlink } from "../core/powerlink";
import { InferGetServerSidePropsType, NextApiResponse } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
//import Select from "react-select";
import {
  Select,
  TextInput,
  NumberInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Stack,
  NativeSelect,
  Textarea,
} from "@mantine/core";

type Data = {
  pk: string | undefined;
  ambs: Array<{ value: string; label: string }>;
  campaign: string;
  amb: string | null;
};

export const getServerSideProps = async ({
  res,
  query,
}: {
  res: NextApiResponse;
  query: Record<string, string>;
}) => {
  const data: Data = {
    amb: query.amb ?? null,
    pk: process.env.STRIPE_PK,
    campaign: query.id ?? "177b5cd5-2a69-4933-992e-1dd3599eb77e",
    ambs: await powerlink(
      query.id ?? "177b5cd5-2a69-4933-992e-1dd3599eb77e",
      query.amb
    ),
  };
  return { props: { data } };
};

function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [multiSub, setMultiSub] = useState(false);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form
        dir="rtl"
        id="donation-form"
        action="/api/create-session"
        method="post"
        className="p-6"
      >
        <Stack>
          <TextInput type="hidden" name="campaign" value={data.campaign} />
          {data.amb ? (
            <>
              <TextInput name="amb" value={data.ambs[0]?.label} readOnly />
            </>
          ) : (
            <Select label="שגריר" searchable data={data.ambs} name="amb" />
          )}

          <TextInput name="full_name" required label="שם מלא" />
          <TextInput name="email" type="email" label="דואר אלקטרוני" />
          <TextInput name="phone" type="tel" label="טלפון נייד" />
          <TextInput name="address" type="text" label="כתובת" />
          <TextInput name="city" type="text" label="עיר" />
          <CurrencyInput name="amount" label="סכום" />
          <Checkbox
            label="תרומה חוזרת"
            checked={multiSub}
            onChange={() => setMultiSub((prev) => !prev)}
          />

          {multiSub ? (
            <Select
              label="מספר תרומות"
              data={[
                { value: "0", label: "ללא הגבלה" },
                ...new Array(24)
                  .fill(0)
                  .map((_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })),
              ]}
            />
          ) : (
            <TextInput type="hidden" name="months" value={1} />
          )}

          <Checkbox label="תרומה אנונימית" name="anonymous" />

          <Textarea name="dedication" label="הקדשה" />

          <Button type="submit">תרום</Button>
        </Stack>
      </form>
    </>
  );
}

export function CurrencyInput({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const data = [{ value: "usd", label: "🇺🇸 USD" }];
  const select = (
    <NativeSelect
      data={data}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      }}
    />
  );

  return (
    <TextInput
      type="number"
      min={1}
      required
      name={name}
      label={label}
      rightSection={select}
      rightSectionWidth={92}
    />
  );
}

export default Home;
