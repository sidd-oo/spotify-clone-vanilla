import { fetchRequest } from "../api";
import { ENDPOINT, logout, SECTIONTYPE } from "../common";

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

const onPlaylistClicked = (event, id) => {
    const section = { type: SECTIONTYPE.PLAYLIST, playlist: id };
    history.pushState(section, {}, `playlist/${id}`);
    loadSection(section)
}


const fillContentForPlaylist = async (playlistId) => {
    const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`)
    console.log(playlist);
    const { name, description, images, tracks } = playlist;
    const coverElement = document.querySelector("#cover-content");
    coverElement.innerHTML = `
        <img  class="object-contain h-40 w-40" src="${images[0].url}" alt="${name}" />
        <section class="">
          <h2 id="playlist-name" class="text-7xl font-bold">${name}</h2>
          <p id="playlist-details" class="text-base">${tracks.items.length} songs</p>
        </section>
    `
    const pageContent = document.querySelector("#page-content");
    pageContent.innerHTML = `
    <header id="playlist-header" class="mx-8 py-4 border-secondary border-b-[0.5px] z-10">
            <nav class="py-2">
              <ul class="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary">
                <li class="justify-self-center">#</li>
                <li>Title</li>
                <li>Album</li>
                <li>🕚</li>
              </ul>
            </nav>
    </header>
    <section class="px-8 text-secondary mt-4" id="tracks">
    </section>
    `
    loadPlaylistTracks(playlist)

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
        playlistItem.addEventListener("click", (event)=>onPlaylistClicked(event, id))
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

const loadSection = (section) => {
    if (section.type === SECTIONTYPE.DASHBOARD) {
        fillContentForDashboard();
        loadPlaylists();
    } else if (section.type === SECTIONTYPE.PLAYLIST) {
        //load the elements for playlist
        // fillContentForPlaylist = () => {

        }(section.playlist);
        const pageContent = document.querySelector("#page-content");
        pageContent.innerHTML = "This is playlistr"
    }

    // document.querySelector(".content").removeEventListener("scroll", onContentScroll);
    // document.querySelector(".content").addEventListener("scroll", onContentScroll);
}

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    const section = { type: SECTIONTYPE.DASHBOARD };
    history.pushState(section, "", "");
    loadSection(section);
    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }
    })

    document.querySelector(".content").addEventListener("scroll", (event) => {
        const { scrollTop } = event.target;
        const headerElem = document.querySelector(".header");
        if (scrollTop >= headerElem.offsetHeight) {
            headerElem.classList.add("sticky", "top-0", "bg-black-secondary");
            headerElem.classList.remove("bg-transparent");
        } else {
            headerElem.classList.remove("sticky", "top-0", "bg-black-secondary");
            headerElem.classList.add("bg-transparent");
        }
    })

    window.addEventListener("popstate", (event) => {
        console.log(event);
        loadSection(event.state);
    })
})