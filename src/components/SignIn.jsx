import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export default function SignIn({ onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const { signIn, signUp, quickDemoLogin } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Your password must contain between 4 and 60 characters.');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      signUp(name, email, password);
    } else {
      signIn(email, password);
    }

    if (onClose) onClose();
  };

  const handleDemoSignIn = () => {
    quickDemoLogin();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black flex flex-col min-h-screen">
      {/* Background Poster Collage with Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1920&auto=format&fit=crop"
          alt="Netflix Background"
          className="w-full h-full object-cover filter brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      </div>

      {/* Top Header Logo */}
      <header className="relative z-10 px-6 md:px-14 py-5 flex items-center justify-between">
        <button
          onClick={onClose}
          className="cursor-pointer font-black text-3xl md:text-4xl tracking-tighter text-[#E50914] select-none hover:opacity-90 transition-opacity"
        >
          NETFLIX
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Browse as Guest
          </button>
        )}
      </header>

      {/* Form Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[450px] bg-black/75 backdrop-blur-md rounded-lg p-8 sm:p-14 border border-white/10 shadow-2xl">
          <h1 className="text-3xl font-black text-white mb-7">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h1>

          {error && (
            <div className="bg-[#E87C03] text-white text-xs p-3 rounded mb-4 font-medium">
              {error}
            </div>
          )}

          {/* Quick Demo Login Option */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full mb-6 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
          >
            <Sparkles size={16} />
            <span className="text-sm">One-Click Demo Login</span>
          </button>

          <div className="flex items-center my-4 text-xs text-gray-400">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-3">OR</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#333333] text-white placeholder-gray-400 px-4 py-3.5 rounded text-sm outline-none focus:bg-[#454545] focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#333333] text-white placeholder-gray-400 px-4 py-3.5 rounded text-sm outline-none focus:bg-[#454545] focus:ring-1 focus:ring-white transition-all"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#333333] text-white placeholder-gray-400 px-4 py-3.5 rounded text-sm outline-none focus:bg-[#454545] focus:ring-1 focus:ring-white transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E50914] hover:bg-[#F40612] text-white font-bold py-3 px-4 rounded text-base transition-colors cursor-pointer mt-4"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {/* Form Extras */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-3 select-none">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-gray-500 rounded"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline hover:text-gray-300">
              Need help?
            </a>
          </div>

          {/* Toggle between Sign In / Sign Up */}
          <div className="mt-10 text-sm text-gray-400">
            <span>{isSignUp ? 'Already have an account? ' : 'New to Netflix? '}</span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-white hover:underline font-semibold cursor-pointer"
            >
              {isSignUp ? 'Sign in now.' : 'Sign up now.'}
            </button>
          </div>

          {/* Privacy Note */}
          <p className="mt-4 text-[11px] text-gray-500 leading-tight">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <a href="#" className="text-blue-500 hover:underline">
              Learn more.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
