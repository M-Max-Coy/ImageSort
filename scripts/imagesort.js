
/*
This class is a recursive class which holds pairs of items

Fields:
    a: either an integer or another pair
    b: either null or another pair
    c: the "top" value of the pair (a is top, b is bottom)
*/
class Pair {
    constructor(a,b) {
        this.a = a;
        this.b = b;
        if (this.b == null) {
            this.c = this.a;
        } else {
            this.c = this.a.c;
        }
    }

    pop() {
        var res = this.b;
        this.b = this.a.b;
        this.a = this.a.a;
        return res;
    }

    async sort() {
        if (await compare(this.a.c,this.b.c) == "left-image") {
            var temp = this.a;
            this.a = this.b;
            this.b = temp;
            this.c = this.a.c;
        }
    }
}

/*
Entry function to begin sorting
*/
async function uploadFiles(id) {
    const fileInput = document.getElementById(id);

    if (!fileInput) {
        console.error("File input element not found.");
        return;
    }

    var images = Array.from(fileInput.files);

    document.getElementById('file-input').style.display = 'none';
    document.getElementById('sort-button').style.display = 'none';

    init(images);
    await merge_insertion_sort(images);
    showImages(images);
}

/*
Prepare page for sorting
*/
function init(images) {
    var title = document.getElementById("title");
    title.style.display = 'none';
    var desc = document.getElementById("msdesc");
    desc.style.display = 'none';

    document.getElementById('instructions').style.display = 'flex';

    var container = document.querySelector('.container');
    container.style.display = "flex";

    var image = document.querySelector('.choice-button');
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

async function merge_insertion_sort(A) {
    var B = [];
    for (let i = 0; i < A.length; i++) {
        B.push(new Pair(A[i],null));
    }
    await merge_insertion_sort_helper(B);
    for (let i = 0; i < A.length; i++) {
        A[i] = B[i].c;
    }
}

async function merge_insertion_sort_helper(A) {
    var n = A.length;

    if (n <= 1) {
        return;
    }

    var straggler = null;

    if (n % 2 == 1) {
        straggler = A[n-1];
    }

    B = [];
    for (let i = 0; i < Math.floor(n/2); i++) {
        B.push(new Pair(A[i],A[i+Math.floor(n/2)]));
    }

    for (let i = 0; i < B.length; i++) {
        await B[i].sort();
    }

    await merge_insertion_sort_helper(B);

    var pairs = [];
    for (let i = 0; i < B.length; i++) {
        pairs.push(B[i].pop());
    }

    var a = 1
    while (jacobsthal(a+1) <= pairs.length) {
        k = 2*jacobsthal(a)+(jacobsthal(a+1)-jacobsthal(a)-1)
        for (let j = jacobsthal(a+1); j > jacobsthal(a); j--) {
            await binary_insert(B,pairs[j-1],0,k);
        }
        a += 1;
    }

    for (let i = pairs.length; i > jacobsthal(a); i--) {
        await binary_insert(B,pairs[i-1],0,B.length-1);
    }

    if (straggler != null) {
        await binary_insert(B,straggler,0,B.length);
    }

    for (let i = 0; i < n; i++) {
        A[i] = B[i];
    }
}

// Might need improvements
function jacobsthal(n) {
    if (n == 1) {
        return 0;
    }
    return Math.floor((2**n-(-1)**n)/3);
}

async function binary_insert(A,item,a,b) {
    if (b-a == 0) {
        A.splice(a,0,item);
        return;
    }

    var m = a + Math.floor((b-a)/2);

    if (await compare(A[m].c,item.c) != "left-image") {
        await binary_insert(A,item,a,m);
    } else {
        await binary_insert(A,item,m+1,b);
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

