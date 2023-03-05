/*
    Author: winterpetrichoir
    This is the JS for the recipe project
*/

//when the search button is clicked
//retrieve the recipes based on the ingredients in the search box

//API access key
const apikey = "b05f5f279c4347eb918cd4f0851149ab";
//number of recipes to display
//limited to reduce API points used each refresh and test
const numberRecipes = 2
//get DOM elements from html id's
const textContent = document.getElementById("recipe-results");
const recipeSearch = document.getElementById("recipe-search");
const recipePanel = document.getElementById("recipe-panel");
//searchtype var for random or by ingredient
var searchType = "";

//API query - get recipes matching ingredients
async function getRecipes(searchText){
    const recipeUrl = "https://api.spoonacular.com/recipes/findByIngredients?";
    searchType = "ingred";
    //Pass parameters to API URL
    return fetch(recipeUrl + new URLSearchParams({
        apiKey: apikey,
        ingredients: searchText,
        ignorePantry: false,
        number: numberRecipes,
        }), {
        })
        //interpret response as json
        .then(resp => resp.json())
        //return response
        .then(function(data) {
            //if response is empty, then error message
            if(data.length == 0) {
                window.alert("No ingredients found! \n" +
             "Check your internet connection or search query for spelling errors");
                recipePanel.setAttribute("class", "");
                }
            return data;
        })
        //catch api errors
        .catch(function(error) {
            console.log(error);
            genericError();
        });
}

//API query - get original recipe url
async function getInfo(recipeId){
    const infoUrl = "https://api.spoonacular.com/recipes/"+recipeId+"/information?";
    //Pass parameters to API URL
    return fetch(infoUrl + new URLSearchParams({
        apiKey: apikey
        }), {
        })
        //interpret response as json
        .then(resp => resp.json())
        //return response
        .then(function(data) {
            return data;
        })
        //catch api errors
        .catch(function(error) {
            console.log(error);
            genericError();
        });
}

//API query - get random recipes
async function getRandRecipe(){
    const infoUrl = "https://api.spoonacular.com/recipes/random?";
    searchType = "rand";
    //Pass parameters to API URL
    return fetch(infoUrl + new URLSearchParams({
        apiKey: apikey,
        number: numberRecipes,
        }), {
        })
        //interpret response as json
        .then(resp => resp.json())
        //return response
        .then(function(data) {
            return data.recipes;
        })
        //catch api errors
        .catch(function(error) {
            console.log(error);
            genericError();
        });
}

//API query - get nutrition card
async function getNutr(recipeId){
    const infoUrl = "https://api.spoonacular.com/recipes/"+recipeId+"/nutritionWidget.png?";
    return fetch(infoUrl + new URLSearchParams({
        apiKey: apikey
        }), {
        })
        //skip json interpretation for png image
        //.then(resp => resp.json())
        //return response
        .then(function(data) {
            return data.url;
        })
        //catch api errors
        .catch(function(error) {
            console.log(error);
            genericError();
        });
}

//API query - get price card
async function getPrice(recipeId){
    const infoUrl = "https://api.spoonacular.com/recipes/"+recipeId+"/priceBreakdownWidget.png?";
    return fetch(infoUrl + new URLSearchParams({
        apiKey: apikey
        }), {
        })
        //skip json interpretation for png image
        //.then(resp => resp.json())
        //return response
        .then(function(data) {
            return data.url;
        })
        //catch api errors
        .catch(function(error) {
            console.log(error);
            genericError();
        });
}

//API query - get numerical price data
async function getActualPrice(recipeId){
    const infoUrl = "https://api.spoonacular.com/recipes/"+recipeId+"/priceBreakdownWidget.json?";
    //Pass parameters to API URL
    return fetch(infoUrl + new URLSearchParams({
        apiKey: apikey
        }), {
        })
        //interpret response as json
        .then(resp => resp.json())
        //return response
        .then(function(data) {
            return data;
        })
        //catch api errors
        .catch(function(error) {
            console.log(error);
            genericError();
        });
}

//ingredient search update recipe table function
function nonRandRecipe(){
    searchType = "ingred";
    updateRecipes()
}

//random update recipe table function
function randomRecipe(){
    searchType = "rand";
    updateRecipes()
}

