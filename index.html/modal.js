/*
=================================================================
  GALLERIES — Each card has its OWN array of images/videos.
  Add as many files as you want per gallery.
  { type:'image', src:'filename.jpeg' }
  { type:'video', src:'filename.mp4'  }
=================================================================
*/
var galleries = {

  /* 1. HAUTE COUTURE */
  haute: [
    {type:'image', src:'gigi black.jpeg'},
    {type:'image', src:'gigi black2.jpeg'},
    {type:'image', src:'gigi black3.jpeg'},
    {type:'image', src:'gigi black4.jpeg'},
     {type:'image', src:'gigi black5.jpeg'}
  ],

  /* 2. BEHIND THE LENS */
  behind: [
    {type:'image', src:'gigibliss.jpeg'},
    {type:'image', src:'gigibliss1.jpeg'}

  ],

  /* 3. ELEGANCE REDEFINED */
  elegance: [
    {type:'image', src:'gigi bag.jpeg'},
    {type:'image', src:'gigi bag2.jpeg'},
    {type:'image', src:'gigi bag3.jpeg'},
    {type:'image', src:'gigi bag4.jpeg'}
  ],

  /* 4. VOGUE ESSENCE */
  vogue: [
    {type:'image', src:'gigi white.jpeg'},
    {type:'image', src:'gigi white2.jpeg'}
  ],

  /* 5. GOLDEN HOUR */
  golden: [
    {type:'image', src:'gigit.jpeg'},
    {type:'image', src:'gigit1.jpeg'}
  
  ],

  /* 6. EDITORIAL MOTION */
  editmotion: [
    {type:'video', src:'gigimotion.mp4'},
    /* add more editorial photos here */
  ],

  /* 7. LUXURY BEAUTY */
  luxury: [
    {type:'image', src:'gigiwhite.jpeg'},
    {type:'image', src:'gigiwhite2.jpeg'}
  ],

  /* 8. BRAND CAMPAIGN FILM */
  brand: [
    {type:'video', src:'gigifashion.mp4'},
  /* add more campaign photos here */
  ],

  /* 9. PARIS FASHION WEEK */
  paris: [
    {type:'image', src:'gigi chin.jpeg'},
    {type:'image', src:'gigi chin2.jpeg'},
    {type:'image', src:'gigi chin3.jpeg'},
    {type:'image', src:'gigi chin4.jpeg'}
  ],

  /* 10. RUNWAY MOTION */
  runwaymotion: [
    {type:'video', src:'gigi video.mp4'},
      /* add more runway photos here */
  ],

  /* 11. FINE ART PHOTOGRAPHY */
  fineart: [
    {type:'image', src:'gigifine.jpeg'},
    {type:'image', src:'gigifine1.jpeg'},  
    {type:'image', src:'gigifine2.jpeg'},   /* add more fine art photos here */
  ],

  /* 12. STUDIO PORTRAIT */
  studio: [
    {type:'image', src:'gigi home2.jpeg'},
    {type:'image', src:'gigi home3.jpeg'},
    {type:'image', src:'gigi home .jpeg'}
  ],

  /* 13. PHOTOGRAPHY IN MOTION */
  photomotion: [ 
    {type:'image', src:'photograph.jpeg'},
    {type:'image', src:'photograph2.jpeg'},
    {type:'image', src:'photograph3.jpeg'},
    {type:'image', src:'photograph1.jpeg'},
    {type:'image', src:'photograph4.jpeg'} /* add more BTS photos here */


  ]
};

/* ===== STATE ===== */
var currentGallery = 'haute';
var currentIndex   = 0;
var isAnimating    = false;
var savedScrollY   = 0;

/* ===== THEME ===== */
function toggleTheme(){
  var html = document.documentElement;
  var dark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', dark ? 'light' : 'dark');
  document.getElementById('desktopLabel').textContent = dark ? 'Dark' : 'Light';
  document.getElementById('mobileLabel').textContent  = dark ? 'Off'  : 'On';
}

/* ===== MENU ===== */
function toggleMenu(){ document.getElementById('navLinks').classList.toggle('active'); }
function closeMenu() { document.getElementById('navLinks').classList.remove('active'); }

/* ===== FILTER ===== */
function filterPortfolio(cat, btn){
  document.querySelectorAll('.category-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll('.portfolio-item').forEach(function(item){
    item.style.display = (cat === 'all' || item.dataset.category === cat) ? '' : 'none';
  });
}

/* ===== LIGHTBOX DOTS ===== */
function buildDots(gallery){
  var c = document.getElementById('lightboxDots');
  c.innerHTML = '';
  var len = galleries[gallery].length;
  if(len > 14) return;
  galleries[gallery].forEach(function(_, i){
    var d = document.createElement('div');
    d.className = 'lb-dot' + (i === currentIndex ? ' active' : '');
    d.onclick = (function(idx){ return function(){ goTo(idx, idx >= currentIndex ? 'next' : 'prev'); }; })(i);
    c.appendChild(d);
  });
}

