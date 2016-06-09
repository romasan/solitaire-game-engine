# Solitaire engine documentation.
**Установака зависимостей:**
	npm install
**Сборка:**
	npm run build
или если установлен webpack в корне выполнить:
	webpack
**Иннициирование и запуск игры:**

	SolitaireEngine.init(Field);

пример:

```
{
	winCheck : {
        rules : ["allInOne"]
    },
    decks : [
        {
            name: "deck1",
            position: {
                x: 100,
                y: 100
            },
            takeRules: ["any"],
            putRules: ["not"],
            fill: ["c1", "c2"]
        },
        {
            name: "deck2",
            position: {
                x: 200,
                y: 100
            },
            takeRules: ["any"],
            putRules: ["not"],
            fill: ["c3", "c4"]
        },
        {
            name: "deck3",
            position: {
                x: 300,
                y: 100
            },
            takeRules: ["not"],
            putRules: ["any"],
            fill: ["c5", "c6"]
        },
    ]
}
```
---
	Field - JSON обьект описания пасьянса
	    zoom - масштабирование
			тип float
	        по умолчанию 1
	    moveDistance - мимальная дистанция при перемещении карты (если растояние меньше карта вернётся на своё место)
			тип Int, (px)
			по умолчанию 0,
		inputParams - ...
			тип InputParams
		field - элемент страницы, который будет содержать в себе игровое поле
			тип string/CSS Selector | HTML DOM Element Object
			по умолчанию "#map"
<!-- 		theme - Истользуемая тема оформления
			тип Theme -->
		winCheck - правила окончания игры
			тип WinCheck
		groups - группы
			тип {Group} | GroupGenerator
		decks - стопки
			тип [Deck]
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
			тип TipsParams
---
	InputParams - параметры убравления (мышь)
		doubleClick - ... 
			тип boolean
			по умолчанию false
---
	TipsParams - параметры подсказок
		hideOnEmpty - ...
			тип boolean
		по умолчанию false
		excludeHomeGroups - ...
			тип boolean
			по умолчанию true
---
<!-- 	Theme
	   name - ...
		   тип string
		   по умолчанию "alternative_theme"
	   spriteTexture - ...
		   тип boolean
		   по умолчанию true
	   textureSuits  - ...
		   тип [string/suit name]
	       по умолчанию ['d', 'c', 'h', 's'] -->
---
	WinCheck :
	   rules - правила выигрыша
	       тип {Win rules}
---
	Vector2d
	   x
		   тип Int
	   y
		   тип Int
---
	Group - группа
	   name - имя группы
		   тип string
	   position - ...
		   тип Vector2d
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
		fillRule - ...
		   тип [string/card name]
		autoHide - ...
		   тип boolean
	   afterStep - ...
		   тип boolean
	   actions - ...
		   тип {Action}
	   fill - ...
		   тип [string/card name] | [[string/card name]]
	   decks - ...
		   тип [Deck]
---
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
	   fillRule - ...
		   тип [string/card name]
	   autoHide - ...
		   тип boolean
		   по умолчанию false
	   afterStep - ...
		   тип boolean
		   по умолчанию false
	   actions - ...
		   тип {Action}
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
---
	GroupGenerator - ...
	   generator :
			type - ...
			   тип string/generator name
		   _-- values --_
			_См. group generators._
---
	group generators:
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
	Win rules:
	   lego : Lego //TODO
---
**Описание структур:**
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
