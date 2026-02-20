import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Building2, Phone, Mail, MapPin, Calendar, CreditCard,
  Users, FileText, ChevronLeft, Landmark, ShieldCheck,
  Droplets, Zap, TreePine, BookOpen, ScrollText, BadgeCheck
} from "lucide-react";

const formatText = (text = "") =>
  text?.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const statusStyles = {
  Active:    "bg-green-100 text-green-700 border border-green-300",
  Suspended: "bg-red-100 text-red-700 border border-red-300",
  Trial:     "bg-blue-100 text-blue-700 border border-blue-300",
};

/* ── small reusable pieces ─────────────────────────────────────── */
const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50">
      <Icon size={18} className="text-blue-600" />
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const DocRow = ({ label, value, doc }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="flex items-center gap-3">
      {value && <span className="text-sm font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{value}</span>}
      {doc
        ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><BadgeCheck size={11} /> Uploaded</span>
        : <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">No file</span>
      }
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════ */
export default function InstituteView() {
  const { id }       = useParams();
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const [inst, setInst] = useState(null);

  /* Load from router state OR localStorage */
  useEffect(() => {
    if (state?.institute) {
      setInst(state.institute);
    } else {
      const all = JSON.parse(localStorage.getItem("institutes")) || [];
      const found = all.find((i) => String(i.id) === String(id));
      if (found) setInst(found);
    }
  }, [id, state]);

  if (!inst) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Institute not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 text-sm hover:underline">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const org      = inst.organisation || {};
  const legal    = inst.legal        || {};
  const directors = inst.directors   || [];
  const branches  = inst.branches    || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ── BACK ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition"
        >
          <ChevronLeft size={18} /> Back to Institute List
        </button>

        {/* ── HERO HEADER ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                {org.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {formatText(org.name)}
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">{org.type} · {formatText(org.city)}, {formatText(org.state)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusStyles[inst.status] || "bg-gray-100 text-gray-600"}`}>
                {inst.status || "Unknown"}
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                {inst.plan || "Premium"}
              </span>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{directors.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Directors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{branches.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Branches</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-blue-600 truncate">{org.city ? formatText(org.city) : "—"}</p>
              <p className="text-xs text-gray-400 mt-0.5">City</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-blue-600">
                {inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Created</p>
            </div>
          </div>
        </div>

        {/* ── ORGANISATION DETAILS ── */}
        <SectionCard title="Organisation Details" icon={Building2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Registered Name"    value={formatText(org.name)} />
            <Field label="Organisation Type"  value={org.type} />
            <Field label="Phone Number"       value={org.phone} />
            <Field label="Alternate Phone"    value={org.altPhone} />
            <Field label="Email Address"      value={org.email} />
            <Field label="Secondary Email"    value={org.secondaryEmail} />
            <Field label="City"               value={formatText(org.city)} />
            <Field label="State"              value={formatText(org.state)} />
            <Field label="PIN Code"           value={org.pin} />
            <Field label="Head Office"        value={formatText(org.headOffice)} />
            <div className="sm:col-span-2 lg:col-span-3">
              <Field
                label="Address"
                value={[org.address1, org.address2].filter(Boolean).join(", ") || "—"}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── DIRECTORS ── */}
        {directors.length > 0 && (
          <SectionCard title={`Directors / Partners (${directors.length})`} icon={Users}>
            <div className="space-y-6">
              {directors.map((d, idx) => (
                <div key={idx} className={`${idx > 0 ? "pt-6 border-t border-gray-100" : ""}`}>
                  <p className="text-sm font-bold text-blue-600 mb-3">Director {idx + 1} — {formatText(d.name)}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Field label="Email"         value={d.email} />
                    <Field label="Contact"        value={d.contact} />
                    <Field label="Mobile"         value={d.mobile} />
                    <Field label="WhatsApp"       value={d.whatsapp} />
                    <Field label="Gender"         value={d.gender} />
                    <Field label="Date of Birth"  value={d.dob} />
                    <Field label="% of Interest"  value={d.interest ? `${d.interest}%` : null} />
                    <Field label="Father's Name"  value={formatText(d.father)} />
                    <Field label="Spouse Name"    value={formatText(d.spouse)} />

                    {/* Bank */}
                    {(d.bank?.bankName || d.bank?.accountNumber) && (
                      <>
                        <div className="sm:col-span-2 lg:col-span-3 mt-2">
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Bank Details</p>
                        </div>
                        <Field label="Bank Name"       value={d.bank?.bankName} />
                        <Field label="Account Number"  value={d.bank?.accountNumber} />
                        <Field label="IFSC Code"       value={d.bank?.ifscCode} />
                      </>
                    )}

                    {/* Addresses */}
                    {d.currentAddress?.line1 && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <Field
                          label="Current Address"
                          value={[d.currentAddress.line1, d.currentAddress.line2, formatText(d.currentAddress.city), formatText(d.currentAddress.state), d.currentAddress.pin].filter(Boolean).join(", ")}
                        />
                      </div>
                    )}
                    {d.permanentAddress?.line1 && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <Field
                          label="Permanent Address"
                          value={[d.permanentAddress.line1, d.permanentAddress.line2, formatText(d.permanentAddress.city), formatText(d.permanentAddress.state), d.permanentAddress.pin].filter(Boolean).join(", ")}
                        />
                      </div>
                    )}

                    {/* Documents */}
                    {(d.documents?.panNo || d.documents?.aadhaarNo) && (
                      <>
                        <Field label="PAN Number"     value={d.documents?.panNo} />
                        <Field label="Aadhaar Number" value={d.documents?.aadhaarNo} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── LEGAL DOCUMENTS ── */}
        <SectionCard title="Legal Documents" icon={FileText}>
          <div className="space-y-6">

            {/* Land & Building */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <Landmark size={13} /> Land & Building
              </p>
              <DocRow label="Property Deed"                  value={legal.propertyDeed}          doc={legal.propertyDeedDoc} />
              <DocRow label="Building Approval"              value={legal.buildingApproval}       doc={legal.buildingApprovalDoc} />
              <DocRow label="Building Completion Certificate" value={legal.completionCertificate} doc={legal.completionCertificateDoc} />
            </div>

            {/* NOCs */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <ShieldCheck size={13} /> No Objection Certificates
              </p>
              <DocRow label="Fire Department NOC"       value={legal.fireNOC}           doc={legal.fireNOCDoc} />
              <DocRow label="Police NOC"                value={legal.policeNOC}          doc={legal.policeNOCDoc} />
              <DocRow label="Municipality NOC"          value={legal.municipalityNOC}    doc={legal.municipalityNOCDoc} />
              <DocRow label="Education Department NOC"  value={legal.educationDeptNOC}   doc={legal.educationDeptNOCDoc} />
              <DocRow label="Pollution Control NOC"     value={legal.pollutionNOC}       doc={legal.pollutionNOCDoc} />
            </div>

            {/* Infrastructure */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <Zap size={13} /> Infrastructure & Safety
              </p>
              <DocRow label="Water Connection"           value={legal.waterConnection}        doc={legal.waterConnectionDoc} />
              <DocRow label="Electricity Connection"     value={legal.electricityConnection}  doc={legal.electricityConnectionDoc} />
              <DocRow label="Safety Audit Report"        value={legal.safetyAudit}            doc={legal.safetyAuditDoc} />
              <DocRow label="Drainage System"            value={legal.drainageSystem}         doc={legal.drainageSystemDoc} />
            </div>

            {/* Financial */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <CreditCard size={13} /> Financial & Administrative
              </p>
              <DocRow label="PAN"                       value={legal.panNo}        doc={legal.panDoc} />
              <DocRow label="GSTIN"                     value={legal.gstinNo}      doc={legal.gstinDoc} />
              <DocRow label="Bank Account"              value={legal.bankAccount}  doc={legal.bankAccountDoc} />
              <DocRow label="Trust Deed / Society Reg." value={legal.trustDeed}    doc={legal.trustDeedDoc} />
            </div>

            {/* Education */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <BookOpen size={13} /> Education Registration
              </p>
              <DocRow label="DISE Code"                        value={legal.diseCode}                 doc={legal.disecodeDoc} />
              <DocRow label="Provisional Recognition"          value={legal.provisionalRecognition}   doc={legal.provisionalRecognitionDoc} />
              <DocRow label="Board Affiliation Certificate"    value={legal.affiliation}              doc={legal.affiliationDoc} />
            </div>

            {/* Policies */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <ScrollText size={13} /> Mandatory Policies
              </p>
              <DocRow label="Child Protection Policy"    value={legal.childProtectionPolicy}  doc={legal.childProtectionPolicyDoc} />
              <DocRow label="Harassment Prevention"      value={legal.harassmentPolicy}        doc={legal.harassmentPolicyDoc} />
              <DocRow label="Admission Policy"           value={legal.admissionPolicy}         doc={legal.admissionPolicyDoc} />
              <DocRow label="Fee Structure Document"     value={legal.feeStructure}            doc={legal.feeStructureDoc} />
            </div>

          </div>
        </SectionCard>

        {/* ── BRANCHES ── */}
        {branches.length > 0 && (
          <SectionCard title={`Branch Locations (${branches.length})`} icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((b, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-blue-50/40">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-800">
                      {b.name ? formatText(b.name) : `Branch ${idx + 1}`}
                    </p>
                    {b.shortName && (
                      <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                        {b.shortName.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="City"           value={formatText(b.city)} />
                    <Field label="State"          value={formatText(b.state)} />
                    <Field label="PIN"            value={b.pin} />
                    <Field label="GSTIN"          value={b.gstin} />
                    <Field label="Contact Person" value={formatText(b.contactPerson)} />
                    <Field label="Contact No"     value={b.contactNo} />
                    <div className="col-span-2">
                      <Field label="Email"        value={b.email} />
                    </div>
                    {b.address1 && (
                      <div className="col-span-2">
                        <Field label="Address"    value={[b.address1, b.address2].filter(Boolean).join(", ")} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── FOOTER META ── */}
        <div className="text-center text-xs text-gray-400 pb-4">
          Institute ID: {inst.id} · Created: {inst.createdAt || "—"}
        </div>

      </div>
    </div>
  );
}