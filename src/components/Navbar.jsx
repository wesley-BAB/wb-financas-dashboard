import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  Users, 
  FolderOpen, 
  Tag, 
  LogOut, 
  Menu, 
  X,
  BarChart3,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, adminOnly: false },
    { path: '/transactions', label: 'Movimentações', icon: CreditCard, adminOnly: false },
    { path: '/categories', label: 'Categorias', icon: FolderOpen, adminOnly: true },
    { path: '/types', label: 'Tipos', icon: Tag, adminOnly: true },
    { path: '/users', label: 'Usuários', icon: Users, adminOnly: true },
  ];

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  const NavLink = ({ item, mobile = false }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <Link
        to={item.path}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-smooth relative",
          "hover:bg-primary/10 hover:text-primary",
          isActive
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground",
          mobile && "w-full justify-start"
        )}
      >
        <Icon size={18} />
        <span>{item.label}</span>
        {isActive && (
          <motion.div
            layoutId="activeNavItem"
            className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="finance-card border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <BarChart3 className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl text-foreground">WB - Finanças</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {filteredNavItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{user?.username}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {user?.role === 'admin' ? 'Admin' : 'Usuário'}
                </span>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2"
              >
                <LogOut size={16} />
                Sair
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-card border-b shadow-lg z-40"
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            {/* User Info */}
            <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-muted/30">
              <User size={18} className="text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">{user?.username}</div>
                <div className="text-xs text-muted-foreground">
                  {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            {filteredNavItems.map((item) => (
              <NavLink key={item.path} item={item} mobile />
            ))}

            {/* Logout Button */}
            <Button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              variant="outline"
              className="w-full justify-start gap-2 mt-4"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;