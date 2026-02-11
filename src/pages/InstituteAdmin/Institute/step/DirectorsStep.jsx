export default function DirectorsStep({ data, setData, next, prev }) {
  const addDirector = () => {
    setData({ ...data, directors: [...data.directors, {}] });
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Partners / Directors</h2>

      {data.directors.map((_, i) => (
        <div key={i} className="border p-4 rounded mb-4">
          <input placeholder="Director Name" />
          <input placeholder="Email" />
          <input placeholder="Contact Number" />
        </div>
      ))}

      <button onClick={addDirector}>+ Add Director</button>

      <div className="flex justify-between mt-6">
        <button onClick={prev}>Previous</button>
        <button onClick={next}>Next</button>
      </div>
    </>
  );
}
