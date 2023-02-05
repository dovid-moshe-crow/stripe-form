import { useRouter } from "next/router";

function Success() {
  const router = useRouter();
  const amount = router.query.amount;
  const months = router.query.months;
  const name = router.query.name;
  const noLimitSub = months === "null";
  console.log(months, noLimitSub);
  const sub = months && (noLimitSub || parseInt(months.toString()) > 1);
  return (
    <div className="h-screen w-screen bg-green-500 p-8 text-center text-white">
      <h1 className="mb-4 text-5xl font-bold">הצלחה</h1>
      <p className="mb-8 text-lg italic">{name}</p>
      <p className="mb-8 text-lg">
        תודה רבה על {sub || noLimitSub ? "הוראת הקבע" : "תרומתך"} בסך {amount}{" "}
        דולר
      </p>
      {!noLimitSub && sub && <p className="mb-8 text-lg"> ל {months} חודשים</p>}

      <a
        target="_top"
        href="/"
        className="rounded-lg bg-white px-4 py-2 text-green-500 hover:bg-green-500 hover:text-white"
      >
        בחזרה לדף התרומות
      </a>
    </div>
  );
}

export default Success;
