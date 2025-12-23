import { useState } from 'react';
import { Order, PaymentMethod } from '@/types';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Smartphone, CheckCircle2, ArrowLeft, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PaymentScreenProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentComplete: (method: PaymentMethod) => void;
}

export function PaymentScreen({ order, open, onOpenChange, onPaymentComplete }: PaymentScreenProps) {
  const { restaurant } = useRestaurant();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [copied, setCopied] = useState(false);

  const generatePixCode = () => {
    // In production, this would call an API to generate a real PIX code
    return `00020126580014br.gov.bcb.pix0136${restaurant.pixKey}5204000053039865406${order.total.toFixed(2)}5802BR`;
  };

  const handleCopyPix = async () => {
    const code = generatePixCode();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmPayment = () => {
    if (!selectedMethod) return;
    onPaymentComplete(selectedMethod);
    setSelectedMethod(null);
    onOpenChange(false);
  };

  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'pix', label: 'PIX', icon: <Smartphone className="h-6 w-6" />, description: 'Pagamento instantâneo' },
    { id: 'credit', label: 'Crédito', icon: <CreditCard className="h-6 w-6" />, description: 'Maquininha' },
    { id: 'debit', label: 'Débito', icon: <CreditCard className="h-6 w-6" />, description: 'Maquininha' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Restaurant Info */}
          <div className="text-center space-y-2">
            {restaurant.logo ? (
              <img src={restaurant.logo} alt={restaurant.name} className="h-16 w-16 rounded-xl mx-auto object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-bold">
                {restaurant.name.charAt(0)}
              </div>
            )}
            <h2 className="text-xl font-bold">{restaurant.name}</h2>
          </div>

          {/* Order Info */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mesa</span>
              <span className="font-medium">{order.tableNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cliente</span>
              <span className="font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Garçom</span>
              <span className="font-medium">{order.waiterName}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          {!selectedMethod && (
            <div className="space-y-3">
              <h3 className="font-semibold text-center">Escolha a forma de pagamento</h3>
              <div className="grid gap-3">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant="outline"
                    className={cn(
                      "h-auto p-4 justify-start gap-4 hover:border-primary",
                    )}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {method.icon}
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block">{method.label}</span>
                      <span className="text-sm text-muted-foreground">{method.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* PIX Payment */}
          {selectedMethod === 'pix' && (
            <div className="space-y-4 animate-fade-in">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setSelectedMethod(null)}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>

              <div className="text-center space-y-4">
                <div className="bg-card border-2 border-border rounded-2xl p-6 inline-block mx-auto">
                  {/* Placeholder for QR Code - in production use a library like qrcode.react */}
                  <div className="w-48 h-48 bg-foreground rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-7 h-7 rounded-sm",
                            Math.random() > 0.5 ? "bg-background" : "bg-foreground"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Escaneie o QR Code ou copie o código PIX
                </p>

                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleCopyPix}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copiado!' : 'Copiar código PIX'}
                </Button>
              </div>

              <Button size="xl" className="w-full gap-2" onClick={handleConfirmPayment}>
                <CheckCircle2 className="h-5 w-5" />
                Confirmar Pagamento
              </Button>
            </div>
          )}

          {/* Card Payment */}
          {(selectedMethod === 'credit' || selectedMethod === 'debit') && (
            <div className="space-y-4 animate-fade-in">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setSelectedMethod(null)}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>

              <div className="text-center space-y-4 py-8">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CreditCard className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedMethod === 'credit' ? 'Crédito' : 'Débito'}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Passe o cartão na maquininha para confirmar o pagamento
                  </p>
                </div>
              </div>

              <Button size="xl" className="w-full gap-2" onClick={handleConfirmPayment}>
                <CheckCircle2 className="h-5 w-5" />
                Confirmar Pagamento
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
