import uniqid from 'uniqid';


export default class List {
    constructor() {
        this.items = [

        ]
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        const index = this.items.findIndex(e => e.id === id);
        this.items.splice(index, 1);

    }
    
    updateCount(id, newCount) {
        this.items.find(e => e.id === id).count = newCount;
    }
}