//main update recipe api trigger function
function updateRecipes(){
    //clear text for new search (e.g. after performing a previous search)
    textContent.innerHTML = "";
    //get search terms
    if(searchType==="ingred"){
        var searchText = document.getElementById("recipe-search").value;
    }
    //show recipe panel
    recipePanel.setAttribute("class", "recipe-panel");
    //main table structure, if's for random or ingredient selected
    if(searchType==="ingred"){
        getRecipes(searchText).then(function(data){
            dataForEachElement(data)
            });
    }
    if(searchType==="rand"){
        getRandRecipe().then(function(data){
            dataForEachElement(data)
            });
    }
}

//main update recipe table function
function dataForEachElement(data){
    data.forEach(element => {
        let rTitle = createTitles(element);
        textContent.appendChild(rTitle);
        let rRow = createRecipe(element);
        textContent.appendChild(rRow);
        let rInfoRow = createInfos(element);
        textContent.appendChild(rInfoRow);
        });
}

//create table headers and get info from API response
function createTitles(element){
    let rTitle = document.createElement("TH");
    rTitle.setAttribute("colspan", 2);
    rTitle.textContent = element.title;
    return rTitle;
}

//create table rows, cells and parse info from API response
function createRecipe(element){
    let rRow = document.createElement("TR");
    let rCell1 = document.createElement("TD");
    let rCell2 = document.createElement("TD");
    let rIngredients = document.createElement("P");
    let rIngList = document.createElement("UL");
    let rImage = document.createElement("IMG");
    //create line for recipe link and tag with recipe id for update later
    rImage.setAttribute("src", element.image);
    //for resizeable image:
    rImage.setAttribute("class", "img-container");
    rIngredients.setAttribute("class","ingred-title");
    rIngredients.innerHTML = "Ingredients";
    rCell1.innerHTML = rImage.outerHTML;
    //parse ingredients, random or search by ingredients
    if(searchType === "rand"){
        element.extendedIngredients.forEach(ing => {
            rIngList.appendChild(renderIngredient(ing));
        });}
    else{
        element.usedIngredients.forEach(ing => {
            rIngList.appendChild(renderIngredient(ing));
        });
        element.missedIngredients.forEach(ing => {
            rIngList.appendChild(renderIngredient(ing));
        });
    }
    
    //create ingredient list, bold units 
    //(common mistake point when cooking, for me anyway XD )
    function renderIngredient(ing) {
        let rIngListItem = document.createElement("LI");
        rIngListItem.innerHTML=ing.amount + " <b>" + ing.unit + "</b> " + 
        ing.originalName;
        return rIngListItem;
    }
    //put it all together and return
    rCell2.innerHTML = rIngredients.outerHTML + rIngList.outerHTML;
    rRow.innerHTML = rCell1.outerHTML + rCell2.outerHTML;
    return(rRow);
}

//function to contain pricing and nutrition buttons
// as well as and structure information returned 
//from pricing and nutrition buttons
function createInfos(element){
    let rInfoRow = document.createElement("TR");
    let rInfoCell = document.createElement("TD");
    let rInfoLink = document.createElement("P");
    rInfoCell.setAttribute("colspan",2);
    rInfoCell.innerHTML = rInfoLink.outerHTML;
    
    rInfoLink.setAttribute("id","rInfo"+element.id);
    createInfo(element.id);
    rInfoCell.innerHTML = rInfoLink.outerHTML;
    rInfoRow.innerHTML = rInfoCell.outerHTML;
    return(rInfoRow);
}

//API request using id's of recipes returned from first API 
//request to get original recipe URL
function createInfo(recipeId){
    getInfo(recipeId).then(function(data){
        let rInfo = createInfo2(data);
        function createInfo2(data){
            //instructions button
            let rInfo = document.createElement("INPUT");
            linkButton(rInfo,"Information & Instructions",data);
            //nutrition button
            let rNutInfo = document.createElement("INPUT");
            infoButton(rNutInfo,"Nutrition Information",data,"nutr");
            //estimated pricing button
            let rPriceInfo = document.createElement("INPUT");
            infoButton(rPriceInfo,"Estimated Pricing",data,"price");
            //info divs
            let rNutInfoDiv = document.createElement("DIV");
            rNutInfoDiv.setAttribute("id","nutInfoDiv"+data.id);
            let rPriceInfoDiv = document.createElement("DIV");
            rPriceInfoDiv.setAttribute("id","priceInfoDiv"+data.id);
            //display info buttons
            rInfoReturn = rInfo.outerHTML + " " + 
            rNutInfo.outerHTML + " " + 
            rPriceInfo.outerHTML + " " + 
            rNutInfoDiv.outerHTML + "<br>" + 
            rPriceInfoDiv.outerHTML;
            
            return rInfoReturn;
        }
        //update links by ID
        var idInfo = document.getElementById("rInfo"+recipeId);
        idInfo.innerHTML=rInfo;
        });
}

