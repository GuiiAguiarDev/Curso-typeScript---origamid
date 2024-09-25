export default class Timeout {
  id;
  handler;
  start;
  timeLeft;
  constructor(handler: TimerHandler, time: number) {
    this.id = setTimeout(handler, time);
    this.handler = handler;
    this.start = Date.now();
    this.timeLeft = time;
  }

  //metodo para limapr quando eu aperta na imagem no meu slider ele ir para o proximo e resetar o tempo
  //assim nao ficar passando rapido, tirando o bug, então aperto para passar para po proximo ele
  //vai manter os 3 segundos por exemplo que coloquei para todos, lembrando que poderia
  //ser qualquer tempo eu eu setar, com esse codigo ele volta o tempo inicial fazendo o slide ficar
  //o tempo certo.
  clear() {
    clearTimeout(this.id);
  }

  //mater a pausa pausar e continuar ou seja ficar o tempo certo se dei pause assim que começou o slide quando
  //eu soltar ele ainda fica bastante tempo pq tem o tmepo restante mesma coisa se eu esperar para pausar
  //e pausar so no final e soltar ele ja vai para o proximo, então o tempo fica certinho com essa função
  //abaixo
  pause() {
    //tempo que passou do click
    const passed = Date.now() - this.start;
    this.timeLeft = this.timeLeft - passed;
    this.clear();
  }
  continue() {
    this.clear();
    this.id = setTimeout(this.handler, this.timeLeft);
    this.start = Date.now();
  }
}
