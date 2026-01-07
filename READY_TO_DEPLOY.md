# 🚀 Готово к деплою на Vercel!

## ✅ Все настроено и готово к запуску!

### Что уже сделано:

- ✅ **Daily quests**: DeFi / NFT / Social + check-in
- ✅ **Система очков и стрика**
- ✅ **Верификация**: DeFi swap и NFT mint по tx hash (receipt/logs)
- ✅ **Share**: через `composeCast`
- ✅ **Код собирается** (build ок)

---

## 🎯 ДЕПЛОЙ НА VERCEL (5 МИНУТ)

### Шаг 1: Откройте Vercel

👉 **Нажмите**: https://vercel.com/new

### Шаг 2: Импортируйте репозиторий

1. Авторизуйтесь через **GitHub**
2. Найдите ваш репозиторий (например `cryptonix65/daily-base-quest`)
3. Нажмите **"Import"**

### Шаг 3: Настройте проект

#### Project Settings:
- **Project Name**: `seer-base` (или любое другое)
- **Framework**: Next.js (автоматически)
- **Root Directory**: `./`

### Шаг 4: Добавьте переменные окружения

В разделе **"Environment Variables"**:

#### ОБЯЗАТЕЛЬНАЯ переменная:

```
Name:  NEXT_PUBLIC_ONCHAINKIT_API_KEY
Value: ваш_api_key_здесь
```

**Где взять API Key:**
1. 🔗 Откройте: https://portal.cdp.coinbase.com/
2. Создайте проект или войдите в существующий
3. Скопируйте **Client API Key**
4. Вставьте в поле Value

#### OPTIONAL переменные:

```
Name:  NEXT_PUBLIC_URL
Value: (оставить пустым)
```

```
Name:  NEXT_PUBLIC_DEFI_ROUTER_ALLOWLIST
Value: (пусто = эвристическая проверка swap; можно указать адреса роутеров через запятую)
```

### Шаг 5: Нажмите Deploy! 🚀

Нажмите большую синюю кнопку **"Deploy"**

⏱️ Ожидайте 2-3 минуты...

### Шаг 6: Получите URL

После успешного деплоя вы получите URL типа:
```
https://seer-base-xxx.vercel.app
```

**🎉 Поздравляем! Приложение задеплоено!**

---

## ⚙️ НАСТРОЙКА ПОСЛЕ ДЕПЛОЯ

### 1. Отключите Deployment Protection

