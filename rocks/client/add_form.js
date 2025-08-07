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

async function loadRocks() {
    try {
      const response = await fetch('/api/rocks');
      const rocks = await response.json();
      
      // Clear existing list, e.g.:
      const rockList = document.getElementById('rock-list');
      rockList.innerHTML = '';
  
      // Populate list with new rocks
      rocks.forEach(rock => {
        const li = document.createElement('li');
        li.textContent = rock.name;
        rockList.appendChild(li);
      });
    } catch (err) {
      console.error('Failed to load rocks:', err);
    }
  }
  