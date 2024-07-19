import { TextInput } from "@/components/form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-200">
      <div className="shadow-md bg-white p-8 rounded-lg">
        <h1 className="text-xl font-bold tracking-tight mb-8 text-center">
          soundsketch
        </h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <TextInput id="email" />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <TextInput id="password" type="password" />
          </div>

          <button>Sign in</button>
          <button>Create an account</button>
        </form>
      </div>
    </div>
  );
}
