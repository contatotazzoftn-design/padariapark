import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <div className="bg-card border-2 border-border rounded-xl p-4 shadow-card hover:shadow-soft transition-all duration-200 hover:border-primary/50 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{product.name}</h3>
          {product.code && (
            <p className="text-xs text-muted-foreground mt-0.5">Código: {product.code}</p>
          )}
          <p className="text-lg font-bold text-primary mt-2">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
        <Button
          size="icon-lg"
          onClick={() => onAdd(product)}
          className="shrink-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {(product.variations?.length || product.additionals?.length) && (
        <div className="mt-3 flex flex-wrap gap-1">
          {product.variations?.map(v => (
            <span key={v.id} className="text-xs bg-muted px-2 py-1 rounded-full">
              {v.name}
            </span>
          ))}
          {product.additionals?.slice(0, 2).map(a => (
            <span key={a.id} className="text-xs bg-muted px-2 py-1 rounded-full">
              +{a.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
