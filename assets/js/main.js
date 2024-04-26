

(function($){
  "use strict";

  // Vars
  var $html = $('html'),
    $body = $('body'),
    $siteNavbar = $('.site-navbar'),
    $siteNavbarCollapse = $('.site-navbar #navbarCollapse'),
    $siteNavbarToggler = $('.site-navbar .navbar-toggler-alternative'),
    siteNavbar_base = $siteNavbar.attr('data-navbar-base') ? $siteNavbar.attr('data-navbar-base') : '',
    siteNavbar_toggled = $siteNavbar.attr('data-navbar-toggled') ? $siteNavbar.attr('data-navbar-toggled') : '',
    siteNavbar_scrolled = $siteNavbar.attr('data-navbar-scrolled') ? $siteNavbar.attr('data-navbar-scrolled') : '',
    siteNavbar_expand = 992,
    siteNavbar_dropdownHover = true,
    $btn_backToTop = $('.btn-back-to-top');

  function getWindowWidth(){
    return Math.max($(window).width(), window.innerWidth);
  }

  // [1. Loader]
  window.addEventListener( 'load', function(){
    document.querySelector('body').classList.add('loaded');
  });

  // [2. Navigation]
  function portfolio_navigation(){

    // Close all submenus when dropdown is hiding
    $('.navbar-nav > .dropdown').on('hide.bs.dropdown', function() {
      var $submenus = $(this).find('.dropdown-submenu');

      $submenus.removeClass('show dropdown-target');
      $submenus.find('.dropdown-menu').removeClass('show');
    });

    // Add hovered class
    $('.navbar-nav > .dropdown').on('shown.bs.dropdown', function() {
      if (window.innerWidth > 991) {
        $(this).addClass('hovered');
      } else {
        $(this).removeClass('hovered');
      }
    });

    // Enable clicks inside dropdown
    $(document).on('click', '.navbar-nav > .dropdown', function(e) {
      e.stopPropagation();
    });

    // Dropdown
    var navbarDropdown = document.querySelectorAll('.navbar-nav > .dropdown, .navbar-nav .dropdown-submenu');

    [].forEach.call(navbarDropdown, function(dropdown) {
      'mouseenter mouseleave click'.split(' ').forEach(function(event) {
        dropdown.addEventListener(event, function(e) {
          if (window.innerWidth >= siteNavbar_expand && siteNavbar_dropdownHover === true ) {
            // Hover

            var _this = this;

            if( event === 'mouseenter' ){
              if( _this.classList.contains('dropdown') ){
                var toggle = _this.querySelector('[data-toggle="dropdown"]');

                if( _this.classList.contains('show') ){
                  $(toggle).dropdown('hide');
                  $(toggle).blur();
                } else {
                  $(toggle).dropdown('show');

                  e.stopPropagation();
                }
              } else if( _this.classList.contains('dropdown-submenu') ){
                if( $(_this).parent().find('.dropdown-target') ){
                  $(_this).parent().find('.dropdown-target.dropdown-submenu').removeClass('show dropdown-target');
                }

                _this.classList.add('hovered', 'show', 'dropdown-target');
              }
            } else {
              if( _this.classList.contains('dropdown') ){
                var toggle = _this.querySelector('[data-toggle="dropdown"]');

                $(toggle).dropdown('hide');
                $(toggle).blur();
              } else if( _this.classList.contains('dropdown-submenu') ){
                _this.classList.remove('show', 'dropdown-target');
              }
            }
          } else {
            // Click

            if( event === 'click' && e.target.classList.contains('dropdown-toggle') && e.target.parentNode.classList.contains('dropdown-submenu') ){
              if( e.target.parentNode.classList.contains('dropdown') ){
                return true;
              }

              e.stopPropagation();
              e.preventDefault();

              var _this = e.target,
                ddSubmenu = _this.parentNode,
                ddMenu = _this.nextElementSibling;

              if( ddSubmenu.classList.contains('show') ){

                ddSubmenu.classList.remove('show', 'dropdown-target');
                ddMenu.classList.remove('show');

                if( ddMenu.querySelectorAll('.dropdown-target').length > 0 ){
                  var submenuNodeList = ddMenu.querySelectorAll('.dropdown-target.dropdown-submenu'), i;

                  for (i = 0; i < submenuNodeList.length; ++i) {
                    submenuNodeList[i].classList.remove('show', 'dropdown-target');
                    submenuNodeList[i].querySelector('.dropdown-menu').classList.remove('show');
                  }
                }
              } else {
                if( ddSubmenu.parentNode.querySelectorAll('.dropdown-target').length > 0 ){
                  var submenuNodeList = ddSubmenu.parentNode.querySelectorAll('.dropdown-target.dropdown-submenu'), i;

                  for (i = 0; i < submenuNodeList.length; ++i) {
                    submenuNodeList[i].classList.remove('show', 'dropdown-target');
                    submenuNodeList[i].querySelector('.dropdown-menu').classList.remove('show');
                  }
                }

                ddSubmenu.classList.add('hovered', 'show', 'dropdown-target');
                ddMenu.classList.add('show');
              }
            }
          }
        });
      });
    });

    // Navigation collapse
    $siteNavbarCollapse.on( 'show.bs.collapse', function(){
      $siteNavbar.addClass('navbar-toggled-show');
      $siteNavbarToggler.blur();
      portfolio_navChangeClasses('toggled');
    });

    $siteNavbarCollapse.on( 'hidden.bs.collapse', function(){
      $siteNavbar.removeClass('navbar-toggled-show');
      $siteNavbarToggler.blur();

      if ( $siteNavbar.hasClass('scrolled') ){
        portfolio_navChangeClasses('scrolled');
      } else {
        portfolio_navChangeClasses();
      }
    });

    // Clickable Links
    $(document).on( 'click', 'a.scrollto, .site-navbar a[href^="#"]', function(e){
      var target;

      // Make sure this.hash has a value before overriding default behavior
      if ( this.hash !== '' && this.hash !== '#!' && $( this.hash ).length > 0 ){
        target = this.hash;
      } else {
        return false;
      }

      if( target !== '' ){
        // Prevent default anchor click behavior
        e.preventDefault();

        if( $( target ).length > 0 ){
          var targetPosition = parseInt( Math.max( document.querySelector(target).offsetTop, $(target).offset().top ), 10 );

          $(window).scrollTo(targetPosition,800);

          $(this).blur();
        }
      }

      return false;
    });

    // Back to top
    $(document).on( 'click', '.btn-back-to-top', function(e){
      e.preventDefault();

      $(window).scrollTo(0,800);

      $(this).blur();
    });

    // Close nav on click outside of '.sitenav-collapse-inner'
    $(document).on( 'click touchstart', function(e){
      if ( $siteNavbar.is(e.target) || $(e.target).closest('.site-navbar').hasClass('site-navbar') || $(e.target).hasClass('navbar-toggler') || $(e.target).hasClass('navbar-toggler-alternative') ){
        return;
      }

      if ( $siteNavbarToggler.attr('aria-expanded') === 'true' ){
        $siteNavbarToggler.trigger('click');
      }
    });

  }

  function portfolio_navOnScroll(){
    if ( $siteNavbar.length > 0 ){
      var currentPos = $(window).scrollTop();

      if ( currentPos > 0 ){
        if ( $siteNavbar.hasClass('scrolled') ){
          return;
        }

        $siteNavbar.addClass('scrolled').removeClass('scrolled-0');

        if( $siteNavbar.hasClass('navbar-toggled-show') ){
          portfolio_navChangeClasses('toggled');
        } else {
          portfolio_navChangeClasses('scrolled');
        }
      } else {
        $siteNavbar.removeClass('scrolled').addClass('scrolled-0');

        if( $siteNavbar.hasClass('navbar-toggled-show') ){
          portfolio_navChangeClasses('toggled');
        } else if( $body.hasClass('flyer-open') ){
          portfolio_navChangeClasses('flyer');
        } else {
          portfolio_navChangeClasses();
        }
      }
    }
  }

  var nav_event_old;
  function portfolio_navChangeClasses(nav_event){
    if( nav_event_old === nav_event && !( nav_event == '' || nav_event == undefined ) )
      return;

    if( nav_event === 'toggled' && siteNavbar_toggled ){
      $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_base, siteNavbar_scrolled);
      $siteNavbar.addClass(siteNavbar_toggled);
    } else if( nav_event === 'scrolled' && siteNavbar_scrolled ){
      $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_base, siteNavbar_toggled);
      $siteNavbar.addClass(siteNavbar_scrolled);
    } else {
      if(siteNavbar_base){
        $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_toggled, siteNavbar_scrolled);
        $siteNavbar.addClass(siteNavbar_base);
      }
    }

    if( $siteNavbar.hasClass('navbar-light') ){
      $('[data-on-navbar-light]').each(function(){
        var el = $(this);

        if( el.attr('data-on-navbar-dark') ){
          el.removeClass(el.attr('data-on-navbar-dark'));
        }
        if( el.attr('data-on-navbar-light') ){
          el.addClass(el.attr('data-on-navbar-light'));
        }
      });
    } else if( $siteNavbar.hasClass('navbar-dark') ){
      $('[data-on-navbar-dark]').each(function(){
        var el = $(this);

        if( el.attr('data-on-navbar-light') ){
          el.removeClass(el.attr('data-on-navbar-light'));
        }
        if( el.attr('data-on-navbar-dark') ){
          el.addClass(el.attr('data-on-navbar-dark'));
        }
      });
    }

    nav_event_old = nav_event;
  }

  // [3. Back to top]
  function portfolio_backToTop(){
    if( $btn_backToTop.length > 0 ){
      var currentPos = $(window).scrollTop();

      if( currentPos > 400 ){
        $btn_backToTop.addClass('show');
      } else {
        $btn_backToTop.removeClass('show');
      }
    }
  }

  // [4. Layout Resize]
  function portfolio_layoutResize(){
    if( getWindowWidth() >= 1200 ){
      if ( $siteNavbarToggler.attr('aria-expanded') === 'true' ){
        $siteNavbar.removeClass('navbar-toggled-show');
        $siteNavbarCollapse.removeClass('show');
        $siteNavbarToggler.attr('aria-expanded','false');
        $siteNavbarToggler.addClass('collapsed');
        portfolio_navChangeClasses();
      }
    }
  }

  // [5. Backgrounds]
  function portfolio_backgrounds(){

    // Image
    var $bgImage = $('.bg-image-holder');
    if($bgImage.length){
      $bgImage.each(function(){
        var $self = $(this);
        var src = $self.children('img').attr('src');

        $self.css('background-image','url('+src+')').children('img').hide();
      });
    }

    // Video Background
    if ( $body.hasClass('mobile') ){
      $('.video-wrapper').css('display','none');
    }

  }

  // [6. Masonry]
  function portfolio_masonryLayout(){
    if ($('.masonry-container').length > 0) {
      var $masonryContainer = $('.masonry-container'),
        $columnWidth = $masonryContainer.data('column-width');

      if($columnWidth == null){
        var $columnWidth = '.masonry-item';
      }

      $masonryContainer.isotope({
        filter: '*',
        animationEngine: 'best-available',
        resizable: false,
        itemSelector : '.masonry-item',
        masonry: {
          columnWidth: $columnWidth
        },
        animationOptions: {
          duration: 750,
          easing: 'linear',
          queue: false
        }
      });

      // layout Isotope after each image loads
      $masonryContainer.imagesLoaded().progress( function() {
        $masonryContainer.isotope('layout');
      });
    }

    $('nav.masonry-filter a').on('click', function(e) {
      e.preventDefault();

      var selector = $(this).attr('data-filter');
      $masonryContainer.isotope({ filter: selector });
      $('nav.masonry-filter a').removeClass('active');
      $(this).addClass('active');

      return false;
    });
  }

  // [7. Lightbox]
  function portfolio_lightbox(){
    if(!$().featherlight){
      console.log('Featherlight: featherlight not defined.');
      return true;
    }

    $.extend($.featherlight.defaults, {
      closeIcon: '<i class="fas fa-times"></i>'
    });

    $.extend($.featherlightGallery.defaults, {
      previousIcon: '<i class="fas fa-chevron-left"></i>',
      nextIcon: '<i class="fas fa-chevron-right"></i>'
    });

    $.featherlight.prototype.afterOpen = function(){
      $body.addClass('featherlight-open');
    };

    $.featherlight.prototype.afterContent = function(){
      var title = this.$currentTarget.attr('data-title');
      var text = this.$currentTarget.attr('data-text');

      if( !title && !text )
        return;

      this.$instance.find('.caption').remove();

      var title = title ? '<h4 class="title-gallery">' + title + '</h4>' : '',
        text = text ? '<p class="text-gallery">' + text + '</p>' : '';

      $('<div class="caption">').html( title + text ).appendTo(this.$instance.find('.featherlight-content'));
    };

    $.featherlight.prototype.afterClose = function(){
      $body.removeClass('featherlight-open');
    };
  }

  // [8. Countdown]
  function portfolio_countdown(){
    var countdown = $('.countdown[data-countdown]');

    if (countdown.length > 0){
      countdown.each(function(){
        var $countdown = $(this),
          finalDate = $countdown.data('countdown');
        $countdown.countdown(finalDate, function(event){
          $countdown.html(event.strftime(
            '<div class="countdown-container row"> <div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%-D</div><span class="title">Day%!d</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%H</div><span class="title">Hours</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%M</div><span class="title">Minutes</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%S</div><span class="title">Seconds</span></div></div></div>'
          ));
        });
      });
    }
  }

  // [9. Subscribe Form]
  function portfolio_subscribeForm(){
    var $subscribeForm = $('.subscribe-form');

    if ( $subscribeForm.length > 0 ){
      $subscribeForm.each( function(){
        var el = $(this),
          elResult = el.find('.subscribe-form-result');

        el.find('form').validate({
          submitHandler: function(form) {
            elResult.fadeOut( 500 );

            $(form).ajaxSubmit({
              target: elResult,
              dataType: 'json',
              resetForm: true,
              success: function( data ) {
                elResult.html( data.message ).fadeIn( 500 );
                if( data.alert != 'error' ) {
                  $(form).clearForm();
                  setTimeout(function(){
                    elResult.fadeOut( 500 );
                  }, 5000);
                };
              }
            });
          }
        });

      });
    }
  }

  // [10. Contact Form]
  function portfolio_contactForm(){
    var $contactForm = $('.contact-form');

    if ( $contactForm.length > 0 ){
      $contactForm.each( function(){
        var el = $(this),
          elResult = el.find('.contact-form-result');

        el.find('form').validate({
          submitHandler: function(form) {
            elResult.fadeOut( 500 );

            $(form).ajaxSubmit({
              target: elResult,
              dataType: 'json',
              success: function( data ) {
                elResult.html( data.message ).fadeIn( 500 );
                if( data.alert != 'error' ) {
                  $(form).clearForm();
                  setTimeout(function(){
                    elResult.fadeOut( 500 );
                  }, 5000);
                };
              }
            });
          }
        });

      });
    }
  }

  // [11. Bootstrap]
  function portfolio_bootstrap(){

    // Botostrap Tootltips
    $('[data-toggle="tooltip"]').tooltip();

    // Bootstrap Popovers
    $('[data-toggle="popover"]').popover();

  }

  // [12. Typed text]
  function portfolio_typedText(){
    var toggle = document.querySelectorAll('[data-toggle="typed"]');

    function init(el) {
      var elementOptions = el.dataset.options;
      elementOptions = elementOptions ? JSON.parse(elementOptions) : {};
      var defaultOptions = {
        typeSpeed: 40,
        backSpeed: 40,
        backDelay: 3000,
        loop: true
      }
      var options = Object.assign(defaultOptions, elementOptions);

      new Typed(el, options);
    }

    if (typeof Typed !== 'undefined' && toggle) {
      [].forEach.call(toggle, function(el) {
        init(el);
      });
    }

  }

  // [13. Slider]
  function portfolio_slider() {
    var $slider = $('.slider');

    if($slider.length > 0){

      if( !$slider.hasClass('slick-initialized') ){
        $slider.on('init', function(event, slick){
          websiteSlider_layout();
          websiteSlider_resize();
        });

        $slider.slick({
          slidesToShow: 1,
          infinite: true,
          nextArrow: '<button type="button" class="slick-next"><i class="fas fa-angle-right"></i></button>',
          prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-angle-left"></i></button>'
        });

        $slider.on('reInit swipe setPosition destroy afterChange', function(event, slick){
          websiteSlider_layout();
          websiteSlider_resize();
        });
      }

      if( 1199 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-xl') ){
        $slider.slick('unslick');
      }

      if( 991 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-lg') ){
        $slider.slick('unslick');
      }

      if( 767 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-md') ){
        $slider.slick('unslick');
      }

      if( 575 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-sm') ){
        $slider.slick('unslick');
      }

    }
  }

  $(document).ready(function($){
    portfolio_navigation();
    portfolio_navOnScroll();
    portfolio_backToTop();
    portfolio_layoutResize();
    portfolio_backgrounds();
    portfolio_masonryLayout();
    portfolio_lightbox();
    portfolio_countdown();
    portfolio_subscribeForm();
    portfolio_contactForm();
    portfolio_bootstrap();
    portfolio_typedText();
    portfolio_slider();
  });

  $(window).on( 'scroll', function(){
    portfolio_navOnScroll();
    portfolio_backToTop();
  });

  $(window).on('resize', function(){
    portfolio_navOnScroll();
    portfolio_backToTop();
    portfolio_slider();
  });

})(jQuery);

