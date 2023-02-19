/*
    Author: winterpetrichoir
    This is the JS for the recipe project
*/

//when the search button is clicked
//retrieve the recipes based on the ingredients in the search box

const apikey = "b05f5f279c4347eb918cd4f0851149ab";
//get DOM elements from html id's
const textContent = document.getElementById("recipe-results");
const recipeSearch = document.getElementById("recipe-search");
const recipePanel = document.getElementById("recipe-panel");

//API query
async function getRecipes(searchText){
    const recipeUrl = "https://api.spoonacular.com/recipes/findByIngredients?";
    
    return fetch(recipeUrl + new URLSearchParams({
        apiKey: apikey,
        ingredients: searchText,
        ignorePantry: false,
        number: 5,
        }), {

        })
        .then(resp => resp.json())
        
        .then(function(data) {
            //if response is empty, then error message
            if(data.length == 0) {
                window.alert("No ingredients found! \n" +
             "Check your internet connection or search query for spelling errors");
                recipePanel.setAttribute("class", "");
                }
            return data;
        })
        .catch(function(error) {
            console.log(error);
        });
}

function updateRecipes(){
    textContent.innerHTML = "";
    var searchText = document.getElementById("recipe-search").value;
    recipePanel.setAttribute("class", "panel");
    getRecipes(searchText).then(function(data){
        //update recipe-results
        data.forEach(element => {
            let rTitle = createTitles(element);
            textContent.appendChild(rTitle);
            
            let rRow = createImage(element);
            textContent.appendChild(rRow);
        });
        })

    }

function createTitles(element){
    let rTitle = document.createElement("TH");
    rTitle.setAttribute("colspan", 2);
    rTitle.textContent = element.title;
    return rTitle;
}

//Combine createTitles and createImage - will need to modify updateRecipes
//add rCell2 with available and missing ingredients and quantities


function createImage(element){
    //console.log(element)
    let rRow = document.createElement("TR");
    let rCell1 = document.createElement("TD");
    let rCell2 = document.createElement("TD");
    let rIngList = document.createElement("UL");
    
    let rImage = document.createElement("IMG");
    var ingredText = "";
    rImage.setAttribute("src", element.image);
    rCell1.innerHTML = rImage.outerHTML;
    element.usedIngredients.forEach(ing => {
        rIngList.appendChild(renderIngredient(ing));
    });
    element.missedIngredients.forEach(ing => {
        rIngList.appendChild(renderIngredient(ing));
    });

    function renderIngredient(ing) {
        let rIngListItem = document.createElement("LI");
        //ingredText = ingredText.concat(ing.amount, ing.unit, ing.originalName);
        rIngListItem.innerHTML=ing.amount + " <b>" + ing.unit + "</b> " + ing.originalName
        return rIngListItem;
    }

    rCell2.innerHTML = rIngList.outerHTML;
    rRow.innerHTML = rCell1.outerHTML + rCell2.outerHTML;
    return rRow;
}

