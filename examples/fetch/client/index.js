window.addEventListener('click', async function(event){
  try{
    let response = await fetch('http://127.0.0.1:8090/list')
    if(response.ok){
    let body = await response.text()
    document.getElementById('content').innerHTML=body
    }
    else{
      this.alert("fool of a took")
    }
  } catch(e) {
      alert(e)
  }
});
