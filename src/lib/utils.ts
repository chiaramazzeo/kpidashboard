/**
 * Utility condivise per shadcn/ui e wrapper brand Golmar.
 *
 * ## Perché esiste `cn`?
 * Nei componenti shadcn le classi Tailwind arrivano da più fonti:
 * 1. classi di base del primitive (es. Button)
 * 2. variante CVA (`variant="secondary"`, `size="sm"`, …)
 * 3. `className` passato dal caller (override puntuali)
 *
 * Se concatenassi solo stringhe (`a + " " + b`), due utility in conflitto
 * (es. `bg-red-500` e `bg-blue-500`) resterebbero entrambe nel DOM e
 * “vince” l’ordine nel CSS generato — spesso non quello che intendi.
 *
 * `cn` = `clsx` (condizionali / falsy) + `tailwind-merge` (risolve i conflitti
 * Tailwind tenendo l’ultima classe della stessa categoria).
 *
 * ## Quando usarlo
 * - Sempre nei file sotto `src/components/ui/*`
 * - Nei wrapper brand (`Header`, dialog, badge, …) quando componi className
 * - Non serve per stringhe statiche senza merge
 *
 * @example
 * cn('px-2 py-1', isActive && 'bg-primary', className)
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
