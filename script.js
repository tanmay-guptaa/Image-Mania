const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uil-times");
const downloadImgBtn = document.querySelector(".uil-import");


//API key, paginations, searchTerm variables
const apiKey = "YOUR_API_KEY";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  //converting recieved img to blob, creating its download link, & downloading it
  fetch(imgURL).then(res => res.blob()).then(file => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file); //creating URL of the passed object
    a.download = new Date().getTime(); //passing current time in milliseconds as <a> downlaod value
    a.click();
  }).catch(() => alert("Failed To Download Image !"));
}

const showLightbox = (name, img) =>{
  //showing lightbox and setting image source, name
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img); //storing the url as btn attribute, so we can download it later
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden"; //to hide the scrollbar when light box is opened
}

const hideLightbox = () =>{
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
  //Making li all fetched images and adding them to existing image wrapper
  imageWrapper.innerHTML += images.map(img =>
    `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();"><i class="uil uil-import"></i></button>
        </div> 
      </li>`
    ).join("");
} //stopPropagation() prevents propagartion of the same event from being called

const getImages = (apiURL) => {
  //Fetching images by API call with authorization header 
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey }
  }).then(res => res.json()).then(data =>{
    generateHTML(data.photos);
    loadMoreBtn.innerText = "Load More";
  loadMoreBtn.classList.remove("disabled");
  }).catch(() => alert("Failed To Load Images !"));
}

const loadMoreImages = () => {
  currentPage++; //Increment currentPage by 1
  //if searchTerm has some values then call API with search term else call default API
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
  getImages(apiURL);
}

const loadSearchImages = (e) => {
  //if search input is empty then set search to null and return from there
  if(e.key === "") return searchTerm = null;
  //if pressed key is Enter, upadte the current page, search term and call the getImages()
  if(e.key === "Enter"){
    currentPage = 1;
    searchTerm = e.target.value;
    imageWrapper.innerHTML = "";
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
  }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
searchInput.addEventListener("keyup", loadSearchImages);
loadMoreBtn.addEventListener("click", loadMoreImages);
closeBtn.addEventListener("click", hideLightbox);
//passing btn img value as argument to the downloading function
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img)); 