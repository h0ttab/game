// Начальные настройки
const log = document.getElementById('combatLog');
let p1_name = 'Ричард Львиное Сердце';
let p2_name = 'Король Артур';
const p1_hp_bar = document.getElementById('player_1_hp');
const p2_hp_bar = document.getElementById('player_2_hp');
document.getElementById('player1__name').textContent = p1_name;
document.getElementById('player2__name').textContent = p2_name;
let p1_hp = document.getElementById('player_1_hp').value;
let p2_hp = document.getElementById('player_2_hp').value;
p1_hp_bar.setAttribute('low', p1_hp * 0.3)
p2_hp_bar.setAttribute('low', p2_hp * 0.3)
p1_hp_bar.setAttribute('high', p1_hp * 0.75)
p2_hp_bar.setAttribute('high', p2_hp * 0.75)
p1_hp_bar.setAttribute('optimum', p1_hp * 0.9)
p2_hp_bar.setAttribute('optimum', p2_hp * 0.9)
let turn = 'Ход игрока 1';

// Переменные, отвечающие за блокирование ударов (1 - блок, 0 - нет блока)
let player1_block = 0;
let player2_block = 0;

// Характеристики игрока 1 (по умолчанию)
let p1_max_hp = document.getElementById('player1_hp').value;
let player1_damage = document.getElementById('player1_damage').value;
let player1_crit = document.getElementById('player1_crit').value;
let player1_dodge = document.getElementById('player1_dodge').value;

// Характеристики игрока 2 (по умолчанию)
let p2_max_hp = document.getElementById('player2_hp').value;
let player2_damage = document.getElementById('player2_damage').value;
let player2_crit = document.getElementById('player2_crit').value;
let player2_dodge = document.getElementById('player2_dodge').value;

// Вызов начальных функций
p1_hp = p1_max_hp;
p2_hp = p2_max_hp;
turns();
update();

function updateStats(param) { // Функция, которая считывает значения характеристик игроков из соотв. полей ввода и применяет их.
    if (param == 'input') {
        p1_max_hp = document.getElementById('player1_hp').value;
        player1_damage = document.getElementById('player1_damage').value;
        player1_crit = document.getElementById('player1_crit').value;
        player1_dodge = document.getElementById('player1_dodge').value;

        p2_max_hp = document.getElementById('player2_hp').value;
        player2_damage = document.getElementById('player2_damage').value;
        player2_crit = document.getElementById('player2_crit').value;
        player2_dodge = document.getElementById('player2_dodge').value;
        update();
        resetGame();        
    } else if (param == 'default') { //Сброс характеристик на значения по умолчанию. Сначала устанавливаются значения полей ввода, а по ним уже назначаются переменные с характеристиками
        document.getElementById('player1_hp').value = 100;
        document.getElementById('player1_damage').value = 15;
        document.getElementById('player1_crit').value = 10;
        document.getElementById('player1_dodge').value = 10;
    
        document.getElementById('player2_hp').value = 100;
        document.getElementById('player2_damage').value = 15;
        document.getElementById('player2_crit').value = 10;
        document.getElementById('player2_dodge').value = 10;  
    } else {
        return false;
    }
}

