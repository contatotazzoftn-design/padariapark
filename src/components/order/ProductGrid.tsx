import { useState } from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categoryId: string | null;
  onAddProduct: (product: Product) => void;
}

export function ProductGrid({ products, categoryId, onAddProduct }: ProductGridProps) {
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => {
    if (!p.active) return false;
    if (categoryId && p.categoryId !== categoryId) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(searchLower) ||
        p.code?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nome ou código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAddProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );
}