//link button function - creates button
function linkButton(item, label, data){
    item.setAttribute("class", "recipe-buttons");
    item.setAttribute("type", "button");
    item.setAttribute("value", label);
    item.setAttribute("onclick", "openInNewTab('"+data.sourceUrl+"');");
}

//link function - allows button onClick to open link in a new tab
//I used a button here instead of a regular hyperlink as a style choice
function openInNewTab(url) {
    window.open(url, '_blank').focus();
}

//info function for buttons - creates pricing and nutrition buttons
//also provides a pass through for recipe id
function infoButton(item, label, data, datatype){
    item.setAttribute("class", "recipe-buttons");
    item.setAttribute("type", "button");
    item.setAttribute("value", label);
    item.setAttribute("onclick", "displayInfo(\""+datatype+"\","+data.id+")");
}

//info function - get actual price and nutrition images
//decided to try to do this dynamically based on which button was pressed
//since the two functions (when I did them separately)
//had so much in common
//async function used to await return from secondary API calls within this function
async function displayInfo(datatype,dataid) {
    //vars instead of lets for if's
    var rInfoImageSrc = "";
    var imageDiv = "";
    var rActualPrice = "";
    var rActualPricePerServing = "";
    var rPriceData = "";
    //get nutrition image
    if(datatype === "nutr"){
        tag = "nutrImg";
        rInfoImageSrc = await getNutr(dataid);
        imageDiv = document.getElementById("nutInfoDiv"+dataid);
        rPriceText = "";
    }
    //get price image and price numerical data
    //the spoonacular API showed a much more informative price image
    //than what is actually provided through the API
    //not sure if I missed something, but had to add the numerical
    //API call after the fact, because that pie chart alone
    //was not very informative
    if(datatype === "price"){
        tag = "priceImg";
        rInfoImageSrc = await getPrice(dataid);
        rPriceData = await getActualPrice(dataid);
        rActualPrice = rPriceData.totalCost;
        rActualPricePerServing = rPriceData.totalCostPerServing;
        imageDiv = document.getElementById("priceInfoDiv"+dataid);
        rPriceText = "<br>" +
        "Total Price: $"+Math.round(rActualPrice)/100 + " USD <br>" +
        "Price per Serving: $"+Math.round(rActualPricePerServing)/100 + " USD";
    }
    //I acknowledge that the image url shown in developer mode (F12)
    //includes the api key... this seems insecure, but looking at 
    //workarounds seems a bit advanced for where I'm right now
    //so I've left it as is.
    //If you've read this comment and can explain a good, simple way
    //that I might have missed, please reach out, thank you!
    rInfoImage = getInfoImage(tag);
    rInfoImage.setAttribute("src",rInfoImageSrc);
    //for resizeable image:
    rInfoImage.setAttribute("class", "img-container");
    //put it all together
    imageDiv.innerHTML = rInfoImage.outerHTML + rPriceText;
}
    
//get nutrition and pricing images based on 'tag' 
//tag is - price or nutrition, dictated by which buttons is pressed
function getInfoImage(tag){
    var rInfoImage = document.getElementById(tag);
    if(rInfoImage === null){
        var rInfoImage = document.createElement("IMG");
        rInfoImage.setAttribute("id",tag);
    }else{
        rInfoImage = document.getElementById(tag);
        rInfoImage.setAttribute("src","");
    }
    return(rInfoImage)
    
}

//generic API error
function genericError(){
    window.alert("There has been an API error. \n\n" +
    "Please : \n" +
    " - check your internet connection.\n" +
    " - see if you can access https://api.spoonacular.com.\n" +
    " - contact the developer at https://github.com/winterpetrichor.\n"
    );
}
