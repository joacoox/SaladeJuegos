import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent implements OnInit {
  word: Array<string> = [];
  emptySpaces: string[] = [];
  wrongKeys: string[] = [];
  wordIndex: number = 0;
  winFlag: boolean = false;
  img: Array<string> = ["./assets/ahorcado/ahorcado-cero.png",
    "./assets/ahorcado/ahorcado-uno.png",
    "./assets/ahorcado/ahorcado-dos.png",
    "./assets/ahorcado/ahorcado-tres.png",
    "./assets/ahorcado/ahorcado-cuatro.png",
    "./assets/ahorcado/ahorcado-cinco.png",
    "./assets/ahorcado/ahorcado-seis.png"
  ];

  errorNumber: number = 0;
  loseFlag: boolean = false;
  //ahorcado = inject(AhorcadoService);

  ngOnInit(): void {
    /*this.LoadNewWord(); // cargo 3 palabras ni bien inicia el componente
    console.log(this.word)*/
    console.log(this.word)
  }
  StartGame() {
    this.LoadNewWord();
    if ((this.emptySpaces.length == 0 ||
      this.word[this.wordIndex - 1].toString() == this.emptySpaces.join('').toString())
      && this.word.length > 0) {
      //this.CheckAccents(); // saco los acentos de las palabras
      this.DrawEmptySpaces(); // dibujo los espacios en blanco de la palabra
    }
  }
  RestartGame() { // reseteo los valores default y le pido a la api 3 palabras mas
    this.EnableButtons();
    this.ResetGame();
    this.LoadNewWord();
  }
  EnableButtons() {
    for (let index = 0; index < this.wrongKeys.length; index++) {
      const enabledKey = document.getElementById(this.wrongKeys[index]) as HTMLButtonElement;

      if (enabledKey) {
        enabledKey.disabled = false;
      }
    }
  }
  ResetGame() {
    this.wordIndex = 0;
    this.emptySpaces = [];
    this.winFlag = false;
    this.word = [];
    this.errorNumber = 0;
    this.loseFlag = false;
    this.wrongKeys = [];
  }

  LoadNewWord() {
    /* (this.ahorcado.getRandomWord()).subscribe(data => {
       this.word = data;
     });*/
    this.word.push("perro", "caserola", "conejo");
  }

  DrawEmptySpaces() {
    const i = this.wordIndex;
    if (this.word[i] && i <= this.word.length - 1) { // se verifica que la palabra en el indice i no sea nulo y que el array no sea mas largo que el indice
      console.log(this.word[i]);
      this.emptySpaces = []; // vaciamos el array  anterior
      for (let index = 0; index < this.word[i].length; index++) { // se recorre letra por letra la palabra x
        this.emptySpaces[index] = "_";      // creamos espacion en blanco por cada letra
      }
    } else {
      console.log("Ya jugaste las 3 palabras");
    }
  }

  DrawLetter(letter: string) {
    if (letter != "" && letter != null) {

      if (this.word[this.wordIndex]) {
        if (letter.length == 1 && this.emptySpaces.length > 2) { // se verifica que la envie una sola letra, y que haya espacios en blanco
          const currentWord = this.word[this.wordIndex];
          for (let index = 0; index < currentWord.length; index++) {
            if (currentWord[index] === letter) { // si la letra ingresada es igual a la letra que va en ese lugar se borra el espacio en blanco 
              this.emptySpaces[index] = letter;// y se agrega la letra
              this.CheckVictory();
            }
          }
          if (this.errorNumber <= 6) {
            if (this.wordIndex <= 2) {
              if (this.word[this.wordIndex].indexOf(letter) == -1 && this.emptySpaces.includes('_')) {
                // verifico que la letra actual no este en la palabra
                // tambien verifico que la palabra contenga espacion en blanco  
                const disabledKey = document.getElementById(letter) as HTMLButtonElement;

                if (disabledKey) {
                  disabledKey.disabled = true;
                  this.errorNumber += 1;
                  this.wrongKeys[this.wrongKeys.length] = letter;
                  if (this.errorNumber == 6) {
                    this.loseFlag = true;
                  }
                }

              }
            } else {
              this.winFlag = true;
            }

          } else {
            this.loseFlag = true;
          }
        }
      }
    }

  }

  CheckVictory() {
    if (!this.emptySpaces.includes('_')) { // cuando no hay mas espacios en blanco el usuario ya completo la palabra
      this.wordIndex += 1;
      this.EnableButtons();
      this.wrongKeys = [];
    }
  }

  CheckAccents() {
    for (let index = 0; index < this.word.length; index++) {
      this.word[index] = this.removeAccents(this.word[index]);
    }
  }

  removeAccents(palabra: any) {
    return palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}
