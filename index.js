let limit = 6
let currentPage = 1
let loading = false
let loadedCount = 0
let showModal = false

window.onload = setup

let appEl = null
let titlebarEl = document.createElement('div')
let catImgEls = []
let catContainer = document.createElement('div')
let paginationContainer = document.createElement('div')
let paginationButtonLeft = document.createElement('button')
let paginationButtonRight = document.createElement('button')
let paginationPageDisplay = document.createElement('div')
let loadingOverlay = document.createElement('div')
let loadingSpinner = document.createElement('img')
let modalOverlay = document.createElement('div')
let modal = document.createElement('div')
let modalImg = document.createElement('img')
// modalOverlay.addEventListener('transitionend', (e) => console.log({e}))

function setup() {
  appEl = document.getElementById('app')
  titlebarEl.textContent = 'Cat World.com'
  paginationButtonLeft.textContent = 'Back'
  paginationButtonLeft.disabled = true
  paginationButtonRight.textContent = 'Next'
  paginationButtonRight.addEventListener('click', handleNextClicked)
  paginationButtonLeft.addEventListener('click', handleLastClicked)
  paginationPageDisplay.textContent = `Page: ${currentPage}`
  paginationContainer.appendChild(paginationButtonLeft)
  paginationContainer.appendChild(paginationPageDisplay)
  paginationContainer.appendChild(paginationButtonRight)
  catContainer.id = 'cat-container'
  paginationContainer.id = 'pagination-container'
  loadingOverlay.id = 'loading-overlay'
  loadingSpinner.id = 'loading-spinner'
  loadingSpinner.src = 'assets/loading.gif'
  loadingOverlay.appendChild(loadingSpinner)
  modalOverlay.id = 'modal-overlay'
  modal.id = 'modal'
  modalImg.id = 'modal-img'
  modal.appendChild(modalImg)
  modalOverlay.classList.add('hidden')
  modalOverlay.appendChild(modal)

  appEl.appendChild(titlebarEl)
  appEl.appendChild(catContainer)
  appEl.appendChild(paginationContainer)  
  appEl.appendChild(loadingOverlay)  
  appEl.appendChild(modalOverlay)  
  
  fetchCats()
}

function fetchCats(e) {
  loadingOverlay.classList.remove('hidden')
  setTimeout(() => loadingOverlay.classList.add('loading'), 1)
  loadingOverlay.addEventListener('transitionend', handleLoadingTransitionEnd)
  fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${currentPage}&order=Desc`)
  .then(res => res.json())
  .then(data => afterFetch(data))
}

function afterFetch(data) {
  data.forEach((cat, i) => {
    const catImg = document.createElement('img')
    catImg.src = cat.url
    catImg.addEventListener('click', handleCatPicClick)
    catImg.addEventListener('load', handleImgLoaded)

    if (catImgEls[i]) {
      catContainer.replaceChild(catImg, catImgEls[i])
    } else {
      catContainer.appendChild(catImg)
    }

    catImgEls[i] = catImg
  })
  
  paginationButtonLeft.disabled = currentPage < 2
}

function handleNextClicked(e) {
  currentPage++

  paginationPageDisplay.textContent = `Page: ${currentPage}`

  fetchCats()
}

function handleLastClicked(e) {
  if (currentPage <= 1) {
    return
  }
  currentPage--

  paginationPageDisplay.textContent = `Page: ${currentPage}`

  fetchCats()
}

function handleCatPicClick(e) {
  const target = e.target
  const src = target.src
  openModal(src)
  // window.open(src, '_blank')
}

function openModal(src) {
  modalImg.src = src
  modalOverlay.classList.remove('hidden')
  setTimeout(() => modalOverlay.classList.add('open'), 1)

  modalOverlay.addEventListener('transitionend', handleModalTransitionEnd)
  modalOverlay.addEventListener('click', handleCloseModalClick)
}

function handleModalTransitionEnd() {
  if (modalOverlay.classList.contains('open')) {
    return
  }
  modalOverlay.classList.add('hidden')
}

function handleCloseModalClick(e) {
  const target = e.target

  if (target.id !== 'modal-overlay') {
    return
  }

  modalOverlay.classList.remove('open')
}

function handleImgLoaded(e) {
  const catImg = e.target
  catImg.removeEventListener('load', handleImgLoaded)
  loadedCount++

  if(loadedCount >= limit) {
    loadedCount = 0
    removeLoadingOverlay()
  }
}

function handleLoadingTransitionEnd(e) {
  const target = e.target
  const { classList } = target

  if (!classList.length) {
    target.classList.add('hidden')
  }
}

function removeLoadingOverlay() {
  loadingOverlay.classList.remove('loading')
}
