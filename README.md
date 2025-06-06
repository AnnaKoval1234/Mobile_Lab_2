# Инструкция по установке  

В терминале установить проект:
   ```bash
   npx create-expo-app@latest Mobile_Lab_1
   ```
Далее выполнить очистку от шаблонного кода:
   ```bash
   npm run reset-project
   ```
Затем установить зависимости:
   ```bash
   npm install expo react-native-maps expo-image-picker expo-router expo-sqlite
   ```
Приложение запускается по команде
   ```bash
   npx expo start
   ```

##  Схема базы данных  
Таблица markers  

id INTEGER PRIMARY KEY AUTOINCREMENT -- идентификатор  
latitude REAL NOT NULL -- широта  
longitude REAL NOT NULL -- долгота  
created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- дата создания  
  
Таблица marker_images  

id INTEGER PRIMARY KEY AUTOINCREMENT -- идентификатор  
marker_id INTEGER NOT NULL -- идентификатор маркера  
uri TEXT NOT NULL -- ссылка на картинку  
created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- дата создания  
FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
  
##  Обработка ошибок  
1. Ошибка инициализации БД  
2. Ошибка транзакций  
3. подключение к базе данных