// popup control functions
let nameInputDiv = $('#name-input');
let nameinput = $('form > input');
let submitName = $('#name-input form button');
let nameFeed = $('.nameFeed');
const logs = console.log;

// Selected DOM gameboard items & items needed to feed to the gameboard buttons
const items = $('.item');
const itemsnative = [...new Set(items)];
const icons1 = ['5','1','3','4','6','2'];
const icons2 = ['$','❤','☆','★','♡','☺'];
const icons = icons2;
const hasMultiscore = [];
const dup_multiscore = [];
const addMultiscore = (x) => {
  this.addClass('multiscore');

}


const slotsLngth = items.length;
var gfxLngth = icons.length;
logs(slotsLngth + ':All slots.' + gfxLngth + ':Icons(gfx)count');
// const icons = icons1.concat(icons2);

// variables for the for loop to get a range of random numbers
var z = gfxLngth;
const randValue = () => {
    let x = Math.floor((Math.random() * z) + 0);
    return x;

};

let randValueNi = (high, low) => { // does this ought be a constant throughout?
    let xx = Math.floor((Math.random() * high) + low);
        return xx;

};

const togameboard = []; // for use in generating gameboard on each load
const playLog = []; // for logging each player move
const randomLog = []; // used for randomization checking
const timerLog = []; // to accurately account for timing of each pair made
const totalPoints = []; // for adding total points along the game

nameInputDiv.toggleClass('hidden');
nameInputDiv.toggleClass('popup');

// both actions should return name input and remove popup
nameinput.change(() => {
    // nameInputDiv.toggleClass('hidden');
    nameInputDiv.toggleClass('popup');
    nameFeed[1].html(nameinput.val());

});

/* standard BUTTONS */
// the submit button behaviour
submitName.click((event) => {
    nameInputDiv.toggleClass('popup');
    event.preventDefault();

});

// the style options buttons

$('#s1').click(() => {
    $('#gamearea').removeClass('style2');
    $('#gamearea > div').removeClass('style2');
    $('#gamearea > div > div').removeClass('style3');

});

$('#s2').click(() => {
    $('#gamearea > div > div').removeClass('style3');
    $('#gamearea').addClass('style2');
    $('#gamearea > div').addClass('style2');

});

$('#s3').click(() => {
    $('#gamearea').addClass('style2');
    $('#gamearea').removeClass('style2');
    $('#gamearea > div').removeClass('style2');
    $('#gamearea > div > div').addClass('style3');

});

const sumFunction = (total,num) => {
  return total + num;

}

// reset gameboard
$('#reset').click(() => {
    items.removeClass('newPlay');
    clearInterval(setTimer);

    $('#timer').text(0);
    $('#score').text(0);

    while (playLog.length > 0) {
        playLog.pop();

    }

    setTimer;

});

// starts the timer
let startTimer = () => {
    let x = document.getElementById('timer');
    let y = x.innerHTML;
    let z = parseInt(y);
    z+= 1;
    x.innerHTML = z;

};

// add the onlcick function to the gameBoard elements
for (let i = 0; i <= items.length; i++) {
        $('#'+i).click(() => {
            newPlay(i);

        });

};

//feed input name to display size as typing
nameinput.on('keyup', () => {
    nameFeed.html(nameinput.val());

});

/*let tgbcheck = togameboard.find(1);
logs(tgbcheck + 'find togameboard');*/

// to attempt to eliminate duplicate random numbers before pushing to the gameBoard
const getGameboard = togameboard.forEach((ret) => {
            logs(ret + " frm getGameboard");
                if (togameboard > 0 && ret == randValue()) {
                    return ret;
                }
            return false;

        });

const setTimer = setInterval(startTimer, 1000);

