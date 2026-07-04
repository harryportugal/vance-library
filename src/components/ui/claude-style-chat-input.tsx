import React, { useState, useEffect, useRef, useCallback } from "react";
import { Plus, ChevronDown, ArrowUp, Check } from "lucide-react";

/* --- SVG Mouse Cursors --- */
const PointerCursor = ({ clicking }: { clicking: boolean }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-100 ${clicking ? 'scale-90' : 'scale-100'}`}
    >
        <path
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L5.85 2.36a.5.5 0 0 0-.35.85z"
            fill="white"
            stroke="#1a1a1a"
            strokeWidth="1.2"
        />
    </svg>
);

const TextCursor = () => (
    <svg
        width="20"
        height="24"
        viewBox="0 0 20 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
    >
        <path d="M10 4V20" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 4H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 20H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const AnimatedCursor = ({ x, y, clicking, isTextMode, visible }: {
    x: number; y: number; clicking: boolean; isTextMode: boolean; visible: boolean;
}) => (
    <div
        className="absolute z-[100] pointer-events-none"
        style={{
            left: x,
            top: y,
            transform: isTextMode ? 'translate(-10px, -12px)' : 'translate(-2px, -2px)',
            transition: 'left 700ms cubic-bezier(0.25, 0.1, 0.25, 1), top 700ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 400ms ease',
            opacity: visible ? 1 : 0,
        }}
    >
        <div className="transition-all duration-300 ease-out">
            {isTextMode ? <TextCursor /> : <PointerCursor clicking={clicking} />}
        </div>
        {clicking && (
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/15"
                style={{ animation: 'ping 600ms cubic-bezier(0, 0, 0.2, 1) forwards' }}
            />
        )}
    </div>
);

/* --- Thinking Icon --- */
const ThinkingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M10.3857 2.50977C14.3486 2.71054 17.5 5.98724 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 9.72386 2.72386 9.5 3 9.5C3.27614 9.5 3.5 9.72386 3.5 10C3.5 13.5899 6.41015 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.5225 13.7691 3.68312 10.335 3.50879L10 3.5L9.89941 3.49023C9.67145 3.44371 9.5 3.24171 9.5 3C9.5 2.72386 9.72386 2.5 10 2.5L10.3857 2.50977ZM10 5.5C10.2761 5.5 10.5 5.72386 10.5 6V9.69043L13.2236 11.0527C13.4706 11.1762 13.5708 11.4766 13.4473 11.7236C13.3392 11.9397 13.0957 12.0435 12.8711 11.9834L12.7764 11.9473L9.77637 10.4473C9.60698 10.3626 9.5 10.1894 9.5 10V6C9.5 5.72386 9.72386 5.5 10 5.5ZM3.66211 6.94141C4.0273 6.94159 4.32303 7.23735 4.32324 7.60254C4.32324 7.96791 4.02743 8.26446 3.66211 8.26465C3.29663 8.26465 3 7.96802 3 7.60254C3.00021 7.23723 3.29676 6.94141 3.66211 6.94141ZM4.95605 4.29395C5.32146 4.29404 5.61719 4.59063 5.61719 4.95605C5.6171 5.3214 5.3214 5.61709 4.95605 5.61719C4.59063 5.61719 4.29403 5.32146 4.29395 4.95605C4.29395 4.59057 4.59057 4.29395 4.95605 4.29395ZM7.60254 3C7.96802 3 8.26465 3.29663 8.26465 3.66211C8.26446 4.02743 7.96791 4.32324 7.60254 4.32324C7.23736 4.32302 6.94159 4.0273 6.94141 3.66211C6.94141 3.29676 7.23724 3.00022 7.60254 3Z" />
    </svg>
);

/* --- Config --- */
const PHRASES = [
    "Crie um site que vença no Awwwards",
    "Crie uma hero com animações cinematográficas - Força total Mega Brain!",
    "Crie um portfólio que impressiona recrutadores",
    "Crie uma landing page que converte 10x mais",
    "Crie um dashboard com glassmorphism premium",
    "Crie uma experiência que ninguém esquece",
];

const MODEL_NAME = "Vance God Mode";
const INITIAL_MODEL = "Sonnet 4.5";

const TYPE_SPEED = 45;
const ERASE_SPEED = 25;
const PAUSE_AFTER_TYPE = 2200;
const PAUSE_AFTER_ERASE = 600;

export const ClaudeChatInput: React.FC = () => {
    const [displayedModel, setDisplayedModel] = useState(INITIAL_MODEL);
    const [isThinkingEnabled, setIsThinkingEnabled] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hoveredModel, setHoveredModel] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: -40, y: -40 });
    const [isClicking, setIsClicking] = useState(false);
    const [showMouse, setShowMouse] = useState(false);
    const [isTextMode, setIsTextMode] = useState(false);
    const [placeholderOpacity, setPlaceholderOpacity] = useState(1);

    const containerRef = useRef<HTMLDivElement>(null);
    const modelBtnRef = useRef<HTMLDivElement>(null);
    const thinkingBtnRef = useRef<HTMLDivElement>(null);
    const inputAreaRef = useRef<HTMLDivElement>(null);
    const dropdownItemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cancelRef = useRef(false);

    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    const click = useCallback(async () => {
        setIsClicking(true);
        await sleep(150);
        setIsClicking(false);
    }, []);

    const moveToEl = useCallback((el: HTMLElement | null, offsetX = 0.5, offsetY = 0.5) => {
        if (!el || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setMousePos({
            x: elRect.left - containerRect.left + elRect.width * offsetX,
            y: elRect.top - containerRect.top + elRect.height * offsetY,
        });
    }, []);

    useEffect(() => {
        cancelRef.current = false;

        const runFullAnimation = async () => {
            while (!cancelRef.current) {
                // Reset
                setDisplayedModel(INITIAL_MODEL);
                setIsThinkingEnabled(false);
                setTypedText("");
                setIsDropdownOpen(false);
                setHoveredModel(null);
                setIsTextMode(false);
                setPlaceholderOpacity(1);
                setShowMouse(false);

                await sleep(1000);
                if (cancelRef.current) return;

                // Show mouse, enter from right side
                setShowMouse(true);
                await sleep(50);

                // ── Step 1: Move to model selector ──
                moveToEl(modelBtnRef.current, 0.5, 0.5);
                await sleep(800);
                if (cancelRef.current) return;

                // Click to open dropdown
                await click();
                setIsDropdownOpen(true);
                await sleep(600);
                if (cancelRef.current) return;

                // ── Step 2: Move to "Vance God Mode" dropdown item ──
                // Wait for refs to update after dropdown renders
                await sleep(100);
                moveToEl(dropdownItemRefs.current[0], 0.4, 0.5);
                await sleep(500);
                if (cancelRef.current) return;
                setHoveredModel(MODEL_NAME);
                await sleep(500);
                if (cancelRef.current) return;

                // Click to select
                await click();
                await sleep(100);
                setDisplayedModel(MODEL_NAME);
                setIsDropdownOpen(false);
                setHoveredModel(null);
                await sleep(600);
                if (cancelRef.current) return;

                // ── Step 3: Move to thinking button ──
                moveToEl(thinkingBtnRef.current, 0.5, 0.5);
                await sleep(700);
                if (cancelRef.current) return;

                // Click to enable
                await click();
                setIsThinkingEnabled(true);
                await sleep(600);
                if (cancelRef.current) return;

                // ── Step 4: Move to input area & switch to text cursor ──
                moveToEl(inputAreaRef.current, 0.1, 0.5);
                await sleep(500);
                setIsTextMode(true);
                await sleep(300);
                if (cancelRef.current) return;

                // Click on input
                await click();
                await sleep(200);

                // Fade out mouse cursor and placeholder
                setShowMouse(false);
                setPlaceholderOpacity(0);
                await sleep(500);

                // ── Step 5: Cycle through phrases ──
                for (let p = 0; p < PHRASES.length; p++) {
                    if (cancelRef.current) return;
                    const phrase = PHRASES[p];

                    // Type character by character
                    setIsTyping(true);
                    for (let i = 0; i <= phrase.length; i++) {
                        if (cancelRef.current) return;
                        setTypedText(phrase.slice(0, i));
                        await sleep(TYPE_SPEED);
                    }
                    setIsTyping(false);

                    // Pause with full text
                    await sleep(PAUSE_AFTER_TYPE);
                    if (cancelRef.current) return;

                    // Erase character by character
                    setIsTyping(true);
                    for (let i = phrase.length; i >= 0; i--) {
                        if (cancelRef.current) return;
                        setTypedText(phrase.slice(0, i));
                        await sleep(ERASE_SPEED);
                    }
                    setIsTyping(false);

                    // Brief pause between phrases
                    await sleep(PAUSE_AFTER_ERASE);
                }

                // Fade placeholder back in
                setPlaceholderOpacity(1);
                await sleep(400);

                // Fade mouse out
                setShowMouse(false);
                setIsTextMode(false);
                await sleep(1200);
            }
        };

        runFullAnimation();

        return () => {
            cancelRef.current = true;
        };
    }, [click, moveToEl]);

    const hasContent = typedText.length > 0;

    const models = [
        { id: "god-mode", name: "Vance God Mode", description: "Maximum creative power" },
        { id: "sonnet", name: "Sonnet 4.5", description: "Best for everyday tasks" },
        { id: "haiku", name: "Haiku 4.5", description: "Fastest for quick answers" },
    ];

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto font-sans pointer-events-none select-none">
            {/* Animated Mouse Cursor */}
            <AnimatedCursor
                x={mousePos.x}
                y={mousePos.y}
                clicking={isClicking}
                isTextMode={isTextMode}
                visible={showMouse}
            />

            {/* Main Container */}
            <div className={`
                !box-content flex flex-col mx-2 md:mx-0 items-stretch relative z-10 rounded-2xl
                border transition-all duration-500 ease-out
                shadow-[0_0_15px_rgba(0,0,0,0.3)]
                bg-[#161619] font-sans antialiased
                ${hasContent ? 'shadow-[0_0_25px_rgba(0,0,0,0.5)] border-zinc-700/60' : 'border-zinc-800/60'}
            `}>
                <div className="flex flex-col px-3 pt-3 pb-2 gap-2">

                    {/* Input Area */}
                    <div className="relative mb-1" ref={inputAreaRef}>
                        <div className="max-h-96 w-full overflow-y-auto font-sans break-words min-h-[2.5rem] pl-1">
                            <div className="w-full text-[16px] leading-relaxed font-normal antialiased py-0 min-h-[1.5em] relative">
                                {/* Typed text layer — always present */}
                                <span
                                    className="text-white relative inline-flex items-center"
                                    style={{
                                        minHeight: '1.5em',
                                    }}
                                >
                                    {typedText || '\u200B'}
                                    <span
                                        className={`chat-input-cursor ${isTyping ? 'solid' : 'blink'}`}
                                    />
                                </span>

                                {/* Placeholder layer — fades out when text is being typed */}
                                <span
                                    className="text-zinc-500 absolute inset-0 flex items-center pl-1 pointer-events-none select-none"
                                    style={{
                                        opacity: hasContent ? 0 : placeholderOpacity,
                                        transition: 'opacity 300ms ease',
                                    }}
                                >
                                    Como posso te ajudar hoje?
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex gap-2 w-full items-center">
                        {/* Left Tools */}
                        <div className="relative flex-1 flex items-center shrink min-w-0 gap-1">
                            {/* Attach Button */}
                            <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-zinc-500">
                                <Plus className="w-5 h-5" />
                            </div>

                            {/* Thinking Button */}
                            <div className="flex shrink min-w-8 !shrink-0" ref={thinkingBtnRef}>
                                <div
                                    className="h-8 w-8 flex items-center justify-center rounded-lg"
                                    style={{
                                        color: isThinkingEnabled ? 'white' : '#71717a',
                                        backgroundColor: isThinkingEnabled ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        transform: isThinkingEnabled ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    }}
                                >
                                    <ThinkingIcon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Right Tools */}
                        <div className="flex flex-row items-center min-w-0 gap-1">
                            {/* Model Selector */}
                            <div className="shrink-0 p-1 -m-1 relative" ref={modelBtnRef}>
                                <div
                                    className="inline-flex items-center justify-center h-8 rounded-xl px-3 min-w-[4rem] whitespace-nowrap !text-xs pl-2.5 pr-2 gap-1"
                                    style={{
                                        backgroundColor: isDropdownOpen ? 'rgba(113,113,122,0.3)' : 'transparent',
                                        color: isDropdownOpen ? '#e4e4e7' : '#a1a1aa',
                                        transition: 'all 300ms ease',
                                    }}
                                >
                                    <div className="font-ui inline-flex gap-[3px] text-[14px] h-[14px] leading-none items-center">
                                        <div className="flex items-center gap-[6px]">
                                            {displayedModel === MODEL_NAME && (
                                                <img 
                                                    src="/logo-lib-transparent-final.png" 
                                                    className="h-[22px] w-auto object-contain brightness-0 invert -ml-1.5" 
                                                    alt="" 
                                                />
                                            )}
                                            <div
                                                className="whitespace-nowrap font-medium"
                                                style={{
                                                    color: displayedModel === MODEL_NAME ? 'white' : undefined,
                                                    transition: 'color 400ms ease',
                                                }}
                                            >
                                                {displayedModel}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center opacity-75" style={{ width: '20px', height: '20px' }}>
                                        <ChevronDown
                                            className="shrink-0 opacity-75"
                                            style={{
                                                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Dropdown */}
                                <div
                                    className="absolute bottom-full right-0 mb-2 w-[260px] bg-[#1a1a1d] border border-zinc-800/60 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col p-1.5 origin-bottom-right"
                                    style={{
                                        opacity: isDropdownOpen ? 1 : 0,
                                        transform: isDropdownOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(8px)',
                                        pointerEvents: isDropdownOpen ? 'auto' : 'none',
                                        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    {models.map((model, idx) => (
                                        <div
                                            key={model.id}
                                            ref={el => { dropdownItemRefs.current[idx] = el; }}
                                            className="w-full text-left px-3 py-2.5 rounded-xl flex items-start justify-between"
                                            style={{
                                                backgroundColor: hoveredModel === model.name ? 'rgba(113,113,122,0.2)' : 'transparent',
                                                transition: 'background-color 200ms ease',
                                            }}
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13px] font-semibold text-zinc-200">
                                                        {model.name}
                                                    </span>
                                                    {model.name === MODEL_NAME && (
                                                        <span className="px-1.5 py-[1px] rounded-full text-[10px] font-medium border border-zinc-600/40 text-zinc-400 bg-zinc-700/20">
                                                            ✦ Pro
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] text-zinc-500">
                                                    {model.description}
                                                </span>
                                            </div>
                                            {displayedModel === model.name && !isDropdownOpen && (
                                                <Check className="w-4 h-4 text-white mt-1" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Send Button */}
                            <div>
                                <div
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-xl"
                                    style={{
                                        backgroundColor: hasContent ? 'white' : 'rgba(113,113,122,0.25)',
                                        color: hasContent ? 'black' : '#52525b',
                                        transform: hasContent ? 'scale(1.05)' : 'scale(1)',
                                        boxShadow: hasContent ? '0 4px 12px rgba(255,255,255,0.15)' : 'none',
                                        transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    }}
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaudeChatInput;
