import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Store, UtensilsCrossed, Users, BarChart3, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { restaurant, updateRestaurant, categories, products, orders, updateCategory, updateProduct } = useRestaurant();

  const [restaurantName, setRestaurantName] = useState(restaurant.name);
  const [pixKey, setPixKey] = useState(restaurant.pixKey || '');

  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSaveRestaurant = () => {
    updateRestaurant({ name: restaurantName, pixKey });
    toast.success('Configurações salvas!');
  };

  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const paymentStats = orders
    .filter(o => o.status === 'paid')
    .reduce((acc, o) => {
      const method = o.paymentMethod || 'other';
      acc[method] = (acc[method] || 0) + o.total;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie sua lanchonete</p>
          </div>
        </div>

        <Tabs defaultValue="restaurant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="restaurant" className="gap-2">
              <Store className="h-4 w-4 hidden sm:block" />
              Lanchonete
            </TabsTrigger>
            <TabsTrigger value="menu" className="gap-2">
              <UtensilsCrossed className="h-4 w-4 hidden sm:block" />
              Cardápio
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4 hidden sm:block" />
              Equipe
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <BarChart3 className="h-4 w-4 hidden sm:block" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Restaurant Settings */}
          <TabsContent value="restaurant" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Lanchonete</CardTitle>
                <CardDescription>Informações básicas do estabelecimento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Lanchonete</Label>
                  <Input
                    id="name"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pix">Chave PIX</Label>
                  <Input
                    id="pix"
                    placeholder="email@exemplo.com ou telefone"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    {restaurant.logo ? (
                      <img src={restaurant.logo} alt="Logo" className="h-16 w-16 rounded-xl object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {restaurant.name.charAt(0)}
                      </div>
                    )}
                    <Button variant="outline">Upload Logo</Button>
                  </div>
                </div>
                <Button onClick={handleSaveRestaurant}>Salvar Alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Management */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Categorias</h2>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Categoria
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.active}
                          onCheckedChange={(checked) => updateCategory(category.id, { active: checked })}
                        />
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8">
              <h2 className="text-lg font-semibold">Produtos</h2>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </div>
            <div className="space-y-2">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.name}</span>
                          {product.code && (
                            <span className="text-xs text-muted-foreground">({product.code})</span>
                          )}
                        </div>
                        <span className="text-sm text-primary font-semibold">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.active}
                          onCheckedChange={(checked) => updateProduct(product.id, { active: checked })}
                        />
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Management */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Garçons</h2>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Garçom
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { name: 'João Garçom', email: 'joao@lanchonete.com', active: true },
                { name: 'Maria Garçom', email: 'maria@lanchonete.com', active: true },
              ].map((waiter, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{waiter.name}</p>
                        <p className="text-sm text-muted-foreground">{waiter.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={waiter.active} />
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Total Faturado</p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    R$ {totalRevenue.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Comandas Pagas</p>
                  <p className="text-3xl font-bold mt-1">
                    {orders.filter(o => o.status === 'paid').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">PIX</p>
                  <p className="text-3xl font-bold mt-1">
                    R$ {(paymentStats.pix || 0).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Cartão</p>
                  <p className="text-3xl font-bold mt-1">
                    R$ {((paymentStats.credit || 0) + (paymentStats.debit || 0)).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Comandas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.slice(0, 10).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Mesa {order.tableNumber} - {order.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} itens • {order.waiterName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R$ {order.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'paid' 
                            ? 'bg-status-active/10 text-status-active'
                            : order.status === 'pending_payment'
                            ? 'bg-status-pending/10 text-status-pending'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {order.status === 'paid' ? 'Paga' : order.status === 'pending_payment' ? 'Aguardando' : 'Aberta'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
