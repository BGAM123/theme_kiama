import React from 'react';
import { useAdminModels, useUpdateAiModel } from './useAdminModels';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Star, Zap, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const providerEmoji: Record<string, string> = {
    OpenAI: '🟢',
    Anthropic: '🟣',
    Google: '🔵',
    Mistral: '🟠',
};

export function AdminModelsPage() {
    const { data, isLoading } = useAdminModels();
    const { mutate: updateModel, isPending } = useUpdateAiModel();

    const handleSetDefault = (id: string) => {
        updateModel({ id, isDefault: true }, {
            onSuccess: () => toast.success('Modèle par défaut mis à jour.'),
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Modèles IA"
                description="Gérez les modèles de langage disponibles sur la plateforme."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <Card key={i} className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-4"><Skeleton className="h-6 w-48" /></CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    data?.map(model => (
                        <Card
                            key={model.id}
                            className={cn(
                                "border shadow-sm hover:shadow-md transition-shadow overflow-hidden",
                                model.isDefault ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-200"
                            )}
                        >
                            <div className={cn("h-1.5 w-full", model.status === 'ACTIVE' ? "bg-gradient-to-r from-indigo-500 to-indigo-400" : "bg-slate-200")} />
                            <CardContent className="pt-6 space-y-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">{providerEmoji[model.provider] || '🤖'}</div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 text-lg leading-tight">{model.modelName}</h3>
                                                {model.isDefault && (
                                                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold text-xs gap-1 border">
                                                        <Star className="h-3 w-3 fill-indigo-400" /> Défaut
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">{model.provider}</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={model.status === 'ACTIVE'}
                                        onCheckedChange={(checked) => updateModel({ id: model.id, status: checked ? 'ACTIVE' : 'INACTIVE' })}
                                        disabled={isPending}
                                        aria-label={`Activer ${model.modelName}`}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                                        <Zap className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                                        <p className="text-lg font-bold text-slate-800 tabular-nums">{model.requestCount.toLocaleString('fr-FR')}</p>
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Requêtes</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                                        <Clock className="h-4 w-4 text-indigo-500 mx-auto mb-1" />
                                        <p className="text-lg font-bold text-slate-800 tabular-nums">{model.avgResponseTime}s</p>
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Moy. réponse</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                                        <DollarSign className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                                        <p className="text-lg font-bold text-slate-800 tabular-nums">${model.costPer1kTokens}</p>
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">/1K tokens</p>
                                    </div>
                                </div>

                                {!model.isDefault && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSetDefault(model.id)}
                                        disabled={isPending}
                                        className="w-full border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
                                    >
                                        <Star className="h-3.5 w-3.5 mr-2" /> Définir par défaut
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
