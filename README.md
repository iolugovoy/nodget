# Система сборки unicontent

## Запуск

Клонировать репозиторий:
```
git clone https://github.com/unicontent/app.git project
cd project
```

Установить пакеты:
```
npm install
```
Запустить gulp:
```
gulp --dev --server
```
`--dev` отключает сжатие скроптов и стилей, чтобы сборка происходила быстрее, и для удобства отладки. Перед сдачей проекта убедиться, что без `--dev` верстка не ломается.

`--server` запускает локальный http сервер на `localhost:8080`. В качестве альтернативы можно использовать apache, закомментировав перед этим все содержимое `.htaccess`.

## Использование

Все скрипты и стили собираются в `global.js` и `global.css`. Подключаемые зависимости следует хранить в `vendor` и указывать в `scopes.json` пути относительно `vendor`. 

Иконки png складывать в `sprites/global`

Новые страницы помещать в `jade` и наследовать от `jade/include/layout.pug` на примере `jade/index.pug`

Все шрифты хранить в `assets/fonts`, `font-face` прописывать в `css/fonts.styl`

Глобальные stylus переменные хранить в `css/settings.styl`, существующие не удалять.

В адаптивной верстке использовать примеси `+above({scalename})`, где `scalename` - один из `rupture.scale-names`, указаных в `css/settings.styl`