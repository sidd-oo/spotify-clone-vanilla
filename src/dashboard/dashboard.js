import { fetchRequest } from "../api";
import { ENDPOINT, logout } from "../common";

const onProfileClick = (event) => {
    event.stopPropagation();
    const profileMenu = document.querySelector("#profile-menu");
    profileMenu.classList.toggle("hidden");
    if (!profileMenu.classList.contains("hidden")) {
        profileMenu.querySelector("li#logout").addEventListener("click", logout)
    }
}

const loadUserProfile = async () => {
    const defaultImage = document.querySelector("#default-image");
    const displayNameElement = document.querySelector("#display-name");
    const profileButton = document.querySelector("#user-profile-btn");
    const { display_name: displayName, images } = await fetchRequest(ENDPOINT.userInfo);

    if (images?.length) {
        defaultImage.classList.add("hidden");
    } else {
        defaultImage.classList.remove("hidden")
    }

    profileButton.addEventListener("click", onProfileClick)

    displayNameElement.textContent = displayName;
}

const onPlaylistClicked = (event) => {
    console.log(event.target)
}

const loadPlaylist = async (endpoint, elementID) => {
    const { playlists: { items } } = await fetchRequest(endpoint);
    const playlistItemsSection = document.querySelector(`#${elementID}`);

    console.log(playlistItemsSection, "playlistItemsSection ")

    for (let { name, description, images, id } of items) {
        const [{ url: imageURL }] = images;
        const playlistItem = document.createElement("section");
        playlistItem.id = id;
        playlistItem.setAttribute("data-type", "playlist");
        playlistItem.className = "rounded p-4 hover:cursor-pointer hover:bg-light-black";
        playlistItem.addEventListener("click", onPlaylistClicked)
        playlistItem.innerHTML = `<img src=${imageURL} alt=${name} class="rounded mb-2 object-contain shadow">
                    <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
                    <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`
        playlistItemsSection.appendChild(playlistItem);
    }
}

const fillContentForDashboard = () => {
    const pageContent = document.querySelector("#page-content");
    const playlistMap = new Map([["featured", "featured-playlist-items"], ["top playlists", "top-playlist-items"]]);
    let innerHTML = "";
    for (let [type, id] of playlistMap) {
        innerHTML += `
        <article class="p-4">
          <h1 class="mb-4 text-2xl font-bold capitalize">${type}</h1>
          <section id="${id}" class="featured-songs grid grid-cols-auto-fill-cards gap-4">
           
          </section>
        </article>
        `
    }
    pageContent.innerHTML = innerHTML;
}

const loadPlaylists = () => {
    loadPlaylist(ENDPOINT.featuredPlayist, "featured-playlist-items");
    loadPlaylist(ENDPOINT.toplists, "top-playlist-items");
}

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    fillContentForDashboard();
    loadPlaylists();
    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }
    })

    document.querySelector(".content").addEventListener("scroll", (event)=>{
        const {scrollTop} = event.target;
        const headerElem = document.querySelector(".header");
        if(scrollTop >= headerElem.offsetHeight){
            headerElem.classList.add("sticky", "top-0", "bg-black-secondary");
            headerElem.classList.remove("bg-transparent");
        }else{
            headerElem.classList.remove("sticky", "top-0", "bg-black-secondary");
            headerElem.classList.add("bg-transparent");
        }
    })
})