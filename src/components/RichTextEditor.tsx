import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Unlink, RemoveFormatting,
  Undo2, Redo2, Code, Eye,
  type LucideIcon,
} from 'lucide-react';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  className?: string;
}

/* ---------------- toolbar config ---------------- */

interface ToolbarItem {
  title: string;
  icon?: LucideIcon;
  label?: string;
  command?: string;
  arg?: string;
  action?: 'insertLink';
}

const TOOLBAR_GROUPS: ToolbarItem[][] = [
  [
    { title: 'Heading 1', command: 'formatBlock', arg: '<h1>', icon: Heading1 },
    { title: 'Heading 2', command: 'formatBlock', arg: '<h2>', icon: Heading2 },
    { title: 'Heading 3', command: 'formatBlock', arg: '<h3>', icon: Heading3 },
    { title: 'Normal Paragraph', command: 'formatBlock', arg: '<p>', label: 'Paragraph' },
  ],
  [
    { title: 'Bold (Ctrl+B)', command: 'bold', icon: Bold },
    { title: 'Italic (Ctrl+I)', command: 'italic', icon: Italic },
    { title: 'Underline (Ctrl+U)', command: 'underline', icon: Underline },
    { title: 'Strikethrough', command: 'strikeThrough', icon: Strikethrough },
  ],
  [
    { title: 'Bulleted List', command: 'insertUnorderedList', icon: List },
    { title: 'Numbered List', command: 'insertOrderedList', icon: ListOrdered },
    { title: 'Blockquote', command: 'formatBlock', arg: '<blockquote>', icon: Quote },
    { title: 'Horizontal Divider', command: 'insertHorizontalRule', icon: Minus },
  ],
  [
    { title: 'Align Left', command: 'justifyLeft', icon: AlignLeft },
    { title: 'Align Center', command: 'justifyCenter', icon: AlignCenter },
    { title: 'Align Right', command: 'justifyRight', icon: AlignRight },
    { title: 'Justify', command: 'justifyFull', icon: AlignJustify },
  ],
  [
    { title: 'Insert Link', action: 'insertLink', icon: LinkIcon },
    { title: 'Remove Link', command: 'unlink', icon: Unlink },
    { title: 'Clear Formatting', command: 'removeFormat', icon: RemoveFormatting },
  ],
  [
    { title: 'Undo', command: 'undo', icon: Undo2 },
    { title: 'Redo', command: 'redo', icon: Redo2 },
  ],
];

const GROUP_CLASSES =
  'flex items-center space-x-0.5 px-1 border-r border-slate-200 dark:border-slate-700';
const BUTTON_BASE =
  'p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer text-slate-700 dark:text-slate-300';
const BUTTON_LABEL =
  'px-2 py-1 text-[11px] font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer';

/** Typography styles applied inside the contentEditable area. */
const EDITOR_PROSE_CLASSES = `
  p-5 text-xs text-slate-800 dark:text-slate-200 font-sans focus:outline-none overflow-y-auto leading-relaxed
  [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:dark:text-white [&_h1]:mt-4 [&_h1]:mb-2
  [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-3 [&_h2]:mb-2
  [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:dark:text-slate-200 [&_h3]:mt-2 [&_h3]:mb-1
  [&_p]:mb-2.5
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1
  [&_li]:text-slate-700 [&_li]:dark:text-slate-300
  [&_blockquote]:border-l-3 [&_blockquote]:border-[#38B449] [&_blockquote]:pl-3 [&_blockquote]:italic
    [&_blockquote]:text-slate-500 [&_blockquote]:dark:text-slate-400 [&_blockquote]:my-3
  [&_a]:text-[#38B449] [&_a]:underline [&_a]:font-medium hover:[&_a]:text-[#2e963c]
  [&_hr]:my-4 [&_hr]:border-slate-200 [&_hr]:dark:border-slate-700
  [&_strong]:font-bold [&_strong]:text-slate-900 [&_strong]:dark:text-white
`.trim().replace(/\s+/g, ' ');

