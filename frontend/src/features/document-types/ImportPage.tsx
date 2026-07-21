import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { documentTypeSchema, DocumentTypeFormData } from './document-type.schema';
import { useCreateDocumentType } from './useDocumentTypes';
import { useExtractionStatus } from './useExtractionStatus';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, CheckCircle2, ChevronRight, File, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ImportPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [jobId, setJobId] = useState<string | null>(null);
    const [createdDocId, setCreatedDocId] = useState<string | null>(null);

    const { mutate: createDoc, isPending: isCreating } = useCreateDocumentType();
    const { data: extractionStatus } = useExtractionStatus(jobId);

    const form = useForm<DocumentTypeFormData>({
        resolver: zodResolver(documentTypeSchema),
        defaultValues: { name: '', categoryId: '', description: '' }
    });

    // Basic native drag and drop handler simulation since external react-dropzone requires installation
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.docx'))) {
            setFile(droppedFile);
            form.setValue('name', droppedFile.name.replace(/\.[^/.]+$/, ""));
        } else {
            toast.error('Veuillez sélectionner un fichier PDF ou DOCX.');
        }
    };

    const onSubmit = (data: DocumentTypeFormData) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', data.name);
        formData.append('categoryId', data.categoryId);

        createDoc(formData, {
            onSuccess: (res) => {
                setJobId(res.jobId);
                setCreatedDocId(res.id);
                setStep(3);
            }
        });
    };

    // Status effect listener
    React.useEffect(() => {
        if (extractionStatus?.status === 'COMPLETED') {
            toast.success("Extraction sémantique terminée !");
        } else if (extractionStatus?.status === 'FAILED') {
            toast.error("L'extraction a échoué. Veuillez réessayer.");
            setStep(2); // allow retry
            setJobId(null);
        }
    }, [extractionStatus?.status]);


    return (
        <div className="max-w-3xl mx-auto space-y-8 py-8 animate-in fade-in">
            <PageHeader title="Importer un Document Type" description="Digitalisez et sématisez vos modèles Word et PDF en quelques secondes." />

            <div className="flex items-center justify-between mx-auto mb-12 relative max-w-lg">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -z-10 -translate-y-1/2 rounded-full" />
                {[
                    { num: 1, label: 'Fichier' },
                    { num: 2, label: 'Configuration' },
                    { num: 3, label: 'Extraction IA' }
                ].map(s => (
                    <div key={s.num} className="flex flex-col items-center gap-2">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300",
                            step > s.num ? "bg-emerald-500 text-white" : step === s.num ? "bg-indigo-600 text-white ring-4 ring-indigo-50" : "bg-white border-2 border-slate-200 text-slate-400"
                        )}>
                            {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                        </div>
                        <span className={cn("text-xs font-semibold uppercase tracking-wider", step >= s.num ? "text-indigo-900" : "text-slate-400")}>{s.label}</span>
                    </div>
                ))}
            </div>

            <Card className="shadow-lg border-slate-200 overflow-hidden bg-white/50 backdrop-blur-sm">
                <CardContent className="p-8">

                    {step === 1 && (
                        <div className="space-y-6 text-center">
                            <div
                                className={cn("border-2 border-dashed rounded-2xl p-12 transition-all bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-300", file ? "border-indigo-500 bg-indigo-50/20" : "border-slate-300")}
                                onDragOver={e => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                {!file ? (
                                    <>
                                        <div className="mx-auto w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
                                            <UploadCloud className="h-8 w-8 text-indigo-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Glissez votre fichier ici</h3>
                                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Formats acceptés : .docx, .pdf (Max 10Mo)</p>
                                        <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors inline-block">
                                            Parcourir les fichiers
                                            <input type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (f) { setFile(f); form.setValue('name', f.name.replace(/\.[^/.]+$/, "")); }
                                            }} />
                                        </label>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center animate-in zoom-in-95">
                                        <File className="h-16 w-16 text-indigo-600 mb-4" />
                                        <p className="font-semibold text-slate-900 text-lg mb-1">{file.name}</p>
                                        <p className="text-slate-500 text-sm mb-6">{(file.size / 1024 / 1024).toFixed(2)} Mo</p>
                                        <Button variant="outline" onClick={() => setFile(null)} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                            <X className="h-4 w-4" /> Retirer
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={() => setStep(2)} disabled={!file} className="bg-indigo-600 text-white px-8">Suivant <ChevronRight className="ml-2 h-4 w-4" /></Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nom du modèle</FormLabel>
                                                <FormControl><Input {...field} className="bg-slate-50 border-slate-200" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="categoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Catégorie fonctionnelle</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger className="bg-slate-50"><SelectValue placeholder="Sélectionner..." /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="cat_rh">Ressources Humaines</SelectItem>
                                                        <SelectItem value="cat_jur">Juridique</SelectItem>
                                                        <SelectItem value="cat_fin">Finance</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex justify-between pt-6 border-t border-slate-100">
                                    <Button type="button" variant="ghost" onClick={() => setStep(1)}>Retour</Button>
                                    <Button type="submit" className="bg-indigo-600 text-white" disabled={isCreating}>
                                        {isCreating ? "Préparation..." : "Lancer l'extraction IA"} <Sparkles className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}

                    {step === 3 && extractionStatus && (
                        <div className="py-12 space-y-8 text-center flex flex-col items-center">
                            <div className="relative">
                                <div className="mx-auto w-24 h-24 rounded-full border-4 border-indigo-50 flex items-center justify-center">
                                    {extractionStatus.status !== 'COMPLETED' ? (
                                        <div className="h-16 w-16 text-indigo-600 animate-pulse flex items-center justify-center"><Sparkles className="h-10 w-10 animate-spin-slow" /></div>
                                    ) : (
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 w-full max-w-md mx-auto">
                                <h3 className="text-xl font-bold text-slate-800">
                                    {extractionStatus.status === 'COMPLETED' ? 'Extraction Réussie !' : 'Analyse en cours...'}
                                </h3>
                                <p className="text-slate-500 font-medium">
                                    {extractionStatus.currentStep}
                                </p>
                                <Progress value={extractionStatus.progress} className="h-2 w-full bg-slate-100 [&>div]:bg-indigo-600" />
                                <p className="text-sm font-semibold text-slate-400">{extractionStatus.progress}%</p>
                            </div>

                            {extractionStatus.status === 'COMPLETED' && createdDocId && (
                                <div className="pt-8 animate-in slide-in-from-bottom-4">
                                    <Button onClick={() => navigate(`/document-types/${createdDocId}/structure`)} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20">
                                        Prévisualiser la structure générée <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}
