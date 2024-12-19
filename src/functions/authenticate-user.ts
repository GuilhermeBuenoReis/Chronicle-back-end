import { authenticateUser } from '../modules/auth';
import { getUserByEmailAndPassword } from './find-user-by-email-and-password';

interface AuthenticateRequest {
  email: string;
  password: string;
}

export async function authenticate({
  email,
  password,
}: AuthenticateRequest): Promise<{ token: string }> {
  const result = await getUserByEmailAndPassword({ email, password });
  const user = result.user.id;

  const token = await authenticateUser(user);

  return { token };
}
