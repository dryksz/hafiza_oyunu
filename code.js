"use strict"; 

const ScorePanel = {
    move : 0,
    time : 0,
    star : 3,
    incrementTime : () => {
        ScorePanel.time += 1;
        ViewChanger.setTime(ScorePanel.time);
    },
    incrementMove : () => {
        ScorePanel.move += 1;
        ViewChanger.setMoves(ScorePanel.move);

        if (ScorePanel.move === 30) {         
            ScorePanel.star = 2;
            ViewChanger.setStars(2);
        } else if (ScorePanel.move === 40) {
            ScorePanel.star = 1;
            ViewChanger.setStars(1);
        } else {
        }
    },
    reset : () => {
        ScorePanel.move = 0;
        ScorePanel.star = 3;
        ScorePanel.time = 0;
        ViewChanger.setMoves(0);
        ViewChanger.setStars(3);
        ViewChanger.setTime(0);
    }
}
Object.seal(ScorePanel);

let Timer;
const Symbol = {
  DIL  : 'fa fa-sign-language',
    STAR      : 'fa fa-star',
   TELEFON   : 'fa fa-phone',
    MEZUNİYET    : 'fa fa-graduation-cap',
    YILDIZ    : 'fa fa-asterisk',
    KAHVE : 'fa fa-coffee',
    TİK    : 'fa fa-check-square',
    ANAHTAR   : 'fa fa-key',    
}
Object.freeze(Symbol);

const State = {
    CLOSED : 'card',
    OPENED : 'card open show',
    MATCHED : 'card open match',
}
Object.freeze(State);