function updateDots(){
  document.querySelectorAll('.lb-dot').forEach(function(d, i){
    d.classList.toggle('active', i === currentIndex);
  });
}

/* ===== RENDER MEDIA ===== */
function renderMedia(item){
  if(item.type === 'video'){
    var v = document.createElement('video');
    v.src = item.src;
    v.controls = true; v.autoplay = true; v.loop = true; v.playsInline = true;
    return v;
  }
  var img = document.createElement('img');
  img.src = item.src;
  img.alt = '';
  /* If file missing, skip silently */
  img.onerror = function(){ this.style.display='none'; };
  return img;
}

/* ===== OPEN LIGHTBOX ===== */
function openLightbox(gallery, index){
  currentGallery = gallery;
  currentIndex   = index;

  /* iOS scroll lock */
  savedScrollY = window.scrollY;
  document.body.style.top = '-' + savedScrollY + 'px';
  document.body.classList.add('lb-open');

  var content = document.getElementById('lightboxContent');
  content.innerHTML = '';
  content.appendChild(renderMedia(galleries[gallery][index]));
  document.getElementById('lightboxCounter').textContent = (index + 1) + ' / ' + galleries[gallery].length;
  buildDots(gallery);
  document.getElementById('lightbox').classList.add('active');
}

/* ===== CLOSE LIGHTBOX ===== */
function closeLightbox(){
  var lightbox = document.getElementById('lightbox');
  var content  = document.getElementById('lightboxContent');
  content.style.animation = 'lbOpen .22s ease reverse forwards';
  setTimeout(function(){
    lightbox.classList.remove('active');
    content.style.animation = '';
    content.querySelectorAll('video').forEach(function(v){ v.pause(); });
    document.body.classList.remove('lb-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
  }, 220);
}

/* ===== NAVIGATE ===== */
function goTo(index, direction){
  if(isAnimating) return;
  isAnimating = true;
  var content  = document.getElementById('lightboxContent');
  var outClass = direction === 'next' ? 'lb-slide-out-left'  : 'lb-slide-out-right';
  var inClass  = direction === 'next' ? 'lb-slide-in-right'  : 'lb-slide-in-left';
  content.querySelectorAll('video').forEach(function(v){ v.pause(); });
  content.classList.add(outClass);
  setTimeout(function(){
    content.classList.remove(outClass);
    content.innerHTML = '';
    currentIndex = index;
    content.appendChild(renderMedia(galleries[currentGallery][currentIndex]));
    content.classList.add(inClass);
    document.getElementById('lightboxCounter').textContent = (currentIndex + 1) + ' / ' + galleries[currentGallery].length;
    updateDots();
    setTimeout(function(){ content.classList.remove(inClass); isAnimating = false; }, 240);
  }, 220);
}

function nextImage(){ goTo((currentIndex + 1) % galleries[currentGallery].length, 'next'); }
function prevImage(){ goTo((currentIndex - 1 + galleries[currentGallery].length) % galleries[currentGallery].length, 'prev'); }

/* ===== TOUCH SWIPE ===== */
var touchStartX = 0, touchStartY = 0;
document.getElementById('lightbox').addEventListener('touchstart', function(e){
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, {passive:true});
document.getElementById('lightbox').addEventListener('touchend', function(e){
  var dx = e.changedTouches[0].clientX - touchStartX;
  var dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
  if(Math.abs(dx) > 45 && dy < 80){ if(dx < 0) nextImage(); else prevImage(); }
}, {passive:true});

/* ===== KEYBOARD ===== */
document.addEventListener('keydown', function(e){
  if(!document.getElementById('lightbox').classList.contains('active')) return;
  if(e.key === 'ArrowRight') nextImage();
  if(e.key === 'ArrowLeft')  prevImage();
  if(e.key === 'Escape')     closeLightbox();
});

/* ===== FLIP CARD ===== */
function flipCard(){ document.getElementById('flipCard').classList.toggle('flipped'); }

/* ===== LIKE ===== */
function toggleLike(btn, base){
  var liked = btn.classList.toggle('liked');
  var el    = btn.querySelector('.like-count');
  var n     = liked ? base + 1 : base;
  el.textContent = n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;
}

/* ===== FORM ===== */
function handleSubmit(e){
  e.preventDefault();
  alert('Thank you for your inquiry! I will get back to you soon.');
  e.target.reset();
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    e.preventDefault();
    var t = document.querySelector(this.getAttribute('href'));
    if(t) window.scrollTo({top: t.offsetTop - 72, behavior:'smooth'});
  });
});