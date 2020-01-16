// popup control functions
let nameInputDiv = $('#name-input');
let nameinput = $('form > input');
let submitName = $('#name-input form button');
let startButton = submitName;
let nameFeed = $('.nameFeed');
const logs = console.log;

// Selected DOM gameboard items & items needed to feed to the gameboard buttons
const items = $('.item');
const displayPrevPlay = $('#displayPrevPlay > span');
const itemsnative = [...new Set(items)];
const icons1 = ['1','2','3','4','5','6'];
const icons2 = ['☆','★','♡','❤','$','☺'];
const icons = icons1;
const hasMultiscore = [];
const dup_multiscore = [];

// ## var works = dup_limit.filter(duplicates); // if only using numbers as content can this be used for easier results....
let dup_limit = [];
let ce = [];
const newarr = [];

const addMultiscore = (x) => {
  x.addClass('multiscore'); // #DOMinsert

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
var totalPointsPrev = [];

nameInputDiv.toggleClass('hidden');
nameInputDiv.toggleClass('popup');

// both actions should return name input and remove popup
nameinput.change(() => {
    // nameInputDiv.toggleClass('hidden');
    nameInputDiv.toggleClass('popup');
    nameFeed[1].html(nameinput.val());

});

/* standard BUTTONS */
// the submit button event
submitName.click((event) => {

    nameInputDiv.toggleClass('popup');
    event.preventDefault();

});

// the style options buttons

$('#s1').click(() => {
    $('#gamearea').removeClass('style2');
    $('#gamearea > div').removeClass('style2');
    $('#gamearea > div > div').removeClass('style3');
    $('.multiscore').removeClass('popmultiscore');

});

$('#s2').click(() => {
    $('#gamearea > div > div').removeClass('style3');
    $('#gamearea').addClass('style2');
    $('#gamearea > div').addClass('style2');
    $('.multiscore').removeClass('popmultiscore');

});

$('#s3').click(() => {
    $('#gamearea').addClass('style2');
    $('#gamearea').removeClass('style2');
    $('#gamearea > div').removeClass('style2');
    $('#gamearea > div > div').addClass('style3');
    $('.multiscore').addClass('popmultiscore');

});

const sumFunction = (total,num) => {
  return total + num;

}

// reset gameboard
$('#reset').click(() => {
    items.removeClass('newPlay');
    clearInterval(setTimer);
	totalPointsPrev.push(totalPoints); // unused
	let tplength = totalPoints.length;
	for (c = 0; c < tplength; c++) {
		totalPoints.pop();

	}

    $('#timer').text(0);
    $('#score').text(0);
    displayPrevPlay.text(`no plays made`);

    while (playLog.length > 0) {
        playLog.pop();

    }


});

// new gameboard
$('#newgmbrd').click(() => {
  location.reload(true);

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

const setTimer = (x) =>{ setInterval(startTimer, 1000); }

const newPlay = (x) => { // the play controls and points function
    let item = $('#'+x);
    let moves = playLog.length;

    // only if moves are 0 or even, not yet played and total moves are less than the complete board, log the play and disable block until reset
    if ((moves === 0 || moves % 2 === 0 && moves != 0) && moves < slotsLngth) { // for first or even moves

        // to reset countup timer
        $('#timer').html(0); $('#timer').removeClass('hidden');

        $('#score').removeClass('scoreWobbActive');
        $('#score').removeClass('scoreWobbDblActive');

        item.addClass('newPlay'); // #DOMinsert to record valid play ---> item['0'].id === i['0'].id || item['0'].innerHTML != i['0'].innerHTML
        playLog.push(item);

        logs(item['0'].id + ' console feed id# frm key data.');

      }

    if (moves === 0) {
        // upon the first valid play...
        setTimer(-1000);
        logs(`First move now played... ${x}`)
        displayPrevPlay.text(`${playLog[0][0].innerHTML}`);

        }
      else if (moves > 0 && moves % 2 === 0) {
        // for upon first move of all other pairs, not for first move or matching move
        displayPrevPlay.text(`${playLog[moves][0].innerHTML}`);

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

                // on invalid and odd plays change the prev play displayed for easier user gameplay
                displayPrevPlay.text(`${playLog[moves-1][0].innerHTML}`);
                alert(`invalid play ${item[0].innerText}, to continue find another ${playLog[moves-1][0].innerText} on the gameboard.`);

            }
              else {

                playLog.push(item);
                // on valid plays change the prev play displayed for easier user gameplay
                displayPrevPlay.text(`${playLog[moves-1][0].innerHTML}`);

                // code for audio on valid play should initialize here
                $('#movesaudio > #two').get(0).play();
                // end code for audio

                // alert and log points upon a match
                // alert('Two Matched *!');
                $('#timer').addClass('hidden');
                if (item.hasClass('multiscore')) {
                  totalPoints.unshift(2000);
                  $('#score').toggleClass('scoreWobbDblActive');

                } else {
                  totalPoints.unshift(1000);
                  $('#score').toggleClass('scoreWobbActive');

                }


                // don't show timer after last match is accounted for
                if (playLog.length == togameboard.length) {
                  $('#timer').addClass('hidden');
                  $('#movesaudio > #one').get(0).play();

                }

                let x = document.getElementById('timer').innerHTML;
                x = x.value;
                logs(`The current value of timer... is ${x}`);

                  playLog.forEach( (i) => {
                      logs(`${i[0].id} event, ${item[moves-1]} also should be the same`);

                          if (moves % 2 != 0) {
                            $('timer').html = 0;

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

//$(document).ready(() => { // unnecessary when embedded }

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
    // let colorpattern = x % 2 == 0 && x % 4 != 0;
    let colorpattern = x % 2 == 0 && x % 4 != 0 || x * 2 > halfBoard && x % 2 != 0;

    if (colorpattern) {
      var item = $('#'+x);
      var xx = items.length;
      // var item2 = $('#'+x+xx); // #c2 possible if after generated

      addMultiscore(item); // item.addClass('multiscore');
      // addMultiscore(item2); // #c2
      hasMultiscore.push(item);
      dup_multiscore.push(item[0].innerText);

    }

}

// to create second half of gameboard and randomize I will pull from the previous for loop which this will be dependent on because the values were already duplicated for use in the gameboard
for (let x = halfBoard; x < slotsLngth; x++) {
    let getRandom = randValueNi(x,(slotsLngth - slotsLngth));

}

// use DOM instead of Math.Random to create matching items
for (let i = 0; i < halfBoard; i++) {
    let n = halfBoard;
    let item = $('#'+i+1); // within loop selector for DOM buttons

    // to duplicate the gameboard list item content
    items[i+n].append(items[i].innerText); // plural selecting from the global

}

///////////////////////////////////////
// FOR MULTIPLIER WITH COLORED MATCHES
///////////////////////////////////////

    // to add multiplier styles to duplicates accurately on matching blocks and same amount only

    const lngth_orig_multscore = () => {
      return hasMultiscore.length;

    }

    const retDupAmount = () => {
      logs(`${dup_multiscore.length} mirrors ${hasMultiscore.length} >> make this the unique amount of duplicates per play.`);

      return hasMultiscore.length;

    }

    const evenDups = () => { // useful for console logs and getting exact amount of duplicate multiscore
      return lngth_orig_multscore === retDupAmount();

    }

    let thiscount = []; // doubles dup_multiscore count
    let thiscount2 = []; // array for making another duplicate limiter.
    let thiscount3 = []; // unused

    dup_multiscore.forEach( (item) => {

      let total = items.length; // global
      let loopset = total/2+1;
      logs(`${item} is item.`); // local
      logs(`dup_multiscore loop count accurate to ${thiscount} && ${thiscount2.length}`);

      thiscount2 = []; // reset
      logs(`${thiscount2.length} is thiscount2 length at reset`);
      // logs(`${thiscount3.length} is thiscount 3 length.`)

        for (y = 0; y < loopset; y++) { // loops through entire 1st halfBoard
          let grab = items[y].id;
          let grab_doms = items[y].innerText;
          let grab_obj = items[y];
          let xx = y+1;
          let x = $('#'+(xx));
          let hasClassAlr = x.hasClass('multiscore') === true;

          if (grab_doms == item && hasClassAlr) { // to get instancecount
            logs(`${x[0].innerText} has styleclass 'multiscore' is ${hasClassAlr}.`);
            logs(`${item} is given item as matching ${grab_doms}.`);
            thiscount2.push(grab_doms);
            logs(`Just pushed ${grab_doms} to thiscount2 within inner loop @ ${y}.`);
            instancecount = thiscount2.length;

            logs(`${instancecount} is amount of instances for ${grab_doms} @ loop ${y}. Transposal should be to id#${loopset+y}`);

            renderAmount(instancecount);

          }

          /* render accurate multiscore styles for 2nd halfBoard. */
          renderAmount = (num) => {

            let count = []; // local count for multiple instances -1 if non-multiple already set
            let count2 = num + count.length;
            let offset = thiscount.length - 1;
            logs(`${count2} is count2 && offset is ${offset}.`);

            var a = () => {
                for (c = loopset; c < total || offset == retDupAmount(); c++) {
                  let ly = loopset + y - 1;
                  let skiploop = []; // continue; can't work because using manual loops within forLoop
                  logs(`a() loop is at >> id#${c} @ y loop >> #${y}`);
                  let grab_doms_2 = items[ly].innerText; /**/
                  let grab_obj_2 = items[ly]; /**/
                  logs(`${grab_doms_2.innerText} is grab_doms_2.`);

                  count.forEach( (x) => {

                    if (skiploop.length == 0 && x.innerHTML === grab_obj_2.innerHTML) {
                      logs(`${x} is already contained in count.`);
                      skiploop.push(x)

                    }

                  })

                  if (skiploop.length == 0) {
                    addMultiscore($(grab_obj_2));
                    logs(`Added multiscore style to DOM for ${grab_obj_2.innerText}.`);
                    count.push(grab_obj_2);

                    logs(`Count is @ ${count.length} @ id#${c} displaying ${grab_obj_2.innerText}`);

                  } else {

                    logs(`${skiploop} is skiploop. ${skiploop.length}`);

                  }

                } // end of manual for loop (c)

            }

            a();

          }
          /* end render sequence ************** */


        } /* end manual forloop (y) */

      thiscount.push(item);

      logs(`entire forloop @ loop ${thiscount.length}... ${thiscount2.length} is length of thiscount2 array containing ${thiscount2} >> for 'thiscount' is accurate @ loop ${thiscount.length}`);

    });

/////////////////////////////////////////////
// END - FOR MULTIPLIER WITH COLORED MATCHES
/////////////////////////////////////////////
