"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { UserForm } from "@/components/dashboard/user-form";
import { createUser } from "@/lib/actions/admin-actions";
import type { CreateUserInput } from "@/lib/validations/user";

export default function NewUserPage() {
    return (
        <>
            <PageHeader
                title="Novo Usuário"
                subtitle="Crie uma nova conta no sistema WoWnator"
            />

            <UserForm
                onSubmit={async (data) => {
                    const result = await createUser(data as CreateUserInput);
                    if ("error" in result && result.error) return { error: result.error };
                    return { user: "user" in result ? result.user : null };
                }}
                submitLabel="Criar Usuário"
                backHref="/admin/users"
                showRoleField
            />
        </>
    );
}
