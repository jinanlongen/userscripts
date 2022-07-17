// ==UserScript==
// @name         Resolve Concerns (Onepizza)
// @namespace    http://jinanlongen.com/
// @version      0.1
// @description  Onepizza Concern Resolving
// @author       Rodin Luo
// @require      https://raw.githubusercontent.com/jinanlongen/userscripts/main/GM_stack.user.js
// @match        *://lc.onepizza.net/Operation/ConcernResolving*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @run-at  document-end
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(async function() {
        $("#input-component-whoami").parent().before(
            '<li class="nav-item dropdown mr-2 mt-1"><label class="fa-lg nav-link" id="status"></label></li>\
             <li class="nav-item mr-4"><input type="button" class="form-control" value="重置" id="reset"></li>\
             <li class="nav-item mr-4"><input type="button" class="form-control" value="批量处理" id="batchResolve"></li>')

        $("#reset").on("click", async function() {
            await reset();
            await reload();
        });

        $("#batchResolve").on("click", async function() {
            let nbrsStr = prompt("请输入需要顾虑处理的单号(多个单号使用空格分隔):");
            if (nbrsStr != null) {
                console.log("populated: " + nbrsStr);
                let nbrs = nbrsStr.trim().split(/\s+/);
                await save(nbrs);

                await reload();
                batchResolve();
            };
        });

        var reload = async function() {
            let nbrs = await load();
            updateStatus(nbrs);
        };

        var updateStatus = function(nbrs) {
            console.log("remaining: " + nbrs);
            if(null == nbrs) {
                $("#status").text('空闲');
            } else {
                $("#status").text(nbrs.length.toString());
            };
        };

        var func = (function () {
          var post = function (handler, parameters) {
              $.ajax({
                  dataType: "html",
                  url: "/Shared/ViewComponentRoute?handler=" + handler + "&" + parameters,
                  success: function (data) {
                      $("#ConcernResolve").html(data);
                      after_func_post_success(data);
                  },
                  error: function (result) {
                      LC.failMessage(JSON.parse(result.responseText).message);
                      $("#trackingNbr").focus();
                      $("#trackingNbr").select();
                  }
              });
          };

          var process = function (e)  {
              var parameters =
                  "matterID=" + $.initVal($(e).data("matterid"), 0)
                  + "&trackingNbr=" + $.initVal($(e).data("trackingnbr"), "")
                  + "&concernID=" + $.initVal($(e).data("concernid"), 0);
              post("ConcernResolve", parameters);
          };

          var after_func_post_success = function (data) {
            console.log(">>> [3. concernid]");
            var submitButton = $("#submit");
            if(submitButton.length > 0) {
                submitButton.click();
            }
          };

          return {
              process: process
          };
        })();

        var batchResolve = async function() {
            console.log("batchResolve ...");

            var concernResolveDivs = $("#ConcernResolve > div > div");
            if (concernResolveDivs.length > 0) {
                console.log(">>> [2. matterid]");
                concernResolveDivs.each(function () {
                    func.process($(this));
                });
            } else {
                console.log(">>> [1. trackingnbr]");
                popAndDo(function(nbr) {
                    $("#trackingNbr").val(nbr);
                    $("#form > div > div > button").click();
                });
            };
        };

        if(await locked()) {
            batchResolve();
        };
    });
})();
