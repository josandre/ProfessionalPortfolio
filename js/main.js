let typed = undefined;
let currentLanguage = "en";
const enDataOptions = ["Software Engineer", "Back End Developer", "Front End Developer", "Innovation", "Passionate", "Empowered", "Disciplined"];
const esDataOptions = ["Ingeniera de software", "Desarrolladora de back-end", "Desarrolladora de front-end", "Innovación", "Apasionada", "Empoderada", "Disciplinada"];

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
    var imageURL = "./images/logo-animated2.gif"; // Default image URL
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
  resetTyped(enDataOptions)

  changeLanguage(currentLanguage);
}

function changeLanguage(lang) {
  const home_a = document.getElementById('home-a');
  const services_a = document.getElementById('services-a');
  const portfolio_a = document.getElementById('portfolio-a');
  const portfolioText = document.getElementById('portfolioText');
  const portfolioDesc = document.getElementById('portfolioDesc');
  const portfolioLink = document.getElementById('portfolioLink');
  const bloom = document.getElementById('bloom');
  const homeflix = document.getElementById('homeflix');
  const cenfoteco = document.getElementById('cenfoteco');
  const wazeOfThrones = document.getElementById('wazeOfThrones');
  const snake = document.getElementById('snake');
  const monopoly = document.getElementById('monopoly');
  const contact_a = document.getElementById('contact-a');
  const contactTitle = document.getElementById('contactTitle');
  const contactDesc = document.getElementById('contactDesc');
  const credits = document.getElementById('credits');
  const englandFlag = document.querySelector('.england-img');
  const spainFlag = document.querySelector('.spain-img');
  const welcome = document.getElementById('welcome');
  const iam = document.getElementById('iamContent');
  const summary = document.getElementById('summary');
  const cv = document.getElementById('cv');
  const name = document.getElementById('name');
  const aboutMe1 = document.getElementById('aboutMe1');
  const description4 = document.getElementById('description4');
  const stack = document.getElementById('stack');
  const sendAMessage = document.getElementById('cf-submit');
  const cfName = document.getElementById("cf-name");
  const subject = document.getElementById("cf-subject");
  const email = document.getElementById("cf-email");
  const message = document.getElementById("cf-message");

  if (lang === 'es') {
    document.getElementById('cv').href = "../Curriculums/IngenieraSoftware-JocselynAguilar.pdf";
    englandFlag.style.transform = "scale(1)";
    spainFlag.style.transform = "scale(1.5)";
    home_a.textContent = "Inicio"
    services_a.textContent = "Tecnologías"
    portfolio_a.textContent = "Portafolio"
    portfolioText.textContent = "Portafolio"
    portfolioDesc.textContent = "Los siguientes son proyectos que están terminados. Estás invitado a visitar mi repositorio en GitHub, donde puedes encontrar el código fuente de cada proyecto y más."
    portfolioLink.textContent = "Ir al repositorio de GitHub"
    bloom.textContent = "Aplicación web creada para ayudar a las personas a gestionar problemas asociados con la ansiedad, tiene como base la creación de módulos creados a partir de investigaciones que van desde juegos hasta gráficos que se alimentan a través de un wearable. La aplicación no solo permite una ayuda a las personas que sufren de este trastorno sino que permite a los médicos de salud ayudar a sus pacientes por medio de la comunicación y el manejo de recursos y tareas."
    homeflix.textContent = "Aplicación de reproductor de video de escritorio creada para brindar a los usuarios una plataforma donde puedan ver, descargar y subir videos. La aplicación también permite a los usuarios compartir videos a través de la red interna."
    cenfoteco.textContent = "Juego de estrategia basado en figuras de tetris, el primer jugador en crear un camino y destruir el castillo rival es el ganador."
    wazeOfThrones.textContent = "Aplicación de mapa de escritorio que presenta el renombrado mapa de Westeros de la famosa serie. Con esta aplicación, los usuarios pueden recibir direcciones fácilmente y ver distancias entre ubicaciones. Simplemente ingrese su punto de partida y destino para navegar por los vastos territorios de Westeros con facilidad."
    snake.textContent = "Juego de serpiente de escritorio inspirado en la época vintage, un clásico nostálgico que cobra vida en la pantalla de la computadora. Revive el encanto del juego original mientras ayudas a tu serpiente a comer cada sabrosa manzana para crecer más y más."
    monopoly.textContent = "Aplicación de consola del clásico juego Monopoly. Esta versión replica fielmente cada característica del juego real, brindando una experiencia inmersiva y emocionante directamente desde la pantalla de tu consola."

    contact_a.textContent = "Contacto"
    contactTitle.textContent = "Contacto"
    contactDesc.textContent = "Quieres saber más de mi? Envíame un email y te responderé tan pronto como sea posible."
    credits.textContent = "Portafolio profesional desarrollado y diseñado por Jocselyn Aguilar"
    welcome.textContent = "Bienvenida/o"
    cv.textContent = "Descargar CV"
    // experience.textContent = "Experiencia"
    name.textContent = "Hola my nombre es Jocselyn Aguilar!"
    summary.textContent = "Ingeniera Full Stack con experiencia en Python, Django, Angular y Docker. También cuento con conocimientos de Java, Spring Boot, React y AWS. Soy proactiva y adaptable. Busco seguir creciendo profesionalmente y aportar mis habilidades a proyectos desafiantes."
    aboutMe1.textContent = "Soy un desarrolladora de software impulsada por la pasión de crear. Mi felicidad reside en el trabajo que hago, donde me sumerjo en desafíos, innovo y doy vida a las ideas. Con cada proyecto, me esfuerzo por traspasar límites, resolver problemas y aprovechar tecnologías de vanguardia para satisfacer las necesidades y deseos de los clientes, creando soluciones que superen las expectativas e impulsen el progreso"
    stack.textContent = "Tecnologías"
    description4.textContent = "La siguiente lista comprende las tecnologías con las que tengo experiencia. Sin embargo, estoy constantemente dispuesta a explorar nuevas tecnologías para mejorar mi capacidad de crear e innovar sistemas y aplicaciones."
    iam.textContent = "Yo soy"
    sendAMessage.textContent = "Enviar Mensaje"

    cfName.setAttribute("placeholder", "Ingresa tu nombre");
    subject.setAttribute("placeholder", "Asunto");
    email.setAttribute("placeholder", "Ingresa tu email");
    message.setAttribute("placeholder", "Mensaje");

    resetTyped(esDataOptions)

  } else if (lang === 'en') {
    document.getElementById('cv').href = "../Curriculums/SoftwareEngineer-JocselynAguilar.pdf";
    englandFlag.style.transform = "scale(1.5)";
    spainFlag.style.transform = "scale(1)";
    home_a.textContent = "Home"
    services_a.textContent = "Stack"
    portfolio_a.textContent = "Portfolio"
    portfolioText.textContent = "Portfolio"
    portfolioDesc.textContent = "The following are projects that are finished, you are invited to visit my GitHub repository, where you can find the source code of every project and more."
    portfolioLink.textContent = "Go to GitHub repository."
    bloom.textContent = "The web application is created to assist individuals in managing anxiety-related issues. It is based on the development of modules created from research ranging from games to graphics that are fed through a wearable device. The application not only provides assistance to individuals suffering from this disorder but also enables healthcare professionals to help their patients through communication and resource and task management."
    homeflix.textContent = "Desktop video player application created to give the users a platform where they can watch, download and upload videos. The app also allows the users share videos through the internal network."
    cenfoteco.textContent = "Strategy game based on Tetris figures, the first player to create a path and destroy the opponent's castle wins."
    wazeOfThrones.textContent = "Desktop map application featuring the renowned map of Westeros from the famous series. With this application, users can effortlessly receive directions and view distances between locations. Simply input your starting point and destination to navigate the vast lands of Westeros with ease."
    snake.textContent = "Vintage-inspired desktop snake game, a nostalgic classic brought to life on the computer screen. Relive the charm of the original game as you help your serpent eats each tasty apple to grow more and more."
    monopoly.textContent = "Console application of the classic Monopoly game. This rendition faithfully replicates every feature of the real game, delivering an immersive and thrilling experience right from your console screen."

    contact_a.textContent = "Contact"
    contactTitle.textContent = "Contact"
    contactDesc.textContent = "Want to know more about me? Drop me an email and I will get back to you as soon as I can."
    credits.textContent = "Professional Portfolio developed and design by Jocselyn Aguilar"
    welcome.textContent = "Welcome"
    cv.textContent = "Download CV"
    name.textContent = "Hello my name is Jocselyn Aguilar!"
    summary.textContent = "Full Stack  Engineer with experience in Python, Django, Angular and Docker. I also have knowledge of Java, Spring Boot, React and AWS. I am Proactive and adaptable. I seek to continue growing professionally and contribute my skills to challenging projects."
    aboutMe1.textContent = "I'm an software developer fueled by a passion for creation. My happiness resides in the work I do, where I dive into challenges, innovate, and bring ideas to life. With each project, I strive to push boundaries, solve problems, and leverage cutting-edge technologies to fulfill the needs and desires of our clients, crafting solutions that exceed expectations and drive progress."
    description4.textContent = "The following stack comprises the technologies with which I have experience. However, I'm constantly open to exploring new technologies to enhance my ability to create and innovate systems and applications."
    stack.textContent = "Technology Stack"
    iam.textContent = "I am"
    sendAMessage.textContent = "Send Message"

    cfName.setAttribute("placeholder", "Enter your name");
    subject.setAttribute("placeholder", "Subject");
    email.setAttribute("placeholder", "Enter your email address");
    message.setAttribute("placeholder", "Message");

    resetTyped(enDataOptions)
  }

  currentLanguage = lang
}

function resetTyped (options) {
  const element = document.getElementById('iamFeatures');

  if(typed && typed.constructor === Typed) {
    typed.destroy();
  }

  typed = new Typed(element, {
    strings: options,
    typeSpeed: 80,
    loop: true,
    backSpeed: 80
  });
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
    snackbar.innerText = currentLanguage === "en" ? "All fields are required..." : "Todos los campos son requeridos..."
    setTimeout(function(){ snackbar.classList.remove("show"); }, 3000);
    return;
  }

  Email.send({
    Host : "smtp.elasticemail.com",
    Port: 2525,
    Username : "ajocseline@gmail.com",
    Password : "2D6339FCC3788AED3F4329912E5EA20C1496",
    To : 'ajocseline@gmail.com',
    From : "ajocseline@gmail.com",
    Subject : params.subject,
    Body :  `${params.name} from (${params.email}) wrote: \n ${params.message}`
  }).then(message => {
    snackbar.classList.remove("alert-danger");
    snackbar.classList.add("alert-success");
    snackbar.classList.add("show");
    snackbar.innerText = currentLanguage === "en" ? "Email sent..." : "Email enviado..."
    setTimeout(function(){ snackbar.classList.remove("show"); }, 3000);
  });
}



