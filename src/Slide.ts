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
    //slide numero que está começa do 0
    this.index = 0;
    //qual slide está mostra o slide de acordo com index
    this.slide = this.slides[this.index];
    this.paused = false;
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
  }

  //Mostrar o slide
  //vai mostrar em cima do index
  show(index: number) {
    //Mostrar qual index esta ativo;
    this.index = index;
    //Mostrar qual elemento esta ativo;
    this.slide = this.slides[this.index];
    //removendo a classe sctive que está no css que serve para mo0strar o slide, esse codigo retira do anterior
    //depois que ativa no novo para nao ficar codigo duplicado no meu html
    //inclusive tira o active que deixamos como inicial no meu arquivo index.html
    //para começar com ele, posso até retirar o class de lá, sendo o class="active".
    this.slides.forEach((el) => this.hide(el));
    //adicionando a classe active que está no css para mostrar o slide
    this.slide.classList.add("active");
    this.auto(this.time);
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
  //vai dicionar os controles inicialmente
  private init() {
    //ele que vai mostrar o primeiro slide em cima do index tbm
    this.addControls();
    this.show(this.index);
  }

  //Controles
}
