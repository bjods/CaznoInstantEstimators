import Link from "next/link"
import { SignInForm } from "@/components/auth/SignInForm"

export default function Login() {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md mx-auto">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15,18 9,12 15,6" />
        </svg>{" "}
        Back
      </Link>

      <div className="flex flex-col justify-center gap-2 [&>input]:mb-6 mt-8">
        <h1 className="text-2xl font-medium">Sign in to Cazno</h1>
        <p className="text-sm text-foreground">
          Don't have an account? You can create one below.
        </p>
      </div>

      <SignInForm />
    </div>
  )
}