function attack(player) { // Функция атаки. Принимает в виде агрумента имя атакующего игрока - player1 или player2.
    turns();
    update();
    if (p1_hp <= 0 || p2_hp <= 0) {
        return;
    } 
    
    if (player == 'player_1' && player2_block == 0) { // Игрок 1 атакует игрока 2, у игрока 2 нет блока.
        if (dodge('player 2') == true) { // Удалось ли игроку 2 уклониться (true - удалось, false - не удалось)
            return;
       } else if (crit('player 1') == true) { // Наносит ли игрок 1 критический урон 
            return;
       } else { // Если игрок 2 не уклонился, и игрок 1 не нанёс критический урон
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
       if (dodge('player 1') == true) { // Удалось ли игроку 1 уклониться (true - удалось, false - не удалось)
            return;
       } else if (crit('player 2') == true) { // Наносит ли игрок 2 критический урон 
            return;
       } else { // Если игрок 2 не уклонился, и игрок 1 не нанёс критический урон
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

function randomChance(percent) { // This function takes an integer argument (percent) and returns true with a (percent)% chance. 
    let chance = Math.floor(Math.random() * 99 + 1);
    if (chance <= percent) {
        return true;
    } else {
        return false;
    }
};

function dodge(player) { /* Функция расчёта вероятности уклонения. Функция принимает имя игрока в кач.-ве параметра, 
                            и на основе шанса уклонения этого игрока возвращает true, если он уклонился, и false если нет.*/
    if (player == 'player 1' && randomChance(player1_dodge) == true) {
        combatLog(p1_name + ' ловко уклоняется от атаки игрока ' + p2_name);
        return true
    } else if (player == 'player 2' && randomChance(player2_dodge) == true) {
        combatLog(p2_name + ' ловко уклоняется от атаки игрока ' + p1_name);
        return true
    } else {
        return false;
    }
};

function crit(player) { /* Функция принимает имя игрока в виде аргумента и наносит другому игроку урон * множ. крита, если случайное число от 1 до 100 попадает в диапазон крит шанса игрока.
                        Например, player1_crit = 10, означает, что игрок 1 наносит критический удар, если случайное число от 1 до 100 будет меньше или равно 10 (т.е. вероятность 10%). */
    let critMultiplier = 2; // Задаёт множитель урона от критического удара
    
    if (player == 'player 1' && randomChance(player1_crit) == true) {
        p2_hp -= Math.floor(player1_damage * critMultiplier);
        player2_block = 0;
        combatLog(p1_name + ' наносит критический урон игроку ' + p2_name + '.' + ' (-' + Math.floor(player1_damage * critMultiplier) + 'HP)');
        update();
        return true;
    } else if (player == 'player 2' && randomChance(player2_crit) == true) {
        p1_hp -= Math.floor(player2_damage * critMultiplier);
        player1_block = 0;
        combatLog(p2_name + ' наносит критический урон игроку ' + p1_name + '.' + ' (-' + Math.floor(player2_damage * critMultiplier) + 'HP)');
        update();
        return true;
    } else {
        return false;
    }
};

function update() { // Функция обновляет отображение полоски HP в соотв. с переменными, проверяет не победил ли кто-то из игроков, и выводит числовое значение HP рядом с полоской.
    updateHP();
    hpCheck();
    displayHP();
}

function resetGame() { // Сброс всех параметров на параметры по умолчанию
    player1_block = 0;
    player2_block = 0;
    p1_hp = p1_max_hp;
    p2_hp = p2_max_hp;
    player1_crit = player1_crit;
    player1_dodge = player1_dodge;
    player2_crit = player2_crit;
    player2_dodge = player2_dodge;
    turn = 'Ход игрока 1';
    turns();
    update();
    log.innerHTML = '';
}

function stopGame() { // Остановка игры и отключение кнопок действий. Вызывается в случае победы одного из игроков.
    document.getElementById('player_2_attack').disabled = true;
    document.getElementById('player_2_block').disabled = true;
    document.getElementById('player_1_attack').disabled = true;
    document.getElementById('player_1_block').disabled = true;
};


function hpCheck() { // Функция проверки текущего HP игроков. Если у одного из игроков HP меньше или равно 0 - игра заканчивается.
    if (p1_hp <= 0) {
        p1_hp = 0;
        updateHP();
        stopGame();
        combatLog(p1_name + ' погибает!');
    } else if (p2_hp <= 0 ) {
        p2_hp = 0;
        updateHP();
        stopGame();
        combatLog(p2_name + ' погибает!');
    } else {
        return;
    }
};

function updateHP() { // Обновляет значения хп на актуальные 
    document.getElementById('player_1_hp').setAttribute('value', p1_hp);
    document.getElementById('player_1_hp').setAttribute('max', p1_max_hp);
    document.getElementById('player_2_hp').setAttribute('value', p2_hp);
    document.getElementById('player_2_hp').setAttribute('max', p2_max_hp);
};

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
};

function timeStamp() { // Функция, которая возвращает время на момент её вызова (формат чч:мм:сс)
   let hours = new Date().getHours();
   let minutes = new Date().getMinutes();
   let seconds = new Date().getSeconds();
   if (hours < 10) {hours = '0' + hours};
   if (minutes < 10) {minutes = '0' + minutes};
   if (seconds < 10) {seconds = '0' + seconds};
   let time = hours + ':' + minutes + ':' + seconds + ' : ' ;
   return time;
};

function combatLog(message) { // Получает аргумент "message" и выводит его в журнал боя.
    const time = document.createElement('span');
    const logText = document.createElement('div');
    time.textContent = timeStamp();
    time.className = 'combatLogTime';
    logText.className = 'combatLogMessage';
    logText.innerText = message;
    logText.prepend(time);
    log.appendChild(logText);
    ScrollToBottom();
};


function ScrollToBottom() { // Функция позволяет держать журнал боя внизу, когда появляется скрол, т.е. чтобы показывать последние сообщение.
    const d = document.getElementById("combatLog");
    d.scrollTop = d.scrollHeight;
};

function importantText(text) {
    let redText = document.createElement('span');
    redText.className = importantText;
    redText.innerText = text;
    return redText;
};