document.addEventListener("DOMContentLoaded", function() {
  var logoLink = document.getElementById("logoLink");
  var imageOverlay = document.getElementById("imageOverlay");

  logoLink.addEventListener("click", function(event) {
    event.preventDefault();
    var imageURL = "assets/images/logo-animated2.gif"; // Default image URL
    showImage(imageURL);
  });

  function showImage(imageURL) {

    imageOverlay.innerHTML = '';

    var image = new Image();
    image.src = imageURL;
    image.classList.add( "margin");
    image.onload = function() {

      imageOverlay.appendChild(image);
    };
  }
});

window.onload = function (){
  changeLanguage('en');
}


function changeLanguage(lang) {
  const home_a = document.getElementById('home-a');
  const services_a = document.getElementById('services-a');
  const portfolio_a = document.getElementById('portfolio-a');
  const contact_a = document.getElementById('contact-a');
  const englandFlag = document.querySelector('.england-img');
  const spainFlag = document.querySelector('.spain-img');
  const welcome = document.getElementById('welcome');
  const iam = document.getElementById('iam');
  const typedData = document.getElementById('typedData');
  const summary = document.getElementById('summary');
  const cv = document.getElementById('cv');
  const name = document.getElementById('name');
  const aboutMe1 = document.getElementById('aboutMe1');
  const experience = document.getElementById('experience');
  const experienP = document.getElementById('experienP');
  const date1 = document.getElementById('date1');
  const title1 = document.getElementById('title1');
  const description1 = document.getElementById('description1');
  const reference1 = document.getElementById('reference1');
  const date2 = document.getElementById('date2');
  const title2 = document.getElementById('title2');
  const description2 = document.getElementById('description2');
  const reference2 = document.getElementById('reference2');
  const date3 = document.getElementById('date3');
  const title3 = document.getElementById('title3');
  const description3 = document.getElementById('description3');
  const reference3 = document.getElementById('reference3');
  const description4 = document.getElementById('description4');
  const stack = document.getElementById('stack');



  if (lang === 'es') {
    document.getElementById('cv').href = "assets/Curriculums/IngenieraSoftware-JocselynAguilar.pdf";
    englandFlag.style.transform = "scale(1)";
    spainFlag.style.transform = "scale(1.5)";
    home_a.textContent = "Inicio"
    services_a.textContent = "Tecnologías"
    portfolio_a.textContent = "Portafolio"
    contact_a.textContent = "Contacto"
    welcome.textContent = "Bienvenida/o"
    cv.textContent = "Descargar CV"
    experience.textContent = "Experiencia"
    name.textContent = "Hola my nombre es Jocselyn Aguilar!"
    summary.textContent = "Ingeniera Full Stack con experiencia en Python, Django, Angular y Docker. También cuento con conocimientos de Java, Spring Boot, React y AWS. Soy proactiva y adaptable. Busco seguir creciendo profesionalmente y aportar mis habilidades a proyectos desafiantes."
    aboutMe1.textContent = "Soy un desarrolladora de software impulsada por la pasión de crear. Mi felicidad reside en el trabajo que hago, donde me sumerjo en desafíos, innovo y doy vida a las ideas. Con cada proyecto, me esfuerzo por traspasar límites, resolver problemas y aprovechar tecnologías de vanguardia para satisfacer las necesidades y deseos de los clientes, creando soluciones que superen las expectativas e impulsen el progreso"
    experienP.textContent = "Experiencia";
    date1.textContent = "Mayo 2023 - Noviembre 2023";
    title1.textContent = "Ingeniera de interfaz gráfica - EEDS";
    description1.textContent = "Aplicación web creada utilizando Angular 13 junto con librerías como Bootstrap y Angular Material. Trabajo directo con el cliente para tomar requisitos y modelar la aplicación.";
    reference1.textContent = "Erick Brenes – Ingeniero en software – Professor – Fundador EEDS"
    date2.textContent = "Agosto 2023 - Octuber 2023"
    title2.textContent = "Práctica en ingeniería Full Stack- 4Geeks"
    description2.textContent = "Desarrollo full stack con Python, Django y Angular. Mis responsabilidades incluían aprender e implementar estas tecnologías para mejorar la aplicación web principal de la empresa. Como parte de estas mejoras, se aplicaron tecnologías como Typesense y el desarrollo de una función en GCP capaz de comunicarse con OpenAI para el análisis de currículums. Se trabajó con la metodología Scrum para la gestión del proyecto."
    reference2.textContent = "Allan Porras - Software Engineer – Fundador 4Geeks"
    date3.textContent = "Abril 2022 - Agosto 2023"
    title3.textContent = "Aprendiz en Ingeniería Full Stack - Limbo"
    description3.textContent = "Como voluntaria y aprendiz en el programa Limbo, lideré el desarrollo de una aplicación web desde el inicio, dedicando tiempo a adquirir habilidades en las tecnologías a utilizar, incluyendo GraphQL, React, Typecript y NodeJS. También tuve la responsabilidad de impartir mis conocimientos a los nuevos estudiantes del programa, y ​​también ocupé el rol de instructor en la Universidad Cenfotec, cubriendo temas como programación orientada a objetos y fundamentos de programación."
    reference3.textContent = "Andre Solis – Software Engineer – Professor – fundador Limbo"
    stack.textContent = "Tecnologías"
    description4.textContent = "La siguiente lista comprende las tecnologías con las que tengo experiencia. Sin embargo, estoy constantemente dispuesta a explorar nuevas tecnologías para mejorar mi capacidad de crear e innovar sistemas y aplicaciones."

  } else if (lang === 'en') {
    document.getElementById('cv').href = "assets/Curriculums/SoftwareEngineer-JocselynAguilar.pdf";
    englandFlag.style.transform = "scale(1.5)";
    spainFlag.style.transform = "scale(1)";
    home_a.textContent = "Home"
    services_a.textContent = "Stack"
    portfolio_a.textContent = "Portfolio"
    contact_a.textContent = "Contact"
    welcome.textContent = "Welcome"
    cv.textContent = "Download CV"
    experience.textContent = "Experience"
    name.textContent = "Hello my name is Jocselyn Aguilar!"
    summary.textContent = "Full Stack  Engineer with experience in Python, Django, Angular and Docker. I also have knowledge of Java, Spring Boot, React and AWS. I am Proactive and adaptable. I seek to continue growing professionally and contribute my skills to challenging projects."
    aboutMe1.textContent = "I'm an software developer fueled by a passion for creation. My happiness resides in the work I do, where I dive into challenges, innovate, and bring ideas to life. With each project, I strive to push boundaries, solve problems, and leverage cutting-edge technologies to fulfill the needs and desires of our clients, crafting solutions that exceed expectations and drive progress."
    experienP.textContent = "Experience";
    date1.textContent = "May 2023 - November 2023";
    title1.textContent = "Front End Engineer - EEDS";
    description1.textContent = "Web application created using Angular 13 together with libraries such as Bootstrap and Angular Material. Direct work with the client to collect requirements and model the application.";
    reference1.textContent = "Erick Brenes – Software Engineer – Professor – EEDS Founder"
    date2.textContent = "August 2023 - October 2023"
    title2.textContent = "Intership In Full Stack Engineering - 4Geeks "
    description2.textContent = "Full stack development with Python, Django and Angular. My responsibilities included learning and implementing these technologies to improve the company's main web application. As part of these improvements, technologies such as Typesense were applied and the development of a function in GCP capable of communicating with OpenAI for resume analysis. We worked with the Scrum methodology to manage the project."
    reference2.textContent = "Allan Porras - Software Engineer – 4Geeks Founder"
    date3.textContent = "April 2022 - August 2023"
    title3.textContent = "Apprentice In Full Stack Engineering - Limbo"
    description3.textContent = "As a volunteer and apprentice in the program, I led the development of a web application from the beginning, dedicating time to acquiring skills in the technologies to be used, including GraphQL, React, Typescript and NodeJS. I also had the responsibility of imparting my knowledge to new students in the program, and I also held the role of instructor at Cenfotec University, covering topics such as object-oriented programming and programming fundamentals."
    reference3.textContent = "Andre Solis – Software Engineer – Professor – Limbo Founder"
    description4.textContent = "The following stack comprises the technologies with which I have experience. However, I'm constantly open to exploring new technologies to enhance my ability to create and innovate systems and applications."
    stack.textContent = "Technology Stack"
  }
}

