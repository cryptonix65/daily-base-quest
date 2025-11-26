# 💰 Руководство по оплате в SeerBase

## Обзор

SeerBase теперь поддерживает **платные вопросы**! Каждый вопрос оракулу стоит **0.1 USDC** на сети Base.

## Как это работает

### 1. Процесс оплаты

```
Пользователь вводит вопрос
      ↓
Нажимает "Pay 0.1 USDC & Ask"
      ↓
Открывается кошелек для подтверждения
      ↓
Отправка 0.1 USDC на адрес оракула
      ↓
Транзакция подтверждается
      ↓
Шар трясется и показывает ответ!
```

### 2. Технические детали

#### Контракт USDC на Base
```typescript
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
```

#### Адрес получателя (ВАЖНО!)
```typescript
const ORACLE_WALLET = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
```

**⚠️ ВАЖНО**: Замените `ORACLE_WALLET` на свой адрес Base кошелька!

#### Сумма оплаты
```typescript
const PAYMENT_AMOUNT = "0.1" // 0.1 USDC
```

## Изменение настроек

### Изменить адрес получателя

Откройте `app/page.tsx` и замените адрес:

```typescript
const ORACLE_WALLET = "ВАШ_АДРЕС_ЗДЕСЬ" as Address;
```

### Изменить сумму оплаты

```typescript
const PAYMENT_AMOUNT = "0.5" // Например, 0.5 USDC
```

Не забудьте обновить текст на кнопках:
```typescript
{`Pay ${PAYMENT_AMOUNT} USDC & Ask`}
```

## Интеграция с Wagmi

Приложение использует `wagmi` для работы с блокчейном:

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

const { writeContractAsync } = useWriteContract();

// Отправка транзакции
const hash = await writeContractAsync({
  address: USDC_ADDRESS,
  abi: ERC20_ABI,
  functionName: "transfer",
  args: [ORACLE_WALLET, parseUnits(PAYMENT_AMOUNT, 6)]
});
```

## Пользовательский опыт

### Статусы платежа

1. **Ожидание** - Обычное состояние, кнопка "Pay 0.1 USDC & Ask"
2. **Обработка** - "Processing Payment..." + иконка 💳 в шаре
3. **Успех** - Шар трясется и показывает ответ
4. **Ошибка** - Красное сообщение об ошибке

### Обработка ошибок

Приложение показывает понятные ошибки:
- "Payment failed. Please try again." - общая ошибка
- Конкретные сообщения от кошелька (недостаточно средств, отклонение и т.д.)

## UI элементы

### Тег с ценой
```jsx
<div className={styles.priceTag}>
  💎 {PAYMENT_AMOUNT} USDC per question
</div>
```

Отображается золотым цветом с пульсирующей анимацией.

### Индикатор оплаты
Во время оплаты в шаре показывается:
- Золотая пульсирующая иконка 💳
- Вращающаяся анимация
- Текст "Processing Payment..."

## Стили

Новые CSS классы в `app/page.module.css`:

```css
.priceTag {
  font-size: 1rem;
  font-weight: 600;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  border: 2px solid rgba(251, 191, 36, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.processingWindow {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 50%;
  animation: pulseGlow 1s ease-in-out infinite;
}

.error {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}
```

## Тестирование

### Локальное тестирование

1. Запустите приложение:
```bash
npm run dev
```

2. Убедитесь что:
   - Показывается тег с ценой
   - Кнопка содержит текст "Pay 0.1 USDC & Ask"
   - При клике открывается кошелек

### Тестирование на Base Testnet

Для тестирования без реальных денег:

1. Используйте Base Goerli Testnet
2. Измените `USDC_ADDRESS` на testnet контракт
3. Получите testnet USDC на Base Goerli faucet

```typescript
// Base Goerli Testnet USDC
const USDC_ADDRESS = "0xF175520C52418dfE19C8098071a252da48Cd1C19" as Address;
```

## Безопасность

### Проверки

- ✅ Пользователь должен подтвердить транзакцию в кошельке
- ✅ Проверка баланса USDC происходит автоматически
- ✅ Транзакция отправляется только после подтверждения
- ✅ Ошибки обрабатываются корректно

### Рекомендации

1. **Всегда проверяйте адрес кошелька** получателя перед деплоем
2. **Тестируйте на testnet** перед production
3. **Установите разумную цену** (0.1 USDC = ~$0.10)
4. **Мониторьте входящие платежи** на вашем кошельке

## Монетизация

### Расчёт дохода

```
Вопросов в день × Цена = Дневной доход

Примеры:
- 100 вопросов × $0.10 = $10/день
- 1000 вопросов × $0.10 = $100/день
- 10000 вопросов × $0.10 = $1000/день
```

### Вывод средств

USDC на Base можно легко вывести:
1. Через Base bridge на Ethereum
2. Через CEX (Coinbase, Binance и т.д.)
3. Использовать напрямую в Base экосистеме

### Комиссии

- **Gas на Base**: ~$0.001-0.01 за транзакцию
- **Ваша прибыль**: ~$0.09-0.099 с каждого вопроса

## Альтернативные модели оплаты

### Подписка
```typescript
// Проверка активной подписки
if (!userHasActiveSubscription) {
  // Показать экран оплаты подписки
}
```

### Freemium модель
```typescript
const FREE_QUESTIONS = 3;
if (questionCount < FREE_QUESTIONS) {
  // Бесплатный вопрос
} else {
  // Платный вопрос
}
```

### Динамическое ценообразование
```typescript
const PAYMENT_AMOUNT = 
  isPremiumUser ? "0.05" : 
  isFirstQuestion ? "0.0" : 
  "0.1";
```

## FAQ

### Что если у пользователя нет USDC?
Можно добавить инструкцию по покупке USDC или ссылку на обменник.

### Можно ли принимать другие токены?
Да! Измените `USDC_ADDRESS` на адрес любого ERC20 токена на Base.

### Нужна ли верификация оплаты?
`useWaitForTransactionReceipt` автоматически ждёт подтверждения. Можно добавить дополнительную проверку через webhook.

### Как отследить кто платил?
```typescript
const { data } = useAccount();
console.log("Wallet address:", data?.address);
```

Сохраните адрес отправителя в базу данных вместе с хешем транзакции.

## Дальнейшие улучшения

1. **База данных платежей** - Сохранять все транзакции
2. **История вопросов** - Показывать историю платных вопросов
3. **Реферальная программа** - 10% от платежей рефералов
4. **NFT сертификаты** - Минтить NFT особо интересных ответов
5. **Статистика** - Дашборд с доходами и популярными вопросами

## Поддержка

Если возникли проблемы:
1. Проверьте адрес `ORACLE_WALLET`
2. Убедитесь что у пользователя есть USDC
3. Проверьте сеть (должна быть Base mainnet)
4. Посмотрите console.log для ошибок

---

**Готово!** 💰 Ваш оракул теперь приносит доход!

