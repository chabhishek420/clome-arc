
import React, { useState, useRef, useEffect } from 'react';
import { 
  PanelLeft, SquarePen, X, ChevronDown, ChevronRight, 
  Plus, Globe, Brain, Zap, Code, Sparkles, Search, 
  Send, Image as ImageIcon, Camera, Mic, ArrowUp, 
  MoreHorizontal, Lightbulb, Book, Quote, AlignLeft 
} from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  thought?: string;
  thoughtTime?: string;
  searches?: string[];
  isThinkingOpen?: boolean;
  isSearchOpen?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [width, setWidth] = useLocalStorage('arc-chat-width', 360);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock initial state matching the screenshot
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'research the best browser design guides'
    },
    {
      id: '2',
      role: 'model',
      thought: "I need to look into the best design guides for web browsers. It's a time-sensitive task, so using a web search tool is essential. I want to ensure I provide a comprehensive response along with citations. The resources I'll likely consider include the Nielsen Norman Group for browser UX, Material Design for web, and Apple's Human Interface Guidelines for Safari. Since the user is already in a browser, it seems they're seeking guides focused on browser UI design. I'll search for several relevant queries to gather detailed information.",
      thoughtTime: '19 seconds',
      searches: [
        'browser UI design guidelines',
        'Firefox Photon design system',
        'User Interface Design Guidelines...',
        '7 Key UI Design Principles + How...',
        'User interface guidelines: 10 es...'
      ],
      content: "Structuring media content\n\nI need to remember that media guidelines say not to include photos unless asked for. I'm thinking about using paragraphs and maybe headers to structure everything neatly. I'll create a concise annotated list with links and make sure to cite sources properly.",
      isThinkingOpen: true,
      isSearchOpen: true
    }
  ]);

  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;
    const target = e.currentTarget;
    
    target.setPointerCapture(e.pointerId);
    
    // Inverted logic for right sidebar: Dragging left increases width
    const onPointerMove = (moveEvent: PointerEvent) => {
        const newWidth = startWidth + (startX - moveEvent.clientX);
        setWidth(Math.min(Math.max(newWidth, 300), 700));
    };
    
    const onPointerUp = (upEvent: PointerEvent) => {
        setIsResizing(false);
        target.releasePointerCapture(upEvent.pointerId);
        target.removeEventListener('pointermove', onPointerMove);
        target.removeEventListener('pointerup', onPointerUp);
    };
    
    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
  };

  const toggleSection = (msgId: string, section: 'thinking' | 'search') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== msgId) return msg;
      if (section === 'thinking') return { ...msg, isThinkingOpen: !msg.isThinkingOpen };
      if (section === 'search') return { ...msg, isSearchOpen: !msg.isSearchOpen };
      return msg;
    }));
  };

  const panelStyle = {
    width: width,
    backgroundColor: 'transparent',
  } as React.CSSProperties;

  if (!isOpen) return <div className="w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" />;

  return (
    <div 
        ref={sidebarRef}
        style={panelStyle}
        className={`
            flex flex-col h-full shrink-0 select-none outline-none overflow-hidden 
            transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative
            ${isResizing ? 'transition-none' : ''}
        `}
    >
      {/* Resizer Handle */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize z-50 hover:bg-black/10 transition-colors group touch-none"
        onPointerDown={handleResizeStart}
        onDoubleClick={() => setWidth(360)}
      />

      {/* Content Container */}
      <div className="flex-1 flex flex-col min-h-0 p-2 pl-0 h-full">
          <div className="w-full h-full flex flex-col bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] ring-1 ring-black/5">
              
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-transparent">
                 <button 
                    onClick={() => setMessages([])}
                    className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors"
                    title="New Chat"
                 >
                    <SquarePen size={18} />
                 </button>

                 <div className="flex items-center gap-1">
                     <button className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors">
                         <Sparkles size={18} />
                     </button>
                     <button onClick={onClose} className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors">
                         <PanelLeft size={18} className="rotate-180" />
                     </button>
                     <button onClick={onClose} className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors">
                         <X size={18} />
                     </button>
                 </div>
              </div>

              {/* Main Content Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
                 {messages.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-0 animate-in fade-in duration-700">
                      {/* Empty state content handled by footer chips mostly */}
                   </div>
                 ) : (
                   messages.map((msg) => (
                     <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                       
                       {/* User Message */}
                       {msg.role === 'user' && (
                         <div className="bg-[#F0F2F5] dark:bg-[#2C2C2E] px-4 py-2.5 rounded-[20px] text-[var(--text-primary)] max-w-[90%] leading-relaxed">
                           {msg.content}
                         </div>
                       )}

                       {/* Model Response */}
                       {msg.role === 'model' && (
                         <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                           
                           {/* Thought Accordion */}
                           {msg.thought && (
                             <div className="flex flex-col gap-2">
                               <button 
                                 onClick={() => toggleSection(msg.id, 'thinking')}
                                 className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-colors w-fit"
                               >
                                 {msg.isThinkingOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                 <span>Thought for {msg.thoughtTime}</span>
                               </button>
                               
                               {msg.isThinkingOpen && (
                                 <div className="ml-2 pl-4 border-l-2 border-[var(--border-subtle)] text-[var(--text-secondary)] text-sm leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-top-1">
                                   {msg.thought}
                                 </div>
                               )}
                             </div>
                           )}

                           {/* Search Accordion */}
                           {msg.searches && (
                             <div className="flex flex-col gap-2">
                               <button 
                                 onClick={() => toggleSection(msg.id, 'search')}
                                 className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-colors w-fit"
                               >
                                  <Globe size={16} />
                                  <span>Searched the web</span>
                               </button>

                               {msg.isSearchOpen && (
                                 <div className="ml-2 pl-4 border-l-2 border-[var(--border-subtle)] flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
                                    {msg.searches.map((term, i) => (
                                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[#F0F2F5] dark:bg-white/5 rounded-full text-xs text-[var(--text-secondary)]">
                                         <Search size={10} />
                                         <span className="truncate max-w-[150px]">{term}</span>
                                      </div>
                                    ))}
                                    <div className="px-2 py-1.5 text-xs text-[var(--text-tertiary)]">+ 3 more</div>
                                 </div>
                               )}
                             </div>
                           )}

                           {/* Actual Content */}
                           <div className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                           </div>
                         </div>
                       )}
                     </div>
                   ))
                 )}
              </div>

              {/* Footer Area */}
              <div className="p-4 pt-2 shrink-0 flex flex-col gap-3 bg-white dark:bg-[#1E1E1E] z-10">
                
                {/* Suggestions (Visible if empty or logic dictates) */}
                {messages.length === 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-transparent hover:bg-[var(--bg-subtle)] rounded-lg text-[13px] font-medium text-[var(--text-secondary)] transition-colors border border-[var(--border-subtle)]">
                      <Lightbulb size={14} />
                      <span>Explain</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-transparent hover:bg-[var(--bg-subtle)] rounded-lg text-[13px] font-medium text-[var(--text-secondary)] transition-colors border border-[var(--border-subtle)]">
                      <Book size={14} />
                      <span>Table of Contents</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-transparent hover:bg-[var(--bg-subtle)] rounded-lg text-[13px] font-medium text-[var(--text-secondary)] transition-colors border border-[var(--border-subtle)]">
                      <Quote size={14} />
                      <span>Top Quotes</span>
                    </button>
                  </div>
                )}

                {/* Input Container - Clean rounded pill */}
                <div className="bg-[#F0F4F9] dark:bg-[#2C2C2E] rounded-[28px] p-2 pl-4 relative flex items-center gap-2 focus-within:ring-1 focus-within:ring-[var(--border-subtle)] transition-all duration-200">
                  
                  {/* Left Actions */}
                  <div className="flex items-center gap-1 -ml-1">
                      <button className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <Plus size={18} />
                      </button>
                  </div>

                  {/* Input */}
                  <input 
                    className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder-[#5F6368] dark:placeholder-[#9ca3af] text-[15px]"
                    placeholder="Ask a question about this page..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                       if (e.key === 'Enter' && input.trim()) {
                         setMessages(prev => [...prev, { id: String(Date.now()), role: 'user', content: input }]);
                         setInput('');
                       }
                    }}
                  />
                  
                  {/* Right Actions */}
                  <div className="flex items-center gap-1">
                     <button className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <Camera size={18} />
                     </button>
                     <button className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <Mic size={18} />
                     </button>
                     <button 
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                            input.trim() 
                            ? 'bg-[var(--text-primary)] text-[var(--bg-surface)]' 
                            : 'bg-[#E3E3E3] dark:bg-white/10 text-[var(--text-tertiary)]'
                        }`}
                     >
                         <ArrowUp size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ChatPanel;
