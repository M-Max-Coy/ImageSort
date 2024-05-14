async function uploadFiles(id) {
    const fileInput = document.getElementById(id);

    if (!fileInput) {
        console.error("File input element not found.");
        return;
    }

    var images = Array.from(fileInput.files);

    document.getElementById('fileInput').style.display = 'none';
    document.getElementById('sortButton').style.display = 'none';

    init(images);
    await mergeSort(images, 0, images.length-1);
    showImages(images);
}

function init(images) {
    var title = document.getElementById("title");
    title.style.display = 'none';
    var desc = document.getElementById("msdesc");
    desc.style.display = 'none';

    document.getElementById('instructions').style.display = 'flex';

    var container = document.querySelector('.container');
    container.style.display = "flex";

    var image = document.querySelector('.button');
    image.style.display = "block";

    var leftButton = document.getElementById("left-image-button");
    leftButton.style.display = "block";
    var rightButton = document.getElementById("right-image-button");
    rightButton.style.display = "block";
    
    var left = document.getElementById("left-image");
    var right = document.getElementById("right-image");
    left.src = URL.createObjectURL(images[0]);
    right.src = URL.createObjectURL(images[1]);
}

async function mergeSort(images, p, r) {
    if (p < r) {
        var q = p + parseInt((r-p)/2);
        await mergeSort(images, p, q);
        await mergeSort(images, q+1, r);
        await merge(images, p, q, r);
    }
}

async function merge(images, p, q, r) {
    var n1 = q-p+1;
    var n2 = r-q;

    var L = new Array(n1);
    var R = new Array(n2);

    for (var i = 0; i < n1; i++)
        L[i] = images[p + i];
    for (var i = 0; i < n2; i++)
        R[i] = images[q + 1 + i];
    
    var i = 0;
    var j = 0;
    var k = p;

    while (i < n1 && j < n2) {
        var comp = await compare(L[i], R[j]);
        if (comp == "left-image") {
            images[k] = L[i];
            i++;
        }
        else {
            images[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        images[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        images[k] = R[j];
        j++;
        k++;
    }
}

async function compare(image1, image2) {
    var left = document.getElementById("left-image");
    var right = document.getElementById("right-image");
    left.src = URL.createObjectURL(image1);
    right.src = URL.createObjectURL(image2);
    return new Promise(resolve => {
        var leftButton = document.getElementById("left-image-button");
        var rightButton = document.getElementById("right-image-button");

        const resolveHandler = (event) => {
            var buttonId = event.target.id;
            resolve(buttonId);
            leftButton.removeEventListener('click', resolveHandler);
            rightButton.removeEventListener('click', resolveHandler);
          };
  
        leftButton.addEventListener('click', resolveHandler);
        rightButton.addEventListener('click', resolveHandler)
    });
}

function swap(images, a, b) {
    var temp = images[a];
    images[a] = images[b];
    images[b] = temp;
}

function showImages(images) {
    var container = document.querySelector('.container');
    container.style.display = "none";
    var leftButton = document.getElementById("left-image-button");
    leftButton.hidden = true;
    var rightButton = document.getElementById("right-image-button");
    rightButton.hidden = true;

    var container2 = document.getElementById("image-list")
    container2.style.display = "block";
    container2.style.overflow = "auto";

    var imagesArray = Array.from(images);

    imagesArray.forEach(function(image) {
        var img = document.createElement('img');
        img.classList.add("image");
        img.src = URL.createObjectURL(image);
        container2.appendChild(img);
    });
}

