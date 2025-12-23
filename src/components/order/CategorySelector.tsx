import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function CategorySelector({ categories, selectedCategoryId, onSelectCategory }: CategorySelectorProps) {
  const activeCategories = categories.filter(c => c.active);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {activeCategories.map((category) => (
        <Button
          key={category.id}
          variant="category"
          size="category"
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "transition-all duration-200",
            selectedCategoryId === category.id && "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2"
          )}
        >
          <span className="text-2xl">{category.icon}</span>
          <span className="text-sm font-medium mt-1">{category.name}</span>
        </Button>
      ))}
    </div>
  );
}