/* ---------------- component ---------------- */

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write content here...',
  minHeight = '360px',
  disabled = false,
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmittedValue = useRef(value);

  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(value);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const toolbarDisabled = disabled || isSourceMode;

  // Sync externally changed value (e.g. policy switch/reset) into the editor
  useEffect(() => {
    if (editorRef.current && value !== lastEmittedValue.current) {
      editorRef.current.innerHTML = value;
      lastEmittedValue.current = value;
    }
    setSourceCode(value);
  }, [value]);

  // Emit edits from contentEditable without re-rendering the editor itself
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastEmittedValue.current = html;
    onChange(html);
  }, [onChange]);

  const executeCommand = (command: string, arg?: string) => {
    if (toolbarDisabled) return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInsertLink = () => {
    const input = linkUrl.trim();
    if (!input) return;
    const url = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    executeCommand('createLink', url);
    setLinkUrl('');
    setLinkModalOpen(false);
  };

  const handleLinkKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInsertLink();
    } else if (e.key === 'Escape') {
      setLinkModalOpen(false);
    }
  };

  const handleToggleSourceMode = () => {
    if (isSourceMode) {
      if (editorRef.current) editorRef.current.innerHTML = sourceCode;
      lastEmittedValue.current = sourceCode;
      onChange(sourceCode);
      setIsSourceMode(false);
    } else {
      setSourceCode(editorRef.current?.innerHTML || '');
      setIsSourceMode(true);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceCode(e.target.value);
    lastEmittedValue.current = e.target.value;
    onChange(e.target.value);
  };

  return (
    <div
      className={`border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all focus-within:ring-2 focus-within:ring-[#38B449]/20 focus-within:border-[#38B449] ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 select-none">
        {TOOLBAR_GROUPS.map((group, i) => (
          <div key={i} className={GROUP_CLASSES}>
            {group.map((item) => (
              <button
                key={item.title}
                type="button"
                title={item.title}
                disabled={toolbarDisabled}
                onClick={() =>
                  item.action === 'insertLink'
                    ? setLinkModalOpen(true)
                    : executeCommand(item.command!, item.arg)
                }
                className={item.label ? BUTTON_LABEL : BUTTON_BASE}
              >
                {item.icon ? <item.icon className="w-4 h-4" /> : item.label}
              </button>
            ))}
          </div>
        ))}

        <button
          type="button"
          title={isSourceMode ? 'Switch to Visual Rich Text' : 'View HTML Source Code'}
          onClick={handleToggleSourceMode}
          className={`ml-auto flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            isSourceMode
              ? 'bg-[#38B449] text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {isSourceMode ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Visual Editor</span>
            </>
          ) : (
            <>
              <Code className="w-3.5 h-3.5" />
              <span>HTML Source</span>
            </>
          )}
        </button>
      </div>

      {/* Insert Link bar */}
      {linkModalOpen && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleLinkKeyDown}
            placeholder="https://example.com/legal"
            autoFocus
            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#38B449]"
          />
          <button
            type="button"
            onClick={handleInsertLink}
            className="px-3 py-1.5 text-xs font-semibold bg-[#38B449] text-white rounded-lg hover:bg-[#2e963c] transition-colors cursor-pointer"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setLinkModalOpen(false)}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editing area */}
      {isSourceMode ? (
        <textarea
          value={sourceCode}
          onChange={handleSourceChange}
          placeholder="Enter raw HTML content here..."
          style={{ minHeight }}
          className="w-full p-4 font-mono text-xs leading-relaxed text-slate-100 bg-slate-900 dark:bg-slate-950 focus:outline-none resize-y"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          data-placeholder={placeholder}
          style={{ minHeight }}
          className={EDITOR_PROSE_CLASSES}
        />
      )}
    </div>
  );
};