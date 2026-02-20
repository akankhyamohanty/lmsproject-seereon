import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  Building2, Phone, Mail, MapPin,
  Users, FileText, GitBranch
} from "lucide-react";

const statusStyles = {
  Active:    "bg-green-100 text-green-700 border border-green-300",
  Suspended: "bg-red-100 text-red-700 border border-red-300",
  Trial:     "bg-blue-100 text-blue-700 border border-blue-300",
};

const formatText = (text = "") =>
  text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/* ── Reusable info row ── */
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b last:border-0">
    <span className="text-sm font-semibold text-gray-500 sm:w-52 shrink-0">{label}</span>
    <span className="text-sm text-gray-800">{value || "—"}</span>
  </div>
);

/* ── Reusable section card ── */
const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4">
      <Icon size={18} className="text-blue-600" />
      {title}
    </h3>
    {children}
  </div>
);

export default function Institute() {
  const { user } = useAuth();
  const [institute, setInstitute] = useState(null);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("institutes")) || [];
    // Match by user.instituteId; fallback to first record if not set
    const found = all.find((i) => i.id === user?.instituteId) || all[0] || null;
    setInstitute(found);
  }, [user]);

  /* ── Empty state ── */
  if (!institute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Building2 size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No institute details found.</p>
          <p className="text-sm mt-1">Please contact your Super Admin.</p>
        </div>
      </div>
    );
  }

  const org       = institute.organisation || {};
  const branches  = institute.branches     || [];
  const directors = institute.directors    || [];
  const legal     = institute.legal        || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-8xl space-y-6">

        {/* ── HEADER BANNER ── */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Building2 size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {formatText(org.name)}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {org.type} &nbsp;·&nbsp; {formatText(org.city)}, {formatText(org.state)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusStyles[institute.status]}`}>
              {institute.status}
            </span>
            <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-300">
              {institute.plan || "Premium"}
            </span>
          </div>
        </div>

        {/* ── ORGANISATION DETAILS ── */}
        <SectionCard title="Organisation Details" icon={Building2}>
          <InfoRow label="Registered Name"   value={formatText(org.name)} />
          <InfoRow label="Organisation Type" value={org.type} />
          <InfoRow label="Phone"             value={org.phone} />
          <InfoRow label="Alternate Phone"   value={org.altPhone} />
          <InfoRow label="Email"             value={org.email} />
          <InfoRow label="Secondary Email"   value={org.secondaryEmail} />
          <InfoRow label="Address Line 1"    value={formatText(org.address1)} />
          <InfoRow label="Address Line 2"    value={formatText(org.address2)} />
          <InfoRow label="City"              value={formatText(org.city)} />
          <InfoRow label="State"             value={formatText(org.state)} />
          <InfoRow label="PIN Code"          value={org.pin} />
          <InfoRow label="Head Office"       value={formatText(org.headOffice)} />
          <InfoRow
            label="Member Since"
            value={
              institute.createdAt
                ? new Date(institute.createdAt).toLocaleDateString()
                : "—"
            }
          />
        </SectionCard>

        {/* ── DIRECTORS ── */}
        {directors.length > 0 && (
          <SectionCard title={`Directors / Partners (${directors.length})`} icon={Users}>
            <div className="space-y-4">
              {directors.map((d, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <p className="font-bold text-gray-800 mb-3">
                    Director {i + 1}{d.name ? ` — ${formatText(d.name)}` : ""}
                  </p>
                  <InfoRow label="Email"         value={d.email} />
                  <InfoRow label="Contact"       value={d.contact} />
                  <InfoRow label="Mobile"        value={d.mobile} />
                  <InfoRow label="Gender"        value={d.gender} />
                  <InfoRow label="Date of Birth" value={d.dob} />
                  <InfoRow
                    label="% of Interest"
                    value={d.interest ? `${d.interest}%` : null}
                  />
                  <InfoRow
                    label="Current Address"
                    value={[
                      d.currentAddress?.line1,
                      d.currentAddress?.city,
                      d.currentAddress?.state,
                      d.currentAddress?.pin,
                    ]
                      .filter(Boolean)
                      .map(formatText)
                      .join(", ")}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── LEGAL & FINANCIAL ── */}
        <SectionCard title="Legal & Financial" icon={FileText}>
          <InfoRow label="PAN Number"  value={legal.panNo} />
          <InfoRow label="GSTIN"       value={legal.gstinNo} />
          <InfoRow label="DISE Code"   value={legal.diseCode} />
          <InfoRow label="Affiliation" value={legal.affiliation} />
          <InfoRow label="Trust Deed"  value={legal.trustDeed} />
          <InfoRow label="Bank Account" value={legal.bankAccount} />
        </SectionCard>

        {/* ── BRANCHES ── */}
        {branches.length > 0 && (
          <SectionCard title={`Branches (${branches.length})`} icon={GitBranch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {branches.map((b, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4 bg-gray-50 space-y-1.5">
                  <p className="font-bold text-gray-800">
                    {b.name || `Branch ${i + 1}`}
                    {b.shortName && (
                      <span className="ml-2 text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        {b.shortName}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <MapPin size={13} />
                    {formatText(b.city)}, {formatText(b.state)} — {b.pin}
                  </p>
                  {b.contactPerson && (
                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                      <Users size={13} /> {b.contactPerson}
                    </p>
                  )}
                  {b.contactNo && (
                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                      <Phone size={13} /> {b.contactNo}
                    </p>
                  )}
                  {b.email && (
                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                      <Mail size={13} /> {b.email}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

      </div>
    </div>
  );
}