📖 Согласно [документации Base](https://docs.base.org/mini-apps/quickstart/create-new-miniapp):

1. Откройте **Vercel Dashboard** → ваш проект
2. **Settings** → **Deployment Protection**
3. **Выключите** "Vercel Authentication"
4. **Save**

### 2. Обновите NEXT_PUBLIC_URL

1. Скопируйте ваш Vercel URL
2. **Settings** → **Environment Variables**
3. Найдите `NEXT_PUBLIC_URL`
4. Установите: `https://ваш-url.vercel.app`
5. **Save**
6. **Deployments** → последний деплой → **⋮** → **Redeploy**

---

## 📝 ПОДПИШИТЕ МАНИФЕСТ (ВАЖНО!)

### Шаг 1: Откройте Account Association Tool

👉 https://www.base.dev/preview?tab=account

### Шаг 2: Введите ваш домен

В поле **"App URL"** введите (БЕЗ https://):
```
ваш-url.vercel.app
```

Нажмите **"Submit"**

### Шаг 3: Подпишите

1. Нажмите **"Verify"**
2. Подключите **Farcaster кошелек**
3. **Подпишите** транзакцию
4. **Скопируйте** весь объект `accountAssociation`

### Шаг 4: Обновите minikit.config.ts

Откройте `minikit.config.ts` локально и вставьте:

```typescript
export const minikitConfig = {
  accountAssociation: {
    "header": "вставьте_сюда",
    "payload": "вставьте_сюда",
    "signature": "вставьте_сюда"
  },
  miniapp: {
    version: "2",
            name: "Daily Base Quest",
    // ... остальное без изменений
  },
}
```

### Шаг 5: Закоммитьте и запушьте

```bash
git add minikit.config.ts
git commit -m "feat: add Farcaster account association"
git push origin main
```

✅ Vercel автоматически задеплоит!

---

## 🧪 ТЕСТИРОВАНИЕ

### Откройте Preview Tool

👉 https://base.dev/preview

#### Вкладка "Launch":
- Введите URL приложения
- Проверьте embed
- Нажмите кнопку запуска

#### Вкладка "Account association":
- Убедитесь что подпись валидна ✅

#### Вкладка "Metadata":
Проверьте что отображается:
- ✅ Name: Daily Base Quest
- ✅ Tagline/Description соответствуют `minikit.config.ts`
- ✅ Icon/Hero/Screenshot грузятся

---

## 📱 ПУБЛИКАЦИЯ В BASE APP

Согласно [документации Base](https://docs.base.org/mini-apps/quickstart/create-new-miniapp):

1. Откройте **Base app**
2. Создайте **новый пост**
3. Вставьте **URL вашего приложения**
4. **Опубликуйте**! 🎉

Ваше Mini App теперь доступно всем пользователям Base!

---

## 💰 МОНЕТИЗАЦИЯ

### Ожидаемый доход:

| Пользователей | Вопросов/день | Доход/день | Доход/месяц |
|---------------|---------------|------------|-------------|
| 50            | 50            | ~$4.50     | ~$135       |
| 200           | 200           | ~$18       | ~$540       |
| 500           | 500           | ~$45       | ~$1,350     |
| 1000          | 1000          | ~$90       | ~$2,700     |

### Отслеживание платежей:

**BaseScan**: https://basescan.org/address/0xeCF05e29657A0f2242796E803E3e59538dE56526

Здесь вы будете видеть все входящие USDC транзакции в реальном времени!

### Вывод средств:

1. **Base Bridge** → Ethereum → CEX
2. **Прямо на биржу** (Coinbase, Binance)
3. **Использовать в Base DeFi**

---

## 📊 ЧЕК-ЛИСТ ДЕПЛОЯ

### Перед деплоем:
- [x] ✅ Адрес кошелька установлен
- [x] ✅ Код протестирован
- [x] ✅ Запушено в GitHub

### Деплой:
- [ ] ⏳ Получить OnchainKit API Key
- [ ] ⏳ Импортировать в Vercel
- [ ] ⏳ Добавить переменные окружения
- [ ] ⏳ Нажать Deploy
- [ ] ⏳ Получить URL

### После деплоя:
- [ ] ⏳ Отключить Deployment Protection
- [ ] ⏳ Обновить NEXT_PUBLIC_URL
- [ ] ⏳ Подписать манифест
- [ ] ⏳ Обновить accountAssociation
- [ ] ⏳ Протестировать на base.dev/preview
- [ ] ⏳ Опубликовать в Base app

---

## 🔗 ВАЖНЫЕ ССЫЛКИ

| Что | Ссылка |
|-----|--------|
| **→ Деплой на Vercel** | https://vercel.com/new |
| **→ CDP API Key** | https://portal.cdp.coinbase.com/ |
| **→ Account Association** | https://www.base.dev/preview?tab=account |
| **→ Preview Tool** | https://base.dev/preview |
| **→ BaseScan (ваш кошелек)** | https://basescan.org/address/0xeCF05e29657A0f2242796E803E3e59538dE56526 |
| **→ GitHub Repo** | https://github.com/Alexeyyyyyy/seer_base1 |
| **→ База Docs** | https://docs.base.org/mini-apps/quickstart/create-new-miniapp |

---

## 🆘 ПОМОЩЬ

### Приложение не открывается?
- Проверьте что Deployment Protection выключена
- Убедитесь что NEXT_PUBLIC_URL установлен
- Проверьте логи в Vercel Dashboard

### Платежи не работают?
- Убедитесь что пользователь на Base сети
- Проверьте что у него есть USDC
- Проверьте адрес кошелька в коде

### Манифест не подписывается?
- Убедитесь что домен доступен (без Vercel Auth)
- Используйте Farcaster кошелек
- Попробуйте другой браузер

---

## 🎉 ВСЁ ГОТОВО!

**Следующий шаг**: Откройте https://vercel.com/new и начните деплой!

После деплоя вернитесь к этому файлу для следующих шагов.

**Удачи с запуском Daily Base Quest!**

---

**P.S.** Не забудьте поделиться ссылкой на ваше приложение после запуска! 🚀


















