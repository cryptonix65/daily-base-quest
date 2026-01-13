# 📋 SeerBase - Чек-лист деплоя

## ✅ ЧТО УЖЕ ГОТОВО

- [x] Код приложения написан и протестирован
- [x] Build успешно проходит (`npm run build`)
- [x] Все зависимости установлены
- [x] Адрес кошелька настроен: `0xeCF05e29657A0f2242796E803E3e59538dE56526`
- [x] Платежная система: 0.1 USDC за вопрос
- [x] Все изображения на месте:
  - ✅ icon-magic-ball-infinity.png
  - ✅ hero-magic-ball-infinity.png
  - ✅ magic-ball-embed.png
  - ✅ screenshot-apple-magic-ball-portrait.png
- [x] Account association подписан для домена Vercel
- [x] Webhook настроен
- [x] API routes готовы (auth, webhook)
- [x] Success page реализована

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ (ДЕПЛОЙ)

### 1. Получить OnchainKit API Key ⏳

1. Откройте: https://portal.cdp.coinbase.com/
2. Войдите или создайте аккаунт
3. Создайте новый проект
4. Скопируйте **Client API Key**

📝 Сохраните этот ключ - он понадобится на следующем шаге!

---

### 2. Деплой на Vercel ⏳

**Вариант A: Через веб-интерфейс (РЕКОМЕНДУЕТСЯ)**

1. Откройте: https://vercel.com/new
2. Авторизуйтесь через GitHub
3. Выберите репозиторий `Alexeyyyyyy/seer_base1`
4. Нажмите "Import"
5. В настройках проекта:
   - **Root Directory**: оставьте `./` или выберите `nyu` если нужно
   - **Framework**: Next.js (автоопределение)
6. В разделе **Environment Variables** добавьте:
   ```
   NEXT_PUBLIC_ONCHAINKIT_API_KEY = ваш_api_key_из_шага_1
   ```
7. Нажмите **"Deploy"**
8. Дождитесь завершения (2-3 минуты)
9. Скопируйте URL вида: `https://seer-base-xxx.vercel.app`

**Вариант B: Через CLI**

```bash
cd /Users/aleksei/.cursor/worktrees/seer_base1/nyu
npx vercel --prod
# Следуйте инструкциям, добавьте env переменные
```

---

### 3. Отключить Deployment Protection ⏳

**ВАЖНО!** Без этого шага приложение не будет доступно из Base App.

1. Откройте Vercel Dashboard
2. Выберите ваш проект
3. **Settings** → **Deployment Protection**
4. **Выключите** "Vercel Authentication"
5. Нажмите **Save**

---

### 4. Обновить NEXT_PUBLIC_URL ⏳

1. В Vercel Dashboard → ваш проект
2. **Settings** → **Environment Variables**
3. Добавьте новую переменную:
   ```
   Name:  NEXT_PUBLIC_URL
   Value: https://ваш-url.vercel.app
   ```
4. **Deployments** → последний деплой → **⋮** → **Redeploy**

---

### 5. Подписать манифест для нового домена ⏳

**Важно:** Если ваш Vercel URL отличается от того, что уже подписан в `minikit.config.ts`

1. Откройте: https://www.base.dev/preview?tab=account
2. Введите ваш новый Vercel домен (БЕЗ `https://`):
   ```
   ваш-новый-url.vercel.app
   ```
3. Нажмите **"Submit"**
4. Нажмите **"Verify"**
5. Подключите Farcaster кошелек
6. Подпишите транзакцию
7. Скопируйте весь объект `accountAssociation`

**Обновите minikit.config.ts:**

```typescript
export const minikitConfig = {
  accountAssociation: {
    "header": "новый_header",
    "payload": "новый_payload",
    "signature": "новая_signature"
  },
  // ... остальное без изменений
}
```

**Закоммитьте и запушьте:**

```bash
git add minikit.config.ts
git commit -m "feat: update account association for new domain"
git push origin main
```

Vercel автоматически задеплоит обновление!

---

### 6. Протестировать приложение ⏳

Откройте: https://base.dev/preview

#### Вкладка "Launch":
- [ ] Введите URL приложения
- [ ] Проверьте что embed корректно отображается
- [ ] Нажмите кнопку "Launch" - приложение должно открыться

#### Вкладка "Account association":
- [ ] Проверьте что подпись валидна ✅
- [ ] Не должно быть ошибок

#### Вкладка "Metadata":
Убедитесь что отображается:
- [ ] Name: SeerBase
- [ ] Tagline: Ask. Touch. Get an answer.
- [ ] Description: Just ask a question and tap the screen.
- [ ] Icon: правильное изображение
- [ ] Hero: правильное изображение

