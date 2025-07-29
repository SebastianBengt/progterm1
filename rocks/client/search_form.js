
const search_form = document.getElementById('search_form')
    search_form.addEventListener('submit', handleSearch)
    search_form.addEventListener('keyup', handleSearch)
    async function handleSearch(event){
    event.preventDefault()
    let input_elt = document.getElementById('search_term')
    let search_term = input_elt.value
    let url = "http://127.0.0.1:8090/rock/search?search_term="+ search_term
    let response = await fetch(url)
    let body = await response.text();
    let results = JSON.parse(body)
    let results_list = document.getElementById('search_results')
    results_list.innerHTML = ""
    for(let result of results){
        results_list.innerHTML += "<li>" + result.name + "</li>"
    }

}