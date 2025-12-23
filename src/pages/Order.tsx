import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Header } from '@/components/layout/Header';
import { CategorySelector } from '@/components/order/CategorySelector';
import { ProductGrid } from '@/components/order/ProductGrid';
import { ProductOptionsDialog } from '@/components/order/ProductOptionsDialog';
import { OrderSummary } from '@/components/order/OrderSummary';
import { PaymentScreen } from '@/components/payment/PaymentScreen';
import { Button } from '@/components/ui/button';
import { Product, PaymentMethod } from '@/types';
import { ArrowLeft, ShoppingCart, Receipt } from 'lucide-react';
import { toast } from 'sonner';

export default function Order() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { tables, categories, products, orders, getOrderByTableId, addItemToOrder, updateOrderItem, removeOrderItem, updateOrder, updateTableStatus } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const table = tables.find(t => t.id === tableId);
  const order = tableId ? getOrderByTableId(tableId) : undefined;

  useEffect(() => {
    if (!table || !order) {
      navigate('/');
    }
  }, [table, order, navigate]);

  if (!table || !order) {
    return null;
  }

  const handleAddProduct = (product: Product) => {
    if (product.variations?.some(v => v.required) || product.additionals?.length) {
      setSelectedProduct(product);
      setShowProductDialog(true);
    } else {
      // Add directly without options
      addItemToOrder(order.id, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price,
      });
      toast.success(`${product.name} adicionado!`);
    }
  };

  const handleConfirmProduct = (
    product: Product,
    quantity: number,
    variations: Record<string, string>,
    additionals: { name: string; price: number }[]
  ) => {
    const additionalsTotal = additionals.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = product.price + additionalsTotal;

    addItemToOrder(order.id, {
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
      variations: Object.keys(variations).length > 0 ? variations : undefined,
      additionals: additionals.length > 0 ? additionals : undefined,
    });

    toast.success(`${product.name} adicionado!`);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeOrderItem(order.id, itemId);
      toast.info('Item removido');
    } else {
      updateOrderItem(order.id, itemId, { quantity });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeOrderItem(order.id, itemId);
    toast.info('Item removido');
  };

  const handleCheckout = () => {
    if (order.items.length === 0) {
      toast.error('Adicione itens ao pedido primeiro');
      return;
    }
    updateOrder(order.id, { status: 'pending_payment' });
    updateTableStatus(tableId!, 'pending', order.id);
    setShowPayment(true);
  };

  const handlePaymentComplete = (method: PaymentMethod) => {
    updateOrder(order.id, { 
      status: 'paid', 
      paymentMethod: method,
      paidAt: new Date(),
    });
    updateTableStatus(tableId!, 'free', undefined);
    toast.success('Pagamento confirmado! Mesa liberada.');
    navigate('/');
  };

  const updatedOrder = orders.find(o => o.id === order.id) || order;

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      <main className="container py-4 px-4">
        {/* Back Button and Table Info */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="text-right">
            <span className="text-lg font-bold">Mesa {table.number}</span>
            <span className="text-muted-foreground mx-2">•</span>
            <span className="text-muted-foreground">{updatedOrder.customerName}</span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CategorySelector
              categories={categories}
              selectedCategoryId={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <ProductGrid
              products={products}
              categoryId={selectedCategory}
              onAddProduct={handleAddProduct}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary
                order={updatedOrder}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-4">
          {!showSummary ? (
            <>
              <CategorySelector
                categories={categories}
                selectedCategoryId={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <ProductGrid
                products={products}
                categoryId={selectedCategory}
                onAddProduct={handleAddProduct}
              />
            </>
          ) : (
            <div className="animate-slide-up">
              <Button
                variant="ghost"
                className="gap-2 mb-4"
                onClick={() => setShowSummary(false)}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao cardápio
              </Button>
              <OrderSummary
                order={updatedOrder}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border p-4 safe-bottom shadow-elevated">
        <div className="container">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">
                R$ {updatedOrder.total.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowSummary(!showSummary)}
                className="gap-2"
              >
                {showSummary ? (
                  <ShoppingCart className="h-5 w-5" />
                ) : (
                  <Receipt className="h-5 w-5" />
                )}
                {showSummary ? 'Cardápio' : 'Revisar'}
                {updatedOrder.items.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {updatedOrder.items.length}
                  </span>
                )}
              </Button>
              {!showSummary && (
                <Button size="lg" onClick={handleCheckout} disabled={updatedOrder.items.length === 0}>
                  Fechar Conta
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductOptionsDialog
        product={selectedProduct}
        open={showProductDialog}
        onOpenChange={setShowProductDialog}
        onConfirm={handleConfirmProduct}
      />

      <PaymentScreen
        order={updatedOrder}
        open={showPayment}
        onOpenChange={setShowPayment}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
