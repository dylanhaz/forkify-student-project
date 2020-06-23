import axios from 'axios'
import { convertDecimalToFraction, splitFraction } from '../scripts/mathCustom';


//FOR TESTING
// let numServings = 3;



export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(')
        }
    }

    calcTime() {
        //Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 1;
    }

    
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'tsps', 'cups', 'pounds', 'tbsp', 'tbsp', 'oz', 'oz', 'tsps', 'tsp', 'tsps', 'cup', 'pound'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsps', 'tsp', 'tsps', 'cup', 'pound', 'tbsp', 'tbsp', 'oz', 'oz', 'tsps', 'tsp', 'tsps', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']

        const newIngredients = this.ingredients.map(el => {
            //Remove whitespace from begining and end
            el = el.trim();
            // let ingredient = el.replace(/^[^\s].+[^\s]$/, '');
            
            // Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, units[i]);
            });
            // Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');


            // parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            
            let objIng;
            if (unitIndex > 0) {
                
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2];
                // Ex. 4 cups, arrCount is [4];
                
                
                
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;

                //check if recipe uses a dash for the count
                //HARDCODED!!!!!!!!! Not for production use
                if(arrIng[0] === "1-2") arrIng[0] = "2";



                // console.log(arrCount, arrIng)
                //check if arrCount is a number like ['3'] or [2-1/2]
                if (arrCount.length === 1) {
                    
                    //check if the string contains a dash, if so it needs to be seperated from the fraction
                    if (arrIng[0].includes('-')) {
                        
                        //split the fraction 
                        let splitNum;
                        splitNum = arrIng[0].split('-');
                        //conver the fraction part into a decimal
                        splitNum[1] = splitFraction(splitNum[1]);
                        // replace the new value into the original ingredients array
                        arrIng[0] = parseInt(splitNum[0]) + splitNum[1];
                    }
                    arrIng[0] = parseInt(arrIng[0]);
                    //display to UI as a fraction instead of decimal
                    count = arrIng[0];
                    
                    /**
                     * This is where you can change the number of servings. (Ex. count *= 2)
                     */
                    
                    // count *= numServings;


                    // count = convertDecimalToFraction(count);


                } else {
                    // if already seperated, (Ex. ['2', 3/4, 'cup']), move number and fraction into their own var
                    count = arrIng.slice(0, unitIndex).join('%%%');
                    count = count.split('%%%');
                    //parse the whole number
                    count[0] = parseInt(count[0]);
                    //conver the fraction half into a decimal
                    count[1] = splitFraction(count[1]);
                    //join the two together
                    count = count[0] + count[1]

                    /**
                     * This is where you can change the number of servings. (Ex. count *= 2)
                     */

                    // count *= numServings;
                    
                    //display to UI as a fraction instead of decimal
                    // count = convertDecimalToFraction(count);
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            } else if (parseInt(arrIng[0], 10)) {
                //There is NO unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };

            } else if (unitIndex === 0) {
                //Unit is in 1st position
                objIng = {
                    count: 1,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(1).join(' ')
                };

            } else if (unitIndex === -1) {
                //There is NO unit and no Number in 1st position
                objIng = {
                    count: '',
                    unit: '',
                    ingredient
                };
            }
            return objIng;

            // return ingredient;

        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        console.log(type);

        const newServings = type === 'dec' ? this.servings -1 : this.servings +1;

        // this.servings = newServings;
        //ingredients
        this.ingredients.forEach(ing => {
            // console.log(ing.count)
            if(ing.count) {
                
                ing.count *= (newServings / this.servings);
                
                console.log(ing.count);
                // ing.count = convertDecimalToFraction(ing.count)
            }
        });

        this.servings = newServings;
        // console.log(this.servings)

    }
}