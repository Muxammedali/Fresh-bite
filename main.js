document.querySelectorAll('.heart-icon').forEach(icon => {
   icon.addEventListener('click', () => {
     icon.classList.toggle('active');
   });
 });