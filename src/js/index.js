import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader} from './views/base';
import Likes from './models/Likes';

/** Global state of the app
 * -Search object
 * -Current recipe object
 * -Shoping list object
 * -Liked recipes
 */
const state = {};


/**
 * Ex. 8/12
 * 
 */



/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get query from view
    /**
     * USE THIS INSTEAD AFTER TESTING!!!!!!!!!!!
     */  
    const query = searchView.getInput();

    /**
     * FOR TESTING ONLY!!!!
     */
    // const query = 'pizza';
    //////////////////////////////////////
    //////////////////////////////////////

    if(query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        searchView.clearResPages();
        renderLoader(elements.searchRes);

        // 4) Search for recipes
        try {
            await state.search.getResults();
    
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result)
        } catch(error) {
            console.log('something wrong with the search...')
            clearLoader();
        };
    };
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

/**
 * FOR TESTING ONLY
 */
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

/////////////////////////////////////
////////////////////////////////////

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResPages();
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearResults();
        renderLoader(elements.recipe);

        if (state.search) searchView.highlightSelected(id);

        

        // Create new recipe object
        state.recipe = new Recipe(id);

        //Testing!!!!!!!!!!!
        // window.r = state.recipe;

        // Get recipe data and parse ingredients
        try {
            await state.recipe.getRecipe();
            // console.log(state.recipe);
            // Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            state.recipe.parseIngredients();
            
            // console.log(state.recipe);
            
            
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe)
        } catch (error) {
            console.log('Error happened processing recipe' + error)
        };


    };
};

 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

 




 /**
  * LIKE CONTROLLER
  */
 const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    //User has NOT yet liked recipe
    if (!state.likes.isLiked(currentID)) {
        //Add like to the state
        //id, title, author, img
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button

        // Add like to UI list
        console.log(state.likes)

    //User HAS liked recipe
    } else {
        //Remove like from the state
        state.likes.deleteLike(currentID);
        //Toggle the like button

        // Remove like from UI list
        console.log(state.likes)
    }
 };


 /**
  * SHOPPING LIST CONTROLLER
  */

 elements.shopping.addEventListener('click', e => {
    //Delete recipe Item
     if (e.target.matches('.shopping__delete *')) {
         //Find the item's ID
         state.list.deleteItem(e.target.closest('.shopping__item').dataset.itemid);
        //Clear the UI
        elements.shopping.innerHTML = '';
        state.list.checkForDuplicates();
        //Re-populate the UI with new list items
        state.list.items.forEach(e => {
            listView.renderItem(e);
         });
     }
 });

 //update count
 elements.shopping.addEventListener('change', (e) => {
     const itemId = e.target.parentElement.parentElement.dataset.itemid;
     const value = parseFloat(e.target.value, 10);
     if (value >= 0) {
         state.list.updateCount(itemId, value);
     } else if (value < 0) {
         e.target.value = 0;
     };
 });

  //Handling recipe button clicks
  elements.recipe.addEventListener('click', e => {
    
    if (e.target.matches('.btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
       // Decrease button is clicked
    } else if (e.target.matches('.btn-increase *')) {
       // Increase button is clicked
       state.recipe.updateServings('inc');
       recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add *')) {
       if(!state.list){
           state.list = new List();
       }
        //Add to shopping cart
       //  console.log(state.recipe);
        //Clear the UI
        elements.shopping.innerHTML = '';
        state.recipe.ingredients.forEach(e => {
            state.list.addItem(e.count, e.unit, e.ingredient);
        });
        //Check for duplicates
        state.list.checkForDuplicates();
     
        state.list.items.forEach(e => {
           listView.renderItem(e);
        });
    } else if(e.target.matches('.recipe__love *')) {
        //Like controller
        controlLike();
    }

});
     

// window.l = new List();