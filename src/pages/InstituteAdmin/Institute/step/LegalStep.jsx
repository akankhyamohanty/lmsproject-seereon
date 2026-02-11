import { Upload } from "lucide-react";

export default function LegalStep({ data, setData, next, prev }) {
  const legal = data.legal || {};

  const update = (e) => {
    setData({
      ...data,
      legal: { ...legal, [e.target.name]: e.target.value },
    });
  };

  const uploadFile = (name, file) => {
    setData({
      ...data,
      legal: { ...legal, [name]: file },
    });
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Legal Details & Documents</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Registration */}
        <div>
          <label>Registration Number *</label>
          <input name="registrationNo" onChange={update} placeholder="Enter registration no" />
        </div>
        <div>
          <label>Registration Certificate *</label>
          <input type="file" onChange={(e) => uploadFile("registrationDoc", e.target.files[0])} />
        </div>

        {/* PAN */}
        <div>
          <label>PAN Number *</label>
          <input name="panNo" onChange={update} placeholder="ABCDE1234F" />
        </div>
        <div>
          <label>PAN Document *</label>
          <input type="file" onChange={(e) => uploadFile("panDoc", e.target.files[0])} />
        </div>

        {/* GST */}
        <div>
          <label>GSTIN *</label>
          <input name="gstin" onChange={update} placeholder="22AAAAA0000A1Z5" />
        </div>
        <div>
          <label>GST Certificate *</label>
          <input type="file" onChange={(e) => uploadFile("gstDoc", e.target.files[0])} />
        </div>

        {/* TIN */}
        <div>
          <label>TIN No</label>
          <input name="tinNo" onChange={update} placeholder="Enter TIN" />
        </div>
        <div>
          <label>TIN Document</label>
          <input type="file" onChange={(e) => uploadFile("tinDoc", e.target.files[0])} />
        </div>

        {/* CST */}
        <div>
          <label>CST No</label>
          <input name="cstNo" onChange={update} placeholder="Enter CST" />
        </div>
        <div>
          <label>CST Document</label>
          <input type="file" onChange={(e) => uploadFile("cstDoc", e.target.files[0])} />
        </div>

        {/* MSME / Udyam */}
        <div>
          <label>Udyam / MSME No</label>
          <input name="udyamNo" onChange={update} placeholder="Udyam No" />
        </div>
        <div>
          <label>Udyam / MSME Certificate</label>
          <input type="file" onChange={(e) => uploadFile("udyamDoc", e.target.files[0])} />
        </div>

        {/* Trade License */}
        <div>
          <label>Trade License No</label>
          <input name="tradeLicenseNo" onChange={update} placeholder="Trade License No" />
        </div>
        <div>
          <label>Trade License Document</label>
          <input type="file" onChange={(e) => uploadFile("tradeLicenseDoc", e.target.files[0])} />
        </div>

        {/* Startup India */}
        <div>
          <label>Startup India Certificate</label>
          <input type="file" onChange={(e) => uploadFile("startupIndiaDoc", e.target.files[0])} />
        </div>

        {/* ET / Professional Tax */}
        <div>
          <label>ET / PT No</label>
          <input name="etNo" onChange={update} placeholder="ET / PT No" />
        </div>
        <div>
          <label>ET / PT Document</label>
          <input type="file" onChange={(e) => uploadFile("etDoc", e.target.files[0])} />
        </div>

      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button onClick={prev} className="btn-secondary">Previous</button>
        <button onClick={next} className="btn-primary">Next</button>
      </div>
    </>
  );
}
