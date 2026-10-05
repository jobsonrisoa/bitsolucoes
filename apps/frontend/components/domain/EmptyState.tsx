import Link from "next/link";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Mark } from "../svg/Mark";

export function EmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Mark className="w-24 h-24 mb-6 opacity-20" />
      <h3 className="text-xl font-bold mb-2">Nenhuma solicitação encontrada</h3>
      <p className="text-muted mb-6">Você ainda não tem solicitações ou nenhuma corresponde aos filtros.</p>
      <Link href="/lista/nova">
        <Button>Nova solicitação</Button>
      </Link>
    </Card>
  );
}
