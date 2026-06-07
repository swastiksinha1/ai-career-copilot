import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <SignIn />
    </main>
  );
}