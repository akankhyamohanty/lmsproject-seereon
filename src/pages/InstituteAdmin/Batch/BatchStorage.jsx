// ─── Keys ─────────────────────────────────────────────────────────────────────
export const BATCH_KEY    = "batch_list";
export const FACULTY_KEY  = "faculty_list";
export const STUDENT_KEY  = "student_list";

// ─── Storage Adapter ──────────────────────────────────────────────────────────
// window.storage is only available inside Claude artifact sandbox.
// Falls back to localStorage when running in a normal browser (e.g. Vite dev).
const storage = (typeof window !== "undefined" && window.storage)
  ? window.storage
  : {
      get: async (key) => {
        const value = localStorage.getItem(key);
        return value !== null ? { key, value } : null;
      },
      set: async (key, value) => {
        localStorage.setItem(key, value);
        return { key, value };
      },
      delete: async (key) => {
        localStorage.removeItem(key);
        return { key, deleted: true };
      },
      list: async (prefix = "") => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
        return { keys };
      },
    };

// ─── Departments ──────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  { id: "cs",      name: "Computer Science",    icon: "💻", color: "blue"    },
  { id: "math",    name: "Mathematics",          icon: "📐", color: "violet"  },
  { id: "phys",    name: "Physics",              icon: "⚛️",  color: "cyan"    },
  { id: "chem",    name: "Chemistry",            icon: "🧪", color: "emerald" },
  { id: "bio",     name: "Biology",              icon: "🧬", color: "green"   },
  { id: "mech",    name: "Mechanical Engg.",     icon: "⚙️",  color: "orange"  },
  { id: "civil",   name: "Civil Engg.",          icon: "🏗️",  color: "yellow"  },
  { id: "elec",    name: "Electrical Engg.",     icon: "⚡", color: "amber"   },
  { id: "bba",     name: "Business Admin.",      icon: "💼", color: "rose"    },
  { id: "arts",    name: "Arts & Humanities",    icon: "🎨", color: "pink"    },
  { id: "law",     name: "Law",                  icon: "⚖️",  color: "slate"   },
  { id: "med",     name: "Medical Sciences",     icon: "🏥", color: "red"     },
];

// ─── Courses by Department ────────────────────────────────────────────────────
export const COURSES_BY_DEPT = {
  cs:    ["B.Tech CSE", "M.Tech CSE", "BCA", "MCA", "B.Sc Computer Science"],
  math:  ["B.Sc Mathematics", "M.Sc Mathematics", "B.Sc Statistics"],
  phys:  ["B.Sc Physics", "M.Sc Physics", "B.Sc Applied Physics"],
  chem:  ["B.Sc Chemistry", "M.Sc Chemistry", "B.Sc Biochemistry"],
  bio:   ["B.Sc Biology", "M.Sc Biology", "B.Sc Microbiology", "B.Sc Biotechnology"],
  mech:  ["B.Tech Mechanical", "M.Tech Mechanical", "Diploma Mechanical"],
  civil: ["B.Tech Civil", "M.Tech Civil", "Diploma Civil"],
  elec:  ["B.Tech Electrical", "B.Tech Electronics", "M.Tech Electrical"],
  bba:   ["BBA", "MBA", "B.Com", "M.Com"],
  arts:  ["B.A. English", "B.A. History", "B.A. Political Science", "M.A. English"],
  law:   ["LLB", "LLM", "BA LLB", "BBA LLB"],
  med:   ["MBBS", "BDS", "B.Pharm", "M.Pharm", "B.Sc Nursing"],
};

// ─── Academic Years ───────────────────────────────────────────────────────────
export const ACADEMIC_YEARS = [
  "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26", "2026-27",
];

// ─── Color Map ────────────────────────────────────────────────────────────────
export const COLOR_MAP = {
  blue:    { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700",    active: "bg-blue-600 border-blue-600 text-white"    },
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700",  active: "bg-violet-600 border-violet-600 text-white"  },
  cyan:    { bg: "bg-cyan-50",    border: "border-cyan-200",    text: "text-cyan-700",    active: "bg-cyan-600 border-cyan-600 text-white"    },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", active: "bg-emerald-600 border-emerald-600 text-white" },
  green:   { bg: "bg-green-50",   border: "border-green-200",   text: "text-green-700",   active: "bg-green-600 border-green-600 text-white"   },
  orange:  { bg: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-700",  active: "bg-orange-500 border-orange-500 text-white"  },
  yellow:  { bg: "bg-yellow-50",  border: "border-yellow-200",  text: "text-yellow-700",  active: "bg-yellow-500 border-yellow-500 text-white"  },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   active: "bg-amber-500 border-amber-500 text-white"   },
  rose:    { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700",    active: "bg-rose-600 border-rose-600 text-white"    },
  pink:    { bg: "bg-pink-50",    border: "border-pink-200",    text: "text-pink-700",    active: "bg-pink-600 border-pink-600 text-white"    },
  slate:   { bg: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-700",   active: "bg-slate-600 border-slate-600 text-white"   },
  red:     { bg: "bg-red-50",     border: "border-red-200",     text: "text-red-700",     active: "bg-red-600 border-red-600 text-white"     },
};

// ─── Batch CRUD ───────────────────────────────────────────────────────────────
export const getBatches = async () => {
  try {
    const result = await storage.get(BATCH_KEY);
    return result ? JSON.parse(result.value) : [];
  } catch {
    return [];
  }
};

export const saveBatches = async (batches) => {
  await storage.set(BATCH_KEY, JSON.stringify(batches));
};

export const addBatch = async (batch) => {
  const batches = await getBatches();
  batches.push(batch);
  await saveBatches(batches);
};

export const updateBatch = async (id, updates) => {
  const batches = (await getBatches()).map(b => b.id === id ? { ...b, ...updates } : b);
  await saveBatches(batches);
};

export const deleteBatch = async (id) => {
  await saveBatches((await getBatches()).filter(b => b.id !== id));
};

export const getBatchById = async (id) => {
  return (await getBatches()).find(b => b.id === Number(id)) || null;
};

// ─── Faculty helpers ──────────────────────────────────────────────────────────
export const getFaculty = async () => {
  try {
    const result = await storage.get(FACULTY_KEY);
    return result ? JSON.parse(result.value) : [];
  } catch {
    return [];
  }
};

// ─── Student helpers ──────────────────────────────────────────────────────────
export const getStudents = async () => {
  try {
    const result = await storage.get(STUDENT_KEY);
    return result ? JSON.parse(result.value) : [];
  } catch {
    return [];
  }
};