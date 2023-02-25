const url = "https://api.spoonacular.com/recipes/findByIngredients?";
var ingred = "apple, banana"
fetch(url + new URLSearchParams({
    ingredients: ingred,
    number: 2,
    }), {
  
    //method: "GET",
    withCredentials: true,
    headers: {
        "x-api-key": "b05f5f279c4347eb918cd4f0851149ab",
        "Content-Type": "application/json"
        },  
    })
    .then(resp => resp.json())
    .then(function(data) {
        console.log(data);
    })
    .catch(function(error) {
        console.log(error);
});