import React, { useEffect, useState } from "react";
import { Loader2, Pencil, X, Save } from "lucide-react";

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  dob: string;
  gender: string;
  country: string;
  securityAnswer: string;
  profileImage?: string;
  total_earnings: string;
  pending_payments: string;
  createdAt: string;
  updatedAt: string;
};

const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<Partial<User>>({});
  const [loading, setLoad] = useState(false);
  const [error, setErr] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("gigpesa_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setForm(parsed);
      setUser(parsed);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setForm((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file),
      }));
    }
  };

  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem("gigpesa_token");
      if (!token) return;

      const res = await fetch("http://192.168.1.24:5000/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUser(data);
      setForm(data);
      sessionStorage.setItem("gigpesa_user", JSON.stringify(data));
    } catch (err) {
      console.error("Error fetching user:", err);
      setErr("Failed to fetch user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (k: keyof User, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const saveChanges = async () => {
    if (!user) return;
    setLoad(true);
    setErr(null);

    try {
      const token = sessionStorage.getItem("gigpesa_token");
      if (!token) return;

      const formData = new FormData();
      const { ...formToUpdate } = form;

      for (const [key, value] of Object.entries(formToUpdate)) {
        if (value) formData.append(key, value);
      }

      if (profileFile) {
        formData.append("profileImage", profileFile);
      }

      const res = await fetch(`http://192.168.1.24:5000/api/profileUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      await fetchUser();
      setEdit(false);
    } catch (err) {
      console.error("Update error:", err);
      setErr("Failed to update profile");
    } finally {
      setLoad(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto m-auto p-6 my-10 bg-white shadow rounded-xl">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-green-700">
            Profile Settings
          </h2>
        </div>

        {edit ? (
          <button
            onClick={() => setEdit(false)}
            className="flex items-center gap-1 text-sm text-red-600 hover:underline"
          >
            <X size={16} /> Cancel
          </button>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="flex items-center gap-1 text-sm text-green-700 hover:underline"
          >
            <Pencil size={16} /> Edit
          </button>
        )}
      </header>

      {!edit && user.profileImage && (
        <div className="flex justify-center mb-6 border-green-600 shadow-xl object-cover w-24 h-24 rounded-full m-auto  border">
          <img
            src={
              "http://192.168.1.24:5000/static/uploads/" + form?.profileImage
            }
            alt="Profile"
            className="w-23 h-23 rounded-full  p-0.5 "
          />
        </div>
      )}

      {error && (
        <div className="mb-4 rounded bg-red-50 border border-red-200 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {edit && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>

            {profileFile ? (
              <div className="flex justify-center mb-6 border-blue-500 shadow-xl object-cover w-24 h-24 rounded-full  border">
                <img
                  src={URL.createObjectURL(profileFile)}
                  alt="New Preview"
                  className="w-23 h-23 rounded-full p-0.5 "
                />
              </div>
            ) : form.profileImage ? (
              <div className="flex justify-center mb-6 border-blue-500 shadow-xl object-cover w-24 h-24 rounded-full  border">
                <img
                  src={`http://192.168.1.24:5000/static/uploads/${form.profileImage}`}
                  alt="Current"
                  className="w-23 h-23 rounded-full p-0.5 "
                />
              </div>
            ) : null}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-700"
            />
          </div>
        )}

        <Field
          label="Full Name"
          value={form.name}
          editable={edit}
          onChange={(v) => handleChange("name", v)}
        />

        <Display label="Username" value={`${user.username}`} />

        <Display label="email" value={`${user.email}`} />

        <Field
          label="Date of Birth"
          value={form.dob}
          editable={edit}
          onChange={(v) => handleChange("dob", v)}
          type="date"
        />
        <Field
          label="Gender"
          value={form.gender}
          editable={edit}
          onChange={(v) => handleChange("gender", v)}
        />
        <Field
          label="Country"
          value={form.country}
          editable={edit}
          onChange={(v) => handleChange("country", v)}
        />
        <Field
          label="Security Answer"
          value={form.securityAnswer}
          editable={edit}
          onChange={(v) => handleChange("securityAnswer", v)}
        />
      </div>

      {edit && (
        <div className="flex justify-end mt-6">
          <button
            onClick={saveChanges}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            <Save size={16} />
            Save changes
          </button>
        </div>
      )}
    </div>
  );
};

type FieldProps = {
  label: string;
  value?: string;
  editable: boolean;
  onChange: (v: string) => void;
  type?: "text" | "email" | "date";
};

const Field: React.FC<FieldProps> = ({
  label,
  value = "",
  editable,
  onChange,
  type = "text",
}) => {
  const common =
    "h-10 w-full border border-gray-300 rounded-xl px-3 py-2 text-base";

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>

      {editable ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${common} bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600`}
        />
      ) : (
        <input
          type="text"
          value={value || "—"}
          disabled
          className={`${common} bg-gray-100 cursor-not-allowed text-gray-900`}
        />
      )}
    </div>
  );
};

const Display = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      disabled
      className="h-10 w-full border border-gray-300 bg-gray-100 text-gray-900 px-3 py-2 rounded-xl cursor-not-allowed"
    />
  </div>
);

export default Settings;
