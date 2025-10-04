import { useState } from "react";
import logo from "../assets/RPA white.png";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: HTMLFormElement) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-600 to-50% space-y-6">
      <img className="w-30" src={logo} alt="logo" />
      <h2 className="text-3xl text-white">RPA Automation</h2>
      <div className="border shadow p-6 w-80 bg-white">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={(e) => handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username here"
              className="w-full px-3 py-2 border"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password here"
              className="w-full px-3 py-2 border"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="remember-me" className="inline-flex items-center">
              <input
                type="checkbox"
                name="remember-me"
                id="remember-me"
                className="form-checkbox"
              />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-teal-600">
              Forgot password
            </a>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2"
            >
              Get Started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
