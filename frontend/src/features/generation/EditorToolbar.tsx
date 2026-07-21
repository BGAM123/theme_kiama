import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function EditorToolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null;

    const ToggleBtn = ({ onClick, active, icon: Icon }: any) => (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={cn(
                "h-8 w-8 rounded-md transition-colors",
                active ? "bg-slate-200 text-slate-900 shadow-inner" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
        >
            <Icon className="h-4 w-4" />
        </Button>
    );

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
                <ToggleBtn onClick={() => editor.chain().focus().undo().run()} active={false} icon={Undo} />
                <ToggleBtn onClick={() => editor.chain().focus().redo().run()} active={false} icon={Redo} />
            </div>

            <div className="flex items-center gap-1 px-2 border-r border-slate-200">
                <ToggleBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} icon={Heading1} />
                <ToggleBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} icon={Heading2} />
                <ToggleBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} icon={Heading3} />
            </div>

            <div className="flex items-center gap-1 pl-2 border-r border-slate-200">
                <ToggleBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon={Bold} />
                <ToggleBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} icon={Italic} />
            </div>

            <div className="flex items-center gap-1 pl-2">
                <ToggleBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} icon={List} />
                <ToggleBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} icon={ListOrdered} />
            </div>
        </div>
    );
}
