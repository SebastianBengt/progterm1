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
      card.dataset.rockId = rock.id; // store rock ID

      // Only show image and name initially
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

      // Placeholder for rock details (will be filled on hover)
      const details = document.createElement("div");
      details.className = "rock-details p-3 border bg-light position-absolute";
      details.style.top = "100%";
      details.style.left = "0";
      details.style.width = "100%";
      details.style.display = "none";
      details.style.zIndex = "10";

      card.appendChild(details);

      // On hover, fetch details via API
      let detailsFetched = false;
      card.addEventListener("mouseenter", async () => {
        if (detailsFetched) {
          details.style.display = "block";
          return;
        }

        try {
          const rockId = card.dataset.rockId;
          const detailResponse = await fetch(`/api/rocks/${rockId}`);
          const fullDetails = await detailResponse.json();

          details.innerHTML = `
            <p><strong>Type:</strong> ${fullDetails.type || 'N/A'}</p>
            <p><strong>Color:</strong> ${fullDetails.color || 'N/A'}</p>
            <p><strong>Grain Size:</strong> ${fullDetails.grain_size || 'N/A'}</p>
            <p><strong>Minerals:</strong> ${fullDetails.minerals || 'N/A'}</p>
          `;
          detailsFetched = true;
          details.style.display = "block";
        } catch (err) {
          console.error("Failed to fetch rock details", err);
        }
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
