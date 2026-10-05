import { 
  Home, List, Plus, Settings, User, LogOut, 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, 
  Search, X, Check, AlertCircle, Info, Moon, Sun, 
  Edit, Trash, ArrowRight, Menu, Keyboard 
} from "lucide-react";
import { IconName } from "@/lib/icons/names";

const iconMap: Record<IconName, any> = {
  home: Home,
  list: List,
  plus: Plus,
  settings: Settings,
  user: User,
  'log-out': LogOut,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  search: Search,
  x: X,
  check: Check,
  'alert-circle': AlertCircle,
  info: Info,
  moon: Moon,
  sun: Sun,
  edit: Edit,
  trash: Trash,
  'arrow-right': ArrowRight,
  menu: Menu,
  keyboard: Keyboard
};

export interface IconProps {
  name: IconName;
  size?: 16 | 20 | 24;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  const Comp = iconMap[name];
  if (!Comp) return null;
  return <Comp size={size} strokeWidth={2} className={className} />;
}
