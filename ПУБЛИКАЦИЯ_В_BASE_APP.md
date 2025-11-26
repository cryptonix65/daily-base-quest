# 📱 Как опубликовать SeerBase в Base App

## 🎯 Цель: Сделать так, чтобы приложение появилось в Base App

Согласно [документации Base](https://docs.base.org/mini-apps/quickstart/create-new-miniapp), для публикации в Base App нужно выполнить 4 обязательных шага.

---

## ✅ ШАГ 1: ДЕПЛОЙ НА VERCEL (5 минут)

Ваше приложение уже готово! Просто задеплойте его:

### 1.1 Откройте Vercel

👉 **НАЖМИТЕ**: https://vercel.com/new

### 1.2 Импортируйте репозиторий

1. Войдите через **GitHub**
2. Найдите `Alexeyyyyyy/seer_base1`
3. Нажмите **"Import"**

### 1.3 Добавьте переменные окружения

**Получите OnchainKit API Key:**
- 🔗 Откройте: https://portal.cdp.coinbase.com/
- Создайте проект
- Скопируйте **Client API Key**

**Добавьте переменную:**
```
Name:  NEXT_PUBLIC_ONCHAINKIT_API_KEY
Value: ваш_api_key_здесь
```

### 1.4 Deploy

Нажмите **"Deploy"** → Подождите 2-3 минуты

✅ **Результат**: Вы получите URL типа `https://seer-base-xxx.vercel.app`

**💾 Сохраните этот URL!** Он понадобится для следующих шагов.

---

## ✅ ШАГ 2: ОТКЛЮЧИТЕ DEPLOYMENT PROTECTION (1 минута)

⚠️ **Обязательный шаг!** Согласно [документации Base](https://docs.base.org/mini-apps/quickstart/create-new-miniapp).

### 2.1 Откройте настройки Vercel

1. Vercel Dashboard → ваш проект `seer-base`
2. **Settings** → **Deployment Protection**

### 2.2 Отключите защиту

1. Найдите **"Vercel Authentication"**
2. **Выключите** переключатель
3. Нажмите **"Save"**

✅ **Готово!** Теперь приложение доступно без авторизации.

---

## ✅ ШАГ 3: ПОДПИШИТЕ МАНИФЕСТ (3 минуты)

⚠️ **Критически важно!** Без этого приложение не будет работать в Base App.

### 3.1 Обновите NEXT_PUBLIC_URL

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Найдите `NEXT_PUBLIC_URL`
3. Установите значение: `https://ваш-url.vercel.app`
4. Нажмите **"Save"**
5. **Deployments** → последний деплой → **⋮** → **Redeploy**

Подождите 2 минуты пока задеплоится.

### 3.2 Откройте Account Association Tool

👉 **НАЖМИТЕ**: https://www.base.dev/preview?tab=account

### 3.3 Введите домен

В поле **"App URL"** введите ваш домен **БЕЗ https://**:

```
seer-base-xxx.vercel.app
```

Нажмите **"Submit"**

### 3.4 Подпишите манифест

1. Нажмите кнопку **"Verify"**
2. Подключите ваш **Farcaster кошелек** (Warpcast)
3. **Подпишите** транзакцию
4. После успешной подписи скопируйте **весь объект** `accountAssociation`

Должно выглядеть примерно так:
```json
{
  "header": "eyJmaBBiOjE3...",
  "payload": "eyJkb21haW4i...",
  "signature": "MHhmNGQzN2M2..."
}
```

### 3.5 Обновите minikit.config.ts локально

Откройте файл `minikit.config.ts` и вставьте скопированные данные:

```typescript
export const minikitConfig = {
  accountAssociation: {
    "header": "вставьте_скопированный_header",
    "payload": "вставьте_скопированный_payload",
    "signature": "вставьте_скопированную_signature"
  },
  miniapp: {
    version: "2",
    name: "SeerBase",
    subtitle: "Your instant answer Yes or No.",
    description: "Just ask a question and tap the screen.",
    // ... остальное без изменений
  },
}
```

### 3.6 Закоммитьте и запушьте

```bash
git add minikit.config.ts
git commit -m "feat: add Farcaster account association"
git push origin main
```

✅ **Vercel автоматически задеплоит** изменения за 2-3 минуты!

---

## ✅ ШАГ 4: ПРОВЕРЬТЕ ПРИЛОЖЕНИЕ (2 минуты)

Перед публикацией убедитесь, что всё работает!

### 4.1 Откройте Preview Tool

👉 **НАЖМИТЕ**: https://base.dev/preview

### 4.2 Проверьте все вкладки

#### Вкладка "Launch":
1. Введите URL вашего приложения
2. Проверьте что показывается **embed с кнопкой**
3. Нажмите **"Launch"** - приложение должно открыться

#### Вкладка "Account association":
1. Введите ваш URL
2. Должна быть **зеленая галочка** ✅
3. Если красный крестик ❌ - вернитесь к Шагу 3

#### Вкладка "Metadata":
Проверьте что всё заполнено:
- ✅ Name: **SeerBase**
- ✅ Tagline: **Ask. Touch. Get an answer.**
- ✅ Description: **Just ask a question and tap the screen.**
- ✅ Icon: отображается
- ✅ Hero image: отображается
- ✅ Screenshot: отображается

### 4.3 Протестируйте функциональность

Откройте ваше приложение по URL:
1. ✅ Загружается magic ball
2. ✅ Можно ввести вопрос
3. ✅ Показывается цена: "💎 0.1 USDC per question"
4. ✅ Кнопка "Pay 0.1 USDC & Ask" работает
5. ✅ Открывается кошелек для оплаты

Если что-то не работает - вернитесь к предыдущим шагам.

---

## 🎉 ШАГ 5: ОПУБЛИКУЙТЕ В BASE APP! (1 минута)

**Это финальный шаг!** Согласно [документации Base](https://docs.base.org/mini-apps/quickstart/create-new-miniapp).

### 5.1 Откройте Base App

Скачайте Base app если еще нет:
- **iOS**: https://apps.apple.com/app/base-onchain
- **Android**: https://play.google.com/store/apps/details?id=xyz.base

Или используйте веб-версию: https://base.org/

### 5.2 Создайте пост

1. Нажмите **"New Post"** или **"+"**
2. Вставьте **полный URL** вашего приложения:
   ```
   https://seer-base-xxx.vercel.app
   ```

### 5.3 Добавьте описание (опционально)

Напишите что-то привлекательное, например:

```
🔮 SeerBase - Magic Oracle on Base!

Ask any yes/no question and get instant answers!
💎 Only 0.1 USDC per question on Base

Try it now! 👇
```

### 5.4 ОПУБЛИКУЙТЕ!

Нажмите **"Post"** 🚀

---

## ✅ ГОТОВО! ВЫ В BASE APP!

### 🎊 Что произошло:

1. ✅ Ваш пост появился в Base App
2. ✅ URL автоматически превратился в **embed с кнопкой "Launch"**
3. ✅ Пользователи могут нажать **"Launch"** и открыть ваше приложение
4. ✅ Приложение открывается **внутри Base App**
5. ✅ Пользователи могут платить USDC и получать ответы!

### 📱 Как это выглядит для пользователей:

```
[Ваш пост с текстом]

┌─────────────────────────────────┐
│  🔮 SeerBase                    │
│  Ask. Touch. Get an answer.     │
│  [Launch] ───────────────────>  │
└─────────────────────────────────┘

💬 Like  💭 Reply  🔄 Recast
```

При нажатии **"Launch"** открывается полноэкранное приложение!

---

## 📊 ОТСЛЕЖИВАНИЕ УСПЕХА

### Метрики в Base App:
- Сколько людей увидели пост
- Сколько нажали "Launch"
- Сколько задали вопросы

### Ваши платежи:
👉 **BaseScan**: https://basescan.org/address/0xeCF05e29657A0f2242796E803E3e59538dE56526

Здесь в реальном времени будут появляться транзакции по 0.1 USDC!

---

## 💰 ПРОДВИЖЕНИЕ И МОНЕТИЗАЦИЯ

### Увеличьте охват:

1. **Поделитесь в других соцсетях**:
   - Twitter/X
   - Farcaster (Warpcast)
   - Discord сообщества Base

2. **Используйте хештеги**:
   ```
   #Base #OnChain #Oracle #Crypto #USDC
   ```

3. **Попросите друзей сделать recast**

4. **Добавьте в Base mini app каталоги**

### Потенциальный доход:

| Пользователей Base | Конверсия | Вопросов/день | Доход/месяц |
|---------------------|-----------|---------------|-------------|
| 1,000               | 5%        | 50            | ~$135       |
| 10,000              | 5%        | 500           | ~$1,350     |
| 100,000             | 5%        | 5,000         | ~$13,500    |

---

## 🔄 ОБНОВЛЕНИЕ ПРИЛОЖЕНИЯ

Когда захотите что-то изменить:

1. Отредактируйте код локально
2. `git add -A && git commit -m "описание изменений"`
3. `git push origin main`
4. Vercel автоматически задеплоит
5. Пользователи сразу увидят обновления!

---

## 🆘 TROUBLESHOOTING

### "Launch" кнопка не появляется

**Причина**: Манифест не подписан или неверный

**Решение**:
1. Проверьте на https://base.dev/preview?tab=account
2. Должна быть зеленая галочка ✅
3. Если нет - повторите Шаг 3

### Приложение не открывается

**Причина**: Deployment Protection включена

**Решение**:
1. Vercel Dashboard → Settings → Deployment Protection
2. Выключите "Vercel Authentication"

### Платежи не работают

**Причина**: Кошелек не настроен или неправильная сеть

**Решение**:
1. Проверьте что `ORACLE_WALLET = 0xeCF05e29657A0f2242796E803E3e59538dE56526`
2. Убедитесь что пользователь на **Base mainnet**
3. Проверьте что у пользователя есть **USDC на Base**

### Embed не показывается

**Причина**: Metadata не полная

**Решение**:
1. Откройте https://base.dev/preview?tab=metadata
2. Проверьте что все поля заполнены
3. Убедитесь что изображения загружаются

---

## 📚 ПОЛЕЗНЫЕ ССЫЛКИ

| Ресурс | URL |
|--------|-----|
| **Base Docs** | https://docs.base.org/mini-apps/quickstart/create-new-miniapp |
| **Vercel Deploy** | https://vercel.com/new |
| **CDP API Key** | https://portal.cdp.coinbase.com/ |
| **Account Association** | https://www.base.dev/preview?tab=account |
| **Preview Tool** | https://base.dev/preview |
| **Ваш кошелек** | https://basescan.org/address/0xeCF05e29657A0f2242796E803E3e59538dE56526 |
| **GitHub Repo** | https://github.com/Alexeyyyyyy/seer_base1 |

---

## 🎯 КРАТКИЙ ЧЕК-ЛИСТ

Выполните по порядку:

1. [ ] Деплой на Vercel → получить URL
2. [ ] Отключить Deployment Protection
3. [ ] Обновить NEXT_PUBLIC_URL и redeploy
4. [ ] Подписать манифест на base.dev/preview
5. [ ] Обновить minikit.config.ts и запушить
6. [ ] Проверить всё на base.dev/preview
7. [ ] Создать пост в Base App с URL
8. [ ] 🎉 Готово! Ваше приложение в Base App!

---

## 🚀 НАЧНИТЕ ПРЯМО СЕЙЧАС!

**Первый шаг**: Откройте https://vercel.com/new

Через 15 минут ваше приложение будет в Base App и начнет зарабатывать! 💰

**Удачи с запуском SeerBase!** 🔮✨

---

**P.S.** После публикации не забудьте поделиться ссылкой на ваш пост! 🎊

