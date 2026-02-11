export default function OrganisationStep({ data, setData, next }) {
  const org = data.organisation;

  const update = (e) => {
    setData({
      ...data,
      organisation: { ...org, [e.target.name]: e.target.value },
    });
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Organisation – Basic Details</h2>

      <div className="grid grid-cols-2 gap-4">
        <input name="registeredName" placeholder="Registered Name" onChange={update} />
        <input name="phone" placeholder="Phone Number" onChange={update} />
        <input name="altPhone" placeholder="Alternate Phone" onChange={update} />
        <input name="email" placeholder="Email" onChange={update} />
        <input name="secondaryEmail" placeholder="Secondary Email" onChange={update} />
        <input name="address1" placeholder="Address Line 1" onChange={update} />
        <input name="address2" placeholder="Address Line 2" onChange={update} />
        <input name="city" placeholder="City" onChange={update} />
        <input name="state" placeholder="State" onChange={update} />
        <input name="pin" placeholder="PIN Code" onChange={update} />
        <input name="headOffice" placeholder="Head Office Location" onChange={update} />

        <select name="type" onChange={update}>
          <option value="">Select Organisation Type</option>
          <option>School</option>
          <option>College</option>
          <option>Institute</option>
        </select>
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={next} className="btn-primary">Next</button>
      </div>
    </>
  );
}
