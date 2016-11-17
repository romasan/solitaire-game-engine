# Solitaire engine documentation.
**Установака зависимостей:**
	npm install
**Сборка:**
	npm run build
**Отладка:**
	npm run dev
**Иннициирование и запуск игры:**

	SolitaireEngine.init\([Field](#field)\);

---
### Field
	Field - JSON обьект описания пасьянса
	    zoom - масштабирование
			тип float
	        по умолчанию 1
	    moveDistance - мимальная дистанция при перемещении карты (если растояние меньше карта вернётся на своё место)
			тип Int, (px)
			по умолчанию 0,
		inputParams - ...
			тип [InputParams](#inputparams)
		field - элемент страницы, который будет содержать в себе игровое поле
			тип string/CSS Selector | HTML DOM Element Object
			по умолчанию "#map"
		winCheck - правила окончания игры
			тип [WinCheck](#wincheck)
		autoSteps - ...
			тип \[[Autostep](#autostep)\]
		groups - группы
			тип [Group](#group) | GroupGenerator
		decks - стопки
			тип \[[Deck](#deck)\]
		fill - ...
			тип [string/card name] | [[string/card name]]
			примеры:
			1)
			["c1", "c2", "c3"]
			2)
			[
				["c1", "c2", "c3"],
				["c4", "c5", "c6"]
			]
		tipsParams - ...
			тип [TipsParams](#tipsparams)
		startZIndex - ...
		animationTime - ...
		preferences - пользовательские настройки
			тип [Preference](#preference)
---
### InputParams
	InputParams - параметры убравления (мышь)
		doubleClick - ... 
			тип boolean
			по умолчанию false
---
### TipsParams
	TipsParams - параметры подсказок
		hideOnEmpty - ...
			тип boolean
		по умолчанию false
		excludeHomeGroups - ...
			тип boolean
			по умолчанию true
---
### WinCheck
	WinCheck :
	   rules - правила выигрыша
	       тип {Win rules}
---
### Preference
	Preference
		title - заголовок
			тип string
		value - параметр по умолччанию
			тип var
		options - опции
			title - заголовок
				тип string
			value - параметр
				тип var
---
### Autostep
	Autostep
		event - событие по которому вызывается
			тип string
		dispatch - событие которое генерирует по окончании
			тип string
		_-- values --_
---
### Vector2d
	Vector2d
	   x
		   тип Int
	   y
		   тип Int
---
### Group
	Group - группа
	   name - имя группы
		   тип string
	   position - ...
		   тип [Vector2d](#vector2d)
	       по умолчанию {x : 0, y : 0}
	   _-- deck --_
	   paddingType - ...
		   тип string/padding type
	       по умолчанию "none"
	   paddingX - ...
		   тип Int
	   paddingY - ...
		   тип Int
	   flipPaddingX - ...
		   тип Int
	   flipPaddingY - ...
	       тип Int
	   flip - ...
		   тип string/flip type name
	   showSlot - ...
		   тип boolean
		takeRules - ...
		   тип [string/take rule name]
		putRules - ...
		   тип string/put rule name | [string/put rule name]
		fullRules - ...
		   тип [string/card name]
		autoHide - ...
		   тип boolean
		actions - ...
		   тип Action
		fill - ...
		   тип [string/card name] | [[string/card name]]
		decks - ...
		   тип [Deck]
		tags - ...
		    тип [string]
---
### Deck
	Deck
		name - имя стопки
			тип string
		position - ...
			тип Vector2d
			по умолчанию {x : 0, y : 0}
		paddingType - ...
			тип string/padding type
			по умолчанию "none"
		paddingX - ...
			тип Int
		paddingY - ...
			тип Int
		flipPaddingX - ...
			тип Int
		flipPaddingY - ...
			тип Int
		flip - ...
			тип string/flip type name
		showSlot - ...
			тип boolean
			по умолчанию true
		takeRules - ...
			тип [string/take rule name]
			putRules - ...
			тип string/put rule name | [string/put rule name]
			по умолчанию "any"
		fullRules - ...
			тип [string/card name]
			autoHide - ...
			тип boolean
			по умолчанию false
		actions - ...
			тип Action
			locked - ...
			тип boolean
			по умолчанию false
		parent - ...
			тип string/group name
		visible - ...
			тип boolean
			по умолчанию true
		groupIndex - ...
			тип Int
		stertZIndex - ...
			тип Int
			по умолчанию 100
		fill - ...
			тип [string/card name] | [[string/card name]]
		relations - связи с другими стопками
			тип [Relation]
---
### Relation
	Relation - связь с другими стопками
		_См. deck relations._
---
### GroupGenerator
	GroupGenerator - ...
		generator :
			type - ...
				тип string/generator name
			_-- values --_
				_См. group generators._
---
### Deck relations:
		around - ...
		beside - ...
		fall   - ...
---
### Group generators:
		count - ...
			_-- values --_
			count - ...
				тип Int
		map   - ...
		_-- values --_
			map - ...
				тип [[string/card name | null]]
			aroundRelations - ...
				тип boolean
				по умолчанию false
		fan   - ...
			_-- values --_
			count - ...
				тип Int
				по умолчанию 3
			radius - ...
				тип Int
				по умолчанию 100
			center - ...
				тип Vector2d
				по умолчанию {x : 0, y : 0}
---
### Win rules:
		lego : Lego //TODO
---
## Описание структур:
	take rules names:
		"not"      - ...
		"notFirst" - ...
		"any"      - ...
		"onlytop"  - ...
---
	put rules names:
		"stripped"    - ...
		"firstAce"    - ...
		"firstKing"   - ...
		"notForEmpty" - ...
		"oneRank"     - ...
		"oneSuit"     - ...
		"any"         - ...
		"not"         - ...
		"ascendDeck"  - ...
		"descentDeck" - ...
		"oneRankDeck" - ...
		"ascend"      - ...
		"descent"     - ...
		"descentOne"  - ...
		"ascendOne"   - ...
		"ascdescOne"  - ...
		"summ14"      - ...
---
	cardnames:
		suit name + rank name, like: "h" + "9" -> "h9"
---
	flip type names:
---
	suit names:
		'h' - hearts
		'c' - clubs
		'd' - diamonds
		's' - spides
---
	ranks names:
	   1...9 - cards
	   'j'   - jack
	   'q'   - queen
	   'k'   - king
