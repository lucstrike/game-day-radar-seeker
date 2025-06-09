import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const LoginScreen = () => {
  const { login, isLoading, error } = useUserStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('joao@email.com');
  const [password, setPassword] = useState('senha123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
           <h1 className="text-4xl font-bold gradient-text-brand">SportSync</h1>
           <p className="text-muted-foreground mt-2">Seu universo esportivo em um só lugar.</p>
        </div>
        
        <div className="bg-card p-8 rounded-lg shadow-2xl border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" required />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" className="w-full font-semibold py-3" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta? <a href="#" className="font-medium text-primary hover:underline">Crie uma agora</a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;