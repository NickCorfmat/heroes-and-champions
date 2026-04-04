export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ amount: string }>;
}) {
  const { amount } = await searchParams;

  return (
    <main className="max-w-6xl mx-auto p-10 text-black text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-2 rounded-md text-black mt-5 text-4xl font-bold">
          ${amount}
        </div>
      </div>
    </main>
  );
}