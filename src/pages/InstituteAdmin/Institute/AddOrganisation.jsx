import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganisationStep from "./steps/OrganisationStep";
import DirectorsStep from "./steps/DirectorsStep";
import LegalStep from "./steps/LegalStep";
import BranchStep from "./steps/BranchStep";
import ReviewStep from "./steps/ReviewStep";

export default function AddOrganisation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    organisation: {},
    directors: [{}],
    legal: {},
    branches: [{}],
  });

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const finish = () => {
    const stored = JSON.parse(localStorage.getItem("institutes")) || [];
    localStorage.setItem(
      "institutes",
      JSON.stringify([...stored, data])
    );
    navigate("/admin/institute");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {step === 1 && <OrganisationStep data={data} setData={setData} next={next} />}
      {step === 2 && <DirectorsStep data={data} setData={setData} next={next} prev={prev} />}
      {step === 3 && <LegalStep data={data} setData={setData} next={next} prev={prev} />}
      {step === 4 && <BranchStep data={data} setData={setData} next={next} prev={prev} />}
      {step === 5 && <ReviewStep data={data} prev={prev} finish={finish} />}
    </div>
  );
}
