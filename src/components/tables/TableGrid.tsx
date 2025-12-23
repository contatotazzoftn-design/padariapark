import { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { TableCard } from './TableCard';
import { Input } from '@/components/ui/input';
import { Search, LayoutGrid } from 'lucide-react';

interface TableGridProps {
  onTableClick: (tableId: string) => void;
}

export function TableGrid({ onTableClick }: TableGridProps) {
  const { tables, orders } = useRestaurant();
  const [search, setSearch] = useState('');

  const filteredTables = tables.filter(table => 
    table.number.toString().includes(search)
  );

  const activeCount = tables.filter(t => t.status === 'active').length;
  const pendingCount = tables.filter(t => t.status === 'pending').length;

  const getOrderForTable = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (table?.currentOrderId) {
      return orders.find(o => o.id === table.currentOrderId);
    }
    return undefined;
  };

  return (
    <div className="space-y-4">
      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar mesa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-active/10 text-status-active">
            <LayoutGrid className="h-4 w-4" />
            <span className="font-semibold">{activeCount}</span>
            <span className="text-sm">em andamento</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-pending/10 text-status-pending">
            <LayoutGrid className="h-4 w-4" />
            <span className="font-semibold">{pendingCount}</span>
            <span className="text-sm">aguardando</span>
          </div>
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {filteredTables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            order={getOrderForTable(table.id)}
            onClick={() => onTableClick(table.id)}
          />
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <LayoutGrid className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma mesa encontrada</p>
        </div>
      )}
    </div>
  );
}