function sendEmail(){
  const snackbar = document.getElementById("snackbar");

  const params = {
    name: document.getElementById("cf-name").value,
    subject: document.getElementById("cf-subject").value,
    email: document.getElementById("cf-email").value,
    message: document.getElementById("cf-message").value,
  }

  if(!params.name || params.name.trim() === '' ||
    !params.subject || params.subject.trim() === '' ||
    !params.email || params.email.trim() === '' ||
    !params.message || params.message.trim() === '') {

    snackbar.classList.remove("alert-success");
    snackbar.classList.add("alert-danger");
    snackbar.classList.add("show");
    snackbar.innerText = "All fields are required..."
    setTimeout(function(){ snackbar.classList.remove("show"); }, 3000);
    return;
  }

  snackbar.classList.remove("alert-danger");
  snackbar.classList.add("alert-success");
  snackbar.classList.add("show");
  snackbar.innerText = "Email sent..."

  setTimeout(function(){ snackbar.classList.remove("show"); }, 3000);

  // Email.send({
  //   Host : "smtp.elasticemail.com",
  //   Port: 2525,
  //   Username : "ajocseline@gmail.com",
  //   Password : "2D6339FCC3788AED3F4329912E5EA20C1496",
  //   To : 'ajocseline@gmail.com',
  //   From : "ajocseline@gmail.com",
  //   Subject : params.subject,
  //   Body :  `${params.name} from (${params.email}) wrote: \n ${params.message}`
  // }).then();
}



