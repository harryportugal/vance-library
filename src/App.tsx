import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { flushSync } from 'react-dom';
import { translations, type Language } from './i18n';
import { 
  Search, 
  Code, 
  Download, 
  Copy, 
  Check, 
  X, 
  Info,
  Clock,
  Award,
  ChevronRight,
  Home,
  Menu,
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ComponentFile {
  name: string;
  path: string;
  url: string;
}

interface ComponentData {
  id: string;
  category: string;
  title: string;
  videoUrl: string | null;
  imageUrl?: string | null;
  gifUrl?: string | null;
  zipUrl: string;
  files: ComponentFile[];
}

export default function App() {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);

  // Tabs and Sidebar states
  const [activeTab, setActiveTab] = useState<'Home' | 'Components'>('Home');
  const [showSidebar, setShowSidebar] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  useEffect(() => {
    let prevWidth = window.innerWidth;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (prevWidth >= 768 && currentWidth < 768) {
        setShowSidebar(false);
      } else if (prevWidth < 768 && currentWidth >= 768) {
        setShowSidebar(true);
      }
      prevWidth = currentWidth;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Language state — persisted in localStorage
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('harry_library_lang');
      return (saved as Language) || 'pt';
    } catch {
      return 'pt';
    }
  });
  const t = translations[lang];

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem('harry_library_lang', lang);
  }, [lang]);

  // Theme state (defaults to light theme!)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('harry_library_theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  // Sync theme with localStorage
  useEffect(() => {
    localStorage.setItem('harry_library_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // View Transitions API circular theme toggle reveal animation
  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      return;
    }

    const { top, left, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Set custom CSS variables for coordinates and radius
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);
    document.documentElement.style.setProperty('--r', `${endRadius}px`);

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      });
    });
  };

  // Favorites state — stored as "category:id" composite keys to prevent
  // collision between different categories that share the same numeric id.
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('harry_library_favorites_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem('harry_library_favorites_v2', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  // Performance Optimizations
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState<number>(4);
  const [visibleComponentsCount, setVisibleComponentsCount] = useState<number>(24);

  // Reset pagination when category or search term changes
  useEffect(() => {
    setVisibleCategoriesCount(4);
    setVisibleComponentsCount(24);
  }, [selectedCategory, searchTerm]);

  // Category change loading effect
  useEffect(() => {
    setIsCategoryLoading(true);
    const timer = setTimeout(() => {
      setIsCategoryLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  // Auto-switch to Components tab when user types in search bar
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val !== '' && activeTab === 'Home') {
      setActiveTab('Components');
    }
  };

  useEffect(() => {
    // Fetch components registry
    fetch('/components-registry.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load components registry');
        return res.json();
      })
      .then((data: ComponentData[]) => {
        setComponents(data);
        
        // Extract unique categories with a custom display order.
        // Priority categories appear first in the given order;
        // any remaining categories are appended after in their original order.
        const CATEGORY_ORDER = [
          'Scroll Animation',
          'Text Animations',
          '3D Animation',
          'Page Transitions',
          'Hero Animations',
          'Hover Effects',
          'Mouse Effect',
          'Background Animations',
          'Grid Animations',
          'Sliders',
          'Navigation Menus',
          'SVG Animations',
          'Physics Effects',
          'Webgl _ ThreeJS Effects',
        ];
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        const sortedCategories = [
          ...CATEGORY_ORDER.filter(cat => uniqueCategories.includes(cat)),
          ...uniqueCategories.filter(cat => !CATEGORY_ORDER.includes(cat)),
        ];
        setCategories(sortedCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading registry:', err);
        setLoading(false);
      });
  }, []);

  // Pre-calculate category counts once components registry is loaded to avoid looping inside render
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    components.forEach(comp => {
      counts[comp.category] = (counts[comp.category] || 0) + 1;
    });
    return counts;
  }, [components]);

  // Memoize filtered components map by category/group to avoid recalculating on every render
  const filteredComponentsMap = useMemo(() => {
    const result: Record<string, ComponentData[]> = {};
    
    const matchesSearch = (comp: ComponentData) => {
      if (searchTerm === '') return true;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        comp.title.toLowerCase().includes(lowerSearch) ||
        comp.category.toLowerCase().includes(lowerSearch) ||
        comp.files.some(f => f.name.toLowerCase().includes(lowerSearch))
      );
    };

    categories.forEach(cat => {
      result[cat] = components.filter(comp => comp.category === cat && matchesSearch(comp));
    });

    result['Newest'] = [...components]
      .sort((a, b) => parseInt(b.id) - parseInt(a.id))
      .filter(matchesSearch);

    result['Week'] = components.slice(0, 12).filter(matchesSearch);
    result['Favorites'] = components
      .filter(comp => favorites.includes(`${comp.category}:${comp.id}`))
      .filter(matchesSearch);
    result['All'] = components.filter(matchesSearch);

    return result;
  }, [components, categories, searchTerm, favorites]);

  const getCategoryTitle = () => {
    if (selectedCategory === 'All') return t.categoryTitleAll;
    if (selectedCategory === 'Newest') return t.categoryTitleNewest;
    if (selectedCategory === 'Week') return t.categoryTitleWeek;
    if (selectedCategory === 'Favorites') return t.categoryTitleFavorites;
    return selectedCategory;
  };

  const activeCategoryTitle = getCategoryTitle();
  const totalComponents = components.length;
  const totalFilesCount = components.reduce((acc, comp) => acc + comp.files.length, 0);

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans antialiased p-4 gap-2 ${
      theme === 'dark' ? 'bg-black text-zinc-100' : 'bg-zinc-100 text-zinc-800'
    }`}>
      {/* Sidebar Backdrop Overlay on Mobile */}
      {showSidebar && (
        <div 
          onClick={() => setShowSidebar(false)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-25 transition-opacity duration-300 cursor-pointer"
        />
      )}

      {/* Left Floating Sidebar */}
      <aside 
        className={`rounded-2xl flex flex-col h-full shrink-0 z-30 transition-[width,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden border md:relative absolute md:left-auto left-4 md:top-auto top-4 md:bottom-auto bottom-4 md:h-full h-[calc(100vh-2rem)] ${
          theme === 'dark' 
            ? 'bg-zinc-950 border-zinc-900 text-zinc-400' 
            : 'bg-white border-zinc-100 text-zinc-600'
        } ${
          showSidebar 
            ? 'w-60 opacity-100 translate-x-0' 
            : 'w-0 opacity-0 -translate-x-12 pointer-events-none border-transparent md:w-0'
        }`}
      >
        <div className="w-[238px] flex flex-col h-full shrink-0">
        {/* Sidebar Brand Header */}
        <div 
          className={`p-4 border-b animate-sidebar-in relative flex items-center justify-center ${theme === 'dark' ? 'border-zinc-900' : 'border-zinc-100'}`}
          style={{ animationDelay: '50ms' }}
        >
          <div className="flex items-center justify-center py-2">
            <img 
              src="/logo-lib-transparent-final.png" 
              className={`h-20 w-auto object-contain transition-all duration-300 ${
                theme === 'dark' ? 'invert' : ''
              }`} 
              alt="Vance Library" 
            />
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setShowSidebar(false)}
            className={`md:hidden absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === 'dark' ? 'text-zinc-500 hover:text-white hover:bg-zinc-900' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            title={t.close}
          >
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 animate-sidebar-in" style={{ animationDelay: '100ms' }}>
          <div className="relative">
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`} />
            <input 
              type="text" 
              placeholder={t.search} 
              className={`w-full border rounded-lg py-1.5 pl-8 pr-8 text-xs outline-none transition-all ${
                theme === 'dark' 
                  ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-200 placeholder-zinc-500 focus:border-zinc-700 focus:bg-zinc-900' 
                  : 'bg-zinc-50 border-zinc-100 text-zinc-800 placeholder-zinc-400 focus:border-zinc-200 focus:bg-white'
              }`}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <div className={`absolute right-2 top-1/2 -translate-y-1/2 text-[9px] px-1 rounded select-none font-mono ${
              theme === 'dark' ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-400'
            }`}>
              ⌘K
            </div>
          </div>
        </div>
        
        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">
          {/* Main sections */}
          <div className="space-y-0.5">
            <div 
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-xs font-medium animate-sidebar-in ${
                activeTab === 'Home' 
                  ? (theme === 'dark' ? 'bg-zinc-900 text-white font-semibold' : 'bg-zinc-100 text-zinc-900 font-semibold') 
                  : (theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')
              }`}
              style={{ animationDelay: '150ms' }}
              onClick={() => {
                setActiveTab('Home');
                setSelectedCategory('All');
                setSearchTerm('');
              }}
            >
              <Home size={14} />
              <span>{t.home}</span>
            </div>

            <div 
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-xs font-medium animate-sidebar-in ${
                activeTab === 'Components' && selectedCategory === 'All' 
                  ? (theme === 'dark' ? 'bg-zinc-900 text-white font-semibold' : 'bg-zinc-100 text-zinc-900 font-semibold') 
                  : (theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')
              }`}
              style={{ animationDelay: '180ms' }}
              onClick={() => {
                setActiveTab('Components');
                setSelectedCategory('All');
                setSearchTerm('');
              }}
            >
              <LayersIcon size={14} />
              <span>{t.components}</span>
            </div>

            <div 
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-xs font-medium animate-sidebar-in ${
                activeTab === 'Components' && selectedCategory === 'Newest' 
                  ? (theme === 'dark' ? 'bg-zinc-900 text-white font-semibold' : 'bg-zinc-100 text-zinc-900 font-semibold') 
                  : (theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')
              }`}
              style={{ animationDelay: '210ms' }}
              onClick={() => {
                setActiveTab('Components');
                setSelectedCategory('Newest');
                setSearchTerm('');
              }}
            >
              <Clock size={14} />
              <span>{t.newest}</span>
            </div>

            <div 
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-xs font-medium animate-sidebar-in ${
                activeTab === 'Components' && selectedCategory === 'Week' 
                  ? (theme === 'dark' ? 'bg-zinc-900 text-white font-semibold' : 'bg-zinc-100 text-zinc-900 font-semibold') 
                  : (theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')
              }`}
              style={{ animationDelay: '240ms' }}
              onClick={() => {
                setActiveTab('Components');
                setSelectedCategory('Week');
                setSearchTerm('');
              }}
            >
              <Award size={14} />
              <span>{t.bestOfWeek}</span>
            </div>

            <div 
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-xs font-medium animate-sidebar-in ${
                activeTab === 'Components' && selectedCategory === 'Favorites' 
                  ? (theme === 'dark' ? 'bg-zinc-900 text-white font-semibold' : 'bg-zinc-100 text-zinc-900 font-semibold') 
                  : (theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')
              }`}
              style={{ animationDelay: '270ms' }}
              onClick={() => {
                setActiveTab('Components');
                setSelectedCategory('Favorites');
                setSearchTerm('');
              }}
            >
              <Heart 
                size={14} 
                className={favorites.length > 0 
                  ? (theme === 'dark' ? 'text-white fill-white' : 'text-zinc-900 fill-zinc-900') 
                  : ''
                } 
              />
              <span>{t.favorites}</span>
              {favorites.length > 0 && (
                <span className={`text-[10px] font-semibold ml-auto px-2 py-0.5 rounded-md ${
                  theme === 'dark' ? 'bg-zinc-900 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {favorites.length}
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Categories list */}
          <div className="space-y-0.5">
            <div 
              className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 animate-sidebar-in"
              style={{ animationDelay: '300ms' }}
            >
              {t.categories}
            </div>

            {categories.map((category, idx) => {
              const isActive = activeTab === 'Components' && selectedCategory === category;
              return (
                <div 
                  key={category}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer transition-colors text-xs font-medium animate-sidebar-in ${
                    isActive 
                      ? (theme === 'dark' ? 'bg-zinc-900 text-white font-semibold' : 'bg-zinc-100 text-zinc-900 font-semibold') 
                      : (theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')
                  }`}
                  style={{ animationDelay: `${Math.min(500, 320 + idx * 25)}ms` }}
                  onClick={() => {
                    setActiveTab('Components');
                    setSelectedCategory(category);
                    setSearchTerm('');
                  }}
                >
                  <span className="truncate">{category}</span>
                  <span className={`text-[10px] font-normal ml-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {categoryCounts[category] || 0}
                  </span>
                </div>
              );
            })}
          </div>
        </nav>

        <div 
          className={`p-3 border-t flex items-center gap-2 mt-auto animate-sidebar-in ${theme === 'dark' ? 'border-zinc-900' : 'border-zinc-100'}`}
          style={{ animationDelay: '350ms' }}
        >
          <div className="flex gap-1.5 items-center">
            <button 
              onClick={toggleTheme}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                theme === 'dark' ? 'text-zinc-500 hover:text-white hover:bg-zinc-900/60' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title={theme === 'dark' ? t.lightMode : t.darkMode}
            >
              <SunMoonIcon theme={theme} />
            </button>
            {/* Language switcher */}
            <div className="flex gap-0.5">
              {(['pt', 'en', 'es'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                    lang === l
                      ? (theme === 'dark' ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-900')
                      : (theme === 'dark' ? 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100')
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>

      {/* Main Content Floating Panel */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden rounded-2xl border ${
        theme === 'dark' 
          ? 'bg-[#030303] border-zinc-900/60' 
          : 'bg-white border-zinc-100 shadow-sm'
      }`}>
        {/* Main Content Sticky Header with Toggle Button */}
        <header className={`h-14 border-b flex items-center justify-between px-6 backdrop-blur-sm z-10 shrink-0 ${
          theme === 'dark' ? 'border-zinc-900/80 bg-zinc-950/20' : 'border-zinc-100 bg-white/20'
        }`}>
          <div className="flex items-center">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className={`mr-3 p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'dark' ? 'text-zinc-500 hover:text-white hover:bg-zinc-900/60' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title={showSidebar ? t.hideSidebar : t.showSidebar}
            >
              <Menu size={16} />
            </button>
            <h1 className={`text-xs font-semibold tracking-wide uppercase ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {activeTab === 'Home' ? 'Home' : activeCategoryTitle}
            </h1>
          </div>

          {activeTab === 'Components' && (
            <div className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5 select-none">
              <TerminalIcon size={13} className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} />
              <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}>{totalComponents} {t.headerComponents}</span>
            </div>
          )}
        </header>

        {activeTab === 'Home' ? (
          /* Homepage Dashboard */
          <div className="flex-1 overflow-y-auto flex flex-col justify-between p-8 md:p-16 space-y-12 select-none">
            
            {/* Hero Section */}
            <div className="space-y-6 max-w-3xl">
              <h2 
                className={`text-4xl md:text-6xl font-normal tracking-tight leading-tight animate-slide-up-fade ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}
                style={{ animationDelay: '150ms' }}
              >
                {t.heroHeadline1} <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>{t.heroHeadline2}</span> {t.heroHeadline3} <span className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>{t.heroHeadline4}</span>.
              </h2>
              <p 
                className={`text-sm md:text-base leading-relaxed max-w-xl animate-slide-up-fade ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}
                style={{ animationDelay: '250ms' }}
              >
                {t.heroDescription(<strong className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Vance Library</strong>)}
              </p>
              
              <div className="pt-2 animate-slide-up-fade" style={{ animationDelay: '350ms' }}>
                <button 
                  onClick={() => setActiveTab('Components')}
                  className={`rounded-full px-6 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-white hover:bg-zinc-200 text-black shadow-[0_4px_20px_rgba(255,255,255,0.08)]' 
                      : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
                  }`}
                >
                  {t.heroCTA}
                </button>
              </div>
            </div>

            {/* Core Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className={`border rounded-2xl p-6 transition-colors animate-slide-up-fade ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-900 hover:border-zinc-800' : 'bg-zinc-50/50 border-zinc-100 hover:border-zinc-200'
                }`}
                style={{ animationDelay: '450ms' }}
              >
                <Copy className={`${theme === 'dark' ? 'text-white' : 'text-zinc-800'} w-5 h-5 mb-3`} />
                <h4 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.feature1Title}</h4>
                <p className={`text-[11px] mt-2 leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  {t.feature1Desc}
                </p>
              </div>

              <div 
                className={`border rounded-2xl p-6 transition-colors animate-slide-up-fade ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-900 hover:border-zinc-800' : 'bg-zinc-50/50 border-zinc-100 hover:border-zinc-200'
                }`}
                style={{ animationDelay: '530ms' }}
              >
                <Code className={`${theme === 'dark' ? 'text-white' : 'text-zinc-800'} w-5 h-5 mb-3`} />
                <h4 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.feature2Title}</h4>
                <p className={`text-[11px] mt-2 leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  {t.feature2Desc}
                </p>
              </div>

              <div 
                className={`border rounded-2xl p-6 transition-colors animate-slide-up-fade ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-900 hover:border-zinc-800' : 'bg-zinc-50/50 border-zinc-100 hover:border-zinc-200'
                }`}
                style={{ animationDelay: '610ms' }}
              >
                <Clock className={`${theme === 'dark' ? 'text-white' : 'text-zinc-800'} w-5 h-5 mb-3`} />
                <h4 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.feature3Title}</h4>
                <p className={`text-[11px] mt-2 leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  {t.feature3Desc}
                </p>
              </div>
            </div>

            {/* Library Metrics Footer */}
            <div 
              className={`flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t text-xs font-semibold shrink-0 animate-slide-up-fade ${
                theme === 'dark' ? 'border-zinc-900 text-zinc-500' : 'border-zinc-100 text-zinc-500'
              }`}
              style={{ animationDelay: '700ms' }}
            >
              <div className="flex items-center gap-2">
                <TerminalIcon size={14} className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} />
                <span>{totalComponents} {t.activeComponents}</span>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
              <div>
                <span>{totalFilesCount} {t.indexedFiles}</span>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
              <div>
                <span>Vite + Tailwind v4 + React 19</span>
              </div>
            </div>

          </div>
        ) : (
          /* Components Tab View */
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-12">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
                <div className={`w-6 h-6 border-2 rounded-full animate-spin ${
                  theme === 'dark' ? 'border-zinc-800 border-t-white' : 'border-zinc-200 border-t-zinc-900'
                }`}></div>
                <p className="text-xs">{t.loadingComponents}</p>
              </div>
            ) : selectedCategory === 'All' && searchTerm === '' ? (
              /* Grouped rows layout */
              <div className="space-y-12">
                {categories.slice(0, visibleCategoriesCount).map(category => {
                  const catComponents = (filteredComponentsMap[category] || []).slice(0, 4);
                  if (catComponents.length === 0) return null;
                  
                  return (
                    <div key={category} className={`space-y-4 border-b pb-10 last:border-0 last:pb-0 ${
                      theme === 'dark' ? 'border-zinc-900/40' : 'border-zinc-100'
                    }`}>
                      <div className="flex items-center justify-between">
                        <h2 className={`text-base font-bold tracking-tight cursor-pointer ${
                          theme === 'dark' ? 'text-white hover:text-zinc-300' : 'text-zinc-900 hover:text-zinc-700'
                        }`} onClick={() => setSelectedCategory(category)}>
                          {category}
                        </h2>
                        <button 
                          onClick={() => setSelectedCategory(category)}
                          className={`text-xs transition-colors flex items-center gap-0.5 cursor-pointer ${
                            theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          <span>{t.viewAll}</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {isCategoryLoading ? (
                          Array.from({ length: 4 }).map((_, i) => (
                            <ComponentCardSkeleton key={`skeleton-${category}-${i}`} theme={theme} index={i} />
                          ))
                        ) : (
                          catComponents.map((comp, compIndex) => (
                            <ComponentCard 
                              key={`${comp.category}-${comp.id}`} 
                              component={comp} 
                              onClick={setSelectedComponent}
                              isFavorite={favorites.includes(`${comp.category}:${comp.id}`)}
                              onToggleFavorite={(id, e) => toggleFavorite(`${comp.category}:${id}`, e)}
                              theme={theme}
                              index={compIndex}
                              noPreviewText={t.noPreview}
                              addToFavoritesText={t.addToFavorites}
                              removeFromFavoritesText={t.removeFromFavorites}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Load More Categories button */}
                {visibleCategoriesCount < categories.length && (
                  <div className="flex justify-center pt-4">
                    <button 
                      onClick={() => setVisibleCategoriesCount(prev => prev + 4)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${
                        theme === 'dark' 
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-black'
                      }`}
                    >
                      {t.loadMoreCategories}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Single list grid layout (active category or search filter) */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {t.showing} {Math.min(visibleComponentsCount, (filteredComponentsMap[selectedCategory] || []).length)} {t.of} {(filteredComponentsMap[selectedCategory] || []).length} {t.items}
                  </div>
                </div>

                {isCategoryLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <ComponentCardSkeleton key={`skeleton-single-${i}`} theme={theme} index={i} />
                    ))}
                  </div>
                ) : (filteredComponentsMap[selectedCategory] || []).length === 0 ? (
                  selectedCategory === 'Favorites' ? (
                    <div className={`h-64 flex flex-col items-center justify-center text-zinc-500 gap-2 p-8 text-center border border-dashed rounded-xl ${
                      theme === 'dark' ? 'border-zinc-900 bg-zinc-950/20' : 'border-zinc-200 bg-zinc-50/50'
                    }`}>
                      <Heart size={36} className={theme === 'dark' ? 'text-zinc-800' : 'text-zinc-300'} />
                      <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{t.noFavoritesTitle}</h3>
                      <p className="text-xs max-w-xs">{t.noFavoritesDesc}</p>
                    </div>
                  ) : (
                    <div className={`h-64 flex flex-col items-center justify-center text-zinc-500 gap-2 p-8 text-center border border-dashed rounded-xl ${
                      theme === 'dark' ? 'border-zinc-900 bg-zinc-950/20' : 'border-zinc-200 bg-zinc-50/50'
                    }`}>
                      <Info size={36} className={theme === 'dark' ? 'text-zinc-800' : 'text-zinc-300'} />
                      <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{t.noComponentsTitle}</h3>
                      <p className="text-xs max-w-xs">{t.noComponentsDesc}</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {(filteredComponentsMap[selectedCategory] || []).slice(0, visibleComponentsCount).map((comp, compIndex) => (
                        <ComponentCard 
                          key={`${comp.category}-${comp.id}`} 
                          component={comp} 
                          onClick={setSelectedComponent}
                          isFavorite={favorites.includes(`${comp.category}:${comp.id}`)}
                          onToggleFavorite={(id, e) => toggleFavorite(`${comp.category}:${id}`, e)}
                          theme={theme}
                          index={compIndex}
                          noPreviewText={t.noPreview}
                          addToFavoritesText={t.addToFavorites}
                          removeFromFavoritesText={t.removeFromFavorites}
                        />
                      ))}
                    </div>

                    {/* Load More Components button */}
                    {visibleComponentsCount < (filteredComponentsMap[selectedCategory] || []).length && (
                      <div className="flex justify-center pt-4">
                        <button 
                          onClick={() => setVisibleComponentsCount(prev => prev + 16)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${
                            theme === 'dark' 
                              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-black'
                          }`}
                        >
                          {t.loadMoreComponents}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Details & Code Viewer */}
      {selectedComponent && (
        <ComponentViewerModal 
          component={selectedComponent} 
          onClose={() => setSelectedComponent(null)}
          isFavorite={favorites.includes(`${selectedComponent.category}:${selectedComponent.id}`)}
          onToggleFavorite={() => toggleFavorite(`${selectedComponent.category}:${selectedComponent.id}`)}
          theme={theme}
          t={t}
        />
      )}
    </div>
  );
}

// Small custom icons
function LayersIcon(props: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-10 5 10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  );
}

function TerminalIcon(props: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  );
}

function SunMoonIcon({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-500 ease-out"
      style={{
        transform: theme === 'dark' ? 'rotate(40deg)' : 'rotate(0deg)',
      }}
    >
      <mask id="moon-mask-icon">
        <circle cx="12" cy="12" r="12" fill="#fff" />
        <circle
          cx={theme === 'dark' ? '18' : '26'}
          cy={theme === 'dark' ? '6' : '0'}
          r="8"
          fill="#000"
          className="transition-all duration-500 ease-out"
        />
      </mask>
      <circle
        cx="12"
        cy="12"
        r={theme === 'dark' ? '9' : '5'}
        fill="currentColor"
        mask="url(#moon-mask-icon)"
        className="transition-all duration-500 ease-out"
      />
      <g
        className="transition-all duration-500 ease-out origin-center"
        style={{
          opacity: theme === 'dark' ? 0 : 1,
          transform: theme === 'dark' ? 'scale(0.3)' : 'scale(1)',
        }}
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

// Card Component - Clean minimal style. Wrapped in React.memo to prevent unnecessary layout recalculations.
const ComponentCard = memo(({ 
  component, 
  onClick,
  isFavorite,
  onToggleFavorite,
  theme,
  index,
  noPreviewText,
  addToFavoritesText,
  removeFromFavoritesText,
}: { 
  component: ComponentData, 
  onClick: (comp: ComponentData) => void,
  isFavorite: boolean,
  onToggleFavorite: (id: string, e: React.MouseEvent) => void,
  theme: 'light' | 'dark',
  index?: number,
  noPreviewText: string,
  addToFavoritesText: string,
  removeFromFavoritesText: string,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!component.imageUrl && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn('Autoplay blocked:', err);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!component.imageUrl && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleCardClick = () => {
    onClick(component);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    onToggleFavorite(component.id, e);
  };

  return (
    <div 
      className="group flex flex-col animate-slide-up-fade relative"
      style={{ animationDelay: `${(index ?? 0) * 40}ms` }}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Visual Preview Box */}
      <div className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-out border group-hover:scale-[1.02] group-hover:-translate-y-0.5 ${
        theme === 'dark' 
          ? 'bg-zinc-950 border-zinc-900 group-hover:border-zinc-800/80 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-zinc-50 border-zinc-100 group-hover:border-zinc-200/80 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)]'
      }`}>
        {component.imageUrl ? (
          <img 
            src={isHovered && component.gifUrl ? component.gifUrl : component.imageUrl}
            alt={component.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : component.videoUrl ? (
          <video 
            ref={videoRef}
            src={component.videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="none"
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center text-xs ${
            theme === 'dark' ? 'text-zinc-700' : 'text-zinc-400'
          }`}>
            <span>{noPreviewText}</span>
          </div>
        )}
        
        {/* Favorite heart button */}
        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-2 left-2 z-20 p-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
            isFavorite 
              ? 'opacity-100 scale-100 ' + (theme === 'dark' ? 'text-white' : 'text-zinc-900')
              : 'opacity-0 group-hover:opacity-100 scale-90 hover:scale-100 ' + (theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900')
          } ${
            theme === 'dark'
              ? 'bg-black/60 border-zinc-800/80 hover:bg-black/80'
              : 'bg-white/90 border-zinc-100 hover:bg-white shadow-sm'
          }`}
          title={isFavorite ? removeFromFavoritesText : addToFavoritesText}
        >
          <Heart size={12} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

      </div>
    </div>
  );
});

ComponentCard.displayName = 'ComponentCard';

// Elegant card skeleton component
function ComponentCardSkeleton({ theme, index }: { theme: 'light' | 'dark', index: number }) {
  return (
    <div 
      className="flex flex-col animate-fade-in relative"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className={`w-full aspect-[16/10] rounded-xl animate-skeleton-pulse ${
        theme === 'dark' 
          ? 'bg-zinc-900/60 border border-zinc-900/80 shadow-[0_4px_12px_rgba(0,0,0,0.2)]' 
          : 'bg-zinc-200/40 border border-zinc-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]'
      }`} />
    </div>
  );
}

// Modal and Agent Prompt Copier
function ComponentViewerModal({ 
  component, 
  onClose,
  isFavorite,
  onToggleFavorite,
  theme,
  t
}: { 
  component: ComponentData, 
  onClose: () => void,
  isFavorite: boolean,
  onToggleFavorite: () => void,
  theme: 'light' | 'dark',
  t: any
}) {
  const [copied, setCopied] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const absoluteZipUrl = `${window.location.origin}${component.zipUrl}`;
  const fileListText = component.files.map(f => `   - ${f.path}`).join('\n');

  const agentPrompt = t.agentPrompt(component.title, absoluteZipUrl, component.category, fileListText);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(agentPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.warn(err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = clickX / rect.width;
      const newTime = pct * videoRef.current.duration;
      if (!isNaN(newTime)) {
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(pct * 100);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isNaN(pct) ? 0 : pct);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 md:p-8 animate-fade-in ${
        theme === 'dark' ? 'bg-black/75 backdrop-blur-sm' : 'bg-zinc-900/40 backdrop-blur-sm'
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-6xl h-[88vh] rounded-3xl overflow-hidden flex flex-col border animate-modal-in ${
          theme === 'dark'
            ? 'bg-zinc-950 border-zinc-800/60 shadow-[0_32px_80px_rgba(0,0,0,0.7)]'
            : 'bg-white border-zinc-200/80 shadow-[0_32px_80px_rgba(0,0,0,0.15)]'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <header className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between shrink-0 ${
          theme === 'dark' ? 'border-zinc-800/60' : 'border-zinc-100'
        }`}>
          {/* Left: badge + title */}
          <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
            <span className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest border ${
              theme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                : 'bg-zinc-50 border-zinc-200 text-zinc-500'
            }`}>
              {component.category}
            </span>
            <h3 className={`text-xs sm:text-sm font-semibold tracking-tight truncate max-w-[100px] sm:max-w-none ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>
              {component.title}
            </h3>
            <span className={`hidden sm:inline-flex shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
              theme === 'dark' ? 'bg-zinc-900 text-zinc-500' : 'bg-zinc-100 text-zinc-500'
            }`}>
              {component.files.length} arquivos
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 shrink-0 ml-2 sm:ml-4">
            <button
              onClick={onToggleFavorite}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                isFavorite
                  ? (theme === 'dark'
                      ? 'bg-zinc-800 border-zinc-700 text-white'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-900')
                  : (theme === 'dark'
                      ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800')
              }`}
              title={isFavorite ? t.removeFromFavorites : t.addToFavorites}
            >
              <Heart size={12} fill={isFavorite ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">{isFavorite ? t.favorited : t.favorite}</span>
            </button>

            <a
              href={component.zipUrl}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                theme === 'dark'
                  ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
              download
            >
              <Download size={12} />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ml-0.5 sm:ml-1 ${
                theme === 'dark'
                  ? 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              onClick={onClose}
              title={t.close}
            >
              <X size={15} />
            </button>
          </div>
        </header>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">

          {/* ── Left: Preview ─────────────────────────────── */}
          <div className={`w-full md:w-[55%] aspect-[16/10] md:aspect-auto md:h-full flex flex-col shrink-0 md:shrink border-b md:border-b-0 md:border-r ${
            theme === 'dark' ? 'border-zinc-800/60 bg-zinc-900/30' : 'border-zinc-100 bg-zinc-50'
          }`}>
            {/* Preview area */}
            <div className="flex-1 relative overflow-hidden select-none group/preview">
              {component.videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={component.videoUrl}
                    className="w-full h-full object-contain cursor-pointer"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={handlePlayPause}
                  />
                  {/* Controls bar — always visible at bottom */}
                  <div className={`absolute bottom-0 left-0 right-0 flex items-center gap-3 px-4 py-3 border-t ${
                    theme === 'dark'
                      ? 'bg-zinc-950/90 border-zinc-800/60 backdrop-blur-sm text-zinc-300'
                      : 'bg-white/90 border-zinc-100 backdrop-blur-sm text-zinc-700'
                  }`}>
                    <button
                      onClick={handlePlayPause}
                      className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                        theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                    </button>

                    <div
                      onClick={handleTimelineClick}
                      className={`flex-1 h-1 rounded-full cursor-pointer relative ${
                        theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-75 ${
                          theme === 'dark' ? 'bg-zinc-300' : 'bg-zinc-700'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <span className={`shrink-0 text-[9px] font-mono tabular-nums ${
                      theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                    }`}>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <button
                      onClick={handleMuteToggle}
                      className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                        theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    </button>
                  </div>
                </>
              ) : component.imageUrl ? (
                <img
                  src={component.imageUrl}
                  alt={component.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-xs font-medium ${
                  theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'
                }`}>
                  {t.noVideoPreview}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Prompt + Info ───────────────────────── */}
          <div className={`w-full md:w-[45%] flex flex-col shrink-0 md:shrink md:h-full md:overflow-hidden ${
            theme === 'dark' ? 'bg-zinc-950' : 'bg-white'
          }`}>

            {/* Prompt section */}
            <div className="flex-1 flex flex-col p-5 gap-3 min-h-0">
              <div className="flex items-center justify-between shrink-0">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${
                  theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                }`}>
                  {t.agentPromptLabel}
                </span>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                  theme === 'dark' ? 'bg-zinc-900 text-zinc-500' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  Claude · Cursor · Copilot
                </span>
              </div>

              <pre className={`h-48 md:h-auto md:flex-1 rounded-xl border text-[10px] font-mono whitespace-pre-wrap select-all overflow-y-auto leading-relaxed p-4 ${
                theme === 'dark'
                  ? 'bg-[#0a0a0a] border-zinc-800/60 text-zinc-400'
                  : 'bg-zinc-50 border-zinc-100 text-zinc-700'
              }`}>
                {agentPrompt}
              </pre>
            </div>

            {/* File list summary */}
            <div className={`px-5 py-3 border-t shrink-0 ${
              theme === 'dark' ? 'border-zinc-800/60' : 'border-zinc-100'
            }`}>
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${
                theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'
              }`}>
                Arquivos incluídos
              </p>
              <div className="flex flex-wrap gap-1">
                {component.files.slice(0, 8).map(f => (
                  <span key={f.path} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                    theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-500'
                      : 'bg-zinc-50 border-zinc-100 text-zinc-500'
                  }`}>
                    {f.name}
                  </span>
                ))}
                {component.files.length > 8 && (
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border ${
                    theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-500'
                      : 'bg-zinc-50 border-zinc-100 text-zinc-500'
                  }`}>
                    +{component.files.length - 8} mais
                  </span>
                )}
              </div>
            </div>

            {/* Copy button */}
            <div className="p-4 shrink-0">
              <button
                onClick={handleCopyPrompt}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                  copied
                    ? (theme === 'dark'
                        ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        : 'bg-zinc-100 text-zinc-600 border border-zinc-200')
                    : (theme === 'dark'
                        ? 'bg-white hover:bg-zinc-100 text-black shadow-[0_2px_12px_rgba(255,255,255,0.1)]'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-[0_2px_12px_rgba(0,0,0,0.12)]')
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? t.copied : t.copyPrompt}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


