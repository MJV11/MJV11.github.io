/* Class the members of each slideshow group with different CSS classes */
let slideId = ["work-image1", "work-image2", "work-image3", "work-image4", "work-image5"]
let slideIndex = [1, 1, 1, 1, 1];

//showSlides(1, 0);
showSlides(1, 1);
showSlides(1, 2);
showSlides(1, 3);
showSlides(1, 4);

function plusSlides(n, number) {
    showSlides(slideIndex[number] += n, number);
}

function showSlides(n, number) {
    let i;
    let x = document.getElementsByClassName(slideId[number]);

    // Check if the parent work-item is hidden
    const parentWorkItem = x[0]?.closest('.work-item');
    if (parentWorkItem && parentWorkItem.classList.contains('hidden')) {
        return; // Exit if the work-item is hidden
    }

    if (n > x.length) slideIndex[number] = 1;
    if (n < 1) slideIndex[number] = x.length; 
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex[number] - 1].style.display = "block";
}

// when an item is clicked, open it and hide everything else.
// then, scroll to that item
document.querySelectorAll('.work-title').forEach((title, index) => {
    title.addEventListener('click', () => {
        const workItem = title.closest('.work-item');

        const allWorkItems = document.querySelectorAll('.work-item');
        allWorkItems.forEach(w => {
            if (w !== workItem) {
                const descriptions = w.querySelectorAll('.work-description, .work-skills, .arrowholder, .portfolio-link');
                descriptions.forEach(desc => desc.classList.add('hidden'));
            }
            w.style.backgroundColor = 'white';
        });

        const descriptions = workItem.querySelectorAll('.work-description, .work-skills, .arrowholder, .portfolio-link');
        descriptions.forEach(desc => desc.classList.toggle('hidden'));

        const wasOpened = Array.from(descriptions).every(desc => !desc.classList.contains('hidden'));
        if (wasOpened) {
            const rect = title.getBoundingClientRect();
            const offset = rect.top + window.scrollY - window.innerHeight / 8;
            window.scrollTo({
                top: offset,
                behavior: "smooth"
            });

            const titleColor = getComputedStyle(title).getPropertyValue('color');
            const backgroundColor = getTitleBackgroundColor(titleColor);
            workItem.style.backgroundColor = backgroundColor;
        }
    });
});


function getRandomPastelColor() {
    let r, g, b;
    
    do {
        r = Math.floor(Math.random() * 127) + 128;  // Random value between 128 and 255
        g = Math.floor(Math.random() * 127) + 128;  // Random value between 128 and 255
        b = Math.floor(Math.random() * 127) + 128;  // Random value between 128 and 255
    } while (Math.abs(r - g) < 50 && Math.abs(g - b) < 50 && Math.abs(r - b) < 50);  // Avoid grays by ensuring a significant difference

    return `rgb(${r}, ${g}, ${b})`;
}


// Function to calculate the brightness of the title color and return a background color
function getTitleBackgroundColor(titleColor) {
    // Extract RGB values from the title color
    const rgb = titleColor.match(/\d+/g);
    if (!rgb) return 'white'; // Fallback if color parsing fails

    const r = parseInt(rgb[0]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]);

    // Otherwise, return a color that is 25% as bright
    const newR = Math.floor(r * 1.3);
    const newG = Math.floor(g * 1.3);
    const newB = Math.floor(b * 1.3);

    return `rgb(${newR}, ${newG}, ${newB})`;
}

document.querySelectorAll('.work-title').forEach(title => {
    title.addEventListener('mouseenter', () => {
        title.style.setProperty('--random-color', getRandomPastelColor());
    });
});

function getRandomPastelColor() {
    let r, g, b;
    
    do {
        r = Math.floor(Math.random() * 127) + 128;
        g = Math.floor(Math.random() * 127) + 128;
        b = Math.floor(Math.random() * 127) + 128;
    } while (Math.abs(r - g) < 50 && Math.abs(g - b) < 50 && Math.abs(r - b) < 50);

    return `rgb(${r}, ${g}, ${b})`;
}

// Select all elements with the class 'work-title'
document.querySelectorAll('.work-title').forEach((title) => {
    const container = title; // Container for triangles is the title itself

    let intervalId; // To keep track of the interval

    // Function to generate triangles
    const generateTriangles = () => {
        const worksElement = document.querySelector('#works');
        
        // Check if #works is currently display: flex
        const isWorksVisible = window.getComputedStyle(worksElement).display === 'flex';

        if (!isWorksVisible) {
            // Stop the interval if #works is not visible
            clearInterval(intervalId);
            intervalId = null;
            return;
        }

        // Generate a random number of triangles between 5 and 10
        const numTriangles = Math.floor(Math.random() * 6) + 5;

        for (let i = 0; i < numTriangles; i++) {
            const triangle = document.createElement('div');
            triangle.classList.add('triangle');

            // Random direction for the triangle
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 50 + 50; // Random distance
            const dx = Math.cos(angle) * distance + 'px';
            const dy = Math.sin(angle) * distance + 'px';

            triangle.style.setProperty('--dx', dx);
            triangle.style.setProperty('--dy', dy);

            // Add the triangle to the container
            container.appendChild(triangle);

            // Remove the triangle after the animation ends
            triangle.addEventListener('animationend', () => {
                triangle.remove();
            });
        }
    };

    // Watch for changes in #works visibility and manage the animation
    const watchVisibility = () => {
        const worksElement = document.querySelector('#works');
        const isWorksVisible = window.getComputedStyle(worksElement).display === 'flex';

        if (isWorksVisible && !intervalId) {
            // Start generating triangles every 100ms
            intervalId = setInterval(generateTriangles, 100);
        } else if (!isWorksVisible && intervalId) {
            // Stop generating triangles if #works becomes hidden
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    // Periodically check visibility of #works
    //setInterval(watchVisibility, 500); // Adjust the frequency of checks as needed
});


  

