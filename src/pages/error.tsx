import { useRouter } from "next/router";

function ErrorPage() {
  const router = useRouter();
  const message = router.query.message;
  return (
    <div className="h-screen w-screen bg-red-500 text-center text-white">
      <h1 className="mb-4 text-5xl font-bold">תקלה</h1>
      <p className="mb-8 text-lg">{message}</p>
      <a
        target="_top"
        href="/"
        className="rounded-lg bg-white px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white"
      >
        בחזרה לדף התרומות
      </a>
    </div>
  );
}

export default ErrorPage;
