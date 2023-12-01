

// The JS below is just stuff that I am messing with. 
//Making space for other code
const puppyImages = [
    'path/to/pup1.jpg',
    'path/to/pup2.jpg',
    'path/to/pup3.jpg',
];

const puppyRainContainer = document.getElementById('puppy-rain-container');

function createPuppy() {
  const puppy = document.createElement('img');
  puppy.src = puppyImages[Math.floor(Math.random() * puppyImages.length)];
  puppy.classList.add('puppy');
  puppy.style.left = `${Math.random() * window.innerWidth}px`;
  puppy.style.animationDuration = `${Math.random() * 2 + 1}s`;
  puppyRainContainer.appendChild(puppy);

  // Remove the image from the DOM after the animation ends
  puppy.addEventListener('animationend', () => {
    puppy.remove();
  });
}

function startPuppyRain() {
  setInterval(createPuppy, 1000); // Adjust the interval as needed
}

// Start puppy rain when the page loads
window.addEventListener('load', startPuppyRain);
