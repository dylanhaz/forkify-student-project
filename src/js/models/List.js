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

    checkForDuplicates () {
        const valueArr = this.items.map(item => item.ingredient);
        let countArr = [];
        countArr = this.items.map(item => {
            if (item.count === "") {
                item.count = 0;
            }
            return item.count;
        });
        valueArr.some((item, index) => {
            if (valueArr.indexOf(item) !== index) {
                const firstItemIndex = valueArr.indexOf(item);
                const newNumber = countArr[firstItemIndex] + countArr[index];
                this.items[firstItemIndex].count = newNumber;
                this.items.splice(index, 1);
                this.checkForDuplicates();
            };
            
        });
    }

    deleteItem (id) {
        const index = this.items.findIndex(e => e.id === id);
        this.items.splice(index, 1);

    }
    
    updateCount(id, newCount) {
        this.items.find(e => e.id === id).count = newCount;
    }
}