// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { X } from "lucide-react";

// export default function InstituteForm() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     instituteName: "",
//     type: "",
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     pincode: "",
//     email: "",
//     phone: "",
//     website: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const storedInstitutes =
//       JSON.parse(localStorage.getItem("institutes")) || [];

//     const newInstitute = {
//       name: form.instituteName,
//       type: form.type,
//       city: form.city,
//       state: form.state,
//       plan: "Premium",
//       status: "Active",
//       date: new Date().toLocaleDateString(),
//     };

//     localStorage.setItem(
//       "institutes",
//       JSON.stringify([...storedInstitutes, newInstitute])
//     );

//     navigate("/admin/institute");
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-start overflow-y-auto z-50">
//       <div className="bg-white w-full max-w-5xl mt-10 rounded-lg shadow-lg p-6">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-lg font-semibold">Add Institute</h2>
//           <button onClick={() => navigate("/admin/institute")}>
//             <X />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">

//           {/* BASIC DETAILS */}
//           <div>
//             <h3 className="font-semibold mb-4">Basic Details</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm">Institute Name</label>
//                 <input
//                   name="instituteName"
//                   onChange={handleChange}
//                   className="w-full bg-gray-200 rounded-md px-3 py-2 mt-1"
//                   placeholder="St. Mary's College"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-sm">Type</label>
//                 <input
//                   name="type"
//                   onChange={handleChange}
//                   className="w-full bg-gray-200 rounded-md px-3 py-2 mt-1"
//                   placeholder="College"
//                   required
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="text-sm">Address</label>
//                 <input
//                   name="address"
//                   onChange={handleChange}
//                   className="w-full bg-gray-200 rounded-md px-3 py-2 mt-1"
//                   placeholder="123, Bharatpur, Bhubaneswar"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm">City</label>
//                 <input
//                   name="city"
//                   onChange={handleChange}
//                   className="w-full bg-gray-200 rounded-md px-3 py-2 mt-1"
//                   placeholder="Bhubaneswar"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm">State</label>
//                 <input
//                   name="state"
//                   onChange={handleChange}
//                   className="w-full bg-gray-200 rounded-md px-3 py-2 mt-1"
//                   placeholder="Odisha"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm">Country</label>
//                 <input
//                   name="country"
//                   onChange={handleChange}
//                   className="w-full bg-gray-200 rounded-md px-3 py-2 mt-1"
//                   placeholder="India"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm">Pincode</label>
//                 <input
//                   name="pincode"
//                   onChange={handleChange}
//                   className="w-full bg-gray-200 rounded-md px-3 py-2 mt-1"
//                   placeholder="755001"
//                 />
//               </div>
//             </div>
//           </div>

//           <hr />

//           {/* CONTACT DETAILS */}
//           <div>
//             <h3 className="font-semibold mb-4">Contact Details</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm">Email</label>
//                 <input
//                   name="email"
//                   type="email"
//                   onChange={handleChange}
//                   className="w-full bg-gray-200 rounded-md px-3 py-2 mt-1"
//                   placeholder="abc@gmail.com"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm">Phone no.</label>
//                 <input
//                   name="phone"
//                   onChange={handleChange}
//                   className="w-full bg-gray-200 rounded-md px-3 py-2 mt-1"
//                   placeholder="8585775744"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="text-sm">Website</label>
//                 <input
//                   name="website"
//                   onChange={handleChange}
//                   className="w-full bg-gray-200 rounded-md px-3 py-2 mt-1"
//                   placeholder="www.abc.in"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={() => navigate("/admin/institute")}
//               className="px-4 py-2 border rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//             >
//               Save Institute
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Trash2, Upload } from "lucide-react";

const STEPS = [
  { id: 0, title: "Organisation", subtitle: "Basic Details" },
  { id: 1, title: "Partners/Directors", subtitle: "Director Details" },
  { id: 2, title: "Legal Details", subtitle: "Documents" },
  { id: 3, title: "Branch", subtitle: "Locations" },
  { id: 4, title: "Finalize", subtitle: "Modules & Review" },
];

