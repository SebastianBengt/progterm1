const search_form = document.getElementById('search_form');
search_form.addEventListener('submit', handleSearch);
search_form.addEventListener('keyup', handleSearch);

async function handleSearch(event) {
  event.preventDefault();

  const input_elt = document.getElementById('search_term');
  const search_term = input_elt.value.trim();

  try {
    let url;
    if (search_term === '') {
      url = 'http://127.0.0.1:8090/api/rocks'; 
    } else {
      url = `http://127.0.0.1:8090/rock/search?search_term=${encodeURIComponent(search_term)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const results = await response.json();

    // Instead of showing names in a list, update the rock display grid
    const rockList = document.getElementById('rock_list');
    rockList.innerHTML = ''; // clear current display

    for (const rock of results) {
      // Create card container div
      const col = document.createElement('div');
      col.className = 'col';

      // Create card div
      const card = document.createElement('div');
      card.className = 'card shadow-sm h-100';

      // Add image if present
      if (rock.image) {
        const img = document.createElement('img');
        img.src = rock.image;
        img.className = 'card-img-top';
        img.alt = rock.name;
        card.appendChild(img);
      }

      // Card body with rock name
      const body = document.createElement('div');
      body.className = 'card-body';

      const name = document.createElement('h5');
      name.className = 'card-title';
      name.textContent = rock.name;
      body.appendChild(name);

      card.appendChild(body);
      col.appendChild(card);
      rockList.appendChild(col);
    }

  } catch (err) {
    console.error("Search failed:", err);
  }
}

