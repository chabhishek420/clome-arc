
import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Hash, Plus, MousePointer2, Brush, Mic, ArrowUp } from 'lucide-react';
import { Tab } from '../types';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: Tab[];
  onSelectTab: (id: string) => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose, tabs, onSelectTab }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure render before focus
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTabs = tabs.filter(tab => 
    tab.title.toLowerCase().includes(query.toLowerCase()) || 
    tab.url.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4 font-sans text-[var(--text-primary)]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container - Matches the screenshot's rounded, white, shadowed look */}
      <div className="relative w-full max-w-[640px] bg-[#FDFDFD] dark:bg-[#1E1E1E] rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
        
        {/* Input Area */}
        <div className="flex flex-col px-5 pt-5 pb-5 gap-6">
            {/* Top Row: Search Icon + Input */}
            <div className="flex items-center gap-4 pl-1">
                <Search className="text-[#A1A1AA] shrink-0" size={20} strokeWidth={2} />
                <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 min-w-0 bg-transparent text-[#18181B] dark:text-[#F4F4F5] text-[20px] placeholder-[#A1A1AA] font-light outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') onClose();
                        if (e.key === 'Enter') {
                             if (filteredTabs.length > 0) {
                                onSelectTab(filteredTabs[0].id);
                             }
                             onClose();
                        }
                    }}
                />
            </div>

            {/* Bottom Row: Chips & Actions (Only visible when input is empty) */}
            {!query && (
                <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2.5">
                        <ActionChip icon={<Plus size={16} />} label="Add tabs or files" />
                        <ActionChip icon={<MousePointer2 size={16} className="-rotate-45" />} label="Tools" />
                        <ActionChip icon={<Brush size={16} />} label="Formats" />
                    </div>
                    
                    <div className="flex items-center gap-4 pr-1">
                        <Mic size={20} className="text-[#A1A1AA] hover:text-[#71717A] cursor-pointer transition-colors" />
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F4F4F5] dark:bg-white/10 hover:bg-[#E4E4E7] transition-colors cursor-pointer">
                            <ArrowUp size={16} className="text-[#71717A] dark:text-[#A1A1AA]" />
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Search Results (Visible when typing) */}
        {query && (
            <div className="border-t border-[#F4F4F5] dark:border-white/5 bg-[#FAFAFA] dark:bg-black/20 max-h-[50vh] overflow-y-auto py-2">
                {filteredTabs.map((tab, idx) => (
                    <div 
                        key={tab.id}
                        onClick={() => { onSelectTab(tab.id); onClose(); }}
                        className={`mx-2 px-3 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${idx === 0 ? 'bg-[#F4F4F5] dark:bg-white/10' : 'hover:bg-[#F4F4F5] dark:hover:bg-white/5'}`}
                    >
                        <div className="w-9 h-9 rounded-[10px] bg-white dark:bg-white/10 shadow-sm border border-black/5 flex items-center justify-center text-[#71717A]">
                            {tab.pinned ? <Hash size={16} /> : <Globe size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="text-[15px] font-medium text-[#18181B] dark:text-[#F4F4F5]">{tab.title}</div>
                             <div className="text-[12px] text-[#A1A1AA] truncate">{tab.url}</div>
                        </div>
                        {idx === 0 && <span className="text-[11px] font-semibold text-[#A1A1AA] px-2 bg-white dark:bg-white/10 rounded border border-black/5 py-0.5">Enter</span>}
                    </div>
                ))}
                
                 {filteredTabs.length === 0 && (
                     <div className="px-5 py-8 text-center text-[#A1A1AA] text-sm">
                         No open tabs found for "{query}"<br/>
                         <span className="text-xs opacity-70 mt-2 block">Press Enter to search Google</span>
                     </div>
                 )}
            </div>
        )}
      </div>
    </div>
  );
};

const ActionChip = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#E4E4E7] dark:border-white/10 bg-white dark:bg-white/5 hover:bg-[#F4F4F5] dark:hover:bg-white/10 transition-colors group shadow-sm">
        <span className="text-[#71717A] dark:text-[#A1A1AA] group-hover:text-[#52525B] dark:group-hover:text-white transition-colors">
            {icon}
        </span>
        <span className="text-[14px] font-medium text-[#52525B] dark:text-[#A1A1AA] group-hover:text-[#18181B] dark:group-hover:text-white transition-colors">
            {label}
        </span>
    </button>
);

export default CommandBar;
