
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, CreditCard, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../components/common/Header';

const TicketScreen = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 pt-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 mx-auto mb-4">
            <Ticket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Ingressos</h1>
          <p className="text-muted-foreground">
            Compre seus ingressos com segurança e comodidade
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-card rounded-xl p-8 text-center mb-6">
          <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Em Breve!</h2>
          <p className="text-muted-foreground mb-6">
            Estamos trabalhando para trazer a melhor experiência de compra de ingressos. 
            Em breve você poderá comprar ingressos diretamente pelo app com total segurança.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Pagamento Seguro</h3>
              <p className="text-sm text-muted-foreground">
                Múltiplas formas de pagamento
              </p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Melhores Lugares</h3>
              <p className="text-sm text-muted-foreground">
                Escolha o melhor lugar no estádio
              </p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Entrega Rápida</h3>
              <p className="text-sm text-muted-foreground">
                Ingressos digitais instantâneos
              </p>
            </div>
          </div>

          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Funcionalidade em desenvolvimento
          </Badge>
        </div>

        {/* Temporary Options */}
        <div className="bg-card rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Enquanto isso...</h3>
          <p className="text-muted-foreground mb-4">
            Você pode comprar ingressos através dos canais oficiais:
          </p>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Ticket className="h-4 w-4 mr-2" />
              Site oficial do time
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Ticket className="h-4 w-4 mr-2" />
              Bilheteria do estádio
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Ticket className="h-4 w-4 mr-2" />
              Pontos de venda autorizados
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketScreen;
