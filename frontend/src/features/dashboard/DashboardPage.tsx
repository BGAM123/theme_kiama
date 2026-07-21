import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from './useDashboard';
import { KpiCard } from './KpiCard';
import { GenerationChart } from './GenerationChart';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, FileUp, FileText, Clock, Users, ArrowRight, MessageSquare } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function DashboardPage() {
    const navigate = useNavigate();
    const { data, isLoading } = useDashboard();

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-8">
            <PageHeader
                title="Tableau de bord"
                description="Aperçu de l'activité documentaire générative."
                action={
                    <>
                        <Button variant="outline" onClick={() => navigate('/document-types/new')} className="gap-2 shrink-0 border-slate-200">
                            <FileUp className="h-4 w-4" />
                            <span className="hidden sm:inline">Nouveau Document Type</span>
                        </Button>
                        <Button onClick={() => navigate('/chat')} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-md hover:shadow-lg transition-all">
                            <Plus className="h-4 w-4" />
                            <span>Générer un document</span>
                        </Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <KpiCard title="Générations ce mois" value={data?.totalDocuments ?? 0} icon={FileText} loading={isLoading} />
                <KpiCard title="Temps moyen" value={`${data?.avgGenerationTime ?? 0}s`} icon={Clock} loading={isLoading} />
                <KpiCard title="Types Actifs" value={data?.activeDocTypes ?? 0} icon={FileText} loading={isLoading} />
                <KpiCard title="Utilisateurs Actifs" value={data?.activeUsers ?? 0} icon={Users} loading={isLoading} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <Card className="xl:col-span-2 shadow-sm border-slate-200">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg text-slate-800">Activité de génération (14 derniers jours)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <GenerationChart data={data?.dailyStats ?? []} loading={isLoading} />
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg text-slate-800">Dernières Activités</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-indigo-600 hover:text-indigo-700 h-8 font-semibold hover:bg-indigo-50">
                            Voir tout <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4 flex-1 flex flex-col">
                        <div className="space-y-3">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex gap-4 p-2"><div className="w-10 h-10 bg-slate-100 rounded-lg animate-pulse" /><div className="flex-1 space-y-2"><div className="h-4 bg-slate-100 rounded w-full" /><div className="h-3 bg-slate-100 rounded w-1/2" /></div></div>
                                ))
                            ) : (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-50 group border border-transparent hover:border-slate-100 transition-all cursor-pointer" onClick={() => navigate('/chat')}>
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <MessageSquare className="h-5 w-5 text-indigo-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Contrat de Travail</p>
                                                <p className="text-xs text-slate-500 mt-0.5 font-medium">Il y a {i * 2} heures</p>
                                            </div>
                                        </div>
                                        <StatusBadge status="ACTIVE" className="scale-90 origin-right shadow-sm" />
                                    </div>
                                ))
                            )}
                        </div>

                        {/* CTA at the bottom if desired */}
                        {!isLoading && (
                            <div className="mt-auto pt-6">
                                <Button variant="outline" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700" onClick={() => navigate('/chat')}>
                                    Nouvelle génération métier
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
