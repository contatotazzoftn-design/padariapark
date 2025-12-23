import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Hash } from 'lucide-react';

interface NewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
  tableNumber: number;
  onOrderCreated: (orderId: string) => void;
}

export function NewOrderDialog({ open, onOpenChange, tableId, tableNumber, onOrderCreated }: NewOrderDialogProps) {
  const { user } = useAuth();
  const { createOrder } = useRestaurant();
  const [customerName, setCustomerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !customerName.trim()) return;

    const order = createOrder({
      tableId,
      tableNumber,
      customerName: customerName.trim(),
      waiterId: user.id,
      waiterName: user.name,
      items: [],
      status: 'open',
      total: 0,
    });

    setCustomerName('');
    onOrderCreated(order.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-primary" />
            Abrir Mesa {tableNumber}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nome do Cliente</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="customerName"
                placeholder="Digite o nome do cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Garçom:</span> {user?.name}
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!customerName.trim()}>
              Abrir Mesa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
