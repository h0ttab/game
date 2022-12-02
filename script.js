// Initital settings
const log = document.getElementById('combatLog');
let p1_name = 'Ричард Львиное Сердце';
let p2_name = 'Король Артур';
document.getElementById('player1__name').textContent = p1_name;
document.getElementById('player2__name').textContent = p2_name;
let p1_hp = document.getElementById('player_1_hp').value;
let p2_hp = document.getElementById('player_2_hp').value;
let turn = 'Ход игрока 1';

// Player 1 stats
let p1_max_hp = 100;
let player1_damage = 15;
let player1_block = 0;
let player1_crit = 25;

// Player 2 stats
let p2_max_hp = 100;
let player2_damage = 15;
let player2_block = 0;
let player2_crit = 25;

// Initial functions call
p1_hp = p1_max_hp;
p2_hp = p2_max_hp;
turns();
update();

function ScrollToBottom() { // Функция позволяет держать журнал боя внизу, когда появляется скрол, т.е. чтобы показывать последние сообщение.
    const d = document.getElementById("combatLog");
    d.scrollTop = d.scrollHeight;
}

function update() { // Функция обновляет отображение полоски HP в соотв. с переменными, проверяет не победил ли кто-то из игроков, и выводит числовое значение HP рядом с полоской.
    updateHP();
    hpCheck();
    displayHP();
}

function attack(player) { // Функция атаки. Принимает в виде агрумента имя атакующего игрока - player1 или player2.
    turns();
    // hpCheck();
    update();
    if (p1_hp <= 0 || p2_hp <= 0) {
        return;
    } 
    
    if (player == 'player_1' && player2_block == 0) { // Игрок 1 атакует игрока 2, у игрока 2 нет блока.
        if (crit('player 1') == true) {
            return;
        } else {
        p2_hp -= player1_damage;
        player1_block = 0;
        combatLog(p1_name + ' наносит удар игроку ' + p2_name + '.' + ' (-' + player1_damage + 'HP)');
        }
    } 

    else if (player == 'player_1' && player2_block == 1) { // Игрок 1 атакует игрока 2, игрок 2 блокирует.
        combatLog(p2_name + ' заблокировал удар игрока ' + p1_name);
        player1_block = 0;
        player2_block = 0;
    } 
    
    else if (player == 'player_2' && player1_block == 0) { // Игрок 2 атакует игрока 1, у игрока 1 нет блока.
       if (crit('player 2') == true) {
        return;
       } else {
        p1_hp -= player2_damage;
        player2_block = 0;
        combatLog(p2_name + ' наносит удар игроку ' + p1_name + '.' + ' (-' + player2_damage + 'HP)')
       }
    } 
    
    else if (player == 'player_2' && player1_block == 1) { // Игрок 2 атакует игрока 1, игрок 1 блокирует.
        combatLog(p1_name + ' заблокировал удар игрока ' + p2_name);
        player1_block = 0;
        player2_block = 0;
    } 
    update();
    console.log(p1_hp);
    console.log(p2_hp);
}

function block(player) { // Функция блока. Персонаж может поставить блок (playerX_block = 1) и тогда следующий удар по нему не нанесёт урона, а параметр block будет сброшен на 0.
    if (player == 'player_1') {
        player1_block = 1;
        combatLog(p1_name + ' готов блокировать следующий удар.');
        turns();
    } else {
        player2_block = 1;
        combatLog(p2_name + ' готов блокировать следующий удар.');
        turns();
    }
}

function resetGame() { // Сброс всех параметров на параметры по умолчанию
    p1_hp = p1_max_hp;
    p2_hp = p2_max_hp;
    player1_block = 0;
    player2_block = 0;
    turn = 'Ход игрока 1';
    turns();
    update();
    log.innerHTML = '';
}

function randomChance(percent) { // This function takes an integer argument (percent) and returns true with a (percent)% chance. 
    let chance = Math.floor(Math.random() * 99 + 1);
    if (chance <= percent) {
        return true;
    } else {
        return false;
    }
};

