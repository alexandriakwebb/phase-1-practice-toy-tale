let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(data => data.forEach(renderToys))
  .catch(error => console.log(error))



function renderToys(toys) {
  let div = document.createElement('div')
  let h2 = document.createElement('h2')
  let img = document.createElement('img')
  let p = document.createElement('p')
  let btn = document.createElement('button')

  h2.textContent = toys.name
  img.src = toys.image
  img.className = 'toy-avatar'
  p.textContent = toys.likes
  btn.textContent = 'Like'
  btn.className = 'like-btn'
  btn.id = `${toys.id}`
  div.className = 'card'

  document.querySelector('#toy-collection').appendChild(div)
  div.append(h2, img, p, btn)

  btn.addEventListener('click', (event) => {
    event.preventDefault()
    let newLikes = toys.likes + 1
    let toyId = event.target.id

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "likes": newLikes
      })
    })
      .then(response => response.json())
      .then(data => p.textContent = `${newLikes}`)
      .catch(error => console.log(error))
  })

}


function createSubmittedToy(url, body){
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then(res => res.json())
}

function handleToyForm(event) {
  event.preventDefault()
  let toy = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0
  }
  createSubmittedToy('http://localhost:3000/toys', toy)
    .then(renderToys)
    .catch(error => console.log(event))
  newToyForm.reset()
}

let newToyForm = document.querySelector('#new-toy-form')
newToyForm.addEventListener('submit', handleToyForm)
