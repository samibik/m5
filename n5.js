window.onload = function(){
    
    var seed = {
        x: (2147483648 * Math.random()) | 0,
        y: (2147483648 * Math.random()) | 0,
        z: (2147483648 * Math.random()) | 0,
        w: (2147483648 * Math.random()) | 0
    };
    function randomInt(xors) {
        var t = xors.x ^ (xors.x << 11);
        xors.x = xors.y;
        xors.y = xors.z;
        xors.z = xors.w;
        return xors.w = (xors.w^(xors.w>>>19))^(t^(t>>>8));
    }
    function random(xors) {
        return randomInt(xors) / 2147483648;
    }
    function shuffle(xs){
        var v = Object.assign({}, seed);
        var xs = xs.slice();
        var ys = [];
        while(0 < xs.length){
            var i = Math.abs(randomInt(v)) % xs.length;
            ys.push(xs[i]);
            xs.splice(i, 1);
        }
        return ys;
    }

    var colorTuples = shuffle([
        ["#3c2a05", "#3c2a05"], 
        
    ]);

    var topColors = shuffle(["#e30983"]);


    var topInput = document.querySelector("#top");
    var middleInput = document.querySelector("#middle");
    var bottomInput = document.querySelector("#bottom"); 

    var top = document.querySelector(".top");
    var middle = document.querySelector(".middle");
    var bottom = document.querySelector(".bottom");

    var foreground = document.getElementById("foreground");
    var image = document.getElementById("result");
	
    
    var container = document.querySelector(".container");
    var download = document.getElementById("download");

    var canvas = document.createElement("canvas");
    var g = canvas.getContext("2d");
	
	
	    
        


    function update(){
        setTimeout(function(){
            setText(topInput.value, middleInput.value, bottomInput.value);
        });
    }      
    middleInput.addEventListener("change", update);
    middleInput.addEventListener("keydown", update);    
    topInput.addEventListener("change", update);
    topInput.addEventListener("keydown", update);  
    bottomInput.addEventListener("change", update);
    bottomInput.addEventListener("keydown", update);        

    function setText(topText, middleText, bottomText){


        

        var topTextSize = 70;
        var topMiddlePadding = 30;
        var middleTextSize = 120;
        var middleBottomPadding = 20;        
        var bottomTextSize = 30;
        var margin = 60;
        var bottomTextLetterSpacing = 20;

        var topTextFont = `normal bold ${topTextSize}px/2 "Kitab"`;
        var middleTextFont = `normal 600 ${middleTextSize}px/2 Kufam`;
        var bottomTextFont = `normal bold  ${bottomTextSize}px/2 Kitab`;

        // resize canvas
		
        g.font = topTextFont;
        var topMetrics = g.measureText(topText);
        g.font = middleTextFont;
        var middleMetrics = g.measureText(middleText);  
        g.font = bottomTextFont;
        var bottomMetrics = g.measureText(bottomText);  
        canvas.width = margin + Math.max(
            topMetrics.width, 
            middleMetrics.width, 
            bottomMetrics.width + bottomTextLetterSpacing * (bottomText.length - 21)
        ) + margin;
        canvas.height = margin + topTextSize + topMiddlePadding + middleTextSize + middleBottomPadding + bottomTextSize + margin;

        // prepare canvas
        g.save();		
        g.clearRect(0, 0, canvas.width, canvas.height);
        g.textBaseline = "top";



        // stroke top text 
        function iterate(callback){
            var xors = Object.assign({}, seed);
            g.save();

            g.font = topTextFont;        
            g.fillStyle = "white";
            g.strokeStyle = "white";
            g.lineJoin = "round";    
            g.lineWidth = 10.0;   
            var metrics = g.measureText(topText);
            g.translate(margin + (canvas.width - metrics.width - margin * 2) * 0.5, margin);
            var x = 0;
            for(var i = 0; i < topText.length; i++){
                var c = topText.slice(i, i + 1);
                var rot = random(xors) * 0.2;
                var metrics = g.measureText(c);
                g.save();
                g.translate(metrics.width * 0.5, topTextSize * 0.5);
                g.rotate(rot);
                g.translate(-metrics.width * 0.5, -topTextSize * 0.5);
                callback(i, c);
                g.restore();
                g.translate(metrics.width, 0);
            }
            g.restore();
        }
        g.save();
        var xors = Object.assign({}, seed);
        


        var topColors = ["#e30983"];

  
        iterate(function(i, c){
            g.shadowColor = "transparent";

            g.strokeText(c, 0, 0);            
        });
        iterate(function(i, c){
            g.shadowColor = "transparent";
            g.shadowBlur = 10;
            g.fillStyle = topColors[i % topColors.length];
            g.fillText(c, 0, 0);
        });






        // centerize
        var metrics = g.measureText(middleText);
        g.translate((canvas.width - middleMetrics.width) * 0.5, margin + topTextSize + topMiddlePadding);

        // stroke outline
        g.font = middleTextFont;
        g.strokeStyle = "#ecaa21";		
        g.lineWidth = 5.0;
        g.shadowColor = "#000";
	    g.shadowOpacity = 10.0;
        g.shadowBlur = 3;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.strokeText(middleText, 0, 0);
		
		
        
        // fill charactors
        var x = 0;
        var xors = Object.assign({}, seed);
        for(var i = 0; i < middleText.length; i++){
            var c = middleText.slice(x,x =21);
			var rot = random(xors) * 5.2;

            // base color
            g.shadowColor = "rgba(0, 0, 0, 0.6)";
            g.shadowBlur = 10;
            g.fillStyle = colorTuples[i % colorTuples.length][0];
            g.fillText(c, 0, 0);

            g.save();

            // clip
            var rot = random(xors);
            g.beginPath();
            g.save();
            g.translate(middleTextSize * 0.5, middleTextSize * 0.5);            
            g.rotate(rot);
            g.translate(-middleTextSize * 0.5, -middleTextSize * 0.5);
            g.moveTo(-middleTextSize * 2, middleTextSize * 0.5);
            g.lineTo(middleTextSize * 2, middleTextSize * 0.5);
            g.lineTo(middleTextSize * 2, middleTextSize * 2);
            g.lineTo(-middleTextSize * 2, middleTextSize * 2);
            g.closePath();
            g.restore();
            g.clip();
			

            // upper color
            g.shadowColor = "none";
            g.shadowBlur = 0;
            g.fillStyle = colorTuples[i % colorTuples.length][1];
            g.fillText(c, 0, 0);

            g.restore();

            // go to next
            var metrics  = g.measureText(c);
            g.translate(metrics.width, 0);
			
        }
        
        g.restore();

        // bottom text
        g.save();
        g.strokeStyle = "#fff";
        g.fillStyle = "#e30983";
        g.lineWidth = 13.0;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.textBaseline = "top";
        g.font = bottomTextFont; 
       

        var metrics = g.measureText(bottomText);
        g.translate(
            (canvas.width - metrics.width - (bottomText.length - 1) * bottomTextLetterSpacing) * 0.5, 
            margin + topTextSize + topMiddlePadding + middleTextSize + middleBottomPadding
        );

        for(var i = 0; i < bottomText.length; i++){
            var c = bottomText.slice(i,i +1);
            g.shadowColor = "rgba(0, 0, 0, 0.3)";
            g.shadowBlur = 10;
            g.strokeText(c, 0, 0);
            g.shadowColor = "transparent";
            g.fillText(c, 0, 0);
            var metrics = g.measureText(c);
            g.translate(metrics.width + bottomTextLetterSpacing, 0);
        }

        g.restore();


        var url = canvas.toDataURL();
        image.src = url;
        download.href = url;

    }

    var _0xa5ca29=_0x4b5d;function _0x5888(){var _0x1a0c93=['1561985dgFEuG','عَشَاء','4TZitmq','7ClJSvg','8866328uWPHcH','3123189BWFrdy','998082dlqpaq','480160AcSoyc','6366123JnZzgS','454130CeWLQP','value','4spkzSi'];_0x5888=function(){return _0x1a0c93;};return _0x5888();}function _0x4b5d(_0x2a69c6,_0xae24b4){var _0x58884d=_0x5888();return _0x4b5d=function(_0x4b5d14,_0x4eb58a){_0x4b5d14=_0x4b5d14-0x136;var _0x19f558=_0x58884d[_0x4b5d14];return _0x19f558;},_0x4b5d(_0x2a69c6,_0xae24b4);}(function(_0x2e4971,_0x283166){var _0x427c57=_0x4b5d,_0x2b4d3a=_0x2e4971();while(!![]){try{var _0x331802=-parseInt(_0x427c57(0x13d))/0x1*(parseInt(_0x427c57(0x136))/0x2)+parseInt(_0x427c57(0x140))/0x3+-parseInt(_0x427c57(0x13a))/0x4*(-parseInt(_0x427c57(0x13b))/0x5)+-parseInt(_0x427c57(0x141))/0x6*(parseInt(_0x427c57(0x13e))/0x7)+parseInt(_0x427c57(0x13f))/0x8+-parseInt(_0x427c57(0x137))/0x9+parseInt(_0x427c57(0x138))/0xa;if(_0x331802===_0x283166)break;else _0x2b4d3a['push'](_0x2b4d3a['shift']());}catch(_0x3ad4ea){_0x2b4d3a['push'](_0x2b4d3a['shift']());}}}(_0x5888,0xa457e),topInput['value']='♡',middleInput[_0xa5ca29(0x139)]=_0xa5ca29(0x13c),bottomInput['value']='',update());

    download.addEventListener("click", function(){
        canvas.toBlob(function(blob) {
            saveAs(blob, middleInput.value + ".png");
        });
    });
};
