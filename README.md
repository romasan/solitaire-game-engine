#Solitaire engine documentation.

========================

*Установака зависимостей:*
	
	```
	npm install
	```

*Сборка:*

	```
	webpack
	```

###Иннициирование и запуск игры:
	
	SolitaireEngine.init(Field);

========================

*Field* - JSON обьект описания пасьянса

	*zoom* - ...

		тип float
		по умолчанию 1

	*moveDistance* - Минимальная дистанция при перемещении карты (если растояние меньше карта вернётся на своё место)

		тип Int, (px)
		по умолчанию 0,

	*inputParams* - ...

		тип InputParams

	*field* - DOM элемент страницы, который будет содержать в себе игровое поле

		тип string/CSS Selector | HTML DOM Element Object
		по умолчанию "#map"

	*theme* - Истользуемая тема оформления

		тип Theme

	*winCheck* - правила окончания игры

		тип WinCheck

	*groups* - ...

		тип {Group} | GroupGenerator

	*decks* - описание стопок...

		тип [Deck]

	*fill* - ...

		тип [string/card name] | [[string/card name]]
		примеры:
			1. ["c1", "c2", "c3"]
			2. 
				[
					["c1", "c2", "c3"],
					["c4", "c5", "c6"]
				]

	*tipsParams* - ...

		тип TipsParams


========================

*InputParams* - ...

	*doubleClick* - ... 

		тип boolean
		по умолчанию false

========================

*TipsParams* - ...
	
	*hideOnEmpty* - ...

		тип boolean
		по умолчанию false

	*excludeHomeGroups* - ...

		тип boolean
		по умолчанию true

========================

*Theme*
	
	*name* - ...

		тип string
		по умолчанию alternatibe_theme

	*spriteTexture* - ...

		тип boolean
		по умолчанию true

	*textureSuits*  - ...

		тип [string/suit name]
		по умолчанию ['d', 'c', 'h', 's']

========================

*WinCheck* :

	*rules* - ...

		тип {Win rules}

========================

*Vector2d*
	
	*x*
		тип Int
	*y*
		тип Int

========================

*Group*
	
	*name* - ...

		тип string

	*position* - ...

		тип Vector2d
		по умолчанию {x : 0, y : 0}

	-- to deck --

	*paddingType* - ...

		тип string/padding type
		по умолчанию "none"

	*paddingX* - ...

		тип Int

	*paddingY* - ...

		тип Int

	*flipPaddingX* - ...

		тип Int

	*flipPaddingY* - ...

		тип Int

	*flip* - ...

		тип string/flip type name

	*showSlot* - ...

		тип boolean

	*takeRules* - ...

		тип [string/take rule name]

	*putRules* - ...

		тип string/put rule name | [string/put rule name]

	*fillRule* - ...

		тип [string/card name]

	*autoHide* - ...

		тип boolean

	*afterStep* - ...

		тип boolean

	*actions* - ...

		тип {Object/action}

	*fill* - ...

		тип [string/card name] | [[string/card name]]

	*decks* - ...

		тип [Deck]

========================

*Deck*
	
	*name* - ...

		тип string

	*position* - ...

		тип Vector2d
		по умолчанию {x : 0, y : 0}

	*paddingType* - ...

		тип string/padding type
		по умолчанию "none"

	*paddingX* - ...

		тип Int

	*paddingY* - ...

		тип Int

	*flipPaddingX* - ...

		тип Int

	*flipPaddingY* - ...

		тип Int

	*flip* - ...

		тип string/flip type name

	*showSlot* - ...

		тип boolean
		по умолчанию true

	*takeRules* - ...

		тип [string/take rule name]

	*putRules* - ...

		тип string/put rule name | [string/put rule name]
		по умолчанию "any"

	*fillRule* - ...

		тип [string/card name]

	*autoHide* - ...

		тип boolean
		по умолчанию false

	*afterStep* - ...

		тип boolean
		по умолчанию false

	*actions* - ...

		тип {Object/action}

	*locked* - ...

		тип boolean
		по умолчанию false

	*parent* - ...

		тип string/group name

	*visible* - ...

		тип boolean
		по умолчанию true

	*groupIndex* - ...

		тип Int

	*stertZIndex* - ...

		тип Int
		по умолчанию 100

	*fill* - ...

		тип [string/card name] | [[string/card name]]

========================

*GroupGenerator* - ...
	
	*generator* :

		*type* - ...

			тип string/generator name
		
		-- values --
		
		См. group generators.

========================

###group generators:

	*count* - ...
	        -- values --
	        count - ...
	        	тип Int
	*map*   - ...
	        -- values --
	        map - ...

	        	тип [[string/card name | null]]

	        aroundRelations - ...

	        	тип boolean, по умолчанию false

	*fan*   - ...
	        -- values --
	        count - ...

	        	тип Int
	        	по умолчанию 3

	        radius - ...

	        	тип Int
	        	по умолчанию 100

	        center - ...

	        	тип Vector2d
	        	по умолчанию {x : 0, y : 0}

========================

###Win rules:
	
	*lego* : *Lego*

========================

#      ***

###take rules names:
	
	*"not"*      - ...
	*"notFirst"* - ...
	*"any"*      - ...
	*"onlytop"*  - ...

========================

###put rules names:
	
	*"stripped"*    - ...
	*"firstAce"*    - ...
	*"firstKing"*   - ...
	*"notForEmpty"* - ...
	*"oneRank"*     - ...
	*"oneSuit"*     - ...
	*"any"*         - ...
	*"not"*         - ...
	*"ascendDeck"*  - ...
	*"descentDeck"* - ...
	*"oneRankDeck"* - ...
	*"ascend"*      - ...
	*"descent"*     - ...
	*"descentOne"*  - ...
	*"ascendOne"*   - ...
	*"ascdescOne"*  - ...
	*"summ14"*      - ...

========================

###cardnames:

	suit name + rank name, like: "h" + "9" -> "h9"

========================

###flip type names:

========================

###suit names:

	*'h'* - hearts
	*'c'* - clubs
	*'d'* - diamonds
	*'s'* - spides

========================

###ranks names:

	*1...9* - cards
	*'j'*   - jack
	*'q'*   - queen
	*'k'*   - king
