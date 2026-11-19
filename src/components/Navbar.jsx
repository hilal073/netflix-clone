import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu, X, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, searchQuery, setSearchQuery, onOpenSignIn }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'movies', label: 'Movies' },
    { id: 'new', label: 'New & Popular' },
    { id: 'watchlist', label: 'My List' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between ${
        isScrolled
          ? 'bg-[#141414]/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      {/* Left side: Logo & Navigation */}
      <div className="flex items-center space-x-4 md:space-x-8">
        <button
          onClick={() => {
            setActiveTab('home');
            setSearchQuery('');
          }}
          className="cursor-pointer font-black text-2xl md:text-3xl tracking-tighter text-[#E50914] select-none hover:opacity-90 transition-opacity"
        >
          NETFLIX
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-5 text-sm">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => {
                  setActiveTab(link.id);
                  if (link.id !== 'home') setSearchQuery('');
                }}
                className={`transition-colors cursor-pointer ${
                  activeTab === link.id
                    ? 'text-white font-semibold'
                    : 'text-gray-300 hover:text-gray-400 font-normal'
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side: Search, Notifications, Profile / Auth */}
      <div className="flex items-center space-x-3 md:space-x-5 text-white">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <div
            className={`flex items-center transition-all duration-300 rounded-full ${
              isSearchOpen
                ? 'border border-white/50 bg-black/60 px-3 py-1.5 w-44 sm:w-64'
                : 'w-8 justify-center'
            }`}
          >
            <Search
              size={19}
              className="cursor-pointer text-gray-300 hover:text-white shrink-0"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            />
            {isSearchOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, people, genres..."
                autoFocus
                className="bg-transparent border-none outline-none text-white text-xs sm:text-sm ml-2 w-full placeholder-gray-400"
              />
            )}
            {isSearchOpen && searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-white shrink-0 ml-1"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Notification Bell */}
        {isAuthenticated && (
          <div className="relative cursor-pointer hover:text-gray-300 transition-colors hidden sm:block">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1.5 bg-[#E50914] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </div>
        )}

        {/* Profile Dropdown or Sign In Button */}
        {isAuthenticated ? (
          <div className="relative">
            <div
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded overflow-hidden border border-transparent group-hover:border-white transition-all">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop'}
                  alt={user.name || 'Profile Avatar'}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 hidden sm:block ${
                  isProfileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Profile Menu Popup */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-gray-700/60 rounded shadow-2xl py-2 text-sm z-50">
                <div className="px-4 py-2 border-b border-gray-700/40">
                  <p className="text-white font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('watchlist');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-white/10 text-gray-200 transition-colors cursor-pointer"
                >
                  My Watchlist
                </button>
                <button
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-white/10 text-gray-200 transition-colors cursor-pointer"
                >
                  Account Settings
                </button>
                <button
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-white/10 text-gray-200 transition-colors cursor-pointer"
                >
                  Help Center
                </button>

                <div className="border-t border-gray-700/40 mt-1 pt-1">
                  <button
                    onClick={() => {
                      signOut();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out of Netflix</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenSignIn}
            className="flex items-center space-x-1.5 bg-[#E50914] hover:bg-[#F40612] text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded transition-all cursor-pointer shadow"
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        )}

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#141414] border-b border-gray-800 p-5 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`text-left text-base ${
                activeTab === link.id ? 'text-[#E50914] font-bold' : 'text-gray-300'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="border-t border-gray-800 pt-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-red-400 font-medium flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Sign Out ({user.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenSignIn();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-[#E50914] font-bold flex items-center space-x-2"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
