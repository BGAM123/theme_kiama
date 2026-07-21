import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from './auth.schema';
import { useLogin } from './useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoginPage() {
    const { mutate, isPending } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = (data: LoginFormData) => {
        mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <Card className={cn("w-full max-w-md shadow-2xl border-slate-200 z-10 animate-in zoom-in-95 duration-500", isPending && "pointer-events-none")}>
                <CardHeader className="space-y-2 text-center pb-8 border-b border-slate-100 mb-6 bg-slate-50/50 rounded-t-xl backdrop-blur-sm">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold text-2xl mb-4 shadow-lg ring-4 ring-indigo-50">
                        D
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Connexion <span className="text-indigo-600">DocuAI</span>
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Génération documentaire B2B par IA
                    </p>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {isPending ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold text-slate-700">Adresse e-mail</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="nom@entreprise.fr"
                                                        type="email"
                                                        autoComplete="email"
                                                        className="bg-slate-50/50 hover:bg-white focus:bg-white transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold text-slate-700">Mot de passe</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="••••••••"
                                                            type={showPassword ? "text" : "password"}
                                                            autoComplete="current-password"
                                                            className="bg-slate-50/50 hover:bg-white focus:bg-white transition-colors pr-10"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-0 top-0 h-10 w-10 text-slate-400 hover:text-slate-600 rounded-l-none"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <a href="/forgot-password" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors focus-visible:outline-none focus-visible:underline">
                                    Mot de passe oublié ?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                className={cn("w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all", isPending && "animate-pulse")}
                                disabled={isPending}
                            >
                                {isPending ? "Connexion en cours..." : "Se connecter"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