const Deck = {
    cards : [Symbol.DIL, Symbol.DIL, Symbol.STAR, Symbol.STAR, Symbol.TELEFON, Symbol.TELEFON, Symbol.MEZUNİYET, Symbol.MEZUNİYET, Symbol.YILDIZ, Symbol.YILDIZ, Symbol.KAHVE, Symbol.KAHVE, Symbol.TİK, Symbol.TİK, Symbol.ANAHTAR, Symbol.ANAHTAR],
    opened : [],
    matched : [],
    shuffle : (array) => {
        for (let i = array.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        ViewChanger.setCardsSymbols(array);
    },
    reset : () => {
        console.log(`In Deck.reset() : `);
        Deck.opened.length = 0;
        Deck.matched.length = 0;
        for (let i = 0; i < Deck.cards.length; i++) {
            ViewChanger.closeCard(i);
        }
        Deck.shuffle(Deck.cards);
    },
    tryOpeningCard : ({index, symbol}) => {
        console.log(`In Deck.tryOpeningCard(${index}, ${symbol})`);
        Deck.opened.push({index,symbol})
        ViewChanger.openCard(index);
        
        if (Deck.opened.length === 2) { window.setTimeout(Deck.checkMatch, 200); } 
                       
    },
    checkMatch : () => {
        console.log(`In Deck.checkMatch() : `);
        const c0 = Deck.opened[0];
        const c1 = Deck.opened[1];

        if (c0.symbol !== c1.symbol ) {
            ViewChanger.closeCard(c0.index);
            ViewChanger.closeCard(c1.index);
            Deck.opened.length = 0;
        } else {
            ViewChanger.matchCard(c0.index);
             ViewChanger.matchCard(c1.index);            
            Deck.matched.push(c0, c1);
            Deck.opened.length = 0;
        }

        if (Deck.matched.length === Deck.cards.length) {

            console.log("you win");
            clearInterval(Timer);
            ViewChanger.hideStartButton(false);
        }

    },
}
Object.freeze(Deck);
Object.seal(Deck.cards)

class ViewChanger {
    static setStars(numStars) {
        console.log(`class ViewChanger setStars(${numStars}) : changes number of stars in View`);
        const d = document.getElementsByClassName("stars")[0];
        const starHTML = '<li><i class="fa fa-star"></i></li>';
        d.innerHTML = starHTML.repeat(numStars); 
    }

    static setMoves(numMoves) {
        console.log(`class ViewChanger setMoves(${numMoves}) : changes number of moves in View`);
        const d = document.getElementsByClassName("moves")[0];
        d.innerHTML = numMoves;
    }
    static setTime(seconds) {
        console.log(`class ViewChanger setTime(${seconds}) : changes timer in View`);
        const d = document.getElementsByClassName("timer")[0];
        d.innerHTML = seconds;
    }

    static openCard(cardIndex) {
        console.log(`class ViewChanger openCard(${cardIndex}) : opens up a card in deck`);
        const d = document.getElementsByClassName("card");
        d[cardIndex].setAttribute("class", State.OPENED);
    }

    static closeCard(cardIndex) {
        console.log(`class ViewChanger closeCard(${cardIndex}) : closes a card in deck`);
        const d = document.getElementsByClassName("card");
        d[cardIndex].setAttribute("class", State.CLOSED);
    }

    static matchCard(cardIndex) {
        console.log(`class ViewChanger matchCard(${cardIndex}) : changes a card in a match state`);
        const d = document.getElementsByClassName("card");
        d[cardIndex].setAttribute("class", State.MATCHED);
    }

    static setCardsSymbols(cards) {
        console.log(`class ViewChanger setCardsSymbols(${cards}) : set cards symbols`);
        const d = document.getElementsByClassName("card");
        for (let i = 0; i < cards.length; i++) {
            d[i].firstChild.setAttribute("class", cards[i]);
        }
    }

    static hideStartButton(bool) {
        const d = document.getElementsByClassName("modal")[0];
        if (bool === true) {
            d.innerHTML = `Ready to Play? <br><br>
            3 stars &lt; 30 moves <br>
            2 stars &lt; 40 moves <br>
            1 star  &gt;= 40 moves<br><br> 
            Click to Play`;
            d.className = "modal hide";
        } else {
            d.innerHTML = `Tebrikler! <br><br> ${ScorePanel.time} Saniyede <br> ${ScorePanel.move} hamlede  <br> ${ScorePanel.star} Yıldız kazandınız <br>  <br> tekrar oynamak için tıklayın`;
            d.className = "modal show";
        }
    }

}

class EventListener {
    static setClickStart() {
        console.log("class EventListener setClickStart() : setup click eventListener for start button...");
        console.log("[Listening...] start button ");
        const d = document.getElementsByClassName('modal')[0];
        d.addEventListener("click", EventHandler.clickStart);
    }

    static setClickRestart() {
        console.log("class EventListener setClickRestartListener() : setup click eventListener for restart button...");
        console.log("[Listening...] restart button ");
        const d = document.getElementsByClassName('restart')[0];
        d.addEventListener("click", EventHandler.clickRestart);
    }

    static setClickCards() {
        console.log("class EventListener setClickCardsListener(): setup click eventListener for each card...")
        console.log("[Listening...] card clicks");
        
        const d = document.getElementsByClassName("deck")[0];
        
       
        d.addEventListener("click", (e) => {
            const state = e.target.className;
            console.log(state);
            if (state === State.CLOSED) {
                EventHandler.clickCard(e);
            }
        });
    }
}

class EventHandler {
    static clickCard(e) {
        console.log(`[EVENT] user clicks card and triggers EventHandler.clickCard()`);
        console.log(`In class EventHandler clickCard() :`);

        const index = e.target.id;
        const state = e.target.className;
        const symbol = e.target.firstChild.className;

        ScorePanel.incrementMove();
        Deck.tryOpeningCard({index, symbol});
        
    }
    static clickRestart() {
        console.log('[EVENT] user clicks restart button and triggers EventHandler.clickRestart()');
        console.log("In class EventHandler clickRestart() : ");
        Deck.reset();
        ScorePanel.reset();
    }
    static clickStart(e) {
        console.log('[EVENT] user clicks start button and triggers EventHandler.clickStart()');
        console.log("In class EventHandler clickStart() : ");
        Deck.reset();
        ScorePanel.reset();
        Timer = setInterval(ScorePanel.incrementTime, 1000);
        ViewChanger.hideStartButton(true);

    }
}

function main() {
    console.log("function main() : Oyuna Hoşgeldiniz!");
    EventListener.setClickStart();
    EventListener.setClickRestart();
    EventListener.setClickCards();

}

main();