export default function InstituteForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    organisation: {
      name: "",
      phone: "",
      altPhone: "",
      email: "",
      secondaryEmail: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pin: "",
      headOffice: "",
      type: "",
    },
    directors: [
      {
        id: 1,
        name: "",
        email: "",
        secondaryEmail: "",
        contact: "",
        mobile: "",
        whatsapp: "",
        gender: "",
        dob: "",
        interest: "",
        father: "",
        spouse: "",
        children: "",
        currentAddress: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          pin: "",
        },
        permanentAddress: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          pin: "",
        },
        documents: {
          panNo: "",
          panDoc: "",
          aadhaarNo: "",
          aadhaarDoc: "",
        },
        bank: {
          bankName: "",
          accountNumber: "",
          ifscCode: "",
        },
        associateCompany: {
          bankName: "",
          accountNumber: "",
          ifscCode: "",
        },
      },
    ],
    legal: {
      tinNo: "",
      tinDoc: "",
      panNo: "",
      panDoc: "",
      gstin: "",
      gstinDoc: "",
      etNo: "",
      etDoc: "",
      cstNo: "",
      cstDoc: "",
      udyamNo: "",
      udyamDoc: "",
      msmeNo: "",
      msmeDoc: "",
      tradeLicenseNo: "",
      tradeLicenseDoc: "",
      startupIndiaDoc: "",
    },
    branches: [
      {
        id: 1,
        shortName: "",
        name: "",
        city: "",
        state: "",
        pin: "",
        address1: "",
        address2: "",
        gstin: "",
        contactPerson: "",
        contactNo: "",
        email: "",
      },
    ],
  });

  // Update organisation fields
  const updateOrg = (field, value) => {
    setForm({
      ...form,
      organisation: { ...form.organisation, [field]: value },
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Update director fields
  const updateDirector = (directorIdx, field, value) => {
    const updatedDirectors = [...form.directors];
    updatedDirectors[directorIdx][field] = value;
    setForm({ ...form, directors: updatedDirectors });
  };

  // Update nested director fields (address, documents, bank)
  const updateDirectorNested = (directorIdx, section, field, value) => {
    const updatedDirectors = [...form.directors];
    updatedDirectors[directorIdx][section][field] = value;
    setForm({ ...form, directors: updatedDirectors });
  };

  // Add new director
  const addDirector = () => {
    const newDirector = {
      id: form.directors.length + 1,
      name: "",
      email: "",
      secondaryEmail: "",
      contact: "",
      mobile: "",
      whatsapp: "",
      gender: "",
      dob: "",
      interest: "",
      father: "",
      spouse: "",
      children: "",
      currentAddress: { line1: "", line2: "", city: "", state: "", pin: "" },
      permanentAddress: { line1: "", line2: "", city: "", state: "", pin: "" },
      documents: { panNo: "", panDoc: "", aadhaarNo: "", aadhaarDoc: "" },
      bank: { bankName: "", accountNumber: "", ifscCode: "" },
      associateCompany: { bankName: "", accountNumber: "", ifscCode: "" },
    };
    setForm({ ...form, directors: [...form.directors, newDirector] });
  };

  // Remove director
  const removeDirector = (idx) => {
    if (form.directors.length > 1) {
      setForm({
        ...form,
        directors: form.directors.filter((_, i) => i !== idx),
      });
    }
  };

  // Update legal fields
  const updateLegal = (field, value) => {
    setForm({
      ...form,
      legal: { ...form.legal, [field]: value },
    });
  };

  // Add new branch
  const addBranch = () => {
    const newBranch = {
      id: form.branches.length + 1,
      shortName: "",
      name: "",
      city: "",
      state: "",
      pin: "",
      address1: "",
      address2: "",
      gstin: "",
      contactPerson: "",
      contactNo: "",
      email: "",
    };
    setForm({ ...form, branches: [...form.branches, newBranch] });
  };

  // Update branch fields
  const updateBranch = (branchIdx, field, value) => {
    const updatedBranches = [...form.branches];
    updatedBranches[branchIdx][field] = value;
    setForm({ ...form, branches: updatedBranches });
  };

  // Remove branch
  const removeBranch = (idx) => {
    if (form.branches.length > 1) {
      setForm({
        ...form,
        branches: form.branches.filter((_, i) => i !== idx),
      });
    }
  };

  // Validate step
  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!form.organisation.name.trim())
        newErrors.name = "Registered Name is required";
      if (!form.organisation.phone.trim())
        newErrors.phone = "Phone Number is required";
      if (!form.organisation.altPhone.trim())
        newErrors.altPhone = "Alternate Phone is required";
      if (!form.organisation.email.trim())
        newErrors.email = "Email is required";
      if (!form.organisation.city.trim())
        newErrors.city = "City is required";
      if (!form.organisation.state.trim())
        newErrors.state = "State is required";
      if (!form.organisation.pin.trim())
        newErrors.pin = "PIN Code is required";
      if (!form.organisation.type) newErrors.type = "Organisation Type is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate steps
  const goNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const goPrev = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Submit form
  const submit = () => {
    const existing = JSON.parse(localStorage.getItem("institutes")) || [];
    const newOrganisation = {
      ...form,
      id: Date.now(),
      status: "Active",
      createdAt: new Date().toLocaleString(),
      plan: "Premium",
    };
    existing.push(newOrganisation);
    localStorage.setItem("institutes", JSON.stringify(existing));
    navigate("/admin/institute");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 m:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mx-auto w-full max-w-10xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
              Add Organisation
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Step {step + 1} of {STEPS.length} : {STEPS[step].title}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-4 gap-1 sm:gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center flex-1 sm:flex-initial"
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all text-xs sm:text-sm ${
                      i < step
                        ? "bg-green-500 text-white"
                        : i === step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                 <span className="text-sm sm:text-base lg:text-lg font-bold text-center ...">
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            {/* STEP 1 – ORGANISATION */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Basic Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        Registered Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.organisation.name}
                        onChange={(e) => updateOrg("name", e.target.value)}
                        placeholder="Enter registered name"
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-sm ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.organisation.phone}
                        onChange={(e) => updateOrg("phone", e.target.value)}
                        placeholder="Enter phone number"
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-sm ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        Alternate Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.organisation.altPhone}
                        onChange={(e) => updateOrg("altPhone", e.target.value)}
                        placeholder="Enter alternate phone"
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-sm ${
                          errors.altPhone ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.altPhone && (
                        <p className="text-red-500 text-xs mt-1">{errors.altPhone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.organisation.email}
                        onChange={(e) => updateOrg("email", e.target.value)}
                        placeholder="Enter email address"
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-sm ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        Secondary Email
                      </label>
                      <input
                        type="email"
                        value={form.organisation.secondaryEmail}
                        onChange={(e) => updateOrg("secondaryEmail", e.target.value)}
                        placeholder="Enter secondary email"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.organisation.city}
                        onChange={(e) => updateOrg("city", e.target.value)}
                        placeholder="Enter city"
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-sm ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.organisation.address1}
                        onChange={(e) => updateOrg("address1", e.target.value)}
                        placeholder="Enter address line 1"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ringwhite--500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={form.organisation.address2}
                        onChange={(e) => updateOrg("address2", e.target.value)}
                        placeholder="Enter address line 2"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.organisation.state}
                        onChange={(e) => updateOrg("state", e.target.value)}
                        placeholder="Enter state"
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-sm ${
                          errors.state ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.organisation.pin}
                        onChange={(e) => updateOrg("pin", e.target.value)}
                        placeholder="Enter PIN code"
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-sm ${
                          errors.pin ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.pin && (
                        <p className="text-red-500 text-xs mt-1">{errors.pin}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        Head Office Location
                      </label>
                      <input
                        type="text"
                        value={form.organisation.headOffice}
                        onChange={(e) => updateOrg("headOffice", e.target.value)}
                        placeholder="Enter head office location"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-md md:text-md font-medium text-gray-800 mb-1">
                        Organisation Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.organisation.type}
                        onChange={(e) => updateOrg("type", e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-white-500 focus:border-transparent text-md ${
                          errors.type ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select organisation type</option>
                        <option value="College">College</option>
                        <option value="School">School</option>
                        <option value="Institute">Institute</option>
                        <option value="University">University</option>
                      </select>
                      {errors.type && (
                        <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 – DIRECTORS */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Director Details
                </h2>
                {form.directors.map((director, dirIdx) => (
                  <div key={dirIdx} className="border-2 border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        Director {dirIdx + 1}
                      </h3>
                      {form.directors.length > 1 && (
                        <button
                          onClick={() => removeDirector(dirIdx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>

                    {/* Director Personal Details */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-4">
                          Personal Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <input
                            type="text"
                            placeholder="Director Name *"
                            value={director.name}
                            onChange={(e) => updateDirector(dirIdx, "name", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={director.email}
                            onChange={(e) => updateDirector(dirIdx, "email", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="email"
                            placeholder="Secondary Email"
                            value={director.secondaryEmail}
                            onChange={(e) =>
                              updateDirector(dirIdx, "secondaryEmail", e.target.value)
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="tel"
                            placeholder="Contact Number *"
                            value={director.contact}
                            onChange={(e) => updateDirector(dirIdx, "contact", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={director.mobile}
                            onChange={(e) => updateDirector(dirIdx, "mobile", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="tel"
                            placeholder="WhatsApp Number"
                            value={director.whatsapp}
                            onChange={(e) => updateDirector(dirIdx, "whatsapp", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <select
                            value={director.gender}
                            onChange={(e) => updateDirector(dirIdx, "gender", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-md"
                          >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="date"
                            value={director.dob}
                            onChange={(e) => updateDirector(dirIdx, "dob", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="% of Interest"
                            value={director.interest}
                            onChange={(e) => updateDirector(dirIdx, "interest", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Father Name"
                            value={director.father}
                            onChange={(e) => updateDirector(dirIdx, "father", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Spouse Name"
                            value={director.spouse}
                            onChange={(e) => updateDirector(dirIdx, "spouse", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Number of Children"
                            value={director.children}
                            onChange={(e) => updateDirector(dirIdx, "children", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Current Address */}
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-700 mb-4">
                          Current Address
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <input
                            type="text"
                            placeholder="Address Line 1"
                            value={director.currentAddress.line1}
                            onChange={(e) =>
                              updateDirectorNested(dirIdx, "currentAddress", "line1", e.target.value)
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 sm:col-span-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Address Line 2"
                            value={director.currentAddress.line2}
                            onChange={(e) =>
                              updateDirectorNested(dirIdx, "currentAddress", "line2", e.target.value)
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 sm:col-span-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="City"
                            value={director.currentAddress.city}
                            onChange={(e) =>
                              updateDirectorNested(dirIdx, "currentAddress", "city", e.target.value)
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={director.currentAddress.state}
                            onChange={(e) =>
                              updateDirectorNested(dirIdx, "currentAddress", "state", e.target.value)
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="PIN"
                            value={director.currentAddress.pin}
                            onChange={(e) =>
                              updateDirectorNested(dirIdx, "currentAddress", "pin", e.target.value)
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Permanent Address */}
                      <div>
                        <label className="flex items-center mb-4">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-xs sm:text-sm text-gray-700">
                            Same as Current Address
                          </span>
                        </label>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-700 mb-4">
                          Permanent Address
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <input
                            type="text"
                            placeholder="Address Line 1"
                            value={director.permanentAddress.line1}
                            onChange={(e) =>
                              updateDirectorNested(
                                dirIdx,
                                "permanentAddress",
                                "line1",
                                e.target.value
                              )
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 sm:col-span-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Address Line 2"
                            value={director.permanentAddress.line2}
                            onChange={(e) =>
                              updateDirectorNested(
                                dirIdx,
                                "permanentAddress",
                                "line2",
                                e.target.value
                              )
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 sm:col-span-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="City"
                            value={director.permanentAddress.city}
                            onChange={(e) =>
                              updateDirectorNested(
                                dirIdx,
                                "permanentAddress",
                                "city",
                                e.target.value
                              )
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={director.permanentAddress.state}
                            onChange={(e) =>
                              updateDirectorNested(
                                dirIdx,
                                "permanentAddress",
                                "state",
                                e.target.value
                              )
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="PIN"
                            value={director.permanentAddress.pin}
                            onChange={(e) =>
                              updateDirectorNested(
                                dirIdx,
                                "permanentAddress",
                                "pin",
                                e.target.value
                              )
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Documents */}
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-700 mb-4">Documents</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="text-xs text-gray-600 mb-2 block">
                              PAN Number
                            </label>
                            <input
                              type="text"
                              placeholder="PAN No"
                              value={director.documents.panNo}
                              onChange={(e) =>
                                updateDirectorNested(dirIdx, "documents", "panNo", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-2 block">
                              Upload PAN
                            </label>
                            <input
                              type="file"
                              onChange={(e) =>
                                updateDirectorNested(
                                  dirIdx,
                                  "documents",
                                  "panDoc",
                                  e.target.files?.[0]?.name
                                )
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-2 block">
                              Aadhaar Number
                            </label>
                            <input
                              type="text"
                              placeholder="Aadhaar No"
                              value={director.documents.aadhaarNo}
                              onChange={(e) =>
                                updateDirectorNested(
                                  dirIdx,
                                  "documents",
                                  "aadhaarNo",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-2 block">
                              Upload Aadhaar
                            </label>
                            <input
                              type="file"
                              onChange={(e) =>
                                updateDirectorNested(
                                  dirIdx,
                                  "documents",
                                  "aadhaarDoc",
                                  e.target.files?.[0]?.name
                                )
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bank Details */}
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-700 mb-4">Bank Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                          <input
                            type="text"
                            placeholder="Bank Name"
                            value={director.bank.bankName}
                            onChange={(e) =>
                              updateDirectorNested(dirIdx, "bank", "bankName", e.target.value)
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Account Number"
                            value={director.bank.accountNumber}
                            onChange={(e) =>
                              updateDirectorNested(dirIdx, "bank", "accountNumber", e.target.value)
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="IFSC Code"
                            value={director.bank.ifscCode}
                            onChange={(e) =>
                              updateDirectorNested(dirIdx, "bank", "ifscCode", e.target.value)
                            }
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addDirector}
                  className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 mt-4 text-sm sm:text-base"
                >
                  <Plus size={20} /> Add Director
                </button>
              </div>
            )}

            {/* STEP 3 – LEGAL DETAILS */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                  Legal Details & Documents
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  {/* TIN */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      TIN No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter TIN"
                      value={form.legal.tinNo}
                      onChange={(e) => updateLegal("tinNo", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 mb-3 text-sm"
                    />
                    <label className="text-xs text-gray-600 block mb-2">Upload TIN Document</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateLegal("tinDoc", e.target.files?.[0]?.name)
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* PAN */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      PAN No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter PAN"
                      value={form.legal.panNo}
                      onChange={(e) => updateLegal("panNo", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 mb-3 text-sm"
                    />
                    <label className="text-xs text-gray-600 block mb-2">Upload PAN Document</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateLegal("panDoc", e.target.files?.[0]?.name)
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* GSTIN */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      GSTIN
                    </label>
                    <input
                      type="text"
                      placeholder="Enter GSTIN"
                      value={form.legal.gstin}
                      onChange={(e) => updateLegal("gstin", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 mb-3 text-sm"
                    />
                    <label className="text-xs text-gray-600 block mb-2">Upload GSTIN Document</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateLegal("gstinDoc", e.target.files?.[0]?.name)
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* ET */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      ET No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter ET No"
                      value={form.legal.etNo}
                      onChange={(e) => updateLegal("etNo", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 mb-3 text-sm"
                    />
                    <label className="text-xs text-gray-600 block mb-2">Upload ET Document</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateLegal("etDoc", e.target.files?.[0]?.name)
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* CST */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      CST No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter CST No"
                      value={form.legal.cstNo}
                      onChange={(e) => updateLegal("cstNo", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 mb-3 text-sm"
                    />
                    <label className="text-xs text-gray-600 block mb-2">Upload CST Document</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateLegal("cstDoc", e.target.files?.[0]?.name)
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Udyam */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Udyam Certificate No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Udyam No"
                      value={form.legal.udyamNo}
                      onChange={(e) => updateLegal("udyamNo", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 mb-3 text-sm"
                    />
                    <label className="text-xs text-gray-600 block mb-2">Upload Udyam Document</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateLegal("udyamDoc", e.target.files?.[0]?.name)
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* MSME */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      MSME Certificate No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter MSME No"
                      value={form.legal.msmeNo}
                      onChange={(e) => updateLegal("msmeNo", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 mb-3 text-sm"
                    />
                    <label className="text-xs text-gray-600 block mb-2">Upload MSME Document</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateLegal("msmeDoc", e.target.files?.[0]?.name)
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Trade License */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Trade License No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Trade License No"
                      value={form.legal.tradeLicenseNo}
                      onChange={(e) => updateLegal("tradeLicenseNo", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 mb-3 text-sm"
                    />
                    <label className="text-xs text-gray-600 block mb-2">Upload Trade License</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateLegal("tradeLicenseDoc", e.target.files?.[0]?.name)
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Startup India */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Startup India Certificate
                    </label>
                    <label className="text-xs text-gray-600 block mb-2">Upload Certificate</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateLegal("startupIndiaDoc", e.target.files?.[0]?.name)
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 – BRANCH */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                  Branch Locations
                </h2>

                <div className="border-2 border-gray-300 rounded-lg p-4 bg-blue-50">
                  <label className="flex items-center text-gray-700 font-medium text-sm sm:text-base">
                    <input type="radio" name="branch-option" className="mr-3" defaultChecked />
                    Is company associated with branch?
                  </label>
                  <div className="flex gap-4 sm:gap-6 mt-3 ml-6 text-sm sm:text-base">
                    <label className="flex items-center text-gray-600">
                      <input type="radio" name="branch-assoc" defaultChecked className="mr-2" />
                      Yes
                    </label>
                    <label className="flex items-center text-gray-600">
                      <input type="radio" name="branch-assoc" className="mr-2" />
                      No
                    </label>
                  </div>
                </div>

                {form.branches.map((branch, branchIdx) => (
                  <div key={branchIdx} className="border-2 border-white-200 rounded-lg p-4 sm:p-6 bg-yellow-50">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        Branch {branchIdx + 1}
                      </h3>
                      {form.branches.length > 1 && (
                        <button
                          onClick={() => removeBranch(branchIdx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                        <input
                          type="text"
                          placeholder="Short Name (2 chars)"
                          maxLength="2"
                          value={branch.shortName}
                          onChange={(e) => updateBranch(branchIdx, "shortName", e.target.value)}
                          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Branch Name"
                          value={branch.name}
                          onChange={(e) => updateBranch(branchIdx, "name", e.target.value)}
                          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={branch.city}
                          onChange={(e) => updateBranch(branchIdx, "city", e.target.value)}
                          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={branch.state}
                          onChange={(e) => updateBranch(branchIdx, "state", e.target.value)}
                          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="PIN"
                          value={branch.pin}
                          onChange={(e) => updateBranch(branchIdx, "pin", e.target.value)}
                          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <input
                          type="text"
                          placeholder="Address Line 1"
                          value={branch.address1}
                          onChange={(e) => updateBranch(branchIdx, "address1", e.target.value)}
                          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 sm:col-span-2 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Branch GSTIN"
                          value={branch.gstin}
                          onChange={(e) => updateBranch(branchIdx, "gstin", e.target.value)}
                          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Address Line 2"
                          value={branch.address2}
                          onChange={(e) => updateBranch(branchIdx, "address2", e.target.value)}
                          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 lg:col-span-3 text-sm"
                        />
                      </div>

                      <div className="border-t-2 border-gray-300 pt-4 mt-4">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-700 mb-4">
                          Branch Contact Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <input
                            type="text"
                            placeholder="Contact Person"
                            value={branch.contactPerson}
                            onChange={(e) => updateBranch(branchIdx, "contactPerson", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="tel"
                            placeholder="Contact No"
                            value={branch.contactNo}
                            onChange={(e) => updateBranch(branchIdx, "contactNo", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={branch.email}
                            onChange={(e) => updateBranch(branchIdx, "email", e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addBranch}
                  className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 mt-4 text-sm sm:text-base"
                >
                  <Plus size={20} /> Add Branch
                </button>
              </div>
            )}

            {/* STEP 5 – FINALIZE */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                  Review & Finalize
                </h2>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 sm:p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl sm:text-2xl text-green-600">✓</span>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800">Organisation Details</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {form.organisation.name} - {form.organisation.type} in{" "}
                        {form.organisation.city}, {form.organisation.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xl sm:text-2xl text-green-600">✓</span>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800">Directors Added</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {form.directors.length} director(s) added with contact details
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xl sm:text-2xl text-green-600">✓</span>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800">Legal Documents</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Tax details and certificates uploaded
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xl sm:text-2xl text-green-600">✓</span>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800">Branches Configured</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {form.branches.length} branch location(s) configured
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 sm:p-6">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-3">Next Steps</h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    <li>✓ Modules & permissions setup (next phase)</li>
                    <li>✓ Team member assignments</li>
                    <li>✓ System configuration</li>
                    <li>✓ Go live with your organisation</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-4">
            <button
              onClick={goPrev}
              disabled={step === 0}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-lg font-semibold text-sm sm:text-base text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition w-full sm:w-auto"
            >
              <ChevronLeft size={20} /> Previous
            </button>

            {step < 4 ? (
              <button
                onClick={goNext}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base transition w-full sm:w-auto"
              >
                Next <ChevronLeft size={20} className="rotate-180" />
              </button>
            ) : (
              <button
                onClick={submit}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base transition w-full sm:w-auto"
              >
                <Upload size={20} /> Create Organisation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}