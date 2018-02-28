# Пасьянсовый игровой движок

|                                  |                 |
|----------------------------------|-----------------|
| **Установака зависимостей**      | `npm install`   |
| **Сборка**                       | `npm run build` |
| **Отладка**                      | `npm run dev`   |
| **Генерация документации ESDoc** | `npm run docs`  |

**Инициализация и запуск игры:**

`SolitaireEngine.init(`[CONFIG_JSON](#config-json)`);`

## Работа с библиотекой
<details>
<summary>Показать</summary>
<p>

[Обработка и сохранение ходов в историю](#обработка-и-сохранение-ходов-в-историю)\
[Подсказки](#подсказки)\
[Обработка выигрыша](#обработка-выигрыша)\
[Применение предыдущей истории ходов](#применение-предыдущей-истории-ходов)\
[Автоход в дом](#автоход-в-дом)\
[Спецход](#спецход)

#### Обработка и сохранение ходов в историю

`SolitaireEngine.on('makeStep', function(data) {`\
&nbsp;&nbsp;&nbsp;&nbsp;`Handler(data); // Метод из окружения для сохранения хода.`\
`});`

Отменить ход.\
`SolitaireEngine.emit('undo', STEP_DATA);`

Повторить ход.\
`SolitaireEngine.emit('redo', STEP_DATA);`

#### Подсказки

Показать подсказки.\
`SolitaireEngine.emit('tips:on');`

Скрыть подсказки.\
`SolitaireEngine.emit('tips:on');`

#### Обработка выигрыша

`SolitaireEngine.on('win', function() {`\
&nbsp;&nbsp;&nbsp;&nbsp;`Handler(); // Медод из окружения выполняемый при выигрыше`\
`});`

Запуск проверки на выигрыш вручную, возвращает `true` если расклад выигран.\
`SolitaireEngine.winCheck();`

#### Применение предыдущей истории ходов

`SolitaireEngine.emit('doHistory', {`\
&nbsp;&nbsp;&nbsp;&nbsp;
`"data": HISTORY_ARRAY,`\
&nbsp;&nbsp;&nbsp;&nbsp;
`"callback": function(data) {`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
`Handler(data); // Метод из окружения для сохранения хода.`\
&nbsp;&nbsp;&nbsp;&nbsp;
`}`\
`});`

Обработчик перемотки истории.\
`SolitaireEngine.on('rewindHistory', function(callback) {`\
&nbsp;&nbsp;&nbsp;&nbsp;
`callback({`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
`"attemptId": ATTEMPT_ID,`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
`"history": HISTORY_ARRAY,`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
`"redoSteps": REDO_STEPS_ARRAY,`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
`"undo": UndoHandler,`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
`"redo": RedoHandler`\
&nbsp;&nbsp;&nbsp;&nbsp;
`});`\
`});`

Сканирование историй ходов из всех попыток.\
`SolitaireEngine.emit('scanAttempts', {`\
&nbsp;&nbsp;&nbsp;&nbsp;
`"attempts" : ATTEMPTS_ARRAY_OF_HISTORIES,`\
&nbsp;&nbsp;&nbsp;&nbsp;
`"callback" : function() {`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
`SolitaireEngine.init(CONFIG_JSON);`\
&nbsp;&nbsp;&nbsp;&nbsp;
`}`\
`});`

#### Автоход в дом

Выполнить автоход в Дом.\
`SolitaireEngine.emit('autoMoveToHome');`

`SolitaireEngine.on('autoMoveToHome:start', function() {`\
&nbsp;&nbsp;&nbsp;&nbsp;
`Handler();`\
`});`

Вкл./Выкл. режима пометки карт.\
`SolitaireEngine.emit('toggleMarkerMode')`;

Обработчик состояния режима пометки карт.
`SolitaireEngine.on('markerMode:toggled', function(is_marker_mode) {`\
&nbsp;&nbsp;&nbsp;&nbsp;
`if (is_marker_mode) {`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
`// пометка карт включена`\
&nbsp;&nbsp;&nbsp;&nbsp;
`} else {`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
`// пометка карт выключена`\
&nbsp;&nbsp;&nbsp;&nbsp;
`}`\
`});`

#### Спецход

Вкл./Выкл. режима спецхода.\
`SolitaireEngine.emit('toggleSpecialStepMode');`

Обработчик состояния режима спецхода.\
`SolitaireEngine.on('specialStepMode:toggled', function(data) {`\
&nbsp;&nbsp;&nbsp;&nbsp;
`// {mode: Boolean, done: Boolean}`\
`});`

Отменить спецход.\
`SolitaireEngine.emit('revokeSpecialStep');`

Обработка повтора хода после спецхода.\
Возвращает количество отменённых ходов во время спецхода, можно использовать для отключения кнопки отмены спецхода если все отменённые ходы были повторены.
`SolitaireEngine.emit('checkToCancelRevokeSpecialStep', function(revokeLength) {`\
&nbsp;&nbsp;&nbsp;&nbsp;
`if (revokeLength === REDO_STEPS_ARRAY.length) {`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
`Handler(); // `\
&nbsp;&nbsp;&nbsp;&nbsp;
`}`\
`});`
</p>
</details>

---
## Описание структуры JSON конфигурации
<details>
<summary>Быстрый переход</summary>
<p>

* [Config JSON](#config-json)
* [Input params](#input-params)
* [Tips params](#tips-params)
* [Win check](#win-check)
* [Preference](#preference)
* [Auto step](#auto-step)
* [Action](#action)
* [Group](#group)
* [Deck](#deck)
* [Group generator](#group-generator)
* [Deck relations](#deck-relations)
* [Action](#action)
* [Win rules](#win-rules)
* [Vector2d](#vector2d)
* _Описание структур_
	* [Take rules names](#take-rules-names)
	* [Put rules names](#put-rules-names)
	* [Card name](#card-name)
	* [Suit names](#suit-names)
	* [Rank names](#rank-names)
* [Тип хода](#тип-хода)
* [Автоход в дом](#автоход-в-дом)
* [Примеры конфигурации](#примеры-конфигурации)
	* [Добавление стопки с картами](#добавление-стопки-с-картами)
	* [Перекладываем карты из одной скопки в другую](#перекладываем-карты-из-одной-скопки-в-другую)
	* [Добавление правила выигрыша](#добавление-правила-выигрыша)
	* [Группировка стопок](#группировка-стопок)

</p>
</details>

### Config JSON
JSON обьект описания пасьянса \([пример](#группировка-стопок)\)

* **zoom** - масштабирование
	* тип **Float**
	* по умолчанию `1.0`
* **moveDistance** - мимальная дистанция при перемещении карты в пикселях (если растояние меньше карта вернётся на своё место)
	* тип **Int**
	* по умолчанию `0`
* **inputParams** - ...
	* тип **[Input params](#input-params)**
* **field** - элемент страницы, который будет содержать в себе игровое поле
	* тип **String** - **CSS Selector** | **HTML DOM Element Object**
	* по умолчанию "#map"
* **winCheck** - правила окончания игры
	* тип **[Win check](#win-check)**
* **autoSteps** - ...
	* тип **Array<[Auto step](#auto-step)>**
* **groups** - группы
	* тип **[Group](#group)** | **[Group generator](#group-generator)**
* **decks** - стопки
	* тип Array<**[Deck](#deck)**>
* **fill** - ...
	* тип Array<**[Card name](#card-name)**> | Array<Array<**[Card name](#card-name)**>>
* **tipsParams** - ...
	* тип **[Tips params](#tips-params)**
* **startZIndex** - ...
	* тип **Int**
* **animationTime** - максимальная продолжительность анимации движения карт (в мс.)
	* тип **Int**
	* по умолчанию: `600`
* **preferences** - пользовательские настройки
	* тип **[Preference](#preference)**

---
### Input params
InputParams - параметры убравления (мышь)
* **doubleClick** - делать ход по двойному клику, будет выбран один из возможных в подсказках
	* тип **boolean**
	* по умолчанию `false`

---
### Tips params
Параметры подсказок.
* **hideOnEmpty** - автоматически скрывать пустую стопку
	* тип **Boolean**
	* по умолчанию `false`
* **excludeHomeGroups** - не показывать возможные ходы из групп входящих в достав «Дома»
	* тип **Boolean**
	* по умолчанию `true`

---
### Win check
Правила окончания игры.
* **rules** - правила выигрыша
	* тип **[Win rules](#win-rules)**

---
### Preference
Пользовательские настройки в дополнение к имеющимся в движке.
* **title** - заголовок
	* тип **String**
* **value** - параметр по умолчанию
	* тип **any**
	* **options** - опции
		* **title** - заголовок
			* тип **String**
		* **value** - параметр
			* тип **Any**

---
### Auto step
Автоход - один из вариантов автоматизации.
Предполагает автоматическое выполнение ходов, после определённого события, так же можно использовать для выполнения [типов ходов](#тип-хода) отличных от стандартного (в этом случае так-же возможна работа автохода в «ручном режиме» когда ходы выполняются не автоматически а самим игроком).
Не путать с [автоходом в «Дом»](#автоход-в-дом).

* **autoStep** - выполнять автоматически
	* тип **Boolean**
	* по умолчанию `false`
* **event** - событие по которому вызывается
	* тип **string**
* **dispatch** - событие которое генерирует по окончани
	* тип **string**
* так-же для разных автоходов могут быть дополнительные параметры

---
### Action

Автоматизация действий над стопкой по какому либу событию, как например выполнить раздачу из стопки по клику на неё, или совершении хода.

Реализованные Action-ы:
| Action         | Описание                     |
|----------------| -----------------------------|
| deal           | Раздача карт                 |
| kick           | Сброс карт                   |
| stepsAround    | ...                          |
| changeStepType | Изменение текущего [типа хода](#тип-хода) |
| lock           | Блокирование стопки          |
| unlock         | Разблокирование стопки       |
| checkFull      | ...                          |
| roller         | Реализация стопки с отбоем   |

---
### Group
Группа стопок обладающих общими свойствами.
* **name** - имя группы
	* тип **String**
* **position** - позиция на игровом поле.
	* тип **[Vector2d](#vector2d)**
	* по умолчанию `{x : 0, y : 0}`

	_-- параметры которые будут переданы дочерним стопкам --_
* **paddingType** - ...
	* тип String - padding type
	* по умолчанию `"none"`
* **paddingX** - ...
	* тип **Int**
	* по умолчанию `null`
* **paddingY** - ...
	* тип **Int**
	* по умолчанию `null`
* **flipPaddingX** - ...
	* тип **Int**
	* по умолчанию `null`
* **flipPaddingY** - ...
	* тип **Int**
	* по умолчанию `null`
* **flip** - ...
	* тип **String**
* **showSlot** - ...
	* тип **Boolean**
* **takeRules** - ...
	* тип Array<**String**>
* **putRules** - ...
	* тип **String** | Array<**String**>
* **fullRules** - ...
	* тип Array<**String**>
* **autoHide** - ...
	* тип **Boolean**
* **actions** - ...
	* тип **[Action](#action)**
* **fill** - ...
	* тип Array<**[Card name](#card-name)**> | Array<Array<**[Card name](#card-name)**>>
* **decks** - ...
	* тип **Array<[Deck](#deck)>**
* **tags** - ...
	* тип Array\<**String**\>

---
### Deck
Deck - стопка
* **name** - имя стопки
	* тип **String**
* **position** - ...
	* тип **[Vector2d](#vector2d)**
	* по умолчанию `{x : 0, y : 0}`
* **paddingType** - сдвиг карт лежащих в стопке.
	* тип **String**
	* по умолчанию `"none"`
* **paddingX** - сдвиг открытых карт по горизонтали.
	* тип **Int**
	* по умолчанию `null`
* **paddingY** - сдвиг открытых карт по вертикали.
	* тип **Int**
	* по умолчанию
	* по умолчанию `null`
* **flipPaddingX** - сдвиг закрытых карт по горизонтали.
	* тип **Int**
	* по умолчанию `null`
* **flipPaddingY** - сдвиг закрытых карт по вертикали.
	* тип **Int**
	* по умолчанию `null`
* **flip** - порядок открытых и закрытых карт.
	* тип **String**
* **showSlot** - показывать «рамку» пустой стопки.
	* тип **Boolean**
	* по умолчанию `true`
* **takeRules** - ...
	* тип **Array<String>**
    * по умолчанию `"any"`
* **putRules** - ...
	* тип **string** | **Array\<String\>**
	* по умолчанию `"any"`
* **fullRules** - ...
	* тип **Array<String>**
* **autoHide** - ...
	* тип **Boolean**
	* по умолчанию `false`
* **actions** - ...
	* тип **[Action](#action)**
* **locked** - стопка заблокирована (например до определённого этапа игры пока не отработает [Action](#action) или [Auto step](#auto-step))
	* тип **Boolean**
	* по умолчанию `false`
* **visible** - видимость стопки
	* тип **Boolean**
	* по умолчанию `true`
* **groupIndex** - ...
	* тип **Int**
* **startZIndex** - начальный номер слоя карт в стопке.
	* тип **Int**
	* по умолчанию `100`
* **fill** - карты в стопке в начале расклада
	* тип Array\<**[Card name](#card-name)**\> | Array\<Array\<**[Card name](#card-name)**\>\>
* **relations** - связи с другими стопками
	* тип Array<**[Relation](#deck-relations)**>

---
### Group generator
GroupGenerator - ...
* **generator**
	* **type** - ...
		* тип **String**

        _-- values --_

        _[См. group generators.](#group-generators)_


---
### Deck relations
| Relations  | Description                                         |
|------------|-----------------------------------------------------|
| **around** | отношение между рядом стоящими элементами в матрице |
| **beside** | отношение между рядом стоящими элементами в ряду    |
| **fall**   | условное направление «гравитации» в матрице         |

---
### Group generators
* **count** - ...

    _-- values --_
	* **count** - ...
		* тип **Int**
* **map**   - ...

    _-- values --_
	* **map** - ...
		* тип Array<Array<String | null>>
	* **aroundRelations** - ...
		* тип **Boolean**
		* по умолчанию `false`
* **fan**   - ...

    _-- values --_
	* **count** - ...
		* тип **Int**
		* по умолчанию `3`
	* **radius** - ...
		* тип **Int**
		* по умолчанию `100`
	* **center** - ...
		* тип **[Vector2d](#vector2d)**
		* по умолчанию `{x : 0, y : 0}`

---
### Win rules

| Rule             | Description                             |
|------------------|-----------------------------------------|
| **allEmpty**     | все стопки пусты                        |
| **allInOne**     | все карты в одной из стопок             |
| **allAscend**    | все карты в стопка лежат по возрастанию |
| **allDescent**   | все карты в стопка лежат по убыванию    |

**query** - составное правило, включает в себя возможность применять базовые правила к отдельным группам или стопкам.

---
### Vector2d
Vector2d - Вектор, используется для позиционирования стопок и карт в них.
* **x**
	* тип **Int**
* **y**
	* тип **Int**

---
## Описание структур

#### Take rules names
| Правило      | Описание                                                  |
|--------------|-----------------------------------------------------------|
| **not**      | нельзя брать карты                                        |
| **notFirst** | нельзя брать первую в стопке (последнюю оставшуюся) карту |
| **any**      | можно брать любую карту или последовательность            |
| **onlytop**  | можно брать только верхнюю карту                          |

---
#### Put rules names

| Правило         | Описание                                      |
|-----------------|-----------------------------------------------|
| **stripped**    | ...                                           |
| **firstAce**    | на пустую стопку можно положить только туз    |
| **firstKing**   | на пустую стопку можно положить только короля |
| **notForEmpty** | на пустую стопку нельзя класть карты          |
| **oneRank**     | можно класть только карты одного достоинства  |
| **oneSuit**     | можно класть только карты одной масти         |
| **any**         | можно класть любые карты                      |
| **not**         | нельзя класть карты                           |
| **ascendDeck**  | можно кластькарты выше достоинством           |
| **descentDeck** | можно кластькарты ниже достоинством           |
| **oneRankDeck** | ...                                           |
| **ascend**      | ...                                           |
| **descent**     | ...                                           |
| **descentOne**  | карты выше достоинством на одну единицу       |
| **ascendOne**   | ...                                           |
| **summ14**      | карты дающие в сумме 14                       |

---
#### Card name
* suit name + rank name, like: `"h" + "9"` → `"h9"`

---
#### Suit names
| Масть |          |
|:-----:|----------|
| **h** | hearts   |
| **c** | clubs    |
| **d** | diamonds |
| **s** | spides   |

---
#### Rank names
| Достоинство |       |
|:-----------:|-------|
| **1...9**   | cards |
| **j**       | jack  |
| **q**       | queen |
| **k**       | king  |

---
#### Тип хода

В зависимости от установленного типа хода могут использоваться дополнительные правила проверки возможности хода, так например во время использования [автохода](#auto-step) `fall` в «ручном режиме» меняется тип хода и и становится возможным совершать перемещения карт по новым правилам.

#### Автоход в дом

Встроенный механизм для совершения автоматических ходов в стопки из групп помеченных как «Дом».

---
### Примеры конфигурации

#### _Добавление стопки с картами_
```
var config = {
    field: "#wrap",            // элемент в котором будет рендериться игровые элементы
                               // если не задано ищет "#map"
    decks: [
        {
            name: "deck_name", // пустая стопка
            position: {        // координаты стопки на поле
                x: 1,
                y: 1
            }
        }
    ]
};

// заполняем стопку картами
config.decks[0].fill = ["c1", "c2", "c3", "c4"]; // последний элемент в стопке верхний
```
#### _Обработка правил возможного хода_

В данной конфигурации имеется две стопки, первая `deck_one` из которой можно брать карты по одной и нельзя класть карты в неё, и вторая `deck_two` в которую можно класть любое сочетание карт, но брать карты из неё нельзя.

```
var config = {
    decks: [
        {
            name: "deck_one",
            position: {
                x: 100,
                y: 100
            },
            takeRules: ["onlytop"],
            putRules: ["not"]
        },
        {
            name : "deck_two",
            position : {
                x: 300,
                y: 100
            },
            takeRules: ["not"],
            putRules: ["any"]
        }
    ]
};

config.decks[0].fill = ["c1", "c2", "c3", "c4"];
```

#### _Добавление правила выигрыша_

```
var config = {
    winCheck: ["allInOne"],
    decks: [
        {
            name: "deck_one",
            position: {
                x: 100,
                y: 20
            },
            takeRules: ["onlytop"],
            putRules: ["not"]
        },
        {
            name: "deck_two",
            position: {
                x: 400,
                y: 20
            },
            takeRules: ["onlytop"],
            putRules: ["not"]
        },
        {
            name : "deck_three",
            position : {
                x: 250,
                y: 70
            },
            takeRules: ["not"],
            putRules: ["any"]
        }
    ]
};

config.decks[0].fill = ["c7", "c5", "c3", "c1"];
config.decks[1].fill = ["c8", "c6", "c4", "c2"];
```

#### _Группировка стопок_

```
var config = {
    winCheck: ["allInOne"],
    groups: {
        group_1: {
            takeRules: ["onlytop"],
            putRules: ["not"],
            position: {
                y: 20
            },
            decks: [
                {
                    position: {
                        x: 100
                    },
                    
                },
                {
                    position: {
                        x: 400
                    }
                }
            ]
        }
    },
    decks: [
        {
            name : "deck_three",
            position : {
                x: 250,
                y: 70
            },
            takeRules: ["not"],
            putRules: ["any"]
        }
    ]
};

config.groups.group_1.fill = [
    ["c7", "c5", "c3", "c1"],
    ["c8", "c6", "c4", "c2"]
];
```