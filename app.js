// first we shall fetch book data

const booksApiKey = "AIzaSyCJdB11_y0OVV6nDmlDUBftji0g7kwNBM0";

// Search for the book
document.getElementById("searchBook").addEventListener("click", () => {
  const bookName = document.getElementById("bookInput").value;

  fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=${booksApiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        displayBookDetails(book);
        findBookstoresNearby(); // Proceed to find bookstores
      } else {
        alert("Book not found!");
      }
    });
});

function displayBookDetails(book) {
  const bookDetails = document.getElementById("bookDetails");
  bookDetails.innerHTML = `
    <h2>${book.title}</h2>
    <p>Author: ${book.authors}</p>
    <img src="${book.imageLinks?.thumbnail || ''}" alt="Book Cover">
    <p><strong>Description:</strong> ${book.description || "No description available."}</p>
  `;
}


// Then we find the nearby bookstores with google maps places API:

function findBookstoresNearby() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: latitude, lng: longitude },
        zoom: 12,
      });

      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch(
        {
          location: { lat: latitude, lng: longitude },
          radius: 5000, // 5 km radius
          type: "book_store",
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
              new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
              });
            });
          }
        }
      );
    });
  } else {
    alert("Geolocation not supported by your browser.");
  }
}

