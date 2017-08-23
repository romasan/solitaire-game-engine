'use strict';

// Draw

class Draw {

    constructor(element) {
        this.element = element;
    }

    render(e) {
        this.element.innerHTML += e.draw();
    }

    static nexId() {
        this.nexId = (e => () => e++)(1);
        return this.nexId();
    }
}

class DrawModel {

    constructor(model) {
        this.model = model;
    }

    draw() {

        let _data = '';

        for(let name in model) {
            this.model[name].name = name;
            _data += this.model[name].draw();
        }

        return _data;
    }
}

class DrawLine {

    constructor() {
        this.name = '';
        this.id = 
    }

    draw(data) {
        return `<div>
            <span>${this.name}</span>
            <span>${data}</span>
        </div>`;
    }
}

// Types
// class _Enum {
    
//     constructor(...types) {
//         this.types = types;
//     }
// }

class _String extends DrawLine {

    constructor(data) {
        this.data = data;
        this.id = 
    }

    draw() {
        data = `<input />`;
        return super.draw(data);
    }
}

class _Array extends DrawLine {

    constructor(type) {

        this.type = type;
        this.data = [];
    }

    add(data) {

        this.data.push( new this.type(data) );
        return this;
    }

    draw() {
        let data = '';
        for(line of this.data) {
            data += line.draw();
        }
        data += `<button data-button="">+</button>`;
        return super.draw(data);
    }
}

class _List {
    
    constructor(type) {

        this.type = type;
        this.data = {};
    }

    add(name, data) {

        this.data[name] = new this.type(data);
        return this;
    }
}

let Model = {
    "Value_1" : new _String(),
    "Value_2" : new _Array(_String),
    "Value_2" : new _List(_String),
}

new Draw( document.getElementById('panel_1') ).render(
    new DrawModel(Model)
);