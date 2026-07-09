"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ContactLinkInput = { label: string; url: string };
type SkillInput = {
  key: string;
  name: string;
  iconSlug: string;
  iconUrl: string;
  category: string;
};

type EditProfileFormProps = {
  initial: {
    name: string;
    bio: string;
    photoUrl: string | null;
    email: string;
    contactLinks: ContactLinkInput[];
    skills: {
      name: string;
      iconSlug: string | null;
      iconUrl: string | null;
      category: string | null;
    }[];
  };
};

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
const addBtnClass =
  "text-sm font-medium text-blue-400 transition-colors hover:text-blue-300";
const removeBtnClass =
  "shrink-0 rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-400 transition-colors hover:border-red-500/50 hover:text-red-400";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-neutral-300">{label}</span>
      {children}
    </label>
  );
}

function makeKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function EditProfileForm({ initial }: EditProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [bio, setBio] = useState(initial.bio);
  const [photoUrl, setPhotoUrl] = useState(initial.photoUrl ?? "");
  const [email, setEmail] = useState(initial.email);
  const [contactLinks, setContactLinks] = useState<ContactLinkInput[]>(
    initial.contactLinks,
  );
  const [skills, setSkills] = useState<SkillInput[]>(
    initial.skills.map((skill) => ({
      key: makeKey(),
      name: skill.name,
      iconSlug: skill.iconSlug ?? "",
      iconUrl: skill.iconUrl ?? "",
      category: skill.category ?? "",
    })),
  );
  const [status, setStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateContactLink(
    index: number,
    field: keyof ContactLinkInput,
    value: string,
  ) {
    setContactLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    );
  }

  function updateSkill(
    index: number,
    field: keyof Omit<SkillInput, "key">,
    value: string,
  ) {
    setSkills((prev) =>
      prev.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill,
      ),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const payload = {
      name,
      bio,
      photoUrl: photoUrl || null,
      email,
      contactLinks: contactLinks.filter(
        (link) => link.label.trim() && link.url.trim(),
      ),
      skills: skills
        .filter((skill) => skill.name.trim())
        .map((skill) => ({
          name: skill.name,
          iconSlug: skill.iconSlug || null,
          iconUrl: skill.iconUrl || null,
          category: skill.category || null,
        })),
    };

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrorMessage(data?.error ?? "Gagal menyimpan perubahan.");
      setStatus("error");
      return;
    }

    setStatus("success");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Field label="Nama">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Foto (URL)">
          <input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows={4}
            className={inputClass}
          />
        </Field>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-300">
            Contact Links
          </h2>
          <button
            type="button"
            onClick={() =>
              setContactLinks((prev) => [...prev, { label: "", url: "" }])
            }
            className={addBtnClass}
          >
            + Tambah
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {contactLinks.map((link, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-neutral-800 p-3 sm:flex-row sm:items-center sm:border-0 sm:p-0"
            >
              <input
                placeholder="Label (mis. GitHub)"
                value={link.label}
                onChange={(e) => updateContactLink(i, "label", e.target.value)}
                className={`${inputClass} sm:flex-1`}
              />
              <input
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateContactLink(i, "url", e.target.value)}
                className={`${inputClass} sm:flex-1`}
              />
              <button
                type="button"
                onClick={() =>
                  setContactLinks((prev) => prev.filter((_, idx) => idx !== i))
                }
                className={`${removeBtnClass} sm:shrink-0`}
              >
                Hapus
              </button>
            </div>
          ))}
          {contactLinks.length === 0 && (
            <p className="text-sm text-neutral-500">Belum ada contact link.</p>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-300">Skills</h2>
          <button
            type="button"
            onClick={() =>
              setSkills((prev) => [
                ...prev,
                { key: makeKey(), name: "", iconSlug: "", iconUrl: "", category: "" },
              ])
            }
            className={addBtnClass}
          >
            + Tambah
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {skills.map((skill, i) => (
            <div
              key={skill.key}
              className="grid grid-cols-2 gap-2 rounded-lg border border-neutral-800 p-3 sm:grid-cols-4"
            >
              <input
                placeholder="Nama (mis. React)"
                value={skill.name}
                onChange={(e) => updateSkill(i, "name", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Icon slug (simple-icons)"
                value={skill.iconSlug}
                onChange={(e) => updateSkill(i, "iconSlug", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Icon URL (opsional)"
                value={skill.iconUrl}
                onChange={(e) => updateSkill(i, "iconUrl", e.target.value)}
                className={inputClass}
              />
              <div className="col-span-2 flex gap-2 sm:col-span-1">
                <input
                  placeholder="Kategori"
                  value={skill.category}
                  onChange={(e) => updateSkill(i, "category", e.target.value)}
                  className={`${inputClass} min-w-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setSkills((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className={`${removeBtnClass} shrink-0`}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-neutral-500">Belum ada skill.</p>
          )}
        </div>
      </section>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-green-400">Perubahan tersimpan.</p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="self-start rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "saving" ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
