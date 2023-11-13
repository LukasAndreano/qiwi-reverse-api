# 🥝 QIWI Reverse API

## Что это и зачем?

С [недавних пор](https://developer.qiwi.com/ru/qiwi-wallet-personal/#auth_param) QIWI закрыли возможность получения OAuth-токенов:

> **Мы остановили выпуск OAuth-токенов. Приносим извинения за доставленные неудобства.**
>
> _Источник: [developer.qiwi.com/ru/qiwi-wallet-personal](https://developer.qiwi.com/ru/qiwi-wallet-personal/#auth_param)_

Благодаря этому API, осуществляющему получение **куки** и **access_token** из вашего QIWI-кошелька через аутентификацию с помощью телефона и пароля, а также обновляющему их каждые два часа, продолжение использования API становится возможным, хотя и менее удобным.

## Как происходит получение токена?

Под капотом [puppeteer](https://github.com/puppeteer/puppeteer), [puppeteer-extra-plugin-stealth](https://www.npmjs.com/package/puppeteer-extra-plugin-stealth) и [puppeteer-extra](https://www.npmjs.com/package/puppeteer-extra).

Запускаем браузер, входим, достаем параметр из _куки_, а тажке токен из _localstorage_.

## Начало работы

Склонируйте репозиторий в нужную вам директорию:

```bash
git clone https://github.com/LukasAndreano/qiwi-reverse-api.git <name>
```

Установите зависимости:

```bash
cd <name>
yarn
```

Пропишите правильные доступы к БД, создав файл **.env** (он не идет в GIT, игнорируется), используя **env.example**. После чего запустите сервинг:

```bash
yarn dev
```

## Todo

- [x] Авто-деплой на локальный Docker Registry
- [ ] Написать автотесты

## Методы API

Все методы для работы описаны в документации, расположенной по адресу:

> [http://localhost:3000/docs](http://localhost:3000/docs)
>
> Логин и пароль для входа в Swagger: **devs** (если не указан иной)

Однако, дополнительно дублирую:

### /auth POST

```json
{
  "phone": "79999999999",
  "password": "YourPassword"
}
```

Вернет:

```json
{
  "status": true,
  "statusCode": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidHlwZSI6ImFjY2Vzc190b2tlbiIsImlhdCI6MTY5OTg4Mjg5OSwiZXhwIjoxNjk5OTY5Mjk5fQ.R0njmshiqkzZWQNObJtRw6RzCfC7DHNsoJiOnoZVHM0",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3NTA5YjMxLWVjMDAtNDlhZi1hZDhmLWExMTExNmE2NGE0MCIsInVzZXJfaWQiOjMsInR5cGUiOiJyZWZyZXNoX3Rva2VuIiwiaWF0IjoxNjk5ODgyODk5LCJleHAiOjE3MDI0NzQ4OTl9.rkWCHDWlR-m_-Pqh4F0Grw3HNpTlazTBVimu-sKwdpY"
  }
}
```

> Время жизни **access_token** - 1 день, **refresh_token** - 30 дней.

### /auth/refresh POST

body:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3NTA5YjMxLWVjMDAtNDlhZi1hZDhmLWExMTExNmE2NGE0MCIsInVzZXJfaWQiOjMsInR5cGUiOiJyZWZyZXNoX3Rva2VuIiwiaWF0IjoxNjk5ODgyODk5LCJleHAiOjE3MDI0NzQ4OTl9.rkWCHDWlR-m_-Pqh4F0Grw3HNpTlazTBVimu-sKwdpY"
}
```

Вернет:

```json
{
  "status": true,
  "statusCode": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidHlwZSI6ImFjY2Vzc190b2tlbiIsImlhdCI6MTY5OTg4Mjg5OSwiZXhwIjoxNjk5OTY5Mjk5fQ.R0njmshiqkzZWQNObJtRw6RzCfC7DHNsoJiOnoZVHM0",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3NTA5YjMxLWVjMDAtNDlhZi1hZDhmLWExMTExNmE2NGE0MCIsInVzZXJfaWQiOjMsInR5cGUiOiJyZWZyZXNoX3Rva2VuIiwiaWF0IjoxNjk5ODgyODk5LCJleHAiOjE3MDI0NzQ4OTl9.rkWCHDWlR-m_-Pqh4F0Grw3HNpTlazTBVimu-sKwdpY"
  }
}
```

### /request POST

body:

```json
{
  "method": "GET",
  "endpoint": "/payment-history/v2/persons/79999999999/payments",
  "params": {
    "rows": 10,
    "operation": "IN"
  }
}
```

Ответ (изменен в целях безопасности):

```json
{
  "status": true,
  "statusCode": 201,
  "data": {
    "data": [
      {
        "txnId": 0,
        "personId": 0,
        "date": "2022-10-13T14:45:27+03:00",
        "errorCode": 0,
        "error": null,
        "status": "SUCCESS",
        "type": "IN",
        "statusText": "Success",
        "trmTxnId": "0",
        "account": "0",
        "sum": {
          "amount": 1000,
          "currency": 398
        },
        "commission": {
          "amount": 0,
          "currency": 398
        },
        "total": {
          "amount": 190000,
          "currency": 398
        },
        "provider": {
          "id": 4,
          "shortName": "Платеж с терминала",
          "longName": "Платеж с терминала",
          "logoUrl": null,
          "description": null,
          "keys": null,
          "siteUrl": null,
          "extras": []
        },
        "source": {
          "id": 99,
          "shortName": "Перевод на QIWI Кошелек",
          "longName": null,
          "logoUrl": "https://static.qiwi.com/img/providers/logoBig/99_l.png",
          "description": null,
          "keys": "пополнить, перевести, qiwi, кошелек, оплатить, онлайн, оплата, счет, способ, услуга, перевод",
          "siteUrl": "https://www.qiwi.com",
          "extras": [
            {
              "key": "seo_description",
              "value": "Пополнение QIWI Кошелька банковской картой без комиссии от 2000 руб., со счета мобильного телефона или наличными через QIWI Терминалы. Оплачивать услуги стало проще."
            },
            {
              "key": "seo_title",
              "value": "Пополнить QIWI Кошелек: с банковской карты, с баланса телефона, через QIWI Кошелек"
            }
          ]
        },
        "comment": null,
        "currencyRate": 1,
        "paymentExtras": [],
        "features": {
          "chequeReady": false,
          "bankDocumentReady": false,
          "regularPaymentEnabled": false,
          "bankDocumentAvailable": false,
          "repeatPaymentEnabled": false,
          "favoritePaymentEnabled": false,
          "chatAvailable": false,
          "greetingCardAttached": false
        },
        "serviceExtras": {},
        "view": {
          "title": "Платеж с терминала",
          "account": "0"
        }
      }
    ],
    "nextTxnId": 0,
    "nextTxnDate": "2022-10-13T14:45:27+03:00"
  }
}
```

> Если метод **GET** и имеет **query** параметры, то необходимо их передавать в **params**, как и в случае с **body**
