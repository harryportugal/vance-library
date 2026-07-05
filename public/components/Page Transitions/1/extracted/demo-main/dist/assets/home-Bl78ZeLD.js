import{n as e}from"./index-DetvL2yZ.js";import{t}from"./Enter-BfDajnSS.js";var n=`<section class="hero">
  <div class="hero_content">
    <div class="links_codrops">
      <link-c href="https://tympanus.net/codrops/?p=109206" target="_blank">TUTORIAL</link-c>
      <link-c href="https://tympanus.net/codrops/hub/" target="_blank">MORE DEMOS</link-c>
    </div>
    <div class="lists_c">
      <ul>
        <li>
          <div class="lines">
            <div class="inner_lines inner_linesleft"></div>
          </div>
        </li>
        <li>
          <p class="anim_p">NAME</p>
          <p class="anim_p">L'Apothéose d'Hercule</p>
          <div class="lines">
            <div class="inner_lines inner_linesleft"></div>
          </div>
        </li>
        <li>
          <p class="anim_p">ARTIST</p>
          <p class="anim_p">François Lemoyne</p>
          <div class="lines">
            <div class="inner_lines inner_linesleft"></div>
          </div>
        </li>
        <li>
          <p class="anim_p">DATE</p>
          <p class="anim_p">1733-1736</p>
          <div class="lines">
            <div class="inner_lines inner_linesleft"></div>
          </div>
        </li>
      </ul>
      <!-- <img class="img_hero_small" alt="Oeuvre" src="/images/home.webp"></img> -->
      <ul>
        <li class="desktop">
          <div class="lines desktop">
            <div class="inner_lines inner_linesright"></div>
          </div>
        </li>
        <li>
          <p class="anim_p2">LOCATION</p>
          <p class="anim_p2">Château de Versailles</p>

          <div class="lines">
            <div class="inner_lines inner_linesright"></div>
          </div>
        </li>
        <li>
          <p class="anim_p2">Style</p>
          <p class="anim_p2">French baroque</p>

          <div class="lines">
            <div class="inner_lines inner_linesright"></div>
          </div>
        </li>

        <li>
          <p class="anim_p2">Dimensions</p>
          <p class="anim_p2">480m2</p>

          <div class="lines">
            <div class="inner_lines inner_linesright"></div>
          </div>
        </li>
      </ul>
    </div>

    <h1 class="home_title">AH.736</h1>
  </div>
</section>`;function r(){return n}function i(e={}){let n=e.container||document.querySelector(`[data-transition="container"]`),r=t(n,.32);r?.splitInstance&&(n._splitInstance=r.splitInstance)}function a(){let t=document.querySelector(`[data-transition="container"]`);if(t?._splitInstance){let n=t.querySelector(`h1`);n&&e.set(n.querySelectorAll(`.char-wrapper > *`),{clearProps:`all`}),t._splitInstance=null,n&&n.querySelectorAll(`.char-wrapper`).forEach(e=>{let t=e.firstChild;e.parentNode.insertBefore(t,e)})}}export{a as cleanup,r as default,i as init};