function start(){
	$("#inicio").hide();

	var trilha = document.getElementById("myAudio");
	var audioExplosao = document.getElementById("audioExplosao");

	function executaTrilha(){ 
		trilha.play();
		trilha.volume = 0.2;		
	} 
	executaTrilha();
	
	function pauseTrilha(){ 
		trilha.pause();  
	}



	var jogo = {};
	var velocidade = 3;
	var podeAtirar = true;
	var pontos = 0;
	
	$("#gameplay").append("<div class='pontos' id='pontos'>"+pontos+"</div>");
	$("#gameplay").append("<div class='inimigo'></div>");
	$("#gameplay").append("<div class='player'></div>");
	$("#gameplay").append("<div class='npc'></div>");
	$("#gameplay").append("<div class='amigo'></div>");
	
	var TECLA = {
		W:87, 
		S:83, 
		A:65,
		D:68,
		SPACE:32
		}
		
	jogo.pressionou = [];
	
	$(document).keydown(function(e){
		jogo.pressionou[e.which] = true;
	});
	$(document).keyup(function(e){
		jogo.pressionou[e.which] = false;
	});
	
	jogo.timer = setInterval(loop,10);
	
	function movefundo(){
		esquerda = parseInt($(".fundoGame").css("background-position"));
		$(".fundoGame").css("background-position", esquerda -1);	
	}
	
	function movejogador(){
		if(jogo.pressionou[TECLA.W]){
			var topo = parseInt($(".player").css("top"));
			$(".player").css("top", topo -10);
			if(topo<=-150){
				$(".player").css("top", topo +10);
			}
		}
		if(jogo.pressionou[TECLA.S]){
			var topo = parseInt($(".player").css("top"));
			$(".player").css("top", topo +10);
			if(topo>=270){
				$(".player").css("top", topo -10);
			}
		}
		if(jogo.pressionou[TECLA.D]){
			var left = parseInt($(".player").css("left"));
			$(".player").css("left", left +10);
			if(left>=820){
				$(".player").css("left", left -10);
			}
		}
		if(jogo.pressionou[TECLA.A]){
			var left = parseInt($(".player").css("left"));
			$(".player").css("left", left -10);
			if(left<=0){
				$(".player").css("left", left +10);
			}
		}
		if(jogo.pressionou[TECLA.SPACE]){
			disparo();
		}
	}
	
	function moveinimigo(){
		posicaoX = parseInt($(".inimigo").css("left"));
		$(".inimigo").css("left",posicaoX-velocidade);
		if(posicaoX<=0){
			var posicaoY = parseInt(Math.random()*300);
			$(".inimigo").css("left",800);
			$(".inimigo").css("top",posicaoY);
		}
	}
	
	function movenpc(){
		posicaoX = parseInt($(".npc").css("left"));
		$(".npc").css("left",posicaoX-(velocidade/2));
		if(posicaoX<=0){
			$(".npc").css("left",800);
		}
	}
	
	function disparo(){
		if(podeAtirar==true){
			podeAtirar=false;
			topo = parseInt($(".player").css("top"));
			posicaoX = parseInt($(".player").css("left"));
			tiroX = posicaoX + 120;
			topoTiro = topo -200;
			$(".fundoGame").append("<div class='disparo'></div>");
			$(".disparo").css("top",topoTiro);
			$(".disparo").css("left",tiroX);
			var tempoDisparo=window.setInterval(executaDisparo,30);
		}
		function executaDisparo(){
			posicaoX = parseInt($(".disparo").css("left"));
			$(".disparo").css("left",posicaoX+15);
			if(posicaoX>910){
				window.clearInterval(tempoDisparo);
				tempoDisparo=null;
				$(".disparo").remove();
				podeAtirar=true;
			}
		}
		
	}
	
	function colisao(){
		var colisao1 = ($(".player").collision($(".inimigo")));
		var colisao2 = ($(".disparo").collision($(".inimigo")));
		var colisao3 = ($(".player").collision($(".npc")));
		var colisao4 = ($(".disparo").collision($(".npc")));
		var colisao5 = ($(".amigo").collision($(".npc")));
		var colisao6 = ($(".player").collision($(".amigo")));
		
		if(colisao1.length>0){
			inimigoX = parseInt($(".inimigo").css("left"));
			inimigoY = parseInt($(".inimigo").css("top"));
			explosao(inimigoX, inimigoY);
			
			playerX = parseInt($(".player").css("left"));
			playerY = parseInt($(".player").css("top"));
			explosaoPlayer(playerX, playerY);
			
			posicaoY = parseInt(Math.random()*300);
			$(".inimigo").css("left", 700);
			$(".inimigo").css("top", posicaoY);
			
			$(".player").css("left", 100);
			$(".player").css("top", -50);
		}
		if(colisao2.length>0){
			inimigoX = parseInt($(".inimigo").css("left"));
			inimigoY = parseInt($(".inimigo").css("top"));
			explosao(inimigoX, inimigoY);
			
			posicaoY = parseInt(Math.random()*300);
			$(".inimigo").css("left", 700);
			$(".inimigo").css("top", posicaoY);
			pontos+=5;
			document.getElementById("pontos").innerHTML = String(pontos);
		}
		if(colisao3.length>0){
			npcX = parseInt($(".npc").css("left"));
			npcY = parseInt($(".npc").css("top"));
			explosao2(npcX, npcY);
			
			playerX = parseInt($(".player").css("left"));
			playerY = parseInt($(".player").css("top"));
			explosaoPlayer(playerX, playerY);
			
			$(".npc").css("left", 700);
			$(".npc").css("top",130);
			
			$(".player").css("left", 100);
			$(".player").css("top", -50);
			
			gameover();
		}
		if(colisao4.length>0){
			npcX = parseInt($(".npc").css("left"));
			npcY = parseInt($(".npc").css("top"));
			explosao2(npcX, npcY);
			
			$(".npc").css("left", 700);
			$(".npc").css("top",130);
		}
		if(colisao5.length>0){
			amigoX = parseInt($(".amigo").css("left"));
			amigoY = parseInt($(".amigo").css("top"));
			explosaoAmigo(amigoX,amigoY);
			$(".amigo").hide();		
			var tempoRecriar=window.setInterval(recriar,6000);
		}
		if(colisao6.length>0){
			$(".amigo").hide();		
			var tempoRecriar=window.setInterval(recriar,4000);
			pontos+=10;
			document.getElementById("pontos").innerHTML = String(pontos);
		}
		function recriar(){
			$(".amigo").show();
			window.clearInterval(tempoRecriar);
			tempoRecriar=null;
		}
	}
	function explosao(inimigoX, inimigoY){
		$(".fundoGame").append("<div class='explosao'></div>");
		$(".explosao").css("background-image", "url(image/explosao.png)");
		var div = $(".explosao");
		div.css("top",inimigoY);
		div.css("left",inimigoX+150);
		div.animate({width:200, opacity:0}, "slow");
		var tempoExplosao=window.setInterval(removeExplosao, 1000);
		
		function removeExplosao(){
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao=null;
		}
	}
	function explosao2(npcX, npcY){
		$(".fundoGame").append("<div class='explosao2'></div>");
		$(".explosao2").css("background-image", "url(image/explosao.png)");
		var div2 = $(".explosao2");
		div2.css("top",npcY+230);
		div2.css("left",npcX+150);
		div2.animate({width:200, opacity:0}, "slow");
		var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
		
		function removeExplosao2(){
			div2.remove();
			window.clearInterval(tempoExplosao2);
			tempoExplosao2=null;
		}
	}
	function explosaoPlayer(playerX, playerY){
		$(".fundoGame").append("<div class='explosaoPlayer'></div>");
		$(".explosaoPlayer").css("background-image", "url(image/explosao-player.png)");
		var div3 = $(".explosaoPlayer");
		div3.css("top",playerY+70);
		div3.css("left",playerX+100);
		div3.animate({width:200, opacity:0}, "slow");
		var tempoExplosaoPlayer=window.setInterval(removeExplosaoPlayer, 1000);
		
		function removeExplosaoPlayer(){
			div3.remove();
			window.clearInterval(tempoExplosaoPlayer);
			tempoExplosaoPlayer=null;
		}
	}
	function explosaoAmigo(amigoX,amigoY){
		$(".fundoGame").append("<div class='explosaoAmigo'></div>");
		$(".explosaoAmigo").css("background-image", "url(image/water.png)");
		var divAmigo = $(".explosaoAmigo");
		divAmigo.css("top",amigoY+260);
		divAmigo.css("left",amigoX+100);
		divAmigo.animate({width:300, opacity:0}, "slow");
		var tempoExplosaoAmigo=window.setInterval(removeExplosaoAmigo, 1000);
		function removeExplosaoAmigo(){
			divAmigo.remove();
			window.clearInterval(tempoExplosaoAmigo);
			tempoExplosaoAmigo=null;
		}
	}
	function gameover(){
		window.clearInterval(jogo.timer);
		jogo.timer=null;
		pontos=0;
		$(".player").remove();
		$(".npc").remove();
		$(".inimigo").remove();
		$(".amigo").remove();
		$(".pontos").remove();
		$("#inicio").show();
	}
	function vitoria(){
		if(pontos>=30){
			window.clearInterval(jogo.timer);
			jogo.timer=null;
			$(".npc").remove();
			$(".inimigo").remove();
			$(".amigo").remove();
			$(".fundoGame").append("<div class='vitoria'></div>");
		}
	}
	
	function loop(){
		movefundo();
		movejogador();
		moveinimigo();
		movenpc();
		colisao();
		vitoria();
	}
}