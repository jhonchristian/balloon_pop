
// Buttons
let btn_inflate       = document.getElementById("btn-inflate");
let btn_start_game    = document.getElementById("btn-start");
let btn_set_player    = document.getElementById("btn-set_player");
let player_form       = document.getElementById("player-form");
let game_container    = document.getElementById("game-container");
let btn_change_player = document.getElementById("btn-change_player");
let main_controls     = document.getElementById("controls");
let game_control      = document.getElementById("game");
let balloon           = document.getElementById("balloon");
let scoreboard        = document.getElementById("scoreboard");
//#region Game logic and Data

// Data
let clicked_btn_inflate = 0;
let balloon_height      = 140;
let balloon_width       = 100;
let inflation_rate      = 20;
let max_inflation       = 300;
let current_pop_count   = 0;
let highest_pop_count   = 0;
let game_length         = 10000;
let timer_id            = 0;
let remaining_time      = 0;
let current_player      = {};
let current_color       = "red";
let possible_colors     = ["red", "green", "blue", "purple", "pink"];

/**
 * Will start the game
 */
function start_game() {
    main_controls.classList.add("hidden");
    game_control.classList.remove("hidden");
    scoreboard.classList.add("hidden");
    start_timer();
    setTimeout(stop_game, game_length);
}

/**
 * Will start the timer
 */
function start_timer() {
    remaining_time = game_length;
    draw_timer();
    timer_id = setInterval(draw_timer, 1000);
}

/**
 * Will stop the timer
 */
function stop_timer() {
    clearInterval(timer_id);
}

/**
 * Will display the timer
 */
function draw_timer() {
    let countdown = document.getElementById("countdown");
    countdown.innerText = (remaining_time / 1000).toString();
    remaining_time -= 1000;
}

/**
 * Will inflate the balloon
 */
function inflate() {

    clicked_btn_inflate++;
    
    balloon_height += inflation_rate;
    balloon_width  += inflation_rate;
    check_balloon_pop();
    draw();
}

function check_balloon_pop() {
    if (balloon_height >= max_inflation) {
        balloon.classList.remove(current_color);
        get_random_color();
        balloon.classList.add(current_color);

        // @ts-ignore
        document.getElementById("pop_sound").play();

        current_pop_count++;
        balloon_height = 40;
        balloon_width = 0;
    }
}

/**
 * This will get random colors
 */
function get_random_color() {
    let index = Math.floor(Math.random() * possible_colors.length);
    current_color = possible_colors[index];
    
}

/**
 * This will handle the game display for the screen
 * The balloon, number of pop and inflate
 */
function draw() {
    let click_count  = document.getElementById("click-count");
    let pop_count    = document.getElementById("pop-count");
    let high_pop     = document.getElementById("high-pop_count");
    let display_name = document.getElementById("display-player_name");
    
    balloon.style.height  = balloon_height + "px";
    balloon.style.width   = balloon_width + "px";

    click_count.innerText = clicked_btn_inflate.toString();
    pop_count.innerText   = current_pop_count.toString();
    high_pop.innerText    = current_player.top_score;
    display_name.innerText= current_player.name;
}

/**
 * Will stop the game and set the highest pop count
 */
function stop_game() {
    main_controls.classList.remove("hidden");
    game_control.classList.add("hidden");
    scoreboard.classList.remove("hidden");

    clicked_btn_inflate = 0;
    balloon_height      = 120;
    balloon_width       = 100;

    if(current_pop_count > current_player.top_score) {
        current_player.top_score = current_pop_count;
        save_player();
    }
    current_pop_count = 0;

    stop_timer();
    draw();
    draw_scoreboard();
}

//#endregion

//#region Player Logic and Data
let players = [];

load_players();

/**
 * Will set the player
 * @param {object} event 
 */
function set_player(event) {   

    event.preventDefault();

    let form           = event.target;
    let player_name    = form.player_name.value;
    current_player = players.find(player => player.name === player_name);

    if(!current_player) {
        current_player = { name: player_name, top_score: 0 };
        players.push(current_player);
        save_player();
    }

    form.reset();
    game_container.classList.remove("hidden");
    player_form.classList.add("hidden");
    draw();
    draw_scoreboard();
}

/**
 * This willl hide the game and displays the form
 */
function change_player() {
    game_container.classList.add("hidden");
    player_form.classList.remove("hidden");
}

/**
 * Save the player in the LocalStorage
 */
function save_player() {
    set_item("players", JSON.stringify(players));
}

/**
 * Load players data
 */
function load_players() {
    let data= JSON.parse(get_item("players"));
    players = data ? data : [];
}

/**
 * Will display the the players and their scores in the score board
 */
function draw_scoreboard() {
    let template = ""

    players.sort((p1, p2) => p2.top_score - p1.top_score);
    players.forEach(player => {
        template += `
                        <div class="d-flex space-between">
                            <span>
                                <i class="fa fa-user" aria-hidden="true"></i>
                                ${player.name}
                            </span>
                            <span>Score: ${player.top_score}</span>
                        </div>
                    `;
    });

    document.getElementById("players").innerHTML = template;
}

draw_scoreboard();
//#endregion

//--------------------------------------------------//
//                      Events                      //
//--------------------------------------------------//

register_event(btn_inflate, "click", inflate);
register_event(btn_start_game, "click", start_game);
register_event(player_form, "submit", set_player);
register_event(btn_change_player, "click", change_player);