const newPlay = (x) => { // the play controls and points function
    let item = $('#'+x);
    let moves = playLog.length;

    // only if moves are 0 or even, not yet played and total moves are less than the complete board, log the play and disable block until reset
    if ((moves === 0 || moves % 2 === 0 && moves != 0) && moves < slotsLngth) {

          // to reset clock on the move after a valid pairs match
          if (moves != 0 && moves % 2 === 0) {
            $('#timer').html(0); // to restart timer after each valid match plays

          }

        $('#score').removeClass('scoreWobbActive');
        $('#score').removeClass('scoreWobbDblActive');

        item.addClass('newPlay'); // to record valid play ---> item['0'].id === i['0'].id || item['0'].innerHTML != i['0'].innerHTML
        playLog.push(item);
         // setTimer;
        logs(item['0'].id + ' console feed id# frm key data.');

      }/*
      else {
          clearInterval(setTimer);
          setTimer;

    }*/

    if (moves === 0) {
        logs(`First move now played... ${x}`)


        }
      else if (moves % 2 != 0 && moves < slotsLngth) {
      // on odd moves, checks if not yet played and total moves is less than complete board
          while (item.hasClass('newPlay') === false) {
            logs(`${item[0].id} is the current item value`)

            // conditions to negate invalid plays
            if (item[0].id === playLog[moves-1][0].id || item[0].innerHTML != playLog[moves-1][0].innerHTML) {

                // code for audio on errenous play should initialize here
                $('#movesaudio > #three').get(0).play();

                // end code for audio

                alert('invalid play');

            }
              else {

                playLog.push(item);

                // code for audio on valid play should initialize here
                $('#movesaudio > #two').get(0).play();

                // end code for audio

                // alert and log points upon a match
                // alert('Two Matched *!');
                if (item.hasClass('multiscore')) {
                  totalPoints.unshift(2000);
                  $('#score').toggleClass('scoreWobbDblActive');

                } else {
                  totalPoints.unshift(1000);
                  $('#score').toggleClass('scoreWobbActive');

                }


                // don't show timer after last match is accounted for
                if (playLog.length >= togameboard.length) {
                  $('#timer').addClass('hidden');
                  $('#movesaudio > #one').get(0).play();

                  } else {
                    $('#timer').removeClass('hidden');

                }

                let x = document.getElementById('timer').innerHTML;
                x = x.value;
                logs(`The current value of timer... is ${x}`);

                  playLog.forEach( (i) => {
                      logs(`${i[0].id} event, ${item[moves-1]} also should be the same`);

                          if (moves % 2 != 0) {
                            $('timer').html = -1;
                            // clearInterval(setTimer);
                            setTimer;

                            logs(playLog.length);
                            item.addClass('newPlay');

                          }

                  }) // end of ForEach on playLog

                  // begin scoreTracker, attempting to do points under this condition
                  let xx = document.getElementById('score').innerHTML;
                  let xxxxx = document.getElementById('timer').innerHTML;
                  let xxxx = totalPoints.reduce(sumFunction) - (xxxxx * 100); // reduce pts based on how many secs. user delays
                  document.getElementById('score').innerHTML = xxxx;

                  logs(`${xx} is on the score on the DOM.`);
                  logs(`${xxxx} is current score count.`);

                  // end scoreTracker

              }


              break;

            }; // end of while loop

      }

};

/* This may no longer be necessary.

 class Get {
    constructor(timer, points) {
        this.timer = timer;
        this.points = points;

    }

}

var scoreTrack = new Get('',''); // for to $('#timer').html()

*/

//$(document).ready(() => { // unnecessary when embedded

// append each of the given icons to a button on the gameboard twice in random sequence. The random return can only be controlled by a range starting from 0. So, it is not absolutely possible to limit the reccurences with this Javascript method unless maybe I limit the range from 0 to 2 and restart the loop every 2 pushes while pushing them all to an array and popping the two that already pushed. I attempted to push a random number from [0 to desired length] to an array replace any additional copy until it is complete. It didn't work because it kept looping and crashed so I had to just let it go without stressin for unique returns only. A good way may be to generate a first half randomly, and then pull values from a duplicate array to randomize the remaining half using the original values

let halfBoard = slotsLngth/2;

