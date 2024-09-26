import Timeout from "./Timeout.js";

export default class Slide {
  //Esses element abaixo está fazendo ficar elemento duplicado, mas nao tem problema é so area
  //eu saber que da para fazer com ele tambem assim como sem.
  container: Element;
  slides: Element[];
  controls: Element;
  time: number;
  index: number;
  slide: Element;
  timeout: Timeout | null;
  pausedTimeout: Timeout | null;
  paused: boolean;
  thumbItens: HTMLElement[] | null;
  thumb: HTMLElement | null;

  //o que vai receber
  constructor(
    container: Element,
    slides: Element[],
    controls: Element,
    //tempo que passa os slides
    time: number = 5000 //
  ) {
    this.container = container;
    this.slides = slides;
    this.controls = controls;
    this.time = time;
    this.timeout = null;
    this.pausedTimeout = null;
    //slide numero que está começa do 0, pode ser zero ficando o codigo assim   this.index = 0;
    //mas vamos deixa igual abaixo
    //vamos pegar o primeiro lá do localStorage agora para ver se tem ou nao tem.

    //Quando reinicia o slide ou seja quando dou f5 na pagina ele começa de onde parou
    //pois ele pega no localstore o ultimo, então se dou f5 quando carregar o f5 vai mostrar o ultimo que estava quando deu f5.
    //se nunca entrou começa do 0
    this.index = localStorage.getItem("activeSlide")
      ? Number(localStorage.getItem("activeSlide"))
      : 0;
    //qual slide está mostra o slide de acordo com index
    this.slide = this.slides[this.index];
    this.paused = false;

    this.thumbItens = null;
    this.thumb = null;

    //chamando a função
    this.init();
  }

  //----------------------------------------------------------------------------------------
  //Funções
  //esconde o elemento no caso o slide, mas pode ser usado para outros exemplos fica a dica
  //lembrando que estou chamando ele no meu show, ou seja quando ele mostrar ele já ativa
  //esse tambem para esconder os anteriores
  hide(el: Element) {
    el.classList.remove("active");
    //reiniciar o video começar de novo, assim que mudar de slide ou voltar  para ele ele iniciar
    //do zero começar tudo de novo
    if (el instanceof HTMLVideoElement) {
      el.currentTime = 0;
      el.pause();
    }
  }

  //Mostrar o slide
  //vai mostrar em cima do index
  show(index: number) {
    //Mostrar qual index esta ativo;
    this.index = index;
    //Mostrar qual elemento esta ativo;
    this.slide = this.slides[this.index];
    //salvando qual slide a pessoa está no localStorage se está no 1 2 3 4 e etc
    localStorage.setItem("activeSlide", String(this.index));

    if (this.thumbItens) {
      this.thumb = this.thumbItens[this.index];
      this.thumbItens.forEach((el) => el.classList.remove("active"));
      this.thumb.classList.add("active");
    }

    //removendo a classe sctive que está no css que serve para mo0strar o slide, esse codigo retira do anterior
    //depois que ativa no novo para nao ficar codigo duplicado no meu html
    //inclusive tira o active que deixamos como inicial no meu arquivo index.html
    //para começar com ele, posso até retirar o class de lá, sendo o class="active".
    this.slides.forEach((el) => this.hide(el));
    //adicionando a classe active que está no css para mostrar o slide
    this.slide.classList.add("active");
    //verificando se é video para gente trabahar em cima do video, que vai ter o tempo diferente
    //dos slides ou seja se tiver 10 segundo vai rodar os 10 segundo e assim por diante
    if (this.slide instanceof HTMLVideoElement) {
      this.autoVideo(this.slide);
    } else {
      this.auto(this.time);
    }
  }
  autoVideo(video: HTMLVideoElement) {
    //para começar sozinho o video
    //igual a false tira o muted do video
    video.muted = true;
    //iniciar automatico o video assim que chega nele nos slides
    video.play();
    let firstPlay = true;
    //só quando o video estiver tocando
    video.addEventListener("playing", () => {
      //quantidade que eu quero que o video fique tocando
      //tocar o total dele o tamanho que ele tiver
      //verificano se é o primeiro fristPlay ocorre so uma vez isso
      if (firstPlay) this.auto(video.duration * 1000);
      firstPlay = false;
    });
  }
  //Funções
  //----------------------------------------------------------------------------------------

  //Controles

