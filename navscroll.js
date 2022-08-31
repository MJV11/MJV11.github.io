window.onscroll = () => {
    const nav = document.querySelector('#main-nav');
    if(this.scrollY <= 250) nav.className = ''; else nav.className = 'scroll';
  };