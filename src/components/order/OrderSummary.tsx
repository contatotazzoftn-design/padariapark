import { Order, OrderItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderSummaryProps {
  order: Order;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  className?: string;
}

export function OrderSummary({ order, onUpdateQuantity, onRemoveItem, onCheckout, className }: OrderSummaryProps) {
  if (order.items.length === 0) {
    return (
      <div className={cn("bg-card border-2 border-border rounded-xl p-6 text-center", className)}>
        <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">Carrinho vazio</p>
        <p className="text-sm text-muted-foreground mt-1">
          Adicione produtos para começar
        </p>
      </div>
    );
  }

  return (
    <div className={cn("bg-card border-2 border-border rounded-xl overflow-hidden", className)}>
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Mesa {order.tableNumber}</h3>
            <p className="text-sm text-muted-foreground">{order.customerName}</p>
          </div>
          <span className="text-xs bg-status-active/10 text-status-active px-2 py-1 rounded-full">
            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border max-h-[40vh] overflow-y-auto">
        {order.items.map((item) => (
          <div key={item.id} className="p-4 animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium">{item.productName}</h4>
                {item.variations && Object.entries(item.variations).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {Object.entries(item.variations).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  </p>
                )}
                {item.additionals && item.additionals.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    + {item.additionals.map(a => a.name).join(', ')}
                  </p>
                )}
                <p className="text-sm font-semibold text-primary mt-1">
                  R$ {item.totalPrice.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold text-primary">R$ {order.total.toFixed(2)}</span>
        </div>
        <Button size="xl" className="w-full" onClick={onCheckout}>
          Fechar Conta
        </Button>
      </div>
    </div>
  );
}
