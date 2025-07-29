const search_button = document.getElementById("extract_data")

search_button.addEventListener('click', function(event){
    let input_elt = document.getElementById('search_term')

    alert("button clicked " + input_elt.value)

})

const search_form = document.getElementById('search_form')
search_form.addEventListener('submit', function(){
    let input_elt = document.getElementById('search_term')
    let search_term = input_elt.value
    alert("button clicked " + input_elt.value)

})