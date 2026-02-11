export default function BranchStep({ data, setData, next, prev }) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Branch Locations</h2>

      <input placeholder="Branch Name" />
      <input placeholder="City" />
      <input placeholder="State" />
      <input placeholder="PIN" />

      <div className="flex justify-between mt-6">
        <button onClick={prev}>Previous</button>
        <button onClick={next}>Next</button>
      </div>
    </>
  );
}
