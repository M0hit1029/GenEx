import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Brain } from 'lucide-react';
import { APP_NAME } from '../utils/constants';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Pages where we hide nav items (but keep logo)
  const minimalNavRoutes = ['/login', '/signup'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMinimal = minimalNavRoutes.includes(location.pathname);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo (always visible) */}
          <div className="flex items-center">
            <div className="flex items-center text-primary-700">
              <Brain className="h-8 w-8 mr-2" />
              <FileText className="h-8 w-8" />
            </div>
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-teal-600">
              {APP_NAME}
            </span>
          </div>

          {/* Hide the following parts on minimal routes */}
          {!isMinimal && (
            <>
              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium">How It Works</a>
                <a href="#pricing" className="text-gray-700 hover:text-primary-600 font-medium">Pricing</a>
                <a href="#faq" className="text-gray-700 hover:text-primary-600 font-medium">FAQ</a>
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                <Link to='/login' className="px-4 py-2 text-primary-700 font-medium hover:underline transition-all">
                  Login
                </Link>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-all shadow-md">
                  Get Started
                </button>
              </div>

              <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu (also hidden on minimal routes) */}
        {!isMinimal && isMenuOpen && (
          <div className="md:hidden bg-white absolute top-full left-0 right-0 p-4 shadow-md">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>How It Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>FAQ</a>
              <div className="pt-4 flex flex-col space-y-2">
                <Link to="/login" className="px-4 py-2 text-primary-700 font-medium border border-primary-600 rounded-md hover:bg-primary-50 transition-all">
                  Login
                </Link>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-all shadow-md">
                  Get Started
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
