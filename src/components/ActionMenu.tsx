import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export interface ActionMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success';
  hidden?: boolean;
}

export interface ActionMenuProps {
  items: (ActionMenuItem | ActionMenuItem[])[];
  align?: 'right' | 'left';
  triggerIcon?: React.ReactNode;
  triggerClassName?: string;
  menuWidthClassName?: string;
  title?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  align = 'right',
  triggerIcon,
  triggerClassName,
  menuWidthClassName = 'w-48',
  title = 'More Actions',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedGroups = items
    .map((group) => (Array.isArray(group) ? group : [group]))
    .map((group) => group.filter((item) => !item.hidden))
    .filter((group) => group.length > 0);

  if (normalizedGroups.length === 0) return null;

  const alignmentClass = align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={
          triggerClassName ||
          'p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none'
        }
        title={title}
        aria-label={title}
      >
        {triggerIcon || <MoreVertical className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div
          className={`absolute ${alignmentClass} mt-1 ${menuWidthClassName} rounded-xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-700/80 z-30 py-1.5 focus:outline-none divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-top-1 duration-150`}
        >
          {normalizedGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="py-1">
              {group.map((item) => {
                let colorClasses =
                  'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white';
                if (item.variant === 'danger') {
                  colorClasses = 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40';
                } else if (item.variant === 'success') {
                  colorClasses = 'text-[#006E1C] dark:text-emerald-400 hover:bg-[#EAF7EC] dark:hover:bg-emerald-950/40';
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      item.onClick();
                    }}
                    className={`w-full flex items-center px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${colorClasses}`}
                  >
                    {item.icon && <span className="mr-2.5 shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

