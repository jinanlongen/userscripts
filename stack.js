(function() {
    'use strict';
    $("#input-component-whoami").parent().before('<li class="nav-item dropdown mr-2 mt-1"><label class="fa-lg nav-link" id="count">0</label></li>\
                                                 <li class="nav-item mr-4"><input type="button" class="form-control" value="load" id="load"></li>\
                                                 <li class="nav-item mr-4"><input type="button" class="form-control" value="populate" id="populate"></li>')

    $("#load").on("click", async function() {
        let nbrs = await load();
        countRemaining(nbrs.length);
    });

    $("#populate").on("click", async function() {
        let nbrsStr = prompt("请输入需要顾虑处理的单号, 多个单号使用逗号分隔.");
        console.log("populated: " + nbrsStr);

        await save(nbrsStr.split(','));

        do {
            let {nbr, remaining} = await pop();
            countRemainings(remaining + 1);
            await processNbr(nbr);
            if(remaining <= 0) {
                countRemainings(0);
                break;
            }
        } while(true);
    });

    var countRemainings = function(count) {
        console.log("remaining: " + count);
        $("#count").text(count.toString());
    };

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    var processNbr = async function(nbr) {
        console.log(">>> Process nbr: " + nbr + " ...");
        await delay(1000);
        console.log(">>> Process nbr: " + nbr + " ... done");
    };

    var pop = async function() {
        return load().then(nbrs => {
            let nbr = nbrs.shift();
            return {nbr, nbrs};
        }).then(({nbr, nbrs}) => {
            save(nbrs);
            return {nbr, nbrs};
        }).then(({nbr, nbrs}) => {
            let remaining = nbrs.length;
            return {nbr, remaining};
        });
    };

    var save = async function(nbrs) {
        var nbrsStr = "";
        if ((nbrs !== null) && (Array.isArray(nbrs))) {
            nbrsStr = nbrs.join(',');
        };
        return GM.setValue('nbrs', nbrsStr);
    };

    var load = async function() {
        return GM.getValue('nbrs', "").then(nbrsStr => nbrsStr.split(','));
    };

})();
