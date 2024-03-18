import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { useActionData, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import type { z } from "zod";
import { updateProfile } from "~/actions/profile.server";
import { Button } from "~/components/ui/button";
import { CustomForm } from "~/components/ui/custom-form";
import { CustomInput } from "~/components/ui/custom-input";
import { updateUserSchema } from "~/schemas/user.schema";
import { UserType } from "~/types";
import { LucideUser2 } from "lucide-react";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await updateProfile(request);
};

export default function Profil() {
  const user = useOutletContext<UserType>();
  const actionData = useActionData<typeof action>();
  const [isEditable, setEditable] = useState(false);
  const [isChangePassword, setChangePassword] = useState(false);

  const form = useRemixForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
    values: {
      name: user.name,
      nik: user.nik,
    },
  });

  const handleChangePassword = () => {
    if (!isChangePassword) {
      setChangePassword(true);
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
      return;
    }

    form.unregister(["password", "confirmPassword"]);
    setChangePassword(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Profil Pengguna</h2>
      <div className="grid grid-cols-7 place-items-center gap-y-6">
        <div className="col-span-full xl:col-span-2 self-start">
          <div className="h-72 w-72 rounded-full border-2 grid place-items-center">
            <LucideUser2 className="w-40 h-40" />
          </div>
        </div>
        <RemixFormProvider {...form}>
          <CustomForm
            actionData={actionData}
            method="post"
            className="col-span-full xl:col-span-5"
            onSubmit={(e) => {
              form.handleSubmit(e);
              if (form.formState.isValid) {
                setEditable(false);
              }
            }}
          >
            <CustomInput
              name="nik"
              label="Nomor Induk Karyawan"
              placeholder="Masukkan Nomor Induk Karyawan..."
              readOnly
              disabled={!isEditable}
            />
            <CustomInput
              name="name"
              label="Nama Lengkap"
              placeholder="Masukkan Nama Lengkap..."
              autoFocus
              disabled={!isEditable}
            />
            {isChangePassword ? (
              <>
                <CustomInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Masukkan Password..."
                  disabled={!isEditable}
                />
                <CustomInput
                  name="confirmPassword"
                  label="Konfirmasi Password"
                  type="password"
                  placeholder="Masukkan Konfirmasi Password..."
                  disabled={!isEditable}
                />
              </>
            ) : null}
            <Button
              className="w-full"
              type="button"
              onClick={handleChangePassword}
              disabled={!isEditable}
            >
              {isChangePassword ? "Sembunyikan Password" : "Ubah Password"}
            </Button>
            {isEditable ? (
              <div className="flex justify-end gap-x-4">
                <Button
                  type="button"
                  onClick={() => {
                    setEditable(false);
                    setChangePassword(false);
                    form.reset();
                  }}
                  variant="destructive"
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  Simpan Perubahan
                </Button>
              </div>
            ) : (
              <Button className="flex" type="button" onClick={() => setEditable(true)}>
                Ubah Informasi Pengguna
              </Button>
            )}
          </CustomForm>
        </RemixFormProvider>
      </div>
    </div>
  );
}
