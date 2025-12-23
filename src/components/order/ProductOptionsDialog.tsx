import { useState } from 'react';
import { Product } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Minus, Plus } from 'lucide-react';

interface ProductOptionsDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (product: Product, quantity: number, variations: Record<string, string>, additionals: { name: string; price: number }[]) => void;
}

export function ProductOptionsDialog({ product, open, onOpenChange, onConfirm }: ProductOptionsDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [variations, setVariations] = useState<Record<string, string>>({});
  const [additionals, setAdditionals] = useState<{ name: string; price: number }[]>([]);

  if (!product) return null;

  const handleConfirm = () => {
    // Check required variations
    const missingRequired = product.variations?.filter(v => v.required && !variations[v.name]);
    if (missingRequired?.length) {
      return; // Could show a toast here
    }

    onConfirm(product, quantity, variations, additionals);
    
    // Reset state
    setQuantity(1);
    setVariations({});
    setAdditionals([]);
    onOpenChange(false);
  };

  const toggleAdditional = (additional: { name: string; price: number }) => {
    setAdditionals(prev => {
      const exists = prev.find(a => a.name === additional.name);
      if (exists) {
        return prev.filter(a => a.name !== additional.name);
      }
      return [...prev, additional];
    });
  };

  const additionalsTotal = additionals.reduce((sum, a) => sum + a.price, 0);
  const itemTotal = (product.price + additionalsTotal) * quantity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <Label className="text-base">Quantidade</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-bold w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Variations */}
          {product.variations?.map((variation) => (
            <div key={variation.id} className="space-y-3">
              <Label className="text-base">
                {variation.name}
                {variation.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <RadioGroup
                value={variations[variation.name] || ''}
                onValueChange={(value) => setVariations(prev => ({ ...prev, [variation.name]: value }))}
              >
                {variation.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${variation.id}-${option}`} />
                    <Label htmlFor={`${variation.id}-${option}`} className="font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* Additionals */}
          {product.additionals && product.additionals.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base">Adicionais</Label>
              {product.additionals.map((additional) => (
                <div key={additional.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={additional.id}
                      checked={additionals.some(a => a.name === additional.name)}
                      onCheckedChange={() => toggleAdditional(additional)}
                    />
                    <Label htmlFor={additional.id} className="font-normal cursor-pointer">
                      {additional.name}
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    +R$ {additional.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2">
          <div className="w-full flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">R$ {itemTotal.toFixed(2)}</span>
          </div>
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleConfirm}>
              Adicionar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
