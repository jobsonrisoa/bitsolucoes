export function usePathname() {
  return '/brandbook';
}

export function useRouter() {
  return {
    push: () => undefined,
    replace: () => undefined,
    refresh: () => undefined,
  };
}

export function useSearchParams() {
  return new URLSearchParams();
}
