import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy, type FormStrategyVerifyParams } from "remix-auth-form";
import { sessionStorage } from "~/services/session.server";
import { getUserByNik, checkPassword } from "~/services/user.server";
import type { UserType } from "~/types";
import { parseFormData, validateFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "~/schemas/user.schema";
import type { z } from "zod";

export const USER_PASS_STRATEGY = "user-pass-strategy";

async function login({ form }: FormStrategyVerifyParams) {
  // Validate user's input
  const { data, errors } = await validateFormData<z.infer<typeof loginSchema>>(
    await parseFormData<z.infer<typeof loginSchema>>(form),
    zodResolver(loginSchema)
  );
  if (errors) {
    throw new AuthorizationError("Input tidak valid.");
  }

  // Check if user does not exist
  const fetchedUser = await getUserByNik(data.nik);
  if (!fetchedUser) {
    throw new AuthorizationError("NIK dan Password yang anda masukkan salah. Silahkan coba lagi.");
  }

  // Check if password are matches
  const isMatched = checkPassword(data.password, fetchedUser.password);
  if (!isMatched) {
    throw new AuthorizationError("NIK dan Password yang anda masukkan salah. Silahkan coba lagi.");
  }

  const { password, ...userInfo } = fetchedUser;
  return userInfo;
}

const authenticator = new Authenticator<UserType>(sessionStorage);
const formStrategy = new FormStrategy<UserType>(login);

authenticator.use(formStrategy, USER_PASS_STRATEGY);

export { authenticator };
