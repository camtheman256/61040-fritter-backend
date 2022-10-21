/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'follow-user': follow,
  'unfollow-user': unfollow,
  'create-community': createCommunity,
  'get-community': getCommunity,
  'join-community': joinCommunity,
  'leave-community': leaveCommunity,
  'update-moderators': updateModerators,
  'update-bans': updateBans,
  'detach-freet': detachFreet,
  'create-feed': createFeed,
  'get-feed': getFeed
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;

function createCommunity(fields) {
  fetch('/api/communities', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function getCommunity(fields) {
  fetch(`/api/communities/${fields.name}`)
    .then(showResponse)
    .catch(showResponse);
}

function joinCommunity(fields) {
  fetch(`/api/communities/${fields.name}`, {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse);
}

function leaveCommunity(fields) {
  fetch(`/api/communities/${fields.name}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function updateModerators(fields) {
  fetch(`/api/communities/${fields.name}/moderators`, {
    method: 'PUT',
    body: JSON.stringify({
      moderators: fields.mods ? fields.mods.split(',') : []
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(showResponse)
    .catch(showResponse);
}

function updateBans(fields) {
  fetch(`/api/communities/${fields.name}/bans`, {
    method: 'PUT',
    body: JSON.stringify({
      bans: fields.bans ? fields.bans.split(',') : []
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(showResponse)
    .catch(showResponse);
}

function createFeed(fields) {
  fetch('/api/feed', {method: 'POST', body: JSON.stringify({
    page_length: parseInt(fields.page_length, 10),
    freets: parseInt(fields.freets, 10)
  }), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function getFeed(fields) {
  fetch(`/api/feed?page=${fields.page}`).then(showResponse).catch(showResponse);
}
