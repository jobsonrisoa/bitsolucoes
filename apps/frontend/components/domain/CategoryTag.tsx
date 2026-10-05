import { Category } from "@/lib/api/types";

export function CategoryTag({ category }: { category: Category }) {
  const labels: Partial<Record<Category, string>> = {
    TI: 'TI',
    RH: 'RH',
    COMPRAS: 'Compras',
    FINANCEIRO: 'Financeiro',
    INFRAESTRUTURA: 'Infraestrutura',
    MAINTENANCE: 'Manutenção',
    IT: 'TI',
    HR: 'RH',
    FACILITIES: 'Infraestrutura',
    OTHER: 'Outros',
  };
  return <span className="text-sm font-medium border-b-2 border-ink">{labels[category] || category}</span>;
}
