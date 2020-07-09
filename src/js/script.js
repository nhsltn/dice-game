document.addEventListener('DOMContentLoaded', function () {

	// SIDEBAR NAVIGATION
	const elems = document.querySelectorAll('.sidenav');
	const instances = M.Sidenav.init(elems, {});
	loadNav();

	function loadNav() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4) {
				if (this.status != 200) return;

				// Muat daftar tautan menu
				document.querySelectorAll(".topnav, .sidenav")
					.forEach(function (elm) {
						elm.innerHTML = xhttp.responseText;
					});

				// Daftarkan event listener untuk setiap tautan menu
				document.querySelectorAll('.sidenav a, .topnav a')
					.forEach(function (elm) {
						elm.addEventListener('click', function (event) {
							// Tutup sidenav
							var sidenav = document.querySelector('.sidenav');
							M.Sidenav.getInstance(sidenav).close();

							// Muat konten halaman yang dipanggil
							page = event.target.getAttribute('href').substr(1);
							loadPage(page);
						});
					});
			}
		};
		xhttp.open("GET", 'nav.html', true);
		xhttp.send();
	}

	// Load page content
	let scores, roundScore, activePlayer, gamePlaying, lastDice;
	var page = window.location.hash.substr(1);

	if (page == '') page = 'home';
	loadPage(page);

	function init() {
		scores = [0, 0, 0];
		activePlayer = 1;
		roundScore = 0;
		gamePlaying = true;

		document.getElementById('dice-1').style.display = "none";
		document.getElementById('dice-2').style.display = 'none';
		document.getElementById('score-1').textContent = '0';
		document.getElementById('score-2').textContent = '0';
		document.getElementById('current-1').textContent = '0';
		document.getElementById('current-2').textContent = '0';
		document.getElementById('name-1').textContent = 'Player 1';
		document.getElementById('name-2').textContent = 'Player 2';
		document.querySelector('.player-1-panel').classList.remove('winner');
		document.querySelector('.player-2-panel').classList.remove('winner');
		document.querySelector('.player-1-panel').classList.remove('active');
		document.querySelector('.player-2-panel').classList.remove('active');
		document.querySelector('.player-1-panel').classList.add('active');
	}

	function nextPlayer() {
		//Next player
		activePlayer === 1 ? activePlayer = 2 : activePlayer = 1;
		roundScore = 0;

		document.getElementById('current-1').textContent = '0';
		document.getElementById('current-2').textContent = '0';

		document.querySelector('.player-1-panel').classList.toggle('active');
		document.querySelector('.player-2-panel').classList.toggle('active');

		document.getElementById('dice-1').style.display = 'none';
		document.getElementById('dice-2').style.display = 'none';
	}

	function loadPage(page) {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4) {
				const content = document.querySelector(".body-content");
				if (this.status == 200) {
					content.innerHTML = xhttp.responseText;
					init();
					document.querySelector('.btn-roll').addEventListener('click', function () {
						if (gamePlaying) {
							// 1. Random number
							const dice1 = Math.floor(Math.random() * 6) + 1;
							const dice2 = Math.floor(Math.random() * 6) + 1;

							//2. Display the result
							document.getElementById('dice-1').style.display = 'block';
							document.getElementById('dice-2').style.display = 'block';
							document.getElementById('dice-2').src = './img/dice-' + dice2 + '.jpg';
							document.getElementById('dice-1').src = './img/dice-' + dice1 + '.jpg';

							//3. Update the round score IF the rolled number was NOT a 1
							if (dice1 !== 1 && dice2 !== 1) {
								//Add score
								roundScore += dice1 + dice2;
								document.querySelector('#current-' + activePlayer).textContent = roundScore;
							} else if (dice1 === 1 && dice2 === 1) {
								//Player looses score
								scores[activePlayer] = 0;
								document.querySelector('#score-' + activePlayer).textContent = '0';
								nextPlayer();
							} else {
								//Next player
								nextPlayer();
							}

						}


					});

					document.querySelector('.btn-hold').addEventListener('click', function () {
						if (gamePlaying) {
							// Add CURRENT score to GLOBAL score
							scores[activePlayer] += roundScore;

							// Update the UI
							document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

							const winningScore = 100;
							// Check if player won the game
							if (scores[activePlayer] >= winningScore) {
								document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
								document.getElementById('dice-1').style.display = 'none';
								document.getElementById('dice-2').style.display = 'none';
								document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
								document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
								gamePlaying = false;
							} else {
								//Next player
								nextPlayer();
							}
						}
					});

					document.querySelector('.btn-new').addEventListener('click', init);



				} else if (this.status == 404) {
					content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
				} else {
					content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
				}
			}
		};
		xhttp.open("GET", 'pages/' + page + '.html', true);
		xhttp.send();
	}

});