
import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff, HelpCircle, Github, Facebook } from 'lucide-react';

const LoginScreen = () => {
  const { login, isLoading, error } = useUserStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('joao@email.com');
  const [password, setPassword] = useState('senha123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  const handleForgotPassword = () => {
    alert('Funcionalidade de recuperação de senha será implementada em breve!');
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Login com ${provider} será implementado em breve!`);
  };

  const handleHelp = () => {
    alert('Entre em contato conosco: suporte@sportsync.com\nTelefone: (11) 99999-9999');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo e Header */}
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-400 mx-auto shadow-lg">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text-brand">SportSync</h1>
            <p className="text-muted-foreground mt-2">Seu universo esportivo em um só lugar</p>
          </div>
        </div>
        
        {/* Card de Login */}
        <Card className="shadow-2xl border-border bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Entre na sua conta</CardTitle>
            <p className="text-sm text-muted-foreground">
              Acesse seu dashboard personalizado
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="seu@email.com" 
                    className="pl-10 h-12 bg-background/50 border-border focus:border-primary transition-colors" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="pl-10 pr-12 h-12 bg-background/50 border-border focus:border-primary transition-colors" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Lembrar-me e Esqueci a senha */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Lembrar-me
                  </Label>
                </div>
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
                >
                  Esqueci a senha
                </Button>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 font-semibold shadow-lg" 
                disabled={isLoading}
              >
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

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou continue com</span>
              </div>
            </div>

            {/* Login Social */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSocialLogin('Google')}
                className="h-12 border-border hover:bg-accent"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSocialLogin('Facebook')}
                className="h-12 border-border hover:bg-accent"
              >
                <Facebook className="mr-2 h-4 w-4 fill-[#1877F2]" />
                Facebook
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Button 
              variant="link" 
              className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
              onClick={() => alert('Funcionalidade de registro será implementada em breve!')}
            >
              Crie uma agora
            </Button>
          </p>
          
          {/* Botão de Ajuda */}
          <Button 
            variant="ghost" 
            onClick={handleHelp}
            className="text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Precisa de ajuda?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
