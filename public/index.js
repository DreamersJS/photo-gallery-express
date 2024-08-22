 // Fetch images from server and display them in the gallery
 fetch('/api/images')
 .then(response => response.json())
 .then(data => {
   const gallery = document.getElementById('gallery');
   data.images.forEach(file => {
     const div = document.createElement('div');
     div.classList.add('col-md-3');
     div.innerHTML = `
       <div class="card">
         <img src="/uploads/${file}" class="card-img-top" alt="...">
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
 });