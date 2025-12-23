import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Header } from '@/components/layout/Header';
import { TableGrid } from '@/components/tables/TableGrid';
import { NewOrderDialog } from '@/components/order/NewOrderDialog';

export default function Tables() {
  const navigate = useNavigate();
  const { tables, getOrderByTableId } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState<{ id: string; number: number } | null>(null);
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);

  const handleTableClick = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    if (table.status === 'free') {
      setSelectedTable({ id: tableId, number: table.number });
      setShowNewOrderDialog(true);
    } else {
      navigate(`/order/${tableId}`);
    }
  };

  const handleOrderCreated = (orderId: string) => {
    if (selectedTable) {
      navigate(`/order/${selectedTable.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Mesas</h1>
          <p className="text-muted-foreground">Toque em uma mesa para abrir ou gerenciar</p>
        </div>

        <TableGrid onTableClick={handleTableClick} />
      </main>

      {selectedTable && (
        <NewOrderDialog
          open={showNewOrderDialog}
          onOpenChange={setShowNewOrderDialog}
          tableId={selectedTable.id}
          tableNumber={selectedTable.number}
          onOrderCreated={handleOrderCreated}
        />
      )}
    </div>
  );
}
