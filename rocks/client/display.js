
document.addEventListener("DOMContentLoaded", async () => {
    const rockList = document.getElementById("rock_list");
  
    try {
      const response = await fetch("/api/rocks");
      const rocks = await response.json();
  
      rocks.forEach(rock => {
        const col = document.createElement("div");
        col.className = "col";
  
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 position-relative"; 
  
        
        if (rock.image) {
          const img = document.createElement("img");
          img.src = rock.image;
          img.className = "card-img-top";
          img.alt = rock.name;
          card.appendChild(img);
        }
  
        const body = document.createElement("div");
        body.className = "card-body";
  
        const name = document.createElement("h5");
        name.className = "card-title";
        name.textContent = rock.name;
        body.appendChild(name);
  
        card.appendChild(body);
  
        
        const details = document.createElement("div");
        details.className = "rock-details p-3 border bg-light position-absolute";
        details.style.top = "100%";
        details.style.left = "0";
        details.style.width = "100%";
        details.style.display = "none";
        details.style.zIndex = "10";
  
        
        details.innerHTML = `
          <p><strong>Type:</strong> ${rock.type || 'N/A'}</p>
          <p><strong>Color:</strong> ${rock.color || 'N/A'}</p>
          <p><strong>Grain Size:</strong> ${rock.grain_size || 'N/A'}</p>
          <p><strong>Minerals:</strong> ${rock.minerals || 'N/A'}</p>
        `;
  
        card.appendChild(details);
  
        
        card.addEventListener("mouseenter", () => {
          details.style.display = "block";
        });
        card.addEventListener("mouseleave", () => {
          details.style.display = "none";
        });
  
        col.appendChild(card);
        rockList.appendChild(col);
      });
    } catch (err) {
      console.error("Failed to load rocks:", err);
      rockList.innerHTML = `<p class="text-danger">Failed to load rocks.</p>`;
    }
  });
  
  
  