for (let x = 0; x < halfBoard; x++) {
    let y = randValue();
    //** randomLog.push(y); logs(randomLog + " random generated log.");

    if (togameboard.length == 0) {
        togameboard.push(y);
        items[x].append(icons[y]);
        continue;
    }

    if (togameboard.length > 0 && getGameboard === false ) {
        continue;

      } else {

          togameboard.push(y);
          //**  logs(togameboard + " all made it to the gameboard.");
          items[x].append(icons[y]);

          // duplicate the values of the first half of the gameboard to create matches for the game pattern
          while (x == (halfBoard - 1) && togameboard.length != slotsLngth) {
             togameboard.forEach((i) => {
                 togameboard.push(i);

             });

          }

    }

    // add code for extra point matches multiplier
    let colorpattern = x % 2 == 0 && x % 4 != 0 || y % 3 == 0;
    if (colorpattern) {
      var item = $('#'+x);
//      logs(`${y} is the value of y`);
      item.addClass('multiscore');
      hasMultiscore.push(item); // log item to array

    }

}

// to create second half of gameboard and randomize I will pull from the previous for loop which this will be dependent on because the values were already duplicated for use in the gameboard
for (let x = halfBoard; x < slotsLngth; x++) {
    let getRandom = randValueNi(x,(slotsLngth - slotsLngth));
    //**logs(getRandom + ' current random from togameboard'); // since this random value return does not work well I may have to feed the values from the ones already pushed to the DOM
    //    items[x].append(togameboard[getRandom] + 'temp');
    //    logs(getRandom);

}

// use DOM instead of Math.Random to create matching items
for (let i = 0; i < halfBoard; i++) {
    let n = halfBoard;
    let item = $('#'+i+1); // within loop selector for DOM buttons

    // to duplicate the gameboard list item content
    items[i+n].append(items[i].innerText); // plural selecting from the global

}

////////////////////////////////////////
// FOR MULTIPLIER WITH COLORED MATCHES
///////////////////////////////////////
    // to add multiplier styles to duplicates accurately on matching blocks and same amount only
    hasMultiscore.forEach( (item) => { //buttons with multiplier are dynamically fed in randomly by the colorpattern code so this has to be dependent
    //  logs(`${item[0].innerText} testing...`);
      let orig_multi = item[0].innerText;

      for (x = 0; x < slotsLngth; x++) {
          let find_dup = items[x];
          find_dup = find_dup.innerText;

          if (find_dup === orig_multi) {
            dup_multiscore.push(find_dup);
            logs(`${find_dup} && ${orig_multi} is matching duplicates to squares that are already with the color class.`);

          }

      }


    });

    // remove extra duplicates from dup_multiscore
    const reduceit = [dup_multiscore][0].reduce((x, y) => x.includes(y) ? x : [...x, y], []);
    // logs(`${reduceit} ought to be accurate pull of dynamic changes.`);
    // does the operation to add the duplicate of the colored blocks to the 2nd halfBoard

      let c = []; // an empty array for use to acct for duplicates on multiscore

      itemsnative.forEach( (item) => {
          let b = reduceit;
          logs(`${b.length} is the length of reduceit array.`)

          for (a=0; a < b.length; a++) {
            let e = a;
            let ce = c[e];
            logs(`${ce} is already a multiscore duplicate on the 2nd halfBoard.`);
            if (item.innerText === b[e] && item.id > halfBoard && b[e] != ce) {
              logs(`${item.id} is current loop focus.`);
              // make a conditional to filter addClass if there is already a duplicate on the 2nd halfBoard
              if (item.innerText != ce && c.length <= b.length) {
                logs(`${a} ought to be matching the ${ce} array log`);
                $('#'+item.id).addClass("multiscore"); // << easy does it
                // push this to empty array then add a conditional above to filter present after the loop
                c.push(`${item.innerText}`);

              }
/*              else {
                $('#'+item.id).removeClass("multiscore");
                logs(`Essentially should not need to occur...`);

              } */

            }

          }
//          logs(`${c} & ${c.length} ... alright...`);

      });





/////////////////////////////////////////////
// END - FOR MULTIPLIER WITH COLORED MATCHES
/////////////////////////////////////////////
