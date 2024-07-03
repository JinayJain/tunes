import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <form className="flex flex-col space-y-4 p-4 bg-white shadow-md rounded-md container mx-auto max-w-sm">
      <label htmlFor="email" className="text-gray-700 font-semibold">
        Email:
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label htmlFor="password" className="text-gray-700 font-semibold">
        Password:
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        formAction={login}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Log in
      </button>
      <button
        formAction={signup}
        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Sign up
      </button>
    </form>
  );
}