  //função atomatico quando apertar em um ficar indo automatico
  auto(time: number) {
    //limpando o anterior
    this.timeout?.clear();
    //quando eu clicar para ir para o proximo zerar o tempo e começar de novo evitando bug de vc apertar
    //e ele sair rapido doq vc estava pq tava contando o tempo já, alem dele chamar o pausar slider
    //que vai está nesse timeout que vamos fazer
    this.timeout = new Timeout(() => this.next(), time);
    //Quando acabar o tempo do ultimo ele começar tudo de novo e fica o tempo certo de cada item nao precisa eu setar no
    //no css so colocando no ts ele ja pega o tempo certo de cada jubtamente com a animação da thumb
    if (this.thumb) this.thumb.style.animationDuration = `${time}ms`;
  }

  //controle que manda para o anterior slide
  prev() {
    //evitando que ative o proximo quando eusoltar o dedo ou mouse do slide e ir para o proximo
    //pois eu estou pausando ou despausando e não clicando para ir para o proximo
    if (this.paused) return;
    const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1;
    this.show(prev);
  }

  //controle que manda para o proximo slide
  next() {
    //evitando que ative o proximo quando eusoltar o dedo ou mouse do slide e ir para o proximo
    //pois eu estou pausando ou despausando e não clicando para ir para o proximo
    if (this.paused) return;
    //calculo para arrumar o slide o erro de quando chega no ultimo e primeiro voltando tudo
    const next = this.index + 1 < this.slides.length ? this.index + 1 : 0;
    this.show(next);
  }

  //função pausar slide

  pause() {
    //limpando o anterior
    this.pausedTimeout = new Timeout(() => {
      this.timeout?.pause();
      //verificando se está pausando ou nao, pois se eu clico para
      // pausar, mas se eu solto o dedo ou tiro ou clique
      //ele ativa o botão para ir para o proximo e eu nao quero isso
      this.paused = true;
      //quando eu passar o slider, pausar a animation tbm da thumb, ele vai adicionar essa classe, que ja criei lá no meu css
      this.thumb?.classList.add('paused');
      //pausar o video quando eu apertar nele e soltar ele voltar a rodar
      if (this.slide instanceof HTMLVideoElement) this.slide.pause();
    }, 300);
  }

  //para que depois que agente pausar ele voltar ao normal e ficar indo para o proximo
  //pois como arrumamos o pause para que depois que soltasse o click ou dedo ele nao fosse para o prixmo
  //e sim continuasse normal, acabou bugando essa parte, pois ele fica pausado pra sempre, então
  //temos que inclementar essa função.
  continue() {
    this.pausedTimeout?.clear();
    if (this.paused) {
      this.paused = false;
      this.timeout?.continue();
      //removendo a classe pause da quando pausar slider pausar animation tbm da thumb
      this.thumb?.classList.remove('paused');
      //pausar o video quando eu apertar nele e soltar ele voltar a rodar
      if (this.slide instanceof HTMLVideoElement) this.slide.play();
    }
  }

  //vamos deixar privado, não queremos ninguem acessando ele, só vai ativar uma vez
  private addControls() {
    //criando os botões apartir do ts para o html
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    prevButton.innerText = "Slide Anterior";
    nextButton.innerText = "Próximo Slide";
    this.controls.appendChild(prevButton);
    this.controls.appendChild(nextButton);

    this.controls.addEventListener("pointerdown", () => this.pause());
    this.controls.addEventListener("pointerup", () => this.continue());
    //adicionando o evento
    //pointerup - funciona com perfil de toque tambem e quando tira o dedo ou mouse ele vai para o proximo
    //então caso seguro o dedo ou mouse ele dar pause, mas vamos ter fazer o pause ainda
    //vamos sempre usar arrowFunction pq é melhor, se nos utilizamos direto temos que dar o baint
    //e com arrowFunction nao
    prevButton.addEventListener("pointerup", () => this.prev());
    nextButton.addEventListener("pointerup", () => this.next());
  }

  //trumb, intens que ficam no slide mostrando a posição
  private addThumbItems() {
    const thumbContainer = document.createElement("div");
    thumbContainer.id = "slide-thumb";
    for (let i = 0; i < this.slides.length; i++) {
      thumbContainer.innerHTML += `<span><span class="thumb-item"><span></span>`;
    }

    this.controls.appendChild(thumbContainer);
    this.thumbItens = Array.from(document.querySelectorAll(".thumb-item"));
  }
  //vai dicionar os controles inicialmentes
  private init() {
    //ele que vai mostrar o primeiro slide em cima do index tbm
    this.addControls();
    this.addThumbItems();
    this.show(this.index);
  }

  //Controles
}
