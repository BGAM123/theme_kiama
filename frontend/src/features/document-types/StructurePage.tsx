import React from 'react';
import { useDocumentTypeStructure, useSaveStructure, useValidateDocumentType } from './useDocumentTypes';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Network, CheckCircle2, FileText, CheckSquare, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

export function StructurePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: structure, isLoading } = useDocumentTypeStructure(id!);
    const { mutate: validateDoc, isPending: isValidating } = useValidateDocumentType();
    const { mutate: saveStructure, isPending: isSaving } = useSaveStructure();

    const handleValidate = () => {
        validateDoc(id!, {
            onSuccess: () => {
                toast.success("Document Type validé et activé !");
                navigate('/document-types');
            }
        });
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col pt-2 animate-in fade-in">
            <PageHeader
                title="Structure Sémantique"
                description="Vérifiez l'arborescence extraite par l'IA avant validation."
                action={
                    <>
                        <Button variant="outline" onClick={() => navigate('/document-types')} className="bg-white">Annuler</Button>
                        <Button onClick={handleValidate} disabled={isValidating || isLoading} className="bg-indigo-600 text-white shadow-md">
                            {isValidating ? "Activation..." : "Valider le Document Type"} <CheckCircle2 className="ml-2 h-4 w-4" />
                        </Button>
                    </>
                }
            />

            <div className="flex-1 flex gap-6 overflow-hidden min-h-0 pt-2">

                {/* PANEL GAUCHE: Arbre */}
                <div className="w-80 h-full flex flex-col bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden z-10 shrink-0">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <Network className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-semibold text-slate-800">Hiérarchie</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-5/6 ml-4" /><Skeleton className="h-8 w-4/6 ml-8" />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {structure?.map((node) => (
                                    <div key={node.id} className="space-y-2">
                                        <div className="group flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                                            <GripVertical className="h-4 w-4 text-slate-300 cursor-grab active:cursor-grabbing" />
                                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{node.type}</span>
                                            <span className="text-sm font-medium text-slate-700 truncate">{node.label}</span>
                                            {node.required && <CheckSquare className="h-3 w-3 text-emerald-500 ml-auto shrink-0" />}
                                        </div>
                                        {node.children && node.children.length > 0 && (
                                            <div className="pl-6 space-y-2 border-l-2 border-slate-100 ml-3">
                                                {node.children.map(child => (
                                                    <div key={child.id} className="group flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                                                        <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />
                                                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{child.type}</span>
                                                        <span className="text-sm text-slate-600 truncate">{child.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* PANEL DROIT: Aperçu visuel mocké */}
                <div className="flex-1 h-full bg-slate-100/50 rounded-xl border border-slate-200 overflow-y-auto p-8 flex justify-center custom-scrollbar shadow-inner relative">
                    <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-16 space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                        {isLoading ? (
                            <div className="space-y-8">
                                <Skeleton className="h-12 w-3/4 mx-auto" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : (
                            <>
                                <div className="border-b-2 border-slate-900 pb-8 mb-12 text-center space-y-4">
                                    <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">Titre du Document</h1>
                                    <p className="text-slate-500 font-medium">Page de garde standard générée</p>
                                </div>

                                {structure?.filter(n => n.type !== 'COVER').map(node => (
                                    <div key={node.id} className="space-y-4 hover:bg-indigo-50/50 -mx-4 p-4 rounded-xl border border-transparent hover:border-indigo-100 transition-colors cursor-default">
                                        <h2 className="text-xl font-bold text-slate-800">{node.label}</h2>
                                        <div className="h-4 bg-slate-100 rounded w-full" />
                                        <div className="h-4 bg-slate-100 rounded w-5/6" />

                                        {node.children?.map(child => (
                                            <div key={child.id} className="pl-6 pt-4 space-y-3">
                                                <h3 className="text-lg font-semibold text-slate-700">{child.label}</h3>
                                                <div className="h-3 bg-slate-50 rounded w-full" />
                                                <div className="h-3 bg-slate-50 rounded w-4/6" />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
