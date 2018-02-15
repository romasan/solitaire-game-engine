# Пасьянсовый игровой движок

#### Установака зависимостей:
	npm install
#### Сборка:
	npm run build
#### Отладка:
	npm run dev
#### Генерация документации
	npm run docs
#### Иннициирование и запуск игры:
Пример:
SolitaireEngine.init([Field](#field));

---
### Field
Field - JSON обьект описания пасьянса

* **zoom** - масштабирование
	* тип **float**
	* по умолчанию 1.0
* **moveDistance** - мимальная дистанция при перемещении карты (если растояние меньше карта вернётся на своё место)
	* тип **Int**, (px)
	* по умолчанию 0,
* **inputParams** - ...
	* тип **[InputParams](#inputparams)**
* **field** - элемент страницы, который будет содержать в себе игровое поле
	* тип **string**/**CSS Selector** | **HTML DOM Element Object**
	* по умолчанию "#map"
* **winCheck** - правила окончания игры
	* тип **[WinCheck](#wincheck)**
* **autoSteps** - ...
	* тип **\[[Autostep](#autostep)\]**
* **groups** - группы
	* тип **[Group](#group)** | **[GroupGenerator](#groupgenerator)**
* **decks** - стопки
	* тип **\[[Deck](#deck)\]**
* **fill** - ...
	* тип [**string**/**card name**] | [[**string**/**card name**]]
	* примеры:
```

	1.
		["c1", "c2", "c3"]
	2.
		[
			["c1", "c2", "c3"],
			["c4", "c5", "c6"]
		]
```
* **tipsParams** - ...
	* тип **[TipsParams](#tipsparams)**
* **startZIndex** - ...
	* тип **Int**
* **animationTime** - ...
	* тип **Int**
	* по умолчанию: 600 (мс)
* **preferences** - пользовательские настройки
	* тип **[Preference](#preference)**

**Примеры конфигурации:**

_Добавление стопки с картами_
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
_Перекладываем карты из одной скопки в другую_
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

---
### InputParams
InputParams - параметры убравления (мышь)
* **doubleClick** - делать ход по двойному клику, будет выбран один из возможных в подсказках
	* тип **boolean**
	* по умолчанию false

---
### TipsParams
TipsParams - параметры подсказок
* **hideOnEmpty** - автоматически скрывать пустую стопку
	* тип **boolean**
	* по умолчанию false
* **excludeHomeGroups** - не показывать возможные ходы из групп входящих в достав «Дома»
	* тип **boolean**
	* по умолчанию true

---
### WinCheck
WinCheck - Проверка на выигрыш расклада.
* **rules** - правила выигрыша
	* тип **[Win rules](#win-rules)**

---
### Preference
Preference - Пользовательские настройки в дополнение к имеющимся в движке.
* **title** - заголовок
	* тип **string**
* **value** - параметр по умолччанию
	* тип **any**
	* **options** - опции
		* **title** - заголовок
			* тип **string**
		* **value** - параметр
			* тип **any**

---
### Autostep
Autostep - один из вариантов автоматизации, в отличие от Action у стопок выполняется только после выполнения события на которое подписан
* **event** - событие по которому вызывается
	* тип **string**
* **dispatch** - событие которое генерирует по окончании
	* тип **string**

	_-- values --_
---
### Action
Deck action - ...
---
### Vector2d
Vector2d - Вектор, используется для позиционирования стопок и карт в них.
* **x**
	* тип **Int**
* **y**
	* тип **Int**

---
### Group
Group - группа стопок обладающих общими свойствами.
* **name** - имя группы
	* тип **string**
* **position** - позиция на игровом поле.
	* тип **[Vector2d](#vector2d)**
	* по умолчанию {x : 0, y : 0}

	_-- параметры которые будут переданы дочерним стопкам --_
* **paddingType** - ...
	* тип string/padding type
	* по умолчанию "none"
* **paddingX** - ...
	* тип **Int**
* **paddingY** - ...
	* тип **Int**
* **flipPaddingX** - ...
	* тип **Int**
* **flipPaddingY** - ...
	* тип **Int**
* **flip** - ...
	* тип **string**
* **showSlot** - ...
	* тип **boolean**
* **takeRules** - ...
	* тип **[string]**
* **putRules** - ...
	* тип **string** | **[string]**
* **fullRules** - ...
	* тип [string/card name]
* **autoHide** - ...
	* тип **boolean**
* **actions** - ...
	* тип **[Action](#action)**
* **fill** - ...
	* тип [string/card name] | [[string/card name]]
* **decks** - ...
	* тип **\[[Deck](#deck)\]**
* **tags** - ...
	* тип **[string]**

---
### Deck
Deck - стопка
* **name** - имя стопки
	* тип **string**
* **position** - ...
	* тип **[Vector2d](#vector2d)**
	* по умолчанию {x : 0, y : 0}
* **paddingType** - сдвиг карт лежащих в стопке.
	* тип **string**
	* по умолчанию "none"
* **paddingX** - сдвиг открытых карт по горизонтали.
	* тип **Int**
* **paddingY** - сдвиг открытых карт по вертикали.
	* тип **Int**
* **flipPaddingX** - сдвиг закрытых карт по горизонтали.
	* тип **Int**
* **flipPaddingY** - сдвиг закрытых карт по вертикали.
	* тип **Int**
* **flip** - порядок открытых и закрытых карт.
	* тип **string**
* **showSlot** - показывать «рамку» пустой стопки.
	* тип **boolean**
	* по умолчанию true
* **takeRules** - ...
	* тип **[string]**
    * по умолчанию "any"
* **putRules** - ...
	* тип **string** | **Array\<string\>**
	* по умолчанию "any"
* **fullRules** - ...
	* тип **[string]**
* **autoHide** - ...
	* тип **boolean**
	* по умолчанию false
* **actions** - ...
	* тип **[Action](#action)**
* **locked** - ...
	* тип **boolean**
	* по умолчанию false
* **parent** - ...
	* тип **string**
* **visible** - ...
	* тип **boolean**
	* по умолчанию true
* **groupIndex** - ...
	* тип **Int**
* **startZIndex** - начальный номер слоя карт в стопке.
	* тип **Int**
	* по умолчанию 100
* **fill** - ...
	* тип **Array<string>** | **Array\<Array\<string\>\>**
* **relations** - связи с другими стопками
	* тип **\[[Relation](#deck-relations)\]**

---
### GroupGenerator
GroupGenerator - ...
* **generator**
	* **type** - ...
		* тип **string**

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
		* тип [[string | null]]
	* **aroundRelations** - ...
		* тип **boolean**
		* по умолчанию false
* **fan**   - ...

    _-- values --_
	* **count** - ...
		* тип **Int**
		* по умолчанию 3
	* **radius** - ...
		* тип **Int**
		* по умолчанию 100
	* **center** - ...
		* тип **[Vector2d](#vector2d)**
		* по умолчанию {x : 0, y : 0}

---
### Action
Action - ...

---
### Win rules
* **{query}** - составное правило, включает в себя возможность применять базовые правила к отдельным группам или стопкам.
* **"allEmpty"** - все стопки пусты
* **"allInOne"** - все карты в одной из стопок
* **"allAscend"** - все карты в стопка лежат по возрастанию
* **"allDescent"** - все карты в стопка лежат по убыванию

---
## Описание структур
#### take rules names
| Правило      | Описание                                                  |
|--------------|-----------------------------------------------------------|
| **not**      | нельзя брать карты                                        |
| **notFirst** | нельзя брать первую в стопке (последнюю оставшуюся) карту |
| **any**      | можно брать любую карту или последовательность            |
| **onlytop**  | можно брать только верхнюю карту                          |
---
#### put rules names

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
#### cardnames
* suit name + rank name, like: "h" + "9" -> "h9"

---
#### suit names
| Масть |          |
|-------|----------|
| **h** | hearts   |
| **c** | clubs    |
| **d** | diamonds |
| **s** | spides   |

---
#### ranks names
| Достоинство |       |
|-------------|-------|
| **1...9**   | cards |
| **j**       | jack  |
| **q**       | queen |
| **k**       | king  |
---
