import React, { useState, useEffect } from 'react';
import { GameModeSelector } from './GameModeSelector';
import { MobileNavMenu } from './MobileNavMenu';
import { Home, MessageCircle, Search, Menu, X, User, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePlayerSearch } from '@/hooks/usePlayerSearch';
import { usePopup } from '@/contexts/PopupContext';
import { Player } from '@/services/playerService';
import { getPlayerRank } from '@/utils/rankUtils';

interface NavbarProps {
  selectedMode?: string;
  onSelectMode?: (mode: string) => void;
  navigate?: (path: string) => void;
}

// Custom hook for tablet detection
function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width <= 1024);
    };
    
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);
  
  return isTablet;
}

export function Navbar({ selectedMode, onSelectMode, navigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { query, setQuery, results, isLoading, error } = usePlayerSearch();
  const { openPopup } = usePopup();
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Show results when we have a query and results or when focused with query
    if (query && query.length >= 2 && (results.length > 0 || searchFocused)) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [query, results, searchFocused]);

  useEffect(() => {
    // Hide results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
        setSearchFocused(false);
      }
    };
    
    if (showSearchResults) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSearchResults]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && results.length > 0) {
      // Auto-select first result if Enter is pressed
      handlePlayerClick(results[0]);
    }
  };

  const handlePlayerClick = (player: Player) => {
    console.log('Player clicked from search:', player);
    
    const rankInfo = getPlayerRank(player.global_points || 0);
    
    const tierAssignments = (player.tierAssignments || []).map(assignment => ({
      gamemode: assignment.gamemode,
      tier: assignment.tier,
      score: assignment.score
    }));
    
    openPopup({
      player,
      tierAssignments,
      combatRank: {
        title: rankInfo.title,
        points: player.global_points || 0,
        color: rankInfo.color,
        effectType: 'general',
        rankNumber: player.overall_rank || 1,
        borderColor: rankInfo.borderColor
      },
      timestamp: new Date().toISOString()
    });
    
    // Clear search and hide results
    setQuery('');
    setShowSearchResults(false);
    setSearchFocused(false);
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    if (query && query.length >= 2) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow clicks on results
    setTimeout(() => {
      setSearchFocused(false);
    }, 150);
  };
  
  const handleDiscordClick = () => {
    window.open('https://discord.gg/YOUR_SERVER_LINK', '_blank');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`pt-2 pb-1 ${isMobile ? 'px-2' : 'pt-4'}`}>
      <motion.nav 
        className={cn(
          "navbar rounded-lg backdrop-blur-xl bg-dark-surface/80 border border-white/10",
          scrolled ? "shadow-xl" : "shadow-lg"
        )}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`container mx-auto ${isMobile ? 'px-3' : 'px-6'}`}>
          <div className={`flex items-center justify-between ${isMobile ? 'h-12' : 'h-14'}`}>
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/3bad17d6-7347-46e0-8f33-35534094962f.png" 
                  alt="MCBE TIERS" 
                  className={`w-auto mr-2 ${isMobile ? 'h-6' : 'h-8'}`} 
                />
                <h1 className={`font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent hover:from-white hover:to-white/80 transition-all ${isMobile ? 'text-base' : 'text-lg'}`}>
                  MCBE TIERS
                </h1>
              </Link>
            </div>

            {/* Center - Navigation Links (Desktop and Tablet) */}
            {!isMobile && (
              <div className="flex items-center space-x-6">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    to="/" 
                    className="flex items-center text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-white/5"
                  >
                    <Home size={16} className="mr-1.5" />
                    <span>Rankings</span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    to="/about" 
                    className="flex items-center text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-white/5"
                  >
                    <Info size={16} className="mr-1.5" />
                    <span>About</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button 
                    onClick={handleDiscordClick}
                    className="flex items-center text-white/70 hover:text-indigo-400 transition-colors duration-200 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-white/5"
                  >
                    <MessageCircle size={16} className="mr-1.5" />
                    <span>Discord</span>
                  </button>
                </motion.div>
              </div>
            )}

            {/* Right - Search (Desktop/Tablet) / Menu Button (Mobile) */}
            {isMobile ? (
              <div className="flex items-center gap-2">
                <motion.button 
                  onClick={toggleMobileMenu} 
                  className="text-white/70 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {mobileMenuOpen ? (
                    <X size={20} />
                  ) : (
                    <Menu size={20} />
                  )}
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="relative search-container"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Search player..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      className="pl-8 pr-3 py-1.5 bg-dark-surface/60 border-white/10 focus:border-white/30 rounded-md text-white/80 placeholder:text-white/40 w-44 h-8 text-sm"
                    />
                    <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-white/40" />
                    
                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                      {showSearchResults && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-dark-surface/95 backdrop-blur-xl border border-white/20 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto"
                        >
                          {isLoading && (
                            <div className="p-2 text-center text-white/60">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white/40 mx-auto"></div>
                            </div>
                          )}
                          
                          {error && (
                            <div className="p-2 text-center text-red-400 text-xs">
                              Error: {error}
                            </div>
                          )}
                          
                          {!isLoading && !error && results.length === 0 && query && query.length >= 2 && (
                            <div className="p-2 text-center text-white/60 text-xs">
                              No players found for "{query}"
                            </div>
                          )}
                          
                          {!isLoading && !error && results.length > 0 && (
                            <div className="py-1">
                              {results.slice(0, 5).map((player) => (
                                <button
                                  key={player.id}
                                  onClick={() => handlePlayerClick(player)}
                                  className="w-full p-2 text-left hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                                >
                                  <User size={14} className="text-white/60" />
                                  <div className="flex-1">
                                    <div className="text-white font-medium">{player.ign}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </motion.div>
              </div>
            )}
          </div>

          {/* Search bar for mobile */}
          {isMobile && (
            <div className="py-1.5 border-t border-white/10 search-container">
              <div className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search player..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className="pl-8 pr-3 py-1.5 bg-dark-surface/60 border-white/10 focus:border-white/30 rounded-md text-white/80 placeholder:text-white/40 w-full h-8 text-sm"
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-white/40" />
                </form>
                
                {/* Mobile Search Results */}
                <AnimatePresence>
                  {showSearchResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-dark-surface/95 backdrop-blur-xl border border-white/20 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto"
                    >
                      {isLoading && (
                        <div className="p-3 text-center text-white/60">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/40 mx-auto"></div>
                        </div>
                      )}
                      
                      {error && (
                        <div className="p-3 text-center text-red-400 text-sm">
                          Error: {error}
                        </div>
                      )}
                      
                      {!isLoading && !error && results.length === 0 && query && query.length >= 2 && (
                        <div className="p-3 text-center text-white/60 text-sm">
                          No players found for "{query}"
                        </div>
                      )}
                      
                      {!isLoading && !error && results.length > 0 && (
                        <div className="py-1">
                          {results.slice(0, 5).map((player) => (
                            <button
                              key={player.id}
                              onClick={() => handlePlayerClick(player)}
                              className="w-full p-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3"
                            >
                              <User size={16} className="text-white/60" />
                              <div className="flex-1">
                                <div className="text-white font-medium">{player.ign}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Game Mode Selector */}
          <div className="py-1.5 border-t border-white/10 overflow-x-auto">
            {isMobile ? (
              <MobileNavMenu currentMode={selectedMode || 'overall'} />
            ) : (
              <GameModeSelector selectedMode={selectedMode || 'overall'} onSelectMode={onSelectMode} />
            )}
          </div>
          
          {/* Mobile Navigation Menu - Updated with Discord */}
          {isMobile && mobileMenuOpen && (
            <motion.div 
              className="py-2 px-2 border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-1">
                <Link 
                  to="/" 
                  className="flex items-center p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home size={18} className="mr-2" />
                  <span>Rankings</span>
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info size={18} className="mr-2" />
                  <span>About</span>
                </Link>
                <button 
                  onClick={handleDiscordClick}
                  className="flex items-center p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-indigo-400 text-sm"
                >
                  <MessageCircle size={18} className="mr-2" />
                  <span>Discord</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </div>
  );
}
