<template>
  <div class="hero">

    <!-- Logo mit Slogan im Zentrum -->
    <div class="center">
      <img src="/StudySync_Logo.png" class="logo" />
      <p class="slogan">Study smarter. Not harder.</p>
    </div>

    <!-- Icons drumherum -->
    <img src="/icon1.png" class="floating top-left" />
    <img src="/icon7.png" class="floating top-right" />
    <img src="/icon3.png" class="floating left" />
    <img src="/icon4.png" class="floating right" />
    <img src="/icon5.png" class="floating bottom-left" />
    <img src="/icon6.png" class="floating bottom-right" />

  </div>
</template>

<style scoped>
.hero {
  position: relative;      /* WICHTIG: Bezugspunkt für alle Bilder */
  min-height: calc(100vh - 260px); /*-260px um die Leisten oben und unten abzuziehen*/
  background: white;     /* dunkler Hintergrund wie im Bild */
  overflow: hidden;
}

/* MITTE/ LOGO */
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* perfekt mittig */
  text-align: center;
  z-index: 2;
}

.logo {
  width: 250px;
  height: auto;
}

.slogan {
  margin-top: 20px;
  color: #ccc;
  font-size: 20px;
  position: relative;
  z-index: 3;
}

/* ICONS */
.floating {
  position: absolute;
  width: 120px;
  border-radius: 20px;
  z-index: 1; /*damit Icons hinter dem Logo liegen*/
}

/* Positionen der Icons leicht versetzt + eigene Bewegungen*/
.top-left {
  top: 2%;
  left: 40%;
  animation: drift-1 6.2s ease-in-out infinite; /*ease- in- out: wirkt weicher*/
  animation-delay: 0.4s;
}

.top-right {
  top: 18%;
  right: 25%;
  animation: drift-2 7.1s ease-in-out infinite;
  animation-delay: 1.3s;
}

.left {
  top: 30%;
  left: 22%;
  transform: translateY(-50%);
  animation: drift-middle-1 6.8s ease-in-out infinite;
  animation-delay: 0.9s;
}

.right {
  top: 52%;
  right: 20%;
  transform: translateY(-50%);
  animation: drift-middle-2 7.6s ease-in-out infinite;
  animation-delay: 1.8s;
}

.bottom-left {
  bottom: 25%;
  left: 27%;
  animation: drift-3 6.5s ease-in-out infinite;
  animation-delay: 0.7s;
}

.bottom-right {
  bottom: 10%;
  right: 32%;
  animation: drift-4 7.3s ease-in-out infinite;
  animation-delay: 1.1s;
}

/* ANIMATIONEN */

/* Normale Icons */
@keyframes drift-1 { /*bewegt sich eher nach rechts*/
  0%   { transform: translate(0px, 0px); }
  25%  { transform: translate(4px, -6px); }
  50%  { transform: translate(8px, -2px); }
  75%  { transform: translate(3px, 5px); }
  100% { transform: translate(0px, 0px); }
}

@keyframes drift-2 { /*bewegt sich eher nach links*/
  0%   { transform: translate(0px, 0px); }
  25%  { transform: translate(-5px, -4px); }
  50%  { transform: translate(-9px, 3px); }
  75%  { transform: translate(-3px, 6px); }
  100% { transform: translate(0px, 0px); }
}

@keyframes drift-3 { /*größere Bewegung*/
  0%   { transform: translate(0px, 0px); }
  25%  { transform: translate(6px, -3px); }
  50%  { transform: translate(10px, 4px); }
  75%  { transform: translate(2px, 7px); }
  100% { transform: translate(0px, 0px); }
}

@keyframes drift-4 { /*Mischung aus Bewegung nach links und unten (diagonal)*/
  0%   { transform: translate(0px, 0px); }
  25%  { transform: translate(-4px, -5px); }
  50%  { transform: translate(-8px, 2px); }
  75%  { transform: translate(-2px, 6px); }
  100% { transform: translate(0px, 0px); }
}

/* Für die Icons, die vorher translateY(-50%) hatten */
@keyframes drift-middle-1 {
  0%   { transform: translateY(-50%) translate(0px, 0px); }
  25%  { transform: translateY(-50%) translate(5px, -5px); }
  50%  { transform: translateY(-50%) translate(9px, 2px); }
  75%  { transform: translateY(-50%) translate(2px, 6px); }
  100% { transform: translateY(-50%) translate(0px, 0px); }
}

@keyframes drift-middle-2 {
  0%   { transform: translateY(-50%) translate(0px, 0px); }
  25%  { transform: translateY(-50%) translate(-5px, -4px); }
  50%  { transform: translateY(-50%) translate(-10px, 3px); }
  75%  { transform: translateY(-50%) translate(-3px, 7px); }
  100% { transform: translateY(-50%) translate(0px, 0px); }
}

/* Kleinerer Bildschirm: Icons weiter nach außen */
@media (max-width: 900px) {
  .top-left {
    left: 34%;
  }

  .top-right {
    right: 20%;
  }

  .left {
    left: 12%;
  }

  .right {
    right: 12%;
  }

  .bottom-left {
    left: 22%;
  }

  .bottom-right {
    right: 28%;
  }

  .floating {
    width: 100px;
  }

  .logo {
    width: 220px;
  }

  .slogan {
    font-size: 18px;
  }
}

/* Noch kleinerer Bildschirm z.B. Handy: noch weiter raus + kleinere Icons */
@media (max-width: 600px) {
  .hero {
    min-height: calc(100vh - 180px);
  }

  .center {
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  .logo {
    width: 160px;
    height: auto;
  }

  .slogan {
    font-size: 15px;
    margin-top: 12px;
    position: relative;
    z-index: 3;
    padding: 0 12px;
  }

  .floating {
    width: 58px;
    z-index: 1;
  }

  .top-left {
    top: 10%;
    left: 20%;
  }

  .top-right {
    top: 14%;
    right: 12%;
  }

  .left {
    top: 34%;
    left: 6%;
    transform: translateY(-50%);
  }

  .right {
    top: 42%;
    right: 6%;
    transform: translateY(-50%);
  }

  .bottom-left {
    bottom: 18%;
    left: 16%;
  }

  .bottom-right {
    bottom: 14%;
    right: 16%;
  }
}

</style>