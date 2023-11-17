$(function(){
  //Global Vars
  const globalState = {
    apps: [
      {
        nombre: 'Calendario',
        icono: 'img/calendario.png',
        type: 'widgetFull',
        dinamico: true
      },
      {
        nombre: 'Calendario',
        icono: 'img/calendario.png',
        type: 'app',
        dinamico: true
      },
      {
        nombre: 'Cámara',
        icono: 'img/calculadora.png',
        type: 'app',
        dinamico: false
      },
      {
        nombre: 'Calc',
        icono: 'img/flappy_bird.png',
        type: 'app',
        dinamico: false
      },
    ],
    wrapperApps: {
      appsGrupo: 24 ,
      grupoActivo: 1,
      medida: $('.wrapperApps').outerWidth(true),
      transform: 0
    },
    dateTime: {
      meses: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      dias: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    bateriaBaja: false,
    draggScreen: false
  }
  //EXtended Functions
  $.fn.extend({
    touchMov: function(config){
      config = jQuery.extend({
        mov: 'x',
        movIzq: function(){},
        movDer: function(){},
        movUp: function(){},
        movDown: function(){},
        updateMovX: function(){},
        updateMovY: function(){},
        finishMov: function(){}
      }, config);
      let el = this;
      let initCoords = { x: 0, y: 0 };
      let movCoords = { x: 0, y: 0 };
      let downCoords = { x: 0, y: 0 };
      el.mousedown(function (e) {
        initCoords = { x: e.pageX, y: e.pageY };
        downCoords = { x: movCoords.x, y: movCoords.y };
        el.mousemove(function (e2) {
          globalState.draggScreen = true;
          movCoords = { x: e2.pageX, y: e2.pageY };
          if (config.mov === 'x') {
            config.updateMovX(e2, (movCoords.x - initCoords.x))
          } else if (config.mov === 'y') {
            config.updateMovY(e2, (movCoords.y - initCoords.y))
          }
        })
        el.mouseup(function (ex) {
          if (config.mov === 'x') {
            if (movCoords.x - downCoords.x != 0) {
              (movCoords.x - initCoords.x) > 0 ? config.movDer(ex) : config.movIzq(ex);
            }
          } else if (config.mov === 'y') {
            if (movCoords.y - downCoords.y != 0) {
              (movCoords.y - initCoords.y) > 0 ? config.movDown(ex) : config.movUp(ex);
            }
          }
          globalState.draggScreen = false;
          config.finishMov(ex);
          el.off('mousemove');
          el.off('mouseup');
          el.off('mouseleave');
        })
        el.mouseleave(function (a) {
          if (config.mov === 'x') {
            if (movCoords.x - downCoords.x != 0) {
              (movCoords.x - initCoords.x) > 0 ? config.movDer(a) : config.movIzq(a);
            }
          } else if (config.mov === 'y') {
            if (movCoords.y - downCoords.y != 0) {
              (movCoords.y - initCoords.y) > 0 ? config.movDown(a) : config.movUp(a);
            }
          }
          globalState.draggScreen = false;
          config.finishMov(a);
          el.off('mousemove');
          el.off('mouseup');
          el.off('mouseleave');
        })
      })
      return this;
    },
    calendario: function(config){
      config = jQuery.extend({
        fecha: new Date(),
        diaCompleto: false
      }, config);
      let mes = globalState.dateTime.meses[config.fecha.getMonth()];
      let diasMes = new Date(config.fecha.getFullYear(), (config.fecha.getMonth() + 1), 0).getDate();
      let hoy = config.fecha.getDate();
      let primerDia = new Date(config.fecha.getFullYear(), config.fecha.getMonth(), 0).getDay();
      this.append(`
<div class="mes">
<p class="mesName">${mes}</p>
<div class="calendarioTabla">
<div class="tablaHeader"></div>
<div class="tablaContent"></div>
</div>
</div>`
                 );
      let header = this.find('.mes .tablaHeader');
      let content = this.find('.mes .tablaContent');
      globalState.dateTime.dias.map(dia => header.append(`<div class="diaName">${config.diaCompleto ? dia : dia.charAt(0)}</div>`))
      for (var k = 0; k <= primerDia; k++) {
        content.prepend('<div></div>');
      }
      for (let index = 1; index <= diasMes; index++) {
        content.append(`<div class="diaNum ${hoy == index ? 'activo':''}">${index}</div>`);
      }
      return this;
    },
    fechaIcono: function(config){
      config = jQuery.extend({
        fecha: new Date(),
        diaCompleto: false
      }, config);
      let hoy = config.fecha.getDate();
      let dia = globalState.dateTime.dias[config.fecha.getDay()];
      this.append(`<div class="fechaWrapper"><p class="diaNom">${config.diaCompleto ? dia : dia.substring(0, 3)}</p><p class="diaNum">${hoy}</p></div>`);
      return this;
    },
    reloj: function(){
      let tiempo = new Date();
      let numeros = '';
      for (let index = 1; index <= 12; index++) {
        numeros += `<div class="numero" data-num="${index}"></div>`;
      }
      let transformHora = `calc(${(360 / 12 - 360) * tiempo.getHours()}deg + ${(30 / 60) * tiempo.getMinutes()}deg)`;
      let transformMinutos = `calc(6deg * ${tiempo.getMinutes()} + ${(6 / 60) * tiempo.getSeconds()}deg)`;
      let transformSegundos = `calc(6deg * ${tiempo.getSeconds()})`;
      this.append(
        `<div class="relojWrapper">
<div class="reloj">
<div class="numeros">${numeros}</div>
<div class="manecillas">
<div class="manecilla hora" style="transform: rotate(${transformHora});"><div class="barra"></div></div>
<div class="manecilla minutos" style="transform: rotate(${transformMinutos});"><div class="barra"></div></div>
<div class="manecilla segundos" style="transform: rotate(${transformSegundos});"><div class="barra"></div></div>
</div>
</div>
</div>`
      );
      return this;
    },
    hora: function(config) {
      config = jQuery.extend({
        realtime: true
      }, config);
      var hoy = new Date();
      var hora = hoy.getHours();
      if (hora < 10) hora = '0' + hora;
      var minutos = hoy.getMinutes();
      if (minutos < 10) minutos = '0' + minutos;
      if (config.realtime) {
        setInterval(() => {
          hoy = new Date();
          hora = hoy.getHours();
          if (hora < 10) hora = '0' + hora;
          minutos = hoy.getMinutes();
          if (minutos < 10) minutos = '0' + minutos;
          this.empty();
          this.text(`${hora}:${minutos}`);
        }, 1000);
      }
      this.text(`${hora}:${minutos}`);
      return this;
    },
    fecha: function (config) {
      config = jQuery.extend({
        fecha: new Date(),
        diaCompleto: true
      }, config);
      let hoy = config.fecha.getDate();
      let dia = globalState.dateTime.dias[config.fecha.getDay()];
      let mes = globalState.dateTime.meses[config.fecha.getMonth()];
      this.text(`${config.diaCompleto ? dia : dia.substring(0, 3)}, ${hoy} de ${mes}`);
      return this;
    },
  })

  //Functions
  function sanearString(string){
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function pintarApps(apps, container){
    container.empty();
    globalState.wrapperApps.grupos = Math.ceil(apps.length / globalState.wrapperApps.appsGrupo);
    let appCount = 1;
    let html = '';
    apps.map((app, idArr) => {
      if (appCount == 1) html += '<div class="grupo">';
      let clases = 'app';
      if (app.type == 'widgetFull') clases = clases + ' widgetFull';
      if (app.dinamico && app.type == 'app') clases = `${clases} ${sanearString(app.nombre).toLowerCase()}Dinamico`;
      html += `
      <div class="${clases}" data-app="${app.type + sanearString(app.nombre)}" data-id="${idArr}">
        ${app.notificaciones ? `<div class="notificacion">${app.notificaciones}</div>` : ''}
        <div class="icono" style="${!app.dinamico ? `background-image:url(${app.icono});` : 'background-color:#fff;'}"></div>
        <p class="nombre">${app.nombre}</p>
      </div>`;
      if (appCount == globalState.wrapperApps.appsGrupo) {
        html += '</div>';
        appCount = 1;
        return false;
      }
      app.type == 'widgetFull' ? appCount = appCount + 8 : appCount++;
    })
    container.append(html);
  }
  function camara(){
    if (!$('.camaraApp').length) {
      $('.mainScreen').append(`
  <div class="camaraApp hidden">
            <div class="panel">
                <p class="result">0</p>
            </div>
            
            <table>
                <tr>
                    <td><button id="ac" class="btn especial">AC</button></td>
                    <td><button id="sign" class="btn especial">+/-</button></td>
                    <td><button id="percentage" class="btn especial">%</button></td>
                    <td><button id="division" class="btn operator">/</button></td>
                </tr>
                
                <tr>
                    <td><button id="seven" class="btn number">7</button></td>
                    <td><button id="eight" class="btn number">8</button></td>
                    <td><button id="nine" class="btn number">9</button></td>
                    <td><button id="multiplication" class="btn operator">x</button></td>
                </tr>    
                
                <tr>
                    <td><button id="four" class="btn number">4</button></td>
                    <td><button id="five" class="btn number">5</button></td>
                    <td><button id="six" class="btn number">6</button></td>
                    <td><button id="subtraction" class="btn operator">-</button></td>
                </tr>  
                
                <tr>
                    <td><button id="one" class="btn number">1</button></td>
                    <td><button id="two" class="btn number">2</button></td>
                    <td><button id="three" class="btn number">3</button></td>
                    <td><button id="addition" class="btn operator">+</button></td>
                </tr>  

                <tr>
                    <td colspan="2"><button id="zero" class="btn number"><p id="zero">0</p></button></td>
                    <td><button id="point" class="btn decimal">.</button></td>
                    <td><button id="equal" class="btn operator">=</button></td>
                </tr>  
            </table>
  </div>`
                             );

      numbers = {
        'zero': 0,
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9
    }
    
    var finalResult = 0;
    var operator ='';
    var activeOperator = false;
    
    $('#ac').click(() => {
        $('.result').text('0');
    })
    
    $('#sign').click(() => {
        if (firstChar() === '-'){
            result = $('.result').text()
            sbstr = result.substring(1, result.length);
            $('.result').text(sbstr);
        } else if (!emptyResult()) {
            prepend('-');
        }
    })
    
    $('#percentage').click(() => {
        if (!emptyResult()){
            percentage = parseFloat($('.result').text())/100;
            $('.result').text(percentage);
        }
    })
    
    $('.operator').click(e => {
        id = e.target.id;
    
        if (id === 'equal'){
            calculate();
            $('.result').text(finalResult);
            operator = '';
            activeOperator = false;
        } else {
            operator = id;
            activeOperator = true;
        }
    })
    
    $('.number').click(e => {
        if (firstChar() === '0' && !pointIncluded()) {
            $('.result').text('');
        }
    
        id = e.target.id;
        num = numbers[id];
    
        if (firstChar() === '0'){
            if (secoundChar() === '.'){
                append(num)
            }
        }
    
        if (activeOperator){
            finalResult = parseFloat($('.result').text());
            $('.result').text('');
            activeOperator = false;
        }
    
        if (firstChar() === '0'){
            if (hasChar('.')) { append(num); }
        } else { append(num); }
    })
    
    $('#point').click(() => {
        if (emptyResult()){
            append('0.')
        } else if (!emptyResult() && !pointIncluded()) { 
            append('.'); 
        } 
    })
    
    const calculate = () => {
        actResult = parseFloat($('.result').text());
        switch (operator){
            case 'addition':
                finalResult += actResult;
                break;
            case 'subtraction':
                finalResult -= actResult;
                break;
            case 'multiplication':
                finalResult *= actResult;
                break;
            case 'division':
                finalResult /= actResult;
                break;
            default:
                break;
        }
    }
    
    const emptyResult = () => {
        return $('.result').text() === '';
    }
    
    const hasChar = char => {
        result = $('.result').text();
        return result.index0f(char) !== -1;
    }
    
    const firstChar = () => {
        return $('.result').text().charAt(0);
    }
    
    const secoundChar = () => {
        return $('.result').text().charAt(1);
    }
    
    const pointIncluded = () => {
        result = $('.result').text();
        return result.includes('.');
    }
    
    const append = txt => {
        result = $('.result').text();
        $('.result').text(result + txt)
    }
    
    const prepend = sign => {
        result = $('.result').text();
        $('.result').text(sign + result);
    }

      $('.camaraApp').touchMov({
        mov: 'y',
        movUp: function (e) {
          $(e.currentTarget).addClass('hidden');
          $('.statusBar').removeClass('onlyLed camActiv');
        }
      });
    }
    setTimeout(function(){
      // $('.statusBar').addClass('onlyLed camActiv');
      $('.camaraApp').removeClass('hidden');
    }, 100)
  }
  function calc(){
    if (!$('.calcApp').length) {
      $('.mainScreen').append(`
  <div class="calcApp hidden">
  <canvas id="canvas" width="276" height="414"></canvas>
  </div>`
                             );
       const RAD = Math.PI / 180;
       const scrn = document.getElementById("canvas");
       const sctx = scrn.getContext("2d");
       scrn.tabIndex = 1;
       scrn.addEventListener("click", () => {
         switch (state.curr) {
           case state.getReady:
             state.curr = state.Play;
             SFX.start.play();
             break;
           case state.Play:
             bird.flap();
             break;
           case state.gameOver:
             state.curr = state.getReady;
             bird.speed = 0;
             bird.y = 100;
             pipe.pipes = [];
             UI.score.curr = 0;
             SFX.played = false;
             break;
         }
       });
       
       scrn.onkeydown = function keyDown(e) {
         if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38) {
           // Space Key or W key or arrow up
           switch (state.curr) {
             case state.getReady:
               state.curr = state.Play;
               SFX.start.play();
               break;
             case state.Play:
               bird.flap();
               break;
             case state.gameOver:
               state.curr = state.getReady;
               bird.speed = 0;
               bird.y = 100;
               pipe.pipes = [];
               UI.score.curr = 0;
               SFX.played = false;
               break;
           }
         }
       };
       
       let frames = 0;
       let dx = 2;
       const state = {
         curr: 0,
         getReady: 0,
         Play: 1,
         gameOver: 2,
       };
       const SFX = {
         start: new Audio(),
         flap: new Audio(),
         score: new Audio(),
         hit: new Audio(),
         die: new Audio(),
         played: false,
       };
       const gnd = {
         sprite: new Image(),
         x: 0,
         y: 0,
         draw: function () {
           this.y = parseFloat(scrn.height - this.sprite.height);
           sctx.drawImage(this.sprite, this.x, this.y);
         },
         update: function () {
           if (state.curr != state.Play) return;
           this.x -= dx;
           this.x = this.x % (this.sprite.width / 2);
         },
       };
       const bg = {
         sprite: new Image(),
         x: 0,
         y: 0,
         draw: function () {
           y = parseFloat(scrn.height - this.sprite.height);
           sctx.drawImage(this.sprite, this.x, y);
         },
       };
       const pipe = {
         top: { sprite: new Image() },
         bot: { sprite: new Image() },
         gap: 85,
         moved: true,
         pipes: [],
         draw: function () {
           for (let i = 0; i < this.pipes.length; i++) {
             let p = this.pipes[i];
             sctx.drawImage(this.top.sprite, p.x, p.y);
             sctx.drawImage(
               this.bot.sprite,
               p.x,
               p.y + parseFloat(this.top.sprite.height) + this.gap
             );
           }
         },
         update: function () {
           if (state.curr != state.Play) return;
           if (frames % 100 == 0) {
             this.pipes.push({
               x: parseFloat(scrn.width),
               y: -210 * Math.min(Math.random() + 1, 1.8),
             });
           }
           this.pipes.forEach((pipe) => {
             pipe.x -= dx;
           });
       
           if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {
             this.pipes.shift();
             this.moved = true;
           }
         },
       };
       const bird = {
         animations: [
           { sprite: new Image() },
           { sprite: new Image() },
           { sprite: new Image() },
           { sprite: new Image() },
         ],
         rotatation: 0,
         x: 50,
         y: 100,
         speed: 0,
         gravity: 0.125,
         thrust: 3.6,
         frame: 0,
         draw: function () {
           let h = this.animations[this.frame].sprite.height;
           let w = this.animations[this.frame].sprite.width;
           sctx.save();
           sctx.translate(this.x, this.y);
           sctx.rotate(this.rotatation * RAD);
           sctx.drawImage(this.animations[this.frame].sprite, -w / 2, -h / 2);
           sctx.restore();
         },
         update: function () {
           let r = parseFloat(this.animations[0].sprite.width) / 2;
           switch (state.curr) {
             case state.getReady:
               this.rotatation = 0;
               this.y += frames % 10 == 0 ? Math.sin(frames * RAD) : 0;
               this.frame += frames % 10 == 0 ? 1 : 0;
               break;
             case state.Play:
               this.frame += frames % 5 == 0 ? 1 : 0;
               this.y += this.speed;
               this.setRotation();
               this.speed += this.gravity;
               if (this.y + r >= gnd.y || this.collisioned()) {
                 state.curr = state.gameOver;
               }
       
               break;
             case state.gameOver:
               this.frame = 1;
               if (this.y + r < gnd.y) {
                 this.y += this.speed;
                 this.setRotation();
                 this.speed += this.gravity * 2;
               } else {
                 this.speed = 0;
                 this.y = gnd.y - r;
                 this.rotatation = 90;
                 if (!SFX.played) {
                   SFX.die.play();
                   SFX.played = true;
                 }
               }
       
               break;
           }
           this.frame = this.frame % this.animations.length;
         },
         flap: function () {
           if (this.y > 0) {
             SFX.flap.play();
             this.speed = -this.thrust;
           }
         },
         setRotation: function () {
           if (this.speed <= 0) {
             this.rotatation = Math.max(-25, (-25 * this.speed) / (-1 * this.thrust));
           } else if (this.speed > 0) {
             this.rotatation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
           }
         },
         collisioned: function () {
           if (!pipe.pipes.length) return;
           let bird = this.animations[0].sprite;
           let x = pipe.pipes[0].x;
           let y = pipe.pipes[0].y;
           let r = bird.height / 4 + bird.width / 4;
           let roof = y + parseFloat(pipe.top.sprite.height);
           let floor = roof + pipe.gap;
           let w = parseFloat(pipe.top.sprite.width);
           if (this.x + r >= x) {
             if (this.x + r < x + w) {
               if (this.y - r <= roof || this.y + r >= floor) {
                 SFX.hit.play();
                 return true;
               }
             } else if (pipe.moved) {
               UI.score.curr++;
               SFX.score.play();
               pipe.moved = false;
             }
           }
         },
       };
       const UI = {
         getReady: { sprite: new Image() },
         gameOver: { sprite: new Image() },
         tap: [{ sprite: new Image() }, { sprite: new Image() }],
         score: {
           curr: 0,
           best: 0,
         },
         x: 0,
         y: 0,
         tx: 0,
         ty: 0,
         frame: 0,
         draw: function () {
           switch (state.curr) {
             case state.getReady:
               this.y = parseFloat(scrn.height - this.getReady.sprite.height) / 2;
               this.x = parseFloat(scrn.width - this.getReady.sprite.width) / 2;
               this.tx = parseFloat(scrn.width - this.tap[0].sprite.width) / 2;
               this.ty =
                 this.y + this.getReady.sprite.height - this.tap[0].sprite.height;
               sctx.drawImage(this.getReady.sprite, this.x, this.y);
               sctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
               break;
             case state.gameOver:
               this.y = parseFloat(scrn.height - this.gameOver.sprite.height) / 2;
               this.x = parseFloat(scrn.width - this.gameOver.sprite.width) / 2;
               this.tx = parseFloat(scrn.width - this.tap[0].sprite.width) / 2;
               this.ty =
                 this.y + this.gameOver.sprite.height - this.tap[0].sprite.height;
               sctx.drawImage(this.gameOver.sprite, this.x, this.y);
               sctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
               break;
           }
           this.drawScore();
         },
         drawScore: function () {
           sctx.fillStyle = "#FFFFFF";
           sctx.strokeStyle = "#000000";
           switch (state.curr) {
             case state.Play:
               sctx.lineWidth = "2";
               sctx.font = "35px Squada One";
               sctx.fillText(this.score.curr, scrn.width / 2 - 5, 50);
               sctx.strokeText(this.score.curr, scrn.width / 2 - 5, 50);
               break;
             case state.gameOver:
               sctx.lineWidth = "2";
               sctx.font = "40px Squada One";
               let sc = `SCORE :     ${this.score.curr}`;
               try {
                 this.score.best = Math.max(
                   this.score.curr,
                   localStorage.getItem("best")
                 );
                 localStorage.setItem("best", this.score.best);
                 let bs = `BEST  :     ${this.score.best}`;
                 sctx.fillText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
                 sctx.strokeText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
                 sctx.fillText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);
                 sctx.strokeText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);
               } catch (e) {
                 sctx.fillText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);
                 sctx.strokeText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);
               }
       
               break;
           }
         },
         update: function () {
           if (state.curr == state.Play) return;
           this.frame += frames % 10 == 0 ? 1 : 0;
           this.frame = this.frame % this.tap.length;
         },
       };
       
       gnd.sprite.src = "img/ground.png";
       bg.sprite.src = "img/BG.png";
       pipe.top.sprite.src = "img/toppipe.png";
       pipe.bot.sprite.src = "img/botpipe.png";
       UI.gameOver.sprite.src = "img/go.png";
       UI.getReady.sprite.src = "img/getready.png";
       UI.tap[0].sprite.src = "img/tap/t0.png";
       UI.tap[1].sprite.src = "img/tap/t1.png";
       bird.animations[0].sprite.src = "img/bird/b0.png";
       bird.animations[1].sprite.src = "img/bird/b1.png";
       bird.animations[2].sprite.src = "img/bird/b2.png";
       bird.animations[3].sprite.src = "img/bird/b0.png";
       SFX.start.src = "sfx/start.wav";
       SFX.flap.src = "sfx/flap.wav";
       SFX.score.src = "sfx/score.wav";
       SFX.hit.src = "sfx/hit.wav";
       SFX.die.src = "sfx/die.wav";
       
       function gameLoop() {
         update();
         draw();
         frames++;
       }
       
       function update() {
         bird.update();
         gnd.update();
         pipe.update();
         UI.update();
       }
       
       function draw() {
         sctx.fillStyle = "#30c0df";
         sctx.fillRect(0, 0, scrn.width, scrn.height);
         bg.draw();
         pipe.draw();
       
         bird.draw();
         gnd.draw();
         UI.draw();
       }
       
       setInterval(gameLoop, 20);
    }
    setTimeout(function(){
      // $('.statusBar').addClass('onlyLed camActiv');
      $('.calcApp').removeClass('hidden');
    }, 100)
  }
  function renderizarUI(){
    //Pintamos todas las apps en el contenedor principal
    pintarApps(globalState.apps, $('.wrapperApps'));
    //Si existe el widget del calendario
    if ($('.wrapperApps .app[data-app="widgetFullCalendario"]').length) {
      //Preparamos el widget del calendario
      $('.wrapperApps .app[data-app="widgetFullCalendario"] .icono').append('<div class="eventos"><p>Sin más eventos para hoy</p></div><div class="calendarioWrapper"></div>');
      //Creamos el calendario del widget
      $('.wrapperApps .app[data-app="widgetFullCalendario"] .icono .calendarioWrapper').calendario();
    }
    //Si existe el icono dinamico del calendario
    if ($('.wrapperApps .app.calendarioDinamico').length) {
      //Icono dinamico del calendario
      $('.wrapperApps .app.calendarioDinamico .icono').fechaIcono();
    }
    //Si existe el reloj analogico dinamico
    if ($('.wrapperApps .app.relojDinamico').length) {
      //Reloj analogico dinamico
      $('.wrapperApps .app.relojDinamico .icono').reloj();
    }
  }
  function encendido(){
    renderizarUI();
    setTimeout(() => {
      $('.interactionInfo').removeClass('hidden');
      $('.iphone').removeClass('initAnimation').addClass('powerOn');
      setTimeout(() => {
        $('.iphone').removeClass('powerOn').addClass('arrhe');
        $('.mainScreen').removeClass('bloqueado');
      }, 2000);
    }, 1000);
  }

  encendido();
  //Hora de la statusBar
  $('.statusBar .hora').hora();
  //Hora de la pantalla de bloqueo
  $('.lockScreen .hora').hora();
  //Fecha de la pantalla de bloqueo
  $('.lockScreen .fecha').fecha();
  //Eventos del dia en la pantalla de widgetsCenter
  $('.widgetCenter .block.eventos').fechaIcono({diaCompleto: true});

  //Touch actions
  $('.lockScreen').touchMov({
    mov: 'y',
    movUp: function(e){
      $(e.currentTarget).siblings('.statusBar').addClass('mov');
      $(e.currentTarget).addClass('hidden');
      $(e.currentTarget).siblings('.appScreen.hidden').removeClass('hidden');
      setTimeout(() => {
        $(e.currentTarget).siblings('.statusBar').removeClass('mov');
        $(e.currentTarget).siblings('.statusBar').find('.operador').addClass('hidden');
        $(e.currentTarget).siblings('.statusBar').find('.hora').removeClass('hidden');
      }, 300)
    }
  });
  $('.wrapperApps').touchMov({
    updateMovX: function(e, mov){
      $(e.currentTarget).css({
        transform: `translateX(${globalState.wrapperApps.transform + mov}px)`,
        transition: 'none'
      });
    },
    movIzq: function (e) {
      if (globalState.wrapperApps.grupoActivo != globalState.wrapperApps.grupos) {
        globalState.wrapperApps.grupoActivo++;
      }
      $(e.currentTarget).css({
        transform: `translateX(-${globalState.wrapperApps.medida * (globalState.wrapperApps.grupoActivo - 1)}px)`,
        transition: 'ease all 0.2s'
      });
    },
    movDer: function (e) {
      if (globalState.wrapperApps.grupoActivo != 1) {
        globalState.wrapperApps.grupoActivo--;
        $(e.currentTarget).css({
          transform: `translateX(${globalState.wrapperApps.transform + globalState.wrapperApps.medida}px)`,
          transition: 'ease all 0.2s'
        });
      } else {
        $(e.currentTarget).parents('.mainScreen').addClass('blur');
        $(e.currentTarget).parents('.appScreen').addClass('moveOut');
        $(e.currentTarget).parents('.appScreen').siblings('.widgetCenter').removeClass('hidden');
        $(e.currentTarget).css({
          transform: `translateX(${globalState.wrapperApps.medida * (globalState.wrapperApps.grupoActivo - 1)}px)`,
          transition: 'ease all 0.2s'
        });
      }
    },
    finishMov: function(e){
      transform = e.currentTarget.style.transform;
      if (transform.length) {
        transform = transform.split('(');
        transform = transform[1].split('px');
        transform = parseInt(transform[0]);
      } else {
        transform = 0;
      }
      globalState.wrapperApps.transform = transform;
    }
  });
  $('.widgetCenter .contenido').touchMov({
    mov: 'x',
    movIzq: function (e) {
      $(e.currentTarget).parents('.mainScreen').removeClass('blur');
      $(e.currentTarget).parent().addClass('hidden').removeAttr('style');
      $(e.currentTarget).parent().siblings('.appScreen.moveOut').removeClass('moveOut');
    },
    updateMovX: function (e, mov) {
      if (Math.sign(mov) == 1) {
        $(e.currentTarget).parent().css({
          transform: `translateX(${mov}px)`,
          transition: 'none'
        });
      }
    },
    movDer: function(e){
      $(e.currentTarget).parent().css({
        transform: 'none',
        transition: 'ease all .2s'
      });
      setTimeout(() => {
        $(e.currentTarget).parent().removeAttr('style');
      }, 200)
    }
  });
  $('.widgetScreen .wrapper').touchMov({
    mov: 'y',
    movDown: function(e) {
      $(e.currentTarget).parents('.mainScreen').removeClass('widgetScreenOpen');
      $(e.currentTarget).parent().addClass('hidden');
      setTimeout(() => {
        $(e.currentTarget).removeAttr('style');
      }, 200)
    },
    updateMovY: function (e, mov) {
      if (Math.sign(mov) == 1) {
        $(e.currentTarget).css({
          transform: `translateY(${mov}px)`,
          transition: 'none'
        });
      }
    }
  });
  $('.statusBar').touchMov({
    mov: 'y',
    movDown: function (e) {
      $(e.currentTarget).parent().addClass('blur');
      $(e.currentTarget).siblings('.controlCenter.hidden').removeClass('hidden');
    }
  });
  $('.controlCenter').touchMov({
    mov: 'y',
    movUp: function (e) {
      $(e.currentTarget).addClass('hidden');
      $(e.currentTarget).parent().removeClass('blur');
    }
  });

  //Menu flotante al presionar app por 1 segundo
  $('.mainScreen .appScreen').mousedown(function(e){
    if ($(this).parent().hasClass('shakingApps')) return false;
    let timeout = setTimeout(() => {
      console.log('a');
      if (!globalState.draggScreen) {
        if ($(e.target).hasClass('app') || $(e.target).parents('.app').length) {
          //Dio click en una app. Ok, le mostraremos el menu flotante
          $(this).parent().addClass('filterBlur');
          let app;
          if ($(e.target).hasClass('app')) {
            app = $(e.target);
          } else {
            app = $(e.target).parents('.app');
          }
          let appClon = app.clone();
          appClon.attr('id', 'fixedApp');
          appClon.css({
            top: app[0].getBoundingClientRect().top,
            left: app[0].getBoundingClientRect().left,
            width: app[0].getBoundingClientRect().width
          })
          $('body').append(appClon);
          let rectsIphone = $('.iphone .bordeNegro')[0].getBoundingClientRect();
          let rectsApp = appClon.children('.icono')[0].getBoundingClientRect();
          let cssMenu = `left: ${((rectsIphone.x + rectsIphone.width) - rectsApp.x) >= 190 ? rectsApp.x : (rectsApp.x + rectsApp.width) - 190}px;`;
          if ((rectsIphone.top + (65 * 2)) >= rectsApp.top) {
            cssMenu += `top : ${rectsApp.y + rectsApp.height}px; transform: translateY(10px)`;
          } else {
            cssMenu += `top: ${rectsApp.y}px; transform: translateY(calc(-100% - 10px));`;
          }
          $('body').append(`
<div class="fixedMenuFixedApp" style="${cssMenu}">
<div class="menuOption eliminar">Eliminar app
<div class="icono">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<circle cx="32" cy="32" r="30"></circle>
<path d="M48 32H16"></path>
</svg>
</div>
</div>
<div class="menuOption shaking">Editar pantalla de inicio
<div class="icono">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<path d="M14 59a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3v-9H14zM50 5a3 3 0 0 0-3-3H17a3 3 0 0 0-3 3v5h36zm0 45V10m-36 0v40"></path>
<circle cx="32" cy="56" r="2"></circle>
</svg>
</div>
</div>
</div>
`);
        } else {
          //Dio click en cualquier parte del appScreen. Ok, es hora del shaking apps
          $(this).parent().addClass('shakingApps');
          $('.appScreen .app').append('<div class="removeApp"></div>');
        }
      }
    }, 1000);
    $(this).mouseup(function(){
      clearTimeout(timeout);
    })
    $(this).mouseleave(function () {
      clearTimeout(timeout);
    })
  })
  //Shaking apps desde el menu flotante de la app
  $('body').on('click', '.fixedMenuFixedApp .menuOption.shaking', function(){
    $(this).parent().remove();
    $('#fixedApp').remove();
    $('.mainScreen').removeClass('filterBlur').addClass('shakingApps');
    $('.appScreen .app').append('<div class="removeApp"></div>');
  })
  //Salir del eliminador de apps (shaking apps)
  $('.exitShake').click(function(){
    $('.mainScreen').removeClass('shakingApps');
    $('.appScreen .app .removeApp').remove();
  })
  //Mostrar la widgetScreen
  $('.widgetPlus').click(function(){
    $('.widgetScreen').removeClass('hidden');
    $('.appScreen .app .removeApp').remove();
    $('.mainScreen').removeClass('shakingApps').addClass('widgetScreenOpen');
  })
  //Eliminar app
  $('body').on('click', '.fixedMenuFixedApp .menuOption.eliminar', function () {
    let idApp = $('#fixedApp').data('id');
    if (idApp == undefined) {
      var idDeck = $('#fixedApp').data('indeck');
    }
    $(this).parent().remove();
    $('#fixedApp').remove();
    $('.mainScreen').removeClass('filterBlur');
    alertaiOS({
      encabezado: `¿Transferir ${idApp !== undefined ? globalState.apps[idApp].nombre : 'app'} a la biblioteca de apps o eliminar la app?`,
      mensaje: 'Transferir la app la quitará de tu pantalla de inicio conservando todos los datos',
      acciones: [
        {
          texto: 'Eliminar app',
          warning: true,
          callback: function(){
            if (idApp !== undefined) {
              globalState.apps.splice(idApp, 1);
              renderizarUI();
            } else if (idDeck) {
              $('.deckApps .app[data-indeck="'+ idDeck +'"]').remove();
            }
          }
        },
        {
          texto: 'Transferir a la biblioteca de apps',
          callback: function () { console.log('Biblioteca de apps pendiente') }
        },
        {
          texto: 'Cancelar'
        },
      ]
    });
  })
  $('.appScreen').on('click', '.app .removeApp', function () {
    let idApp = $(this).parent('.app').data('id');
    if (idApp == 'undefined') {
      var idDeck = $(this).parent('.app').data('indeck');
    }
    $('.appScreen .app .removeApp').remove();
    $('.mainScreen').removeClass('shakingApps');
    alertaiOS({
      encabezado: `¿Transferir ${idApp !== undefined ? globalState.apps[idApp].nombre : 'app'} a la biblioteca de apps o eliminar la app?`,
      mensaje: 'Transferir la app la quitará de tu pantalla de inicio conservando todos los datos',
      acciones: [
        {
          texto: 'Eliminar app',
          warning: true,
          callback: function () {
            if (idApp !== undefined) {
              globalState.apps.splice(idApp, 1);
              renderizarUI();
            } else if (idDeck) {
              $('.deckApps .app[data-indeck="' + idDeck + '"]').remove();
            }
          }
        },
        {
          texto: 'Transferir a la biblioteca de apps',
          callback: function () { console.log('Biblioteca de apps pendiente') }
        },
        {
          texto: 'Cancelar'
        },
      ]
    });
  })
  //Toggles de los iconos del controlCenter
  $('.controlCenter .actionIcon').click(function(){
    $(this).toggleClass('activo');
    if ($(this).hasClass('modoVuelo')) {
      $(this).siblings('.datosCelulares, .wifi').removeClass('activo');
    } else if ($(this).hasClass('datosCelulares') || $(this).hasClass('wifi')) {
      $(this).siblings('.modoVuelo').removeClass('activo');
    }
  })

  //UI de algunas apps
  $('body').on('click', '.app[data-app="appCamara"]', function(){
    camara();
  })
  $('body').on('click', '.app[data-app="appCalc"]', function(){
    calc();
  })
  $('.botonGirar').click(function(){
    $(this).toggleClass('activo');
    $('.iphone').toggleClass('showBackSide');
  })
  $('.botonBloquear').click(function () {
    if (!$(this).hasClass('activo')) {
      let sonido = new Audio('https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/sonidos%2FiphoneLockScreen.mp3?alt=media&token=e2a00013-3c33-429b-866b-b2d6399b343f');
      sonido.play();
    }
    $('#iOSAlert').remove();
    $(this).toggleClass('activo');
    $('.mainScreen').toggleClass('bloqueado');
  })
})

