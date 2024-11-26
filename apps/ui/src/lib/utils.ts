// export function cn(...classes: (string | undefined | false)[]): string {
//   return classes.filter(Boolean).join(" ");
// }


type ClassValue = string | number | boolean | null | undefined | ClassValue[] | { [key: string]: any };

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter(Boolean)
    .map(String)
    .join(' ');
}
