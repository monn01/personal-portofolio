import Link from "next/link";
import { MailIcon } from "@/components/admin/AdminNavIcons";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import { ToggleReadButton } from "@/components/admin/ToggleReadButton";
import { formatDateTime } from "@/lib/format";
import { getContactMessages } from "@/lib/queries";

export default async function AdminMessagesListPage() {
  const messages = await getContactMessages();

  return (
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Dashboard
        </Link>

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Pesan Masuk
        </h1>

        {messages.length === 0 ? (
          <p className="mt-10 text-subtle-foreground">Belum ada pesan masuk.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`group rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10 ${
                  message.isRead
                    ? "border-border bg-surface"
                    : "border-accent/40 bg-surface"
                }`}
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      message.isRead
                        ? "bg-surface-hover text-subtle-foreground"
                        : "bg-accent/15 text-accent"
                    }`}
                  >
                    <span className="h-5 w-5">
                      <MailIcon />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {!message.isRead && (
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 shrink-0 rounded-full bg-accent"
                          />
                        )}
                        <p className="font-black text-foreground">
                          {message.name}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <ToggleReadButton
                          id={message.id}
                          isRead={message.isRead}
                        />
                        <DeleteEntityButton
                          endpoint={`/api/messages/${message.id}`}
                          confirmMessage={`Hapus pesan dari "${message.name}"? Tindakan ini tidak bisa dibatalkan.`}
                          errorMessage="Gagal menghapus pesan."
                        />
                      </div>
                    </div>
                    <p className="text-sm text-subtle-foreground">
                      {message.email} · {formatDateTime(message.createdAt)}
                    </p>
                    <p className="mt-2 text-sm whitespace-pre-wrap text-foreground-secondary">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
