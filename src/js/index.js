import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader} from './views/base';

/** Global state of the app
 * -Search object
 * -Current recipe object
 * -Shoping list object
 * -Liked recipes
 */
const state = {};


/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

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
    console.log(id);

    if (id) {
        // Prepare UI for changes

        // Create new recipe object
        state.recipe = new Recipe(id);

        // Get recipe data
        try {
            await state.recipe.getRecipe();
            // Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
    
            // Render recipe
            console.log(state.recipe);
        } catch (error) {
            console.log('Error happened processing recipe' + error)
        };


    };
};

 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));