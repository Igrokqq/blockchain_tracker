// export function cn(...classes: (string | undefined | false)[]): string {
//   return classes.filter(Boolean).join(" ");
// }

// utils.ts

type ClassValue = string | number | boolean | null | undefined | ClassValue[] | { [key: string]: any };

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat() // Преобразуем вложенные массивы в обычный массив
    .filter(Boolean) // Убираем все ложные значения (false, null, undefined, '')
    .map(String) // Преобразуем все элементы в строки
    .join(' '); // Объединяем все элементы в одну строку с пробелами
}
