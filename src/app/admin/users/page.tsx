"use client";

import { Suspense, useEffect, useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/warcraftcn/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipTitle,
  TooltipBody,
} from "@/components/ui/warcraftcn/tooltip";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableSkeleton } from "@/components/dashboard/skeleton-loader";
import { DeleteConfirm } from "@/components/dashboard/delete-confirm";
import { listUsers, deleteUser } from "@/lib/actions/admin-actions";
import { cn } from "@/lib/utils";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  faction: "HORDE" | "ALLIANCE" | null;
  image: string | null;
  createdAt: Date;
};

function UsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(searchParams.get("page") ?? "1");
  const currentSearch = searchParams.get("search") ?? "";
  const currentRole = searchParams.get("role") ?? "";

  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(currentSearch);
  const [deleting, setDeleting] = useState<UserRow | null>(null);

  const fetchUsers = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await listUsers({
          search: currentSearch || undefined,
          role: currentRole || undefined,
          page: currentPage,
          perPage: 10,
        });
        setUsers(result.users);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch {
        // Database not connected
      }
    });
  }, [currentSearch, currentRole, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function applyFilters(newSearch?: string, newRole?: string, newPage?: number) {
    const params = new URLSearchParams();
    const s = newSearch ?? search;
    const r = newRole ?? currentRole;
    const p = newPage ?? 1;
    if (s) params.set("search", s);
    if (r) params.set("role", r);
    if (p > 1) params.set("page", String(p));
    router.push(`/admin/users?${params.toString()}`);
  }

  async function handleDelete() {
    if (!deleting) return;
    await deleteUser(deleting.id);
    setDeleting(null);
    fetchUsers();
  }

  return (
    <>
      <PageHeader title="Usuários" subtitle={`${total} usuário${total !== 1 ? "s" : ""} no sistema`}>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="size-4" />
            Novo Usuário
          </Link>
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-amber-100/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters(search);
            }}
            placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-3 bg-[hsl(223,24%,11%)] border border-gold/15 rounded-md text-amber-100/90 font-(family-name:--font-crimson) text-sm placeholder:text-amber-100/20 focus:outline-none focus:border-gold/40 focus:shadow-[0_0_12px_rgba(242,201,76,0.08)] transition-all duration-200"
          />
        </div>

        {/* Role filter */}
        <div className="flex gap-2">
          {["", "USER", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => applyFilters(undefined, r)}
              className={cn(
                "px-4 py-3 rounded-md border text-xs font-(family-name:--font-cinzel) uppercase tracking-wider transition-all duration-200",
                currentRole === r
                  ? "border-gold/30 bg-gold/10 text-gold"
                  : "border-gold/10 bg-white/2 text-amber-100/40 hover:border-gold/20"
              )}
            >
              {r === "" ? "Todos" : r === "USER" ? "Users" : "Admins"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gold/10 overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_100px_100px_120px] gap-4 px-4 py-3 bg-white/3 border-b border-gold/8">
          {["Nome", "Email", "Cargo", "Facção", "Ações"].map((h) => (
            <span key={h} className="font-(family-name:--font-cinzel) text-amber-100/40 text-xs uppercase tracking-wider">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className={cn("divide-y divide-gold/5", isPending && "opacity-50 pointer-events-none")}>
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="grid sm:grid-cols-[1fr_1fr_100px_100px_120px] gap-2 sm:gap-4 px-4 py-3 hover:bg-white/2 transition-colors items-center"
              >
                {/* Name */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-xs shrink-0">
                    {user.faction === "HORDE" ? "🐺" : user.faction === "ALLIANCE" ? "🦁" : "⚔️"}
                  </div>
                  <span className="font-(family-name:--font-crimson) text-amber-100/80 text-sm truncate">
                    {user.name ?? "Sem nome"}
                  </span>
                </div>

                {/* Email */}
                <span className="font-(family-name:--font-crimson) text-amber-100/50 text-sm truncate">
                  {user.email}
                </span>

                {/* Role */}
                <span
                  className={cn(
                    "inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-(family-name:--font-cinzel) uppercase tracking-wider border",
                    user.role === "ADMIN"
                      ? "border-purple-500/30 text-purple-400 bg-purple-500/5"
                      : "border-gold/15 text-gold/50 bg-gold/5"
                  )}
                >
                  {user.role === "ADMIN" ? "Admin" : "User"}
                </span>

                {/* Faction */}
                <span
                  className={cn(
                    "font-(family-name:--font-cinzel) text-xs",
                    user.faction === "HORDE"
                      ? "text-horde"
                      : user.faction === "ALLIANCE"
                        ? "text-alliance"
                        : "text-amber-100/25"
                  )}
                >
                  {user.faction ?? "—"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="px-3 py-1.5 rounded border border-gold/15 text-amber-100/50 text-xs font-(family-name:--font-cinzel) hover:border-gold/30 hover:text-gold transition-all"
                      >
                        Editar
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent variant="default">
                      <TooltipTitle>Editar Usuário</TooltipTitle>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setDeleting(user)}
                        className="px-3 py-1.5 rounded border border-red-500/15 text-red-400/50 text-xs font-(family-name:--font-cinzel) hover:border-red-500/30 hover:text-red-400 transition-all"
                      >
                        Excluir
                      </button>
                    </TooltipTrigger>
                    <TooltipContent variant="default">
                      <TooltipTitle>Excluir Usuário</TooltipTitle>
                      <TooltipBody>Soft-delete: pode ser revertido</TooltipBody>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-amber-100/30 font-(family-name:--font-crimson) text-sm">
                {currentSearch ? "Nenhum usuário encontrado para esta busca." : "Nenhum usuário registrado."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => applyFilters(undefined, undefined, currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded border border-gold/10 text-amber-100/30 hover:border-gold/20 hover:text-amber-100/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="font-(family-name:--font-cinzel) text-amber-100/50 text-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => applyFilters(undefined, undefined, currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded border border-gold/10 text-amber-100/30 hover:border-gold/20 hover:text-amber-100/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}

      {/* Delete dialog */}
      {deleting && (
        <DeleteConfirm
          userName={deleting.name ?? deleting.email}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <UsersContent />
    </Suspense>
  );
}
