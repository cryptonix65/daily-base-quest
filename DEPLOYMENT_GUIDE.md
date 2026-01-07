# 🚀 Руководство по деплою Daily Base Quest на Vercel

## ✅ Текущий статус
- [ ] Код загружен на GitHub (ваш аккаунт)
- [ ] Деплой на Vercel
- [ ] Настройка переменных окружения
- [ ] Подписание манифеста
- [ ] Публикация в Base app

---

## Метод 1: Деплой через веб-интерфейс (РЕКОМЕНДУЕТСЯ)

Это самый простой способ, следуя официальной документации [Base Mini Apps](https://docs.base.org/mini-apps/quickstart/create-new-miniapp).

### Шаг 1: Импорт проекта в Vercel

1. **Откройте**: https://vercel.com/new
2. **Авторизуйтесь** через GitHub (если ещё не авторизованы)
3. **Выберите** ваш репозиторий (например `cryptonix65/daily-base-quest`)
4. **Нажмите** "Import"

### Шаг 2: Настройка проекта

В разделе "Configure Project":

**Project Name**: `daily-base-quest` (или любое другое имя)

**Framework Preset**: Next.js (определится автоматически)

**Root Directory**: `./` (оставить как есть)

**Build Command**: `npm run build` (по умолчанию)

**Output Directory**: `.next` (по умолчанию)

### Шаг 3: Добавление переменных окружения

В разделе "Environment Variables" добавьте:

#### 1. NEXT_PUBLIC_ONCHAINKIT_API_KEY
- **Как получить**:
  1. Перейдите на https://portal.cdp.coinbase.com/
  2. Создайте новый проект или выберите существующий
  3. Скопируйте API Key
- **Value**: `ваш_api_key_здесь`

#### 2. NEXT_PUBLIC_URL (Необязательно на первом деплое)
- Можно оставить пустым
- После деплоя Vercel даст вам URL типа `https://seer-base.vercel.app`
- Потом можно добавить эту переменную через настройки

### Шаг 4: Деплой!

1. **Нажмите** "Deploy"
2. **Дождитесь** завершения сборки (2-3 минуты)
3. **Получите** ссылку на ваше приложение!

---

## Метод 2: Деплой через CLI

Если предпочитаете командную строку:

### Шаг 1: Авторизация

```bash
npx vercel login
```

Следуйте инструкциям для входа через email или GitHub.

### Шаг 2: Деплой

```bash
cd /Users/aleksei/seer_base1
npx vercel --prod
```

### Шаг 3: Добавление переменных окружения

```bash
# Добавить API ключ
npx vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production

# Добавить URL (после первого деплоя)
npx vercel env add NEXT_PUBLIC_URL production
```

### Шаг 4: Редеплой с переменными

```bash
npx vercel --prod
```

---

## После деплоя: Подписание манифеста

Согласно [документации Base](https://docs.base.org/mini-apps/quickstart/create-new-miniapp), нужно подписать манифест:

### Шаг 1: Отключите защиту деплоя

1. Откройте Vercel Dashboard
2. Перейдите в ваш проект
3. Settings → Deployment Protection
4. **Отключите** "Vercel Authentication"
5. Сохраните

### Шаг 2: Подпишите манифест

1. Перейдите на: https://www.base.dev/preview?tab=account
2. В поле "App URL" введите ваш домен (например: `seer-base.vercel.app`)
3. Нажмите "Submit"
4. Нажмите "Verify" и следуйте инструкциям
5. Скопируйте объект `accountAssociation`

### Шаг 3: Обновите minikit.config.ts

Откройте `minikit.config.ts` и обновите секцию `accountAssociation`:

```typescript
accountAssociation: {
  "header": "скопированный_header",
  "payload": "скопированный_payload",  
  "signature": "скопированная_signature"
},
```

### Шаг 4: Закоммитьте и запушьте

```bash
git add minikit.config.ts
git commit -m "feat: add account association"
git push origin main
```

Vercel автоматически задеплоит изменения!

---

## Тестирование приложения

### Предварительный просмотр

Откройте: https://base.dev/preview

1. **Вкладка "Launch"**:
   - Добавьте URL вашего приложения
   - Проверьте embed и кнопку запуска
   
2. **Вкладка "Account association"**:
   - Проверьте правильность подписи манифеста
   
3. **Вкладка "Metadata"**:
   - Убедитесь что все поля заполнены

### Проверка функциональности

Откройте ваш деплой и проверьте:
- ✅ Отображаются daily quests
- ✅ Работает чек-ин / share
- ✅ Верификация DeFi swap по tx hash
- ✅ Верификация NFT mint по tx hash
- ✅ Лидерборд отображается

---

## Публикация в Base App

Согласно [документации](https://docs.base.org/mini-apps/quickstart/create-new-miniapp):

1. Откройте Base app
2. Создайте новый пост
3. Вставьте URL вашего приложения
4. Опубликуйте!

Ваше mini app будет доступно в Base app с кнопкой "Launch"!

---

## Полезные команды

### Проверка логов деплоя
```bash
npx vercel logs <url>
```

### Список проектов
```bash
npx vercel list
```

### Посмотреть переменные окружения
```bash
npx vercel env ls
```

### Удалить переменную
```bash
npx vercel env rm <name> production
```

---

## Troubleshooting

### Ошибка сборки
- Проверьте что все зависимости установлены
- Убедитесь что `npm run build` работает локально
- Проверьте логи в Vercel Dashboard

### Не работает авторизация
- Убедитесь что `NEXT_PUBLIC_ONCHAINKIT_API_KEY` добавлен
- Проверьте что ключ валиден на portal.cdp.coinbase.com

### Не работает в Base app
- Убедитесь что манифест подписан
- Проверьте что Deployment Protection выключена
- Используйте https://base.dev/preview для отладки

### Изображения не загружаются
- Проверьте что файлы существуют в `/public`
- Имена должны совпадать с `minikit.config.ts`
- Перезапустите деплой

---

## Следующие шаги

После успешного деплоя:

1. ✅ Протестируйте все функции
2. ✅ Подпишите манифест
3. ✅ Опубликуйте в Base app
4. 📢 Поделитесь с сообществом!
5. 🎉 Celebrate! Ваше mini app живое!

---

## Ссылки

- 📚 [Base Mini Apps Documentation](https://docs.base.org/mini-apps/)
- 🔧 [Vercel Documentation](https://vercel.com/docs)
- 🎨 [OnchainKit](https://onchainkit.xyz/)
- 🔮 [Farcaster Developer Docs](https://docs.farcaster.xyz/)

**Удачи с деплоем! 🚀**


















