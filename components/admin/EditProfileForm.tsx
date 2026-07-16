"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, FormSection, inputClass } from "@/components/FormField";
import { Button } from "@/components/ui/Button";
import { CvUpload } from "@/components/ui/CvUpload";
import { ImageUpload } from "@/components/ui/ImageUpload";

type ContactLinkInput = { label: string; url: string };
type SkillInput = {
  key: string;
  name: string;
  iconSlug: string;
  iconUrl: string;
  category: string;
};
type TaglineInput = { key: string; value: string };
type GalleryPhotoInput = { key: string; url: string };

type EditProfileFormProps = {
  initial: {
    name: string;
    bio: string;
    photoUrl: string | null;
    email: string;
    contactLinks: ContactLinkInput[];
    taglines: string[];
    galleryPhotos: string[];
    cvUrl: string | null;
    heroPhotoUrl: string | null;
    heroBio: string | null;
    skills: {
      name: string;
      iconSlug: string | null;
      iconUrl: string | null;
      category: string | null;
    }[];
  };
};

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
  const [taglines, setTaglines] = useState<TaglineInput[]>(
    initial.taglines.map((value) => ({ key: makeKey(), value })),
  );
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoInput[]>(
    initial.galleryPhotos.map((url) => ({ key: makeKey(), url })),
  );
  const [cvUrl, setCvUrl] = useState(initial.cvUrl ?? "");
  const [heroPhotoUrl, setHeroPhotoUrl] = useState(initial.heroPhotoUrl ?? "");
  const [heroBio, setHeroBio] = useState(initial.heroBio ?? "");
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
      taglines: taglines
        .map((tagline) => tagline.value.trim())
        .filter(Boolean),
      galleryPhotos: galleryPhotos
        .map((photo) => photo.url.trim())
        .filter(Boolean),
      cvUrl: cvUrl || null,
      heroPhotoUrl: heroPhotoUrl || null,
      heroBio: heroBio || null,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormSection title="Info Dasar">
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
        <ImageUpload
          value={photoUrl || null}
          onChange={(url) => setPhotoUrl(url)}
          label="Foto Profil (About & navbar)"
        />
        <Field label="Bio (About)">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows={4}
            className={inputClass}
          />
        </Field>
        <CvUpload value={cvUrl || null} onChange={(url) => setCvUrl(url)} />
      </FormSection>

      <FormSection
        title="Hero Home"
        description="Foto & kalimat pendek khusus buat hero halaman Home — sengaja terpisah dari foto/bio About supaya tidak ketampil sama persis di dua tempat. Kosongkan kalau mau pakai foto/bio About sebagai gantinya."
      >
        <ImageUpload
          value={heroPhotoUrl || null}
          onChange={(url) => setHeroPhotoUrl(url)}
          label="Foto Hero (opsional)"
        />
        <Field label="Kalimat Pendek Hero (opsional)">
          <textarea
            value={heroBio}
            onChange={(e) => setHeroBio(e.target.value)}
            rows={2}
            placeholder="mis. Membangun produk web yang rapi dari desain sampai deploy."
            className={inputClass}
          />
        </Field>
      </FormSection>

      <FormSection
        title="Galeri Foto (About)"
        description="Foto-foto yang ditampilkan sebagai panel galeri di halaman About."
        action={
          <Button
            type="button"
            onClick={() =>
              setGalleryPhotos((prev) => [...prev, { key: makeKey(), url: "" }])
            }
            variant="ghost"
            size="sm"
          >
            + Tambah
          </Button>
        }
      >
        {galleryPhotos.map((photo, i) => (
          <div
            key={photo.key}
            className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3 sm:flex-row sm:items-center"
          >
            <div className="flex-1">
              <ImageUpload
                value={photo.url || null}
                onChange={(url) =>
                  setGalleryPhotos((prev) =>
                    prev.map((p, idx) => (idx === i ? { ...p, url } : p)),
                  )
                }
                label={`Foto #${i + 1}`}
              />
            </div>
            <Button
              type="button"
              onClick={() =>
                setGalleryPhotos((prev) => prev.filter((_, idx) => idx !== i))
              }
              variant="danger"
              size="sm"
              className="sm:shrink-0"
            >
              Hapus
            </Button>
          </div>
        ))}
        {galleryPhotos.length === 0 && (
          <p className="text-sm text-subtle-foreground">
            Belum ada foto galeri.
          </p>
        )}
      </FormSection>

      <FormSection
        title="Contact Links"
        action={
          <Button
            type="button"
            onClick={() =>
              setContactLinks((prev) => [...prev, { label: "", url: "" }])
            }
            variant="ghost"
            size="sm"
          >
            + Tambah
          </Button>
        }
      >
        {contactLinks.map((link, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3 sm:flex-row sm:items-center"
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
            <Button
              type="button"
              onClick={() =>
                setContactLinks((prev) => prev.filter((_, idx) => idx !== i))
              }
              variant="danger"
              size="sm"
              className="sm:shrink-0"
            >
              Hapus
            </Button>
          </div>
        ))}
        {contactLinks.length === 0 && (
          <p className="text-sm text-subtle-foreground">
            Belum ada contact link.
          </p>
        )}
      </FormSection>

      <FormSection
        title="Taglines"
        description="Teks yang bergantian tampil di hero halaman Home."
        action={
          <Button
            type="button"
            onClick={() =>
              setTaglines((prev) => [...prev, { key: makeKey(), value: "" }])
            }
            variant="ghost"
            size="sm"
          >
            + Tambah
          </Button>
        }
      >
        {taglines.map((tagline, i) => (
          <div key={tagline.key} className="flex gap-2">
            <input
              placeholder="mis. Full-Stack Developer"
              value={tagline.value}
              onChange={(e) =>
                setTaglines((prev) =>
                  prev.map((t, idx) =>
                    idx === i ? { ...t, value: e.target.value } : t,
                  ),
                )
              }
              className={`${inputClass} min-w-0 flex-1`}
            />
            <Button
              type="button"
              onClick={() =>
                setTaglines((prev) => prev.filter((_, idx) => idx !== i))
              }
              variant="danger"
              size="sm"
              className="shrink-0"
            >
              Hapus
            </Button>
          </div>
        ))}
        {taglines.length === 0 && (
          <p className="text-sm text-subtle-foreground">Belum ada tagline.</p>
        )}
      </FormSection>

      <FormSection
        title="Skills"
        action={
          <Button
            type="button"
            onClick={() =>
              setSkills((prev) => [
                ...prev,
                { key: makeKey(), name: "", iconSlug: "", iconUrl: "", category: "" },
              ])
            }
            variant="ghost"
            size="sm"
          >
            + Tambah
          </Button>
        }
      >
        {skills.map((skill, i) => (
          <div
            key={skill.key}
            className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-background p-3 sm:grid-cols-4"
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
              <Button
                type="button"
                onClick={() =>
                  setSkills((prev) => prev.filter((_, idx) => idx !== i))
                }
                variant="danger"
                size="sm"
                className="shrink-0"
              >
                Hapus
              </Button>
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-subtle-foreground">Belum ada skill.</p>
        )}
      </FormSection>

      {errorMessage && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-success">Perubahan tersimpan.</p>
      )}

      <Button
        type="submit"
        disabled={status === "saving"}
        variant="primary"
        tone="bold"
        className="self-start"
      >
        {status === "saving" ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
