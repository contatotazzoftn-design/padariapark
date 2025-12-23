import { Table, Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Users, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableCardProps {
  table: Table;
  order?: Order;
  onClick: () => void;
}

export function TableCard({ table, order, onClick }: TableCardProps) {
  const getVariant = () => {
    switch (table.status) {
      case 'active':
        return 'table-active';
      case 'pending':
        return 'table-pending';
      default:
        return 'table-free';
    }
  };

  const getStatusLabel = () => {
    switch (table.status) {
      case 'active':
        return 'Em andamento';
      case 'pending':
        return 'Aguardando pagamento';
      default:
        return 'Livre';
    }
  };

  return (
    <Button
      variant={getVariant()}
      size="table"
      onClick={onClick}
      className="w-full animate-scale-in"
    >
      <span className="text-3xl font-bold">{table.number}</span>
      <span className="text-xs font-medium opacity-90 mt-1">{getStatusLabel()}</span>
      
      {order && (
        <div className="mt-2 text-xs space-y-1 w-full text-center opacity-90">
          <div className="flex items-center justify-center gap-1">
            <Users className="h-3 w-3" />
            <span className="truncate max-w-[80px]">{order.customerName}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>R$ {order.total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </Button>
  );
}