function crit(player) { /* Функция принимает имя игрока в виде аргумента и наносит другому игроку урон * множ. крита, если случайное число от 1 до 100 попадает в диапазон крит шанса игрока.
                        Например, player1_crit = 10, означает, что игрок 1 наносит критический удар, если случайное число от 1 до 100 будет меньше или равно 10 (т.е. вероятность 10%). */
    let critMultiplier = 2; // Задаёт множитель урона от критического удара
    
    if (player == 'player 1' && randomChance(player1_crit) == true) {
        p2_hp -= player1_damage * critMultiplier;
        player2_block = 0;
        update();
        combatLog(p1_name + ' наносит критический урон игроку ' + p2_name + '.' + ' (-' + (player1_damage * critMultiplier) + 'HP)');
        return true;
    } else if (player == 'player 2' && randomChance(player2_crit) == true) {
        p1_hp -= player2_damage * critMultiplier;
        player1_block = 0;
        update();
        combatLog(p2_name + ' наносит критический урон игроку ' + p1_name + '.' + ' (-' + (player2_damage * critMultiplier) + 'HP)');
        return true;
    } else {
        return false;
    }
};

function hpCheck() { // Функция проверки текущего HP игроков. Если у одного из игроков HP меньше или равно 0 - игра заканчивается.
    if (p1_hp <= 0) {
        p1_hp = 0;
        updateHP();
        stopGame();
        combatLog(p1_name + ' погиб!');
    } else if (p2_hp <= 0 ) {
        p2_hp = 0;
        updateHP();
        stopGame();
        combatLog(p2_name + ' погиб!');
    } else {
        return;
    }
}

function updateHP() { // Обновляет значения хп на актуальные 
    document.getElementById('player_1_hp').setAttribute('value', p1_hp);
    document.getElementById('player_1_hp').setAttribute('max', p1_max_hp);
    document.getElementById('player_2_hp').setAttribute('value', p2_hp);
    document.getElementById('player_2_hp').setAttribute('max', p2_max_hp);
}
function displayHP() { // Отрисовывает текущее хп игроков
    document.getElementById('p1_hp_display').innerText = p1_hp + ' HP';
    document.getElementById('p2_hp_display').innerText = p2_hp + ' HP';
};

function turns() { // Реализует механизм ходов по очереди. Если ходит игрок 1, у игрока 2 кнопки неактивны, и наоборот. После любого действия игрока, ход переходит к другому игроку.
    if (turn == 'Ход игрока 1') {
        document.getElementById('player_1_attack').disabled = false;
        document.getElementById('player_1_block').disabled = false;
        document.getElementById('player_2_attack').disabled = true;
        document.getElementById('player_2_block').disabled = true;
        turn = 'Ход игрока 2'
    } else {
        document.getElementById('player_2_attack').disabled = false;
        document.getElementById('player_2_block').disabled = false;
        document.getElementById('player_1_attack').disabled = true;
        document.getElementById('player_1_block').disabled = true;
        turn = 'Ход игрока 1'
    }
}

function stopGame() { // Остановка игры и отключение кнопок действий. Вызывается в случае победы одного из игроков.
    document.getElementById('player_2_attack').disabled = true;
    document.getElementById('player_2_block').disabled = true;
    document.getElementById('player_1_attack').disabled = true;
    document.getElementById('player_1_block').disabled = true;
}

function timeStamp() {
   let hours = new Date().getHours();
   let minutes = new Date().getMinutes();
   let seconds = new Date().getSeconds();
   let time = hours + ':' + minutes + ':' + seconds + ' : ' ;
   if (hours < 10) {hours = '0' + hours};
   if (minutes < 10) {minutes = '0' + minutes};
   if (seconds < 10) {seconds = '0' + seconds};
   return time;
}

function importantText(text) {
    let redText = document.createElement('span');
    redText.className = importantText;
    redText.innerText = text;
    return redText;
 }

function combatLog(message) {
    const time = document.createElement('span');
    const logText = document.createElement('div');
    time.textContent = timeStamp();
    time.className = 'combatLogTime';
    logText.className = 'combatLogMessage';
    logText.innerText = message;
    logText.prepend(time);
    log.appendChild(logText);
    ScrollToBottom();
}