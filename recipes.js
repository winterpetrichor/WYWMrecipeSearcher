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
        number: 2,
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

async function getInfo(recipeId){
    const infoUrl = "https://api.spoonacular.com/recipes/"+recipeId+"/information?";
    return fetch(infoUrl + new URLSearchParams({
        apiKey: apikey
        }), {
        })
        .then(resp => resp.json())

        .then(function(data2) {
            return data2;
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
            
            let rRow = createRecipe(element);
            textContent.appendChild(rRow);

            });
        });
    }

function createTitles(element){
    let rTitle = document.createElement("TH");
    rTitle.setAttribute("colspan", 2);
    rTitle.textContent = element.title;
    return rTitle;
}

//Combine createTitles and createImage - will need to modify updateRecipes
//Get recipe instructions


function createRecipe(element){
    //console.log(element)
    let rRow = document.createElement("TR");
    let rCell1 = document.createElement("TD");
    let rCell2 = document.createElement("TD");
    let rIngList = document.createElement("UL");
    let rImage = document.createElement("IMG");
    let rInfoLink = document.createElement("P");
    //let rInfoTxt = document.createElement("p");
    //rInfoTxt.innerHTML = "Information & Instructions";
    rInfoLink.setAttribute("id","rInfo"+element.id);
    createInfo(element.id);
    //rInfoLink.setAttribute("href",rInfo);
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

    rCell2.innerHTML = rIngList.outerHTML + rInfoLink.outerHTML;
    rRow.innerHTML = rCell1.outerHTML + rCell2.outerHTML;
    return rRow;
}

function createInfo(recipeId){
    getInfo(recipeId).then(function(data2){
        let rInfo = createInfo2(data2);

        function createInfo2(data2){
            let rInfo = document.createElement("A");
            rInfo.setAttribute("href",data2.sourceUrl);
            rInfo.setAttribute("target","_blank");
            rInfo.innerHTML = "Information & Instructions";
            rInfo.setAttribute("class","info-link");
            console.log(rInfo.outerHTML);
            return rInfo.outerHTML;
        }
        console.log(rInfo);
        var idInfo = document.getElementById("rInfo"+recipeId);
        idInfo.innerHTML=rInfo;
        });
    }