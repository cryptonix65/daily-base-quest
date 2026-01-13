// Script to generate PNG from HTML canvas
// Run: node scripts/generate-embed-png.js
// Requires: npm install canvas (optional, or use browser method)

console.log(`
Для создания PNG изображения используйте один из методов:

МЕТОД 1 (Рекомендуется - через браузер):
1. Откройте файл: public/generate-embed-image.html
2. Правой кнопкой мыши на изображении
3. Выберите "Сохранить изображение как..."
4. Сохраните как: public/magic-ball-embed.png

МЕТОД 2 (Через онлайн конвертер):
1. Откройте: https://svgtopng.com/
2. Загрузите файл: public/magic-ball-embed.svg
3. Установите размер: 1200x630
4. Скачайте и сохраните как: public/magic-ball-embed.png

МЕТОД 3 (Через ImageMagick, если установлен):
convert -background none -size 1200x630 public/magic-ball-embed.svg public/magic-ball-embed.png
`);


















