import { powerlink } from "../core/powerlink";
import { InferGetServerSidePropsType, NextApiResponse } from "next";
import Head from "next/head";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import Select from "react-select";

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
  useEffect(() => {
    (async () => {
      const stripe = (await loadStripe(data.pk!))!;
      const elements = stripe.elements()!;
      const cardElement = elements.create("card", {
        hidePostalCode: true,
      });
      cardElement.mount("#card-element");
      const form = document.getElementById("donation-form")! as HTMLFormElement;

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        stripe.createToken(cardElement).then(function (result) {
          if (result.error) {
            console.log(result.error.message);
          } else {
            var hiddenInput = document.createElement("input");
            hiddenInput.setAttribute("type", "hidden");
            hiddenInput.setAttribute("name", "stripeToken");
            hiddenInput.setAttribute("value", result.token.id);
            form.appendChild(hiddenInput);

            form.submit();
          }
        });
      });
    })();
  }, []);

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
        action="/api/create-subscription"
        method="post"
        className="rounded-lg bg-white p-6"
      >
        <h2 className="mb-4 text-lg font-medium">טופס תרומה</h2>
        <input type="hidden" name="campaign" value={data.campaign} />
        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">שגריר</label>
          {data.amb ? (
            <>
              <input
                value={data.ambs[0]?.label}
                readOnly
                className="w-full rounded-lg border border-gray-400 p-2"
              />
              <input name="amb" value={data.ambs[0]?.value} hidden readOnly />
            </>
          ) : (
            <Select
              options={data.ambs as any}
              defaultValue=""
              className="w-full rounded-lg"
              name="amb"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            שם מלא <span className="text-red-700">*</span>
          </label>
          <input
            required
            className="w-full rounded-lg border border-gray-400 p-2"
            type="text"
            name="full_name"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            דואר אלקטרוני
          </label>
          <input
            className="w-full rounded-lg border border-gray-400 p-2"
            type="email"
            name="email"
            placeholder="כתוב את כתובת הדואר האלקטרוני שלך"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            טלפון נייד
          </label>
          <input
            className="w-full rounded-lg border border-gray-400 p-2"
            type="tel"
            name="phone"
            placeholder="כתוב את מספר הטלפון הנייד שלך"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">סכום</label>
          <div className="flex">
            <input
              className="w-full rounded-r-lg border border-gray-400 p-2"
              type="number"
              name="amount"
              min={1}
              placeholder="כתוב את הסכום של התרומה"
              required
            />

            <div className="flex items-center justify-center rounded-l-lg border border-r-0 border-gray-400  bg-gray-400 px-3 text-lg text-white">
              $
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-start">
          <input
            className=" rounded-lg border border-gray-400"
            type="checkbox"
            name="multiSub"
            checked={multiSub}
            onChange={() => setMultiSub((prev) => !prev)}
          />
          <label className="mx-2 block font-medium text-gray-700">
            תרומה חוזרת
          </label>
        </div>

        <div className="mb-4" hidden={!multiSub}>
          <label className="mb-2 block font-medium text-gray-700">
            מספר תרומות
          </label>

          <div className="flex">
            <select
              className="w-full rounded-lg border border-gray-400 p-2"
              name="months"
              id="contributions"
              required
            >
              <option value="no limit">ללא הגבלה</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12" selected>
                12
              </option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex justify-start">
          <input
            className=" rounded-lg border border-gray-400"
            type="checkbox"
            name="anonymous"
          />
          <label className="mx-2 block font-medium text-gray-700">
            תרומה אנונימית
          </label>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">הקדשה</label>
          <textarea
            className="h-36 w-full rounded-lg border border-gray-400 p-2"
            name="dedication"
          />
        </div>
        {/* <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">כרטיס אשראי</label>
        <div id="card-element" className="bg-gray-200 p-2 rounded-lg"></div>
      </div>  */}
        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            כרטיס אשראי
          </label>
          <div
            className="relative overflow-hidden rounded-lg border border-gray-400"
            dir="ltr"
          >
            <div className="rounded-lg bg-gray-200 py-2 px-4">
              <div className="absolute top-0 left-0 -ml-4 -mt-4">
                <i className="fas fa-credit-card fa-2x text-indigo-500"></i>
              </div>
              <div id="card-element" className="text-gray-600"></div>
            </div>
          </div>
        </div>

        <button className="w-full rounded-lg bg-indigo-500 py-2 px-4 text-white hover:bg-indigo-600">
          תרום
        </button>
      </form>
    </>
  );
}

export default Home;
