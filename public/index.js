async function fetchAndDisplayImages() {
  try {
    const response = await fetch('/api/images');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    const gallery = document.getElementById('gallery');
    
    gallery.innerHTML = '';
    
    data.images.forEach(file => {
      const div = document.createElement('div');
      div.classList.add('col-md-3');
      div.innerHTML = `
        <div class="card">
          <img src="/uploads/${file}" class="card-img-top" alt="Image">
          <div class="card-body text-center">
            <form action="/delete" method="POST">
              <input type="hidden" name="filename" value="${file}">
              <button type="submit" class="btn btn-danger">Delete</button>
            </form>
          </div>
        </div>
      `;
      gallery.appendChild(div);
    });
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

fetchAndDisplayImages();
