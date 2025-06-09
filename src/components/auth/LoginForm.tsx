
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm = ({ onClose }: LoginFormProps) => {
  const { login, isLoading, error } = useUserStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        alert('Senhas não conferem');
        return;
      }
      // Handle signup logic here
      console.log('Signup attempt:', formData);
    } else {
      await login(formData.email, formData.password);
      if (!error) {
        onClose();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 mx-auto">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <CardTitle className="text-2xl gradient-text">
            {isSignUp ? 'Criar Conta' : 'Entrar no SportSync'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isSignUp 
              ? 'Crie sua conta e personalize sua experiência esportiva'
              : 'Entre para acompanhar seus times e jogos favoritos'
            }
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Confirme sua senha"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 py-3"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>{isSignUp ? 'Criar Conta' : 'Entrar'}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 font-medium text-primary hover:underline"
              >
                {isSignUp ? 'Fazer login' : 'Criar conta'}
              </button>
            </p>
          </div>

          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            {!isSignUp && (
              <Button variant="ghost" className="text-primary">
                Esqueci a senha
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
