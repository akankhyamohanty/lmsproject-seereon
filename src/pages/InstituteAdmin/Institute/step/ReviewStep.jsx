export default function ReviewStep({ data, prev, finish }) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Review & Finalize</h2>

      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>

      <div className="flex justify-between mt-6">
        <button onClick={prev}>Previous</button>
        <button onClick={finish} className="btn-primary">
          Create Organisation
        </button>
      </div>
    </>
  );
}
