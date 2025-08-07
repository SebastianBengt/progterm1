const add_form = document.getElementById('add_rock_form');

add_form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(add_form);

    try {
        const response = await fetch('/api/rocks', {
            method: 'POST',
            body: formData,  
        });

        const body = await response.json();
        alert(body.msg || "Rock added successfully!");
        add_form.reset();
        loadRocks(); 
    } catch (e) {
        alert("Failed to add rock: " + e.message);
    }
});

