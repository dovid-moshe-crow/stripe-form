function Success() {
  return (
    <div className="h-screen w-screen bg-green-500 text-center text-white">
      <h1 className="mb-4 text-5xl font-bold">הצלחה</h1>
      <p className="mb-8 text-lg">תרומתך התקבלה</p>
      <a
        href="/"
        className="rounded-lg bg-white px-4 py-2 text-green-500 hover:bg-green-500 hover:text-white"
      >
        Go Home
      </a>
    </div>
  );
}

export default Success;
