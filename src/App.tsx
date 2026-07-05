import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { translations, type Language } from './i18n';
import { 
  Search, 
  Code, 
  Copy, 
  Check, 
  X, 
  Info, 
  Heart, 
  Bookmark,
  Eye,
  ChevronUp,
  ChevronDown,
  GraduationCap,
  RefreshCw
} from 'lucide-react';
import Login from './components/Login';
import { PageTransition, type PageTransitionRef } from './components/PageTransition';
import TextReveal from './components/Copy';
import ClaudeChatInput from './components/ui/claude-style-chat-input';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { authClient } from './lib/auth-client';

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

const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || '';

function getAssetUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const base = ASSETS_BASE_URL.endsWith('/') ? ASSETS_BASE_URL.slice(0, -1) : ASSETS_BASE_URL;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}

export default function App() {
  const { data: sessionData } = authClient.useSession();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const isLoggedIn = !!sessionData;

  const lenisRef = useRef<Lenis | null>(null);
  const pageTransitionRef = useRef<PageTransitionRef>(null);

  // Initialize Lenis smooth scroll and reset scroll to top on fresh reload
  useEffect(() => {
    // Force native window scroll to top
    window.scrollTo(0, 0);

    const lenis = new Lenis();
    lenisRef.current = lenis;

    // Force Lenis scroll to top immediately
    lenis.scrollTo(0, { immediate: true });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleLogin = () => {
    if (pageTransitionRef.current) {
      pageTransitionRef.current.play(() => {
        // Better Auth updates the session dynamically
      });
    }
  };

  const handleLogout = async () => {
    if (pageTransitionRef.current) {
      pageTransitionRef.current.play(async () => {
        await authClient.signOut();
      });
    } else {
      await authClient.signOut();
    }
  };

  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const cats = new Set<string>();
    components.forEach(comp => {
      if (comp.category) {
        cats.add(comp.category);
      }
    });
    return Array.from(cats).sort();
  }, [components]);

  // Tabs
  const [activeTab, setActiveTab] = useState<'Components' | 'Debug'>('Components');
  const [debugIndex, setDebugIndex] = useState<number>(0);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [paletteSearch, setPaletteSearch] = useState<string>('');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      const scrolled = currentScrollY > 15;
      setIsScrolled(prev => prev !== scrolled ? scrolled : prev);

      if (currentScrollY > 1000) {
        const show = currentScrollY <= lastScrollY.current;
        setShowHeader(prev => prev !== show ? show : prev);
      } else {
        setShowHeader(prev => !prev ? true : prev);
      }

      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filters & Sorting states (SKIPER-UI)
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'asc' | 'desc'>('newest');
  const [pricingModalOpen, setPricingModalOpen] = useState<boolean>(false);

  // States for smooth login transitions
  const [loginInitialMode, setLoginInitialMode] = useState<'signin' | 'signup'>('signin');

  const handleNavigateToLogin = (mode: 'signin' | 'signup') => {
    if (pageTransitionRef.current) {
      pageTransitionRef.current.play(() => {
        setLoginInitialMode(mode);
      });
    } else {
      setLoginInitialMode(mode);
    }
  };

  const hasAnimatedRef = useRef<boolean>(false);

  useGSAP(() => {
    if (!isLoggedIn) {
      hasAnimatedRef.current = false;
      return;
    }
    if (selectedComponent) return;
    if (hasAnimatedRef.current) return;

    // Create a timeline for cascading entrance animation of the hero/header elements
    const tl = gsap.timeline({ delay: 0.15 });

    // 1. Logo
    tl.fromTo('.hero-nav-logo', 
      { opacity: 0, scale: 0.9, filter: 'blur(4px)' }, 
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out' }
    );

    // 2. Nav links (Biblioteca, MCP)
    tl.fromTo('.hero-nav-link', 
      { opacity: 0, y: -15, filter: 'blur(2px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.08, ease: 'power3.out' },
      '-=0.6'
    );

    // 3. Search input
    tl.fromTo('.hero-nav-search', 
      { opacity: 0, scale: 0.95, y: -10, filter: 'blur(3px)' }, 
      { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out' },
      '-=0.5'
    );

    // 4. Nav actions (Planos, Entrar, Criar conta, logout)
    tl.fromTo('.hero-nav-action', 
      { opacity: 0, y: -15, filter: 'blur(2px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.06, ease: 'power3.out' },
      '-=0.6'
    );

    // 5. Chat Input (ClaudeChatInput)
    tl.fromTo('.hero-chat-input', 
      { opacity: 0, scale: 0.96, y: 25, filter: 'blur(4px)' }, 
      { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'elastic.out(1, 0.75)' },
      '-=0.4'
    );

    // 6. Subtitle text
    tl.fromTo('.hero-subtitle', 
      { opacity: 0, y: 15, filter: 'blur(2px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
      '-=0.8'
    );

    // 7. Category pills selector
    tl.fromTo('.hero-category-pill', 
      { opacity: 0, scale: 0.9, x: -10 }, 
      { opacity: 1, scale: 1, x: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out' },
      '-=0.7'
    );

    // 8. Component cards
    tl.fromTo('.hero-component-card', 
      { opacity: 0, y: 30, filter: 'blur(4px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.05, ease: 'power3.out' },
      '-=0.6'
    );

    hasAnimatedRef.current = true;
  }, { dependencies: [isLoggedIn, selectedComponent] });

  // States for selected component preview
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [promptModalOpen, setPromptModalOpen] = useState<boolean>(false);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [catalogScrollY, setCatalogScrollY] = useState<number>(0);

  const handleSelectComponent = (comp: ComponentData | null) => {
    if (comp) {
      // Route Protection & Premium validation
      const isProComp = parseInt(comp.id) % 5 === 0;
      const isUserPremium = sessionData?.user?.role === 'admin' || sessionData?.user?.plan === 'premium';

      if (isProComp && !isUserPremium) {
        setPricingModalOpen(true);
        alert(lang === 'pt' ? 'Este recurso é exclusivo para assinantes Premium. Escolha um plano para liberar o acesso!' : 'This is a Premium-exclusive resource. Upgrade your plan to unlock access!');
        return;
      }

      setCatalogScrollY(window.scrollY);
      setIframeLoaded(false);
      setSelectedComponent(comp);
    } else {
      setIframeLoaded(false);
      setSelectedComponent(null);
      setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(catalogScrollY, { immediate: true });
        } else {
          window.scrollTo(0, catalogScrollY);
        }
      }, 30);
    }
  };

  const handleCopyPrompt = () => {
    if (!selectedComponent) return;
    const absoluteZipUrl = getAssetUrl(selectedComponent.zipUrl).startsWith('http')
      ? getAssetUrl(selectedComponent.zipUrl)
      : `${window.location.origin}${selectedComponent.zipUrl}`;
    const fileListText = selectedComponent.files.map(f => `   - ${f.path}`).join('\n');
    const agentPrompt = t.agentPrompt(selectedComponent.title, absoluteZipUrl, selectedComponent.category, fileListText);

    navigator.clipboard.writeText(agentPrompt).then(() => {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    });
  };

  // Close active component on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedComponent) {
          handleSelectComponent(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent]);

  // Disable body scroll when selectedComponent is active
  useEffect(() => {
    if (selectedComponent) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (lenisRef.current) {
        lenisRef.current.stop();
      }
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (lenisRef.current) {
        lenisRef.current.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (lenisRef.current) {
        lenisRef.current.start();
      }
    };
  }, [selectedComponent]);

  // Search Input Reference for keyboard shortcut focus
  const searchInputRef = useRef<HTMLInputElement>(null);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  // Focus palette input on open and reset query on close
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => {
        paletteInputRef.current?.focus();
      }, 100);
    } else {
      setPaletteSearch('');
    }
  }, [commandPaletteOpen]);

  // Language state â€” persisted in localStorage
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('harry_library_lang');
      return (saved as Language) || 'pt';
    } catch {
      return 'pt';
    }
  });
  const t = translations[lang];

  // Memoized items for Command Palette
  const filteredPages = useMemo(() => {
    const pagesList = [
      { id: 'pricing', label: lang === 'pt' ? 'Preços / Planos' : 'Pricing', action: () => { setPricingModalOpen(true); setCommandPaletteOpen(false); } },
      { id: 'all-components', label: lang === 'pt' ? 'Todos os Componentes' : 'All Components', action: () => { setActiveTab('Components'); setSelectedCategory('All'); setCommandPaletteOpen(false); } },
      { id: 'favorites', label: lang === 'pt' ? 'Favoritos' : 'Favorites', action: () => { setActiveTab('Components'); setSelectedCategory('Favorites'); setCommandPaletteOpen(false); } },
    ];
    if (!paletteSearch) return pagesList;
    const search = paletteSearch.toLowerCase();
    return pagesList.filter(p => p.label.toLowerCase().includes(search));
  }, [paletteSearch, lang]);

  const filteredCategories = useMemo(() => {
    if (!paletteSearch) return categories;
    const search = paletteSearch.toLowerCase();
    return categories.filter(c => c.toLowerCase().includes(search));
  }, [categories, paletteSearch]);

  const combinedItems = useMemo(() => {
    const items: Array<{ type: 'page' | 'category'; id: string; label: string; action: () => void }> = [];
    filteredPages.forEach(p => {
      items.push({ type: 'page', id: p.id, label: p.label, action: p.action });
    });
    filteredCategories.forEach(c => {
      items.push({ 
        type: 'category', 
        id: `cat-${c}`, 
        label: c, 
        action: () => { 
          setActiveTab('Components'); 
          setSelectedCategory(c); 
          setCommandPaletteOpen(false); 
        } 
      });
    });
    return items;
  }, [filteredPages, filteredCategories]);

  // Reset selected item index when query changes
  useEffect(() => {
    setSelectedItemIndex(0);
  }, [paletteSearch]);

  // Global keydown listeners for command palette when open
  useEffect(() => {
    if (!commandPaletteOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedItemIndex(prev => (prev < combinedItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedItemIndex(prev => (prev > 0 ? prev - 1 : combinedItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (combinedItems[selectedItemIndex]) {
          combinedItems[selectedItemIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, combinedItems, selectedItemIndex]);

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem('harry_library_lang', lang);
  }, [lang]);

  const theme = 'dark';

  // Set dark theme globally on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Favorites state â€” Composite keys to prevent collisions
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

  // Reset scroll/pagination when filters change
  useEffect(() => {
    // Filters applied
  }, [selectedCategory, searchTerm, priceFilter, sortOrder]);

  // Open command palette on keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input on keyboard shortcut (F key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        (activeEl as HTMLElement).isContentEditable
      )) {
        return;
      }
      if (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen to fullscreen changes

  // Fetch components registry
  useEffect(() => {
    fetch('/components-registry.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load components registry');
        return res.json();
      })
      .then((data: ComponentData[]) => {
        const getComponentScore = (c: ComponentData) => {
          const cat = c.category.toLowerCase();
          const title = c.title.toLowerCase();
          if (cat.includes('mouse') && title.includes('19')) return 10000;
          if (cat.includes('3d') && title.includes('17')) return 9999;
          
          if (c.id === '12') return 100;
          let score = 0;
          if (cat.includes('scroll')) score += 50;
          if (cat.includes('3d') || cat.includes('webgl') || cat.includes('threejs') || cat.includes('three.js') || cat.includes('canvas')) score += 40;
          if (cat.includes('cursor') || cat.includes('hover') || cat.includes('mouse')) score += 20;
          return score;
        };
        const sortedData = [...data].sort((a, b) => {
          const scoreA = getComponentScore(a);
          const scoreB = getComponentScore(b);
          if (scoreB !== scoreA) return scoreB - scoreA;
          return parseInt(a.id) - parseInt(b.id);
        });
        setComponents(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading registry:', err);
        setLoading(false);
      });
  }, []);

  // Apply filters: Search, Category, Price, and Sort
  const filteredComponentsList = useMemo(() => {
    let result = [...components];

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Favorites') {
        result = result.filter(comp => favorites.includes(`${comp.category}:${comp.id}`));
      } else {
        result = result.filter(comp => comp.category === selectedCategory);
      }
    }

    // 2. Search Term Filter
    if (searchTerm !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(comp => 
        comp.title.toLowerCase().includes(lowerSearch) ||
        comp.category.toLowerCase().includes(lowerSearch) ||
        comp.files.some(f => f.name.toLowerCase().includes(lowerSearch))
      );
    }

    // 3. Price Filter (Odd IDs = Free, Even IDs = Pro)
    if (priceFilter === 'free') {
      result = result.filter(comp => parseInt(comp.id) % 5 !== 0);
    } else if (priceFilter === 'pro') {
      result = result.filter(comp => parseInt(comp.id) % 5 === 0);
    }

    // Helper to keep priorities at the top
    const sortWithPriority = (a: ComponentData, b: ComponentData, fallback: () => number) => {
      const aCat = a.category.toLowerCase();
      const aTitle = a.title.toLowerCase();
      const bCat = b.category.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      const isAMouse19 = aCat.includes('mouse') && aTitle.includes('19');
      const isBMouse19 = bCat.includes('mouse') && bTitle.includes('19');
      const isA3d17 = aCat.includes('3d') && aTitle.includes('17');
      const isB3d17 = bCat.includes('3d') && bTitle.includes('17');
      
      if (isAMouse19 && isB3d17) return -1;
      if (isBMouse19 && isA3d17) return 1;
      if (isAMouse19) return -1;
      if (isBMouse19) return 1;
      if (isA3d17) return -1;
      if (isB3d17) return 1;
      
      return fallback();
    };

    // 4. Sort Order
    if (sortOrder === 'newest') {
      result.sort((a, b) => sortWithPriority(a, b, () => parseInt(b.id) - parseInt(a.id)));
    } else if (sortOrder === 'asc') {
      result.sort((a, b) => sortWithPriority(a, b, () => a.title.localeCompare(b.title)));
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => sortWithPriority(a, b, () => b.title.localeCompare(a.title)));
    }

    return result;
  }, [components, selectedCategory, searchTerm, priceFilter, sortOrder, favorites]);



  // Cycle Sort Order helper
  const cycleSort = () => {
    setSortOrder(prev => {
      if (prev === 'newest') return 'asc';
      if (prev === 'asc') return 'desc';
      return 'newest';
    });
  };


  const resetFilters = () => {
    setSearchTerm('');
    setPriceFilter('all');
    setSelectedCategory('All');
    setSortOrder('newest');
  };



  if (isMobile) {
    return (
      <div className="min-h-screen w-full bg-[#0c0c0e] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="relative flex items-center justify-center mb-8">
          <img 
            src="/logo-lib-transparent-final.png" 
            alt="Vance Logo" 
            className="h-16 w-auto object-contain brightness-0 invert animate-pulse"
            style={{ animationDuration: '2s' }}
          />
          <div className="absolute inset-0 rounded-full border border-white/5 scale-150 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
        </div>

        <div className="max-w-md space-y-4">
          <div className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-450 rounded-full font-mono font-bold uppercase tracking-widest">
            Manutenção • Desktop Only
          </div>
          <h1 className="text-xl font-medium text-white tracking-tight pt-2">
            Plataforma em Manutenção no Mobile
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
            A biblioteca de componentes Vance foi projetada especificamente para fluxos de trabalho profissionais em telas desktop. Para uma experiência completa de codificação e visualização interativa, acesse através de um computador.
          </p>
        </div>

        <div className="absolute bottom-8 text-[10px] text-zinc-700 font-mono">
          vance-library-v1.0.0
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full selection:bg-zinc-800 bg-[#0c0c0e]">
      {!isLoggedIn ? (
        <Login lang={lang} onLogin={handleLogin} initialMode={loginInitialMode} />
      ) : (
        <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#0e0e11] text-zinc-100' : 'bg-zinc-50 text-zinc-800'
        }`}>
      <header 
        style={{ top: '12px' }}
        className={`sticky z-50 mt-3 h-16 w-[calc(100%-1.5rem)] mx-auto flex items-center justify-between px-8 select-none rounded-xl transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0e0e11] border border-[#1c1c1f]' 
            : 'bg-transparent border border-transparent shadow-none'
        } ${
          showHeader 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : '-translate-y-[80px] opacity-0 pointer-events-none'
        }`}
      >
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div 
            onClick={() => {
              setActiveTab('Components');
              setSelectedCategory('All');
            }}
            className="flex items-center cursor-pointer select-none group hero-nav-logo"
          >
            <img 
              src="/logo-lib-transparent-final.png" 
              alt="Vance Logo" 
              className="h-[60px] w-auto object-contain brightness-0 invert -ml-1"
            />
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-zinc-400">
            <button 
              onClick={() => {
                setActiveTab('Components');
                setSelectedCategory('All');
              }}
              className={`transition-colors cursor-pointer font-semibold hero-nav-link ${
                activeTab === 'Components' ? 'text-white' : 'hover:text-white'
              }`}
            >
              Biblioteca
            </button>
            <div className="flex items-center gap-1.5 hero-nav-link">
              <button className="hover:text-white transition-colors cursor-pointer font-normal">
                MCP
              </button>
              <span className="px-1.5 py-0.5 text-[8px] font-bold bg-[#1c1c1f] text-[#7f7f86] rounded-[4px] tracking-wider select-none uppercase ml-0.5">
                Em breve
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar or Selected Component Controls (Skiper Style) */}
        {selectedComponent ? (
          <div className="flex items-center gap-2 mx-4 select-none shrink-0">
            {/* Close Button: Standalone Circle */}
            <button 
              onClick={() => handleSelectComponent(null)}
              className="w-9 h-9 rounded-full bg-[#141416] border border-zinc-900/40 hover:bg-[#1c1c1f] text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              title="Close Preview"
            >
              <X size={14} />
            </button>

            {/* Central Capsule: Title + Copy + Code */}
            <div className="flex items-center justify-between pl-4 pr-1 h-9 rounded-full bg-[#141416] border border-zinc-900/40 shadow-md min-w-[260px]">
              <span className="text-[13px] font-normal text-zinc-300 truncate pr-3 select-none">
                {selectedComponent.title}
              </span>
              <div className="flex items-center gap-1">
                {/* Copy Button inside Capsule */}
                <button 
                  onClick={handleCopyPrompt}
                  className={`w-7 h-7 rounded-[9px] flex items-center justify-center transition-all cursor-pointer ${
                    copiedPrompt 
                      ? 'text-emerald-400 bg-emerald-500/10' 
                      : 'text-zinc-400 hover:text-white bg-[#1e1e22] hover:bg-[#28282c]'
                  }`}
                  title="Copy Prompt"
                >
                  {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
                </button>
                {/* Code Button inside Capsule */}
                <button 
                  onClick={() => setPromptModalOpen(true)}
                  className="px-3 h-7 rounded-[9px] bg-[#1e1e22] hover:bg-[#28282c] text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center transition-all cursor-pointer"
                >
                  <span>Code</span>
                </button>
              </div>
            </div>

            {/* Reload Button: Standalone Circle */}
            <button 
              onClick={() => {
                const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
                if (iframe) {
                  setIframeLoaded(false);
                  iframe.src = iframe.src;
                }
              }}
              className="w-9 h-9 rounded-full bg-[#141416] border border-zinc-900/40 hover:bg-[#1c1c1f] text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              title="Reload Frame"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        ) : (
          <div className="flex-1 max-w-[320px] hover:max-w-[345px] mx-4 relative flex items-center transition-all duration-300 ease-out hero-nav-search">
            <div className="flex items-center gap-3 px-4 bg-[#141416] rounded-full h-10 w-full transition-all border border-transparent focus-within:bg-[#18181a] focus-within:border-zinc-800/40">
              <Search size={16} strokeWidth={2.5} className="text-white shrink-0" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder={selectedCategory === 'All' ? 'Pesquisar componentes' : `Pesquisar em ${selectedCategory}`}
                className="bg-transparent border-0 outline-none text-sm text-white placeholder-zinc-500 w-full font-normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm ? (
                <button onClick={() => setSearchTerm('')} className="text-zinc-500 hover:text-white cursor-pointer shrink-0">
                  <X size={13} />
                </button>
              ) : (
                <div className="w-[22px] h-[22px] bg-[#1c1c1f] text-[#6e6e73] rounded-[5px] flex items-center justify-center text-[10px] font-sans select-none shrink-0 font-medium">
                  F
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Side: Pricing, Login, Join for free & Menu */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setPricingModalOpen(true)}
            className="text-[13px] text-zinc-400 hover:text-white transition-colors cursor-pointer font-normal hero-nav-action"
          >
            Planos
          </button>
          
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => setProfileModalOpen(true)}
                className="px-[14px] py-1 bg-transparent text-white border border-[#2c2c2e] font-semibold text-xs rounded-full hover:bg-[#1c1c1e] transition-all cursor-pointer hero-nav-action"
              >
                Perfil
              </button>
              
              <button 
                onClick={handleLogout}
                className="px-[14px] py-1 bg-white text-black font-semibold text-xs rounded-full hover:bg-zinc-200 transition-all cursor-pointer hero-nav-action"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNavigateToLogin('signin')}
                className="px-[14px] py-1 bg-white text-black font-semibold text-xs rounded-full hover:bg-zinc-200 transition-all cursor-pointer hero-nav-action"
              >
                Entrar
              </button>

              <button 
                onClick={() => handleNavigateToLogin('signup')}
                className="px-[14px] py-1 bg-transparent text-white border border-[#2c2c2e] font-semibold text-xs rounded-full hover:bg-[#1c1c1e] transition-all cursor-pointer hero-nav-action"
              >
                Criar conta
              </button>
            </>
          )}
        </div>
      </header>

      {/* â”€â”€ Main Layout Wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <main className={`flex flex-col w-full max-w-full transition-all duration-300 ${
        selectedComponent 
          ? 'px-2 pt-1.5 pb-1.5 h-[calc(100vh-92px)] overflow-hidden' 
          : 'px-3 md:px-4 pt-10 pb-36'
      }`}>

        {activeTab === 'Debug' ? (
          (() => {
            const debugComponent = components[debugIndex];
            const debugHtmlFile = debugComponent?.files.find(f => f.name.toLowerCase() === 'index.html');
            const debugUrl = debugHtmlFile ? getAssetUrl(debugHtmlFile.url) : null;
            return (
              <div className="flex flex-col lg:flex-row gap-6 animate-fade-in w-full h-[75vh] border border-zinc-900 rounded-3xl overflow-hidden bg-black mt-4">
                {/* Control Sidebar */}
                <div className="w-full lg:w-80 bg-zinc-950 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-900 overflow-y-auto shrink-0">
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Workspace Debug Panel</span>
                      <h3 className="text-lg font-bold text-white mt-1">Audit Control Board</h3>
                    </div>
                    
                    {/* Select dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-zinc-400 font-medium">Select Component</label>
                      <select
                        value={debugIndex}
                        onChange={(e) => setDebugIndex(parseInt(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-700"
                      >
                        {components.map((comp, idx) => (
                          <option key={`opt-${comp.category}-${comp.id}`} value={idx}>
                            [{idx + 1}] vance{comp.id} - {comp.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Component Info Card */}
                    {debugComponent && (
                      <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-2xl p-4 space-y-3">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono">Category</span>
                          <p className="text-xs text-zinc-300 font-semibold">{debugComponent.category}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono">Title</span>
                          <p className="text-xs text-zinc-300 font-semibold">{debugComponent.title}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono">ID / Path URL</span>
                          <p className="text-[10px] text-zinc-400 font-mono break-all">{debugHtmlFile?.url || 'No index.html'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono">File Structure</span>
                          <div className="max-h-24 overflow-y-auto text-[9px] font-mono text-zinc-500 mt-1 space-y-1">
                            {debugComponent.files.map(f => (
                              <div key={f.path} className="truncate" title={f.path}>â€¢ {f.path}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DevTools Tip */}
                    <div className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-xl text-[10px] text-zinc-500 leading-relaxed">
                      <strong className="text-zinc-400">ðŸ’¡ Tip de Auditoria:</strong> Abra o Chrome DevTools, mude o contexto do console para o iframe correspondente e inspecione as mensagens para encontrar e depurar erros específicos do script.
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="space-y-3 pt-6 border-t border-zinc-900 mt-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDebugIndex(prev => (prev > 0 ? prev - 1 : components.length - 1))}
                        className="flex-1 py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white rounded-xl border border-zinc-800 transition-colors cursor-pointer"
                      >
                        â† Anterior
                      </button>
                      <button
                        onClick={() => setDebugIndex(prev => (prev < components.length - 1 ? prev + 1 : 0))}
                        className="flex-1 py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white rounded-xl border border-zinc-800 transition-colors cursor-pointer"
                      >
                        Próximo â†’
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        const iframe = document.getElementById('debug-iframe') as HTMLIFrameElement;
                        if (iframe) iframe.src = iframe.src;
                      }}
                      className="w-full py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      Recarregar Efeito â†»
                    </button>
                  </div>
                </div>

                {/* IFrame Stage Area */}
                <div className="flex-1 bg-[#070707] relative flex flex-col h-full min-h-[400px]">
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-zinc-950/80 border border-zinc-900 rounded-full text-[10px] text-zinc-400 font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Sandbox</span>
                  </div>
                  
                  {debugUrl ? (
                    <iframe
                      id="debug-iframe"
                      src={debugUrl}
                      title="Debug Sandbox"
                      className="w-full h-full border-0 bg-[#070707]"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-650 text-xs">
                      <span>Nenhum HTML disponível para este componente.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        ) : selectedComponent ? (
          /* â”€â”€ Integrated Active Component Preview Stage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
          (() => {
            const htmlFile = selectedComponent.files.find(f => f.name.toLowerCase() === 'index.html');
            const interactiveUrl = htmlFile ? getAssetUrl(htmlFile.url) : null;
            return (
              <div className="flex-1 flex flex-col animate-fade-in w-full h-full border border-zinc-900 rounded-[20px] overflow-hidden bg-black relative">
                {interactiveUrl ? (
                  <div className="relative w-full h-full">
                    <iframe
                      id="preview-iframe"
                      key={selectedComponent.id}
                      ref={(el) => {
                        if (el) {
                          el.onload = () => {
                            setIframeLoaded(true);
                          };
                          try {
                            if (el.contentDocument && el.contentDocument.readyState === 'complete') {
                              setTimeout(() => {
                                setIframeLoaded(true);
                              }, 0);
                            }
                          } catch (e) {
                            // ignore cross-origin error
                          }
                        }
                      }}
                      src={interactiveUrl}
                      title={selectedComponent.title}
                      className="w-full h-full border-0 bg-[#070707]"
                    />

                     {/* Loader overlay inside iframe area */}
                    <div 
                      className="absolute inset-0 bg-[#070707] flex flex-col items-center justify-center transition-all duration-[600ms] ease-out z-10"
                      style={{
                        opacity: iframeLoaded ? 0 : 1,
                        pointerEvents: iframeLoaded ? 'none' : 'auto',
                        transform: iframeLoaded ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      {/* Pulsing White Brand Logo */}
                      <div className="relative flex items-center justify-center">
                        <img 
                          src="/logo-lib-transparent-final.png" 
                          alt="Loading..." 
                          className="h-12 w-auto object-contain brightness-0 invert animate-pulse"
                          style={{ animationDuration: '1.6s' }}
                        />
                        <div className="absolute inset-0 rounded-full border border-white/5 scale-150 animate-ping opacity-25" style={{ animationDuration: '2.5s' }} />
                      </div>
                    </div>
                  </div>
                ) : selectedComponent.videoUrl ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#070707] p-4">
                    <video
                      key={selectedComponent.id}
                      src={getAssetUrl(selectedComponent.videoUrl)}
                      className="w-full h-full max-h-[85vh] object-contain rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-zinc-900"
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3 bg-[#070707]">
                    <p className="text-sm font-semibold">{t.noVideoPreview}</p>
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          /* Components Catalog View */
          <div className="space-y-12 animate-fade-in w-full">
            {/* 1. Brand Hero Section */}
            <div className="flex flex-col gap-5 pt-8 pb-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-tight select-none text-center">
                <TextReveal animateOnScroll={false} delay={0.25}>
                  <span>
                    {lang === 'pt' ? (
                      <>Eleve o nível dos <span className="text-zinc-650 font-medium">seus projetos</span></>
                    ) : lang === 'es' ? (
                      <>Eleve el nivel de <span className="text-zinc-650 font-medium">sus proyectos</span></>
                    ) : (
                      <>Elevate the level of <span className="text-zinc-650 font-medium">your projects</span></>
                    )}
                  </span>
                </TextReveal>
              </h1>
              <div className="hero-chat-input">
                <ClaudeChatInput />
              </div>
            </div>

            {/* 2. Horizontal Category Selector Menu */}
            <div className="flex items-center justify-start overflow-x-auto gap-2 w-full scrollbar-hide py-0 px-0 select-none">
              {/* Pill 1: All Resources */}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceFilter('all');
                }}
                className={`px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-full cursor-pointer transition-all border-none hero-category-pill ${
                  selectedCategory === 'All' && priceFilter === 'all'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {lang === 'pt' ? 'Todos os Recursos' : (lang === 'es' ? 'Todos os Recursos' : 'All Resources')}
              </button>

              {/* Pill 2: Free */}
              <button
                onClick={() => {
                  setPriceFilter(priceFilter === 'free' ? 'all' : 'free');
                }}
                className={`px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-full cursor-pointer transition-all border-none hero-category-pill ${
                  priceFilter === 'free'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {lang === 'pt' ? 'Grátis' : (lang === 'es' ? 'Gratis' : 'Free')}
              </button>

              {/* Vertical divider line */}
              <div className="w-px h-4 bg-zinc-800 self-center mx-1.5 shrink-0" />

              {/* Category Pills (Curated Subset) */}
              {[
                { label: 'Button', value: 'Hover Effects' },
                { label: 'Page Transition', value: 'Page Transitions' },
                { label: 'Section Transition', value: 'Background Animations' },
                { label: 'Text Reveal', value: 'Text Animations' }
              ].map(cat => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={`cat-pill-${cat.value}`}
                    onClick={() => {
                      setSelectedCategory(cat.value);
                    }}
                    className={`px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-full cursor-pointer transition-all border-none hero-category-pill ${
                      isActive
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {loading ? (
              /* Loading Skeleton */
              <div className="h-64 flex flex-col items-center justify-center text-zinc-500 gap-3">
                <div className={`w-6 h-6 border-2 rounded-full animate-spin ${
                  theme === 'dark' ? 'border-zinc-800 border-t-white' : 'border-zinc-200 border-t-zinc-900'
                }`}></div>
                <p className="text-xs">{t.loadingComponents}</p>
              </div>
            ) : filteredComponentsList.length === 0 ? (
              /* Empty state */
              <div className={`h-64 flex flex-col items-center justify-center text-zinc-550 gap-2 p-8 text-center border border-dashed rounded-2xl ${
                theme === 'dark' ? 'border-zinc-900 bg-zinc-950/20' : 'border-zinc-200 bg-zinc-50/50'
              }`}>
                <Info size={36} className="text-zinc-700" />
                <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-zinc-350' : 'text-zinc-700'}`}>{t.noComponentsTitle}</h3>
                <p className="text-xs max-w-xs">{t.noComponentsDesc}</p>
                {(searchTerm !== '' || priceFilter !== 'all' || selectedCategory !== 'All') && (
                  <button onClick={resetFilters} className="mt-4 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 rounded-full border border-zinc-800 cursor-pointer">
                    {t.clearFilters}
                  </button>
                )}
              </div>
            ) : (
              /* One Single Unified Grid for all components (no titles or descriptions) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:gap-x-3 gap-y-6 md:gap-y-8 mt-1">
                {filteredComponentsList.map((comp, idx) => (
                  <ComponentCard 
                    key={`item-${comp.category}-${comp.id}`}
                    component={comp}
                    onClick={handleSelectComponent}
                    isFavorite={favorites.includes(`${comp.category}:${comp.id}`)}
                    onToggleFavorite={(id, e) => toggleFavorite(`${comp.category}:${id}`, e)}
                    theme={theme}
                    index={idx}
                    noPreviewText={t.noPreview}
                    addToFavoritesText={t.addToFavorites}
                    removeFromFavoritesText={t.removeFromFavorites}
                  />
                ))}
              </div>
            )}

          </div>
        )}
      </main>

      {/* â”€â”€ Floating Bottom Controls Toolbar (SKIPER-UI) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'Components' && !selectedComponent && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center justify-center gap-3 w-max max-w-full px-4 select-none transition-all duration-500 ease-out ${
          !showHeader 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}>


          {/* Pill 2: Sort Button */}
          <button 
            onClick={cycleSort}
            className="flex items-center gap-3 px-5 bg-[#0e0e0e] border border-zinc-900/60 rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.65)] h-[48px] text-zinc-300 hover:text-white hover:border-zinc-800 transition-all cursor-pointer"
          >
            <GraduationCap size={16} className="text-zinc-400 shrink-0" />
            <span className="text-sm font-semibold text-white">{t.sort}</span>
            <div className="flex items-center gap-1.5 ml-1">
              <ChevronUp size={12} className={sortOrder === 'asc' ? 'text-white' : 'text-zinc-650'} />
              <ChevronDown size={12} className={sortOrder === 'desc' ? 'text-white' : 'text-zinc-650'} />
            </div>
          </button>

          {/* Pill 3: Source Toggle */}
          <div className="flex items-center gap-3 px-5 bg-[#0e0e0e] border border-zinc-900/60 rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.65)] h-[48px] text-zinc-300">
            <Code size={16} className="text-zinc-400 shrink-0" />
            <span className="text-sm font-semibold text-white">{t.source}</span>
            <div className="flex items-center gap-4 ml-2">
              <button 
                onClick={() => setPriceFilter(priceFilter === 'free' ? 'all' : 'free')} 
                className={`text-sm hover:text-white transition-colors cursor-pointer ${
                  priceFilter === 'free' ? 'text-white font-semibold' : 'text-zinc-500 font-medium'
                }`}
              >
                {t.free}
              </button>
              <button 
                onClick={() => setPriceFilter(priceFilter === 'pro' ? 'all' : 'pro')} 
                className={`text-sm hover:text-white transition-colors cursor-pointer ${
                  priceFilter === 'pro' ? 'text-white font-semibold' : 'text-zinc-500 font-medium'
                }`}
              >
                {t.pro}
              </button>
            </div>
          </div>

          {/* Pill 4: Clear Filter (Only shows when filters are active) */}
          {(searchTerm !== '' || priceFilter !== 'all' || selectedCategory !== 'All' || sortOrder !== 'newest') && (
            <button 
              onClick={resetFilters}
              className="flex items-center gap-2 px-5 bg-[#0e0e0e] border border-zinc-900/60 rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.65)] h-[48px] text-zinc-400 hover:text-white hover:border-zinc-800 transition-all cursor-pointer"
            >
              <X size={14} className="shrink-0" />
              <span className="text-sm font-semibold whitespace-nowrap">{t.clearFilters}</span>
            </button>
          )}

        </div>
      )}

      {/* ── Prompt Modal Dialog Overlay ─────────────────────────────────── */}
      {promptModalOpen && selectedComponent && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPromptModalOpen(false)}
        >
          <div 
            className="w-full max-w-3xl bg-[#09090b]/95 rounded-[28px] p-8 flex flex-col gap-5 shadow-[0_32px_80px_rgba(0,0,0,0.95)] animate-modal-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-base font-medium text-zinc-100 tracking-tight">
                  Prompt de IA — {selectedComponent.title}
                </h4>
              </div>
              <button 
                onClick={() => setPromptModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-900/30 border border-zinc-800/40 hover:bg-zinc-900/80 text-zinc-450 hover:text-zinc-100 flex items-center justify-center transition-all cursor-pointer"
                title="Fechar"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed -mt-1 font-normal">
              Copie o prompt estruturado de instruções abaixo para enviar ao seu agente de inteligência artificial.
            </p>

            {/* IDE-style Code Snippet Box */}
            <div className="flex flex-col bg-[#050507] rounded-2xl overflow-hidden flex-1 min-h-[300px]">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#030304]/80 text-[10px] font-mono text-zinc-650 select-none">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                  </div>
                  <span className="ml-1 text-zinc-400 font-medium">agent_instructions.md</span>
                </div>
                <span className="uppercase text-[9px] tracking-wider text-zinc-600 font-bold">Markdown</span>
              </div>
              
              <div className="relative flex-1 p-5 overflow-y-auto max-h-[42vh] custom-scrollbar">
                <pre className="text-[11px] sm:text-[12px] font-mono text-zinc-400 whitespace-pre-wrap select-text leading-relaxed selection:bg-zinc-800/40">
                  {(() => {
                    const absoluteZipUrl = getAssetUrl(selectedComponent.zipUrl).startsWith('http')
                      ? getAssetUrl(selectedComponent.zipUrl)
                      : `${window.location.origin}${selectedComponent.zipUrl}`;
                    const fileListText = selectedComponent.files.map(f => `   - ${f.path}`).join('\n');
                    return t.agentPrompt(selectedComponent.title, absoluteZipUrl, selectedComponent.category, fileListText);
                  })()}
                </pre>
              </div>
            </div>

            {/* Footer metadata and actions */}
            <div className="flex items-center justify-between mt-1 pt-2">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-550 font-mono select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
                <span>{selectedComponent.files.length} arquivos inclusos no ZIP</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleCopyPrompt}
                  className="px-5 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white font-medium text-xs rounded-xl border border-zinc-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {copiedPrompt ? <Check size={13} className="text-emerald-500" /> : <Copy size={12} className="text-zinc-400" />}
                  <span>{copiedPrompt ? 'Copiado!' : 'Copiar Prompt'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ Mock Pricing Modal (SKIPER-UI Style) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {pricingModalOpen && (
        <PricingModal 
          onClose={() => setPricingModalOpen(false)}
          theme={theme}
          lang={lang}
        />
      )}

      {profileModalOpen && (
        <ProfileModal 
          onClose={() => setProfileModalOpen(false)}
          lang={lang}
        />
      )}

      {/* â”€â”€ Command Palette Modal (Search pages and categories) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setCommandPaletteOpen(false);
          }
        }}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 select-none transition-all duration-300 ease-out ${
          commandPaletteOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out origin-top ${
          commandPaletteOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'
        } ${
          theme === 'dark'
            ? 'bg-zinc-950/95 border-zinc-900/60 shadow-[0_30px_70px_rgba(0,0,0,0.85)]'
            : 'bg-white border-zinc-200 shadow-[0_30px_60px_rgba(0,0,0,0.08)]'
        }`}>
          {/* Search Input */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-zinc-900/60' : 'border-zinc-100'}`}>
            <div className={`flex items-center gap-3 px-3.5 rounded-xl border h-11 w-full transition-all ${
              theme === 'dark'
                ? 'bg-zinc-900/40 border-zinc-800/50 focus-within:border-zinc-700'
                : 'bg-zinc-50 border-zinc-200 focus-within:border-zinc-300'
            }`}>
              <Search size={16} className="text-zinc-500 shrink-0" />
              <input 
                ref={paletteInputRef}
                type="text" 
                placeholder={lang === 'pt' ? 'Busque qualquer coisa...' : 'Search Anything...'} 
                className={`bg-transparent border-0 outline-none text-xs w-full ${
                  theme === 'dark' ? 'text-white placeholder-zinc-650' : 'text-zinc-900 placeholder-zinc-400'
                }`}
                value={paletteSearch}
                onChange={(e) => setPaletteSearch(e.target.value)}
              />
              {paletteSearch && (
                <button onClick={() => setPaletteSearch('')} className="text-zinc-500 hover:text-white cursor-pointer shrink-0">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* List area */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
            {combinedItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-500">
                {lang === 'pt' ? 'Nenhum resultado encontrado.' : 'No results found.'}
              </div>
            ) : (
              combinedItems.map((item, idx) => {
                const showHeader = idx === 0 || combinedItems[idx - 1].type !== item.type;
                const isSelected = selectedItemIndex === idx;

                return (
                  <div key={item.id} className="contents">
                    {showHeader && (
                      <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 px-3 pt-3 pb-1.5 first:pt-1">
                        {item.type === 'page'
                          ? (lang === 'pt' ? 'Páginas' : 'Pages')
                          : (lang === 'pt' ? 'Categorias' : 'Categories')}
                      </div>
                    )}
                    <button
                      onClick={item.action}
                      onMouseEnter={() => setSelectedItemIndex(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? (theme === 'dark' ? 'bg-zinc-900 text-white font-semibold' : 'bg-zinc-100 text-zinc-900 font-semibold')
                          : (theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900')
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-mono shrink-0 transition-all ${
                          isSelected 
                            ? 'text-white translate-x-0.5' 
                            : 'text-zinc-700 opacity-40 group-hover:text-zinc-500'
                        }`}>
                          â†’
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.type === 'page' && item.id === 'favorites' && (
                        <Heart size={10} className="fill-current text-rose-500" />
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-between px-4 py-2.5 border-t text-[10px] text-zinc-500 font-mono ${
            theme === 'dark' ? 'border-zinc-900/60 bg-zinc-950/40' : 'border-zinc-100 bg-zinc-50/50'
          }`}>
            <div className="flex items-center gap-1.5">
              <kbd className={`px-1.5 py-0.5 rounded text-[8px] border ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
              }`}>â†µ Enter</kbd>
              <span>{lang === 'pt' ? 'Ir para página' : 'Go To Page'}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <kbd className={`px-1.5 py-0.5 rounded text-[8px] border ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                }`}>â†‘â†“</kbd>
                <span>{lang === 'pt' ? 'Navegar' : 'Navigate'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className={`px-1.5 py-0.5 rounded text-[8px] border ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                }`}>Esc</kbd>
                <span>{lang === 'pt' ? 'Fechar' : 'Close'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Floating Language Settings Panel (Vance Library Specific) â”€â”€ */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 p-1.5 rounded-full border bg-zinc-950/80 border-zinc-800/80 backdrop-blur-md">
        {/* Language Selection */}
        <div className="flex bg-zinc-950/40 p-0.5 rounded-full border border-zinc-800/20">
          {(['pt', 'en', 'es'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase transition-all cursor-pointer ${
                lang === l
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-350'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      {/* â”€â”€ Fixed Bottom Progressive Backdrop Blur Overlay (Multi-Layer Scrim) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'Components' && !selectedComponent && (
        <div className="fixed bottom-0 left-0 right-0 h-[120px] pointer-events-none z-30 select-none">
          {/* Layer 1: 4px svelte blur */}
          <div 
            className="absolute inset-0 backdrop-blur-[4px]" 
            style={{
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, transparent 100%)'
            }} 
          />
          {/* Layer 2: 16px medium blur */}
          <div 
            className="absolute inset-0 backdrop-blur-[16px]" 
            style={{
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, transparent 70%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, transparent 70%)'
            }} 
          />
          {/* Layer 3: 48px deep blur */}
          <div 
            className="absolute inset-0 backdrop-blur-[48px]" 
            style={{
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, transparent 40%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, transparent 40%)'
            }} 
          />
        </div>
      )}
      </div>
      )}

      {/* Page Transitions #11 Grid Blocks Overlay */}
      <PageTransition ref={pageTransitionRef} color="#ffffff" />
    </div>
  );
}

/*
// Small custom icons & toggles
function SunMoonIcon({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
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
*/

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
  const [isClicked, setIsClicked] = useState(false);
  const isMouse19 = component.category.toLowerCase().includes('mouse') && component.title.toLowerCase().includes('19');

  const handleMouseEnter = () => {
    setIsHovered(true);
    const shouldPlay = (isMouse19 || !component.imageUrl) && component.videoUrl && videoRef.current;
    if (shouldPlay) {
      videoRef.current!.play().catch(err => {
        console.warn('Autoplay blocked:', err);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const shouldPause = (isMouse19 || !component.imageUrl) && component.videoUrl && videoRef.current;
    if (shouldPause) {
      videoRef.current!.pause();
      videoRef.current!.currentTime = 0;
    }
  };

  const handleCardClick = () => {
    setIsClicked(true);
    onClick(component);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    onToggleFavorite(component.id, e);
  };

  // Determine if it is a Pro component (Even IDs/ID multiples of 5)
  const isPro = parseInt(component.id) % 5 === 0;
  // Determine if it shows the "New" badge (e.g. ID % 7 === 0)
  const isNew = parseInt(component.id) % 7 === 0;

  return (
    <div 
      className="group flex flex-col relative w-full hero-component-card"
      style={{ animationDelay: `${(index ?? 0) * 30}ms` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Card Container Box (contains only the Visual Preview Box) */}
      <div 
        onClick={handleCardClick}
        className="w-full aspect-[16/12] bg-[#161619] rounded-2xl p-12 sm:p-16 md:p-20 cursor-pointer flex items-center justify-center relative overflow-hidden"
      >
        {isNew && (
          <span className="absolute top-6 left-6 px-3 py-1 text-[9px] font-bold bg-[#1d1d21]/60 text-zinc-400 rounded-full tracking-wider select-none uppercase">
            New
          </span>
        )}
        {isPro && (
          <span className="absolute top-6 right-6 px-3 py-1 text-[9px] font-bold bg-[#1d1d21]/60 text-zinc-400 rounded-full tracking-wider select-none uppercase">
            Pro+
          </span>
        )}
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
          {isMouse19 ? (
            <>
              {/* Ultra smooth fade & blur transitions for Mouse Effect 19 */}
              {component.videoUrl && (
                <video 
                  ref={videoRef}
                  src={getAssetUrl(component.videoUrl)}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isHovered && !isClicked ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-xl'
                  }`}
                  style={{ display: isClicked ? 'none' : 'block' }}
                  muted
                  loop
                  playsInline
                  preload="none"
                />
              )}
              {component.imageUrl && (
                <img 
                  src={isHovered && component.gifUrl ? getAssetUrl(component.gifUrl) : getAssetUrl(component.imageUrl)}
                  alt={component.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isHovered && component.videoUrl ? 'opacity-0 scale-105 blur-xl pointer-events-none' : 'opacity-100 scale-100 blur-0'
                  }`}
                  loading="lazy"
                />
              )}
            </>
          ) : (
            /* Original logic for all other components */
            component.imageUrl ? (
              <img 
                src={isHovered && component.gifUrl ? getAssetUrl(component.gifUrl) : getAssetUrl(component.imageUrl)}
                alt={component.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : component.videoUrl ? (
              <video 
                ref={videoRef}
                src={getAssetUrl(component.videoUrl)}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: isClicked ? 'none' : 'block' }}
                muted
                loop
                playsInline
                preload="none"
              />
            ) : (
              <div className={`absolute inset-0 flex items-center justify-center text-[10px] ${
                theme === 'dark' ? 'text-zinc-700' : 'text-zinc-400'
              }`}>
                <span>{noPreviewText}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* 2. Card Info Footer (sits outside the card box on the black page canvas) */}
      <div className="flex items-end justify-between mt-4 px-2 w-full relative">
        {/* Left Side: Title and Category */}
        <div className="flex flex-col min-w-0 select-none">
          <span 
            onClick={handleCardClick}
            className="text-[15px] font-semibold text-white cursor-pointer tracking-tight"
          >
            {component.title}
          </span>
          <span className="text-[12px] text-zinc-550 mt-1.5 font-medium">
            {component.category}
          </span>
        </div>

        {/* Right Side: Hover Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto shrink-0">
          {/* Button 1: Favorite (Heart) */}
          <button 
            onClick={handleFavoriteClick}
            className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all border-none ${
              isFavorite 
                ? 'bg-zinc-900 text-rose-500 shadow-md' 
                : 'bg-zinc-900/80 text-white hover:bg-zinc-800'
            }`}
            title={isFavorite ? removeFromFavoritesText : addToFavoritesText}
          >
            <Heart size={13} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Button 2: Save / Bookmark (Bookmark) */}
          <a 
            href={getAssetUrl(component.zipUrl)}
            download
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 rounded-xl bg-zinc-900/80 text-white hover:bg-zinc-800 flex items-center justify-center cursor-pointer transition-all border-none"
            title="Download ZIP"
          >
            <Bookmark size={13} />
          </a>

          {/* Button 3: Live Sandbox (Eye) */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick(component);
            }}
            className="w-9 h-9 rounded-xl bg-zinc-900/80 text-white hover:bg-zinc-800 flex items-center justify-center cursor-pointer transition-all border-none"
            title="Open Sandbox"
          >
            <Eye size={13} />
          </button>

          {/* Button 4: Code Prompt (Code) */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick(component);
            }}
            className="w-9 h-9 rounded-xl bg-zinc-900/80 text-white hover:bg-zinc-800 flex items-center justify-center cursor-pointer transition-all border-none"
            title="View Prompt"
          >
            <Code size={13} />
          </button>
        </div>
      </div>

    </div>
  );
});

ComponentCard.displayName = 'ComponentCard';


function PricingModal({ 
  onClose, 
  theme: _theme,
  lang
}: { 
  onClose: () => void, 
  theme: 'light' | 'dark',
  lang: Language
}) {
  const isPt = lang === 'pt';
  const isEs = lang === 'es';
  const [billedYearly, setBilledYearly] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const plans = [
    {
      id: 'free',
      name: isPt ? 'Plano Grátis' : (isEs ? 'Plan Gratis' : 'Free Plan'),
      price: isPt ? 'Grátis' : (isEs ? 'Gratis' : 'Free'),
      features: [
        isPt ? 'Envie até 2 transferências por mês' : (isEs ? 'Envíe hasta 2 transferencias por mes' : 'Send up to 2 transfers per month'),
        isPt ? 'Histórico básico de transações' : (isEs ? 'Historial básico de transacciones' : 'Basic transaction history'),
        isPt ? 'Suporte por e-mail básico' : (isEs ? 'Soporte por correo electrónico' : 'Email support'),
        isPt ? 'Suporte a moedas limitado (USD, EUR, GBP)' : (isEs ? 'Soporte de divisas limitado (USD, EUR, GBP)' : 'Limited currency support (USD, EUR, GBP)'),
        isPt ? 'Recursos básicos de segurança' : (isEs ? 'Funciones básicas de seguridad' : 'Basic security features'),
      ],
      recommended: false,
    },
    {
      id: 'standard',
      name: isPt ? 'Plano Padrão' : (isEs ? 'Plan Estándar' : 'Standard Plan'),
      price: isPt 
        ? (billedYearly ? 'R$ 39,90/m' : 'R$ 49,90/m') 
        : (billedYearly ? '$7.99/m' : '$9.99/m'),
      features: [
        isPt ? 'Transferências ilimitadas' : (isEs ? 'Transferencias ilimitadas' : 'Unlimited transfers'),
        isPt ? 'Histórico de transações com exportação' : (isEs ? 'Historial con opciones de exportación' : 'Transaction history with export options'),
        isPt ? 'Suporte por e-mail prioritário' : (isEs ? 'Soporte prioritario por correo' : 'Priority email support'),
        isPt ? 'Suporte a moedas expandido' : (isEs ? 'Soporte de divisas ampliado' : 'Expanded currency support'),
        isPt ? 'Recursos avançados de segurança' : (isEs ? 'Funciones de segurança avançadas' : 'Advanced security features'),
      ],
      recommended: true,
    },
    {
      id: 'pro',
      name: isPt ? 'Plano Pro' : (isEs ? 'Plan Pro' : 'Pro Plan'),
      price: isPt 
        ? (billedYearly ? 'R$ 79,90/m' : 'R$ 99,90/m') 
        : (billedYearly ? '$15.99/m' : '$19.99/m'),
      features: [
        isPt ? 'Transferências ilimitadas prioritárias' : (isEs ? 'Transferencias ilimitadas prioritarias' : 'Unlimited transfers with priority processing'),
        isPt ? 'Análise abrangente de transações' : (isEs ? 'Análisis exhaustivo de transacciones' : 'Comprehensive transaction analytics'),
        isPt ? 'Suporte prioritário 24/7' : (isEs ? 'Soporte prioritario 24/7' : '24/7 priority support'),
        isPt ? 'Suporte total a moedas' : (isEs ? 'Soporte completo de divisas' : 'Full currency support'),
        isPt ? 'Recursos de segurança aprimorados' : (isEs ? 'Funciones de segurança melhoradas' : 'Enhanced security features'),
      ],
      recommended: false,
    }
  ];

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0c0c0e] overflow-y-auto flex flex-col items-center justify-start p-4 md:p-8 font-sans ${
        isExiting ? 'animate-plans-exit' : 'animate-plans-enter'
      }`}
      onClick={handleClose}
    >
      {/* Absolute Close Button */}
      <button 
        onClick={handleClose}
        className="absolute top-6 right-6 p-2 rounded-full border border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer z-50 shadow-lg"
        title={isPt ? 'Fechar' : (isEs ? 'Cerrar' : 'Close')}
      >
        <X size={18} />
      </button>

      <div 
        className="w-full max-w-6xl flex flex-col items-center gap-12 py-12 md:py-24 relative"
        onClick={e => e.stopPropagation()}
      >
        <div 
          style={{ animationDelay: '100ms' }}
          className="absolute text-[120px] sm:text-[180px] md:text-[250px] font-black text-white/[0.03] tracking-tighter select-none pointer-events-none z-0 top-[12%] left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center animate-slide-up-fade"
        >
          Pricing
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full z-10 relative">
          {plans.map((plan, index) => {
            const cardDelay = index * 120 + 200; // staggered delay
            return (
              <div
                key={plan.id}
                style={{ 
                  animationDelay: `${cardDelay}ms`,
                  transform: plan.recommended ? 'translate3d(0, 0, 0)' : undefined,
                  WebkitBackfaceVisibility: plan.recommended ? 'hidden' : undefined,
                  backfaceVisibility: plan.recommended ? 'hidden' : undefined,
                }}
                className={`rounded-[32px] border p-8 flex flex-col justify-between min-h-[500px] transition-all relative animate-slide-up-fade ${
                  plan.recommended
                    ? 'bg-[#0f0f11] border-white/20 shadow-[0_32px_80px_rgba(0,0,0,0.95)]'
                    : 'bg-[#0f0f11]/45 border-zinc-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.75)]'
                } hover:border-zinc-750/90 transition-colors duration-300 backdrop-blur-xl`}
              >
                <div>
                  {/* Plan Header */}
                  <div className="space-y-1">
                    <span 
                      style={{ animationDelay: `${cardDelay + 50}ms` }}
                      className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block animate-slide-up-fade"
                    >
                      {plan.name}
                    </span>
                    <div 
                      style={{ animationDelay: `${cardDelay + 100}ms` }}
                      className="text-4xl font-extrabold text-white tracking-tight pt-2 animate-slide-up-fade"
                    >
                      {plan.price}
                    </div>
                  </div>

                  {/* Divider Line */}
                  <div 
                    style={{ animationDelay: `${cardDelay + 120}ms` }}
                    className="h-px bg-zinc-900/60 my-6 animate-slide-up-fade" 
                  />

                  {/* Features List */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, fIdx) => {
                      const featureDelay = cardDelay + 150 + fIdx * 45;
                      return (
                        <li 
                          key={fIdx} 
                          style={{ animationDelay: `${featureDelay}ms` }}
                          className="flex items-center gap-3 text-xs text-zinc-400 animate-slide-up-fade"
                        >
                          <div className="w-5 h-5 rounded-full bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-center shrink-0">
                            <Check size={10} className="text-white" />
                          </div>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Action Button */}
                <div 
                  style={{ animationDelay: `${cardDelay + 150 + plan.features.length * 45}ms` }}
                  className="mt-8 animate-slide-up-fade"
                >
                  {plan.recommended ? (
                    <button 
                      onClick={() => {
                        alert(isPt ? 'Você já possui Acesso Pro liberado neste ambiente de desenvolvimento!' : (isEs ? 'Â¡Ya tienes acesso Pro desbloqueado en este espaço de trabalho de desenvolvimento!' : 'You already have Pro Access unlocked in this local workspace environment!'));
                        onClose();
                      }}
                      className="w-full py-3 bg-white hover:bg-zinc-200 text-xs font-bold text-black rounded-full transition-colors cursor-pointer shadow-lg"
                    >
                      {isPt ? 'Começar Agora' : (isEs ? 'Empezar Ahora' : 'Get Started')}
                    </button>
                  ) : (
                    <button 
                      onClick={onClose}
                      className="w-full py-3 bg-zinc-950/60 border border-zinc-800 hover:bg-zinc-900 text-xs font-semibold text-zinc-300 rounded-full transition-colors cursor-pointer"
                    >
                      {isPt ? 'Começar Agora' : (isEs ? 'Empezar Ahora' : 'Get Started')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Area: Toggle & Connector Pill */}
        <div className="w-full flex flex-col items-center gap-12 z-10 relative">
          
          {/* Billing Cycle Toggle */}
          <div 
            style={{ animationDelay: '600ms' }}
            className="flex items-center gap-3 select-none self-start md:self-auto px-4 mt-6 animate-slide-up-fade"
          >
            <button
              onClick={() => setBilledYearly(prev => !prev)}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${
                billedYearly ? 'bg-white' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform duration-200 ${
                  billedYearly ? 'translate-x-4 bg-black' : 'translate-x-0 bg-zinc-400'
                }`}
              />
            </button>
            <span className="text-xs text-zinc-400 font-semibold tracking-wide">
              {isPt ? 'Faturamento Anual' : (isEs ? 'Facturación Anual' : 'Billed Yearly')}
            </span>
          </div>

          {/* Connection Lines & Badge (Desktop Only) */}
          <div 
            style={{ animationDelay: '700ms' }}
            className="hidden md:flex flex-col items-center w-full relative mt-4 animate-slide-up-fade"
          >
            {/* The horizontal line connector */}
            <div className="w-full max-w-4xl h-px bg-zinc-900 relative">
              {/* Vertical line from Card 1 */}
              <div className="w-px h-8 bg-zinc-900 absolute -top-8 left-[16.6%]"></div>
              {/* Vertical line from Card 2 */}
              <div className="w-px h-8 bg-zinc-900 absolute -top-8 left-[50%]"></div>
              {/* Vertical line from Card 3 */}
              <div className="w-px h-8 bg-zinc-900 absolute -top-8 left-[83.3%]"></div>
              {/* Center downward line to Plans Badge */}
              <div className="w-px h-8 bg-zinc-900 absolute top-0 left-1/2 -translate-x-1/2"></div>
            </div>
            {/* Plans Badge */}
            <div className="px-4 py-1.5 rounded-full border border-zinc-800/85 bg-zinc-950/80 text-zinc-550 text-[10px] uppercase font-bold tracking-widest mt-8 shadow-md">
              {isPt ? 'Planos' : (isEs ? 'Planes' : 'Plans')}
            </div>
          </div>

          {/* Mobile Badge (Simplified) */}
          <div 
            style={{ animationDelay: '700ms' }}
            className="flex md:hidden px-4 py-1.5 rounded-full border border-zinc-800/80 bg-zinc-950/80 text-zinc-550 text-[10px] uppercase font-bold tracking-widest mt-2 shadow-md animate-slide-up-fade"
          >
            {isPt ? 'Planos' : (isEs ? 'Planes' : 'Plans')}
          </div>

        </div>

      </div>
    </div>
  );
}

function ProfileModal({ 
  onClose,
  lang 
}: { 
  onClose: () => void,
  lang: Language 
}) {
  const isPt = lang === 'pt';
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;

  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const { error } = await authClient.updateUser({
        name,
        image,
      });
      if (error) {
        setErrorMessage(error.message || "Erro ao atualizar perfil.");
      } else {
        setSuccessMessage("Perfil atualizado com sucesso!");
      }
    } catch (err) {
      setErrorMessage("Erro ao salvar alterações.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      if (error) {
        setErrorMessage(error.message || "Erro ao alterar a senha.");
      } else {
        setSuccessMessage("Senha atualizada com sucesso!");
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setErrorMessage("Erro ao atualizar senha.");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0c0c0e] overflow-y-auto flex flex-col items-center justify-start p-4 md:p-8 font-sans ${
        isExiting ? 'animate-plans-exit' : 'animate-plans-enter'
      }`}
      onClick={handleClose}
    >
      <button 
        onClick={handleClose}
        className="absolute top-6 right-6 p-2 rounded-full border border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer z-50 shadow-lg"
      >
        <X size={18} />
      </button>

      <div 
        className="w-full max-w-2xl flex flex-col items-center gap-6 py-12 md:py-16 relative"
        onClick={e => e.stopPropagation()}
      >
        <div 
          className="absolute text-[120px] sm:text-[180px] md:text-[220px] font-black text-white/[0.03] tracking-tighter select-none pointer-events-none z-0 top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center animate-slide-up-fade"
        >
          Profile
        </div>

        <div className="w-full bg-[#0f0f11] border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.95)] z-10 relative mt-20 backdrop-blur-xl space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {isPt ? 'Configurações de Conta' : 'Account Settings'}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {isPt ? 'Gerencie suas credenciais e plano de assinatura' : 'Manage your credentials and subscription plan'}
            </p>
          </div>

          {errorMessage && (
            <div className="py-2 px-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="py-2 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
              {successMessage}
            </div>
          )}

          {/* User Info Overview */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-zinc-950/40 border border-zinc-900 rounded-2xl">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center">
              {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-extrabold text-white">{name.substring(0, 1).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
              <h4 className="text-base font-bold text-white truncate">{name}</h4>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="px-2 py-0.5 text-[9px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-md uppercase">
                  {user?.role || 'User'}
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-zinc-900 text-emerald-400 border border-zinc-800 rounded-md uppercase">
                  {user?.plan === 'premium' ? 'Premium' : 'Free'}
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-md uppercase">
                  Status: {(user as any)?.status || 'ativo'}
                </span>
              </div>
            </div>
          </div>

          {/* Form 1: Edit Name & Avatar */}
          <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {isPt ? 'Editar Perfil' : 'Edit Profile'}
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Nome</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-zinc-700"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">URL do Avatar</label>
                <input 
                  type="text" 
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://..."
                  className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div className="text-right">
              <button 
                type="submit"
                className="px-5 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {isPt ? 'Salvar Perfil' : 'Save Profile'}
              </button>
            </div>
          </form>

          <hr className="border-zinc-900" />

          {/* Form 2: Change Password */}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {isPt ? 'Alterar Senha' : 'Change Password'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Senha Atual</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-zinc-700"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Nova Senha</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-zinc-700"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <button 
                type="submit"
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {isPt ? 'Alterar Senha' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