#### Функциональное тестирование:
- [ ] Откройте ваш Vercel URL напрямую
- [ ] Введите вопрос
- [ ] Нажмите "Pay 0.1 USDC & Ask"
- [ ] Проверьте что открывается кошелек
- [ ] (Опционально) Совершите тестовый платеж
- [ ] Проверьте что шар трясется
- [ ] Проверьте что показывается ответ
- [ ] Нажмите "Ask Another Question"
- [ ] Проверьте страницу `/success`

---

### 7. Опубликовать в Base App ⏳

**Финальный шаг!**

1. Откройте **Base app** (мобильное приложение или web)
2. Создайте **новый пост**
3. Вставьте **URL вашего приложения**:
   ```
   https://ваш-url.vercel.app
   ```
4. Добавьте текст (опционально):
   ```
   🔮 Just launched SeerBase - a magic oracle on Base! 
   Ask any yes/no question, pay 0.1 USDC, and get your answer!
   ```
5. **Опубликуйте пост!** 🎉

Ваше Mini App теперь доступно всем пользователям Base!

---

## 💰 ОТСЛЕЖИВАНИЕ ПЛАТЕЖЕЙ

### Проверка баланса кошелька:

**BaseScan**: https://basescan.org/address/0xeCF05e29657A0f2242796E803E3e59538dE56526

Здесь вы будете видеть:
- Все входящие USDC транзакции
- Время и сумму каждого платежа
- Адреса пользователей
- Общий баланс

### Ожидаемый доход:

| Пользователей/день | Вопросов/день | Доход/день | Доход/месяц |
|---------------------|---------------|------------|-------------|
| 50                  | 50            | $5         | $150        |
| 100                 | 100           | $10        | $300        |
| 200                 | 200           | $20        | $600        |
| 500                 | 500           | $50        | $1,500      |
| 1,000               | 1,000         | $100       | $3,000      |

---

## 🔗 ВАЖНЫЕ ССЫЛКИ

| Что | URL |
|-----|-----|
| **Деплой на Vercel** | https://vercel.com/new |
| **CDP API Key** | https://portal.cdp.coinbase.com/ |
| **Account Association** | https://www.base.dev/preview?tab=account |
| **Preview Tool** | https://base.dev/preview |
| **BaseScan (ваш кошелек)** | https://basescan.org/address/0xeCF05e29657A0f2242796E803E3e59538dE56526 |
| **GitHub Repo** | https://github.com/Alexeyyyyyy/seer_base1 |
| **Base Docs** | https://docs.base.org/mini-apps/quickstart/create-new-miniapp |

---

## 🆘 УСТРАНЕНИЕ НЕПОЛАДОК

### Приложение не загружается
- ✅ Проверьте что Deployment Protection выключена
- ✅ Убедитесь что NEXT_PUBLIC_URL установлен правильно
- ✅ Проверьте логи в Vercel Dashboard → ваш проект → Deployments

### Ошибка "Missing token"
- ✅ Убедитесь что NEXT_PUBLIC_ONCHAINKIT_API_KEY добавлен
- ✅ Проверьте что ключ валиден на portal.cdp.coinbase.com

### Не работают платежи
- ✅ Убедитесь что пользователь на Base сети
- ✅ Проверьте что у пользователя есть USDC на балансе
- ✅ Проверьте адрес кошелька в `app/page.tsx` и `minikit.config.ts`

### Манифест не подписывается
- ✅ Убедитесь что домен доступен публично (без Vercel Auth)
- ✅ Используйте Farcaster-совместимый кошелек
- ✅ Попробуйте другой браузер (Chrome, Brave)

### Изображения не отображаются
- ✅ Проверьте что файлы есть в `/public`
- ✅ Имена файлов должны совпадать с `minikit.config.ts`
- ✅ Попробуйте Redeploy в Vercel

---

## 📊 ПРОГРЕСС

```
[████████░░] 80% - Готово к деплою!

Выполнено:
✅ Код написан
✅ Build проходит
✅ Изображения на месте
✅ Кошелек настроен
✅ Манифест подписан (для старого домена)

Осталось:
⏳ Получить OnchainKit API Key
⏳ Деплой на Vercel
⏳ Настройка переменных окружения
⏳ Обновить account association (если новый домен)
⏳ Протестировать
⏳ Опубликовать в Base App
```

---

## 🎉 ПОСЛЕ УСПЕШНОГО ЗАПУСКА

1. **Поделитесь** ссылкой в социальных сетях
2. **Мониторьте** баланс на BaseScan
3. **Собирайте** отзывы пользователей
4. **Улучшайте** приложение на основе feedback
5. **Масштабируйте** - добавьте новые функции!

---

**Удачи с запуском SeerBase! 🔮💰🚀**

*Если возникнут вопросы - обращайтесь к документации Base или в сообщество разработчиков.*
