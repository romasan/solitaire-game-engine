# Пасьянсовый игровой движок

#### Установака зависимостей:
	npm install
#### Сборка:
	npm run build
#### Отладка:
	npm run dev
#### Иннициирование и запуск игры:
Пример:
SolitaireEngine.init([Field](#field));

---
### Field
Field - JSON обьект описания пасьянса

* **zoom** - масштабирование
	* тип **float**
	* по умолчанию 1
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

---
### InputParams
InputParams - параметры убравления (мышь)
* **doubleClick** - ...
	* тип **boolean**
	* по умолчанию false

---
### TipsParams
TipsParams - параметры подсказок
* **hideOnEmpty** - ...
	* тип **boolean**
	* по умолчанию false
* **excludeHomeGroups** - ...
	* тип **boolean**
	* по умолчанию true

---
### WinCheck
WinCheck - ...
* **rules** - правила выигрыша
	* тип **[Win rules](#win-rules)**

---
### Preference
Preference - ...
* **title** - заголовок
	* тип **string**
* **value** - параметр по умолччанию
	* тип **var**
	* **options** - опции
		* **title** - заголовок
			* тип **string**
		* **value** - параметр
			* тип **var**

---
### Autostep
Autostep - ...
* **event** - событие по которому вызывается
	* тип **string**
* **dispatch** - событие которое генерирует по окончании
	* тип **string**

	_-- values --_

---
### Vector2d
Vector2d - ...
* **x**
	* тип **Int**
* **y**
	* тип **Int**

---
### Group
Group - группа
* **name** - имя группы
	* тип **string**
* **position** - ...
	* тип **[Vector2d](#vector2d)**
	* по умолчанию {x : 0, y : 0}
	_-- deck --_
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
Deck - ...
* **name** - имя стопки
	* тип **string**
* **position** - ...
	* тип **[Vector2d](#vector2d)**
	* по умолчанию {x : 0, y : 0}
* **paddingType** - ...
	* тип **string**
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
	* по умолчанию true
* **takeRules** - ...
	* тип **[string]**
* **putRules** - ...
	* тип **string** | **[string]**
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
* **stertZIndex** - ...
	* тип **Int**
	* по умолчанию 100
* **fill** - ...
	* тип **[string]** | **[[string]]**
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
* **around** - ...
* **beside** - ...
* **fall**   - ...

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
* **{query}** - ...
* **"allEmpty"** - ...
* **"allInOne"** - ...
* **"allAscend"** - ...
* **"allDescent"** - ...

---
## Описание структур
#### take rules names
* **not**      - ...
* **notFirst** - ...
* **any**      - ...
* **onlytop**  - ...

---
#### put rules names
* **stripped**    - ...
* **firstAce**    - ...
* **firstKing**   - ...
* **notForEmpty** - ...
* **oneRank**     - ...
* **oneSuit**     - ...
* **any**         - ...
* **not**         - ...
* **ascendDeck**  - ...
* **descentDeck** - ...
* **oneRankDeck** - ...
* **ascend**      - ...
* **descent**     - ...
* **descentOne**  - ...
* **ascendOne**   - ...
* **ascdescOne**  - ...
* **summ14**      - ...

---
#### cardnames
* suit name + rank name, like: "h" + "9" -> "h9"

---
#### suit names
* **h** - hearts
* **c** - clubs
* **d** - diamonds
* **s** - spides

---
#### ranks names
* **1...9** - cards
* **j**   - jack
* **q**   - queen
* **k**   - king
